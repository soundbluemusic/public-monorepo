#!/bin/bash
# PostToolUse hook: ts/tsx 파일 수정 후 Biome 자동 포맷
# Exit 0 = 성공

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# 파일 경로가 없으면 종료
if [[ -z "$file_path" ]]; then
  exit 0
fi

# ts/tsx 파일만 처리
if [[ "$file_path" =~ \.(ts|tsx)$ ]]; then
  cd "$CLAUDE_PROJECT_DIR"

  # 파일이 존재하는지 확인
  if [[ -f "$file_path" ]]; then
    pnpm exec biome check --write "$file_path" 2>/dev/null || true
  fi
fi

exit 0
