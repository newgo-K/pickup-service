import { HttpStatus } from "@nestjs/common";

// HTTP status를 우리 API 문서의 공통 error.code로 바꾸는 매핑 유틸이다.
export const resolveErrorCode = (status: number): string => {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return "VALIDATION_ERROR";
    case HttpStatus.UNAUTHORIZED:
      return "UNAUTHORIZED";
    case HttpStatus.FORBIDDEN:
      return "FORBIDDEN";
    case HttpStatus.NOT_FOUND:
      return "NOT_FOUND";
    case HttpStatus.CONFLICT:
      return "CONFLICT";
    default:
      return "INTERNAL_SERVER_ERROR";
  }
};
