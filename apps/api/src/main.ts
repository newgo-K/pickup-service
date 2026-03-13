import "reflect-metadata";
import { ConfigService } from "@nestjs/config";
import { createApp, initializeInfrastructure } from "./app.setup";

// main.ts는 백엔드 서버의 실제 시작점(entry point)이다.
// createApp으로 앱을 조립하고, 인프라 연결 후 listen까지 수행한다.
const bootstrap = async (): Promise<void> => {
  const app = await createApp();
  const configService = app.get(ConfigService);

  await initializeInfrastructure(app);

  const port = configService.getOrThrow<number>("app.port");
  await app.listen(port);
};

bootstrap();
