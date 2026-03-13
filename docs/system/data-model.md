# Data Model

## Purpose

이 문서는 방문 수거 서비스 MVP의 핵심 데이터 모델을 정의한다.
사용자 앱, 관리자 앱, API, 데이터베이스 스키마 설계의 기준으로 사용한다.

## Used By

- Planner
- Frontend
- Backend
- Admin

---

## 1. Modeling Principles

- 사용자와 관리자는 같은 인증 기반을 쓰되 역할로 권한을 구분한다.
- 픽업 요청은 서비스의 중심 엔티티다.
- 상태 변경 이력은 별도로 추적 가능해야 한다.
- 사용자 노출 데이터와 관리자 전용 데이터는 분리해서 관리한다.
- MVP에서는 확장 가능한 구조를 유지하되 과한 정규화는 피한다.

---

## 2. Core Entities

MVP 핵심 엔티티는 아래와 같다.

- `User`
- `PickupRequest`
- `PickupItem`
- `Notification`
- `StatusHistory`
- `AdminMemo`
- `PricingPolicy`

필요에 따라 주소를 별도 엔티티로 분리할 수 있지만, MVP에서는 `PickupRequest`와 `User` 안에 포함해도 충분하다.

---

## 3. Entity Overview

### 3.1 `User`

사용자 및 관리자 계정을 나타낸다.

### 3.2 `PickupRequest`

방문 수거 요청의 본체다.
일정, 주소, 상태, 결제 정보, 사용자 소유 관계를 가진다.

### 3.3 `PickupItem`

하나의 픽업 요청에 포함된 개별 품목 또는 품목 그룹을 나타낸다.

### 3.4 `Notification`

요청 상태 변경 등으로 사용자에게 표시되는 알림이다.

### 3.5 `StatusHistory`

요청 상태 전이 이력을 저장한다.
누가 어떤 이유로 상태를 바꿨는지 추적할 수 있어야 한다.

### 3.6 `AdminMemo`

운영자가 요청에 남기는 내부 메모다.
사용자에게 노출되면 안 된다.

### 3.7 `PricingPolicy`

품목 카테고리별 기본 가격 정책을 관리한다.
초기 MVP에서는 어드민 UI 없이 시드 데이터와 DB 값으로 운영한다.

---

## 4. `User` Model

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | Yes | PK |
| `email` | string | Yes | unique |
| `passwordHash` | string | Yes | 비밀번호 해시 |
| `name` | string | Yes | 사용자 이름 |
| `phone` | string | Yes | 연락처 |
| `defaultAddress` | string | No | 기본 주소 |
| `defaultAddressDetail` | string | No | 기본 상세 주소 |
| `role` | enum | Yes | `USER` or `ADMIN` |
| `createdAt` | datetime | Yes | 생성 시각 |
| `updatedAt` | datetime | Yes | 수정 시각 |

### Notes

- MVP에서는 일반 사용자와 관리자를 같은 테이블에서 `role`로 구분하는 방식이 가장 단순하다.
- 나중에 권한 체계가 복잡해지면 관리자 전용 프로필이나 권한 테이블을 추가할 수 있다.

---

## 5. `PickupRequest` Model

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | Yes | PK |
| `userId` | string | Yes | FK -> `User.id` |
| `status` | enum | Yes | 현재 상태 |
| `pickupDate` | date | Yes | 방문 날짜 |
| `pickupTimeSlot` | string | Yes | 예: `09:00-12:00` |
| `address` | string | Yes | 주소 |
| `addressDetail` | string | Yes | 상세 주소 |
| `phone` | string | Yes | 요청 시점 연락처 |
| `accessNote` | string | No | 공동현관 출입 방법 |
| `requestNote` | string | No | 기사 참고사항 또는 문 앞 배치 관련 자유 메모 |
| `pricingType` | enum | Yes | `CATEGORY_BASED` |
| `totalPrice` | integer | Yes | 최종 결제 금액 |
| `paymentStatus` | enum | Yes | 결제 상태 |
| `paymentMethod` | enum | No | MVP에서도 저장 가능 |
| `paidAt` | datetime | No | 결제 완료 시각 |
| `scheduledAt` | datetime | No | 운영자가 일정 확정한 시각 |
| `startedAt` | datetime | No | 수거 시작 시각 |
| `completedAt` | datetime | No | 수거 완료 시각 |
| `cancelledAt` | datetime | No | 취소 시각 |
| `cancelReason` | string | No | 최종 취소 사유 |
| `createdAt` | datetime | Yes | 생성 시각 |
| `updatedAt` | datetime | Yes | 수정 시각 |

### Notes

- 주소는 MVP에서 `address` + `addressDetail` 구조로 유지한다.
- 주소와 연락처는 요청 시점 스냅샷으로 남겨야 한다.
- 사용자가 프로필을 바꿔도 과거 요청 정보는 유지되어야 한다.
- `status`와 `paymentStatus`는 분리하는 편이 이후 처리에 유리하다.
- `requested`와 `scheduled`는 DB에서도 분리 유지한다.
- 취소 사유는 `cancelReason` 하나로 저장하고, 취소 주체는 상태 이력의 actor 정보로 구분한다.

---

## 6. `PickupItem` Model

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | Yes | PK |
| `pickupRequestId` | string | Yes | FK -> `PickupRequest.id` |
| `category` | enum | Yes | 품목 카테고리 |
| `description` | string | Yes | 사용자 입력 설명 |
| `quantityLabel` | string | No | MVP용 대략적 수량 표현 |
| `createdAt` | datetime | Yes | 생성 시각 |

### Notes

- MVP에서는 정교한 수량 계산보다 설명 중심 구조로 둔다.
- 한 요청에 여러 품목이 들어갈 수 있으므로 `PickupRequest`와 1:N 관계다.
- `ETC` 카테고리는 자동 허용하고 설명 입력으로 보완한다.

---

## 7. `Notification` Model

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | Yes | PK |
| `userId` | string | Yes | FK -> `User.id` |
| `pickupRequestId` | string | No | 관련 요청 |
| `type` | enum | Yes | 알림 타입 |
| `title` | string | Yes | 알림 제목 |
| `message` | string | Yes | 알림 본문 |
| `isRead` | boolean | Yes | 읽음 여부 |
| `readAt` | datetime | No | 읽은 시각 |
| `createdAt` | datetime | Yes | 생성 시각 |

### Notes

- MVP에서는 앱 내 알림만 지원하므로 사용자별 목록 조회가 핵심이다.
- 특정 요청과 연결되는 알림은 `pickupRequestId`를 가진다.

---

## 8. `StatusHistory` Model

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | Yes | PK |
| `pickupRequestId` | string | Yes | FK -> `PickupRequest.id` |
| `fromStatus` | enum | No | 최초 생성 시 null 가능 |
| `toStatus` | enum | Yes | 변경된 상태 |
| `actorType` | enum | Yes | `USER`, `ADMIN`, `SYSTEM` |
| `actorUserId` | string | No | FK -> `User.id` |
| `reason` | string | No | 취소, 예외 처리 등 사유 |
| `createdAt` | datetime | Yes | 상태 변경 시각 |

### Notes

- 상태 전이 추적은 관리자 처리와 CS 대응에 중요하다.
- 상태 변경 이력은 모든 전이를 저장한다.
- 단순 timestamp 필드만 두는 것보다 `StatusHistory`를 별도 두는 편이 낫다.

---

## 9. `AdminMemo` Model

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | Yes | PK |
| `pickupRequestId` | string | Yes | FK -> `PickupRequest.id` |
| `adminUserId` | string | Yes | FK -> `User.id` |
| `content` | string | Yes | 내부 메모 내용 |
| `createdAt` | datetime | Yes | 생성 시각 |
| `updatedAt` | datetime | Yes | 수정 시각 |

### Notes

- 내부 메모는 사용자 API 응답에서 제외한다.
- `AdminMemo`는 요청 테이블 내부 필드가 아니라 별도 테이블로 유지한다.
- MVP에서는 메모 수정 이력을 따로 두지 않아도 된다.

---

## 10. Recommended Enums

### `UserRole`

- `USER`
- `ADMIN`

### `PickupRequestStatus`

- `PENDING_PAYMENT`
- `REQUESTED`
- `SCHEDULED`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

### `PaymentStatus`

- `PENDING`
- `PAID`
- `FAILED`
- `CANCELLED`

### `PaymentMethod`

- `CARD`
- `MOCK`
- 추후 확장 가능: `BANK_TRANSFER`

### `PickupItemCategory`

- `CLOTHES`
- `SHOES`
- `BAG`
- `SMALL_LIVING`
- `SMALL_APPLIANCE`
- `ETC`

### `NotificationType`

- `REQUEST_COMPLETED`
- `PAYMENT_COMPLETED`
- `SCHEDULE_CONFIRMED`
- `PICKUP_STARTED`
- `PICKUP_COMPLETED`
- `REQUEST_CANCELLED`

### `PricingType`

- `CATEGORY_BASED`

### `ActorType`

- `USER`
- `ADMIN`
- `SYSTEM`

---

## 11. `PricingPolicy` Model

### Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | Yes | PK |
| `category` | enum | Yes | unique, 품목 카테고리 기준 |
| `basePrice` | integer | Yes | 카테고리 기본 가격 |
| `isActive` | boolean | Yes | 활성 여부 |
| `createdAt` | datetime | Yes | 생성 시각 |
| `updatedAt` | datetime | Yes | 수정 시각 |

### Notes

- 1차 MVP에서는 가격정책 관리 UI 없이 DB 시드 데이터로 운영한다.
- 가격 계산은 `PricingPolicy`를 기준으로 서버에서 수행한다.
- 각 카테고리별 활성 정책은 동시에 하나만 유지한다.
- 추후 어드민 가격정책 관리 화면이 추가되더라도 데이터 구조를 유지할 수 있다.

---

## 12. Relationships

| From | Relation | To |
| --- | --- | --- |
| `User` | 1:N | `PickupRequest` |
| `User` | 1:N | `Notification` |
| `User` | 1:N | `AdminMemo` |
| `PickupRequest` | 1:N | `PickupItem` |
| `PickupRequest` | 1:N | `StatusHistory` |
| `PickupRequest` | 1:N | `AdminMemo` |
| `PickupRequest` | 1:N | `Notification` |
| `PricingPolicy` | 1:1 logical | `PickupItem.category` |

---

## 13. Ownership and Visibility Rules

- 사용자는 자신의 `PickupRequest`, `Notification`만 조회할 수 있다.
- 관리자는 모든 `PickupRequest`를 조회할 수 있다.
- `AdminMemo`는 관리자만 조회할 수 있다.
- `StatusHistory`는 사용자에게 전체를 노출하지 않고 일부만 보여줄 수 있다.
- `cancelReason`이 내부 사유라면 사용자 응답에서는 가공된 메시지로만 보여줄 수 있다.

---

## 14. Minimal Schema Direction for MVP

MVP 기준으로는 아래 구조면 충분하다.

- `users`
- `pickup_requests`
- `pickup_items`
- `notifications`
- `status_histories`
- `admin_memos`
- `pricing_policies`

세션 저장소 Redis는 애플리케이션 인프라 영역으로 보고 업무 DB 스키마에는 포함하지 않는다.
인증 로그 등 운영성 테이블은 필요 시 별도 추가할 수 있다.

---

## 15. API Design Implications

이 데이터 모델을 기준으로 아래 API 그룹이 자연스럽게 나온다.

### User API

- 내 정보 조회 / 수정
- 픽업 요청 생성
- 내 요청 목록 조회
- 내 요청 상세 조회
- 요청 취소
- 알림 목록 조회
- 알림 읽음 처리

### Admin API

- 관리자 로그인
- 전체 요청 목록 조회
- 요청 상세 조회
- 상태 변경
- 내부 메모 저장

---

## 16. Remaining Open Decisions

- 미결제 요청 자동 만료를 모델 레벨에서 어떻게 표현할지
