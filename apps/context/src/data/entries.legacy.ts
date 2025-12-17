import type { MeaningEntry, Language } from "./types";

export const meaningEntries: MeaningEntry[] = [
  // Greetings
  {
    id: "annyeong",
    korean: "안녕",
    romanization: "annyeong",
    partOfSpeech: "interjection",
    categoryId: "greetings",
    difficulty: "beginner",
    frequency: "common",
    tags: ["casual", "informal", "daily"],
    translations: {
      ko: {
        word: "안녕",
        explanation: "친구나 또래 사이에서 사용하는 반말 인사. 상황에 따라 '만나서 반가워'와 '잘 가'의 의미로 모두 쓰인다. 격식 없는 상황에서 사용한다.",
        examples: [
          "안녕! 오랜만이야!",
          "안녕, 내일 봐!",
        ],
        variations: {
          formal: [
            "안녕하십니까, 오래간만입니다.",
            "안녕하세요, 그동안 잘 지내셨어요?",
          ],
          casual: [
            "안녕, 잘 지냈어?",
            "안녕~ 뭐해?",
            "야, 안녕!",
          ],
          short: [
            "ㅎㅇ",
            "안녕~",
          ],
        },
      },
      en: {
        word: "Hi / Bye",
        explanation: "A casual greeting used among friends and peers. Can mean both 'hello' and 'goodbye' depending on context. Used in informal situations.",
        examples: [
          "안녕! 오랜만이야! - Hi! Long time no see!",
          "안녕, 내일 봐! - Bye, see you tomorrow!",
        ],
        variations: {
          formal: [
            "Hello, it's been a while.",
            "Good day, how have you been?",
          ],
          casual: [
            "Hey, what's up?",
            "Hi there!",
            "Yo, what's going on?",
          ],
          short: [
            "Hi~",
            "Hey!",
            "Sup?",
          ],
        },
      },
      ja: {
        word: "やあ / じゃあね",
        reading: "アンニョン",
        explanation: "友達同士で使うカジュアルな挨拶。文脈によって「こんにちは」と「さようなら」の両方の意味があります。",
        examples: [
          "안녕! 오랜만이야! - やあ！久しぶり！",
          "안녕, 내일 봐! - じゃあね、また明日！",
        ],
        variations: {
          formal: [
            "お久しぶりでございます。",
            "こんにちは、お元気でしたか？",
          ],
          casual: [
            "やあ、元気？",
            "おっす！何してる？",
            "よお、久しぶり！",
          ],
          short: [
            "やあ～",
            "おす！",
          ],
        },
      },
    },
  },
  {
    id: "annyeonghaseyo",
    korean: "안녕하세요",
    romanization: "annyeonghaseyo",
    partOfSpeech: "interjection",
    categoryId: "greetings",
    difficulty: "beginner",
    frequency: "common",
    tags: ["formal", "polite", "daily"],
    translations: {
      ko: {
        word: "안녕하세요",
        explanation: "한국어의 기본적인 존댓말 인사. 누군가를 만나거나 대화를 시작할 때 사용한다. 대부분의 상황에 적절한 인사말이다.",
        examples: [
          "안녕하세요, 처음 뵙겠습니다.",
          "안녕하세요! 잘 지내셨어요?",
        ],
        variations: {
          formal: [
            "안녕하십니까, 뵙게 되어 영광입니다.",
            "안녕하세요, 만나 뵙게 되어 반갑습니다.",
            "안녕하세요, 오늘 하루도 좋은 하루 되세요.",
          ],
          casual: [
            "안녕, 반가워!",
            "안녕! 잘 지내?",
          ],
          short: [
            "안녕~",
            "하이!",
          ],
        },
      },
      en: {
        word: "Hello",
        explanation: "The standard polite greeting in Korean. Used when meeting someone or starting a conversation. Appropriate for most situations.",
        examples: [
          "안녕하세요, 처음 뵙겠습니다. - Hello, nice to meet you.",
          "안녕하세요! 잘 지내셨어요? - Hello! How have you been?",
        ],
        variations: {
          formal: [
            "Good morning/afternoon, it's a pleasure to meet you.",
            "Hello, I'm honored to make your acquaintance.",
            "Greetings, I hope you're doing well.",
          ],
          casual: [
            "Hey! Nice to see you!",
            "Hi! How's it going?",
          ],
          short: [
            "Hey~",
            "Hi!",
          ],
        },
      },
      ja: {
        word: "こんにちは",
        reading: "アンニョンハセヨ",
        explanation: "韓国語の標準的な丁寧な挨拶です。誰かに会った時や会話を始める時に使います。",
        examples: [
          "안녕하세요, 처음 뵙겠습니다. - こんにちは、初めまして。",
          "안녕하세요! 잘 지내셨어요? - こんにちは！お元気でしたか？",
        ],
        variations: {
          formal: [
            "おはようございます、お会いできて光栄です。",
            "こんにちは、お目にかかれて嬉しいです。",
            "ご機嫌いかがでしょうか。",
          ],
          casual: [
            "やあ！会えて嬉しい！",
            "おっす！元気？",
          ],
          short: [
            "ちわ～",
            "やあ！",
          ],
        },
      },
    },
  },
  {
    id: "gomapseumnida",
    korean: "감사합니다",
    romanization: "gamsahamnida",
    pronunciation: "[감사함니다]",
    hanja: "感謝",
    partOfSpeech: "interjection",
    categoryId: "greetings",
    difficulty: "beginner",
    frequency: "common",
    tags: ["formal", "polite", "gratitude"],
    translations: {
      ko: {
        word: "감사합니다",
        explanation: "감사를 표현하는 격식체 표현. '고마워요'보다 더 격식 있는 표현으로, 직장이나 어른에게 사용한다.",
        examples: [
          "도와주셔서 감사합니다.",
          "감사합니다, 좋은 하루 되세요.",
        ],
        variations: {
          formal: [
            "정말 감사드립니다.",
            "진심으로 감사의 말씀을 드립니다.",
            "감사합니다, 덕분에 큰 도움이 되었습니다.",
          ],
          casual: [
            "고마워!",
            "땡큐~",
            "고마워, 정말 도움이 됐어!",
          ],
          short: [
            "ㄱㅅ",
            "감사~",
            "땡스!",
          ],
        },
      },
      en: {
        word: "Thank you",
        explanation: "Formal way to express gratitude. More formal than '고마워요'. Used in professional settings and with elders.",
        examples: [
          "도와주셔서 감사합니다. - Thank you for helping me.",
          "감사합니다, 좋은 하루 되세요. - Thank you, have a nice day.",
        ],
        variations: {
          formal: [
            "I sincerely appreciate your help.",
            "Thank you very much for your assistance.",
            "I'm deeply grateful for your kindness.",
          ],
          casual: [
            "Thanks a lot!",
            "Thanks, you're the best!",
            "Thank you so much!",
          ],
          short: [
            "Thx!",
            "Ty!",
            "Thanks~",
          ],
        },
      },
      ja: {
        word: "ありがとうございます",
        reading: "カムサハムニダ",
        explanation: "感謝を表す丁寧な表現です。'고마워요'よりフォーマルで、ビジネスシーンや目上の人に使います。",
        examples: [
          "도와주셔서 감사합니다. - 手伝ってくださりありがとうございます。",
          "감사합니다, 좋은 하루 되세요. - ありがとうございます、良い一日を。",
        ],
        variations: {
          formal: [
            "誠にありがとうございます。",
            "心より感謝申し上げます。",
            "ご協力いただき、深く感謝いたします。",
          ],
          casual: [
            "ありがと！",
            "サンキュー！",
            "ありがとね、助かったよ！",
          ],
          short: [
            "あざす！",
            "あり～",
            "39！",
          ],
        },
      },
    },
  },
  {
    id: "annyeonghigaseyo",
    korean: "안녕히 가세요",
    romanization: "annyeonghi gaseyo",
    partOfSpeech: "expression",
    categoryId: "greetings",
    difficulty: "beginner",
    frequency: "common",
    tags: ["formal", "farewell", "polite"],
    translations: {
      ko: {
        word: "안녕히 가세요",
        explanation: "떠나는 사람에게 하는 인사. 직역하면 '평안히 가세요'라는 뜻. 자신이 남고 상대가 떠날 때 사용한다. 반대 표현은 '안녕히 계세요'(평안히 계세요)이다.",
        examples: [
          "안녕히 가세요! 조심히 가세요.",
        ],
        variations: {
          formal: [
            "안녕히 가십시오, 좋은 하루 되세요.",
            "조심히 돌아가세요, 다음에 또 뵙겠습니다.",
          ],
          casual: [
            "잘 가!",
            "가는 길 조심해~",
            "나중에 봐!",
          ],
          short: [
            "잘 가~",
            "바이바이!",
            "빠이~",
          ],
        },
      },
      en: {
        word: "Goodbye (to someone leaving)",
        explanation: "Said to someone who is leaving while you stay. Literally means 'go peacefully'. The counterpart is '안녕히 계세요' (stay peacefully).",
        examples: [
          "안녕히 가세요! 조심히 가세요. - Goodbye! Be careful on your way.",
        ],
        variations: {
          formal: [
            "Farewell, have a safe journey.",
            "Goodbye, I hope to see you again soon.",
          ],
          casual: [
            "See ya!",
            "Take care on your way!",
            "Later!",
          ],
          short: [
            "Bye~",
            "Cya!",
            "Peace!",
          ],
        },
      },
      ja: {
        word: "さようなら（去る人へ）",
        reading: "アンニョンヒ カセヨ",
        explanation: "自分が残り、相手が去る時に使う別れの挨拶。直訳は「安寧にお行きください」。対の表現は「안녕히 계세요」（安寧にお居てください）。",
        examples: [
          "안녕히 가세요! 조심히 가세요. - さようなら！気をつけて。",
        ],
        variations: {
          formal: [
            "お気をつけてお帰りください。",
            "またお会いできることを楽しみにしております。",
          ],
          casual: [
            "じゃあね！",
            "気をつけてね～",
            "また今度！",
          ],
          short: [
            "バイバイ！",
            "じゃね～",
            "ノシ",
          ],
        },
      },
    },
  },

  // Emotions
  {
    id: "sarang",
    korean: "사랑",
    romanization: "sarang",
    partOfSpeech: "noun",
    categoryId: "emotions",
    difficulty: "beginner",
    frequency: "common",
    tags: ["emotion", "relationship"],
    translations: {
      ko: {
        word: "사랑",
        explanation: "누군가나 무언가에 대한 깊은 애정. 연인 간의 사랑, 가족 간의 사랑, 취미나 활동에 대한 사랑 등 다양하게 쓰인다.",
        examples: [
          "사랑해요.",
          "가족의 사랑은 소중해요.",
        ],
        variations: {
          formal: [
            "당신을 진심으로 사랑합니다.",
            "사랑하고 존경합니다.",
            "항상 사랑하는 마음 변치 않겠습니다.",
          ],
          casual: [
            "사랑해!",
            "너무 좋아해~",
            "나 너 진짜 좋아해.",
          ],
          short: [
            "ㅅㄹㅎ",
            "사랑행~",
            "좋아♥",
          ],
        },
      },
      en: {
        word: "Love",
        explanation: "A deep affection for someone or something. Used for romantic love, family love, and love for things/activities.",
        examples: [
          "사랑해요. - I love you.",
          "가족의 사랑은 소중해요. - Family love is precious.",
        ],
        variations: {
          formal: [
            "I sincerely love you.",
            "My love and respect for you is eternal.",
            "You have all my love and devotion.",
          ],
          casual: [
            "Love ya!",
            "I really like you~",
            "You mean so much to me!",
          ],
          short: [
            "Luv u!",
            "ILY",
            "<3",
          ],
        },
      },
      ja: {
        word: "愛",
        reading: "サラン",
        explanation: "誰かや何かへの深い愛情。恋愛、家族愛、物事への愛など幅広く使われます。",
        examples: [
          "사랑해요. - 愛しています。",
          "가족의 사랑은 소중해요. - 家族の愛は大切です。",
        ],
        variations: {
          formal: [
            "心から愛しております。",
            "あなたを深く愛しています。",
            "永遠に愛を誓います。",
          ],
          casual: [
            "好きだよ！",
            "大好き～",
            "めっちゃ好き！",
          ],
          short: [
            "すき♥",
            "ラブ～",
            "好き好き！",
          ],
        },
      },
    },
  },
  {
    id: "haengbok",
    korean: "행복",
    romanization: "haengbok",
    pronunciation: "[행복]",
    hanja: "幸福",
    partOfSpeech: "noun",
    categoryId: "emotions",
    difficulty: "beginner",
    frequency: "common",
    tags: ["emotion", "positive"],
    translations: {
      ko: {
        word: "행복",
        explanation: "행복하거나 만족스러운 상태. 명사 '행복' 또는 형용사 '행복하다'로 사용할 수 있다.",
        examples: [
          "행복하세요!",
          "작은 것에서 행복을 찾아요.",
        ],
        variations: {
          formal: [
            "행복하시길 바랍니다.",
            "모든 일에 행복이 함께하시길 기원합니다.",
            "항상 행복하고 건강하시길 바랍니다.",
          ],
          casual: [
            "행복해!",
            "너무 행복해~",
            "진짜 행복하다!",
          ],
          short: [
            "행복♥",
            "최고!",
            "굿굿~",
          ],
        },
      },
      en: {
        word: "Happiness",
        explanation: "A state of being happy or content. Can be used as noun '행복' or adjective '행복하다' (to be happy).",
        examples: [
          "행복하세요! - Be happy!",
          "작은 것에서 행복을 찾아요. - I find happiness in small things.",
        ],
        variations: {
          formal: [
            "I wish you happiness.",
            "May happiness be with you always.",
            "Wishing you all the best and happiness.",
          ],
          casual: [
            "So happy!",
            "I'm so happy right now~",
            "This makes me really happy!",
          ],
          short: [
            "Happy♥",
            "Yay!",
            ":D",
          ],
        },
      },
      ja: {
        word: "幸せ",
        reading: "ヘンボク",
        explanation: "幸せな状態のこと。名詞の「행복」、形容詞の「행복하다」（幸せだ）として使えます。",
        examples: [
          "행복하세요! - 幸せでありますように！",
          "작은 것에서 행복을 찾아요. - 小さなことに幸せを見つけます。",
        ],
        variations: {
          formal: [
            "ご多幸をお祈り申し上げます。",
            "いつも幸せでいらっしゃいますように。",
            "末永くお幸せに。",
          ],
          casual: [
            "幸せ！",
            "めっちゃ幸せ～",
            "超ハッピー！",
          ],
          short: [
            "幸せ♥",
            "最高！",
            "ハピ～",
          ],
        },
      },
    },
  },
  {
    id: "seulpeum",
    korean: "슬픔",
    romanization: "seulpeum",
    partOfSpeech: "noun",
    categoryId: "emotions",
    difficulty: "intermediate",
    frequency: "frequent",
    tags: ["emotion", "negative"],
    translations: {
      ko: {
        word: "슬픔",
        explanation: "슬프거나 불행한 감정. 형용사형은 '슬프다'이다.",
        examples: [
          "슬픔을 참을 수 없어요.",
          "슬픔도 지나가요.",
        ],
      },
      en: {
        word: "Sadness",
        explanation: "A feeling of sorrow or unhappiness. The adjective form is '슬프다' (to be sad).",
        examples: [
          "슬픔을 참을 수 없어요. - I can't hold back my sadness.",
          "슬픔도 지나가요. - Sadness also passes.",
        ],
      },
      ja: {
        word: "悲しみ",
        reading: "スルプム",
        explanation: "悲しい気持ちや不幸な感情。形容詞形は「슬프다」（悲しい）です。",
        examples: [
          "슬픔을 참을 수 없어요. - 悲しみを抑えられません。",
          "슬픔도 지나가요. - 悲しみも過ぎ去ります。",
        ],
      },
    },
  },

  // Daily Life
  {
    id: "jip",
    korean: "집",
    romanization: "jip",
    partOfSpeech: "noun",
    categoryId: "daily-life",
    difficulty: "beginner",
    frequency: "common",
    tags: ["place", "basic"],
    translations: {
      ko: {
        word: "집",
        explanation: "사람이 사는 건물, 또는 '가정'의 개념. 가장 기본적이고 자주 쓰이는 단어 중 하나이다.",
        examples: [
          "집에 가고 싶어요.",
          "우리 집은 서울에 있어요.",
        ],
      },
      en: {
        word: "House / Home",
        explanation: "A building where people live, or the concept of 'home'. One of the most basic and frequently used words.",
        examples: [
          "집에 가고 싶어요. - I want to go home.",
          "우리 집은 서울에 있어요. - My house is in Seoul.",
        ],
      },
      ja: {
        word: "家",
        reading: "チプ",
        explanation: "人が住む建物、または「家庭」の概念。最も基本的でよく使われる単語の一つです。",
        examples: [
          "집에 가고 싶어요. - 家に帰りたいです。",
          "우리 집은 서울에 있어요. - 私の家はソウルにあります。",
        ],
      },
    },
  },
  {
    id: "hakgyo",
    korean: "학교",
    romanization: "hakgyo",
    pronunciation: "[학꾜]",
    hanja: "學校",
    partOfSpeech: "noun",
    categoryId: "daily-life",
    difficulty: "beginner",
    frequency: "common",
    tags: ["place", "education"],
    translations: {
      ko: {
        word: "학교",
        explanation: "학생들을 교육하는 기관. 초등학교, 중학교, 고등학교, 대학교를 포함한다.",
        examples: [
          "학교에 다녀요.",
          "학교 끝나고 뭐 해?",
        ],
      },
      en: {
        word: "School",
        explanation: "An institution for educating students. Includes elementary, middle, high school, and university.",
        examples: [
          "학교에 다녀요. - I go to school.",
          "학교 끝나고 뭐 해? - What are you doing after school?",
        ],
      },
      ja: {
        word: "学校",
        reading: "ハッキョ",
        explanation: "学生を教育する機関。小学校、中学校、高校、大学を含みます。",
        examples: [
          "학교에 다녀요. - 学校に通っています。",
          "학교 끝나고 뭐 해? - 学校が終わったら何する？",
        ],
      },
    },
  },
  {
    id: "il",
    korean: "일",
    romanization: "il",
    partOfSpeech: "noun",
    categoryId: "daily-life",
    difficulty: "beginner",
    frequency: "common",
    tags: ["work", "basic"],
    translations: {
      ko: {
        word: "일",
        explanation: "직업이나 업무, 또는 '일/사건'을 의미한다. 숫자 '일(一)'로도 쓰인다 (일, 이, 삼...).",
        examples: [
          "일이 많아요.",
          "무슨 일이에요?",
        ],
      },
      en: {
        word: "Work / Job / Thing",
        explanation: "Can mean work/job, a task, or 'a thing/matter'. Also means the number 'one' (일, 이, 삼...).",
        examples: [
          "일이 많아요. - I have a lot of work.",
          "무슨 일이에요? - What's the matter?",
        ],
      },
      ja: {
        word: "仕事 / 事",
        reading: "イル",
        explanation: "仕事や作業、または「事柄」の意味があります。数字の「一」（일, 이, 삼...）としても使われます。",
        examples: [
          "일이 많아요. - 仕事が多いです。",
          "무슨 일이에요? - どうしましたか？",
        ],
      },
    },
  },

  // Food
  {
    id: "bap",
    korean: "밥",
    romanization: "bap",
    partOfSpeech: "noun",
    categoryId: "food",
    difficulty: "beginner",
    frequency: "common",
    tags: ["food", "basic", "staple"],
    translations: {
      ko: {
        word: "밥",
        explanation: "지은 쌀, 한국의 주식. '식사' 전체를 의미하기도 한다. '밥 먹었어?'(식사했어?)는 일상적인 인사다.",
        examples: [
          "밥 먹었어요?",
          "밥 먹으러 가자!",
        ],
      },
      en: {
        word: "Rice / Meal",
        explanation: "Cooked rice, the staple food of Korea. Also used to mean 'meal' in general. '밥 먹었어?' (Did you eat?) is a common greeting.",
        examples: [
          "밥 먹었어요? - Have you eaten?",
          "밥 먹으러 가자! - Let's go eat!",
        ],
      },
      ja: {
        word: "ご飯",
        reading: "パプ",
        explanation: "炊いた米、韓国の主食。「食事」全般を意味することもあります。「밥 먹었어?」（ご飯食べた？）は一般的な挨拶です。",
        examples: [
          "밥 먹었어요? - ご飯食べましたか？",
          "밥 먹으러 가자! - ご飯食べに行こう！",
        ],
      },
    },
  },
  {
    id: "kimchi",
    korean: "김치",
    romanization: "kimchi",
    partOfSpeech: "noun",
    categoryId: "food",
    difficulty: "beginner",
    frequency: "common",
    tags: ["food", "korean", "traditional"],
    translations: {
      ko: {
        word: "김치",
        explanation: "한국 전통 발효 채소 요리. 주로 배추와 무로 만든다. 한국 음식의 기본 반찬이다.",
        examples: [
          "김치 좋아해요?",
          "김치찌개 먹고 싶어요.",
        ],
      },
      en: {
        word: "Kimchi",
        explanation: "Traditional Korean fermented vegetable dish, usually made with napa cabbage and radish. A staple side dish in Korean cuisine.",
        examples: [
          "김치 좋아해요? - Do you like kimchi?",
          "김치찌개 먹고 싶어요. - I want to eat kimchi stew.",
        ],
      },
      ja: {
        word: "キムチ",
        reading: "キムチ",
        explanation: "韓国の伝統的な発酵野菜料理。通常、白菜や大根で作られます。韓国料理の定番おかずです。",
        examples: [
          "김치 좋아해요? - キムチ好きですか？",
          "김치찌개 먹고 싶어요. - キムチチゲが食べたいです。",
        ],
      },
    },
  },
  {
    id: "mul",
    korean: "물",
    romanization: "mul",
    partOfSpeech: "noun",
    categoryId: "food",
    difficulty: "beginner",
    frequency: "common",
    tags: ["drink", "basic"],
    translations: {
      ko: {
        word: "물",
        explanation: "가장 기본적인 음료. 식당에서 주문할 때 필수 어휘다.",
        examples: [
          "물 주세요.",
          "물 마시고 싶어요.",
        ],
      },
      en: {
        word: "Water",
        explanation: "The most basic drink. Essential vocabulary for ordering at restaurants.",
        examples: [
          "물 주세요. - Water, please.",
          "물 마시고 싶어요. - I want to drink water.",
        ],
      },
      ja: {
        word: "水",
        reading: "ムル",
        explanation: "最も基本的な飲み物。レストランで注文する時に必須の単語です。",
        examples: [
          "물 주세요. - お水ください。",
          "물 마시고 싶어요. - 水が飲みたいです。",
        ],
      },
    },
  },

  // Travel
  {
    id: "yeogi",
    korean: "여기",
    romanization: "yeogi",
    partOfSpeech: "pronoun",
    categoryId: "travel",
    difficulty: "beginner",
    frequency: "common",
    tags: ["location", "basic"],
    translations: {
      ko: {
        word: "여기",
        explanation: "말하는 사람 가까이에 있는 장소를 가리킨다. 여기(이곳), 거기(그곳), 저기(저곳) 세 가지 중 하나다.",
        examples: [
          "여기가 어디예요?",
          "여기 앉으세요.",
        ],
      },
      en: {
        word: "Here",
        explanation: "Indicates a location near the speaker. Part of the trio: 여기 (here), 거기 (there), 저기 (over there).",
        examples: [
          "여기가 어디예요? - Where is this place?",
          "여기 앉으세요. - Please sit here.",
        ],
      },
      ja: {
        word: "ここ",
        reading: "ヨギ",
        explanation: "話し手の近くの場所を示します。여기（ここ）、거기（そこ）、저기（あそこ）の三つ組の一つです。",
        examples: [
          "여기가 어디예요? - ここはどこですか？",
          "여기 앉으세요. - ここに座ってください。",
        ],
      },
    },
  },
  {
    id: "eodi",
    korean: "어디",
    romanization: "eodi",
    partOfSpeech: "pronoun",
    categoryId: "travel",
    difficulty: "beginner",
    frequency: "common",
    tags: ["question", "location"],
    translations: {
      ko: {
        word: "어디",
        explanation: "장소나 위치를 묻는 의문사. 길을 묻거나 방향을 확인할 때 필수 어휘다.",
        examples: [
          "어디 가요?",
          "화장실이 어디에 있어요?",
        ],
      },
      en: {
        word: "Where",
        explanation: "A question word asking about location or place. Essential for navigation and asking directions.",
        examples: [
          "어디 가요? - Where are you going?",
          "화장실이 어디에 있어요? - Where is the bathroom?",
        ],
      },
      ja: {
        word: "どこ",
        reading: "オディ",
        explanation: "場所を尋ねる疑問詞。道を尋ねたり方向を確認したりする時に必須の単語です。",
        examples: [
          "어디 가요? - どこに行きますか？",
          "화장실이 어디에 있어요? - トイレはどこにありますか？",
        ],
      },
    },
  },

  // Work
  {
    id: "hoesa",
    korean: "회사",
    romanization: "hoesa",
    hanja: "會社",
    partOfSpeech: "noun",
    categoryId: "work",
    difficulty: "beginner",
    frequency: "common",
    tags: ["work", "business"],
    translations: {
      ko: {
        word: "회사",
        explanation: "사업 조직이나 기업. 직장에 대해 이야기할 때 사용한다.",
        examples: [
          "회사에 가요.",
          "어느 회사에 다녀요?",
        ],
      },
      en: {
        word: "Company",
        explanation: "A business organization or corporation. Used when talking about workplace.",
        examples: [
          "회사에 가요. - I'm going to work (company).",
          "어느 회사에 다녀요? - Which company do you work at?",
        ],
      },
      ja: {
        word: "会社",
        reading: "フェサ",
        explanation: "ビジネス組織や企業のこと。職場について話す時に使います。",
        examples: [
          "회사에 가요. - 会社に行きます。",
          "어느 회사에 다녀요? - どの会社に勤めていますか？",
        ],
      },
    },
  },
  {
    id: "hoeuii",
    korean: "회의",
    romanization: "hoeui",
    hanja: "會議",
    partOfSpeech: "noun",
    categoryId: "work",
    difficulty: "intermediate",
    frequency: "frequent",
    tags: ["work", "business"],
    translations: {
      ko: {
        word: "회의",
        explanation: "논의를 위한 모임. 주로 비즈니스 상황에서 사용한다.",
        examples: [
          "회의가 있어요.",
          "회의 끝났어요?",
        ],
      },
      en: {
        word: "Meeting",
        explanation: "A gathering of people for discussion, usually in a business context.",
        examples: [
          "회의가 있어요. - I have a meeting.",
          "회의 끝났어요? - Is the meeting over?",
        ],
      },
      ja: {
        word: "会議",
        reading: "フェイ",
        explanation: "議論のための集まり。通常、ビジネスの文脈で使われます。",
        examples: [
          "회의가 있어요. - 会議があります。",
          "회의 끝났어요? - 会議は終わりましたか？",
        ],
      },
    },
  },

  // Culture
  {
    id: "jeong",
    korean: "정",
    romanization: "jeong",
    hanja: "情",
    partOfSpeech: "noun",
    categoryId: "culture",
    difficulty: "advanced",
    frequency: "frequent",
    tags: ["culture", "emotion", "korean-concept"],
    translations: {
      ko: {
        word: "정",
        explanation: "시간이 지나면서 형성되는 깊은 감정적 유대, 애착을 나타내는 한국 고유의 개념. 사랑, 배려, 연결감을 포함한다.",
        examples: [
          "정이 들었어요.",
          "정이 많은 사람이에요.",
        ],
      },
      en: {
        word: "Jeong (emotional bond)",
        explanation: "A uniquely Korean concept describing deep emotional bonds, affection, and attachment formed over time. Difficult to translate directly - encompasses love, care, and connection.",
        examples: [
          "정이 들었어요. - I've grown attached.",
          "정이 많은 사람이에요. - They're a warm-hearted person.",
        ],
      },
      ja: {
        word: "情（ジョン）",
        reading: "チョン",
        explanation: "韓国特有の概念で、時間をかけて形成される深い感情的な絆、愛着を表します。直訳が難しく、愛情、思いやり、繋がりを包含します。",
        examples: [
          "정이 들었어요. - 情が湧きました。",
          "정이 많은 사람이에요. - 情の深い人です。",
        ],
      },
    },
  },
  {
    id: "nunchi",
    korean: "눈치",
    romanization: "nunchi",
    partOfSpeech: "noun",
    categoryId: "culture",
    difficulty: "advanced",
    frequency: "frequent",
    tags: ["culture", "social", "korean-concept"],
    translations: {
      ko: {
        word: "눈치",
        explanation: "분위기를 파악하고 암묵적인 사회적 신호를 이해하는 능력. 한국의 사회적 상호작용에서 중요한 개념이다.",
        examples: [
          "눈치가 빨라요.",
          "눈치 좀 봐!",
        ],
      },
      en: {
        word: "Nunchi (social awareness)",
        explanation: "The art of reading the room and understanding unspoken social cues. Essential in Korean social interactions.",
        examples: [
          "눈치가 빨라요. - You're quick to catch on.",
          "눈치 좀 봐! - Read the room!",
        ],
      },
      ja: {
        word: "ヌンチ（空気を読む力）",
        reading: "ヌンチ",
        explanation: "場の空気を読み、暗黙の社会的シグナルを理解する技術。韓国の社会的交流において重要な概念です。",
        examples: [
          "눈치가 빨라요. - 察しが早いですね。",
          "눈치 좀 봐! - 空気読んで！",
        ],
      },
    },
  },

  // Numbers & Time
  {
    id: "hana",
    korean: "하나",
    romanization: "hana",
    partOfSpeech: "noun",
    categoryId: "numbers",
    difficulty: "beginner",
    frequency: "common",
    tags: ["number", "native-korean"],
    translations: {
      ko: {
        word: "하나",
        explanation: "고유어 수사로 '일(1)'을 나타낸다. 물건을 셀 때, 나이(살과 함께), 시간에 사용한다. 한자어 일(一)과는 다르다.",
        examples: [
          "하나, 둘, 셋!",
          "커피 하나 주세요.",
        ],
      },
      en: {
        word: "One (native Korean)",
        explanation: "The native Korean number for 'one'. Used for counting objects, age (with 살), and hours. Different from Sino-Korean 일 (il).",
        examples: [
          "하나, 둘, 셋! - One, two, three!",
          "커피 하나 주세요. - One coffee, please.",
        ],
      },
      ja: {
        word: "一つ（固有語）",
        reading: "ハナ",
        explanation: "韓国固有の数詞で「一」を表します。物を数える時、年齢（살と一緒に）、時間に使います。漢数詞の일とは異なります。",
        examples: [
          "하나, 둘, 셋! - 一つ、二つ、三つ！",
          "커피 하나 주세요. - コーヒー一つください。",
        ],
      },
    },
  },
  {
    id: "oneul",
    korean: "오늘",
    romanization: "oneul",
    partOfSpeech: "noun",
    categoryId: "numbers",
    difficulty: "beginner",
    frequency: "common",
    tags: ["time", "basic"],
    translations: {
      ko: {
        word: "오늘",
        explanation: "현재의 날. 기본 시간 어휘인 어제, 오늘, 내일 중 하나다.",
        examples: [
          "오늘 뭐 해요?",
          "오늘 날씨가 좋아요.",
        ],
      },
      en: {
        word: "Today",
        explanation: "The current day. Part of the basic time vocabulary: 어제 (yesterday), 오늘 (today), 내일 (tomorrow).",
        examples: [
          "오늘 뭐 해요? - What are you doing today?",
          "오늘 날씨가 좋아요. - The weather is nice today.",
        ],
      },
      ja: {
        word: "今日",
        reading: "オヌル",
        explanation: "今日のこと。基本的な時間の単語：어제（昨日）、오늘（今日）、내일（明日）の一つです。",
        examples: [
          "오늘 뭐 해요? - 今日何しますか？",
          "오늘 날씨가 좋아요. - 今日は天気がいいですね。",
        ],
      },
    },
  },

  // Music
  {
    id: "piano",
    korean: "피아노",
    romanization: "piano",
    partOfSpeech: "noun",
    categoryId: "music",
    difficulty: "beginner",
    frequency: "common",
    tags: ["instrument", "music"],
    translations: {
      ko: {
        word: "피아노",
        explanation: "건반 악기. 클래식부터 팝까지 다양한 장르에서 사용되는 대표적인 악기.",
        examples: ["피아노를 배우고 있어요.", "피아노 연주가 아름다워요."],
      },
      en: {
        word: "Piano",
        explanation: "A keyboard instrument. One of the most popular instruments used across various genres from classical to pop.",
        examples: ["피아노를 배우고 있어요. - I'm learning piano.", "피아노 연주가 아름다워요. - The piano performance is beautiful."],
      },
      ja: {
        word: "ピアノ",
        reading: "ピアノ",
        explanation: "鍵盤楽器。クラシックからポップまで様々なジャンルで使われる代表的な楽器。",
        examples: ["피아노를 배우고 있어요. - ピアノを習っています。", "피아노 연주가 아름다워요. - ピアノの演奏が美しいです。"],
      },
    },
  },
  {
    id: "gita",
    korean: "기타",
    romanization: "gita",
    partOfSpeech: "noun",
    categoryId: "music",
    difficulty: "beginner",
    frequency: "common",
    tags: ["instrument", "music"],
    translations: {
      ko: {
        word: "기타",
        explanation: "현악기의 일종. 어쿠스틱 기타와 일렉트릭 기타가 있다.",
        examples: ["기타 칠 줄 알아요?", "기타 소리가 좋아요."],
      },
      en: {
        word: "Guitar",
        explanation: "A string instrument. Includes acoustic and electric guitars.",
        examples: ["기타 칠 줄 알아요? - Can you play the guitar?", "기타 소리가 좋아요. - The guitar sound is nice."],
      },
      ja: {
        word: "ギター",
        reading: "キタ",
        explanation: "弦楽器の一種。アコースティックギターとエレキギターがある。",
        examples: ["기타 칠 줄 알아요? - ギター弾けますか？", "기타 소리가 좋아요. - ギターの音がいいですね。"],
      },
    },
  },
  {
    id: "norae",
    korean: "노래",
    romanization: "norae",
    partOfSpeech: "noun",
    categoryId: "music",
    difficulty: "beginner",
    frequency: "common",
    tags: ["music", "singing"],
    translations: {
      ko: {
        word: "노래",
        explanation: "음악에 맞춰 부르는 가사가 있는 음악. '노래하다'는 노래를 부르는 것을 의미한다.",
        examples: ["이 노래 좋아해요.", "노래방 갈까요?"],
      },
      en: {
        word: "Song",
        explanation: "Music with lyrics sung to a melody. '노래하다' means to sing.",
        examples: ["이 노래 좋아해요. - I like this song.", "노래방 갈까요? - Shall we go to karaoke?"],
      },
      ja: {
        word: "歌",
        reading: "ノレ",
        explanation: "メロディーに合わせて歌う歌詞のある音楽。「노래하다」は歌うという意味。",
        examples: ["이 노래 좋아해요. - この歌好きです。", "노래방 갈까요? - カラオケ行きましょうか？"],
      },
    },
  },
  {
    id: "drum",
    korean: "드럼",
    romanization: "deureom",
    partOfSpeech: "noun",
    categoryId: "music",
    difficulty: "beginner",
    frequency: "common",
    tags: ["instrument", "music"],
    translations: {
      ko: {
        word: "드럼",
        explanation: "타악기의 일종. 리듬을 담당하는 핵심 악기.",
        examples: ["드럼 치는 것이 멋있어요.", "밴드에서 드럼을 쳐요."],
      },
      en: {
        word: "Drums",
        explanation: "A percussion instrument. A core instrument for rhythm in bands.",
        examples: ["드럼 치는 것이 멋있어요. - Playing drums is cool.", "밴드에서 드럼을 쳐요. - I play drums in a band."],
      },
      ja: {
        word: "ドラム",
        reading: "ドゥロム",
        explanation: "打楽器の一種。バンドでリズムを担当する主要楽器。",
        examples: ["드럼 치는 것이 멋있어요. - ドラムを叩くのはかっこいいです。", "밴드에서 드럼을 쳐요. - バンドでドラムを叩いています。"],
      },
    },
  },
  {
    id: "violin",
    korean: "바이올린",
    romanization: "baiollin",
    partOfSpeech: "noun",
    categoryId: "music",
    difficulty: "beginner",
    frequency: "common",
    tags: ["instrument", "music", "classical"],
    translations: {
      ko: {
        word: "바이올린",
        explanation: "현악기 중 하나. 오케스트라에서 중요한 역할을 하는 악기.",
        examples: ["바이올린 소리가 슬퍼요.", "바이올린 협주곡을 들었어요."],
      },
      en: {
        word: "Violin",
        explanation: "A string instrument. Plays an important role in orchestras.",
        examples: ["바이올린 소리가 슬퍼요. - The violin sounds sad.", "바이올린 협주곡을 들었어요. - I listened to a violin concerto."],
      },
      ja: {
        word: "バイオリン",
        reading: "バイオルリン",
        explanation: "弦楽器の一つ。オーケストラで重要な役割を果たす楽器。",
        examples: ["바이올린 소리가 슬퍼요. - バイオリンの音が悲しいです。", "바이올린 협주곡을 들었어요. - バイオリン協奏曲を聴きました。"],
      },
    },
  },
  {
    id: "umak",
    korean: "음악",
    romanization: "eumak",
    hanja: "音樂",
    partOfSpeech: "noun",
    categoryId: "music",
    difficulty: "beginner",
    frequency: "common",
    tags: ["music", "general"],
    translations: {
      ko: {
        word: "음악",
        explanation: "소리로 표현하는 예술. 클래식, 팝, 재즈 등 다양한 장르가 있다.",
        examples: ["음악 듣는 것을 좋아해요.", "어떤 음악 좋아해요?"],
      },
      en: {
        word: "Music",
        explanation: "Art expressed through sound. Includes various genres like classical, pop, jazz, etc.",
        examples: ["음악 듣는 것을 좋아해요. - I like listening to music.", "어떤 음악 좋아해요? - What kind of music do you like?"],
      },
      ja: {
        word: "音楽",
        reading: "ウマク",
        explanation: "音で表現する芸術。クラシック、ポップ、ジャズなど様々なジャンルがある。",
        examples: ["음악 듣는 것을 좋아해요. - 音楽を聴くのが好きです。", "어떤 음악 좋아해요? - どんな音楽が好きですか？"],
      },
    },
  },
  {
    id: "gasu",
    korean: "가수",
    romanization: "gasu",
    hanja: "歌手",
    partOfSpeech: "noun",
    categoryId: "music",
    difficulty: "beginner",
    frequency: "common",
    tags: ["music", "person"],
    translations: {
      ko: {
        word: "가수",
        explanation: "노래를 직업으로 부르는 사람. K-pop 가수들이 세계적으로 유명하다.",
        examples: ["좋아하는 가수가 누구예요?", "그 가수 콘서트에 갔어요."],
      },
      en: {
        word: "Singer",
        explanation: "A person who sings professionally. K-pop singers are famous worldwide.",
        examples: ["좋아하는 가수가 누구예요? - Who is your favorite singer?", "그 가수 콘서트에 갔어요. - I went to that singer's concert."],
      },
      ja: {
        word: "歌手",
        reading: "カス",
        explanation: "歌を職業とする人。K-pop歌手は世界的に有名です。",
        examples: ["좋아하는 가수가 누구예요? - 好きな歌手は誰ですか？", "그 가수 콘서트에 갔어요. - その歌手のコンサートに行きました。"],
      },
    },
  },
  {
    id: "konseuteu",
    korean: "콘서트",
    romanization: "konseoteu",
    partOfSpeech: "noun",
    categoryId: "music",
    difficulty: "beginner",
    frequency: "common",
    tags: ["music", "event"],
    translations: {
      ko: {
        word: "콘서트",
        explanation: "음악 공연. 가수나 밴드가 관객 앞에서 라이브로 공연하는 것.",
        examples: ["콘서트 표를 샀어요.", "콘서트가 너무 좋았어요."],
      },
      en: {
        word: "Concert",
        explanation: "A music performance. Singers or bands performing live in front of an audience.",
        examples: ["콘서트 표를 샀어요. - I bought concert tickets.", "콘서트가 너무 좋았어요. - The concert was so good."],
      },
      ja: {
        word: "コンサート",
        reading: "コンソトゥ",
        explanation: "音楽公演。歌手やバンドが観客の前でライブ演奏すること。",
        examples: ["콘서트 표를 샀어요. - コンサートのチケットを買いました。", "콘서트가 너무 좋았어요. - コンサートがとても良かったです。"],
      },
    },
  },
  {
    id: "akgi",
    korean: "악기",
    romanization: "akgi",
    hanja: "樂器",
    partOfSpeech: "noun",
    categoryId: "music",
    difficulty: "beginner",
    frequency: "common",
    tags: ["music", "instrument"],
    translations: {
      ko: {
        word: "악기",
        explanation: "음악을 연주하는 도구. 현악기, 관악기, 타악기 등이 있다.",
        examples: ["어떤 악기를 연주해요?", "새 악기를 배우고 싶어요."],
      },
      en: {
        word: "Musical instrument",
        explanation: "A tool for playing music. Includes strings, wind, and percussion instruments.",
        examples: ["어떤 악기를 연주해요? - What instrument do you play?", "새 악기를 배우고 싶어요. - I want to learn a new instrument."],
      },
      ja: {
        word: "楽器",
        reading: "アッキ",
        explanation: "音楽を演奏する道具。弦楽器、管楽器、打楽器などがある。",
        examples: ["어떤 악기를 연주해요? - どんな楽器を演奏しますか？", "새 악기를 배우고 싶어요. - 新しい楽器を習いたいです。"],
      },
    },
  },
  {
    id: "rhythm",
    korean: "리듬",
    romanization: "rideum",
    partOfSpeech: "noun",
    categoryId: "music",
    difficulty: "beginner",
    frequency: "common",
    tags: ["music", "element"],
    translations: {
      ko: {
        word: "리듬",
        explanation: "음악의 박자와 패턴. 음악의 기본 요소 중 하나.",
        examples: ["리듬에 맞춰 춤을 춰요.", "이 노래는 리듬이 좋아요."],
      },
      en: {
        word: "Rhythm",
        explanation: "The beat and pattern in music. One of the basic elements of music.",
        examples: ["리듬에 맞춰 춤을 춰요. - I dance to the rhythm.", "이 노래는 리듬이 좋아요. - This song has a good rhythm."],
      },
      ja: {
        word: "リズム",
        reading: "リドゥム",
        explanation: "音楽の拍子とパターン。音楽の基本要素の一つ。",
        examples: ["리듬에 맞춰 춤을 춰요. - リズムに合わせて踊ります。", "이 노래는 리듬이 좋아요. - この歌はリズムがいいです。"],
      },
    },
  },

  // Art
  {
    id: "geurim",
    korean: "그림",
    romanization: "geurim",
    partOfSpeech: "noun",
    categoryId: "art",
    difficulty: "beginner",
    frequency: "common",
    tags: ["art", "painting"],
    translations: {
      ko: {
        word: "그림",
        explanation: "종이나 캔버스에 그린 이미지. 회화, 스케치, 일러스트 등을 포함한다.",
        examples: ["그림을 그리는 것을 좋아해요.", "이 그림 누가 그렸어요?"],
      },
      en: {
        word: "Picture / Painting",
        explanation: "An image drawn on paper or canvas. Includes paintings, sketches, illustrations.",
        examples: ["그림을 그리는 것을 좋아해요. - I like drawing pictures.", "이 그림 누가 그렸어요? - Who drew this picture?"],
      },
      ja: {
        word: "絵",
        reading: "クリム",
        explanation: "紙やキャンバスに描いたイメージ。絵画、スケッチ、イラストなどを含む。",
        examples: ["그림을 그리는 것을 좋아해요. - 絵を描くのが好きです。", "이 그림 누가 그렸어요? - この絵は誰が描きましたか？"],
      },
    },
  },
  {
    id: "jogak",
    korean: "조각",
    romanization: "jogak",
    hanja: "彫刻",
    partOfSpeech: "noun",
    categoryId: "art",
    difficulty: "beginner",
    frequency: "common",
    tags: ["art", "sculpture"],
    translations: {
      ko: {
        word: "조각",
        explanation: "입체적인 예술 작품. 돌, 나무, 금속 등으로 만든다.",
        examples: ["박물관에서 조각을 봤어요.", "이 조각은 유명해요."],
      },
      en: {
        word: "Sculpture",
        explanation: "A three-dimensional artwork. Made from stone, wood, metal, etc.",
        examples: ["박물관에서 조각을 봤어요. - I saw sculptures at the museum.", "이 조각은 유명해요. - This sculpture is famous."],
      },
      ja: {
        word: "彫刻",
        reading: "チョガク",
        explanation: "立体的な芸術作品。石、木、金属などで作られる。",
        examples: ["박물관에서 조각을 봤어요. - 博物館で彫刻を見ました。", "이 조각은 유명해요. - この彫刻は有名です。"],
      },
    },
  },
  {
    id: "sajin",
    korean: "사진",
    romanization: "sajin",
    hanja: "寫眞",
    partOfSpeech: "noun",
    categoryId: "art",
    difficulty: "beginner",
    frequency: "common",
    tags: ["art", "photography"],
    translations: {
      ko: {
        word: "사진",
        explanation: "카메라로 찍은 이미지. 현대에서는 스마트폰으로도 많이 찍는다.",
        examples: ["사진 찍어도 돼요?", "사진이 잘 나왔어요."],
      },
      en: {
        word: "Photo / Photograph",
        explanation: "An image taken with a camera. Nowadays often taken with smartphones.",
        examples: ["사진 찍어도 돼요? - May I take a photo?", "사진이 잘 나왔어요. - The photo came out well."],
      },
      ja: {
        word: "写真",
        reading: "サジン",
        explanation: "カメラで撮った画像。現代ではスマートフォンでもよく撮る。",
        examples: ["사진 찍어도 돼요? - 写真を撮ってもいいですか？", "사진이 잘 나왔어요. - 写真がよく撮れました。"],
      },
    },
  },
  {
    id: "misul",
    korean: "미술",
    romanization: "misul",
    hanja: "美術",
    partOfSpeech: "noun",
    categoryId: "art",
    difficulty: "beginner",
    frequency: "common",
    tags: ["art", "general"],
    translations: {
      ko: {
        word: "미술",
        explanation: "시각적 예술. 회화, 조각, 디자인 등을 포함하는 광범위한 분야.",
        examples: ["미술관에 가고 싶어요.", "미술 수업이 재미있어요."],
      },
      en: {
        word: "Art / Fine arts",
        explanation: "Visual arts. A broad field including painting, sculpture, design, etc.",
        examples: ["미술관에 가고 싶어요. - I want to go to an art museum.", "미술 수업이 재미있어요. - Art class is fun."],
      },
      ja: {
        word: "美術",
        reading: "ミスル",
        explanation: "視覚芸術。絵画、彫刻、デザインなどを含む幅広い分野。",
        examples: ["미술관에 가고 싶어요. - 美術館に行きたいです。", "미술 수업이 재미있어요. - 美術の授業が面白いです。"],
      },
    },
  },
  {
    id: "jakpum",
    korean: "작품",
    romanization: "jakpum",
    hanja: "作品",
    partOfSpeech: "noun",
    categoryId: "art",
    difficulty: "beginner",
    frequency: "common",
    tags: ["art", "work"],
    translations: {
      ko: {
        word: "작품",
        explanation: "예술가가 만든 창작물. 그림, 조각, 영화, 소설 등을 말한다.",
        examples: ["이 작품이 마음에 들어요.", "유명한 작품을 많이 봤어요."],
      },
      en: {
        word: "Artwork / Work",
        explanation: "A creation made by an artist. Refers to paintings, sculptures, films, novels, etc.",
        examples: ["이 작품이 마음에 들어요. - I like this artwork.", "유명한 작품을 많이 봤어요. - I saw many famous works."],
      },
      ja: {
        word: "作品",
        reading: "チャクプム",
        explanation: "芸術家が作った創作物。絵画、彫刻、映画、小説などを指す。",
        examples: ["이 작품이 마음에 들어요. - この作品が気に入りました。", "유명한 작품을 많이 봤어요. - 有名な作品をたくさん見ました。"],
      },
    },
  },
  {
    id: "saek",
    korean: "색",
    romanization: "saek",
    hanja: "色",
    partOfSpeech: "noun",
    categoryId: "art",
    difficulty: "beginner",
    frequency: "common",
    tags: ["art", "color"],
    translations: {
      ko: {
        word: "색",
        explanation: "빨강, 파랑, 노랑 등의 색깔. 미술에서 가장 기본적인 요소.",
        examples: ["무슨 색을 좋아해요?", "이 색이 예뻐요."],
      },
      en: {
        word: "Color",
        explanation: "Colors like red, blue, yellow, etc. The most basic element in art.",
        examples: ["무슨 색을 좋아해요? - What color do you like?", "이 색이 예뻐요. - This color is pretty."],
      },
      ja: {
        word: "色",
        reading: "セク",
        explanation: "赤、青、黄色などの色。美術で最も基本的な要素。",
        examples: ["무슨 색을 좋아해요? - 何色が好きですか？", "이 색이 예뻐요. - この色がきれいです。"],
      },
    },
  },
  {
    id: "dijain",
    korean: "디자인",
    romanization: "dijain",
    partOfSpeech: "noun",
    categoryId: "art",
    difficulty: "beginner",
    frequency: "common",
    tags: ["art", "design"],
    translations: {
      ko: {
        word: "디자인",
        explanation: "물건이나 공간의 외관과 기능을 계획하는 것. 그래픽, 제품, 인테리어 디자인 등이 있다.",
        examples: ["디자인이 멋있어요.", "디자인을 공부해요."],
      },
      en: {
        word: "Design",
        explanation: "Planning the appearance and function of objects or spaces. Includes graphic, product, interior design.",
        examples: ["디자인이 멋있어요. - The design is cool.", "디자인을 공부해요. - I study design."],
      },
      ja: {
        word: "デザイン",
        reading: "ディジャイン",
        explanation: "物や空間の外観と機能を計画すること。グラフィック、製品、インテリアデザインなどがある。",
        examples: ["디자인이 멋있어요. - デザインがかっこいいです。", "디자인을 공부해요. - デザインを勉強しています。"],
      },
    },
  },
  {
    id: "jeonsi",
    korean: "전시",
    romanization: "jeonsi",
    hanja: "展示",
    partOfSpeech: "noun",
    categoryId: "art",
    difficulty: "beginner",
    frequency: "common",
    tags: ["art", "exhibition"],
    translations: {
      ko: {
        word: "전시",
        explanation: "작품을 공개적으로 보여주는 행사. 미술관이나 갤러리에서 열린다.",
        examples: ["전시회에 갔어요.", "새 전시가 시작됐어요."],
      },
      en: {
        word: "Exhibition",
        explanation: "An event displaying artworks publicly. Held at museums or galleries.",
        examples: ["전시회에 갔어요. - I went to an exhibition.", "새 전시가 시작됐어요. - A new exhibition has started."],
      },
      ja: {
        word: "展示",
        reading: "チョンシ",
        explanation: "作品を公開的に見せるイベント。美術館やギャラリーで開かれる。",
        examples: ["전시회에 갔어요. - 展覧会に行きました。", "새 전시가 시작됐어요. - 新しい展示が始まりました。"],
      },
    },
  },
  {
    id: "hwaga",
    korean: "화가",
    romanization: "hwaga",
    hanja: "畫家",
    partOfSpeech: "noun",
    categoryId: "art",
    difficulty: "beginner",
    frequency: "common",
    tags: ["art", "person"],
    translations: {
      ko: {
        word: "화가",
        explanation: "그림을 그리는 것을 직업으로 하는 예술가.",
        examples: ["유명한 화가의 그림이에요.", "화가가 되고 싶어요."],
      },
      en: {
        word: "Painter / Artist",
        explanation: "An artist who paints professionally.",
        examples: ["유명한 화가의 그림이에요. - It's a painting by a famous artist.", "화가가 되고 싶어요. - I want to become a painter."],
      },
      ja: {
        word: "画家",
        reading: "ファガ",
        explanation: "絵を描くことを職業とする芸術家。",
        examples: ["유명한 화가의 그림이에요. - 有名な画家の絵です。", "화가가 되고 싶어요. - 画家になりたいです。"],
      },
    },
  },
  {
    id: "changui",
    korean: "창의",
    romanization: "changui",
    hanja: "創意",
    partOfSpeech: "noun",
    categoryId: "art",
    difficulty: "beginner",
    frequency: "common",
    tags: ["art", "creativity"],
    translations: {
      ko: {
        word: "창의",
        explanation: "새롭고 독창적인 아이디어를 만들어내는 능력. 예술에서 매우 중요한 요소.",
        examples: ["창의력이 필요해요.", "창의적인 생각이에요."],
      },
      en: {
        word: "Creativity",
        explanation: "The ability to create new and original ideas. A very important element in art.",
        examples: ["창의력이 필요해요. - We need creativity.", "창의적인 생각이에요. - That's a creative idea."],
      },
      ja: {
        word: "創意",
        reading: "チャンイ",
        explanation: "新しく独創的なアイデアを生み出す能力。芸術で非常に重要な要素。",
        examples: ["창의력이 필요해요. - 創造力が必要です。", "창의적인 생각이에요. - 創造的な考えですね。"],
      },
    },
  },

  // Sports
  {
    id: "chukgu",
    korean: "축구",
    romanization: "chukgu",
    hanja: "蹴球",
    partOfSpeech: "noun",
    categoryId: "sports",
    difficulty: "beginner",
    frequency: "common",
    tags: ["sports", "ball game"],
    translations: {
      ko: {
        word: "축구",
        explanation: "발로 공을 차는 스포츠. 세계에서 가장 인기 있는 스포츠 중 하나.",
        examples: ["축구 경기 봤어요?", "축구하러 가자!"],
      },
      en: {
        word: "Soccer / Football",
        explanation: "A sport where you kick a ball. One of the most popular sports in the world.",
        examples: ["축구 경기 봤어요? - Did you watch the soccer game?", "축구하러 가자! - Let's go play soccer!"],
      },
      ja: {
        word: "サッカー",
        reading: "チュック",
        explanation: "足でボールを蹴るスポーツ。世界で最も人気のあるスポーツの一つ。",
        examples: ["축구 경기 봤어요? - サッカーの試合見ましたか？", "축구하러 가자! - サッカーしに行こう！"],
      },
    },
  },
  {
    id: "yagu",
    korean: "야구",
    romanization: "yagu",
    hanja: "野球",
    partOfSpeech: "noun",
    categoryId: "sports",
    difficulty: "beginner",
    frequency: "common",
    tags: ["sports", "ball game"],
    translations: {
      ko: {
        word: "야구",
        explanation: "배트로 공을 치는 스포츠. 한국에서 매우 인기 있는 스포츠.",
        examples: ["야구장에 가요.", "야구 선수가 되고 싶어요."],
      },
      en: {
        word: "Baseball",
        explanation: "A sport where you hit a ball with a bat. Very popular in Korea.",
        examples: ["야구장에 가요. - Let's go to the baseball stadium.", "야구 선수가 되고 싶어요. - I want to become a baseball player."],
      },
      ja: {
        word: "野球",
        reading: "ヤグ",
        explanation: "バットでボールを打つスポーツ。韓国で非常に人気のあるスポーツ。",
        examples: ["야구장에 가요. - 野球場に行きましょう。", "야구 선수가 되고 싶어요. - 野球選手になりたいです。"],
      },
    },
  },
  {
    id: "nonggu",
    korean: "농구",
    romanization: "nonggu",
    hanja: "籠球",
    partOfSpeech: "noun",
    categoryId: "sports",
    difficulty: "beginner",
    frequency: "common",
    tags: ["sports", "ball game"],
    translations: {
      ko: {
        word: "농구",
        explanation: "공을 골대에 넣는 스포츠. 실내에서도 할 수 있다.",
        examples: ["농구 잘해요?", "농구 경기를 봤어요."],
      },
      en: {
        word: "Basketball",
        explanation: "A sport where you shoot a ball into a hoop. Can be played indoors.",
        examples: ["농구 잘해요? - Are you good at basketball?", "농구 경기를 봤어요. - I watched a basketball game."],
      },
      ja: {
        word: "バスケットボール",
        reading: "ノング",
        explanation: "ボールをゴールに入れるスポーツ。屋内でもできる。",
        examples: ["농구 잘해요? - バスケ上手ですか？", "농구 경기를 봤어요. - バスケの試合を見ました。"],
      },
    },
  },
  {
    id: "suyeong",
    korean: "수영",
    romanization: "suyeong",
    hanja: "水泳",
    partOfSpeech: "noun",
    categoryId: "sports",
    difficulty: "beginner",
    frequency: "common",
    tags: ["sports", "water"],
    translations: {
      ko: {
        word: "수영",
        explanation: "물에서 헤엄치는 운동. 전신 운동으로 건강에 좋다.",
        examples: ["수영 배우고 싶어요.", "수영장에 갈까요?"],
      },
      en: {
        word: "Swimming",
        explanation: "Exercise of moving through water. Good for health as a full-body workout.",
        examples: ["수영 배우고 싶어요. - I want to learn swimming.", "수영장에 갈까요? - Shall we go to the pool?"],
      },
      ja: {
        word: "水泳",
        reading: "スヨン",
        explanation: "水の中で泳ぐ運動。全身運動として健康に良い。",
        examples: ["수영 배우고 싶어요. - 水泳を習いたいです。", "수영장에 갈까요? - プールに行きましょうか？"],
      },
    },
  },
  {
    id: "daligi",
    korean: "달리기",
    romanization: "dalligi",
    partOfSpeech: "noun",
    categoryId: "sports",
    difficulty: "beginner",
    frequency: "common",
    tags: ["sports", "running"],
    translations: {
      ko: {
        word: "달리기",
        explanation: "빠르게 뛰는 운동. 마라톤, 조깅, 단거리 달리기 등이 있다.",
        examples: ["아침에 달리기를 해요.", "달리기가 건강에 좋아요."],
      },
      en: {
        word: "Running",
        explanation: "Exercise of moving fast on foot. Includes marathon, jogging, sprinting.",
        examples: ["아침에 달리기를 해요. - I run in the morning.", "달리기가 건강에 좋아요. - Running is good for health."],
      },
      ja: {
        word: "走ること",
        reading: "タルリギ",
        explanation: "速く走る運動。マラソン、ジョギング、短距離走などがある。",
        examples: ["아침에 달리기를 해요. - 朝走っています。", "달리기가 건강에 좋아요. - 走ることは健康に良いです。"],
      },
    },
  },
  {
    id: "undong",
    korean: "운동",
    romanization: "undong",
    hanja: "運動",
    partOfSpeech: "noun",
    categoryId: "sports",
    difficulty: "beginner",
    frequency: "common",
    tags: ["sports", "exercise"],
    translations: {
      ko: {
        word: "운동",
        explanation: "몸을 움직이는 신체 활동. 건강을 위해 필수적이다.",
        examples: ["운동을 자주 해요?", "운동하러 헬스장에 가요."],
      },
      en: {
        word: "Exercise / Sports",
        explanation: "Physical activity involving body movement. Essential for health.",
        examples: ["운동을 자주 해요? - Do you exercise often?", "운동하러 헬스장에 가요. - I go to the gym to exercise."],
      },
      ja: {
        word: "運動",
        reading: "ウンドン",
        explanation: "体を動かす身体活動。健康のために必須。",
        examples: ["운동을 자주 해요? - よく運動しますか？", "운동하러 헬스장에 가요. - 運動しにジムに行きます。"],
      },
    },
  },
  {
    id: "gyeonggi",
    korean: "경기",
    romanization: "gyeonggi",
    hanja: "競技",
    partOfSpeech: "noun",
    categoryId: "sports",
    difficulty: "beginner",
    frequency: "common",
    tags: ["sports", "game"],
    translations: {
      ko: {
        word: "경기",
        explanation: "스포츠에서 승부를 겨루는 것. 시합, 게임을 의미한다.",
        examples: ["오늘 경기 몇 시에요?", "경기에서 이겼어요!"],
      },
      en: {
        word: "Game / Match",
        explanation: "A competition in sports. Refers to a match or game.",
        examples: ["오늘 경기 몇 시에요? - What time is today's game?", "경기에서 이겼어요! - We won the game!"],
      },
      ja: {
        word: "試合",
        reading: "キョンギ",
        explanation: "スポーツで勝負を競うこと。試合やゲームを意味する。",
        examples: ["오늘 경기 몇 시에요? - 今日の試合は何時ですか？", "경기에서 이겼어요! - 試合に勝ちました！"],
      },
    },
  },
  {
    id: "seonsu",
    korean: "선수",
    romanization: "seonsu",
    hanja: "選手",
    partOfSpeech: "noun",
    categoryId: "sports",
    difficulty: "beginner",
    frequency: "common",
    tags: ["sports", "person"],
    translations: {
      ko: {
        word: "선수",
        explanation: "스포츠를 직업으로 하는 사람. 프로 또는 아마추어 선수.",
        examples: ["좋아하는 선수가 있어요?", "그 선수 정말 잘해요."],
      },
      en: {
        word: "Player / Athlete",
        explanation: "A person who plays sports professionally. Professional or amateur athlete.",
        examples: ["좋아하는 선수가 있어요? - Do you have a favorite player?", "그 선수 정말 잘해요. - That player is really good."],
      },
      ja: {
        word: "選手",
        reading: "ソンス",
        explanation: "スポーツを職業とする人。プロまたはアマチュアの選手。",
        examples: ["좋아하는 선수가 있어요? - 好きな選手はいますか？", "그 선수 정말 잘해요. - あの選手は本当に上手です。"],
      },
    },
  },
  {
    id: "tim",
    korean: "팀",
    romanization: "tim",
    partOfSpeech: "noun",
    categoryId: "sports",
    difficulty: "beginner",
    frequency: "common",
    tags: ["sports", "team"],
    translations: {
      ko: {
        word: "팀",
        explanation: "함께 경기하는 선수들의 그룹. 스포츠에서 협동이 중요하다.",
        examples: ["어느 팀을 응원해요?", "우리 팀이 이겼어요!"],
      },
      en: {
        word: "Team",
        explanation: "A group of players competing together. Teamwork is important in sports.",
        examples: ["어느 팀을 응원해요? - Which team do you support?", "우리 팀이 이겼어요! - Our team won!"],
      },
      ja: {
        word: "チーム",
        reading: "ティム",
        explanation: "一緒に競技する選手たちのグループ。スポーツではチームワークが重要。",
        examples: ["어느 팀을 응원해요? - どのチームを応援していますか？", "우리 팀이 이겼어요! - 私たちのチームが勝ちました！"],
      },
    },
  },
  {
    id: "ollimpik",
    korean: "올림픽",
    romanization: "ollimpik",
    partOfSpeech: "noun",
    categoryId: "sports",
    difficulty: "beginner",
    frequency: "common",
    tags: ["sports", "event"],
    translations: {
      ko: {
        word: "올림픽",
        explanation: "4년마다 열리는 세계 최대의 스포츠 대회. 하계와 동계 올림픽이 있다.",
        examples: ["올림픽 보고 있어요?", "한국이 올림픽에서 금메달을 땄어요."],
      },
      en: {
        word: "Olympics",
        explanation: "The world's largest sports event held every four years. Summer and Winter Olympics.",
        examples: ["올림픽 보고 있어요? - Are you watching the Olympics?", "한국이 올림픽에서 금메달을 땄어요. - Korea won a gold medal at the Olympics."],
      },
      ja: {
        word: "オリンピック",
        reading: "オルリムピク",
        explanation: "4年ごとに開催される世界最大のスポーツ大会。夏季と冬季オリンピックがある。",
        examples: ["올림픽 보고 있어요? - オリンピック見ていますか？", "한국이 올림픽에서 금메달을 땄어요. - 韓国がオリンピックで金メダルを取りました。"],
      },
    },
  },

  // Space
  {
    id: "byeol",
    korean: "별",
    romanization: "byeol",
    partOfSpeech: "noun",
    categoryId: "space",
    difficulty: "beginner",
    frequency: "common",
    tags: ["space", "astronomy"],
    translations: {
      ko: {
        word: "별",
        explanation: "밤하늘에서 빛나는 천체. 태양도 별의 일종이다.",
        examples: ["별이 예뻐요.", "별을 보러 갈까요?"],
      },
      en: {
        word: "Star",
        explanation: "A celestial body that shines in the night sky. The sun is also a type of star.",
        examples: ["별이 예뻐요. - The stars are beautiful.", "별을 보러 갈까요? - Shall we go see the stars?"],
      },
      ja: {
        word: "星",
        reading: "ピョル",
        explanation: "夜空で輝く天体。太陽も星の一種。",
        examples: ["별이 예뻐요. - 星がきれいです。", "별을 보러 갈까요? - 星を見に行きましょうか？"],
      },
    },
  },
  {
    id: "dal",
    korean: "달",
    romanization: "dal",
    partOfSpeech: "noun",
    categoryId: "space",
    difficulty: "beginner",
    frequency: "common",
    tags: ["space", "astronomy"],
    translations: {
      ko: {
        word: "달",
        explanation: "지구의 자연 위성. 밤에 밝게 빛난다.",
        examples: ["오늘 달이 밝아요.", "보름달이 떴어요."],
      },
      en: {
        word: "Moon",
        explanation: "Earth's natural satellite. Shines brightly at night.",
        examples: ["오늘 달이 밝아요. - The moon is bright tonight.", "보름달이 떴어요. - The full moon is out."],
      },
      ja: {
        word: "月",
        reading: "タル",
        explanation: "地球の自然衛星。夜に明るく輝く。",
        examples: ["오늘 달이 밝아요. - 今日は月が明るいです。", "보름달이 떴어요. - 満月が出ました。"],
      },
    },
  },
  {
    id: "taeyang",
    korean: "태양",
    romanization: "taeyang",
    hanja: "太陽",
    partOfSpeech: "noun",
    categoryId: "space",
    difficulty: "beginner",
    frequency: "common",
    tags: ["space", "astronomy"],
    translations: {
      ko: {
        word: "태양",
        explanation: "태양계의 중심에 있는 항성. 지구에 빛과 열을 제공한다.",
        examples: ["태양이 뜨거워요.", "태양 주위를 지구가 돌아요."],
      },
      en: {
        word: "Sun",
        explanation: "The star at the center of the solar system. Provides light and heat to Earth.",
        examples: ["태양이 뜨거워요. - The sun is hot.", "태양 주위를 지구가 돌아요. - Earth orbits around the sun."],
      },
      ja: {
        word: "太陽",
        reading: "テヤン",
        explanation: "太陽系の中心にある恒星。地球に光と熱を提供する。",
        examples: ["태양이 뜨거워요. - 太陽が熱いです。", "태양 주위를 지구가 돌아요. - 太陽の周りを地球が回っています。"],
      },
    },
  },
  {
    id: "haengseong",
    korean: "행성",
    romanization: "haengseong",
    hanja: "行星",
    partOfSpeech: "noun",
    categoryId: "space",
    difficulty: "beginner",
    frequency: "common",
    tags: ["space", "astronomy"],
    translations: {
      ko: {
        word: "행성",
        explanation: "항성 주위를 도는 천체. 태양계에는 8개의 행성이 있다.",
        examples: ["지구는 행성이에요.", "다른 행성에 생명체가 있을까요?"],
      },
      en: {
        word: "Planet",
        explanation: "A celestial body orbiting a star. There are 8 planets in our solar system.",
        examples: ["지구는 행성이에요. - Earth is a planet.", "다른 행성에 생명체가 있을까요? - Is there life on other planets?"],
      },
      ja: {
        word: "惑星",
        reading: "ヘンソン",
        explanation: "恒星の周りを回る天体。太陽系には8つの惑星がある。",
        examples: ["지구는 행성이에요. - 地球は惑星です。", "다른 행성에 생명체가 있을까요? - 他の惑星に生命体はいるでしょうか？"],
      },
    },
  },
  {
    id: "eunha",
    korean: "은하",
    romanization: "eunha",
    hanja: "銀河",
    partOfSpeech: "noun",
    categoryId: "space",
    difficulty: "beginner",
    frequency: "common",
    tags: ["space", "astronomy"],
    translations: {
      ko: {
        word: "은하",
        explanation: "수많은 별들이 모인 거대한 천체 시스템. 우리 은하는 은하수라고 불린다.",
        examples: ["은하수가 보여요.", "우주에는 수많은 은하가 있어요."],
      },
      en: {
        word: "Galaxy",
        explanation: "A huge system of countless stars. Our galaxy is called the Milky Way.",
        examples: ["은하수가 보여요. - I can see the Milky Way.", "우주에는 수많은 은하가 있어요. - There are countless galaxies in the universe."],
      },
      ja: {
        word: "銀河",
        reading: "ウナ",
        explanation: "無数の星が集まった巨大な天体システム。私たちの銀河は天の川と呼ばれる。",
        examples: ["은하수가 보여요. - 天の川が見えます。", "우주에는 수많은 은하가 있어요. - 宇宙には無数の銀河があります。"],
      },
    },
  },
  {
    id: "uju",
    korean: "우주",
    romanization: "uju",
    hanja: "宇宙",
    partOfSpeech: "noun",
    categoryId: "space",
    difficulty: "beginner",
    frequency: "common",
    tags: ["space", "general"],
    translations: {
      ko: {
        word: "우주",
        explanation: "모든 물질과 에너지가 존재하는 무한한 공간. 지구 밖의 모든 것.",
        examples: ["우주는 신비로워요.", "우주 여행을 하고 싶어요."],
      },
      en: {
        word: "Space / Universe",
        explanation: "The infinite space where all matter and energy exists. Everything beyond Earth.",
        examples: ["우주는 신비로워요. - Space is mysterious.", "우주 여행을 하고 싶어요. - I want to travel to space."],
      },
      ja: {
        word: "宇宙",
        reading: "ウジュ",
        explanation: "すべての物質とエネルギーが存在する無限の空間。地球の外のすべて。",
        examples: ["우주는 신비로워요. - 宇宙は神秘的です。", "우주 여행을 하고 싶어요. - 宇宙旅行をしたいです。"],
      },
    },
  },
  {
    id: "roket",
    korean: "로켓",
    romanization: "roket",
    partOfSpeech: "noun",
    categoryId: "space",
    difficulty: "beginner",
    frequency: "common",
    tags: ["space", "technology"],
    translations: {
      ko: {
        word: "로켓",
        explanation: "우주로 발사되는 우주선. 위성이나 우주인을 우주로 보낸다.",
        examples: ["로켓이 발사됐어요.", "로켓 발사를 봤어요."],
      },
      en: {
        word: "Rocket",
        explanation: "A spacecraft launched into space. Sends satellites and astronauts to space.",
        examples: ["로켓이 발사됐어요. - The rocket was launched.", "로켓 발사를 봤어요. - I watched the rocket launch."],
      },
      ja: {
        word: "ロケット",
        reading: "ロケッ",
        explanation: "宇宙に発射される宇宙船。衛星や宇宙飛行士を宇宙に送る。",
        examples: ["로켓이 발사됐어요. - ロケットが発射されました。", "로켓 발사를 봤어요. - ロケット発射を見ました。"],
      },
    },
  },
  {
    id: "ujuin",
    korean: "우주인",
    romanization: "ujuin",
    hanja: "宇宙人",
    partOfSpeech: "noun",
    categoryId: "space",
    difficulty: "beginner",
    frequency: "common",
    tags: ["space", "person"],
    translations: {
      ko: {
        word: "우주인",
        explanation: "우주로 여행하는 사람. 우주 비행사라고도 한다.",
        examples: ["우주인이 되고 싶어요.", "한국 우주인이 있어요."],
      },
      en: {
        word: "Astronaut",
        explanation: "A person who travels to space. Also called a cosmonaut.",
        examples: ["우주인이 되고 싶어요. - I want to become an astronaut.", "한국 우주인이 있어요. - There is a Korean astronaut."],
      },
      ja: {
        word: "宇宙飛行士",
        reading: "ウジュイン",
        explanation: "宇宙に旅する人。",
        examples: ["우주인이 되고 싶어요. - 宇宙飛行士になりたいです。", "한국 우주인이 있어요. - 韓国の宇宙飛行士がいます。"],
      },
    },
  },
  {
    id: "wiseong",
    korean: "위성",
    romanization: "wiseong",
    hanja: "衛星",
    partOfSpeech: "noun",
    categoryId: "space",
    difficulty: "beginner",
    frequency: "common",
    tags: ["space", "astronomy"],
    translations: {
      ko: {
        word: "위성",
        explanation: "행성 주위를 도는 천체. 인공위성은 사람이 만든 위성이다.",
        examples: ["달은 지구의 위성이에요.", "인공위성이 지구를 돌아요."],
      },
      en: {
        word: "Satellite",
        explanation: "A celestial body orbiting a planet. Artificial satellites are man-made.",
        examples: ["달은 지구의 위성이에요. - The moon is Earth's satellite.", "인공위성이 지구를 돌아요. - Artificial satellites orbit the Earth."],
      },
      ja: {
        word: "衛星",
        reading: "ウィソン",
        explanation: "惑星の周りを回る天体。人工衛星は人が作った衛星。",
        examples: ["달은 지구의 위성이에요. - 月は地球の衛星です。", "인공위성이 지구를 돌아요. - 人工衛星が地球を回っています。"],
      },
    },
  },
  {
    id: "blaekol",
    korean: "블랙홀",
    romanization: "beullaekol",
    partOfSpeech: "noun",
    categoryId: "space",
    difficulty: "beginner",
    frequency: "common",
    tags: ["space", "astronomy"],
    translations: {
      ko: {
        word: "블랙홀",
        explanation: "중력이 매우 강해서 빛도 빠져나올 수 없는 천체.",
        examples: ["블랙홀은 무서워요.", "블랙홀에 대해 배웠어요."],
      },
      en: {
        word: "Black hole",
        explanation: "A celestial object with gravity so strong that even light cannot escape.",
        examples: ["블랙홀은 무서워요. - Black holes are scary.", "블랙홀에 대해 배웠어요. - I learned about black holes."],
      },
      ja: {
        word: "ブラックホール",
        reading: "ブルレクホル",
        explanation: "重力が非常に強く、光さえ脱出できない天体。",
        examples: ["블랙홀은 무서워요. - ブラックホールは怖いです。", "블랙홀에 대해 배웠어요. - ブラックホールについて学びました。"],
      },
    },
  },

  // Physics
  {
    id: "jungnyeok",
    korean: "중력",
    romanization: "jungnyeok",
    hanja: "重力",
    partOfSpeech: "noun",
    categoryId: "physics",
    difficulty: "beginner",
    frequency: "common",
    tags: ["physics", "force"],
    translations: {
      ko: {
        word: "중력",
        explanation: "물체를 지구 중심으로 끌어당기는 힘. 물체가 떨어지는 이유.",
        examples: ["중력 때문에 물체가 떨어져요.", "달의 중력은 지구보다 약해요."],
      },
      en: {
        word: "Gravity",
        explanation: "The force that pulls objects toward the center of the Earth. Why things fall.",
        examples: ["중력 때문에 물체가 떨어져요. - Things fall because of gravity.", "달의 중력은 지구보다 약해요. - The moon's gravity is weaker than Earth's."],
      },
      ja: {
        word: "重力",
        reading: "チュンニョク",
        explanation: "物体を地球の中心に引き寄せる力。物が落ちる理由。",
        examples: ["중력 때문에 물체가 떨어져요. - 重力のせいで物が落ちます。", "달의 중력은 지구보다 약해요. - 月の重力は地球より弱いです。"],
      },
    },
  },
  {
    id: "eneoji",
    korean: "에너지",
    romanization: "eneoji",
    partOfSpeech: "noun",
    categoryId: "physics",
    difficulty: "beginner",
    frequency: "common",
    tags: ["physics", "energy"],
    translations: {
      ko: {
        word: "에너지",
        explanation: "일을 할 수 있는 능력. 운동 에너지, 위치 에너지 등이 있다.",
        examples: ["에너지를 절약해요.", "태양 에너지를 사용해요."],
      },
      en: {
        word: "Energy",
        explanation: "The ability to do work. Includes kinetic energy, potential energy, etc.",
        examples: ["에너지를 절약해요. - Let's save energy.", "태양 에너지를 사용해요. - We use solar energy."],
      },
      ja: {
        word: "エネルギー",
        reading: "エノジ",
        explanation: "仕事をする能力。運動エネルギー、位置エネルギーなどがある。",
        examples: ["에너지를 절약해요. - エネルギーを節約しましょう。", "태양 에너지를 사용해요. - 太陽エネルギーを使います。"],
      },
    },
  },
  {
    id: "wonja",
    korean: "원자",
    romanization: "wonja",
    hanja: "原子",
    partOfSpeech: "noun",
    categoryId: "physics",
    difficulty: "beginner",
    frequency: "common",
    tags: ["physics", "atom"],
    translations: {
      ko: {
        word: "원자",
        explanation: "물질을 구성하는 가장 작은 단위. 양성자, 중성자, 전자로 구성된다.",
        examples: ["모든 물질은 원자로 이루어져 있어요.", "원자는 매우 작아요."],
      },
      en: {
        word: "Atom",
        explanation: "The smallest unit of matter. Composed of protons, neutrons, and electrons.",
        examples: ["모든 물질은 원자로 이루어져 있어요. - All matter is made of atoms.", "원자는 매우 작아요. - Atoms are very small."],
      },
      ja: {
        word: "原子",
        reading: "ウォンジャ",
        explanation: "物質を構成する最小単位。陽子、中性子、電子で構成される。",
        examples: ["모든 물질은 원자로 이루어져 있어요. - すべての物質は原子でできています。", "원자는 매우 작아요. - 原子はとても小さいです。"],
      },
    },
  },
  {
    id: "bit",
    korean: "빛",
    romanization: "bit",
    partOfSpeech: "noun",
    categoryId: "physics",
    difficulty: "beginner",
    frequency: "common",
    tags: ["physics", "light"],
    translations: {
      ko: {
        word: "빛",
        explanation: "눈으로 볼 수 있게 해주는 에너지. 가장 빠른 속도로 이동한다.",
        examples: ["빛이 밝아요.", "빛의 속도는 매우 빨라요."],
      },
      en: {
        word: "Light",
        explanation: "Energy that enables us to see. Travels at the fastest speed possible.",
        examples: ["빛이 밝아요. - The light is bright.", "빛의 속도는 매우 빨라요. - The speed of light is very fast."],
      },
      ja: {
        word: "光",
        reading: "ピッ",
        explanation: "目で見ることを可能にするエネルギー。最も速い速度で移動する。",
        examples: ["빛이 밝아요. - 光が明るいです。", "빛의 속도는 매우 빨라요. - 光の速度はとても速いです。"],
      },
    },
  },
  {
    id: "padong",
    korean: "파동",
    romanization: "padong",
    hanja: "波動",
    partOfSpeech: "noun",
    categoryId: "physics",
    difficulty: "beginner",
    frequency: "common",
    tags: ["physics", "wave"],
    translations: {
      ko: {
        word: "파동",
        explanation: "에너지가 퍼져나가는 진동 현상. 소리와 빛도 파동이다.",
        examples: ["소리는 파동으로 전달돼요.", "물결도 파동이에요."],
      },
      en: {
        word: "Wave",
        explanation: "A vibration phenomenon where energy spreads. Sound and light are also waves.",
        examples: ["소리는 파동으로 전달돼요. - Sound travels as waves.", "물결도 파동이에요. - Water ripples are waves too."],
      },
      ja: {
        word: "波動",
        reading: "パドン",
        explanation: "エネルギーが広がる振動現象。音と光も波動です。",
        examples: ["소리는 파동으로 전달돼요. - 音は波動として伝わります。", "물결도 파동이에요. - 波も波動です。"],
      },
    },
  },
  {
    id: "him",
    korean: "힘",
    romanization: "him",
    partOfSpeech: "noun",
    categoryId: "physics",
    difficulty: "beginner",
    frequency: "common",
    tags: ["physics", "force"],
    translations: {
      ko: {
        word: "힘",
        explanation: "물체의 운동 상태를 변화시키는 작용. 밀기, 당기기 등.",
        examples: ["힘을 주세요.", "중력은 힘이에요."],
      },
      en: {
        word: "Force",
        explanation: "An action that changes the state of motion of an object. Pushing, pulling, etc.",
        examples: ["힘을 주세요. - Give it some force.", "중력은 힘이에요. - Gravity is a force."],
      },
      ja: {
        word: "力",
        reading: "ヒム",
        explanation: "物体の運動状態を変化させる作用。押す、引くなど。",
        examples: ["힘을 주세요. - 力を入れてください。", "중력은 힘이에요. - 重力は力です。"],
      },
    },
  },
  {
    id: "sokdo",
    korean: "속도",
    romanization: "sokdo",
    hanja: "速度",
    partOfSpeech: "noun",
    categoryId: "physics",
    difficulty: "beginner",
    frequency: "common",
    tags: ["physics", "speed"],
    translations: {
      ko: {
        word: "속도",
        explanation: "물체가 이동하는 빠르기. 거리를 시간으로 나눈 값.",
        examples: ["속도가 빨라요.", "속도를 줄이세요."],
      },
      en: {
        word: "Speed / Velocity",
        explanation: "How fast an object moves. Distance divided by time.",
        examples: ["속도가 빨라요. - The speed is fast.", "속도를 줄이세요. - Reduce your speed."],
      },
      ja: {
        word: "速度",
        reading: "ソクド",
        explanation: "物体が移動する速さ。距離を時間で割った値。",
        examples: ["속도가 빨라요. - 速度が速いです。", "속도를 줄이세요. - 速度を落としてください。"],
      },
    },
  },
  {
    id: "ondo",
    korean: "온도",
    romanization: "ondo",
    hanja: "溫度",
    partOfSpeech: "noun",
    categoryId: "physics",
    difficulty: "beginner",
    frequency: "common",
    tags: ["physics", "temperature"],
    translations: {
      ko: {
        word: "온도",
        explanation: "물체의 차갑고 뜨거운 정도. 섭씨(°C)나 화씨(°F)로 측정한다.",
        examples: ["오늘 온도가 높아요.", "온도를 측정했어요."],
      },
      en: {
        word: "Temperature",
        explanation: "The degree of hotness or coldness. Measured in Celsius or Fahrenheit.",
        examples: ["오늘 온도가 높아요. - Today's temperature is high.", "온도를 측정했어요. - I measured the temperature."],
      },
      ja: {
        word: "温度",
        reading: "オンド",
        explanation: "物体の冷たさや熱さの度合い。摂氏（°C）や華氏（°F）で測定する。",
        examples: ["오늘 온도가 높아요. - 今日は温度が高いです。", "온도를 측정했어요. - 温度を測りました。"],
      },
    },
  },
  {
    id: "jeongi",
    korean: "전기",
    romanization: "jeongi",
    hanja: "電氣",
    partOfSpeech: "noun",
    categoryId: "physics",
    difficulty: "beginner",
    frequency: "common",
    tags: ["physics", "electricity"],
    translations: {
      ko: {
        word: "전기",
        explanation: "전하의 흐름. 우리 생활에 필수적인 에너지원.",
        examples: ["전기를 아껴 써요.", "전기가 나갔어요."],
      },
      en: {
        word: "Electricity",
        explanation: "The flow of electric charge. An essential energy source for our lives.",
        examples: ["전기를 아껴 써요. - Let's save electricity.", "전기가 나갔어요. - The power went out."],
      },
      ja: {
        word: "電気",
        reading: "チョンギ",
        explanation: "電荷の流れ。私たちの生活に不可欠なエネルギー源。",
        examples: ["전기를 아껴 써요. - 電気を節約しましょう。", "전기가 나갔어요. - 停電しました。"],
      },
    },
  },
  {
    id: "jasuk",
    korean: "자석",
    romanization: "jaseok",
    hanja: "磁石",
    partOfSpeech: "noun",
    categoryId: "physics",
    difficulty: "beginner",
    frequency: "common",
    tags: ["physics", "magnet"],
    translations: {
      ko: {
        word: "자석",
        explanation: "철을 끌어당기는 물체. N극과 S극이 있다.",
        examples: ["자석이 철을 끌어당겨요.", "냉장고에 자석을 붙였어요."],
      },
      en: {
        word: "Magnet",
        explanation: "An object that attracts iron. Has north and south poles.",
        examples: ["자석이 철을 끌어당겨요. - The magnet attracts iron.", "냉장고에 자석을 붙였어요. - I put a magnet on the fridge."],
      },
      ja: {
        word: "磁石",
        reading: "チャソク",
        explanation: "鉄を引きつける物体。N極とS極がある。",
        examples: ["자석이 철을 끌어당겨요. - 磁石が鉄を引きつけます。", "냉장고에 자석을 붙였어요. - 冷蔵庫に磁石をつけました。"],
      },
    },
  },

  // Math
  {
    id: "sutja",
    korean: "숫자",
    romanization: "sutja",
    partOfSpeech: "noun",
    categoryId: "math",
    difficulty: "beginner",
    frequency: "common",
    tags: ["math", "number"],
    translations: {
      ko: {
        word: "숫자",
        explanation: "양을 나타내는 기호. 0, 1, 2, 3... 등.",
        examples: ["숫자를 세요.", "이 숫자가 뭐예요?"],
      },
      en: {
        word: "Number",
        explanation: "Symbols representing quantity. 0, 1, 2, 3... etc.",
        examples: ["숫자를 세요. - Count the numbers.", "이 숫자가 뭐예요? - What is this number?"],
      },
      ja: {
        word: "数字",
        reading: "スッチャ",
        explanation: "量を表す記号。0、1、2、3...など。",
        examples: ["숫자를 세요. - 数字を数えてください。", "이 숫자가 뭐예요? - この数字は何ですか？"],
      },
    },
  },
  {
    id: "deotssem",
    korean: "덧셈",
    romanization: "deotsem",
    partOfSpeech: "noun",
    categoryId: "math",
    difficulty: "beginner",
    frequency: "common",
    tags: ["math", "operation"],
    translations: {
      ko: {
        word: "덧셈",
        explanation: "두 수를 더하는 연산. 더하기(+).",
        examples: ["덧셈을 해요.", "덧셈이 쉬워요."],
      },
      en: {
        word: "Addition",
        explanation: "The operation of adding two numbers. Plus (+).",
        examples: ["덧셈을 해요. - Let's do addition.", "덧셈이 쉬워요. - Addition is easy."],
      },
      ja: {
        word: "足し算",
        reading: "トッセム",
        explanation: "二つの数を足す演算。プラス（+）。",
        examples: ["덧셈을 해요. - 足し算をしましょう。", "덧셈이 쉬워요. - 足し算は簡単です。"],
      },
    },
  },
  {
    id: "ppelssem",
    korean: "뺄셈",
    romanization: "ppaelsem",
    partOfSpeech: "noun",
    categoryId: "math",
    difficulty: "beginner",
    frequency: "common",
    tags: ["math", "operation"],
    translations: {
      ko: {
        word: "뺄셈",
        explanation: "한 수에서 다른 수를 빼는 연산. 빼기(-).",
        examples: ["뺄셈을 배워요.", "뺄셈이 어려워요?"],
      },
      en: {
        word: "Subtraction",
        explanation: "The operation of subtracting one number from another. Minus (-).",
        examples: ["뺄셈을 배워요. - Let's learn subtraction.", "뺄셈이 어려워요? - Is subtraction difficult?"],
      },
      ja: {
        word: "引き算",
        reading: "ペルセム",
        explanation: "一つの数から別の数を引く演算。マイナス（-）。",
        examples: ["뺄셈을 배워요. - 引き算を習いましょう。", "뺄셈이 어려워요? - 引き算は難しいですか？"],
      },
    },
  },
  {
    id: "gopssem",
    korean: "곱셈",
    romanization: "gopsem",
    partOfSpeech: "noun",
    categoryId: "math",
    difficulty: "beginner",
    frequency: "common",
    tags: ["math", "operation"],
    translations: {
      ko: {
        word: "곱셈",
        explanation: "두 수를 곱하는 연산. 곱하기(×).",
        examples: ["곱셈 구구단을 외웠어요.", "곱셈을 해보세요."],
      },
      en: {
        word: "Multiplication",
        explanation: "The operation of multiplying two numbers. Times (×).",
        examples: ["곱셈 구구단을 외웠어요. - I memorized the multiplication table.", "곱셈을 해보세요. - Try multiplication."],
      },
      ja: {
        word: "掛け算",
        reading: "コプセム",
        explanation: "二つの数を掛ける演算。かける（×）。",
        examples: ["곱셈 구구단을 외웠어요. - 掛け算九九を覚えました。", "곱셈을 해보세요. - 掛け算をしてみてください。"],
      },
    },
  },
  {
    id: "nanusem",
    korean: "나눗셈",
    romanization: "nanutsem",
    partOfSpeech: "noun",
    categoryId: "math",
    difficulty: "beginner",
    frequency: "common",
    tags: ["math", "operation"],
    translations: {
      ko: {
        word: "나눗셈",
        explanation: "한 수를 다른 수로 나누는 연산. 나누기(÷).",
        examples: ["나눗셈을 배우고 있어요.", "나눗셈이 어려워요."],
      },
      en: {
        word: "Division",
        explanation: "The operation of dividing one number by another. Divided by (÷).",
        examples: ["나눗셈을 배우고 있어요. - I'm learning division.", "나눗셈이 어려워요. - Division is difficult."],
      },
      ja: {
        word: "割り算",
        reading: "ナヌッセム",
        explanation: "一つの数を別の数で割る演算。割る（÷）。",
        examples: ["나눗셈을 배우고 있어요. - 割り算を習っています。", "나눗셈이 어려워요. - 割り算は難しいです。"],
      },
    },
  },
  {
    id: "hamsu",
    korean: "함수",
    romanization: "hamsu",
    hanja: "函數",
    partOfSpeech: "noun",
    categoryId: "math",
    difficulty: "beginner",
    frequency: "common",
    tags: ["math", "function"],
    translations: {
      ko: {
        word: "함수",
        explanation: "입력값을 받아 출력값을 내는 관계. 수학의 중요한 개념.",
        examples: ["함수를 배워요.", "이것은 일차 함수예요."],
      },
      en: {
        word: "Function",
        explanation: "A relationship that takes input and gives output. An important math concept.",
        examples: ["함수를 배워요. - Let's learn functions.", "이것은 일차 함수예요. - This is a linear function."],
      },
      ja: {
        word: "関数",
        reading: "ハムス",
        explanation: "入力値を受けて出力値を出す関係。数学の重要な概念。",
        examples: ["함수를 배워요. - 関数を習いましょう。", "이것은 일차 함수예요. - これは一次関数です。"],
      },
    },
  },
  {
    id: "gihahak",
    korean: "기하학",
    romanization: "gihahak",
    hanja: "幾何學",
    partOfSpeech: "noun",
    categoryId: "math",
    difficulty: "beginner",
    frequency: "common",
    tags: ["math", "geometry"],
    translations: {
      ko: {
        word: "기하학",
        explanation: "도형과 공간을 연구하는 수학 분야. 삼각형, 원 등을 다룬다.",
        examples: ["기하학이 재미있어요.", "기하학 문제를 풀었어요."],
      },
      en: {
        word: "Geometry",
        explanation: "The branch of math studying shapes and space. Deals with triangles, circles, etc.",
        examples: ["기하학이 재미있어요. - Geometry is interesting.", "기하학 문제를 풀었어요. - I solved a geometry problem."],
      },
      ja: {
        word: "幾何学",
        reading: "キハハク",
        explanation: "図形と空間を研究する数学分野。三角形、円などを扱う。",
        examples: ["기하학이 재미있어요. - 幾何学は面白いです。", "기하학 문제를 풀었어요. - 幾何学の問題を解きました。"],
      },
    },
  },
  {
    id: "bangjeongshik",
    korean: "방정식",
    romanization: "bangjeongsik",
    hanja: "方程式",
    partOfSpeech: "noun",
    categoryId: "math",
    difficulty: "beginner",
    frequency: "common",
    tags: ["math", "equation"],
    translations: {
      ko: {
        word: "방정식",
        explanation: "미지수를 포함한 등식. x를 구하는 것이 목표.",
        examples: ["방정식을 풀어요.", "이차 방정식을 배웠어요."],
      },
      en: {
        word: "Equation",
        explanation: "An equality containing unknowns. The goal is to find x.",
        examples: ["방정식을 풀어요. - Let's solve the equation.", "이차 방정식을 배웠어요. - I learned quadratic equations."],
      },
      ja: {
        word: "方程式",
        reading: "パンジョンシク",
        explanation: "未知数を含む等式。xを求めることが目標。",
        examples: ["방정식을 풀어요. - 方程式を解きましょう。", "이차 방정식을 배웠어요. - 二次方程式を習いました。"],
      },
    },
  },
  {
    id: "bunsu",
    korean: "분수",
    romanization: "bunsu",
    hanja: "分數",
    partOfSpeech: "noun",
    categoryId: "math",
    difficulty: "beginner",
    frequency: "common",
    tags: ["math", "fraction"],
    translations: {
      ko: {
        word: "분수",
        explanation: "전체를 나눈 부분을 나타내는 수. 분자와 분모로 이루어진다.",
        examples: ["분수를 배워요.", "이분의 일은 0.5예요."],
      },
      en: {
        word: "Fraction",
        explanation: "A number representing a part of a whole. Consists of numerator and denominator.",
        examples: ["분수를 배워요. - Let's learn fractions.", "이분의 일은 0.5예요. - One half is 0.5."],
      },
      ja: {
        word: "分数",
        reading: "プンス",
        explanation: "全体を分けた部分を表す数。分子と分母で構成される。",
        examples: ["분수를 배워요. - 分数を習いましょう。", "이분의 일은 0.5예요. - 二分の一は0.5です。"],
      },
    },
  },
  {
    id: "gyesan",
    korean: "계산",
    romanization: "gyesan",
    hanja: "計算",
    partOfSpeech: "noun",
    categoryId: "math",
    difficulty: "beginner",
    frequency: "common",
    tags: ["math", "calculation"],
    translations: {
      ko: {
        word: "계산",
        explanation: "수를 더하고, 빼고, 곱하고, 나누는 것. 수학의 기본 활동.",
        examples: ["계산이 빨라요.", "계산기로 계산해요."],
      },
      en: {
        word: "Calculation",
        explanation: "Adding, subtracting, multiplying, dividing numbers. Basic math activity.",
        examples: ["계산이 빨라요. - Your calculation is fast.", "계산기로 계산해요. - I calculate with a calculator."],
      },
      ja: {
        word: "計算",
        reading: "ケサン",
        explanation: "数を足し、引き、掛け、割ること。数学の基本活動。",
        examples: ["계산이 빨라요. - 計算が速いですね。", "계산기로 계산해요. - 電卓で計算します。"],
      },
    },
  },
];

// Get entries by category
export function getEntriesByCategory(categoryId: string): MeaningEntry[] {
  return meaningEntries.filter((e) => e.categoryId === categoryId);
}

// Get entry by ID
export function getEntryById(id: string): MeaningEntry | undefined {
  return meaningEntries.find((e) => e.id === id);
}

// Search entries
export function searchEntries(
  query: string,
  lang: Language
): MeaningEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return meaningEntries.filter((e) => {
    const translation = e.translations[lang];
    return (
      e.korean.includes(q) ||
      e.romanization.toLowerCase().includes(q) ||
      translation.word.toLowerCase().includes(q) ||
      translation.explanation.toLowerCase().includes(q) ||
      e.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });
}

// Get featured entries (for homepage)
export function getFeaturedEntries(count: number = 6): MeaningEntry[] {
  return meaningEntries
    .filter((e) => e.difficulty === "beginner" && e.frequency === "common")
    .slice(0, count);
}

// Get entries by difficulty
export function getEntriesByDifficulty(
  difficulty: MeaningEntry["difficulty"]
): MeaningEntry[] {
  return meaningEntries.filter((e) => e.difficulty === difficulty);
}
