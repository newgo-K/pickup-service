# Implementation Checklist

## Purpose

이 문서는 pickup-service MVP를 실제 구현 단위로 쪼갠 작업 체크리스트다.
이후 작업은 이 문서를 기준으로 하나씩 진행하고 체크한다.

## Used By

- Frontend
- Backend
- Admin
- Planner

---

## 1. Working Rule

- 한 번에 전체를 구현하지 않는다.
- 기능 단위로 나눠서 하나씩 구현한다.
- 각 항목은 가능한 한 완료 조건이 명확해야 한다.
- API, UI, 상태 처리가 함께 묶이는 단위로 작업한다.
- 구현 전 설계 기준과 구현 후 테스트 기준을 모두 확인한다.

---

## 2. Phase -1. Pre-flight Check

- [x] 기술 스택 문서 최종 확인
- [x] 프로젝트 구조 문서 최종 확인
- [x] DB 스키마 초안 최종 확인
- [x] 구현 체크리스트 작업 순서 확인
- [x] API 명명 규칙과 응답 규칙 확인
- [x] OpenAPI 산출 전략 확인

### Done Condition

- 구현 전에 참조 문서 간 충돌이 없어야 한다.

---

## 3. Phase 0. Repository Setup

- [ ] 모노레포 루트 초기화
- [ ] `pnpm-workspace.yaml` 작성
- [ ] `turbo.json` 작성
- [ ] 루트 `package.json` workspace 스크립트 정리
- [ ] `apps/web` 생성
- [ ] `apps/admin` 생성
- [ ] `apps/api` 생성
- [ ] `packages/db` 생성
- [ ] `packages/ui` 생성
- [ ] `packages/api-client` 생성
- [ ] `packages/config-typescript` 생성
- [ ] `packages/config-eslint` 생성

### Done Condition

- 저장소가 `web / admin / api / packages` 구조로 실행 가능해야 한다.

---

## 4. Phase 1. Backend Foundation

- [ ] NestJS 기본 앱 설정
- [ ] 공통 env/config 구조 설정
- [ ] Prisma 초기 설정
- [ ] Supabase PostgreSQL 연결
- [ ] Redis 연결
- [ ] 세션 / 쿠키 기본 설정
- [ ] Swagger 설정
- [ ] OpenAPI 산출 경로 고정
- [ ] 공통 exception filter / validation pipe 설정

### Done Condition

- API 서버가 기동되고 DB, Redis, Swagger가 연결되어야 한다.

---

## 5. Phase 2. Database

- [ ] `users` 모델 작성
- [ ] `pricing_policies` 모델 작성
- [ ] `pickup_requests` 모델 작성
- [ ] `pickup_items` 모델 작성
- [ ] `notifications` 모델 작성
- [ ] `status_histories` 모델 작성
- [ ] `admin_memos` 모델 작성
- [ ] Prisma migration 작성
- [ ] seed 데이터 작성
- [ ] 가격정책 seed 입력
- [ ] 테스트용 관리자 계정 seed 입력

### Done Condition

- Prisma migration과 seed로 기본 데이터가 재현 가능해야 한다.

---

## 6. Phase 3. Auth

### Backend

- [ ] 회원가입 API
- [ ] 로그인 API
- [ ] 로그아웃 API
- [ ] 현재 사용자 조회 API
- [ ] role 기반 guard

### Frontend Web

- [ ] 회원가입 화면
- [ ] 로그인 화면
- [ ] 로그인 상태 유지 처리

### Frontend Admin

- [ ] 관리자 로그인 화면
- [ ] 관리자 보호 라우트 처리

### Done Condition

- 사용자와 관리자가 각각 로그인할 수 있고, 권한에 따라 접근이 나뉘어야 한다.

---

## 7. Phase 4. API Client

- [ ] NestJS Swagger 문서 산출
- [ ] OpenAPI 파일 정리
- [ ] Orval 설정 작성
- [ ] `packages/api-client` 생성 코드 연결
- [ ] web/admin에서 generated client 사용 시작

### Done Condition

- 프론트 앱에서 수동 타입 없이 generated client로 API 호출이 가능해야 한다.

---

## 8. Phase 5. User Pickup Flow

### Backend

- [ ] 픽업 요청 생성 API
- [ ] 가격 계산 로직
- [ ] mock 결제 API
- [ ] 요청 목록 API
- [ ] 요청 상세 API
- [ ] 요청 취소 API
- [ ] 상태 이력 기록

### Frontend Web

- [ ] 픽업 요청 멀티스텝 UI
- [ ] 주소 입력 UI
- [ ] 네이버지도 확인 UI
- [ ] 품목 입력 UI
- [ ] 요청 요약 UI
- [ ] 결제 페이지
- [ ] 요청 완료 페이지

### Done Condition

- 사용자가 요청 생성부터 mock 결제 완료까지 한 흐름으로 진행할 수 있어야 한다.

---

## 9. Phase 6. My Page

### Backend

- [ ] 내 요청 목록 API
- [ ] 내 요청 상세 API

### Frontend Web

- [ ] 마이페이지 요청 목록
- [ ] 요청 상세 화면
- [ ] 취소 버튼 / 취소 불가 상태 처리
- [ ] 결제 대기 요청 재진입 처리

### Done Condition

- 사용자가 자신의 요청 상태를 확인하고 취소 가능 상태를 처리할 수 있어야 한다.

---

## 10. Phase 7. Notifications

### Backend

- [ ] 알림 생성 로직
- [ ] 알림 목록 API
- [ ] 알림 읽음 처리 API

### Frontend Web

- [ ] 알림 목록 화면
- [ ] 읽음 처리
- [ ] 알림에서 요청 상세 이동

### Done Condition

- 상태 변경에 따라 알림이 생성되고, 사용자가 이를 확인할 수 있어야 한다.

---

## 11. Phase 8. Admin Request Management

### Backend

- [ ] 관리자 요청 목록 API
- [ ] 관리자 요청 상세 API
- [ ] 상태 변경 API
- [ ] 내부 메모 저장 API

### Frontend Admin

- [ ] 요청 목록 화면
- [ ] 요청 상세 화면
- [ ] 상태 변경 액션 UI
- [ ] 내부 메모 UI

### Done Condition

- 관리자가 요청을 조회하고 상태를 변경하며 메모를 남길 수 있어야 한다.

---

## 12. Phase 9. Testing And QA

### Backend

- [ ] Auth API 통합 테스트
- [ ] Pickup request API 통합 테스트
- [ ] Admin API 통합 테스트
- [ ] Pricing 계산 테스트
- [ ] 상태 전이 규칙 테스트

### Frontend

- [ ] web 핵심 페이지 렌더링 점검
- [ ] admin 핵심 페이지 렌더링 점검
- [ ] 폼 유효성 검증 점검
- [ ] 로그인 상태 유지 점검

### End-to-End

- [ ] 회원가입 -> 로그인 -> 요청 생성 -> mock 결제
- [ ] 마이페이지 상세 -> 취소 흐름
- [ ] 관리자 로그인 -> 상태 변경 -> 메모 저장

### Done Condition

- 핵심 사용자 플로우와 운영 플로우가 테스트 또는 수동 시나리오로 검증되어야 한다.

---

## 13. Phase 10. Deploy Readiness

- [ ] 로딩 상태 정리
- [ ] 빈 상태 정리
- [ ] 에러 상태 정리
- [ ] 권한 없음 상태 정리
- [ ] 모바일 UI 점검
- [ ] 관리자 테이블 사용성 점검
- [ ] 환경 변수 점검
- [ ] CORS / 쿠키 도메인 점검
- [ ] Swagger/OpenAPI 최종 점검
- [ ] seed / migration 재현 점검
- [ ] 배포 스크립트 또는 실행 명령 정리

### Done Condition

- 핵심 플로우에서 UX가 깨지지 않고, 배포 가능한 상태여야 한다.

---

## 14. Recommended Ping-Pong Order

이후 작업은 아래 순서로 하나씩 진행한다.

1. 모노레포 초기 세팅
2. Prisma/DB 세팅
3. 회원가입
4. 로그인
5. 로그아웃 / 현재 사용자 조회
6. web 로그인 UI
7. admin 로그인 UI
8. 픽업 요청 생성 API
9. 픽업 요청 폼 UI
10. mock 결제
11. 마이페이지 목록
12. 요청 상세 / 취소
13. 알림
14. 관리자 요청 목록
15. 관리자 상세 / 상태 변경 / 메모
16. 테스트 / QA
17. 배포 준비

---

## 15. Current Next Step

- [ ] 모노레포 초기 세팅 시작
