import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createPrismaClient, PrismaClient } from "@pickup-service/db";

// PrismaService는 "DB 연결 객체를 앱에서 공용으로 쓰게 해주는 래퍼"다.
// 나중에 각 도메인 서비스가 직접 PrismaClient를 new 하지 않도록 한 곳에 모아둔다.
@Injectable()
export class PrismaService {
  private readonly logger = new Logger(PrismaService.name);
  private readonly client: PrismaClient;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.getOrThrow<string>("database.url");
    this.client = createPrismaClient(databaseUrl);
  }

  getClient(): PrismaClient {
    return this.client;
  }

  async connect(): Promise<void> {
    // 서버 부팅 시 실제 DB 연결이 가능한지 바로 확인한다.
    await this.client.$connect();
    this.logger.log("Prisma connected");
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}
