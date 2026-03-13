import { promises as fs } from "node:fs";
import path from "node:path";
import {
  INestApplication,
  ValidationPipe
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { AppModule } from "./app.module";
import { GlobalHttpExceptionFilter } from "./common/http/http-exception.filter";
import { validationExceptionFactory } from "./common/validation/validation-exception.factory";
import { PrismaService } from "./infrastructure/prisma.service";
import { RedisService } from "./infrastructure/redis.service";

// Swagger 문서와 산출 파일 경로를 같이 다루기 위한 작은 묶음 타입이다.
type SwaggerArtifacts = {
  document: ReturnType<typeof SwaggerModule.createDocument>;
  path: string;
  outputPath: string;
};

const buildSwaggerArtifacts = (
  app: INestApplication,
  configService: ConfigService
): SwaggerArtifacts => {
  // Swagger는 "사람이 보는 문서 UI"와 "기계가 읽는 OpenAPI JSON"의 source of truth 역할을 한다.
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Pickup Service API")
    .setDescription("Pickup service MVP backend API")
    .setVersion("1.0.0")
    .addCookieAuth("pickup.sid")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = configService.getOrThrow<string>("app.swaggerPath");
  const openApiOutputPath = path.resolve(
    process.cwd(),
    configService.getOrThrow<string>("app.openApiOutputPath")
  );

  return {
    document,
    path: swaggerPath,
    outputPath: openApiOutputPath
  };
};

// createApp()은 Nest 앱 객체를 조립하는 단계다.
// 아직 listen 하지 않고, 미들웨어/파이프/필터/Swagger 같은 공통 설정만 붙인다.
export const createApp = async (): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule, {
    cors: false
  });
  const configService = app.get(ConfigService);
  const redisService = app.get(RedisService);

  const corsOrigins = configService.get<string[]>("app.corsOrigins") ?? [];
  if (corsOrigins.length > 0) {
    // web/admin 프론트가 쿠키 기반으로 API를 호출할 수 있게 CORS + credentials를 연다.
    app.enableCors({
      origin: corsOrigins,
      credentials: true
    });
  }

  app.use(cookieParser());
  app.use(
    session({
      // express-session은 "브라우저 쿠키 + 서버 세션 저장소" 구조다.
      // 여기서는 메모리 대신 Redis에 세션을 저장하도록 연결한다.
      store: new RedisStore({
        client: redisService.getClient()
      }),
      name: configService.getOrThrow<string>("session.name"),
      secret: configService.getOrThrow<string>("session.secret"),
      saveUninitialized: false,
      resave: false,
      rolling: true,
      cookie: {
        domain: configService.get<string>("session.domain"),
        httpOnly: configService.get<boolean>("session.httpOnly"),
        secure: configService.get<boolean>("session.secure"),
        sameSite: configService.getOrThrow<"lax" | "strict" | "none">("session.sameSite"),
        maxAge: configService.getOrThrow<number>("session.maxAgeMs")
      }
    })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      // DTO에 없는 필드는 버리고, 타입 변환도 함께 적용한다.
      // 즉 컨트롤러에 들어오기 전에 요청 데이터를 한 번 정리하는 단계다.
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: validationExceptionFactory
    })
  );
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  const apiPrefix = configService.getOrThrow<string>("app.apiPrefix");
  app.setGlobalPrefix(apiPrefix);

  // Swagger UI 경로와 OpenAPI JSON 산출 경로를 같은 설정 기준으로 맞춘다.
  const swaggerArtifacts = buildSwaggerArtifacts(app, configService);
  SwaggerModule.setup(swaggerArtifacts.path, app, swaggerArtifacts.document);

  return app;
};

// initializeInfrastructure()는 앱 공통 설정이 끝난 뒤
// 실제 외부 인프라(DB, Redis)에 연결하는 단계다.
export const initializeInfrastructure = async (app: INestApplication): Promise<void> => {
  const prismaService = app.get(PrismaService);
  const redisService = app.get(RedisService);

  await prismaService.connect();
  await redisService.connect();
};

// OpenAPI 파일 생성은 서버를 띄우지 않아도 되도록 별도 함수로 뺐다.
export const writeOpenApiDocument = async (app: INestApplication): Promise<string> => {
  const configService = app.get(ConfigService);
  const swaggerArtifacts = buildSwaggerArtifacts(app, configService);

  await fs.mkdir(path.dirname(swaggerArtifacts.outputPath), { recursive: true });
  await fs.writeFile(swaggerArtifacts.outputPath, JSON.stringify(swaggerArtifacts.document, null, 2));

  return swaggerArtifacts.outputPath;
};
