# Status Model

## Purpose

이 문서는 방문 수거 요청의 상태 구조와 전이 규칙을 정의한다.
사용자 화면, 알림, 데이터 모델, 운영 처리, 관리자 액션의 공통 기준으로 사용한다.

## Used By

- Planner
- Designer
- Frontend
- Backend
- Admin

---

## 1. Status Design Principles

- 하나의 요청은 항상 하나의 현재 상태만 가진다.
- 상태명은 사용자도 이해할 수 있어야 한다.
- 상태 전이는 정의된 순서 안에서만 일어난다.
- 종료 상태에 도달한 요청은 일반 상태로 되돌리지 않는다.
- 일부 상태 전이는 관리자만 수행할 수 있다.
- MVP에서도 `requested`와 `scheduled`는 명확히 분리한다.

---

## 2. MVP Status Set

### 2.1 `pending_payment`

- 표시명: 결제 대기
- 의미: 요청 정보는 입력되었지만 결제가 완료되지 않은 상태

### 2.2 `requested`

- 표시명: 접수 완료
- 의미: 결제가 완료되어 요청이 정상 접수된 상태
- 설명: 운영자가 아직 방문 일정을 확정하지 않은 상태

### 2.3 `scheduled`

- 표시명: 수거 예정
- 의미: 운영자가 방문 일정 확정 처리를 마친 상태

### 2.4 `in_progress`

- 표시명: 수거 진행 중
- 의미: 운영자가 수거 시작 처리한 상태

### 2.5 `completed`

- 표시명: 수거 완료
- 의미: 운영자가 수거 완료 처리한 종료 상태

### 2.6 `cancelled`

- 표시명: 취소 완료
- 의미: 사용자가 요청을 취소했거나 운영자가 취소 처리한 종료 상태

---

## 3. Primary Status Flow

기본 전이 흐름은 아래 순서를 따른다.

`pending_payment -> requested -> scheduled -> in_progress -> completed`

취소 가능 상태에서는 아래 흐름으로 종료될 수 있다.

`pending_payment -> cancelled`

`requested -> cancelled`

`scheduled -> cancelled`

---

## 4. Status Transition Rules

### 4.1 `pending_payment -> requested`

- Trigger: 결제 성공
- Actor: User
- Result: 요청이 최종 접수된다.

### 4.2 `pending_payment -> cancelled`

- Trigger: 직접 취소 또는 미결제 종료 처리
- Actor: User or Admin
- Result: 요청은 더 이상 진행되지 않는다.

### 4.3 `requested -> scheduled`

- Trigger: 일정 확정 처리
- Actor: Admin
- Result: 사용자에게 수거 예정 상태가 표시된다.

### 4.4 `requested -> cancelled`

- Trigger: 사용자 취소 또는 운영 취소
- Actor: User or Admin
- Result: 요청은 종료된다.

### 4.5 `scheduled -> in_progress`

- Trigger: 실제 방문 또는 수거 시작 처리
- Actor: Admin
- Result: 진행 중 상태로 전환된다.

### 4.6 `scheduled -> cancelled`

- Trigger: 취소 가능 시점 내 사용자 취소 또는 운영 취소
- Actor: User or Admin
- Result: 요청은 종료된다.

### 4.7 `in_progress -> completed`

- Trigger: 수거 작업 완료 처리
- Actor: Admin
- Result: 완료 상태가 된다.

---

## 5. Terminal Status Rules

### 5.1 `completed`

- 종료 상태다.
- 사용자 취소 불가 상태다.
- 일반 수정 액션을 제공하지 않는다.

### 5.2 `cancelled`

- 종료 상태다.
- 다시 활성 상태로 복구하지 않는다.
- 동일한 니즈가 있으면 새 요청을 생성해야 한다.

---

## 6. Cancellation Matrix

| Status | User Cancel Allowed | Admin Cancel Allowed | Reason |
| --- | --- | --- | --- |
| `pending_payment` | Yes | Yes | 아직 접수 확정 전 또는 미결제 종료 가능 |
| `requested` | Yes | Yes | 접수 후 일정 조정 또는 운영 취소 가능 |
| `scheduled` | Yes | Yes | MVP에서는 상태 기준으로 취소 허용 |
| `in_progress` | No | No | 실제 수거 진행 시작 |
| `completed` | No | No | 종료 상태 |
| `cancelled` | No | No | 이미 취소 완료 |

MVP에서는 취소 가능 여부를 방문 몇 시간 전 규칙이 아니라 상태 기준으로만 판단한다.

---

## 7. User-facing Labels and Meaning

| System Status | User Label | User Meaning |
| --- | --- | --- |
| `pending_payment` | 결제 대기 | 결제를 완료해야 접수가 확정됩니다 |
| `requested` | 접수 완료 | 요청이 정상 접수되었습니다 |
| `scheduled` | 수거 예정 | 예약된 일정에 맞춰 방문 예정입니다 |
| `in_progress` | 수거 진행 중 | 현재 수거가 진행 중입니다 |
| `completed` | 수거 완료 | 수거가 완료되었습니다 |
| `cancelled` | 취소 완료 | 요청이 취소되었습니다 |

---

## 8. Notification Mapping

| Status Change | Notify User |
| --- | --- |
| `pending_payment -> requested` | Yes |
| `requested -> scheduled` | Yes |
| `scheduled -> in_progress` | Yes |
| `in_progress -> completed` | Yes |
| `any cancellable status -> cancelled` | Yes |

결제 실패는 상태 전이 알림보다 에러 메시지 또는 재시도 안내를 우선한다.

---

## 9. Data Modeling Notes

- 요청 테이블에는 현재 상태를 저장하는 필드가 필요하다.
- 상태 변경 시각을 추적하려면 상태 이력 테이블 또는 타임스탬프 필드를 둘 수 있다.
- 상태 이력은 별도 테이블로 저장한다.
- 관리자 액션 주체를 기록하려면 상태 이력에 actor 정보를 저장해야 한다.
- 최소한 아래 시점은 기록 가능해야 한다.
- 요청 생성 시각
- 결제 완료 시각
- 일정 확정 시각
- 수거 시작 시각
- 수거 완료 시각
- 취소 시각

---

## 10. UI Rules by Status

### User App

- `pending_payment`: 결제하기 버튼, 취소 버튼 노출 가능
- `requested`: 접수 완료 배지, 취소 버튼 노출 가능
- `scheduled`: 방문 예정 일정 강조, 취소 가능 시 취소 버튼 노출
- `in_progress`: 진행 중 배지 노출, 취소 버튼 미노출
- `completed`: 완료 배지와 재신청 액션 노출 가능
- `cancelled`: 취소 완료 배지와 재신청 액션 노출 가능

### Admin App

- `requested`: 일정 확정 액션 노출
- `scheduled`: 수거 시작 액션과 취소 액션 노출
- `in_progress`: 수거 완료 액션 노출
- 종료 상태: 읽기 전용으로 표시

---

## 11. Remaining Open Decisions

- 미결제 요청 자동 만료 시간을 둘지
- 운영 취소와 사용자 취소를 같은 `cancelled`로 둘지, 세부 사유 표현을 어디까지 나눌지
