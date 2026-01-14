#!/usr/bin/env bash
# 프로덕션 URL 링크 검사 스크립트
# lychee 설치 필요: brew install lychee (macOS) 또는 cargo install lychee (Rust)

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# lychee 설치 확인
if ! command -v lychee &> /dev/null; then
    echo -e "${RED}❌ lychee가 설치되어 있지 않습니다.${NC}"
    echo ""
    echo "설치 방법:"
    echo "  macOS: brew install lychee"
    echo "  Rust:  cargo install lychee"
    echo "  Linux: https://github.com/lycheeverse/lychee#installation"
    exit 1
fi

echo -e "${GREEN}🔗 프로덕션 링크 검사 시작...${NC}"
echo ""

# 프로덕션 URL 목록
URLS=(
    "https://context.soundbluemusic.com"
    "https://permissive.soundbluemusic.com"
    "https://roots.soundbluemusic.com"
)

# 결과 저장
FAILED=0
TOTAL=0

# 각 앱 검사
for url in "${URLS[@]}"; do
    echo -e "${YELLOW}📦 검사 중: ${url}${NC}"
    echo "=================================================="

    if lychee --config .lychee.toml "$url" --verbose; then
        echo -e "${GREEN}✅ ${url} - 모든 링크 정상${NC}"
    else
        echo -e "${RED}❌ ${url} - 깨진 링크 발견${NC}"
        FAILED=$((FAILED + 1))
    fi

    TOTAL=$((TOTAL + 1))
    echo ""
done

# 결과 요약
echo "=================================================="
echo -e "${GREEN}📊 검사 결과 요약${NC}"
echo "  총 앱: ${TOTAL}개"
echo "  성공: $((TOTAL - FAILED))개"
echo "  실패: ${FAILED}개"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ 모든 앱의 링크가 정상입니다!${NC}"
    exit 0
else
    echo -e "${RED}❌ ${FAILED}개 앱에서 깨진 링크가 발견되었습니다.${NC}"
    exit 1
fi
