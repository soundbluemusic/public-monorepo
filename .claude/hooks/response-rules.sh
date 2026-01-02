#!/bin/bash
# UserPromptSubmit hook: 매 프롬프트마다 응답 규칙 주입
# CLAUDE.md 핵심 원칙을 리마인더로 제공

# Claude에게 응답 규칙 주입
cat << 'EOF'
[응답 규칙 리마인더]
1. 확인 전 단정 금지 - 추측 말고 코드 확인
2. 완전한 코드 제공 - "// ..." 금지
3. 출처 명시 - 파일:라인 포함
4. 하드코딩 금지 - 테스트 통과용 값 금지
5. 에러 숨기기 금지 - 빈 catch, @ts-ignore 금지
EOF

exit 0
