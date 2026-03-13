# Codex Skills Guide

## Purpose

이 문서는 pickup-service 저장소에서 사용하는 Codex 스킬의 기준, 설치 방법, 확인 방법을 고정한다.
다른 PC나 새 세션에서도 같은 기준으로 작업을 이어가기 위한 문서다.

## Vocabulary

- `Codex 스킬`: Codex가 실제로 읽고 사용할 수 있는 스킬 전체
- `활성 스킬`: 실제 활성 경로 아래에 설치된 스킬
- `skills.sh 후보`: 문서 또는 카탈로그 상의 추천 스킬

이 프로젝트에서 사용자가 그냥 "스킬"이라고 말하면 기본적으로 `Codex 스킬`을 의미한다.
설치 여부를 물을 때는 기본적으로 `활성 스킬` 기준으로 확인한다.

## Required Project Skills

이 프로젝트에서 기본 확인 대상으로 두는 스킬은 아래 4개다.

- `shadcn`
- `nextjs`
- `nestjs`
- `tailwindcss`

`vercel-deploy`는 배포 직전 필요 시 추가한다.

## Install Command

새 PC에서는 아래 스크립트를 먼저 실행한다.

```bash
./scripts/setup-codex-skills.sh
```

수동 설치가 필요하면 아래 명령을 사용한다.

```bash
npx skills add https://github.com/shadcn/ui --skill shadcn
npx skills add https://github.com/teachingai/full-stack-skills --skill nextjs
npx skills add https://github.com/teachingai/full-stack-skills --skill nestjs
npx skills add https://github.com/mindrally/skills --skill tailwindcss
```

## Active Skill Check

활성 스킬 기준 경로는 아래 두 종류로 확인한다.

1. `skills.sh --global`로 설치한 프로젝트 스킬: `~/.agents/skills`
2. Codex 기본 시스템 스킬: `${CODEX_HOME:-$HOME/.codex}/skills`

예시 확인 명령:

```bash
find "$HOME/.agents/skills" -maxdepth 2 -name SKILL.md | sort
find "${CODEX_HOME:-$HOME/.codex}/skills" -maxdepth 3 -name SKILL.md | sort
```

위 경로에 스킬 디렉터리와 `SKILL.md`가 있어야 활성 스킬로 본다.
`vendor_imports` 아래에만 파일이 있으면 설치 캐시로 보고, 활성 스킬로 취급하지 않는다.

## Session Rule

세션에서 아래처럼 말하면 된다.

- `활성 스킬 기준으로 확인해줘`
- `Codex 스킬 설치 상태 확인해줘`
- `shadcn 스킬 지금 활성화돼 있어?`

아래 표현은 애매해서 피한다.

- `skills 있어?`
- `그 스킬 깔렸어?`

## Troubleshooting

- `vendor_imports`에만 있고 활성 경로에 없으면 설치가 반쯤 끝난 상태일 수 있다.
- 이전 스레드에서 설치했다고 해도 현재 세션에서는 활성 경로 기준으로 다시 확인한다.
- 설치 후에도 세션에 바로 안 보이면 새 세션에서 다시 확인한다.
