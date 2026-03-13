# API Specification

## Purpose

이 문서는 방문 수거 서비스 MVP의 HTTP API 규격을 정의한다.
사용자 앱과 관리자 앱이 어떤 엔드포인트를 호출하는지, 어떤 요청과 응답을 주고받는지 정리한다.

## Used By

- Frontend
- Backend
- Admin

---

## 1. API Design Principles

- 사용자 API와 관리자 API는 경로와 권한으로 분리한다.
- 인증이 필요한 API는 세션 / httpOnly 쿠키 기반 인증을 전제로 한다.
- 응답 구조는 최대한 일관되게 유지한다.
- MVP에서는 구현 속도를 위해 지나치게 복잡한 쿼리 옵션은 제외한다.

---

## 2. Base Paths

### User API

- `/api/auth/*`
- `/api/users/me`
- `/api/pickup-requests/*`
- `/api/notifications/*`

### Admin API

- `/api/admin/*`

---

## 3. Common Response Shape

### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "optional message"
}
```

- 아래 각 API의 `Response Data` 예시는 모두 `data` 필드 내부 payload 기준이다.

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "잘못된 요청입니다."
  }
}
```

---

## 4. Common Error Codes

- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `INVALID_STATUS_TRANSITION`
- `PAYMENT_FAILED`
- `CONFLICT`
- `INTERNAL_SERVER_ERROR`

---

## 5. Authentication API

### 5.1 Sign Up

`POST /api/auth/signup`

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "01012345678",
  "defaultAddress": "서울시 ...",
  "defaultAddressDetail": "101동 1001호"
}
```

### Response Data

```json
{
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "01012345678",
    "role": "USER"
  }
}
```

---

### 5.2 Login

`POST /api/auth/login`

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response Data

```json
{
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "USER"
  }
}
```

### Notes

- 로그인 성공 시 서버는 세션을 생성하고 인증 쿠키를 설정한다.
- 로그인 후 프론트는 `role`을 기준으로 사용자/관리자 UX를 분기할 수 있다.

---

### 5.3 Logout

`POST /api/auth/logout`

### Response Data

```json
{
  "message": "로그아웃되었습니다."
}
```

---

### 5.4 Get Current User

`GET /api/auth/me`

### Response Data

```json
{
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "USER"
  }
}
```

---

## 6. User Profile API

### 6.1 Get My Profile

`GET /api/users/me`

### Response Data

```json
{
  "id": "usr_123",
  "email": "user@example.com",
  "name": "홍길동",
  "phone": "01012345678",
  "defaultAddress": "서울시 ...",
  "defaultAddressDetail": "101동 1001호",
  "role": "USER"
}
```

---

### 6.2 Update My Profile

`PATCH /api/users/me`

### Request Body

```json
{
  "name": "홍길동",
  "phone": "01099998888",
  "defaultAddress": "서울시 ...",
  "defaultAddressDetail": "202동 202호"
}
```

### Response Data

```json
{
  "id": "usr_123",
  "name": "홍길동",
  "phone": "01099998888",
  "defaultAddress": "서울시 ...",
  "defaultAddressDetail": "202동 202호"
}
```

---

## 7. Pickup Request API

### 7.1 Create Pickup Request

`POST /api/pickup-requests`

### Request Body

```json
{
  "pickupDate": "2026-03-20",
  "pickupTimeSlot": "09:00-12:00",
  "address": "서울시 강남구 ...",
  "addressDetail": "101동 1001호",
  "phone": "01012345678",
  "accessNote": "공동현관 비밀번호 1234",
  "requestNote": "문 앞에 둘게요",
  "items": [
    {
      "category": "CLOTHES",
      "description": "겨울옷 1박스",
      "quantityLabel": "1박스"
    },
    {
      "category": "SHOES",
      "description": "운동화 2켤레",
      "quantityLabel": "2켤레"
    }
  ]
}
```

### Response Data

```json
{
  "id": "req_123",
  "status": "PENDING_PAYMENT",
  "paymentStatus": "PENDING",
  "pickupDate": "2026-03-20",
  "pickupTimeSlot": "09:00-12:00",
  "totalPrice": 15000
}
```

### Notes

- 생성 직후 상태는 `PENDING_PAYMENT`로 본다.
- 가격 계산은 서버에서 수행한다.

---

### 7.2 Get My Pickup Requests

`GET /api/pickup-requests`

### Query Params

- `status` optional
- `page` optional
- `limit` optional

### Response Data

```json
{
  "items": [
    {
      "id": "req_123",
      "status": "REQUESTED",
      "pickupDate": "2026-03-20",
      "pickupTimeSlot": "09:00-12:00",
      "primaryItemLabel": "의류 외 1건",
      "createdAt": "2026-03-12T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

---

### 7.3 Get My Pickup Request Detail

`GET /api/pickup-requests/:requestId`

### Response Data

```json
{
  "id": "req_123",
  "status": "REQUESTED",
  "paymentStatus": "PAID",
  "pickupDate": "2026-03-20",
  "pickupTimeSlot": "09:00-12:00",
  "address": "서울시 강남구 ...",
  "addressDetail": "101동 1001호",
  "phone": "01012345678",
  "accessNote": "공동현관 비밀번호 1234",
  "requestNote": "문 앞에 둘게요",
  "totalPrice": 15000,
  "items": [
    {
      "id": "item_1",
      "category": "CLOTHES",
      "description": "겨울옷 1박스",
      "quantityLabel": "1박스"
    }
  ],
  "statusHistory": [
    {
      "fromStatus": null,
      "toStatus": "PENDING_PAYMENT",
      "createdAt": "2026-03-12T10:00:00Z"
    },
    {
      "fromStatus": "PENDING_PAYMENT",
      "toStatus": "REQUESTED",
      "createdAt": "2026-03-12T10:05:00Z"
    }
  ],
  "canCancel": true,
  "canResumePayment": false,
  "createdAt": "2026-03-12T10:00:00Z"
}
```

---

### 7.4 Cancel My Pickup Request

`POST /api/pickup-requests/:requestId/cancel`

### Request Body

```json
{
  "reason": "일정 변경"
}
```

### Response Data

```json
{
  "id": "req_123",
  "status": "CANCELLED",
  "cancelledAt": "2026-03-12T11:00:00Z"
}
```

### Error Cases

- 취소 불가 상태면 `INVALID_STATUS_TRANSITION`
- 본인 요청이 아니면 `FORBIDDEN`

---

## 8. Payment API

### 8.1 Pay for Pickup Request

`POST /api/pickup-requests/:requestId/pay`

### Request Body

```json
{
  "paymentMethod": "MOCK"
}
```

### Response Data

```json
{
  "id": "req_123",
  "status": "REQUESTED",
  "paymentStatus": "PAID",
  "paidAt": "2026-03-12T10:05:00Z"
}
```

### Failure Response Example

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_FAILED",
    "message": "결제에 실패했습니다. 다시 시도해주세요."
  }
}
```

---

### 8.2 Resume Payment Info

`GET /api/pickup-requests/:requestId/payment`

### Response Data

```json
{
  "id": "req_123",
  "status": "PENDING_PAYMENT",
  "paymentStatus": "PENDING",
  "totalPrice": 15000,
  "availableMethods": ["MOCK"]
}
```

---

## 9. Notification API

### 9.1 Get My Notifications

`GET /api/notifications`

### Query Params

- `page` optional
- `limit` optional
- `isRead` optional

### Response Data

```json
{
  "items": [
    {
      "id": "noti_1",
      "type": "SCHEDULE_CONFIRMED",
      "title": "수거 일정이 확정되었어요",
      "message": "3월 20일 오전 방문 예정입니다.",
      "pickupRequestId": "req_123",
      "isRead": false,
      "createdAt": "2026-03-12T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

---

### 9.2 Mark Notification as Read

`POST /api/notifications/:notificationId/read`

### Response Data

```json
{
  "id": "noti_1",
  "isRead": true,
  "readAt": "2026-03-12T11:05:00Z"
}
```

---

## 10. Admin Authentication API

### 10.1 Admin Login

`POST /api/admin/auth/login`

### Request Body

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Response Data

```json
{
  "user": {
    "id": "adm_1",
    "email": "admin@example.com",
    "name": "운영자",
    "role": "ADMIN"
  }
}
```

### Error Cases

- 관리자 권한이 없으면 `FORBIDDEN`

---

## 11. Admin Pickup Request API

### 11.1 Get All Pickup Requests

`GET /api/admin/pickup-requests`

### Query Params

- `status` optional
- `search` optional
- `page` optional
- `limit` optional

### Response Data

```json
{
  "items": [
    {
      "id": "req_123",
      "user": {
        "id": "usr_123",
        "name": "홍길동",
        "phone": "01012345678"
      },
      "status": "REQUESTED",
      "pickupDate": "2026-03-20",
      "pickupTimeSlot": "09:00-12:00",
      "primaryItemLabel": "의류 외 1건",
      "createdAt": "2026-03-12T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

---

### 11.2 Get Pickup Request Detail

`GET /api/admin/pickup-requests/:requestId`

### Response Data

```json
{
  "id": "req_123",
  "user": {
    "id": "usr_123",
    "name": "홍길동",
    "phone": "01012345678",
    "email": "user@example.com"
  },
  "status": "REQUESTED",
  "paymentStatus": "PAID",
  "pickupDate": "2026-03-20",
  "pickupTimeSlot": "09:00-12:00",
  "address": "서울시 강남구 ...",
  "addressDetail": "101동 1001호",
  "accessNote": "공동현관 비밀번호 1234",
  "requestNote": "문 앞에 둘게요",
  "items": [
    {
      "id": "item_1",
      "category": "CLOTHES",
      "description": "겨울옷 1박스",
      "quantityLabel": "1박스"
    }
  ],
  "statusHistory": [],
  "adminMemos": [],
  "allowedActions": ["MARK_SCHEDULED", "CANCEL"]
}
```

---

### 11.3 Update Pickup Request Status

`POST /api/admin/pickup-requests/:requestId/status`

### Request Body

```json
{
  "action": "MARK_SCHEDULED",
  "reason": "기사 방문 일정 확정"
}
```

### Allowed Actions

- `MARK_SCHEDULED`
- `MARK_IN_PROGRESS`
- `MARK_COMPLETED`
- `CANCEL`

### Response Data

```json
{
  "id": "req_123",
  "status": "SCHEDULED",
  "updatedAt": "2026-03-12T12:00:00Z"
}
```

### Error Cases

- 허용되지 않은 전이면 `INVALID_STATUS_TRANSITION`

---

### 11.4 Create Admin Memo

`POST /api/admin/pickup-requests/:requestId/memos`

### Request Body

```json
{
  "content": "고객 요청에 따라 오전 방문 우선 확인 필요"
}
```

### Response Data

```json
{
  "id": "memo_1",
  "content": "고객 요청에 따라 오전 방문 우선 확인 필요",
  "createdAt": "2026-03-12T12:10:00Z"
}
```

---

## 12. Suggested DTO Shapes

### Pickup Request Summary DTO

```json
{
  "id": "req_123",
  "status": "REQUESTED",
  "pickupDate": "2026-03-20",
  "pickupTimeSlot": "09:00-12:00",
  "primaryItemLabel": "의류 외 1건",
  "createdAt": "2026-03-12T10:00:00Z"
}
```

### Pickup Request Detail DTO

```json
{
  "id": "req_123",
  "status": "REQUESTED",
  "paymentStatus": "PAID",
  "pickupDate": "2026-03-20",
  "pickupTimeSlot": "09:00-12:00",
  "address": "서울시 강남구 ...",
  "addressDetail": "101동 1001호",
  "phone": "01012345678",
  "items": [],
  "totalPrice": 15000,
  "canCancel": true,
  "canResumePayment": false,
  "createdAt": "2026-03-12T10:00:00Z"
}
```

---

## 13. Authorization Rules

- `/api/auth/*` 중 회원가입/로그인은 비인증 접근 허용
- `/api/auth/me`, `/api/users/me`, `/api/pickup-requests/*`, `/api/notifications/*` 는 로그인 필요
- `/api/admin/*` 는 로그인 + `ADMIN` role 필요
- 일반 사용자가 관리자 API 호출 시 `FORBIDDEN`

---

## 14. Resolved Decisions For MVP

- 결제 처리는 `POST /api/pickup-requests/:requestId/pay` 형태의 별도 API로 분리한다.
- 관리자 상태 변경은 `action` 기반 요청으로 처리한다.
- 알림 읽음 처리는 1차 MVP에서 단건 API만 제공하고, 일괄 읽음은 후속 단계로 미룬다.
