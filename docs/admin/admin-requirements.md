# Admin Requirements

## Purpose

이 문서는 MVP 범위에서 필요한 관리자 기능과 관리자 화면 요구사항을 정의한다.
운영자가 실제로 요청을 조회하고 상태를 처리할 수 있도록 최소 기능 범위를 고정한다.

## Used By

- Planner
- Designer
- Frontend
- Backend
- Admin

---

## 1. Admin Goals

- 운영자가 전체 요청을 한 곳에서 확인할 수 있어야 한다.
- 운영자가 요청 상태를 정의된 흐름에 따라 변경할 수 있어야 한다.
- 운영자가 예외 요청과 취소 요청을 처리할 수 있어야 한다.
- 운영자가 사용자 입력 정보를 보고 실제 수거 진행에 필요한 판단을 할 수 있어야 한다.

---

## 2. Admin Scope for MVP

### Included

- 관리자 로그인
- 요청 목록 조회
- 요청 상세 조회
- 상태 변경
- 취소 처리
- 내부 메모 확인 및 저장

### Excluded

- 관리자 대시보드 통계
- 기사 배정 시스템
- 기사 전용 계정 관리
- 지역 / 가격 정책 관리 화면
- CS 템플릿 관리
- 고급 권한 관리

---

## 3. Admin Roles

### MVP Role Strategy

- MVP에서는 단일 관리자 역할로 시작한다.
- 관리자 인증은 별도 테이블이 아니라 사용자 테이블의 `role` 기반으로 처리한다.
- 모든 운영 기능은 동일한 관리자 권한으로 처리한다.

### Future Expansion

- 운영 관리자
- CS 관리자
- 슈퍼 관리자

---

## 4. Admin Pages

### 4.1 Admin Login

- 관리자 계정으로 로그인할 수 있어야 한다.
- 일반 사용자 계정으로는 접근할 수 없어야 한다.

### 4.2 Admin Request List

- 전체 요청 목록을 최신순 기준으로 보여준다.
- 상태 필터와 검색 기능이 필요하다.
- 각 행에서 현재 상태와 예약 정보를 바로 파악할 수 있어야 한다.

### 4.3 Admin Request Detail

- 요청 상세 정보, 사용자 정보, 주소, 품목, 메모를 확인할 수 있어야 한다.
- 현재 상태 기준으로 가능한 다음 액션만 노출해야 한다.
- 내부 메모를 저장할 수 있어야 한다.

---

## 5. Admin Core Actions

### 5.1 Status Change

운영자는 아래 상태 전이만 수행할 수 있다.

- `requested -> scheduled`
- `scheduled -> in_progress`
- `in_progress -> completed`
- `pending_payment -> cancelled`
- `requested -> cancelled`
- `scheduled -> cancelled`

### 5.2 Cancellation Handling

- 운영 취소 시 취소 사유는 자유 텍스트로 남긴다.
- 취소 처리 후 사용자에게는 `취소 완료` 상태만 노출된다.

### 5.3 Internal Memo

- 내부 메모는 운영자만 볼 수 있어야 한다.
- 사용자 화면에는 절대 노출되지 않아야 한다.

---

## 6. Required Admin Data

관리자 요청 목록 또는 상세에서 아래 정보를 확인할 수 있어야 한다.

- 요청 ID
- 사용자 이름
- 연락처
- 주소
- 예약 날짜
- 예약 시간대
- 품목 카테고리
- 품목 설명
- 요청 메모
- 현재 상태
- 상태 변경 시각
- 내부 메모

---

## 7. Admin UX Rules

- 목록 화면에서 현재 처리해야 할 요청이 잘 보여야 한다.
- 상태 변경 버튼은 현재 상태 기준으로 가능한 액션만 보여야 한다.
- 종료 상태 요청은 읽기 전용으로 보는 경험이 자연스러워야 한다.
- 취소 처리와 완료 처리는 오작동 방지를 위해 확인 절차가 있어야 한다.

---

## 8. Admin Validation Rules

- 관리자 인증이 없으면 모든 관리자 API와 페이지 접근을 막아야 한다.
- 정의된 상태 전이 외 변경은 허용하지 않는다.
- 상태 변경 이력은 모든 전이를 기록해야 한다.
- 필수 정보가 없는 요청은 상태 변경 전에 경고를 줄 수 있다.
- 종료 상태 요청은 다시 활성화하지 않는다.

---

## 9. Suggested Routes

- `/admin/login`
- `/admin/requests`
- `/admin/requests/:requestId`

---

## 10. Data / API Notes

- 관리자 API는 사용자 API와 권한을 분리하는 것이 좋다.
- 상태 변경 API는 actor가 admin인지 기록할 수 있어야 한다.
- 내부 메모 필드는 사용자 응답 DTO에서 제외해야 한다.

---

## 11. Remaining Open Decisions

- 목록에서 최신순 외 보조 정렬이나 우선순위 정렬을 추가할지
- 취소 사유를 추후 선택형 + 텍스트 조합으로 확장할지
