# Implementation Plan

## Purpose

이 문서는 기존 기획 문서를 실제 구현 작업 순서로 연결하기 위한 실행 계획서다.
MVP 범위, 기본 기술 결정, 개발 순서, 우선 구현 대상을 고정한다.

## Used By

- Frontend
- Backend
- Admin
- Planner

---

## 1. Reference Documents

구현은 아래 문서를 기준으로 진행한다.

- `docs/product/product-overview.md`
- `docs/product/user-flow.md`
- `docs/product/page-requirements.md`
- `docs/product/business-rules.md`
- `docs/product/status-model.md`
- `docs/system/data-model.md`
- `docs/system/api-spec.md`
- `docs/admin/admin-requirements.md`

---

## 2. MVP Implementation Goal

이번 구현 목표는 아래를 실제로 동작 가능한 MVP 골격으로 만드는 것이다.

- 사용자 인증
- 픽업 요청 생성
- 결제 모의 처리
- 네이버지도 기반 주소 확인 UI
- 요청 목록 / 상세 / 취소
- 알림 목록
- 관리자 로그인
- 관리자 요청 목록 / 상세 / 상태 변경
- 내부 메모 저장

이번 단계에서는 문서 정리보다 실제 화면, API, 데이터 구조를 우선한다.

---

## 3. Default Decisions for MVP

오픈 디시젼은 아래 기본안으로 닫고 구현을 시작한다.

### 3.1 Authentication

- MVP는 세션 / httpOnly 쿠키 기반 인증을 기본으로 한다.
- 사용자와 관리자는 같은 인증 구조를 사용하고 `role`로 권한을 구분한다.
- `web`, `admin`, `api` 3개 앱 구조에서 인증 전달은 cookie credential 기준으로 설계한다.
- 로그인 후 서버 세션을 생성하고 브라우저에는 인증 쿠키만 전달한다.
- 운영 기준 세션 저장소는 Redis로 둔다.

### 3.2 Payment

- 결제 도메인 구조는 추후 토스페이먼츠 연동이 가능하도록 설계한다.
- 1차 MVP에서는 `MOCK` 결제 방식만 우선 구현한다.
- 실제 토스페이먼츠 연동은 2차 작업으로 분리한다.

### 3.3 Pricing

- 가격 정책은 품목 카테고리 기준 합산 방식으로 계산한다.
- 가격 정책 데이터는 코드 상수가 아니라 DB 테이블 기준으로 관리한다.
- 1차 MVP에서는 어드민 UI 없이 시드 데이터와 DB 관리로 운영한다.
- 가격정책 전용 어드민 관리 UI는 후속 단계에서 추가한다.
- 데이터 구조는 추후 어드민에서 수정 가능한 형태로 확장 가능하게 둔다.

### 3.4 Pending Payment Expiration

- 자동 만료 배치 작업은 이번 MVP에서 구현하지 않는다.
- 대신 `pending_payment` 요청은 목록과 상세에서 분리 표시 가능하도록 둔다.

### 3.5 Cancellation Rule

- 취소 가능 여부는 상태 기준으로만 판단한다.
- 시간 기준 제한은 이번 MVP에서 제외한다.

### 3.6 Address Handling

- MVP에서도 텍스트 주소 입력과 네이버지도 표시를 함께 제공한다.
- 지도는 사용자가 입력한 주소를 확인하는 보조 UI로 사용한다.
- 핵심 저장값은 텍스트 주소와 상세 주소를 우선한다.
- 서비스 가능 지역은 코드 상수 또는 고정 목록으로 시작한다.

---

## 4. Suggested Build Order

구현은 아래 순서로 진행한다.

### Step 1. Project Foundation

- 프로젝트 구조 생성
- `web`, `admin`, `api` 3개 앱 구조 생성
- 공통 패키지 구조 생성
- 환경 변수 구조 정리
- 인증 / 권한 / API 공통 에러 처리 방식 고정
- CORS + credentials + cookie 정책 고정
- Redis 세션 저장소 연결
- OpenAPI 산출 위치 고정

### Step 2. Data Model and Enums

- `User`
- `PickupRequest`
- `PickupItem`
- `Notification`
- `StatusHistory`
- `AdminMemo`
- `PricingPolicy`

아래 enum을 우선 고정한다.

- `UserRole`
- `PickupRequestStatus`
- `PaymentStatus`
- `PaymentMethod`
- `PickupItemCategory`
- `NotificationType`
- `ActorType`

### Step 3. Authentication

- 세션 생성 / 만료 구조
- 회원가입
- 로그인
- 로그아웃
- 현재 사용자 조회
- 사용자 / 관리자 접근 제어
- role 기반 guard 적용

### Step 4. Pickup Request Core

- 픽업 요청 생성 API
- 가격 계산 로직
- `PricingPolicy` 조회 기반 금액 계산
- 주소 검색 / 지도 표시 연동 구조
- 결제 페이지용 mock payment 처리
- 요청 상세 / 목록 조회
- 요청 취소 처리
- 상태 이력 기록
- payment service 계층 분리

### Step 5. User Pages

- 랜딩
- 로그인
- 회원가입
- 픽업 요청 멀티스텝
- 주소 입력 + 네이버지도 확인 UI
- 결제
- 요청 완료
- 마이페이지
- 요청 상세
- 알림
- 프로필

### Step 6. Admin Pages

- 관리자 로그인
- 요청 목록
- 요청 상세
- 상태 변경 액션
- 내부 메모 저장
- 가격정책 관리 기능은 이번 단계에서 제외

### Step 7. Validation and UX States

- 로딩 상태
- 빈 상태
- 입력 오류 상태
- 결제 실패 상태
- 취소 불가 상태
- 권한 없음 상태

### Step 8. QA and Seed Data

- 테스트용 사용자 / 관리자 계정 준비
- 상태별 더미 데이터 준비
- 가격정책 시드 데이터 준비
- 주요 시나리오 수동 점검

---

## 5. App Scope for MVP

### Apps

- `apps/web`
- `apps/admin`
- `apps/api`

### User Routes

- `/`
- `/login`
- `/signup`
- `/pickup`
- `/pickup/payment`
- `/pickup/complete`
- `/mypage`
- `/mypage/requests/:requestId`
- `/notifications`
- `/profile`
- `/terms`
- `/privacy`

### Admin Routes

- `/admin/login`
- `/admin/requests`
- `/admin/requests/:requestId`

---

## 6. API Priority

가장 먼저 구현할 API는 아래 순서를 추천한다.

1. `POST /api/auth/signup`
2. `POST /api/auth/login`
3. `GET /api/auth/me`
4. `POST /api/pickup-requests`
5. `POST /api/pickup-requests/:requestId/pay`
6. `GET /api/pickup-requests`
7. `GET /api/pickup-requests/:requestId`
8. `POST /api/pickup-requests/:requestId/cancel`
9. 네이버지도 주소 확인 연동에 필요한 서버 API 또는 클라이언트 연동 구조
10. `GET /api/notifications`
11. `POST /api/admin/auth/login`
12. `GET /api/admin/pickup-requests`
13. `GET /api/admin/pickup-requests/:requestId`
14. `POST /api/admin/pickup-requests/:requestId/status`
15. `POST /api/admin/pickup-requests/:requestId/memos`
16. OpenAPI 스펙 파일 생성 및 Orval 연동

---

## 7. Page Priority

화면은 아래 우선순위로 구현한다.

1. 로그인 / 회원가입
2. 픽업 요청 페이지
3. 주소 입력 + 네이버지도 확인 UI
4. 결제 페이지
5. 요청 완료 페이지
6. 마이페이지 목록 / 상세
7. 관리자 로그인
8. 관리자 요청 목록 / 상세
9. 알림 / 프로필 / 정적 페이지

---

## 8. Definition of Done for MVP

아래 조건을 만족하면 MVP 1차 구현 완료로 본다.

- 사용자가 회원가입과 로그인을 할 수 있다.
- `web`, `admin`, `api` 3개 앱이 모노레포에서 함께 동작한다.
- 사용자가 픽업 요청을 생성하고 mock 결제를 완료할 수 있다.
- 사용자가 주소 입력 후 네이버지도에서 위치를 확인할 수 있다.
- 요청이 `pending_payment -> requested -> scheduled -> in_progress -> completed` 흐름으로 관리된다.
- 사용자가 요청 목록, 상세, 취소 기능을 사용할 수 있다.
- 관리자가 요청 목록과 상세를 보고 상태를 변경할 수 있다.
- 내부 메모를 저장할 수 있다.
- 상태 변경 시 알림 데이터가 생성된다.
- 가격 계산이 DB 기반 가격정책으로 동작한다.
- OpenAPI 스펙에서 프론트 API client를 생성할 수 있다.

---

## 9. Out of Scope for This Phase

- 실제 토스페이먼츠 연동
- 실시간 기사 배정
- 어드민 가격정책 관리 화면
- 지도 좌표 기반 고도화된 위치 저장 / 반경 계산
- 푸시 / SMS / 이메일 발송
- 통계 대시보드
- 쿠폰 / 포인트
- 정기 수거
- 고급 검색 / 고급 권한

---

## 10. Immediate Next Actions

이 문서 기준으로 다음 작업은 아래 중 하나로 바로 이어진다.

1. 프로젝트 디렉토리 구조 확정
2. DB 스키마 초안 작성
3. NestJS 앱 골격과 인증 구조 생성
4. 사용자 / 관리자 앱 골격 생성
