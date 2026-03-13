import { BadRequestException, ValidationError } from "@nestjs/common";

// class-validator 에러는 중첩 구조라서 그대로 반환하면 프론트에서 쓰기 불편하다.
// 그래서 사람이 읽기 쉬운 property/messages 목록으로 평탄화한다.
const flattenConstraints = (error: ValidationError): string[] => {
  const messages = Object.values(error.constraints ?? {});
  const nested = (error.children ?? []).flatMap(flattenConstraints);

  return [...messages, ...nested];
};

// ValidationPipe가 검증 실패 시 이 factory를 호출해서
// 우리 문서 규칙에 맞는 VALIDATION_ERROR 응답을 만들게 된다.
export const validationExceptionFactory = (errors: ValidationError[]): BadRequestException => {
  const details = errors.map((error) => ({
    property: error.property,
    messages: flattenConstraints(error)
  }));

  return new BadRequestException({
    code: "VALIDATION_ERROR",
    message: "잘못된 요청입니다.",
    details
  });
};
