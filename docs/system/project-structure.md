# Project Structure

## Purpose

이 문서는 pickup-service 모노레포의 디렉토리 구조와 각 앱/패키지의 책임 범위를 정의한다.
구현 시작 전에 폴더 경계와 공용 자산 위치를 고정하기 위한 문서다.

## Used By

- Frontend
- Backend
- Admin
- Planner

---

## 1. Structure Principles

- 저장소는 모노레포로 운영한다.
- 사용자 앱, 관리자 앱, API 서버는 각각 독립 앱으로 분리한다.
- 공용 UI, 타입, 설정, API client는 패키지로 공유한다.
- 앱 간 직접 참조를 최소화하고, 공용 로직은 `packages` 아래로 올린다.
- 구현 초기부터 배포 단위를 고려한 구조로 시작한다.

---

## 2. Top-level Directory Plan

```text
pickup-service/
  apps/
    web/         # frontend user app
    admin/       # frontend admin app
    api/         # backend api server
  packages/
    ui/
    api-client/
    db/
    config-eslint/
    config-typescript/
  docs/
    product/
    admin/
    system/
  package.json
  pnpm-workspace.yaml
  turbo.json
```

---

## 3. Layer View

프로젝트는 물리적으로는 `apps`와 `packages`로 나누지만, 책임 기준으로는 아래 3개 레이어로 읽는다.

### Frontend Layer

- `apps/web`
- `apps/admin`
- `packages/ui`
- `packages/api-client`

### Backend Layer

- `apps/api`

### Shared Layer

- `packages/db`
- `packages/config-eslint`
- `packages/config-typescript`

---

## 4. Apps

### 4.1 `apps/web`

사용자 서비스용 Next.js 앱이다.

### Responsibilities

- 랜딩 페이지
- 로그인 / 회원가입
- 픽업 요청 플로우
- 결제 페이지
- 요청 완료 페이지
- 마이페이지
- 요청 상세
- 알림
- 프로필
- 약관 / 개인정보 처리방침

### Notes

- 모바일 우선 UI를 적용한다.
- API 호출은 `packages/api-client`를 사용한다.
- 공통 UI는 `packages/ui`에서 가져온다.

---

### 4.2 `apps/admin`

운영 관리자용 Next.js 앱이다.

### Responsibilities

- 관리자 로그인
- 요청 목록
- 요청 상세
- 상태 변경
- 내부 메모 저장

### Notes

- 사용자 앱과 배포 단위를 분리한다.
- 운영 도구 성격이므로 사용성보다 정보 밀도와 처리 효율을 우선한다.
- API 호출은 `packages/api-client`를 사용한다.

---

### 4.3 `apps/api`

NestJS 기반 API 서버다.

### Responsibilities

- 인증
- 사용자 API
- 관리자 API
- 가격 계산
- 상태 전이 처리
- 알림 생성
- 세션 / 쿠키 인증 처리
- OpenAPI 문서 산출

### Notes

- DB 스키마와 Prisma Client는 `packages/db`를 통해 사용한다.
- 세션 저장소는 Redis를 사용한다.
- Swagger/OpenAPI 산출물을 프론트 공용 client 생성에 사용한다.

---

## 5. Packages

### 5.1 `packages/ui`

사용자 앱과 관리자 앱이 함께 쓰는 공통 UI 컴포넌트 패키지다.

### Included

- 버튼
- 입력 필드
- 모달
- 배지
- 테이블 기본 컴포넌트
- 폼 공통 컴포넌트
- 레이아웃 보조 컴포넌트

### Notes

- 사용자 전용 화면 조합 컴포넌트는 각 앱 내부에 둘 수 있다.
- 너무 이른 공통화는 피하고, 실제 중복이 생긴 뒤 추출한다.

---

### 5.2 `packages/api-client`

OpenAPI + Orval 기반 생성 API client 패키지다.

### Responsibilities

- 사용자 API client
- 관리자 API client
- 공통 요청 타입
- TanStack Query 연동 훅 또는 request 함수

### Notes

- source of truth는 `apps/api`의 OpenAPI 산출물이다.
- 수동 작성 타입보다 generated client를 우선한다.

---

### 5.3 `packages/db`

Prisma 스키마와 DB 접근 관련 공용 패키지다.

### Responsibilities

- Prisma schema
- Prisma migration
- Prisma client export
- seed script

### Notes

- DB 관련 코드는 앱별로 흩어놓지 않고 한 위치에서 관리한다.
- 실제 DB 접근은 `apps/api`만 수행하되, schema source of truth는 `packages/db`에 둔다.

---

### 5.4 `packages/config-eslint`

모노레포 공통 ESLint 설정 패키지다.

### Responsibilities

- Next.js 앱용 lint 규칙
- NestJS 서버용 lint 규칙
- TypeScript 공통 규칙

---

### 5.5 `packages/config-typescript`

모노레포 공통 TypeScript 설정 패키지다.

### Responsibilities

- base tsconfig
- Next.js 앱용 tsconfig 확장
- NestJS 서버용 tsconfig 확장

---

## 6. Suggested Internal Structure

### 6.1 `apps/web`

```text
apps/web/
  app/
  components/
  features/
  hooks/
  lib/
  styles/
  public/
```

### 6.2 `apps/admin`

```text
apps/admin/
  app/
  components/
  features/
  hooks/
  lib/
  styles/
```

### 6.3 `apps/api`

```text
apps/api/
  src/
    modules/
      auth/
      users/
      pickup-requests/
      notifications/
      admin/
      pricing/
    common/
    config/
  test/
```

---

## 7. Ownership Rules

- `apps/web`는 사용자 UX에만 책임을 가진다.
- `apps/admin`은 운영 UX에만 책임을 가진다.
- `apps/api`만 DB에 직접 접근한다.
- 프론트 앱은 DB 또는 Prisma에 직접 접근하지 않는다.
- 공통 타입은 임의로 중복 작성하지 않고 가능한 한 API client에서 가져온다.
- Prisma schema source of truth는 `packages/db`에 둔다.

---

## 8. OpenAPI / Client Flow

실행 흐름은 아래와 같이 둔다.

1. `apps/api`에서 Swagger/OpenAPI 산출
2. OpenAPI 파일을 기준으로 Orval 실행
3. 결과물을 `packages/api-client`에 생성
4. `apps/web`, `apps/admin`이 공통 client 사용

---

## 9. Environment Separation

앱별 환경 변수는 분리한다.

### Frontend

- `apps/web`
- `apps/admin`

### Backend

- `apps/api`

---

## 10. What Not to Do

- `apps/web` 안에 관리자 화면을 같이 넣지 않는다.
- 프론트 앱에서 API 타입을 수동으로 중복 정의하지 않는다.
- 공통 패키지를 초반부터 과도하게 세분화하지 않는다.
- 비즈니스 로직을 프론트 앱에 넣지 않는다.
- Prisma 스키마를 여러 앱에 흩어놓지 않는다.

---

## 11. Initial Creation Order

구조 생성은 아래 순서를 추천한다.

1. `apps/web`
2. `apps/admin`
3. `apps/api`
4. `packages/db`
5. `packages/config-typescript`
6. `packages/config-eslint`
7. `packages/ui`
8. `packages/api-client`

---

## 12. Final Structure Summary

- 프론트엔드는 `apps/web`, `apps/admin` 2개 앱으로 분리한다.
- 백엔드는 `apps/api` 단일 NestJS 서버로 분리한다.
- API 서버는 NestJS 단일 앱으로 운영한다.
- Prisma schema와 migration은 `packages/db`에서 관리한다.
- 공통 UI는 `packages/ui`에서 관리한다.
- API client는 `packages/api-client`에서 생성하고 공유한다.
- 설정 패키지는 `packages/config-*`로 묶는다.
