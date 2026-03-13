import { Controller, Get } from "@nestjs/common";

// 가장 단순한 기본 엔드포인트다.
// 서버가 최소한 살아 있는지 빠르게 확인할 때 쓴다.
@Controller()
export class AppController {
  @Get()
  getIndex() {
    return {
      success: true,
      data: {
        service: "pickup-service-api"
      },
      message: "API server is running."
    };
  }
}
