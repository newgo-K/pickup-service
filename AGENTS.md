# AGENTS.md

## Codex Skills Rule

- 이 프로젝트에서 "스킬"은 기본적으로 Codex 스킬을 의미한다.
- "skills.sh 후보"와 "활성 스킬"은 서로 다른 개념으로 취급한다.
- `vendor_imports` 또는 외부 카탈로그에 흔적이 있어도, 활성 스킬 디렉터리에 없으면 설치 완료로 보지 않는다.

## Active Skills Definition

- `skills.sh --global`로 설치한 프로젝트 스킬 확인 기준 경로는 `~/.agents/skills` 이다.
- Codex 기본 시스템 스킬 확인 기준 경로는 `${CODEX_HOME:-$HOME/.codex}/skills` 이다.
- 현재 세션에서 사용 가능한 스킬인지 답할 때는 문서 추천 목록이 아니라 활성 스킬 기준으로 답한다.

## Project Skill Vocabulary

- "Codex 스킬": Codex가 실제로 읽고 사용할 수 있는 스킬 전체를 의미한다.
- "활성 스킬": 실제 설치 경로에 존재하는 스킬을 의미한다.
- 프로젝트 스킬은 보통 `~/.agents/skills` 를 기준으로 본다.
- Codex 기본 시스템 스킬은 `${CODEX_HOME:-$HOME/.codex}/skills` 를 기준으로 본다.
- "skills.sh 후보": 문서나 카탈로그에 있는 추천 스킬을 의미한다.

## Project Default Skill Check

- 이 프로젝트 작업을 시작할 때는 아래 스킬의 활성 여부를 먼저 확인한다.
- `shadcn`
- `nextjs`
- `nestjs`
- `tailwindcss`

## Bootstrap Source

- 새 PC 또는 새 환경에서는 `scripts/setup-codex-skills.sh` 를 기준으로 필요한 Codex 스킬을 설치한다.
- 세부 설명과 수동 확인 절차는 `docs/system/codex-skills.md` 를 따른다.
