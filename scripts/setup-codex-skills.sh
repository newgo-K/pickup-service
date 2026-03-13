#!/usr/bin/env bash

set -euo pipefail

echo "[codex-skills] installing required Codex skills for pickup-service"

npx skills add --yes --global https://github.com/shadcn/ui --skill shadcn
npx skills add --yes --global https://github.com/teachingai/full-stack-skills --skill nextjs
npx skills add --yes --global https://github.com/teachingai/full-stack-skills --skill nestjs
npx skills add --yes --global https://github.com/mindrally/skills --skill tailwindcss

echo "[codex-skills] installed candidates:"
find "$HOME/.agents/skills" -maxdepth 2 -name SKILL.md | sort || true
find "${CODEX_HOME:-$HOME/.codex}/skills" -maxdepth 3 -name SKILL.md | sort || true
