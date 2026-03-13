import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../infrastructure/prisma.service";
import { RedisService } from "../infrastructure/redis.service";

// health 엔드포인트는 "앱만 켜졌는지"가 아니라
// DB와 Redis 같은 핵심 인프라까지 붙었는지 확인하기 위한 용도다.
@Controller("health")
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService
  ) {}

  @Get()
  async getHealth() {
    // PostgreSQL에는 가장 가벼운 SELECT 1로 연결 가능 여부만 확인한다.
    await this.prismaService.getClient().$queryRaw`SELECT 1`;
    const redisPing = await this.redisService.ping();

    return {
      success: true,
      data: {
        status: "ok",
        environment: this.configService.getOrThrow<string>("app.nodeEnv"),
        database: "connected",
        redis: redisPing.toLowerCase() === "pong" ? "connected" : "unknown"
      }
    };
  }
}
