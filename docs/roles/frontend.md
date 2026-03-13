# Frontend Role

## Purpose

이 문서는 pickup-service 프론트엔드 담당 범위와 작업 기준을 정의한다.
사용자 앱과 관리자 앱 프론트 작업 시 어떤 책임을 가지는지 정리한다.

## Scope

- `apps/web`
- `apps/admin`
- `packages/ui`
- `packages/api-client` 사용 연동

---

## Main Responsibilities

- 사용자 앱 UI 구현
- 관리자 앱 UI 구현
- 페이지 라우팅
- 폼 UX와 유효성 검증
- API client 연결
- 상태별 화면 처리
- 모바일 우선 화면 품질 유지

---

## Key Rules

- API 타입은 수동 정의보다 generated client를 우선 사용한다.
- 비즈니스 로직은 프론트에 과도하게 넣지 않는다.
- 상태 처리 규칙은 문서화된 status model을 따른다.
- 사용자 앱과 관리자 앱은 UI 목적이 다르므로 같은 패턴을 강요하지 않는다.
- 공통 UI는 실제 중복이 발생한 뒤 `packages/ui`로 추출한다.

---

## Main Deliverables

- 로그인 / 회원가입 화면
- 픽업 요청 멀티스텝 UI
- 네이버지도 확인 UI
- 마이페이지 / 요청 상세 / 알림
- 관리자 로그인 / 요청 목록 / 요청 상세

---

## Collaboration

- Backend와 API 응답 shape를 맞춘다.
- Planner와 화면 우선순위를 맞춘다.
- Admin 요구사항 변경 시 관리자 UX 반영 범위를 확인한다.
