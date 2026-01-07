#!/bin/bash
# SessionStart hook: 세션 시작 시 환경 검증
# Exit 0 = 성공, Exit 2 = 실패 + Claude에게 피드백

cd "$CLAUDE_PROJECT_DIR"

errors=()

# 1. node_modules 존재 확인
if [[ ! -d "node_modules" ]]; then
  errors+=("❌ node_modules 없음 - 'pnpm install' 실행 필요")
fi

# 2. pnpm 버전 확인
if ! command -v pnpm &> /dev/null; then
  errors+=("❌ pnpm 미설치")
else
  pnpm_version=$(pnpm --version 2>/dev/null)
  if [[ ! "$pnpm_version" =~ ^10\. ]]; then
    errors+=("⚠️ pnpm 버전 불일치: $pnpm_version (권장: 10.x)")
  fi
fi

# 3. Node.js 버전 확인
if command -v node &> /dev/null; then
  node_version=$(node --version 2>/dev/null | sed 's/v//')
  node_major=$(echo "$node_version" | cut -d. -f1)
  if [[ "$node_major" -lt 20 ]]; then
    errors+=("⚠️ Node.js 버전 낮음: v$node_version (권장: ≥20)")
  fi
fi

# 4. 필수 도구 확인
for tool in turbo biome; do
  if [[ -d "node_modules" ]] && [[ ! -f "node_modules/.bin/$tool" ]]; then
    errors+=("⚠️ $tool 미설치 - 'pnpm install' 실행 필요")
  fi
done

# 결과 출력
if [[ ${#errors[@]} -gt 0 ]]; then
  echo "🔍 환경 검증 결과:" >&2
  for error in "${errors[@]}"; do
    echo "  $error" >&2
  done
  echo "" >&2
  echo "💡 해결: 'pnpm install'을 먼저 실행하세요." >&2

  # node_modules 없으면 차단, 그 외는 경고만
  if [[ ! -d "node_modules" ]]; then
    exit 2
  fi
fi

echo "✅ 환경 검증 완료" >&2
echo "" >&2
echo "💡 토큰 절약 팁: 20턴마다 /compact | 파일 직접 지정 @file.ts | 작업 후 새 세션" >&2
exit 0
