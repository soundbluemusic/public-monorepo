#!/bin/bash
# PostToolUseFailure hook: 도구 실패 시 처리
# CLAUDE.md 원칙: "에러 숨기기 절대 금지"
# Exit 0 = 계속 진행 (하지만 경고 표시)

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // "unknown"')
error=$(echo "$input" | jq -r '.error // "알 수 없는 에러"')

# 로그 파일에 기록
log_file="$CLAUDE_PROJECT_DIR/.claude/failure.log"
timestamp=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$timestamp] Tool: $tool_name" >> "$log_file"
echo "  Error: $error" >> "$log_file"
echo "---" >> "$log_file"

# Claude에게 피드백
echo "" >&2
echo "⚠️ 도구 실패 감지:" >&2
echo "  도구: $tool_name" >&2
echo "  에러: ${error:0:200}" >&2
echo "" >&2
echo "📋 CLAUDE.md 원칙 리마인더:" >&2
echo "  - 에러 숨기기 절대 금지" >&2
echo "  - 하드코딩으로 우회 금지" >&2
echo "  - 근본 원인 파악 필수" >&2
echo "" >&2

exit 0
