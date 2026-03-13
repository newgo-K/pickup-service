import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisClientType, createClient } from "redis";

// RedisService도 PrismaService와 같은 이유로 만든 인프라 래퍼다.
// 세션 저장소와 이후 캐시/큐 확장 시 같은 클라이언트를 재사용할 수 있게 한다.
@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.getOrThrow<string>("redis.url");

    this.client = createClient({ url: redisUrl });
    this.client.on("error", (error) => {
      this.logger.error(error instanceof Error ? error.message : String(error));
    });
  }

  getClient(): RedisClientType {
    return this.client;
  }

  async connect(): Promise<void> {
    // 중복 connect를 막기 위해 이미 열린 경우는 다시 연결하지 않는다.
    if (!this.client.isOpen) {
      await this.client.connect();
      this.logger.log("Redis connected");
    }
  }

  async ping(): Promise<string> {
    return this.client.ping();
  }

  async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }
}
