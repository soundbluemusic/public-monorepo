import type { MeaningEntry, Language, TargetLanguage } from "./types";

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
      en: {
        word: "Hi / Bye",
        explanation: "A casual greeting used among friends and peers. Can mean both 'hello' and 'goodbye' depending on context. Used in informal situations.",
        examples: [
          "안녕! 오랜만이야! - Hi! Long time no see!",
          "안녕, 내일 봐! - Bye, see you tomorrow!",
        ],
      },
      ja: {
        word: "やあ / じゃあね",
        reading: "やあ / じゃあね",
        explanation: "友達同士で使うカジュアルな挨拶。文脈によって「こんにちは」と「さようなら」の両方の意味があります。",
        examples: [
          "안녕! 오랜만이야! - やあ！久しぶり！",
          "안녕, 내일 봐! - じゃあね、また明日！",
        ],
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
      en: {
        word: "Hello",
        explanation: "The standard polite greeting in Korean. Used when meeting someone or starting a conversation. Appropriate for most situations.",
        examples: [
          "안녕하세요, 처음 뵙겠습니다. - Hello, nice to meet you.",
          "안녕하세요! 잘 지내셨어요? - Hello! How have you been?",
        ],
      },
      ja: {
        word: "こんにちは",
        reading: "こんにちは",
        explanation: "韓国語の標準的な丁寧な挨拶です。誰かに会った時や会話を始める時に使います。",
        examples: [
          "안녕하세요, 처음 뵙겠습니다. - こんにちは、初めまして。",
          "안녕하세요! 잘 지내셨어요? - こんにちは！お元気でしたか？",
        ],
      },
    },
  },
  {
    id: "gomapseumnida",
    korean: "감사합니다",
    romanization: "gamsahamnida",
    hanja: "感謝",
    partOfSpeech: "interjection",
    categoryId: "greetings",
    difficulty: "beginner",
    frequency: "common",
    tags: ["formal", "polite", "gratitude"],
    translations: {
      en: {
        word: "Thank you",
        explanation: "Formal way to express gratitude. More formal than '고마워요'. Used in professional settings and with elders.",
        examples: [
          "도와주셔서 감사합니다. - Thank you for helping me.",
          "감사합니다, 좋은 하루 되세요. - Thank you, have a nice day.",
        ],
      },
      ja: {
        word: "ありがとうございます",
        reading: "ありがとうございます",
        explanation: "感謝を表す丁寧な表現です。'고마워요'よりフォーマルで、ビジネスシーンや目上の人に使います。",
        examples: [
          "도와주셔서 감사합니다. - 手伝ってくださりありがとうございます。",
          "감사합니다, 좋은 하루 되세요. - ありがとうございます、良い一日を。",
        ],
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
      en: {
        word: "Goodbye (to someone leaving)",
        explanation: "Said to someone who is leaving while you stay. Literally means 'go peacefully'. The counterpart is '안녕히 계세요' (stay peacefully).",
        examples: [
          "안녕히 가세요! 조심히 가세요. - Goodbye! Be careful on your way.",
        ],
      },
      ja: {
        word: "さようなら（去る人へ）",
        reading: "さようなら",
        explanation: "自分が残り、相手が去る時に使う別れの挨拶。直訳は「安寧にお行きください」。対の表現は「안녕히 계세요」（安寧にお居てください）。",
        examples: [
          "안녕히 가세요! 조심히 가세요. - さようなら！気をつけて。",
        ],
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
      en: {
        word: "Love",
        explanation: "A deep affection for someone or something. Used for romantic love, family love, and love for things/activities.",
        examples: [
          "사랑해요. - I love you.",
          "가족의 사랑은 소중해요. - Family love is precious.",
        ],
      },
      ja: {
        word: "愛",
        reading: "あい",
        explanation: "誰かや何かへの深い愛情。恋愛、家族愛、物事への愛など幅広く使われます。",
        examples: [
          "사랑해요. - 愛しています。",
          "가족의 사랑은 소중해요. - 家族の愛は大切です。",
        ],
      },
    },
  },
  {
    id: "haengbok",
    korean: "행복",
    romanization: "haengbok",
    hanja: "幸福",
    partOfSpeech: "noun",
    categoryId: "emotions",
    difficulty: "beginner",
    frequency: "common",
    tags: ["emotion", "positive"],
    translations: {
      en: {
        word: "Happiness",
        explanation: "A state of being happy or content. Can be used as noun '행복' or adjective '행복하다' (to be happy).",
        examples: [
          "행복하세요! - Be happy!",
          "작은 것에서 행복을 찾아요. - I find happiness in small things.",
        ],
      },
      ja: {
        word: "幸せ",
        reading: "しあわせ",
        explanation: "幸せな状態のこと。名詞の「행복」、形容詞の「행복하다」（幸せだ）として使えます。",
        examples: [
          "행복하세요! - 幸せでありますように！",
          "작은 것에서 행복을 찾아요. - 小さなことに幸せを見つけます。",
        ],
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
        reading: "かなしみ",
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
        reading: "いえ",
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
    hanja: "學校",
    partOfSpeech: "noun",
    categoryId: "daily-life",
    difficulty: "beginner",
    frequency: "common",
    tags: ["place", "education"],
    translations: {
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
        reading: "がっこう",
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
        reading: "しごと / こと",
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
        reading: "ごはん",
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
        reading: "みず",
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
        reading: "ここ",
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
        reading: "どこ",
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
        reading: "かいしゃ",
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
        reading: "かいぎ",
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
        reading: "じょう",
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
        reading: "ひとつ",
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
        reading: "きょう",
        explanation: "今日のこと。基本的な時間の単語：어제（昨日）、오늘（今日）、내일（明日）の一つです。",
        examples: [
          "오늘 뭐 해요? - 今日何しますか？",
          "오늘 날씨가 좋아요. - 今日は天気がいいですね。",
        ],
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
  targetLang: TargetLanguage
): MeaningEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return meaningEntries.filter((e) => {
    const translation = e.translations[targetLang];
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
