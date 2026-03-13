import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configuration } from "./config/configuration";
import { validationSchema } from "./config/validation.schema";
import { AppController } from "./app.controller";
import { HealthController } from "./health/health.controller";
import { PrismaService } from "./infrastructure/prisma.service";
import { RedisService } from "./infrastructure/redis.service";

// AppModule은 Nest 앱의 루트 컨테이너다.
// 어떤 설정 모듈, 컨트롤러, 서비스가 앱 전체에서 쓰이는지 여기서 묶는다.
@Module({
  imports: [
    ConfigModule.forRoot({
      // .env 값을 앱 전역에서 읽을 수 있게 만들고,
      // 시작 시점에 필요한 환경 변수를 검증한다.
      isGlobal: true,
      cache: true,
      envFilePath: [".env.local", ".env"],
      load: [configuration],
      validationSchema
    })
  ],
  controllers: [AppController, HealthController],
  providers: [PrismaService, RedisService]
})
export class AppModule {}
