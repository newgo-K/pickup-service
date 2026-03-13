import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Request, Response } from "express";
import { resolveErrorCode } from "./error-code.util";

type ErrorPayload = {
  code?: string;
  message?: string | string[];
  details?: unknown;
};

// Nest에서 던져진 예외를 문서에 맞는 공통 에러 응답 형태로 통일한다.
// 나중에 컨트롤러나 서비스가 늘어나도 에러 응답 모양이 흔들리지 않게 하는 역할이다.
@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const rawResponse = isHttpException ? exception.getResponse() : undefined;
    const payload = this.normalizePayload(status, rawResponse);

    response.status(status).json({
      success: false,
      error: {
        code: payload.code ?? resolveErrorCode(status),
        message: payload.message ?? "서버 내부 오류가 발생했습니다.",
        details: payload.details
      },
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }

  private normalizePayload(status: number, rawResponse: string | object | undefined): ErrorPayload {
    // Nest 기본 예외 응답은 string/object 등 여러 형태가 가능해서
    // 여기서 하나의 구조로 정리한다.
    if (typeof rawResponse === "string") {
      return {
        code: resolveErrorCode(status),
        message: rawResponse
      };
    }

    if (rawResponse && typeof rawResponse === "object") {
      const payload = rawResponse as ErrorPayload;

      return {
        code: payload.code ?? resolveErrorCode(status),
        message:
          Array.isArray(payload.message) && payload.message.length > 0
            ? payload.message[0]
            : payload.message,
        details: payload.details
      };
    }

    return {
      code: resolveErrorCode(status),
      message: "서버 내부 오류가 발생했습니다."
    };
  }
}
