import type { VocabEntry } from "./types";

export const vocabEntries: VocabEntry[] = [
  // 한글 - 자음
  {
    id: "hangul-consonant-giyeok",
    term: "ㄱ (기역)",
    pronunciation: "기역",
    definition: "한글 자음의 첫 번째 글자. 연구개 파열음을 나타낸다.",
    examples: ["가나다라", "기러기", "고구마"],
    relatedTerms: ["ㄲ", "쌍기역"],
    tags: ["자음", "초성", "종성", "기본자음"],
    categoryId: "hangul",
    subcategoryId: "consonants",
  },
  {
    id: "hangul-consonant-nieun",
    term: "ㄴ (니은)",
    pronunciation: "니은",
    definition: "한글 자음의 두 번째 글자. 치경 비음을 나타낸다.",
    examples: ["나비", "누나", "노래"],
    relatedTerms: [],
    tags: ["자음", "초성", "종성", "기본자음", "비음"],
    categoryId: "hangul",
    subcategoryId: "consonants",
  },
  {
    id: "hangul-consonant-digeut",
    term: "ㄷ (디귿)",
    pronunciation: "디귿",
    definition: "한글 자음의 세 번째 글자. 치경 파열음을 나타낸다.",
    examples: ["다리", "도시", "두부"],
    relatedTerms: ["ㄸ", "쌍디귿"],
    tags: ["자음", "초성", "종성", "기본자음"],
    categoryId: "hangul",
    subcategoryId: "consonants",
  },

  // 한글 - 모음
  {
    id: "hangul-vowel-a",
    term: "ㅏ (아)",
    pronunciation: "아",
    definition: "한글 기본 모음. 양성 모음으로, 밝고 맑은 느낌을 준다.",
    examples: ["아버지", "사람", "나라"],
    relatedTerms: ["ㅑ", "ㅓ"],
    tags: ["모음", "단모음", "양성모음"],
    categoryId: "hangul",
    subcategoryId: "vowels",
  },
  {
    id: "hangul-vowel-eo",
    term: "ㅓ (어)",
    pronunciation: "어",
    definition: "한글 기본 모음. 음성 모음으로, 어둡고 무거운 느낌을 준다.",
    examples: ["어머니", "서울", "거울"],
    relatedTerms: ["ㅕ", "ㅏ"],
    tags: ["모음", "단모음", "음성모음"],
    categoryId: "hangul",
    subcategoryId: "vowels",
  },

  // 형태소 - 조사
  {
    id: "morpheme-particle-eun",
    term: "은/는",
    pronunciation: "은/는",
    definition: "주제를 나타내는 보조사. 받침 유무에 따라 '은' 또는 '는'을 사용한다.",
    examples: ["나는 학생이다.", "사과는 맛있다.", "책은 재미있다."],
    relatedTerms: ["이/가", "도"],
    tags: ["보조사", "주제격", "대조"],
    categoryId: "morpheme",
    subcategoryId: "particle",
  },
  {
    id: "morpheme-particle-iga",
    term: "이/가",
    pronunciation: "이/가",
    definition: "주어를 나타내는 격조사. 받침 유무에 따라 '이' 또는 '가'를 사용한다.",
    examples: ["비가 온다.", "꽃이 피었다.", "그가 왔다."],
    relatedTerms: ["은/는", "께서"],
    tags: ["격조사", "주격"],
    categoryId: "morpheme",
    subcategoryId: "particle",
  },
  {
    id: "morpheme-particle-eul",
    term: "을/를",
    pronunciation: "을/를",
    definition: "목적어를 나타내는 격조사. 받침 유무에 따라 '을' 또는 '를'을 사용한다.",
    examples: ["밥을 먹는다.", "책을 읽는다.", "영화를 본다."],
    relatedTerms: [],
    tags: ["격조사", "목적격"],
    categoryId: "morpheme",
    subcategoryId: "particle",
  },

  // 단어 - 명사
  {
    id: "word-noun-haneul",
    term: "하늘",
    pronunciation: "하늘",
    definition: "지구를 둘러싸고 있는 무한한 공간. 낮에는 파랗게, 밤에는 검게 보인다.",
    examples: ["하늘이 맑다.", "하늘을 나는 새", "밤하늘의 별"],
    relatedTerms: ["땅", "구름", "별"],
    tags: ["명사", "자연", "고유어"],
    categoryId: "words",
    subcategoryId: "nouns",
  },
  {
    id: "word-noun-sarang",
    term: "사랑",
    pronunciation: "사랑",
    definition: "어떤 대상을 아끼고 소중히 여기는 마음. 또는 이성에게 끌려 그리워하는 감정.",
    examples: ["사랑에 빠지다", "가족의 사랑", "사랑을 고백하다"],
    relatedTerms: ["애정", "정", "좋아함"],
    tags: ["명사", "감정", "추상명사", "고유어"],
    categoryId: "words",
    subcategoryId: "nouns",
  },

  // 단어 - 동사
  {
    id: "word-verb-gada",
    term: "가다",
    pronunciation: "가다",
    definition: "한 곳에서 다른 곳으로 장소를 이동하다.",
    examples: ["학교에 가다", "여행을 가다", "집에 가다"],
    relatedTerms: ["오다", "떠나다", "이동하다"],
    tags: ["동사", "이동", "기본동사", "고유어"],
    categoryId: "words",
    subcategoryId: "verbs",
  },
  {
    id: "word-verb-meokda",
    term: "먹다",
    pronunciation: "먹다",
    definition: "음식 등을 입을 통해 배 속에 들여보내다.",
    examples: ["밥을 먹다", "과일을 먹다", "약을 먹다"],
    relatedTerms: ["마시다", "삼키다", "씹다"],
    tags: ["동사", "섭취", "기본동사", "고유어"],
    categoryId: "words",
    subcategoryId: "verbs",
  },

  // 신조어
  {
    id: "neologism-jjal",
    term: "짤",
    pronunciation: "짤",
    definition: "인터넷에서 사용되는 재미있거나 특이한 이미지. '짤방'의 줄임말.",
    examples: ["이 짤 너무 웃겨", "짤을 저장했다", "반응 짤 모음"],
    relatedTerms: ["짤방", "움짤", "밈"],
    tags: ["신조어", "인터넷용어", "줄임말"],
    categoryId: "neologism",
    subcategoryId: "internet-slang",
  },
  {
    id: "neologism-heol",
    term: "헐",
    pronunciation: "헐",
    definition: "놀라움, 황당함, 어이없음 등을 나타내는 감탄사.",
    examples: ["헐, 진짜?", "헐... 대박", "헐 어떡해"],
    relatedTerms: ["대박", "ㅎㄷㄷ", "우와"],
    tags: ["신조어", "감탄사", "구어체"],
    categoryId: "neologism",
    subcategoryId: "slang",
  },
  {
    id: "neologism-somaek",
    term: "소맥",
    pronunciation: "소맥",
    definition: "소주와 맥주를 섞은 술. '소주+맥주'의 합성어.",
    examples: ["소맥 한 잔 하자", "소맥 비율이 중요해", "오늘은 소맥이다"],
    relatedTerms: ["폭탄주", "소주", "맥주"],
    tags: ["신조어", "합성어", "주류"],
    categoryId: "neologism",
    subcategoryId: "compound-words",
  },
  {
    id: "neologism-jjamppon",
    term: "짬뽕",
    pronunciation: "짬뽕",
    definition: "(비유적) 여러 가지가 뒤섞인 것. 원래는 중국 음식의 일종.",
    examples: ["이건 완전 짬뽕이야", "스타일이 짬뽕", "여러 장르의 짬뽕"],
    relatedTerms: ["혼합", "믹스"],
    tags: ["신조어", "비유표현"],
    categoryId: "neologism",
    subcategoryId: "slang",
  },

  // 콩글리시
  {
    id: "konglish-handphone",
    term: "핸드폰",
    pronunciation: "핸드폰",
    definition: "휴대전화를 뜻하는 한국식 영어. 영어로는 'mobile phone' 또는 'cell phone'이 올바른 표현.",
    examples: ["핸드폰 번호 알려줘", "핸드폰 배터리가 없어", "핸드폰 좀 빌려줘"],
    relatedTerms: ["휴대폰", "스마트폰", "mobile phone"],
    tags: ["콩글리시", "외래어", "일상용어"],
    categoryId: "konglish",
    subcategoryId: "false-friends",
  },
  {
    id: "konglish-fighting",
    term: "파이팅",
    pronunciation: "파이팅",
    definition: "응원이나 격려의 뜻으로 사용하는 한국식 영어. 영어에서는 이런 의미로 사용하지 않는다.",
    examples: ["시험 파이팅!", "파이팅 하자!", "내일 면접 파이팅"],
    relatedTerms: ["화이팅", "아자", "힘내"],
    tags: ["콩글리시", "응원", "감탄사"],
    categoryId: "konglish",
    subcategoryId: "false-friends",
  },
  {
    id: "konglish-service",
    term: "서비스",
    pronunciation: "서비스",
    definition: "'무료로 주는 것'이라는 의미의 한국식 영어. 영어의 'service'는 이런 의미가 없다.",
    examples: ["이건 서비스예요", "서비스로 드릴게요", "서비스 많이 주세요"],
    relatedTerms: ["덤", "무료", "bonus"],
    tags: ["콩글리시", "상업용어"],
    categoryId: "konglish",
    subcategoryId: "false-friends",
  },

  // 한본어 (일본어 영향)
  {
    id: "japanese-danbara",
    term: "단바라",
    pronunciation: "단바라",
    definition: "빈 땅, 공터를 뜻하는 말. 일본어 '段原(단바라)'에서 유래.",
    examples: ["저기 단바라에 집 지을 거래", "단바라를 주차장으로 쓴다"],
    relatedTerms: ["공터", "빈터", "나대지"],
    tags: ["한본어", "일본어차용어", "부동산"],
    categoryId: "japanese-influence",
    subcategoryId: "japanese-loanwords",
  },
  {
    id: "japanese-norimono",
    term: "노가다",
    pronunciation: "노가다",
    definition: "막노동, 건설 현장 노동을 뜻하는 말. 일본어 '土方(도카타)'에서 유래.",
    examples: ["노가다 뛰다", "노가다판", "노가다로 돈 벌다"],
    relatedTerms: ["막노동", "건설노동", "일용직"],
    tags: ["한본어", "일본어차용어", "비격식"],
    categoryId: "japanese-influence",
    subcategoryId: "japanese-loanwords",
  },

  // 사투리 - 경상도
  {
    id: "dialect-gyeongsang-mwo",
    term: "뭐꼬",
    pronunciation: "뭐꼬",
    definition: "경상도 사투리로 '뭐야?'라는 뜻. 의문을 나타낸다.",
    examples: ["이거 뭐꼬?", "뭐꼬 그게?", "니 뭐꼬?"],
    relatedTerms: ["뭐야", "뭐니", "뭔데"],
    tags: ["경상도사투리", "의문문", "구어체"],
    categoryId: "dialect",
    subcategoryId: "gyeongsang",
  },
  {
    id: "dialect-gyeongsang-gara",
    term: "가라",
    pronunciation: "가라",
    definition: "경상도 사투리에서 명령형 어미. '가' 대신 '가라'를 사용.",
    examples: ["빨리 가라", "집에 가라", "저리 가라"],
    relatedTerms: ["가", "가세요"],
    tags: ["경상도사투리", "명령형", "어미"],
    categoryId: "dialect",
    subcategoryId: "gyeongsang",
  },

  // 사투리 - 전라도
  {
    id: "dialect-jeolla-geutung",
    term: "거시기",
    pronunciation: "거시기",
    definition: "전라도 사투리로 '그것' 또는 이름이 생각나지 않는 것을 가리킬 때 사용.",
    examples: ["거시기 좀 줘봐", "거시기가 말이야...", "그 거시기 있잖아"],
    relatedTerms: ["그거", "그것", "머시기"],
    tags: ["전라도사투리", "지시어", "구어체"],
    categoryId: "dialect",
    subcategoryId: "jeolla",
  },

  // 사투리 - 제주도
  {
    id: "dialect-jeju-hareubang",
    term: "하르방",
    pronunciation: "하르방",
    definition: "제주도 사투리로 '할아버지'를 뜻함. '돌하르방'의 '하르방'.",
    examples: ["우리 하르방", "하르방 안녕하수과", "돌하르방"],
    relatedTerms: ["할아버지", "할배"],
    tags: ["제주도사투리", "호칭", "가족"],
    categoryId: "dialect",
    subcategoryId: "jeju",
  },

  // 어르신 언어
  {
    id: "elderly-olbang",
    term: "올방자",
    pronunciation: "올방자",
    definition: "올바르지 않고 경망스러운 사람을 이르는 옛말.",
    examples: ["저런 올방자 같으니", "올방자처럼 굴지 마라"],
    relatedTerms: ["경망스러운", "얌체"],
    tags: ["고어", "형용사", "어르신언어"],
    categoryId: "elderly-speech",
    subcategoryId: "archaic-words",
  },
  {
    id: "elderly-palli",
    term: "어서",
    pronunciation: "어서",
    definition: "'빨리'라는 뜻의 전통적 표현. 현대에는 '어서 오세요'에서 주로 사용.",
    examples: ["어서 하거라", "어서 오세요", "어서 가자"],
    relatedTerms: ["빨리", "얼른"],
    tags: ["전통표현", "부사", "어르신언어"],
    categoryId: "elderly-speech",
    subcategoryId: "traditional-expressions",
  },

  // 오타
  {
    id: "typo-daeyo",
    term: "되요 → 돼요",
    pronunciation: "",
    definition: "'되어요'의 준말은 '돼요'가 맞다. '되요'는 잘못된 표기.",
    examples: ["안 돼요 (O)", "안 되요 (X)", "그래도 돼요 (O)"],
    relatedTerms: ["되다", "돼다"],
    tags: ["맞춤법오류", "활용", "흔한오타"],
    categoryId: "typo",
    subcategoryId: "common-typos",
  },
  {
    id: "typo-wae",
    term: "왜냐면 → 왜냐하면",
    pronunciation: "",
    definition: "'왜냐면'은 구어체 축약형. 정식 표기는 '왜냐하면'.",
    examples: ["왜냐하면 그건... (정식)", "왜냐면 그건... (구어)"],
    relatedTerms: ["왜냐하면", "이유"],
    tags: ["맞춤법", "축약", "구어체"],
    categoryId: "typo",
    subcategoryId: "common-typos",
  },
  {
    id: "typo-geonbae",
    term: "건배 vs 건베",
    pronunciation: "건배",
    definition: "'건배'가 올바른 표기. '건베'는 잘못된 발음 표기.",
    examples: ["건배! (O)", "건베! (X)"],
    relatedTerms: ["축배", "원샷"],
    tags: ["맞춤법오류", "발음", "흔한오타"],
    categoryId: "typo",
    subcategoryId: "common-typos",
  },

  // 띄어쓰기
  {
    id: "spacing-geot",
    term: "~할 것이다",
    pronunciation: "",
    definition: "'것'은 의존명사이므로 앞말과 띄어 써야 한다.",
    examples: ["먹을 것 (O)", "먹을것 (X)", "갈 것이다 (O)"],
    relatedTerms: ["의존명사", "것"],
    tags: ["띄어쓰기규칙", "의존명사"],
    categoryId: "spacing",
    subcategoryId: "spacing-rules",
  },
  {
    id: "spacing-su",
    term: "~할 수 있다",
    pronunciation: "",
    definition: "'수'는 의존명사이므로 앞말과 띄어 써야 한다.",
    examples: ["할 수 있다 (O)", "할수있다 (X)", "먹을 수 없다 (O)"],
    relatedTerms: ["의존명사", "수"],
    tags: ["띄어쓰기규칙", "의존명사"],
    categoryId: "spacing",
    subcategoryId: "spacing-rules",
  },
  {
    id: "spacing-error-manke",
    term: "만큼",
    pronunciation: "만큼",
    definition: "'만큼'은 조사나 의존명사에 따라 띄어쓰기가 다르다. 체언 뒤: 붙여쓰기, 용언 뒤: 띄어쓰기",
    examples: ["키만큼 (O, 체언 뒤)", "먹은 만큼 (O, 용언 뒤)"],
    relatedTerms: ["정도", "~ㄹ 만큼"],
    tags: ["띄어쓰기", "조사", "의존명사"],
    categoryId: "spacing",
    subcategoryId: "spacing-errors",
  },

  // 기호/문장부호
  {
    id: "punctuation-period",
    term: "마침표 (.)",
    pronunciation: "마침표",
    definition: "문장이 끝났음을 나타내는 문장부호. 서술문, 명령문의 끝에 사용.",
    examples: ["나는 학생이다.", "빨리 가라.", "좋은 아침입니다."],
    relatedTerms: ["물음표", "느낌표"],
    tags: ["문장부호", "기본부호"],
    categoryId: "punctuation",
    subcategoryId: "basic-punctuation",
  },
  {
    id: "punctuation-question",
    term: "물음표 (?)",
    pronunciation: "물음표",
    definition: "의문을 나타내는 문장부호. 의문문의 끝에 사용.",
    examples: ["뭐 해?", "어디 가니?", "이게 뭐지?"],
    relatedTerms: ["마침표", "느낌표"],
    tags: ["문장부호", "기본부호"],
    categoryId: "punctuation",
    subcategoryId: "basic-punctuation",
  },
  {
    id: "punctuation-quotation-double",
    term: '큰따옴표 ("")',
    pronunciation: "큰따옴표",
    definition: "직접 인용이나 대화를 나타낼 때 사용하는 문장부호.",
    examples: ['"안녕하세요"라고 말했다.', '"뭐야"라고 물었다.'],
    relatedTerms: ["작은따옴표", "인용"],
    tags: ["문장부호", "인용부호"],
    categoryId: "punctuation",
    subcategoryId: "quotation-marks",
  },

  // 이모지/이모티콘
  {
    id: "emoji-kk",
    term: "ㅋㅋㅋ",
    pronunciation: "크크크",
    definition: "웃음을 나타내는 한글 이모티콘. 'ㅋ'의 반복으로 웃음의 강도를 표현.",
    examples: ["진짜 웃겨ㅋㅋㅋ", "뭐야ㅋㅋ", "ㅋㅋㅋㅋㅋㅋㅋ"],
    relatedTerms: ["ㅎㅎㅎ", "lol", "웃음"],
    tags: ["한글이모티콘", "웃음", "인터넷용어"],
    categoryId: "emoji",
    subcategoryId: "korean-emoticons",
  },
  {
    id: "emoji-hh",
    term: "ㅎㅎ",
    pronunciation: "흐흐",
    definition: "부드러운 웃음을 나타내는 한글 이모티콘. ㅋㅋ보다 온화한 느낌.",
    examples: ["그렇구나ㅎㅎ", "고마워ㅎㅎ", "잘 자ㅎㅎ"],
    relatedTerms: ["ㅋㅋ", "웃음"],
    tags: ["한글이모티콘", "웃음", "인터넷용어"],
    categoryId: "emoji",
    subcategoryId: "korean-emoticons",
  },
  {
    id: "emoji-crying",
    term: "ㅠㅠ / ㅜㅜ",
    pronunciation: "유유 / 우우",
    definition: "슬픔이나 울음을 나타내는 한글 이모티콘. 눈물 흘리는 모양을 형상화.",
    examples: ["너무 슬퍼ㅠㅠ", "안돼ㅜㅜ", "ㅠㅠ 미안해"],
    relatedTerms: ["T_T", "눈물", "슬픔"],
    tags: ["한글이모티콘", "슬픔", "인터넷용어"],
    categoryId: "emoji",
    subcategoryId: "korean-emoticons",
  },
  {
    id: "emoji-smile-unicode",
    term: "😊",
    pronunciation: "스마일",
    definition: "웃는 얼굴을 나타내는 유니코드 이모지. 기쁨, 친근함을 표현.",
    examples: ["반가워요 😊", "좋은 하루 보내세요 😊"],
    relatedTerms: ["😄", "🙂", "웃음"],
    tags: ["유니코드이모지", "표정", "감정"],
    categoryId: "emoji",
    subcategoryId: "unicode-emoji",
  },

  // 약어
  {
    id: "abbreviation-ok",
    term: "ㅇㅋ",
    pronunciation: "오케이",
    definition: "'오케이(OK)'의 초성 약어. 동의나 승낙을 나타냄.",
    examples: ["ㅇㅋ 알겠어", "ㅇㅋㅇㅋ", "내일 만나자 ㅇㅋ?"],
    relatedTerms: ["OK", "응", "그래"],
    tags: ["초성약어", "동의", "인터넷용어"],
    categoryId: "abbreviation",
    subcategoryId: "initial-abbreviations",
  },
  {
    id: "abbreviation-gs",
    term: "ㄱㅅ",
    pronunciation: "감사",
    definition: "'감사'의 초성 약어. 감사 인사를 간략하게 표현.",
    examples: ["ㄱㅅ!", "도와줘서 ㄱㅅ", "ㄱㅅㄱㅅ"],
    relatedTerms: ["감사", "고마워", "땡큐"],
    tags: ["초성약어", "감사", "인터넷용어"],
    categoryId: "abbreviation",
    subcategoryId: "initial-abbreviations",
  },
  {
    id: "abbreviation-naver",
    term: "네이버",
    pronunciation: "네이버",
    definition: "한국의 대표적인 포털 사이트. 검색하라는 의미로 '네이버 해봐'처럼 사용.",
    examples: ["네이버에서 찾아봐", "네이버 검색 결과"],
    relatedTerms: ["검색", "포털"],
    tags: ["약어", "인터넷", "서비스명"],
    categoryId: "abbreviation",
    subcategoryId: "korean-abbreviations",
  },

  // 문장/문맥 - 존댓말
  {
    id: "sentence-honorific-seyo",
    term: "~세요",
    pronunciation: "세요",
    definition: "존경의 의미를 담은 명령형 어미. '-시-'와 '-어요'의 결합.",
    examples: ["안녕하세요", "들어오세요", "드세요"],
    relatedTerms: ["~십시오", "~하세요"],
    tags: ["존댓말", "어미", "경어"],
    categoryId: "sentence",
    subcategoryId: "honorifics",
  },
  {
    id: "sentence-honorific-yo",
    term: "~요",
    pronunciation: "요",
    definition: "해요체의 종결 어미. 비격식적이지만 공손한 느낌.",
    examples: ["네, 알겠어요", "좋아요", "그래요"],
    relatedTerms: ["~습니다", "~해요"],
    tags: ["존댓말", "어미", "해요체"],
    categoryId: "sentence",
    subcategoryId: "honorifics",
  },

  // 문장/문맥 - 관용구
  {
    id: "sentence-idiom-bab",
    term: "밥 먹듯이",
    pronunciation: "밥 먹듯이",
    definition: "어떤 일을 매우 자주, 습관적으로 한다는 뜻의 관용구.",
    examples: ["거짓말을 밥 먹듯이 한다", "늦잠을 밥 먹듯이 잔다"],
    relatedTerms: ["습관적으로", "자주"],
    tags: ["관용구", "비유", "빈도"],
    categoryId: "sentence",
    subcategoryId: "idioms",
  },
  {
    id: "sentence-idiom-sonbat",
    term: "손이 크다",
    pronunciation: "손이 크다",
    definition: "씀씀이가 후하다는 뜻의 관용구. 음식을 많이 만들거나 선물을 크게 할 때 사용.",
    examples: ["우리 엄마는 손이 커서 항상 음식을 많이 해", "손이 큰 사람"],
    relatedTerms: ["후하다", "넉넉하다"],
    tags: ["관용구", "성격", "비유"],
    categoryId: "sentence",
    subcategoryId: "idioms",
  },

  // 문장/문맥 - 속담
  {
    id: "sentence-proverb-gaetton",
    term: "개똥도 약에 쓰려면 없다",
    pronunciation: "개똥도 약에 쓰려면 없다",
    definition: "아무리 흔한 것도 막상 필요할 때는 구하기 어렵다는 뜻.",
    examples: ["평소에는 많더니 개똥도 약에 쓰려면 없네"],
    relatedTerms: ["필요", "희귀"],
    tags: ["속담", "격언", "필요"],
    categoryId: "sentence",
    subcategoryId: "proverbs",
  },
  {
    id: "sentence-proverb-se-sal",
    term: "세 살 버릇 여든까지 간다",
    pronunciation: "세 살 버릇 여든까지 간다",
    definition: "어린 시절에 형성된 습관은 평생 가기 어렵다는 뜻. 어릴 때 좋은 습관을 들여야 함을 강조.",
    examples: ["세 살 버릇 여든까지 간다더니 정말이네"],
    relatedTerms: ["습관", "교육"],
    tags: ["속담", "격언", "습관"],
    categoryId: "sentence",
    subcategoryId: "proverbs",
  },
];

// 카테고리별 어휘 가져오기
export function getEntriesByCategory(categoryId: string): VocabEntry[] {
  return vocabEntries.filter((e) => e.categoryId === categoryId);
}

// 하위 카테고리별 어휘 가져오기
export function getEntriesBySubcategory(
  categoryId: string,
  subcategoryId: string
): VocabEntry[] {
  return vocabEntries.filter(
    (e) => e.categoryId === categoryId && e.subcategoryId === subcategoryId
  );
}

// ID로 어휘 가져오기
export function getEntryById(id: string): VocabEntry | undefined {
  return vocabEntries.find((e) => e.id === id);
}

// 검색
export function searchEntries(query: string): VocabEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return vocabEntries.filter(
    (e) =>
      e.term.toLowerCase().includes(q) ||
      e.definition.toLowerCase().includes(q) ||
      e.examples.some((ex) => ex.toLowerCase().includes(q)) ||
      e.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

// 태그로 검색
export function getEntriesByTag(tag: string): VocabEntry[] {
  return vocabEntries.filter((e) =>
    e.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}
