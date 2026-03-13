# Tech Stack

## Purpose

이 문서는 방문 수거 서비스 MVP 구현에 사용할 기술 스택의 기본 선택안을 정리한다.
세부 비교 문서가 아니라 실제 개발 시작을 위한 기준 문서로 사용한다.

## Used By

- Frontend
- Backend
- Admin
- Planner

---

## 1. Stack Direction

이번 프로젝트는 빠른 MVP 개발과 포트폴리오 시연 가능성을 기준으로 선택한다.

- 저장소는 모노레포로 구성한다.
- 사용자 앱과 관리자 앱은 웹 기반으로 구현한다.
- 모바일 우선 UI를 적용하되 배포와 개발 효율을 위해 웹 앱으로 시작한다.
- 프론트와 백엔드는 TypeScript 기반으로 통일한다.
- 지도, 결제, 인증 등 외부 연동은 추후 확장 가능하도록 구조를 나눈다.

### Monorepo Strategy

- `pnpm workspace`
- `Turborepo`

### Reason

- 사용자 앱, 관리자 앱, 공통 UI, DB, API client를 분리하면서도 한 저장소에서 관리하기 좋다.
- Orval 생성 코드와 OpenAPI 스펙을 공용 패키지로 운영하기 쉽다.
- 배포 단위는 나누되 타입과 스키마는 공유할 수 있다.

---

## 2. Frontend

### Framework

- Next.js
- React
- TypeScript
- App Router

### Reason

- 사용자 앱과 관리자 앱을 각각 별도 Next.js 앱으로 운영하기 좋다.
- 페이지 라우팅, 서버 컴포넌트, SEO 대응이 자연스럽다.
- 포트폴리오용으로도 구조를 설명하기 좋다.

### UI

- Tailwind CSS
- shadcn/ui
- class-variance-authority
- clsx
- tailwind-merge

### Reason

- 빠른 MVP UI 구현에 유리하다.
- 사용자 페이지와 관리자 페이지를 공통 컴포넌트로 일부 재사용하기 좋다.
- 컴포넌트 커스터마이징이 쉬워 디자인 조정이 가능하다.

### Frontend Utility Libraries

- TanStack Query
- React Hook Form
- Zod
- `@hookform/resolvers`
- `date-fns`
- `sonner`

### Optional Utility Libraries

- Zustand

### Reason

- 목록, 상세, 알림, 상태 변경 이후 재조회 흐름을 다루기 좋다.
- 멀티스텝 픽업 신청 폼과 검증 로직을 안정적으로 구성할 수 있다.
- 토스트, 날짜 포맷, UI 상태 관리를 위한 최소 실전 조합이다.
- 전역 상태는 우선 최소화하고, 멀티스텝 폼 공유 상태가 복잡해질 때만 Zustand를 도입한다.

### API Client Strategy

- OpenAPI
- Orval
- generated API client

### Reason

- 사용자 앱과 관리자 앱이 동일한 타입과 요청 함수를 공유할 수 있다.
- OpenAPI 스펙을 기준으로 client, 타입, TanStack Query 훅 생성까지 연결할 수 있다.
- 초기에 API가 안정되면 생산성이 커지고, 모노레포 구조와 잘 맞는다.

---

## 3. Backend

### Runtime / Server

- NestJS
- TypeScript
- Express adapter

### Core Backend Libraries

- `@nestjs/config`
- `@nestjs/swagger`
- `@nestjs/passport`
- `express-session`
- `cookie-parser`
- `redis`
- `connect-redis`
- `class-validator`
- `class-transformer`
- `passport`
- `passport-local`

### Reason

- 사용자 앱과 관리자 앱이 분리되므로 API 서버도 독립 앱으로 두는 편이 구조상 명확하다.
- 모듈 단위 구성, DTO, validation, guard, Swagger 문서화에 강점이 있다.
- 사용자 API와 관리자 API를 모듈과 권한 기준으로 분리하기 좋다.
- 세션 저장소는 메모리가 아니라 Redis 기반으로 운영하는 것을 기본으로 한다.

### API Style

- REST API
- JSON 응답

### Reason

- 현재 작성된 API 문서가 REST 구조에 맞춰져 있다.
- 관리자/사용자 요청 흐름을 단순하게 유지하기 좋다.

---

## 4. Database

### Database

- PostgreSQL

### ORM

- Prisma

### Database Hosting

- Supabase PostgreSQL

### Supabase Usage

- Supabase는 PostgreSQL 호스팅과 DB 관리 용도로 사용한다.
- 인증은 Supabase Auth가 아니라 NestJS 애플리케이션 레이어에서 직접 관리한다.

### Reason

- 관계형 데이터 모델이 명확하고 상태 이력, 알림, 관리자 메모 구조에 적합하다.
- Prisma는 스키마 관리, 마이그레이션, 시드 데이터 작성에 유리하다.
- TypeScript 기반 프로젝트와 궁합이 좋다.
- Supabase를 사용하면 초기 Postgres 운영 부담을 줄이면서 빠르게 시작할 수 있다.

---

## 5. Authentication

### Auth Strategy

- 세션 / 쿠키 기반 인증

### Auth Libraries

- `express-session`
- `cookie-parser`
- `redis`
- `connect-redis`
- `passport`
- `passport-local`

### Reason

- 실무 웹 서비스에서 많이 사용하는 인증 흐름에 가깝다.
- 브라우저 기반 사용자 앱과 관리자 앱에서 httpOnly cookie 사용이 자연스럽다.
- 사용자와 관리자를 같은 인증 구조 안에서 `role`로 분기하기 쉽다.
- 프론트 두 앱에서 공통 인증 처리와 보호 라우트 구성이 자연스럽다.

### Note

- 쿠키는 `httpOnly`, `secure`, `sameSite` 정책을 기준으로 설정한다.
- API 서버와 프론트 앱 간 통신은 CORS와 credential 설정을 함께 맞춘다.
- 운영 환경 세션 저장소는 Redis를 사용한다.

---

## 6. State / Data Fetching

### Client Data

- TanStack Query

### Form

- React Hook Form
- Zod
- `@hookform/resolvers`

### Reason

- 서버 데이터 캐싱, 목록/상세/알림 갱신 처리에 적합하다.
- 멀티스텝 픽업 신청 폼과 유효성 검증을 다루기 좋다.
- API 요청 DTO와 프론트 검증 규칙을 맞추기 쉽다.

### API Schema / Client

- OpenAPI spec file
- Orval code generation
- generated API client package

### Reason

- 현재 MD 기반 API 문서를 실제 구현용 스펙으로 승격할 수 있다.
- 프론트와 백엔드 계약을 타입으로 고정할 수 있다.
- NestJS Swagger 산출물을 기준으로 프론트 client를 자동 생성할 수 있다.
- Orval은 `openapi.yaml` 또는 `openapi.json`이 준비된 이후 도입한다.

---

## 7. Map / Address

### Map

- 네이버지도 JavaScript SDK
- 네이버 클라우드 플랫폼 지도 API

### Address Strategy

- 텍스트 주소 입력
- 네이버지도 표시로 위치 확인
- 서비스 가능 지역 검증

### Reason

- 국내 사용자 대상 서비스 맥락에 자연스럽다.
- MVP에서도 주소 확인 UX를 강화할 수 있다.
- 초기에는 좌표 기반 고도화보다 주소 입력 + 지도 확인에 집중한다.

---

## 8. Payment

### Phase 1

- Mock payment
- payment service 계층 분리

### Phase 2

- 토스페이먼츠 연동

### Reason

- 초기 MVP에서는 요청 생성과 상태 전이가 더 중요하다.
- 결제 UI와 결제 상태 처리 구조를 먼저 완성한 뒤 실제 PG를 붙이는 편이 안전하다.
- 토스페이먼츠 연동을 고려해 payment service 계층은 분리한다.

---

## 9. Admin

### Admin Strategy

- 모노레포 내 별도 Next.js 앱으로 운영한다.
- 사용자 앱과 관리자 앱은 각각 독립 배포 가능한 구조로 둔다.

### Reason

- 모노레포에서는 사용자 앱과 관리자 앱을 논리적으로 분리하는 편이 역할 구분이 명확하다.
- 공통 인증, 공통 UI, API client는 패키지로 공유하면 된다.
- 사용자 UX와 운영 UX의 라우트, 접근 권한, 레이아웃을 분리하기 좋다.

---

## 10. Deployment / Environment

### Hosting

- Vercel

### Admin Hosting

- Vercel

### API Hosting

- Railway, Render, Fly.io 등 NestJS 배포 가능한 Node 환경

### Database Hosting

- Supabase

### Environment Variables

- `DATABASE_URL`
- `SESSION_SECRET`
- `REDIS_URL`
- `NAVER_MAP_CLIENT_ID`
- `NAVER_MAP_CLIENT_SECRET`
- `TOSS_PAYMENTS_SECRET_KEY`
- `TOSS_PAYMENTS_CLIENT_KEY`

### Reason

- Next.js 배포 흐름과 잘 맞는다.
- MVP 데모 환경 구성 속도가 빠르다.
- web/admin은 정적 및 SSR 배포가 쉽고, api는 별도 Node 런타임으로 분리 운영하기 좋다.

---

## 11. Testing Direction

### Initial Scope

- NestJS 서비스 / 유효성 검증 단위 테스트
- 핵심 유효성 검증 단위 테스트
- 주요 API 통합 테스트
- 주요 사용자 플로우 수동 테스트

### Later Expansion

- Playwright E2E
- API integration test

### Reason

- 초기에는 빠른 구현과 시연 가능한 안정성을 우선한다.
- 이후 주요 시나리오가 고정되면 E2E를 추가한다.

---

## 12. Recommended Initial Dependencies

- `turbo`
- `pnpm`
- `next`
- `react`
- `typescript`
- `tailwindcss`
- `shadcn/ui`
- `@tanstack/react-query`
- `@tanstack/react-query-devtools`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `orval`
- `axios` 또는 공용 `fetch` requester
- `clsx`
- `tailwind-merge`
- `class-variance-authority`
- `date-fns`
- `sonner`
- `@nestjs/common`
- `@nestjs/core`
- `@nestjs/config`
- `@nestjs/swagger`
- `@nestjs/passport`
- `class-validator`
- `class-transformer`
- `express-session`
- `cookie-parser`
- `redis`
- `connect-redis`
- `passport`
- `passport-local`
- `prisma`
- `@prisma/client`
- `swagger-ui-express`
- `supertest`

---

## 13. Out of Scope for Initial Stack

- React Native 앱
- GraphQL
- Redis 기반 별도 캐시 레이어
- 실시간 소켓 처리
- 마이크로서비스 분리

---

## 14. Final Stack Summary

- Monorepo: pnpm workspace + Turborepo
- Frontend: Next.js + React + TypeScript + Tailwind CSS + shadcn/ui
- Frontend Utilities: TanStack Query + React Hook Form + Zod + date-fns + sonner
- API Client: OpenAPI + Orval
- Styling Helpers: clsx + tailwind-merge + class-variance-authority
- Backend: NestJS + REST API + Swagger
- Database: Supabase PostgreSQL + Prisma
- Session Store: Redis
- Auth: 세션 / httpOnly 쿠키 기반 인증
- Validation: React Hook Form + Zod + class-validator
- Data Fetching: TanStack Query
- Map: 네이버지도 JavaScript SDK + 네이버 클라우드 플랫폼 지도 API
- Payment: 1차 Mock, 2차 토스페이먼츠
- Admin: 모노레포 내 별도 Next.js 앱
