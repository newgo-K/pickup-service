# Page Requirements

## Purpose

이 문서는 MVP 범위에서 필요한 각 페이지의 목적, 핵심 요소, 입력값, 액션, 상태를 정의한다.
와이어프레임, UI 구현, API 연결의 직접 기준으로 사용한다.

## Used By

- Planner
- Designer
- Frontend
- Backend
- Admin

---

## 1. Page List for MVP

MVP 기준 주요 페이지는 아래와 같다.

### User Pages

- 랜딩 페이지
- 로그인 페이지
- 회원가입 페이지
- 픽업 요청 페이지
- 결제 페이지
- 요청 완료 페이지
- 마이페이지
- 요청 상세 페이지
- 알림 페이지
- 프로필 페이지
- 약관 / 개인정보 처리방침 페이지

### Admin Pages

- 관리자 로그인 페이지
- 관리자 요청 목록 페이지
- 관리자 요청 상세 페이지

---

## 2. Landing Page

### Goal

사용자에게 서비스 가치를 전달하고 픽업 신청 흐름으로 진입시킨다.

### Required Sections

- 서비스 한 줄 소개
- 핵심 가치 요약
- 수거 가능 품목 안내
- 서비스 이용 흐름 요약
- 주요 CTA

### Primary Actions

- `픽업 신청하기`
- `로그인`
- `서비스 이용 방법 보기`

### Notes

- 비로그인 사용자도 접근 가능해야 한다.
- 모바일에서 첫 화면 내 CTA 확인이 가능해야 한다.

---

## 3. Login Page

### Goal

기존 사용자가 인증 후 서비스 기능에 접근한다.

### Required Fields

- 이메일 또는 아이디
- 비밀번호

### Required Actions

- `로그인`
- `회원가입`
- `비밀번호 찾기`

### Validation

- 필수값 누락 시 제출 불가
- 인증 실패 시 오류 메시지 표시

### Success Result

- 로그인 성공 시 이전 목적 페이지 또는 픽업 요청 페이지로 이동

---

## 4. Sign Up Page

### Goal

신규 사용자가 계정을 생성한다.

### Required Fields

- 이름
- 이메일
- 비밀번호
- 비밀번호 확인
- 연락처
- 약관 동의

### Optional Fields

- 기본 주소

### Required Actions

- `회원가입 완료`
- `로그인으로 이동`

### Validation

- 비밀번호 확인 일치 여부 검사
- 이메일 형식 검사
- 연락처 형식 검사
- 필수 약관 미동의 시 제출 불가

### Success Result

- 가입 완료 후 픽업 요청 페이지 또는 로그인 후 리다이렉트 대상 페이지로 이동

---

## 5. Pickup Request Page

### Goal

사용자가 방문 수거 요청 정보를 입력한다.

### Form Strategy

- 픽업 요청 페이지는 멀티스텝 폼으로 구성한다.
- 지도 표시와 주소 확인을 별도 단계로 자연스럽게 포함한다.

### Recommended Steps

1. 방문 일정 선택
2. 주소 및 지도 확인
3. 연락처 입력
4. 품목 및 요청사항 입력
5. 최종 요약 확인

### Required Inputs

- 방문 날짜
- 방문 시간대
- 주소
- 상세 주소
- 연락처
- 수거 품목 카테고리
- 품목 설명 또는 메모

### Optional Inputs

- 공동현관 출입 방법
- 기사 참고사항
- 문 앞에 내놓는 시간 관련 자유 메모

### Required UI Elements

- 단계 표시 또는 진행 상태 표시
- 지도 또는 주소 확인 UI
- 입력 요약 영역 또는 검토 구간
- 다음 단계 버튼
- 취소 또는 뒤로 가기

### Validation

- 과거 날짜 선택 불가
- 마감 시간대 선택 불가
- 서비스 가능 지역 외 주소 입력 불가
- 지원 불가 품목 선택 시 진행 불가
- 필수 입력 누락 시 다음 단계 이동 불가

### Success Result

- 유효한 입력 완료 시 결제 페이지로 이동
- 이 시점 요청 상태는 `pending_payment`로 볼 수 있다.

---

## 6. Payment Page

### Goal

사용자가 결제를 완료해 요청을 최종 접수한다.

### Route Strategy

- 결제는 요청 입력 단계 내부가 아니라 별도 라우트로 분리한다.
- 추천 경로는 `/pickup/payment`다.

### Required Sections

- 요청 요약 정보
- 결제 금액
- 결제 수단 선택 UI 또는 모의 결제 UI
- 결제 안내 문구

### Required Actions

- `결제하기`
- `이전으로`
- 필요 시 `취소하기`

### Validation

- 결제 수단 미선택 시 결제 진행 불가
- 요청 정보 누락 시 결제 진행 불가

### Success Result

- 결제 성공 시 요청 완료 페이지로 이동
- 상태는 `requested`로 변경

### Failure Result

- 결제 실패 메시지 표시
- 재시도 액션 제공
- 요청은 `pending_payment` 상태 유지 가능

---

## 7. Request Complete Page

### Goal

사용자에게 요청 접수 완료를 명확히 안내한다.

### Required Information

- 접수 완료 메시지
- 현재 상태 표시
- 예약 날짜 및 시간
- 주소 요약
- 다음 단계 안내

### Required Actions

- `내 요청 보기`
- `홈으로`

### Notes

- 요청 완료 페이지는 별도 화면으로 유지한다.
- 완료 직후 사용자가 다음 행동을 쉽게 선택할 수 있어야 한다.

---

## 8. My Page

### Goal

사용자가 자신의 요청 목록과 계정 관련 기능에 접근한다.

### Required Sections

- 사용자 기본 정보 요약
- 요청 목록
- 진행 중 또는 최근 요청 강조 영역
- 알림 진입 링크
- 프로필 관리 진입 링크

### Request List Requirements

각 항목에는 최소한 아래 정보가 필요하다.

- 요청일
- 예약일
- 주요 품목
- 현재 상태
- 상세 보기 액션

### Empty State

- 요청이 없을 경우 첫 요청 유도 CTA 제공

---

## 9. Request Detail Page

### Goal

사용자가 특정 요청의 상세 내용과 상태를 확인한다.

### Required Information

- 현재 상태
- 예약 날짜 및 시간
- 주소
- 연락처
- 품목 정보
- 요청 메모
- 상태 이력 또는 상태 안내

### Conditional Actions

- 취소 가능 상태면 `취소하기`
- `결제 대기` 상태면 `결제 계속하기`
- 완료 또는 취소 상태면 `다시 신청하기` 제공 가능

### Validation / Guard Rules

- 본인 요청이 아니면 접근 불가
- 종료 상태에서는 수정 액션 미노출

---

## 10. Notifications Page

### Goal

사용자가 상태 변경 알림을 한 곳에서 확인한다.

### Required List Item Fields

- 알림 제목
- 알림 요약 내용
- 생성 시각
- 읽음 여부

### Required Actions

- 알림 클릭 시 요청 상세로 이동
- 읽음 처리

### Empty State

- 알림이 없을 경우 빈 상태 메시지 표시

---

## 11. Profile Page

### Goal

사용자가 자신의 기본 정보를 관리한다.

### Route Strategy

- 마이페이지와 프로필 페이지는 분리한다.
- 추천 경로는 `/mypage` 와 `/mypage/profile` 이다.

### Required Fields

- 이름
- 연락처
- 기본 주소

### Required Actions

- `수정하기`
- `저장하기`
- `로그아웃`
- 필요 시 `회원탈퇴`

### Validation

- 연락처 형식 검사
- 필수 정보 누락 시 저장 불가

---

## 12. Policy Pages

### Goal

서비스 이용에 필요한 기본 정책 정보를 제공한다.

### Required Pages

- 이용약관
- 개인정보 처리방침

### Notes

- 회원가입 페이지에서 접근 가능해야 한다.
- 푸터 등 공통 영역에서도 접근 가능하면 좋다.

---

## 13. Admin Login Page

### Goal

운영자가 관리자 기능에 로그인한다.

### Required Fields

- 관리자 이메일 또는 아이디
- 비밀번호

### Required Actions

- `로그인`

### Validation

- 필수값 누락 시 제출 불가
- 관리자 권한이 없으면 접근 불가

---

## 14. Admin Request List Page

### Goal

운영자가 전체 요청을 조회하고 처리 대상을 찾는다.

### Required Information

- 요청 번호 또는 식별값
- 사용자 이름 또는 연락처 일부
- 예약 날짜 및 시간
- 주요 품목
- 현재 상태

### Required Actions

- 요청 상세 보기
- 상태별 필터
- 검색

### Preferred Filters

- 전체
- 결제 대기
- 접수 완료
- 수거 예정
- 수거 진행 중
- 수거 완료
- 취소 완료

---

## 15. Admin Request Detail Page

### Goal

운영자가 요청 상세 내용을 보고 상태를 변경한다.

### Required Information

- 요청 기본 정보
- 사용자 정보
- 주소 및 일정
- 품목 정보
- 요청 메모
- 현재 상태
- 상태 변경 이력 또는 상태 시각

### Required Actions

- `수거 예정으로 변경`
- `수거 진행 중으로 변경`
- `수거 완료로 변경`
- `취소 처리`
- 내부 메모 저장

### Guard Rules

- 정의된 상태 전이만 허용
- 종료 상태에서는 읽기 중심 UI 제공
- 내부 메모는 사용자 화면에 노출되지 않음

---

## 16. Common UI Requirements

모든 주요 페이지는 아래 공통 상태를 고려해야 한다.

- 로딩 상태
- 에러 상태
- 빈 상태
- 모바일 레이아웃 대응
- 뒤로 가기 가능한 내비게이션

관리자 페이지는 데스크톱 우선으로 설계해도 된다.

---

## 17. Route Suggestions

| Page | Suggested Route |
| --- | --- |
| 랜딩 | `/` |
| 로그인 | `/login` |
| 회원가입 | `/signup` |
| 픽업 요청 | `/pickup/new` |
| 결제 | `/pickup/payment` |
| 요청 완료 | `/pickup/complete` |
| 마이페이지 | `/mypage` |
| 요청 상세 | `/mypage/requests/:requestId` |
| 알림 | `/notifications` |
| 프로필 | `/mypage/profile` |
| 이용약관 | `/terms` |
| 개인정보 처리방침 | `/privacy` |
| 관리자 로그인 | `/admin/login` |
| 관리자 요청 목록 | `/admin/requests` |
| 관리자 요청 상세 | `/admin/requests/:requestId` |

---

## 18. Remaining Open Decisions

- 관리자 목록 페이지에 어느 정도 검색/필터 상세 옵션을 넣을지
- 멀티스텝 단계 수를 4단계로 할지 5단계로 할지
