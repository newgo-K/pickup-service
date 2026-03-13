# Dev Tools

## Purpose

이 문서는 pickup-service 구현 전에 준비할 개발 도구, CLI, 외부 서비스, Vercel `skills.sh` 설치 후보를 정리한다.
실제 구현에 바로 도움이 되는 도구만 남기고, 우선순위와 사용 시점을 함께 적는다.

## Used By

- Frontend
- Backend
- Admin
- Planner

---

## 1. Core Local Tooling

아래 도구는 프로젝트 기본 개발 환경이다.

- Node.js
- pnpm
- Turborepo
- Git

### Notes

- 모노레포 실행과 패키지 관리는 `pnpm workspace` 기준으로 맞춘다.
- 로컬 실행 명령은 `turbo`와 루트 스크립트 기준으로 통일한다.

---

## 2. Framework And Runtime Tooling

### Frontend

- Next.js
- React
- Tailwind CSS
- shadcn/ui

### Backend

- NestJS
- Prisma

### Infra / External

- Supabase
- Redis
- Naver Cloud Platform
- Toss Payments

---

## 3. Vercel skills.sh

이 프로젝트에서 설치 가치가 높은 `skills.sh` 후보는 아래와 같다.

### 3.1 `shadcn`

### Why

- `apps/web`, `apps/admin` 둘 다 shadcn/ui를 사용한다.
- 컴포넌트 추가, registry 사용, monorepo 작업에 직접 도움이 된다.
- 지금 단계에서 가장 우선순위가 높다.

### Reference

- [shadcn skill](https://skills.sh/shadcn/ui/shadcn)

### Install

```bash
npx skills add https://github.com/shadcn/ui --skill shadcn
```

---

### 3.2 `nextjs`

### Why

- 사용자 앱과 관리자 앱이 모두 Next.js다.
- App Router, route structure, project patterns 참고에 도움 된다.

### Reference

- [nextjs skill](https://skills.sh/teachingai/full-stack-skills/nextjs)

### Install

```bash
npx skills add https://github.com/teachingai/full-stack-skills --skill nextjs
```

---

### 3.3 `nestjs`

### Why

- `apps/api`가 NestJS 서버다.
- 모듈 구조, DTO, guard, validation 설계 시 참고 가치가 있다.

### Reference

- [nestjs skill](https://skills.sh/teachingai/full-stack-skills/nestjs)

### Install

```bash
npx skills add https://github.com/teachingai/full-stack-skills --skill nestjs
```

---

### 3.4 `tailwindcss`

### Why

- web/admin 공통 UI와 빠른 스타일 구현에 직접 도움 된다.
- shadcn/ui와 같이 쓸 때 효율이 높다.

### Reference

- [tailwindcss skill](https://skills.sh/mindrally/skills/tailwindcss)

### Install

```bash
npx skills add https://github.com/mindrally/skills --skill tailwindcss
```

---

### 3.5 `vercel-deploy`

### Why

- 배포 단계에서 preview/deploy 작업에 도움 된다.
- 지금 즉시 필수는 아니고 배포 직전에 설치해도 된다.

### Reference

- [vercel-deploy skill](https://skills.sh/openai/skills/vercel-deploy)

### Install

```bash
npx skills add https://github.com/openai/skills --skill vercel-deploy
```

---

## 4. Recommended Installation Order

지금 기준 추천 순서는 아래와 같다.

1. `shadcn`
2. `nextjs`
3. `nestjs`
4. `tailwindcss`
5. `vercel-deploy`

---

## 5. What Is Not Required Right Now

- React 전용 skill
- Prisma 전용 `skills.sh` 항목
- Orval 전용 `skills.sh` 항목

### Notes

- React는 Next.js skill이 대부분 커버한다.
- Prisma, Orval은 현재 확인된 `skills.sh` 기준으로 꼭 설치해야 할 항목이 명확하지 않다.
- 이 둘은 문서와 공식 CLI 기준으로 진행해도 충분하다.

---

## 6. External Accounts / Keys

구현 전에 준비해야 할 주요 외부 계정과 키는 아래와 같다.

- Supabase project
- Redis instance
- Naver map client id / secret
- Toss Payments test client key / secret key

---

## 7. Immediate Recommendation

지금은 아래까지만 준비하면 충분하다.

- `shadcn`
- `nextjs`
- `nestjs`
- `tailwindcss`

`vercel-deploy`는 배포 단계 직전에 추가해도 된다.
