# Backend Role

## Purpose

이 문서는 pickup-service 백엔드 담당 범위와 작업 기준을 정의한다.
NestJS, Prisma, 세션 인증, 가격 계산, 상태 전이 로직의 책임을 정리한다.

## Scope

- `apps/api`
- `packages/db`
- OpenAPI 산출

---

## Main Responsibilities

- 인증 API 구현
- 사용자 API 구현
- 관리자 API 구현
- 세션 / 쿠키 인증 처리
- Prisma schema / migration / seed
- 가격 계산 로직
- 상태 전이와 상태 이력 기록
- 알림 생성 로직
- Swagger/OpenAPI 관리

---

## Key Rules

- DB 접근은 `apps/api`를 통해서만 이뤄진다.
- 상태 전이는 status model 문서를 기준으로 강제한다.
- 가격 계산은 DB 기반 `PricingPolicy`를 기준으로 수행한다.
- 인증은 세션 / httpOnly cookie / Redis session store 구조를 따른다.
- API 계약은 구현 후 Swagger/OpenAPI로 반영한다.

---

## Main Deliverables

- auth module
- pickup request module
- admin module
- notifications module
- pricing module
- Prisma schema and migrations

---

## Collaboration

- Frontend와 API 응답 shape를 일치시킨다.
- Planner와 정책 변경 사항이 있으면 모델/상태 영향 범위를 확인한다.
- Admin UX에서 필요한 목록/상세 데이터가 빠지지 않게 조율한다.
