# DB Schema Draft

## Purpose

이 문서는 MVP 기준 데이터 모델을 실제 DB 테이블, 컬럼, 제약조건 수준으로 내린 초안이다.
Prisma 스키마와 마이그레이션 작성 전 기준 문서로 사용한다.

## Used By

- Backend
- Planner
- Admin

---

## 1. Schema Principles

- DB는 PostgreSQL을 기준으로 설계한다.
- 업무 데이터는 Supabase PostgreSQL에 저장한다.
- 세션 저장소 Redis는 이 문서 범위에 포함하지 않는다.
- 모든 주요 테이블은 `created_at`, `updated_at` 기준 시각 컬럼을 가진다.
- PK는 prefix + cuid 기반 string ID를 사용한다.
- 금액은 원화 기준 `integer` 컬럼으로 저장한다.
- enum은 초기에는 PostgreSQL enum이 아니라 string column + application validation으로 관리한다.
- soft delete는 1차 MVP에서 도입하지 않는다.
- `pickup_time_slot`은 1차 MVP에서 string 컬럼으로 유지한다.

---

## 2. Tables

### 2.1 `users`

| Column | Type | Nullable | Constraints | Notes |
| --- | --- | --- | --- | --- |
| `id` | varchar(50) | No | PK | 예: `usr_xxx` |
| `email` | varchar(255) | No | unique | 로그인 ID |
| `password_hash` | varchar(255) | No |  | bcrypt hash |
| `name` | varchar(100) | No |  | 사용자 이름 |
| `phone` | varchar(30) | No |  | 연락처 |
| `default_address` | varchar(255) | Yes |  | 기본 주소 |
| `default_address_detail` | varchar(255) | Yes |  | 기본 상세 주소 |
| `role` | varchar(20) | No | index | `USER`, `ADMIN` |
| `created_at` | timestamptz | No | default now() |  |
| `updated_at` | timestamptz | No | default now() |  |

### Indexes

- unique index on `email`
- index on `role`

---

### 2.2 `pricing_policies`

| Column | Type | Nullable | Constraints | Notes |
| --- | --- | --- | --- | --- |
| `id` | varchar(50) | No | PK | 예: `price_xxx` |
| `category` | varchar(30) | No | unique | 품목 카테고리 |
| `base_price` | integer | No |  | 기본 가격 |
| `is_active` | boolean | No | default true | 활성 여부 |
| `created_at` | timestamptz | No | default now() |  |
| `updated_at` | timestamptz | No | default now() |  |

### Indexes

- unique index on `category`
- index on `is_active`

### Notes

- MVP에서는 카테고리별 활성 정책 1개만 유지한다.
- 가격정책 관리 UI는 없지만 DB 시드 데이터로 운영한다.

---

### 2.3 `pickup_requests`

| Column | Type | Nullable | Constraints | Notes |
| --- | --- | --- | --- | --- |
| `id` | varchar(50) | No | PK | 예: `req_xxx` |
| `user_id` | varchar(50) | No | FK -> `users.id` |  |
| `status` | varchar(30) | No | index | 현재 상태 |
| `pickup_date` | date | No | index | 방문 날짜 |
| `pickup_time_slot` | varchar(50) | No |  | 예: `09:00-12:00` |
| `address` | varchar(255) | No |  | 주소 |
| `address_detail` | varchar(255) | No |  | 상세 주소 |
| `phone` | varchar(30) | No |  | 요청 시점 연락처 |
| `access_note` | text | Yes |  | 공동현관 출입 방법 |
| `request_note` | text | Yes |  | 기사 참고사항 |
| `pricing_type` | varchar(30) | No |  | `CATEGORY_BASED` |
| `total_price` | integer | No |  | 최종 금액 |
| `payment_status` | varchar(30) | No | index | 결제 상태 |
| `payment_method` | varchar(30) | Yes |  | `MOCK`, `CARD` 등 |
| `paid_at` | timestamptz | Yes |  | 결제 완료 시각 |
| `scheduled_at` | timestamptz | Yes |  | 일정 확정 시각 |
| `started_at` | timestamptz | Yes |  | 수거 시작 시각 |
| `completed_at` | timestamptz | Yes |  | 수거 완료 시각 |
| `cancelled_at` | timestamptz | Yes |  | 취소 시각 |
| `cancel_reason` | text | Yes |  | 취소 사유 |
| `created_at` | timestamptz | No | default now() |  |
| `updated_at` | timestamptz | No | default now() |  |

### Indexes

- index on `user_id`
- index on `status`
- index on `payment_status`
- composite index on `user_id`, `created_at desc`
- composite index on `pickup_date`, `status`

---

### 2.4 `pickup_items`

| Column | Type | Nullable | Constraints | Notes |
| --- | --- | --- | --- | --- |
| `id` | varchar(50) | No | PK | 예: `item_xxx` |
| `pickup_request_id` | varchar(50) | No | FK -> `pickup_requests.id` |  |
| `category` | varchar(30) | No | index | 품목 카테고리 |
| `description` | text | No |  | 사용자 입력 설명 |
| `quantity_label` | varchar(100) | Yes |  | 대략 수량 |
| `created_at` | timestamptz | No | default now() |  |

### Indexes

- index on `pickup_request_id`
- index on `category`

---

### 2.5 `notifications`

| Column | Type | Nullable | Constraints | Notes |
| --- | --- | --- | --- | --- |
| `id` | varchar(50) | No | PK | 예: `noti_xxx` |
| `user_id` | varchar(50) | No | FK -> `users.id` |  |
| `pickup_request_id` | varchar(50) | Yes | FK -> `pickup_requests.id` | 관련 요청 |
| `type` | varchar(50) | No | index | 알림 타입 |
| `title` | varchar(255) | No |  | 알림 제목 |
| `message` | text | No |  | 알림 본문 |
| `is_read` | boolean | No | default false | 읽음 여부 |
| `read_at` | timestamptz | Yes |  | 읽은 시각 |
| `created_at` | timestamptz | No | default now() |  |

### Indexes

- index on `user_id`
- index on `pickup_request_id`
- composite index on `user_id`, `is_read`, `created_at desc`

---

### 2.6 `status_histories`

| Column | Type | Nullable | Constraints | Notes |
| --- | --- | --- | --- | --- |
| `id` | varchar(50) | No | PK | 예: `hist_xxx` |
| `pickup_request_id` | varchar(50) | No | FK -> `pickup_requests.id` |  |
| `from_status` | varchar(30) | Yes |  | 최초 생성 시 null |
| `to_status` | varchar(30) | No | index | 변경된 상태 |
| `actor_type` | varchar(20) | No |  | `USER`, `ADMIN`, `SYSTEM` |
| `actor_user_id` | varchar(50) | Yes | FK -> `users.id` |  |
| `reason` | text | Yes |  | 상태 변경 사유 |
| `created_at` | timestamptz | No | default now() |  |

### Indexes

- index on `pickup_request_id`
- index on `actor_user_id`
- composite index on `pickup_request_id`, `created_at asc`

---

### 2.7 `admin_memos`

| Column | Type | Nullable | Constraints | Notes |
| --- | --- | --- | --- | --- |
| `id` | varchar(50) | No | PK | 예: `memo_xxx` |
| `pickup_request_id` | varchar(50) | No | FK -> `pickup_requests.id` |  |
| `admin_user_id` | varchar(50) | No | FK -> `users.id` | 작성 관리자 |
| `content` | text | No |  | 내부 메모 |
| `created_at` | timestamptz | No | default now() |  |
| `updated_at` | timestamptz | No | default now() |  |

### Indexes

- index on `pickup_request_id`
- index on `admin_user_id`

---

## 3. Foreign Key Summary

- `pickup_requests.user_id -> users.id`
- `pickup_items.pickup_request_id -> pickup_requests.id`
- `notifications.user_id -> users.id`
- `notifications.pickup_request_id -> pickup_requests.id`
- `status_histories.pickup_request_id -> pickup_requests.id`
- `status_histories.actor_user_id -> users.id`
- `admin_memos.pickup_request_id -> pickup_requests.id`
- `admin_memos.admin_user_id -> users.id`

---

## 4. Enum Candidates

### `user_role`

- `USER`
- `ADMIN`

### `pickup_request_status`

- `PENDING_PAYMENT`
- `REQUESTED`
- `SCHEDULED`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

### `payment_status`

- `PENDING`
- `PAID`
- `FAILED`
- `CANCELLED`

### `payment_method`

- `MOCK`
- `CARD`
- `BANK_TRANSFER`

### `pickup_item_category`

- `CLOTHES`
- `SHOES`
- `BAG`
- `SMALL_LIVING`
- `SMALL_APPLIANCE`
- `ETC`

### `notification_type`

- `REQUEST_COMPLETED`
- `PAYMENT_COMPLETED`
- `SCHEDULE_CONFIRMED`
- `PICKUP_STARTED`
- `PICKUP_COMPLETED`
- `REQUEST_CANCELLED`

### `actor_type`

- `USER`
- `ADMIN`
- `SYSTEM`

---

## 5. Implementation Notes

- Prisma schema source of truth는 `packages/db`에 둔다.
- 초기 ID 생성은 prefix + cuid 전략을 사용한다.
- 예: `usr_xxx`, `req_xxx`, `item_xxx`, `noti_xxx`
- enum은 string column + application enum validation으로 관리한다.
- PostgreSQL enum은 초기 마이그레이션 복잡도를 높일 수 있으므로 1차 MVP에서는 사용하지 않는다.
- 금액은 원화 최소 단위 기준 `integer`로 관리한다.
- soft delete는 도입하지 않고, 종료 상태는 status 값으로 관리한다.
- `pickup_time_slot`은 별도 슬롯 테이블로 분리하지 않고 string 컬럼으로 관리한다.

---

## 6. Remaining Decisions

- 운영 단계에서 PostgreSQL enum으로 승격할지 여부
- 가격정책 이력 버전 테이블을 추가할지 여부
