#!/bin/bash
# PreToolUse hook: 민감한 파일 수정 차단
# Exit 0 = 허용, Exit 2 = 차단 + Claude에게 피드백

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# 파일 경로가 없으면 허용
if [[ -z "$file_path" ]]; then
  exit 0
fi

# 보호할 파일/디렉토리 패턴
protected_patterns=(
  '.env'
  '.env.local'
  '.env.production'
  'pnpm-lock.yaml'
  'package-lock.json'
  '.git/'
)

for pattern in "${protected_patterns[@]}"; do
  if [[ "$file_path" == *"$pattern"* ]]; then
    echo "❌ 보호된 파일입니다: $file_path" >&2
    echo "이 파일은 직접 수정할 수 없습니다. 다른 방법을 찾아주세요." >&2
    exit 2
  fi
done

exit 0
