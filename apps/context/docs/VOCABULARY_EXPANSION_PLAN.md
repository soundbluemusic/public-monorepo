# TOPIK I 어휘 확장 계획 (150 → 1,500개)

## 목표
- **최종 목표**: TOPIK I (1-2급) 합격률 100%
- **어휘 수**: 1,500개 (TOPIK I 공식 어휘 1,850개 중 핵심 선별)
- **카테고리**: 30개 (기존 14개 확장 + 신규 16개)

---

## 카테고리 구조 (30개 × 50개 = 1,500개)

### A. 기존 카테고리 확장 (14개 → 각 50개 = 700개)

| # | 카테고리 ID | 한글명 | 현재 | 목표 | 추가 |
|:---:|:---|:---|:---:|:---:|:---:|
| 1 | greetings | 인사 | 9 | 50 | +41 |
| 2 | food | 음식 | 10 | 50 | +40 |
| 3 | emotions | 감정 | 10 | 50 | +40 |
| 4 | daily-life | 일상생활 | 10 | 50 | +40 |
| 5 | numbers | 숫자 | 15 | 50 | +35 |
| 6 | travel | 여행 | 15 | 50 | +35 |
| 7 | work | 직장 | 10 | 50 | +40 |
| 8 | sports | 스포츠 | 11 | 50 | +39 |
| 9 | music | 음악 | 10 | 50 | +40 |
| 10 | art | 예술 | 10 | 50 | +40 |
| 11 | culture | 문화 | 10 | 50 | +40 |
| 12 | math | 수학 | 10 | 50 | +40 |
| 13 | physics | 물리 | 10 | 50 | +40 |
| 14 | space | 우주 | 10 | 50 | +40 |
| **합계** | | | **150** | **700** | **+550** |

### B. 신규 카테고리 (16개 × 50개 = 800개)

| # | 카테고리 ID | 한글명 | TOPIK 빈출도 | 어휘 수 |
|:---:|:---|:---|:---:|:---:|
| 15 | time-date | 시간/날짜 | ★★★★★ | 50 |
| 16 | weather-seasons | 날씨/계절 | ★★★★☆ | 50 |
| 17 | shopping | 쇼핑/돈 | ★★★★★ | 50 |
| 18 | transportation | 교통 | ★★★★★ | 50 |
| 19 | health | 건강/병원 | ★★★★☆ | 50 |
| 20 | family | 가족/관계 | ★★★★★ | 50 |
| 21 | housing | 집/주거 | ★★★★☆ | 50 |
| 22 | education | 학교/교육 | ★★★★★ | 50 |
| 23 | hobbies | 취미/여가 | ★★★☆☆ | 50 |
| 24 | colors-shapes | 색깔/모양 | ★★★☆☆ | 50 |
| 25 | verbs-basic | 기본 동사 | ★★★★★ | 50 |
| 26 | adjectives-basic | 기본 형용사 | ★★★★★ | 50 |
| 27 | adverbs | 부사 | ★★★★☆ | 50 |
| 28 | particles | 조사/접속사 | ★★★★★ | 50 |
| 29 | location | 위치/방향 | ★★★★☆ | 50 |
| 30 | jobs | 직업 | ★★★★☆ | 50 |
| **합계** | | | | **800** |

---

## 어휘 난이도 배분

각 카테고리 50개 어휘의 난이도 배분:

| 난이도 | 비율 | 개수 | 설명 |
|:---|:---:|:---:|:---|
| beginner | 50% | 25개 | TOPIK 1급 필수 |
| intermediate | 30% | 15개 | TOPIK 2급 필수 |
| advanced | 20% | 10개 | TOPIK 2급 고득점 |

---

## 품사별 배분 (전체 1,500개)

| 품사 | 목표 비율 | 목표 개수 |
|:---|:---:|:---:|
| 명사 (noun) | 45% | 675개 |
| 동사 (verb) | 25% | 375개 |
| 형용사 (adjective) | 15% | 225개 |
| 부사 (adverb) | 8% | 120개 |
| 기타 (조사, 감탄사 등) | 7% | 105개 |

---

## 우선순위 및 실행 계획

### Phase 1: 핵심 카테고리 (TOPIK 최빈출)
1. time-date (시간/날짜) - 50개
2. family (가족/관계) - 50개
3. verbs-basic (기본 동사) - 50개
4. adjectives-basic (기본 형용사) - 50개
5. shopping (쇼핑/돈) - 50개
6. transportation (교통) - 50개
7. greetings 확장 (+41개)
8. food 확장 (+40개)

**Phase 1 완료 시**: 150 + 350 = **500개**

### Phase 2: 필수 카테고리
9. education (학교/교육) - 50개
10. health (건강/병원) - 50개
11. weather-seasons (날씨/계절) - 50개
12. housing (집/주거) - 50개
13. location (위치/방향) - 50개
14. particles (조사/접속사) - 50개
15. numbers 확장 (+35개)
16. daily-life 확장 (+40개)

**Phase 2 완료 시**: 500 + 375 = **875개**

### Phase 3: 보완 카테고리
17-30. 나머지 카테고리들

**Phase 3 완료 시**: **1,500개**

---

## 데이터 구조

각 어휘 엔트리는 다음 구조를 따름:

```json
{
  "id": "unique-id",
  "korean": "한글",
  "romanization": "romanization",
  "partOfSpeech": "noun|verb|adjective|adverb|...",
  "categoryId": "category-id",
  "difficulty": "beginner|intermediate|advanced",
  "frequency": "common|frequent|rare",
  "tags": ["tag1", "tag2"],
  "translations": {
    "ko": {
      "word": "한글",
      "explanation": "설명",
      "examples": {
        "beginner": "초급 예문",
        "intermediate": "중급 예문",
        "advanced": "고급 예문",
        "master": "마스터 예문"
      }
    },
    "en": {
      "word": "English",
      "explanation": "Explanation",
      "examples": {
        "beginner": "Beginner example",
        "intermediate": "Intermediate example",
        "advanced": "Advanced example",
        "master": "Master example"
      }
    }
  }
}
```

---

## 검증 기준

1. **TOPIK I 어휘 커버리지**: 1,850개 중 1,500개 (81%) 이상
2. **빈출 어휘 포함율**: 상위 500개 필수 어휘 100% 포함
3. **예문 품질**: 각 레벨별 예문 길이 가이드라인 준수
4. **품사 균형**: 명사 40-50%, 동사 20-30%, 형용사 10-20%

---

## 참고 자료

- TOPIK I 공식 어휘 목록 (1,850개)
- 국립국어원 한국어 학습용 어휘 목록
- TOPIK Guide 빈출 어휘 분석
- KoreanTOPIK.com 어휘 자료

---

*최종 업데이트: 2025-12-25*
