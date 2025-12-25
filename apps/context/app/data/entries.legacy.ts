import type { Language, MeaningEntry } from './types';

export const meaningEntries: MeaningEntry[] = [
  // Greetings
  {
    id: 'annyeong',
    korean: '안녕',
    romanization: 'annyeong',
    partOfSpeech: 'interjection',
    categoryId: 'greetings',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['casual', 'informal', 'daily'],
    translations: {
      ko: {
        word: '안녕',
        explanation:
          "친구나 또래 사이에서 사용하는 반말 인사. 상황에 따라 '만나서 반가워'와 '잘 가'의 의미로 모두 쓰인다. 격식 없는 상황에서 사용한다.",
        examples: [
          '안녕! 오랜만이야!',
          '안녕, 내일 봐!',
          "어제 카페에서 우연히 민수를 만났는데, 서로 눈이 마주치자마자 반갑게 '안녕!'하고 인사했어.",
          "수업이 끝나고 친구들이 하나둘 교실을 나서면서 '안녕, 내일 봐!'라고 인사를 나눴다.",
        ],
        variations: {
          formal: ['안녕하십니까, 오래간만입니다.', '안녕하세요, 그동안 잘 지내셨어요?'],
          casual: ['안녕, 잘 지냈어?', '안녕~ 뭐해?', '야, 안녕!'],
          short: ['ㅎㅇ', '안녕~'],
        },
      },
      en: {
        word: 'Hi / Bye',
        explanation:
          "A casual greeting used among friends and peers. Can mean both 'hello' and 'goodbye' depending on context. Used in informal situations.",
        examples: [
          '안녕! 오랜만이야! - Hi! Long time no see!',
          '안녕, 내일 봐! - Bye, see you tomorrow!',
          "I ran into Minsu at the café yesterday, and the moment our eyes met, we happily greeted each other with '안녕!'",
          "After class ended, friends left the classroom one by one, exchanging farewells like '안녕, 내일 봐!' (Bye, see you tomorrow!)",
        ],
        variations: {
          formal: ["Hello, it's been a while.", 'Good day, how have you been?'],
          casual: ["Hey, what's up?", 'Hi there!', "Yo, what's going on?"],
          short: ['Hi~', 'Hey!', 'Sup?'],
        },
      },
    },
  },
  {
    id: 'annyeonghaseyo',
    korean: '안녕하세요',
    romanization: 'annyeonghaseyo',
    partOfSpeech: 'interjection',
    categoryId: 'greetings',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['formal', 'polite', 'daily'],
    translations: {
      ko: {
        word: '안녕하세요',
        explanation:
          '한국어의 기본적인 존댓말 인사. 누군가를 만나거나 대화를 시작할 때 사용한다. 대부분의 상황에 적절한 인사말이다.',
        examples: [
          '안녕하세요, 처음 뵙겠습니다.',
          '안녕하세요! 잘 지내셨어요?',
          '면접장에 들어서자마자 면접관들을 향해 밝은 목소리로 "안녕하세요, 오늘 면접에 참여하게 된 김지민입니다"라고 인사했다.',
          '엘리베이터에서 이웃 주민을 만나면 항상 "안녕하세요"라고 인사하는 게 예의이다.',
        ],
        variations: {
          formal: [
            '안녕하십니까, 뵙게 되어 영광입니다.',
            '안녕하세요, 만나 뵙게 되어 반갑습니다.',
            '안녕하세요, 오늘 하루도 좋은 하루 되세요.',
          ],
          casual: ['안녕, 반가워!', '안녕! 잘 지내?'],
          short: ['안녕~', '하이!'],
        },
      },
      en: {
        word: 'Hello',
        explanation:
          'The standard polite greeting in Korean. Used when meeting someone or starting a conversation. Appropriate for most situations.',
        examples: [
          '안녕하세요, 처음 뵙겠습니다. - Hello, nice to meet you.',
          '안녕하세요! 잘 지내셨어요? - Hello! How have you been?',
          'As soon as I entered the interview room, I greeted the interviewers brightly: "안녕하세요, I\'m Kim Jimin, here for the interview today."',
          'It\'s polite to always greet your neighbors with "안녕하세요" when you meet them in the elevator.',
        ],
        variations: {
          formal: [
            "Good morning/afternoon, it's a pleasure to meet you.",
            "Hello, I'm honored to make your acquaintance.",
            "Greetings, I hope you're doing well.",
          ],
          casual: ['Hey! Nice to see you!', "Hi! How's it going?"],
          short: ['Hey~', 'Hi!'],
        },
      },
    },
  },
  {
    id: 'gomapseumnida',
    korean: '감사합니다',
    romanization: 'gamsahamnida',
    pronunciation: '[감사함니다]',
    partOfSpeech: 'interjection',
    categoryId: 'greetings',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['formal', 'polite', 'gratitude'],
    translations: {
      ko: {
        word: '감사합니다',
        explanation:
          "감사를 표현하는 격식체 표현. '고마워요'보다 더 격식 있는 표현으로, 직장이나 어른에게 사용한다.",
        examples: [
          '도와주셔서 감사합니다.',
          '감사합니다, 좋은 하루 되세요.',
          '프로젝트를 성공적으로 마칠 수 있도록 밤늦게까지 도와주신 팀원들께 진심으로 감사합니다.',
          '버스에서 자리를 양보해 주신 학생에게 할머니께서 "정말 감사합니다, 요즘 젊은이들 참 착하네요"라고 말씀하셨다.',
        ],
        variations: {
          formal: [
            '정말 감사드립니다.',
            '진심으로 감사의 말씀을 드립니다.',
            '감사합니다, 덕분에 큰 도움이 되었습니다.',
          ],
          casual: ['고마워!', '땡큐~', '고마워, 정말 도움이 됐어!'],
          short: ['ㄱㅅ', '감사~', '땡스!'],
        },
      },
      en: {
        word: 'Thank you',
        explanation:
          "Formal way to express gratitude. More formal than '고마워요'. Used in professional settings and with elders.",
        examples: [
          '도와주셔서 감사합니다. - Thank you for helping me.',
          '감사합니다, 좋은 하루 되세요. - Thank you, have a nice day.',
          'I sincerely thank all the team members who worked late into the night to help us successfully complete the project.',
          'When a student gave up their seat on the bus, the grandmother said, "감사합니다 (Thank you), young people these days are so kind."',
        ],
        variations: {
          formal: [
            'I sincerely appreciate your help.',
            'Thank you very much for your assistance.',
            "I'm deeply grateful for your kindness.",
          ],
          casual: ['Thanks a lot!', "Thanks, you're the best!", 'Thank you so much!'],
          short: ['Thx!', 'Ty!', 'Thanks~'],
        },
      },
    },
  },
  {
    id: 'annyeonghigaseyo',
    korean: '안녕히 가세요',
    romanization: 'annyeonghi gaseyo',
    partOfSpeech: 'expression',
    categoryId: 'greetings',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['formal', 'farewell', 'polite'],
    translations: {
      ko: {
        word: '안녕히 가세요',
        explanation:
          "떠나는 사람에게 하는 인사. 직역하면 '평안히 가세요'라는 뜻. 자신이 남고 상대가 떠날 때 사용한다. 반대 표현은 '안녕히 계세요'(평안히 계세요)이다.",
        examples: [
          '안녕히 가세요! 조심히 가세요.',
          '손님이 가게를 나설 때 직원이 문 앞까지 배웅하며 "안녕히 가세요, 또 오세요!"라고 인사했다.',
          '할머니 댁에서 하루를 보내고 떠나는 손자에게 할머니께서 대문 앞까지 나와 손을 흔들며 "안녕히 가세요, 다음에 또 놀러 와"라고 말씀하셨다.',
        ],
        variations: {
          formal: [
            '안녕히 가십시오, 좋은 하루 되세요.',
            '조심히 돌아가세요, 다음에 또 뵙겠습니다.',
          ],
          casual: ['잘 가!', '가는 길 조심해~', '나중에 봐!'],
          short: ['잘 가~', '바이바이!', '빠이~'],
        },
      },
      en: {
        word: 'Goodbye (to someone leaving)',
        explanation:
          "Said to someone who is leaving while you stay. Literally means 'go peacefully'. The counterpart is '안녕히 계세요' (stay peacefully).",
        examples: [
          '안녕히 가세요! 조심히 가세요. - Goodbye! Be careful on your way.',
          'When the customer was leaving the store, the employee walked them to the door and said, "안녕히 가세요, please come again!"',
          'After spending a day at grandma\'s house, grandma came out to the front gate, waving and saying, "안녕히 가세요, come visit again soon."',
        ],
        variations: {
          formal: ['Farewell, have a safe journey.', 'Goodbye, I hope to see you again soon.'],
          casual: ['See ya!', 'Take care on your way!', 'Later!'],
          short: ['Bye~', 'Cya!', 'Peace!'],
        },
      },
    },
  },

  // Emotions
  {
    id: 'sarang',
    korean: '사랑',
    romanization: 'sarang',
    partOfSpeech: 'noun',
    categoryId: 'emotions',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['emotion', 'relationship'],
    translations: {
      ko: {
        word: '사랑',
        explanation:
          '누군가나 무언가에 대한 깊은 애정. 연인 간의 사랑, 가족 간의 사랑, 취미나 활동에 대한 사랑 등 다양하게 쓰인다.',
        examples: [
          '사랑해요.',
          '가족의 사랑은 소중해요.',
          '결혼식 날 신랑이 신부에게 "당신을 만나 진정한 사랑이 무엇인지 알게 되었습니다"라고 고백했다.',
          '어머니의 사랑은 조건 없이 주어지는 것이라서, 자식이 어떤 실수를 해도 항상 곁에서 응원해 주신다.',
        ],
        variations: {
          formal: [
            '당신을 진심으로 사랑합니다.',
            '사랑하고 존경합니다.',
            '항상 사랑하는 마음 변치 않겠습니다.',
          ],
          casual: ['사랑해!', '너무 좋아해~', '나 너 진짜 좋아해.'],
          short: ['ㅅㄹㅎ', '사랑행~', '좋아♥'],
        },
      },
      en: {
        word: 'Love',
        explanation:
          'A deep affection for someone or something. Used for romantic love, family love, and love for things/activities.',
        examples: [
          '사랑해요. - I love you.',
          '가족의 사랑은 소중해요. - Family love is precious.',
          'On their wedding day, the groom confessed to the bride, "Meeting you taught me what true love really means."',
          "A mother's love is unconditional—no matter what mistakes her children make, she always supports them.",
        ],
        variations: {
          formal: [
            'I sincerely love you.',
            'My love and respect for you is eternal.',
            'You have all my love and devotion.',
          ],
          casual: ['Love ya!', 'I really like you~', 'You mean so much to me!'],
          short: ['Luv u!', 'ILY', '<3'],
        },
      },
    },
  },
  {
    id: 'haengbok',
    korean: '행복',
    romanization: 'haengbok',
    pronunciation: '[행복]',
    partOfSpeech: 'noun',
    categoryId: 'emotions',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['emotion', 'positive'],
    translations: {
      ko: {
        word: '행복',
        explanation:
          "행복하거나 만족스러운 상태. 명사 '행복' 또는 형용사 '행복하다'로 사용할 수 있다.",
        examples: [
          '행복하세요!',
          '작은 것에서 행복을 찾아요.',
          '퇴근 후 따뜻한 집에서 가족들과 함께 저녁을 먹는 순간이 가장 행복하다고 느낀다.',
          '여행을 떠나기 전날 밤, 설레는 마음에 잠이 오지 않을 정도로 행복했다.',
        ],
        variations: {
          formal: [
            '행복하시길 바랍니다.',
            '모든 일에 행복이 함께하시길 기원합니다.',
            '항상 행복하고 건강하시길 바랍니다.',
          ],
          casual: ['행복해!', '너무 행복해~', '진짜 행복하다!'],
          short: ['행복♥', '최고!', '굿굿~'],
        },
      },
      en: {
        word: 'Happiness',
        explanation:
          "A state of being happy or content. Can be used as noun '행복' or adjective '행복하다' (to be happy).",
        examples: [
          '행복하세요! - Be happy!',
          '작은 것에서 행복을 찾아요. - I find happiness in small things.',
          'The moment I feel happiest is having dinner with my family in our warm home after work.',
          "The night before the trip, I was so excited I couldn't sleep—I was filled with happiness.",
        ],
        variations: {
          formal: [
            'I wish you happiness.',
            'May happiness be with you always.',
            'Wishing you all the best and happiness.',
          ],
          casual: ['So happy!', "I'm so happy right now~", 'This makes me really happy!'],
          short: ['Happy♥', 'Yay!', ':D'],
        },
      },
    },
  },
  {
    id: 'seulpeum',
    korean: '슬픔',
    romanization: 'seulpeum',
    partOfSpeech: 'noun',
    categoryId: 'emotions',
    difficulty: 'intermediate',
    frequency: 'frequent',
    tags: ['emotion', 'negative'],
    translations: {
      ko: {
        word: '슬픔',
        explanation: "슬프거나 불행한 감정. 형용사형은 '슬프다'이다.",
        examples: [
          '슬픔을 참을 수 없어요.',
          '슬픔도 지나가요.',
          '오랫동안 함께한 반려견이 세상을 떠났을 때, 그 슬픔은 말로 표현할 수 없을 정도로 컸다.',
          '실패를 경험했을 때 느끼는 슬픔은 자연스러운 감정이니, 너무 자신을 탓하지 마세요.',
        ],
      },
      en: {
        word: 'Sadness',
        explanation:
          "A feeling of sorrow or unhappiness. The adjective form is '슬프다' (to be sad).",
        examples: [
          "슬픔을 참을 수 없어요. - I can't hold back my sadness.",
          '슬픔도 지나가요. - Sadness also passes.',
          'When my longtime companion dog passed away, the sadness was beyond words.',
          "The sadness you feel when experiencing failure is a natural emotion, so don't be too hard on yourself.",
        ],
      },
    },
  },

  // Daily Life
  {
    id: 'jip',
    korean: '집',
    romanization: 'jip',
    partOfSpeech: 'noun',
    categoryId: 'daily-life',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['place', 'basic'],
    translations: {
      ko: {
        word: '집',
        explanation:
          "사람이 사는 건물, 또는 '가정'의 개념. 가장 기본적이고 자주 쓰이는 단어 중 하나이다.",
        examples: [
          '집에 가고 싶어요.',
          '우리 집은 서울에 있어요.',
          '오랜 출장을 마치고 집에 돌아왔을 때, 익숙한 냄새와 분위기가 나를 반겨주어 마음이 편안해졌다.',
          '어린 시절 살던 집을 다시 방문하니 추억이 새록새록 떠올랐다.',
        ],
      },
      en: {
        word: 'House / Home',
        explanation:
          "A building where people live, or the concept of 'home'. One of the most basic and frequently used words.",
        examples: [
          '집에 가고 싶어요. - I want to go home.',
          '우리 집은 서울에 있어요. - My house is in Seoul.',
          'When I returned home after a long business trip, the familiar smell and atmosphere welcomed me and put my mind at ease.',
          'Visiting the house where I lived as a child brought back many fond memories.',
        ],
      },
    },
  },
  {
    id: 'hakgyo',
    korean: '학교',
    romanization: 'hakgyo',
    pronunciation: '[학꾜]',
    partOfSpeech: 'noun',
    categoryId: 'daily-life',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['place', 'education'],
    translations: {
      ko: {
        word: '학교',
        explanation: '학생들을 교육하는 기관. 초등학교, 중학교, 고등학교, 대학교를 포함한다.',
        examples: [
          '학교에 다녀요.',
          '학교 끝나고 뭐 해?',
          '매일 아침 7시에 일어나서 학교에 가는 게 힘들지만, 친구들을 만날 생각에 기분이 좋아진다.',
          '우리 학교는 100년의 역사를 가진 전통 있는 학교로, 많은 유명 인사들이 이곳을 졸업했다.',
        ],
      },
      en: {
        word: 'School',
        explanation:
          'An institution for educating students. Includes elementary, middle, high school, and university.',
        examples: [
          '학교에 다녀요. - I go to school.',
          '학교 끝나고 뭐 해? - What are you doing after school?',
          'Waking up at 7 AM every morning to go to school is tough, but thinking about meeting my friends cheers me up.',
          'Our school has a 100-year history and tradition—many famous people graduated from here.',
        ],
      },
    },
  },
  {
    id: 'il',
    korean: '일',
    romanization: 'il',
    partOfSpeech: 'noun',
    categoryId: 'daily-life',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['work', 'basic'],
    translations: {
      ko: {
        word: '일',
        explanation:
          "직업이나 업무, 또는 '일/사건'을 의미한다. 숫자 '일(一)'로도 쓰인다 (일, 이, 삼...).",
        examples: [
          '일이 많아요.',
          '무슨 일이에요?',
          '요즘 회사에서 새로운 프로젝트 때문에 일이 너무 많아서 주말에도 출근해야 할 것 같다.',
          '갑자기 무슨 일이 생긴 거예요? 표정이 안 좋아 보여서 걱정이 돼요.',
        ],
      },
      en: {
        word: 'Work / Job / Thing',
        explanation:
          "Can mean work/job, a task, or 'a thing/matter'. Also means the number 'one' (일, 이, 삼...).",
        examples: [
          '일이 많아요. - I have a lot of work.',
          "무슨 일이에요? - What's the matter?",
          "These days, I have so much work because of a new project at the company that I'll probably have to come in on weekends too.",
          "What happened all of a sudden? You don't look well and I'm worried about you.",
        ],
      },
    },
  },

  // Food
  {
    id: 'bap',
    korean: '밥',
    romanization: 'bap',
    partOfSpeech: 'noun',
    categoryId: 'food',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['food', 'basic', 'staple'],
    translations: {
      ko: {
        word: '밥',
        explanation:
          "지은 쌀, 한국의 주식. '식사' 전체를 의미하기도 한다. '밥 먹었어?'(식사했어?)는 일상적인 인사다.",
        examples: [
          '밥 먹었어요?',
          '밥 먹으러 가자!',
          '한국에서는 "밥 먹었어요?"라는 말이 단순한 질문이 아니라 상대방의 안부를 묻는 인사처럼 사용된다.',
          '엄마가 해주신 따뜻한 집밥을 먹으면 어떤 스트레스도 사라지는 것 같다.',
        ],
      },
      en: {
        word: 'Rice / Meal',
        explanation:
          "Cooked rice, the staple food of Korea. Also used to mean 'meal' in general. '밥 먹었어?' (Did you eat?) is a common greeting.",
        examples: [
          '밥 먹었어요? - Have you eaten?',
          "밥 먹으러 가자! - Let's go eat!",
          'In Korea, asking "밥 먹었어요?" (Have you eaten?) is not just a simple question but is used as a greeting to check on someone\'s well-being.',
          'When I eat the warm home-cooked meal my mom makes, all my stress seems to melt away.',
        ],
      },
    },
  },
  {
    id: 'kimchi',
    korean: '김치',
    romanization: 'kimchi',
    partOfSpeech: 'noun',
    categoryId: 'food',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['food', 'korean', 'traditional'],
    translations: {
      ko: {
        word: '김치',
        explanation:
          '한국 전통 발효 채소 요리. 주로 배추와 무로 만든다. 한국 음식의 기본 반찬이다.',
        examples: [
          '김치 좋아해요?',
          '김치찌개 먹고 싶어요.',
          '할머니께서 담그신 김치는 시중에서 파는 것과는 비교할 수 없을 정도로 맛있다.',
          '외국인 친구에게 김치를 소개했더니 처음에는 매워서 힘들어했지만, 지금은 푹 빠져서 매일 먹는다.',
        ],
      },
      en: {
        word: 'Kimchi',
        explanation:
          'Traditional Korean fermented vegetable dish, usually made with napa cabbage and radish. A staple side dish in Korean cuisine.',
        examples: [
          '김치 좋아해요? - Do you like kimchi?',
          '김치찌개 먹고 싶어요. - I want to eat kimchi stew.',
          'The kimchi my grandmother makes is incomparably more delicious than store-bought ones.',
          "When I introduced kimchi to my foreign friend, they struggled with the spiciness at first, but now they're hooked and eat it every day.",
        ],
      },
    },
  },
  {
    id: 'mul',
    korean: '물',
    romanization: 'mul',
    partOfSpeech: 'noun',
    categoryId: 'food',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['drink', 'basic'],
    translations: {
      ko: {
        word: '물',
        explanation: '가장 기본적인 음료. 식당에서 주문할 때 필수 어휘다.',
        examples: [
          '물 주세요.',
          '물 마시고 싶어요.',
          '등산을 할 때는 충분한 물을 가져가야 탈수를 예방할 수 있다.',
          '한국 식당에서는 물을 무료로 제공하는 경우가 많아서 따로 주문하지 않아도 된다.',
        ],
      },
      en: {
        word: 'Water',
        explanation: 'The most basic drink. Essential vocabulary for ordering at restaurants.',
        examples: [
          '물 주세요. - Water, please.',
          '물 마시고 싶어요. - I want to drink water.',
          'When hiking, you should bring enough water to prevent dehydration.',
          "In Korean restaurants, water is often provided for free, so you don't need to order it separately.",
        ],
      },
    },
  },

  // Travel
  {
    id: 'yeogi',
    korean: '여기',
    romanization: 'yeogi',
    partOfSpeech: 'pronoun',
    categoryId: 'travel',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['location', 'basic'],
    translations: {
      ko: {
        word: '여기',
        explanation:
          '말하는 사람 가까이에 있는 장소를 가리킨다. 여기(이곳), 거기(그곳), 저기(저곳) 세 가지 중 하나다.',
        examples: [
          '여기가 어디예요?',
          '여기 앉으세요.',
          '택시 기사님께 "여기서 내려주세요"라고 말하면 원하는 곳에서 내릴 수 있다.',
          '여기가 바로 드라마에서 자주 나오던 그 유명한 카페예요!',
        ],
      },
      en: {
        word: 'Here',
        explanation:
          'Indicates a location near the speaker. Part of the trio: 여기 (here), 거기 (there), 저기 (over there).',
        examples: [
          '여기가 어디예요? - Where is this place?',
          '여기 앉으세요. - Please sit here.',
          'If you tell the taxi driver "여기서 내려주세요" (Please drop me off here), you can get off where you want.',
          'This is the famous café that often appeared in the drama!',
        ],
      },
    },
  },
  {
    id: 'eodi',
    korean: '어디',
    romanization: 'eodi',
    partOfSpeech: 'pronoun',
    categoryId: 'travel',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['question', 'location'],
    translations: {
      ko: {
        word: '어디',
        explanation: '장소나 위치를 묻는 의문사. 길을 묻거나 방향을 확인할 때 필수 어휘다.',
        examples: [
          '어디 가요?',
          '화장실이 어디에 있어요?',
          '처음 방문한 도시에서 길을 잃었을 때, 지나가는 사람에게 "지하철역이 어디에 있어요?"라고 물어봤다.',
          '주말에 어디 갔었어요? 사진을 보니까 정말 아름다운 곳 같아요.',
        ],
      },
      en: {
        word: 'Where',
        explanation:
          'A question word asking about location or place. Essential for navigation and asking directions.',
        examples: [
          '어디 가요? - Where are you going?',
          '화장실이 어디에 있어요? - Where is the bathroom?',
          'When I got lost in a city I was visiting for the first time, I asked a passerby, "어디에 지하철역이 있어요?" (Where is the subway station?)',
          'Where did you go over the weekend? Looking at the photos, it seems like a really beautiful place.',
        ],
      },
    },
  },

  // Work
  {
    id: 'hoesa',
    korean: '회사',
    romanization: 'hoesa',
    partOfSpeech: 'noun',
    categoryId: 'work',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['work', 'business'],
    translations: {
      ko: {
        word: '회사',
        explanation: '사업 조직이나 기업. 직장에 대해 이야기할 때 사용한다.',
        examples: [
          '회사에 가요.',
          '어느 회사에 다녀요?',
          '우리 회사는 직원 복지가 좋아서 연차 휴가도 넉넉하고 야근도 거의 없다.',
          '대학을 졸업하고 취업 준비를 하다가 마침내 원하던 회사에 합격했다는 소식을 들었을 때 정말 기뻤다.',
        ],
      },
      en: {
        word: 'Company',
        explanation: 'A business organization or corporation. Used when talking about workplace.',
        examples: [
          "회사에 가요. - I'm going to work (company).",
          '어느 회사에 다녀요? - Which company do you work at?',
          'Our company has great employee benefits—generous vacation days and almost no overtime.',
          'After graduating from university and preparing for employment, I was so happy when I heard the news that I got accepted to the company I wanted.',
        ],
      },
    },
  },
  {
    id: 'hoeuii',
    korean: '회의',
    romanization: 'hoeui',
    partOfSpeech: 'noun',
    categoryId: 'work',
    difficulty: 'intermediate',
    frequency: 'frequent',
    tags: ['work', 'business'],
    translations: {
      ko: {
        word: '회의',
        explanation: '논의를 위한 모임. 주로 비즈니스 상황에서 사용한다.',
        examples: [
          '회의가 있어요.',
          '회의 끝났어요?',
          '오늘 오후 3시에 중요한 회의가 있어서 점심을 빨리 먹고 자료를 준비해야 한다.',
          '회의 중에 좋은 아이디어가 나와서 프로젝트 방향이 완전히 바뀌었다.',
        ],
      },
      en: {
        word: 'Meeting',
        explanation: 'A gathering of people for discussion, usually in a business context.',
        examples: [
          '회의가 있어요. - I have a meeting.',
          '회의 끝났어요? - Is the meeting over?',
          'I have an important meeting at 3 PM today, so I need to eat lunch quickly and prepare the materials.',
          'A great idea came up during the meeting, completely changing the direction of the project.',
        ],
      },
    },
  },

  // Culture
  {
    id: 'jeong',
    korean: '정',
    romanization: 'jeong',
    partOfSpeech: 'noun',
    categoryId: 'culture',
    difficulty: 'advanced',
    frequency: 'frequent',
    tags: ['culture', 'emotion', 'korean-concept'],
    translations: {
      ko: {
        word: '정',
        explanation:
          '시간이 지나면서 형성되는 깊은 감정적 유대, 애착을 나타내는 한국 고유의 개념. 사랑, 배려, 연결감을 포함한다.',
        examples: [
          '정이 들었어요.',
          '정이 많은 사람이에요.',
          '처음에는 불편했던 원룸이었지만, 3년을 살다 보니 어느새 정이 들어서 이사 가기가 아쉽다.',
          '한국에서는 식당 주인이 손님에게 "서비스"라며 음식을 더 주는데, 이것이 바로 정의 표현이다.',
        ],
      },
      en: {
        word: 'Jeong (emotional bond)',
        explanation:
          'A uniquely Korean concept describing deep emotional bonds, affection, and attachment formed over time. Difficult to translate directly - encompasses love, care, and connection.',
        examples: [
          "정이 들었어요. - I've grown attached.",
          "정이 많은 사람이에요. - They're a warm-hearted person.",
          "At first the studio apartment was uncomfortable, but after living there for 3 years, I've grown attached and feel sad about moving.",
          'In Korea, restaurant owners often give customers extra food as "service"—this is an expression of jeong.',
        ],
      },
    },
  },
  {
    id: 'nunchi',
    korean: '눈치',
    romanization: 'nunchi',
    partOfSpeech: 'noun',
    categoryId: 'culture',
    difficulty: 'advanced',
    frequency: 'frequent',
    tags: ['culture', 'social', 'korean-concept'],
    translations: {
      ko: {
        word: '눈치',
        explanation:
          '분위기를 파악하고 암묵적인 사회적 신호를 이해하는 능력. 한국의 사회적 상호작용에서 중요한 개념이다.',
        examples: [
          '눈치가 빨라요.',
          '눈치 좀 봐!',
          '회의 중에 상사의 표정을 보고 눈치껏 의견을 조심스럽게 말했다.',
          '친구들이 뭔가 숨기는 것 같은데, 눈치가 빨라서 금방 알아챘다.',
        ],
      },
      en: {
        word: 'Nunchi (social awareness)',
        explanation:
          'The art of reading the room and understanding unspoken social cues. Essential in Korean social interactions.',
        examples: [
          "눈치가 빨라요. - You're quick to catch on.",
          '눈치 좀 봐! - Read the room!',
          "During the meeting, I noticed my boss's expression and carefully shared my opinion using nunchi.",
          'It seemed like my friends were hiding something, but I picked up on it quickly because I have good nunchi.',
        ],
      },
    },
  },

  // Numbers & Time
  {
    id: 'hana',
    korean: '하나',
    romanization: 'hana',
    partOfSpeech: 'noun',
    categoryId: 'numbers',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['number', 'native-korean'],
    translations: {
      ko: {
        word: '하나',
        explanation:
          "고유어 수사로 '일(1)'을 나타낸다. 물건을 셀 때, 나이(살과 함께), 시간에 사용한다. 한자어 일(一)과는 다르다.",
        examples: [
          '하나, 둘, 셋!',
          '커피 하나 주세요.',
          '아이가 처음으로 "하나, 둘, 셋"을 세는 모습을 보고 부모님이 기뻐서 박수를 쳤다.',
          '시장에서 사과를 살 때 "아저씨, 사과 하나에 얼마예요?"라고 물었다.',
        ],
      },
      en: {
        word: 'One (native Korean)',
        explanation:
          "The native Korean number for 'one'. Used for counting objects, age (with 살), and hours. Different from Sino-Korean 일 (il).",
        examples: [
          '하나, 둘, 셋! - One, two, three!',
          '커피 하나 주세요. - One coffee, please.',
          'The parents clapped happily when their child counted "하나, 둘, 셋" for the first time.',
          'When buying apples at the market, I asked "How much is one apple?"',
        ],
      },
    },
  },
  {
    id: 'oneul',
    korean: '오늘',
    romanization: 'oneul',
    partOfSpeech: 'noun',
    categoryId: 'numbers',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['time', 'basic'],
    translations: {
      ko: {
        word: '오늘',
        explanation: '현재의 날. 기본 시간 어휘인 어제, 오늘, 내일 중 하나다.',
        examples: [
          '오늘 뭐 해요?',
          '오늘 날씨가 좋아요.',
          '오늘은 정말 피곤해서 집에 가자마자 바로 잠들어 버렸다.',
          '오늘 하루만큼은 걱정을 내려놓고 즐거운 시간을 보내자고 다짐했다.',
        ],
      },
      en: {
        word: 'Today',
        explanation:
          'The current day. Part of the basic time vocabulary: 어제 (yesterday), 오늘 (today), 내일 (tomorrow).',
        examples: [
          '오늘 뭐 해요? - What are you doing today?',
          '오늘 날씨가 좋아요. - The weather is nice today.',
          'I was so tired today that I fell asleep as soon as I got home.',
          "I promised myself that just for today, I'd let go of my worries and have a good time.",
        ],
      },
    },
  },

  // Music
  {
    id: 'piano',
    korean: '피아노',
    romanization: 'piano',
    partOfSpeech: 'noun',
    categoryId: 'music',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['instrument', 'music'],
    translations: {
      ko: {
        word: '피아노',
        explanation: '건반 악기. 클래식부터 팝까지 다양한 장르에서 사용되는 대표적인 악기.',
        examples: [
          '피아노를 배우고 있어요.',
          '피아노 연주가 아름다워요.',
          '어렸을 때부터 피아노를 배웠는데, 처음에는 힘들었지만 지금은 연주하는 것이 가장 큰 취미가 되었다.',
          '카페에서 들려오는 잔잔한 피아노 음악에 마음이 편안해졌다.',
        ],
      },
      en: {
        word: 'Piano',
        explanation:
          'A keyboard instrument. One of the most popular instruments used across various genres from classical to pop.',
        examples: [
          "피아노를 배우고 있어요. - I'm learning piano.",
          '피아노 연주가 아름다워요. - The piano performance is beautiful.',
          "I've been learning piano since I was young—it was hard at first, but now it's become my biggest hobby.",
          'The gentle piano music playing in the café put my mind at ease.',
        ],
      },
    },
  },
  {
    id: 'gita',
    korean: '기타',
    romanization: 'gita',
    partOfSpeech: 'noun',
    categoryId: 'music',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['instrument', 'music'],
    translations: {
      ko: {
        word: '기타',
        explanation: '현악기의 일종. 어쿠스틱 기타와 일렉트릭 기타가 있다.',
        examples: [
          '기타 칠 줄 알아요?',
          '기타 소리가 좋아요.',
          '대학교 때 동아리에서 기타를 배웠는데, 친구들 앞에서 처음 연주했을 때 떨렸지만 뿌듯했다.',
          '캠핑장에서 모닥불 앞에 앉아 기타를 치며 노래를 부르는 것이 최고의 힐링이다.',
        ],
      },
      en: {
        word: 'Guitar',
        explanation: 'A string instrument. Includes acoustic and electric guitars.',
        examples: [
          '기타 칠 줄 알아요? - Can you play the guitar?',
          '기타 소리가 좋아요. - The guitar sound is nice.',
          'I learned guitar in a university club, and even though I was nervous performing in front of friends for the first time, I felt proud.',
          'Sitting by the campfire and playing guitar while singing is the best way to relax.',
        ],
      },
    },
  },
  {
    id: 'norae',
    korean: '노래',
    romanization: 'norae',
    partOfSpeech: 'noun',
    categoryId: 'music',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['music', 'singing'],
    translations: {
      ko: {
        word: '노래',
        explanation:
          "음악에 맞춰 부르는 가사가 있는 음악. '노래하다'는 노래를 부르는 것을 의미한다.",
        examples: [
          '이 노래 좋아해요.',
          '노래방 갈까요?',
          '라디오에서 우연히 들은 노래가 너무 좋아서 가수 이름을 검색해 앨범을 전부 들었다.',
          '힘든 하루를 보내고 집에 와서 좋아하는 노래를 크게 틀어놓으면 스트레스가 풀린다.',
        ],
      },
      en: {
        word: 'Song',
        explanation: "Music with lyrics sung to a melody. '노래하다' means to sing.",
        examples: [
          '이 노래 좋아해요. - I like this song.',
          '노래방 갈까요? - Shall we go to karaoke?',
          'I randomly heard a song on the radio that I loved so much, I searched for the artist and listened to all their albums.',
          'After a hard day, coming home and blasting my favorite songs helps relieve stress.',
        ],
      },
    },
  },
  {
    id: 'drum',
    korean: '드럼',
    romanization: 'deureom',
    partOfSpeech: 'noun',
    categoryId: 'music',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['instrument', 'music'],
    translations: {
      ko: {
        word: '드럼',
        explanation: '타악기의 일종. 리듬을 담당하는 핵심 악기.',
        examples: [
          '드럼 치는 것이 멋있어요.',
          '밴드에서 드럼을 쳐요.',
          '옆집에서 드럼을 배우기 시작했는데, 처음에는 시끄러웠지만 점점 실력이 늘어서 이제는 듣기 좋다.',
          '고등학교 때 밴드부에서 드럼을 맡았는데, 축제 때 무대에 서서 연주한 기억이 아직도 생생하다.',
        ],
      },
      en: {
        word: 'Drums',
        explanation: 'A percussion instrument. A core instrument for rhythm in bands.',
        examples: [
          '드럼 치는 것이 멋있어요. - Playing drums is cool.',
          '밴드에서 드럼을 쳐요. - I play drums in a band.',
          'My neighbor started learning drums, and although it was noisy at first, their skills have improved so much that it sounds great now.',
          'I played drums in the school band during high school, and I still vividly remember performing on stage at the festival.',
        ],
      },
    },
  },
  {
    id: 'violin',
    korean: '바이올린',
    romanization: 'baiollin',
    partOfSpeech: 'noun',
    categoryId: 'music',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['instrument', 'music', 'classical'],
    translations: {
      ko: {
        word: '바이올린',
        explanation: '현악기 중 하나. 오케스트라에서 중요한 역할을 하는 악기.',
        examples: [
          '바이올린 소리가 슬퍼요.',
          '바이올린 협주곡을 들었어요.',
          '어릴 때 부모님이 바이올린 학원에 보내셨는데, 지금 생각하면 그때 배운 것이 평생의 취미가 되었다.',
          '결혼식장에서 바이올린 연주가 흘러나오자 신부가 입장했고, 모든 하객들의 눈에 눈물이 고였다.',
        ],
      },
      en: {
        word: 'Violin',
        explanation: 'A string instrument. Plays an important role in orchestras.',
        examples: [
          '바이올린 소리가 슬퍼요. - The violin sounds sad.',
          '바이올린 협주곡을 들었어요. - I listened to a violin concerto.',
          'My parents sent me to violin lessons when I was young, and looking back now, what I learned then has become a lifelong hobby.',
          "When the violin music started playing at the wedding, the bride walked in, and tears welled up in every guest's eyes.",
        ],
      },
    },
  },
  {
    id: 'umak',
    korean: '음악',
    romanization: 'eumak',
    partOfSpeech: 'noun',
    categoryId: 'music',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['music', 'general'],
    translations: {
      ko: {
        word: '음악',
        explanation: '소리로 표현하는 예술. 클래식, 팝, 재즈 등 다양한 장르가 있다.',
        examples: [
          '음악 듣는 것을 좋아해요.',
          '어떤 음악 좋아해요?',
          '출퇴근 시간에 지하철에서 음악을 들으면 복잡한 인파 속에서도 나만의 공간이 생긴 것 같은 기분이 든다.',
          '요즘 젊은 세대는 음악을 스트리밍으로 듣지만, 나는 여전히 LP판으로 듣는 아날로그 감성을 좋아한다.',
        ],
      },
      en: {
        word: 'Music',
        explanation:
          'Art expressed through sound. Includes various genres like classical, pop, jazz, etc.',
        examples: [
          '음악 듣는 것을 좋아해요. - I like listening to music.',
          '어떤 음악 좋아해요? - What kind of music do you like?',
          'When I listen to music on the subway during my commute, it feels like I have my own personal space even in the crowded rush.',
          'Young people nowadays stream music, but I still prefer the analog feeling of listening to LP records.',
        ],
      },
    },
  },
  {
    id: 'gasu',
    korean: '가수',
    romanization: 'gasu',
    partOfSpeech: 'noun',
    categoryId: 'music',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['music', 'person'],
    translations: {
      ko: {
        word: '가수',
        explanation: '노래를 직업으로 부르는 사람. K-pop 가수들이 세계적으로 유명하다.',
        examples: [
          '좋아하는 가수가 누구예요?',
          '그 가수 콘서트에 갔어요.',
          '어릴 때 TV에서 좋아하는 가수가 나오면 모든 것을 멈추고 화면 앞에 앉아 노래를 따라 불렀다.',
          '요즘 K-pop 가수들은 노래뿐만 아니라 춤, 패션, 예능까지 다재다능해야 살아남을 수 있다.',
        ],
      },
      en: {
        word: 'Singer',
        explanation: 'A person who sings professionally. K-pop singers are famous worldwide.',
        examples: [
          '좋아하는 가수가 누구예요? - Who is your favorite singer?',
          "그 가수 콘서트에 갔어요. - I went to that singer's concert.",
          'When I was young, whenever my favorite singer appeared on TV, I would stop everything and sit in front of the screen singing along.',
          'These days, K-pop singers need to be multi-talented in not just singing, but also dancing, fashion, and variety shows to survive.',
        ],
      },
    },
  },
  {
    id: 'konseuteu',
    korean: '콘서트',
    romanization: 'konseoteu',
    partOfSpeech: 'noun',
    categoryId: 'music',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['music', 'event'],
    translations: {
      ko: {
        word: '콘서트',
        explanation: '음악 공연. 가수나 밴드가 관객 앞에서 라이브로 공연하는 것.',
        examples: [
          '콘서트 표를 샀어요.',
          '콘서트가 너무 좋았어요.',
          '콘서트 티켓팅 경쟁이 너무 치열해서 새벽부터 대기했는데도 겨우 맨 뒷자리를 구했다.',
          '첫 콘서트에서 좋아하는 가수를 직접 보는 순간, 눈물이 나올 정도로 감동받았다.',
        ],
      },
      en: {
        word: 'Concert',
        explanation:
          'A music performance. Singers or bands performing live in front of an audience.',
        examples: [
          '콘서트 표를 샀어요. - I bought concert tickets.',
          '콘서트가 너무 좋았어요. - The concert was so good.',
          'The competition for concert tickets was so fierce that even though I waited from early morning, I barely managed to get a seat in the back row.',
          'The moment I saw my favorite singer in person at my first concert, I was so moved that tears came to my eyes.',
        ],
      },
    },
  },
  {
    id: 'akgi',
    korean: '악기',
    romanization: 'akgi',
    partOfSpeech: 'noun',
    categoryId: 'music',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['music', 'instrument'],
    translations: {
      ko: {
        word: '악기',
        explanation: '음악을 연주하는 도구. 현악기, 관악기, 타악기 등이 있다.',
        examples: [
          '어떤 악기를 연주해요?',
          '새 악기를 배우고 싶어요.',
          '한 가지 악기라도 제대로 배워두면 평생 어디서든 특기로 자랑할 수 있다고 부모님이 말씀하셨다.',
          '악기 상점에 들어가면 벽면 가득 걸린 기타들과 빛나는 피아노들을 구경하는 것만으로도 행복하다.',
        ],
      },
      en: {
        word: 'Musical instrument',
        explanation:
          'A tool for playing music. Includes strings, wind, and percussion instruments.',
        examples: [
          '어떤 악기를 연주해요? - What instrument do you play?',
          '새 악기를 배우고 싶어요. - I want to learn a new instrument.',
          'My parents told me that if I learn even one instrument properly, I can show it off as a special skill anywhere for the rest of my life.',
          'When I enter a music store, just looking at the guitars covering the walls and the shiny pianos makes me happy.',
        ],
      },
    },
  },
  {
    id: 'rhythm',
    korean: '리듬',
    romanization: 'rideum',
    partOfSpeech: 'noun',
    categoryId: 'music',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['music', 'element'],
    translations: {
      ko: {
        word: '리듬',
        explanation: '음악의 박자와 패턴. 음악의 기본 요소 중 하나.',
        examples: [
          '리듬에 맞춰 춤을 춰요.',
          '이 노래는 리듬이 좋아요.',
          '처음 춤을 배울 때 가장 어려운 것은 리듬을 타는 것인데, 몸이 음악에 자연스럽게 반응하기까지 시간이 걸린다.',
          '아프리카 음악의 리듬은 복잡하면서도 중독성이 있어서 한 번 들으면 머릿속에서 계속 맴돈다.',
        ],
      },
      en: {
        word: 'Rhythm',
        explanation: 'The beat and pattern in music. One of the basic elements of music.',
        examples: [
          '리듬에 맞춰 춤을 춰요. - I dance to the rhythm.',
          '이 노래는 리듬이 좋아요. - This song has a good rhythm.',
          'The hardest thing when first learning to dance is finding the rhythm—it takes time for your body to naturally respond to the music.',
          'The rhythms in African music are complex yet addictive—once you hear them, they keep playing in your head.',
        ],
      },
    },
  },

  // Art
  {
    id: 'geurim',
    korean: '그림',
    romanization: 'geurim',
    partOfSpeech: 'noun',
    categoryId: 'art',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['art', 'painting'],
    translations: {
      ko: {
        word: '그림',
        explanation: '종이나 캔버스에 그린 이미지. 회화, 스케치, 일러스트 등을 포함한다.',
        examples: [
          '그림을 그리는 것을 좋아해요.',
          '이 그림 누가 그렸어요?',
          '어릴 때는 그림 그리기가 서툴렀는데, 매일 조금씩 연습하다 보니 이제는 친구들에게 그림을 선물로 그려줄 수 있게 되었다.',
          '미술관에서 본 그림 중에서 특히 인상파 화가들의 작품이 빛과 색채를 표현하는 방식이 인상 깊었다.',
        ],
      },
      en: {
        word: 'Picture / Painting',
        explanation:
          'An image drawn on paper or canvas. Includes paintings, sketches, illustrations.',
        examples: [
          '그림을 그리는 것을 좋아해요. - I like drawing pictures.',
          '이 그림 누가 그렸어요? - Who drew this picture?',
          'I used to be bad at drawing when I was young, but after practicing a little every day, I can now draw pictures as gifts for my friends.',
          'Among the paintings I saw at the art museum, the way Impressionist artists expressed light and color was particularly impressive.',
        ],
      },
    },
  },
  {
    id: 'jogak',
    korean: '조각',
    romanization: 'jogak',
    partOfSpeech: 'noun',
    categoryId: 'art',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['art', 'sculpture'],
    translations: {
      ko: {
        word: '조각',
        explanation: '입체적인 예술 작품. 돌, 나무, 금속 등으로 만든다.',
        examples: [
          '박물관에서 조각을 봤어요.',
          '이 조각은 유명해요.',
          '로댕의 생각하는 사람 조각상 앞에 서니 수백 년 전 예술가의 손길이 느껴지는 것 같았다.',
          '현대 미술관에는 전통적인 조각뿐만 아니라 금속과 유리로 만든 설치 조각 작품도 많았다.',
        ],
      },
      en: {
        word: 'Sculpture',
        explanation: 'A three-dimensional artwork. Made from stone, wood, metal, etc.',
        examples: [
          '박물관에서 조각을 봤어요. - I saw sculptures at the museum.',
          '이 조각은 유명해요. - This sculpture is famous.',
          "Standing in front of Rodin's The Thinker, I felt like I could sense the artist's touch from hundreds of years ago.",
          'The modern art museum had not only traditional sculptures but also installation pieces made of metal and glass.',
        ],
      },
    },
  },
  {
    id: 'sajin',
    korean: '사진',
    romanization: 'sajin',
    partOfSpeech: 'noun',
    categoryId: 'art',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['art', 'photography'],
    translations: {
      ko: {
        word: '사진',
        explanation: '카메라로 찍은 이미지. 현대에서는 스마트폰으로도 많이 찍는다.',
        examples: [
          '사진 찍어도 돼요?',
          '사진이 잘 나왔어요.',
          '여행 갈 때마다 사진을 많이 찍어두는데, 나중에 앨범을 보면 그때의 추억이 생생하게 떠오른다.',
          '요즘은 스마트폰 카메라 성능이 좋아져서 전문 카메라 없이도 멋진 사진을 찍을 수 있다.',
        ],
      },
      en: {
        word: 'Photo / Photograph',
        explanation: 'An image taken with a camera. Nowadays often taken with smartphones.',
        examples: [
          '사진 찍어도 돼요? - May I take a photo?',
          '사진이 잘 나왔어요. - The photo came out well.',
          'I take lots of photos whenever I travel, and when I look at the album later, the memories come back vividly.',
          'Smartphone cameras have become so good these days that you can take great photos without a professional camera.',
        ],
      },
    },
  },
  {
    id: 'misul',
    korean: '미술',
    romanization: 'misul',
    partOfSpeech: 'noun',
    categoryId: 'art',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['art', 'general'],
    translations: {
      ko: {
        word: '미술',
        explanation: '시각적 예술. 회화, 조각, 디자인 등을 포함하는 광범위한 분야.',
        examples: [
          '미술관에 가고 싶어요.',
          '미술 수업이 재미있어요.',
          '초등학교 때 미술 시간이 제일 좋았는데, 자유롭게 상상하고 표현할 수 있어서 행복했다.',
          '서양 미술사를 공부하다 보면 르네상스부터 현대 미술까지 시대마다 다른 미의 기준이 있다는 것을 알 수 있다.',
        ],
      },
      en: {
        word: 'Art / Fine arts',
        explanation: 'Visual arts. A broad field including painting, sculpture, design, etc.',
        examples: [
          '미술관에 가고 싶어요. - I want to go to an art museum.',
          '미술 수업이 재미있어요. - Art class is fun.',
          'Art class was my favorite in elementary school because I was happy to freely imagine and express myself.',
          'Studying Western art history, you realize that from the Renaissance to modern art, each era has different standards of beauty.',
        ],
      },
    },
  },
  {
    id: 'jakpum',
    korean: '작품',
    romanization: 'jakpum',
    partOfSpeech: 'noun',
    categoryId: 'art',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['art', 'work'],
    translations: {
      ko: {
        word: '작품',
        explanation: '예술가가 만든 창작물. 그림, 조각, 영화, 소설 등을 말한다.',
        examples: [
          '이 작품이 마음에 들어요.',
          '유명한 작품을 많이 봤어요.',
          '예술가의 작품을 이해하려면 그 사람이 살았던 시대와 배경을 알아야 더 깊이 감상할 수 있다.',
          '이번 전시회에서 신진 작가들의 실험적인 작품들을 보면서 예술의 경계가 점점 넓어지고 있다는 것을 느꼈다.',
        ],
      },
      en: {
        word: 'Artwork / Work',
        explanation:
          'A creation made by an artist. Refers to paintings, sculptures, films, novels, etc.',
        examples: [
          '이 작품이 마음에 들어요. - I like this artwork.',
          '유명한 작품을 많이 봤어요. - I saw many famous works.',
          "To understand an artist's work, you need to know the era and background they lived in to appreciate it more deeply.",
          'Seeing the experimental works of emerging artists at this exhibition, I felt that the boundaries of art are expanding.',
        ],
      },
    },
  },
  {
    id: 'saek',
    korean: '색',
    romanization: 'saek',
    partOfSpeech: 'noun',
    categoryId: 'art',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['art', 'color'],
    translations: {
      ko: {
        word: '색',
        explanation: '빨강, 파랑, 노랑 등의 색깔. 미술에서 가장 기본적인 요소.',
        examples: [
          '무슨 색을 좋아해요?',
          '이 색이 예뻐요.',
          '인테리어를 바꿀 때 벽 색을 어떻게 할지 고민했는데, 결국 따뜻한 느낌의 베이지색을 선택했다.',
          '가을이 되면 나뭇잎의 색이 초록에서 노랑, 빨강으로 변하는 모습이 정말 아름답다.',
        ],
      },
      en: {
        word: 'Color',
        explanation: 'Colors like red, blue, yellow, etc. The most basic element in art.',
        examples: [
          '무슨 색을 좋아해요? - What color do you like?',
          '이 색이 예뻐요. - This color is pretty.',
          'When redecorating, I wondered what wall color to choose, and eventually picked a warm beige.',
          'In autumn, watching the leaves change color from green to yellow and red is truly beautiful.',
        ],
      },
    },
  },
  {
    id: 'dijain',
    korean: '디자인',
    romanization: 'dijain',
    partOfSpeech: 'noun',
    categoryId: 'art',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['art', 'design'],
    translations: {
      ko: {
        word: '디자인',
        explanation:
          '물건이나 공간의 외관과 기능을 계획하는 것. 그래픽, 제품, 인테리어 디자인 등이 있다.',
        examples: [
          '디자인이 멋있어요.',
          '디자인을 공부해요.',
          '좋은 디자인은 예쁘기만 한 것이 아니라 사용자가 편리하게 쓸 수 있도록 기능성도 고려해야 한다.',
          '새로 산 휴대폰의 디자인이 너무 마음에 들어서 케이스 없이 그대로 쓰고 싶을 정도다.',
        ],
      },
      en: {
        word: 'Design',
        explanation:
          'Planning the appearance and function of objects or spaces. Includes graphic, product, interior design.',
        examples: [
          '디자인이 멋있어요. - The design is cool.',
          '디자인을 공부해요. - I study design.',
          'Good design is not just about being pretty—it must also consider functionality so users can use it conveniently.',
          'I love the design of my new phone so much that I want to use it without a case.',
        ],
      },
    },
  },
  {
    id: 'jeonsi',
    korean: '전시',
    romanization: 'jeonsi',
    partOfSpeech: 'noun',
    categoryId: 'art',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['art', 'exhibition'],
    translations: {
      ko: {
        word: '전시',
        explanation: '작품을 공개적으로 보여주는 행사. 미술관이나 갤러리에서 열린다.',
        examples: [
          '전시회에 갔어요.',
          '새 전시가 시작됐어요.',
          '주말마다 새로운 전시를 찾아다니는 것이 취미인데, 다양한 작가들의 세계관을 접하는 것이 즐겁다.',
          '이번 전시는 관람객이 직접 참여할 수 있는 인터랙티브 전시라서 아이들에게도 인기가 많았다.',
        ],
      },
      en: {
        word: 'Exhibition',
        explanation: 'An event displaying artworks publicly. Held at museums or galleries.',
        examples: [
          '전시회에 갔어요. - I went to an exhibition.',
          '새 전시가 시작됐어요. - A new exhibition has started.',
          "My hobby is visiting new exhibitions every weekend—I enjoy experiencing different artists' perspectives.",
          'This exhibition was an interactive one where visitors could participate directly, making it popular with children too.',
        ],
      },
    },
  },
  {
    id: 'hwaga',
    korean: '화가',
    romanization: 'hwaga',
    partOfSpeech: 'noun',
    categoryId: 'art',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['art', 'person'],
    translations: {
      ko: {
        word: '화가',
        explanation: '그림을 그리는 것을 직업으로 하는 예술가.',
        examples: [
          '유명한 화가의 그림이에요.',
          '화가가 되고 싶어요.',
          '빈센트 반 고흐는 생전에 그림이 거의 팔리지 않았지만, 지금은 세계에서 가장 사랑받는 화가 중 한 명이 되었다.',
          '화가의 삶은 낭만적으로 보이지만 실제로는 경제적인 어려움과 싸우면서 창작을 이어가는 경우가 많다.',
        ],
      },
      en: {
        word: 'Painter / Artist',
        explanation: 'An artist who paints professionally.',
        examples: [
          "유명한 화가의 그림이에요. - It's a painting by a famous artist.",
          '화가가 되고 싶어요. - I want to become a painter.',
          "Vincent van Gogh barely sold any paintings during his lifetime, but now he's one of the most beloved artists in the world.",
          "A painter's life may look romantic, but in reality, many continue creating while struggling with financial difficulties.",
        ],
      },
    },
  },
  {
    id: 'changui',
    korean: '창의',
    romanization: 'changui',
    partOfSpeech: 'noun',
    categoryId: 'art',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['art', 'creativity'],
    translations: {
      ko: {
        word: '창의',
        explanation: '새롭고 독창적인 아이디어를 만들어내는 능력. 예술에서 매우 중요한 요소.',
        examples: [
          '창의력이 필요해요.',
          '창의적인 생각이에요.',
          '창의력은 타고나는 것보다 다양한 경험을 하고 여러 분야에 관심을 가질 때 더 잘 발휘된다고 한다.',
          '회사에서 새로운 프로젝트를 시작할 때 창의적인 아이디어가 필요해서 브레인스토밍 회의를 자주 한다.',
        ],
      },
      en: {
        word: 'Creativity',
        explanation:
          'The ability to create new and original ideas. A very important element in art.',
        examples: [
          '창의력이 필요해요. - We need creativity.',
          "창의적인 생각이에요. - That's a creative idea.",
          'They say creativity is better developed through diverse experiences and interest in various fields rather than being born with it.',
          'When starting new projects at work, we often hold brainstorming meetings because creative ideas are needed.',
        ],
      },
    },
  },

  // Sports
  {
    id: 'chukgu',
    korean: '축구',
    romanization: 'chukgu',
    partOfSpeech: 'noun',
    categoryId: 'sports',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['sports', 'ball game'],
    translations: {
      ko: {
        word: '축구',
        explanation: '발로 공을 차는 스포츠. 세계에서 가장 인기 있는 스포츠 중 하나.',
        examples: [
          '축구 경기 봤어요?',
          '축구하러 가자!',
          '월드컵 시즌이 되면 온 국민이 새벽까지 축구 경기를 시청하면서 응원하는 모습을 볼 수 있다.',
          '어릴 때부터 축구를 좋아해서 학교 대표 선수로 뛰었는데, 지금도 주말마다 동호회에서 축구를 한다.',
        ],
      },
      en: {
        word: 'Soccer / Football',
        explanation: 'A sport where you kick a ball. One of the most popular sports in the world.',
        examples: [
          '축구 경기 봤어요? - Did you watch the soccer game?',
          "축구하러 가자! - Let's go play soccer!",
          'During World Cup season, you can see the entire nation watching and cheering for soccer matches until dawn.',
          "I've loved soccer since I was young and played as a school representative, and I still play with a club every weekend.",
        ],
      },
    },
  },
  {
    id: 'yagu',
    korean: '야구',
    romanization: 'yagu',
    partOfSpeech: 'noun',
    categoryId: 'sports',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['sports', 'ball game'],
    translations: {
      ko: {
        word: '야구',
        explanation: '배트로 공을 치는 스포츠. 한국에서 매우 인기 있는 스포츠.',
        examples: [
          '야구장에 가요.',
          '야구 선수가 되고 싶어요.',
          '한국에서는 프로야구 시즌이 되면 경기장마다 응원가를 부르며 열정적으로 응원하는 팬들로 가득 찬다.',
          '아버지와 함께 야구장에서 치킨을 먹으며 경기를 보는 것이 어린 시절 가장 행복한 추억 중 하나다.',
        ],
      },
      en: {
        word: 'Baseball',
        explanation: 'A sport where you hit a ball with a bat. Very popular in Korea.',
        examples: [
          "야구장에 가요. - Let's go to the baseball stadium.",
          '야구 선수가 되고 싶어요. - I want to become a baseball player.',
          'In Korea, when the pro baseball season starts, stadiums are filled with passionate fans singing cheering songs.',
          'Watching games at the baseball stadium with my dad while eating chicken is one of my happiest childhood memories.',
        ],
      },
    },
  },
  {
    id: 'nonggu',
    korean: '농구',
    romanization: 'nonggu',
    partOfSpeech: 'noun',
    categoryId: 'sports',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['sports', 'ball game'],
    translations: {
      ko: {
        word: '농구',
        explanation: '공을 골대에 넣는 스포츠. 실내에서도 할 수 있다.',
        examples: [
          '농구 잘해요?',
          '농구 경기를 봤어요.',
          '키가 크지 않아도 드리블과 슛 기술을 열심히 연습하면 농구를 잘할 수 있다는 것을 친구가 보여줬다.',
          'NBA 경기를 보면서 선수들의 엄청난 점프력과 덩크슛에 매번 감탄하게 된다.',
        ],
      },
      en: {
        word: 'Basketball',
        explanation: 'A sport where you shoot a ball into a hoop. Can be played indoors.',
        examples: [
          '농구 잘해요? - Are you good at basketball?',
          '농구 경기를 봤어요. - I watched a basketball game.',
          "My friend showed me that even if you're not tall, you can be good at basketball if you practice dribbling and shooting hard.",
          "Watching NBA games, I'm always amazed by the players' incredible jumping ability and dunks.",
        ],
      },
    },
  },
  {
    id: 'suyeong',
    korean: '수영',
    romanization: 'suyeong',
    partOfSpeech: 'noun',
    categoryId: 'sports',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['sports', 'water'],
    translations: {
      ko: {
        word: '수영',
        explanation: '물에서 헤엄치는 운동. 전신 운동으로 건강에 좋다.',
        examples: [
          '수영 배우고 싶어요.',
          '수영장에 갈까요?',
          '여름휴가 때 바다에서 수영을 하다가 파도에 휩쓸릴 뻔해서 구명조끼의 중요성을 깨달았다.',
          '무릎이 안 좋아서 달리기는 못 하지만, 수영은 관절에 무리가 안 가서 꾸준히 하고 있다.',
        ],
      },
      en: {
        word: 'Swimming',
        explanation: 'Exercise of moving through water. Good for health as a full-body workout.',
        examples: [
          '수영 배우고 싶어요. - I want to learn swimming.',
          '수영장에 갈까요? - Shall we go to the pool?',
          'I almost got swept away by waves while swimming in the ocean during summer vacation, which made me realize the importance of life jackets.',
          "I can't run because of my bad knees, but I swim regularly since it doesn't strain the joints.",
        ],
      },
    },
  },
  {
    id: 'daligi',
    korean: '달리기',
    romanization: 'dalligi',
    partOfSpeech: 'noun',
    categoryId: 'sports',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['sports', 'running'],
    translations: {
      ko: {
        word: '달리기',
        explanation: '빠르게 뛰는 운동. 마라톤, 조깅, 단거리 달리기 등이 있다.',
        examples: [
          '아침에 달리기를 해요.',
          '달리기가 건강에 좋아요.',
          '처음 마라톤에 도전했을 때 완주하기까지 6시간이 걸렸지만, 결승선을 통과하는 순간의 성취감은 잊을 수가 없다.',
          '매일 아침 한 시간씩 달리기를 하면서 체력이 좋아지고 스트레스도 해소되는 것을 느낀다.',
        ],
      },
      en: {
        word: 'Running',
        explanation: 'Exercise of moving fast on foot. Includes marathon, jogging, sprinting.',
        examples: [
          '아침에 달리기를 해요. - I run in the morning.',
          '달리기가 건강에 좋아요. - Running is good for health.',
          'When I first attempted a marathon, it took me 6 hours to finish, but the sense of achievement when crossing the finish line is unforgettable.',
          'Running for an hour every morning, I feel my stamina improving and my stress melting away.',
        ],
      },
    },
  },
  {
    id: 'undong',
    korean: '운동',
    romanization: 'undong',
    partOfSpeech: 'noun',
    categoryId: 'sports',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['sports', 'exercise'],
    translations: {
      ko: {
        word: '운동',
        explanation: '몸을 움직이는 신체 활동. 건강을 위해 필수적이다.',
        examples: [
          '운동을 자주 해요?',
          '운동하러 헬스장에 가요.',
          '바쁜 직장 생활 때문에 운동할 시간이 없었는데, 건강이 나빠진 후에야 운동의 중요성을 깨달았다.',
          '요즘은 집에서도 유튜브 영상을 보면서 홈트레이닝으로 운동하는 사람들이 많아졌다.',
        ],
      },
      en: {
        word: 'Exercise / Sports',
        explanation: 'Physical activity involving body movement. Essential for health.',
        examples: [
          '운동을 자주 해요? - Do you exercise often?',
          '운동하러 헬스장에 가요. - I go to the gym to exercise.',
          "I didn't have time to exercise because of my busy work life, but only after my health deteriorated did I realize the importance of exercise.",
          'These days, more and more people are working out at home by watching YouTube videos for home training.',
        ],
      },
    },
  },
  {
    id: 'gyeonggi',
    korean: '경기',
    romanization: 'gyeonggi',
    partOfSpeech: 'noun',
    categoryId: 'sports',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['sports', 'game'],
    translations: {
      ko: {
        word: '경기',
        explanation: '스포츠에서 승부를 겨루는 것. 시합, 게임을 의미한다.',
        examples: [
          '오늘 경기 몇 시에요?',
          '경기에서 이겼어요!',
          '결승전 경기가 연장전까지 가서 손에 땀을 쥐며 끝까지 지켜봤다.',
          '비가 많이 와서 오늘 예정되었던 야외 경기가 다음 주로 연기되었다.',
        ],
      },
      en: {
        word: 'Game / Match',
        explanation: 'A competition in sports. Refers to a match or game.',
        examples: [
          "오늘 경기 몇 시에요? - What time is today's game?",
          '경기에서 이겼어요! - We won the game!',
          'The final match went into overtime, so I watched until the end with my palms sweating.',
          "Today's outdoor game was postponed to next week because of heavy rain.",
        ],
      },
    },
  },
  {
    id: 'seonsu',
    korean: '선수',
    romanization: 'seonsu',
    partOfSpeech: 'noun',
    categoryId: 'sports',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['sports', 'person'],
    translations: {
      ko: {
        word: '선수',
        explanation: '스포츠를 직업으로 하는 사람. 프로 또는 아마추어 선수.',
        examples: [
          '좋아하는 선수가 있어요?',
          '그 선수 정말 잘해요.',
          '어릴 때 좋아했던 선수의 유니폼을 입고 경기장에 갔던 기억이 지금도 생생하다.',
          '프로 선수가 되기 위해서는 타고난 재능뿐만 아니라 매일 몇 시간씩 훈련하는 노력이 필요하다.',
        ],
      },
      en: {
        word: 'Player / Athlete',
        explanation: 'A person who plays sports professionally. Professional or amateur athlete.',
        examples: [
          '좋아하는 선수가 있어요? - Do you have a favorite player?',
          '그 선수 정말 잘해요. - That player is really good.',
          "I still vividly remember going to the stadium wearing my favorite player's jersey when I was young.",
          'To become a professional athlete, you need not only natural talent but also the effort to train for hours every day.',
        ],
      },
    },
  },
  {
    id: 'tim',
    korean: '팀',
    romanization: 'tim',
    partOfSpeech: 'noun',
    categoryId: 'sports',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['sports', 'team'],
    translations: {
      ko: {
        word: '팀',
        explanation: '함께 경기하는 선수들의 그룹. 스포츠에서 협동이 중요하다.',
        examples: [
          '어느 팀을 응원해요?',
          '우리 팀이 이겼어요!',
          '아무리 뛰어난 선수가 있어도 팀워크가 안 되면 경기에서 이기기 어렵다는 것을 많은 경기를 보며 깨달았다.',
          '회사에서도 마찬가지로 개인의 능력보다 팀 전체가 협력하는 것이 더 좋은 결과를 만들어낸다.',
        ],
      },
      en: {
        word: 'Team',
        explanation: 'A group of players competing together. Teamwork is important in sports.',
        examples: [
          '어느 팀을 응원해요? - Which team do you support?',
          '우리 팀이 이겼어요! - Our team won!',
          "Watching many games, I realized that even with outstanding individual players, it's hard to win without teamwork.",
          'The same applies at work—the whole team cooperating produces better results than individual ability alone.',
        ],
      },
    },
  },
  {
    id: 'ollimpik',
    korean: '올림픽',
    romanization: 'ollimpik',
    partOfSpeech: 'noun',
    categoryId: 'sports',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['sports', 'event'],
    translations: {
      ko: {
        word: '올림픽',
        explanation: '4년마다 열리는 세계 최대의 스포츠 대회. 하계와 동계 올림픽이 있다.',
        examples: [
          '올림픽 보고 있어요?',
          '한국이 올림픽에서 금메달을 땄어요.',
          '올림픽 개막식을 보면 전 세계 선수들이 한자리에 모여 입장하는 모습이 정말 감동적이다.',
          '우리나라 선수가 올림픽에서 메달을 딸 때마다 온 국민이 함께 기뻐하고 축하하는 모습을 볼 수 있다.',
        ],
      },
      en: {
        word: 'Olympics',
        explanation:
          "The world's largest sports event held every four years. Summer and Winter Olympics.",
        examples: [
          '올림픽 보고 있어요? - Are you watching the Olympics?',
          '한국이 올림픽에서 금메달을 땄어요. - Korea won a gold medal at the Olympics.',
          "Watching the Olympics opening ceremony, it's truly moving to see athletes from all over the world gathering and marching in together.",
          'Every time our national athletes win medals at the Olympics, you can see the entire nation rejoicing and celebrating together.',
        ],
      },
    },
  },

  // Space
  {
    id: 'byeol',
    korean: '별',
    romanization: 'byeol',
    partOfSpeech: 'noun',
    categoryId: 'space',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['space', 'astronomy'],
    translations: {
      ko: {
        word: '별',
        explanation: '밤하늘에서 빛나는 천체. 태양도 별의 일종이다.',
        examples: [
          '별이 예뻐요.',
          '별을 보러 갈까요?',
          '도시에서는 밤에도 불빛이 밝아서 별을 보기 어렵지만, 시골에 가면 쏟아질 것 같은 별들을 볼 수 있다.',
          '과학 시간에 우리가 밤하늘에서 보는 별빛이 사실 수천 년 전에 출발한 것이라는 걸 배우고 놀랐다.',
        ],
      },
      en: {
        word: 'Star',
        explanation:
          'A celestial body that shines in the night sky. The sun is also a type of star.',
        examples: [
          '별이 예뻐요. - The stars are beautiful.',
          '별을 보러 갈까요? - Shall we go see the stars?',
          "It's hard to see stars in the city because of the bright lights at night, but in the countryside, you can see stars that seem to pour down.",
          'In science class, I was amazed to learn that the starlight we see actually left the stars thousands of years ago.',
        ],
      },
    },
  },
  {
    id: 'dal',
    korean: '달',
    romanization: 'dal',
    partOfSpeech: 'noun',
    categoryId: 'space',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['space', 'astronomy'],
    translations: {
      ko: {
        word: '달',
        explanation: '지구의 자연 위성. 밤에 밝게 빛난다.',
        examples: [
          '오늘 달이 밝아요.',
          '보름달이 떴어요.',
          '한국에서는 추석에 보름달을 보며 소원을 빌고 가족과 함께 송편을 먹는 전통이 있다.',
          '달이 차고 기우는 주기가 한 달 정도인데, 그래서 한 달을 뜻하는 영어 단어 "month"가 "moon"에서 왔다.',
        ],
      },
      en: {
        word: 'Moon',
        explanation: "Earth's natural satellite. Shines brightly at night.",
        examples: [
          '오늘 달이 밝아요. - The moon is bright tonight.',
          '보름달이 떴어요. - The full moon is out.',
          'In Korea, there is a tradition of making wishes while looking at the full moon during Chuseok and eating songpyeon with family.',
          'The moon\'s cycle of waxing and waning takes about a month, which is why the English word "month" comes from "moon".',
        ],
      },
    },
  },
  {
    id: 'taeyang',
    korean: '태양',
    romanization: 'taeyang',
    partOfSpeech: 'noun',
    categoryId: 'space',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['space', 'astronomy'],
    translations: {
      ko: {
        word: '태양',
        explanation: '태양계의 중심에 있는 항성. 지구에 빛과 열을 제공한다.',
        examples: [
          '태양이 뜨거워요.',
          '태양 주위를 지구가 돌아요.',
          '태양이 없다면 지구에 생명체가 존재할 수 없었을 것이라고 생각하면 태양의 소중함을 느끼게 된다.',
          '요즘 환경 문제 때문에 태양 에너지를 활용한 친환경 발전에 대한 관심이 높아지고 있다.',
        ],
      },
      en: {
        word: 'Sun',
        explanation:
          'The star at the center of the solar system. Provides light and heat to Earth.',
        examples: [
          '태양이 뜨거워요. - The sun is hot.',
          '태양 주위를 지구가 돌아요. - Earth orbits around the sun.',
          "Thinking that life on Earth wouldn't exist without the sun makes you appreciate how precious it is.",
          'Due to environmental concerns these days, interest in eco-friendly power generation using solar energy is growing.',
        ],
      },
    },
  },
  {
    id: 'haengseong',
    korean: '행성',
    romanization: 'haengseong',
    partOfSpeech: 'noun',
    categoryId: 'space',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['space', 'astronomy'],
    translations: {
      ko: {
        word: '행성',
        explanation: '항성 주위를 도는 천체. 태양계에는 8개의 행성이 있다.',
        examples: [
          '지구는 행성이에요.',
          '다른 행성에 생명체가 있을까요?',
          '어릴 때 명왕성이 행성에서 제외되었다는 뉴스를 듣고 충격을 받았던 기억이 있다.',
          '과학자들은 태양계 밖의 외계 행성에서 생명체가 살 수 있는 환경을 찾기 위해 연구를 계속하고 있다.',
        ],
      },
      en: {
        word: 'Planet',
        explanation: 'A celestial body orbiting a star. There are 8 planets in our solar system.',
        examples: [
          '지구는 행성이에요. - Earth is a planet.',
          '다른 행성에 생명체가 있을까요? - Is there life on other planets?',
          'I remember being shocked when I heard the news that Pluto was removed from the list of planets when I was young.',
          'Scientists continue researching to find habitable environments on exoplanets outside our solar system.',
        ],
      },
    },
  },
  {
    id: 'eunha',
    korean: '은하',
    romanization: 'eunha',
    partOfSpeech: 'noun',
    categoryId: 'space',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['space', 'astronomy'],
    translations: {
      ko: {
        word: '은하',
        explanation: '수많은 별들이 모인 거대한 천체 시스템. 우리 은하는 은하수라고 불린다.',
        examples: [
          '은하수가 보여요.',
          '우주에는 수많은 은하가 있어요.',
          '맑은 밤에 산꼭대기에서 은하수를 처음 봤을 때, 우주의 광활함에 압도되는 느낌이었다.',
          '우리 은하에만 수천억 개의 별이 있고, 우주에는 그런 은하가 수조 개나 있다고 하니 상상이 안 된다.',
        ],
      },
      en: {
        word: 'Galaxy',
        explanation: 'A huge system of countless stars. Our galaxy is called the Milky Way.',
        examples: [
          '은하수가 보여요. - I can see the Milky Way.',
          '우주에는 수많은 은하가 있어요. - There are countless galaxies in the universe.',
          'When I first saw the Milky Way from a mountaintop on a clear night, I felt overwhelmed by the vastness of the universe.',
          "It's hard to imagine that our galaxy alone has hundreds of billions of stars, and there are trillions of such galaxies in the universe.",
        ],
      },
    },
  },
  {
    id: 'uju',
    korean: '우주',
    romanization: 'uju',
    partOfSpeech: 'noun',
    categoryId: 'space',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['space', 'general'],
    translations: {
      ko: {
        word: '우주',
        explanation: '모든 물질과 에너지가 존재하는 무한한 공간. 지구 밖의 모든 것.',
        examples: [
          '우주는 신비로워요.',
          '우주 여행을 하고 싶어요.',
          '우주에 대해 알면 알수록 인간이 얼마나 작은 존재인지 깨닫게 되어 겸손해진다.',
          '민간 우주 여행 시대가 열리면서 일반인도 우주를 경험할 수 있는 날이 머지않았다.',
        ],
      },
      en: {
        word: 'Space / Universe',
        explanation:
          'The infinite space where all matter and energy exists. Everything beyond Earth.',
        examples: [
          '우주는 신비로워요. - Space is mysterious.',
          '우주 여행을 하고 싶어요. - I want to travel to space.',
          'The more I learn about the universe, the more humble I become realizing how small humans are.',
          'With the era of private space travel opening up, the day when ordinary people can experience space is not far off.',
        ],
      },
    },
  },
  {
    id: 'roket',
    korean: '로켓',
    romanization: 'roket',
    partOfSpeech: 'noun',
    categoryId: 'space',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['space', 'technology'],
    translations: {
      ko: {
        word: '로켓',
        explanation: '우주로 발사되는 우주선. 위성이나 우주인을 우주로 보낸다.',
        examples: [
          '로켓이 발사됐어요.',
          '로켓 발사를 봤어요.',
          '한국이 독자 개발한 누리호 로켓이 성공적으로 발사되었을 때 온 국민이 자랑스러워했다.',
          '로켓이 하늘로 솟아오르는 순간의 굉음과 불꽃을 직접 보면 정말 감동적이라고 한다.',
        ],
      },
      en: {
        word: 'Rocket',
        explanation: 'A spacecraft launched into space. Sends satellites and astronauts to space.',
        examples: [
          '로켓이 발사됐어요. - The rocket was launched.',
          '로켓 발사를 봤어요. - I watched the rocket launch.',
          "When Korea's independently developed Nuri rocket was successfully launched, the entire nation was proud.",
          "They say it's truly moving to witness the roar and flames when a rocket soars into the sky in person.",
        ],
      },
    },
  },
  {
    id: 'ujuin',
    korean: '우주인',
    romanization: 'ujuin',
    partOfSpeech: 'noun',
    categoryId: 'space',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['space', 'person'],
    translations: {
      ko: {
        word: '우주인',
        explanation: '우주로 여행하는 사람. 우주 비행사라고도 한다.',
        examples: [
          '우주인이 되고 싶어요.',
          '한국 우주인이 있어요.',
          '우주인이 되려면 수년간의 훈련을 받아야 하고 신체적, 정신적으로 매우 건강해야 한다.',
          '우주인들이 우주 정거장에서 무중력 상태로 떠다니는 영상을 보면 신기하기도 하고 부럽기도 하다.',
        ],
      },
      en: {
        word: 'Astronaut',
        explanation: 'A person who travels to space. Also called a cosmonaut.',
        examples: [
          '우주인이 되고 싶어요. - I want to become an astronaut.',
          '한국 우주인이 있어요. - There is a Korean astronaut.',
          'To become an astronaut, you need years of training and must be physically and mentally very healthy.',
          'Watching videos of astronauts floating in zero gravity on the space station is both fascinating and enviable.',
        ],
      },
    },
  },
  {
    id: 'wiseong',
    korean: '위성',
    romanization: 'wiseong',
    partOfSpeech: 'noun',
    categoryId: 'space',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['space', 'astronomy'],
    translations: {
      ko: {
        word: '위성',
        explanation: '행성 주위를 도는 천체. 인공위성은 사람이 만든 위성이다.',
        examples: [
          '달은 지구의 위성이에요.',
          '인공위성이 지구를 돌아요.',
          '현재 지구 궤도에는 수천 개의 인공위성이 돌고 있어서 우주 쓰레기 문제가 심각해지고 있다.',
          '위성 덕분에 우리는 날씨 예보를 정확하게 받고 전 세계 어디서든 인터넷을 사용할 수 있다.',
        ],
      },
      en: {
        word: 'Satellite',
        explanation: 'A celestial body orbiting a planet. Artificial satellites are man-made.',
        examples: [
          "달은 지구의 위성이에요. - The moon is Earth's satellite.",
          '인공위성이 지구를 돌아요. - Artificial satellites orbit the Earth.',
          'There are thousands of artificial satellites currently orbiting Earth, making space debris a serious problem.',
          'Thanks to satellites, we can get accurate weather forecasts and use the internet anywhere in the world.',
        ],
      },
    },
  },
  {
    id: 'blaekol',
    korean: '블랙홀',
    romanization: 'beullaekol',
    partOfSpeech: 'noun',
    categoryId: 'space',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['space', 'astronomy'],
    translations: {
      ko: {
        word: '블랙홀',
        explanation: '중력이 매우 강해서 빛도 빠져나올 수 없는 천체.',
        examples: [
          '블랙홀은 무서워요.',
          '블랙홀에 대해 배웠어요.',
          '2019년에 과학자들이 처음으로 블랙홀의 실제 이미지를 촬영하는 데 성공해서 전 세계가 놀랐다.',
          '블랙홀 근처에서는 시간이 느리게 흐른다는 상대성 이론의 개념이 영화 인터스텔라에서 잘 표현되었다.',
        ],
      },
      en: {
        word: 'Black hole',
        explanation: 'A celestial object with gravity so strong that even light cannot escape.',
        examples: [
          '블랙홀은 무서워요. - Black holes are scary.',
          '블랙홀에 대해 배웠어요. - I learned about black holes.',
          'In 2019, scientists succeeded in capturing the first actual image of a black hole, which amazed the whole world.',
          'The concept from relativity theory that time passes slower near a black hole was well portrayed in the movie Interstellar.',
        ],
      },
    },
  },

  // Physics
  {
    id: 'jungnyeok',
    korean: '중력',
    romanization: 'jungnyeok',
    partOfSpeech: 'noun',
    categoryId: 'physics',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['physics', 'force'],
    translations: {
      ko: {
        word: '중력',
        explanation: '물체를 지구 중심으로 끌어당기는 힘. 물체가 떨어지는 이유.',
        examples: [
          '중력 때문에 물체가 떨어져요.',
          '달의 중력은 지구보다 약해요.',
          '뉴턴이 나무에서 떨어지는 사과를 보고 중력의 법칙을 발견했다는 이야기는 유명하다.',
          '우주 정거장에서는 중력이 거의 없어서 우주인들이 공중에 떠다니며 생활한다.',
        ],
      },
      en: {
        word: 'Gravity',
        explanation:
          'The force that pulls objects toward the center of the Earth. Why things fall.',
        examples: [
          '중력 때문에 물체가 떨어져요. - Things fall because of gravity.',
          "달의 중력은 지구보다 약해요. - The moon's gravity is weaker than Earth's.",
          'The story of Newton discovering the law of gravity after watching an apple fall from a tree is famous.',
          'In space stations, there is almost no gravity, so astronauts float around in the air.',
        ],
      },
    },
  },
  {
    id: 'eneoji',
    korean: '에너지',
    romanization: 'eneoji',
    partOfSpeech: 'noun',
    categoryId: 'physics',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['physics', 'energy'],
    translations: {
      ko: {
        word: '에너지',
        explanation: '일을 할 수 있는 능력. 운동 에너지, 위치 에너지 등이 있다.',
        examples: [
          '에너지를 절약해요.',
          '태양 에너지를 사용해요.',
          '물리학에서 가장 중요한 법칙 중 하나는 에너지가 창조되거나 소멸되지 않고 형태만 바뀐다는 에너지 보존 법칙이다.',
          '전기 에너지, 화학 에너지, 열 에너지 등 다양한 형태의 에너지가 우리 일상생활에서 사용된다.',
        ],
      },
      en: {
        word: 'Energy',
        explanation: 'The ability to do work. Includes kinetic energy, potential energy, etc.',
        examples: [
          "에너지를 절약해요. - Let's save energy.",
          '태양 에너지를 사용해요. - We use solar energy.',
          'One of the most important laws in physics is the conservation of energy—energy is neither created nor destroyed, only transformed.',
          'Various forms of energy like electrical, chemical, and thermal energy are used in our daily lives.',
        ],
      },
    },
  },
  {
    id: 'wonja',
    korean: '원자',
    romanization: 'wonja',
    partOfSpeech: 'noun',
    categoryId: 'physics',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['physics', 'atom'],
    translations: {
      ko: {
        word: '원자',
        explanation: '물질을 구성하는 가장 작은 단위. 양성자, 중성자, 전자로 구성된다.',
        examples: [
          '모든 물질은 원자로 이루어져 있어요.',
          '원자는 매우 작아요.',
          '원자는 너무 작아서 눈으로 볼 수 없지만, 전자 현미경을 사용하면 그 구조를 관찰할 수 있다.',
          '원자핵이 분열하거나 융합할 때 엄청난 에너지가 나오는데, 이것이 원자력 발전과 핵무기의 원리다.',
        ],
      },
      en: {
        word: 'Atom',
        explanation: 'The smallest unit of matter. Composed of protons, neutrons, and electrons.',
        examples: [
          '모든 물질은 원자로 이루어져 있어요. - All matter is made of atoms.',
          '원자는 매우 작아요. - Atoms are very small.',
          'Atoms are too small to see with the naked eye, but their structure can be observed using electron microscopes.',
          'When atomic nuclei split or fuse, enormous energy is released—this is the principle behind nuclear power and nuclear weapons.',
        ],
      },
    },
  },
  {
    id: 'bit',
    korean: '빛',
    romanization: 'bit',
    partOfSpeech: 'noun',
    categoryId: 'physics',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['physics', 'light'],
    translations: {
      ko: {
        word: '빛',
        explanation: '눈으로 볼 수 있게 해주는 에너지. 가장 빠른 속도로 이동한다.',
        examples: [
          '빛이 밝아요.',
          '빛의 속도는 매우 빨라요.',
          '빛의 속도는 초당 약 30만 킬로미터로, 우주에서 가장 빠른 속도이며 아무것도 이보다 빠르게 이동할 수 없다.',
          '무지개는 빛이 물방울을 통과하면서 여러 색깔로 분리되는 현상인데, 이를 빛의 분산이라고 한다.',
        ],
      },
      en: {
        word: 'Light',
        explanation: 'Energy that enables us to see. Travels at the fastest speed possible.',
        examples: [
          '빛이 밝아요. - The light is bright.',
          '빛의 속도는 매우 빨라요. - The speed of light is very fast.',
          'The speed of light is about 300,000 kilometers per second—the fastest speed in the universe, and nothing can travel faster.',
          'A rainbow occurs when light passes through water droplets and separates into different colors, which is called light dispersion.',
        ],
      },
    },
  },
  {
    id: 'padong',
    korean: '파동',
    romanization: 'padong',
    partOfSpeech: 'noun',
    categoryId: 'physics',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['physics', 'wave'],
    translations: {
      ko: {
        word: '파동',
        explanation: '에너지가 퍼져나가는 진동 현상. 소리와 빛도 파동이다.',
        examples: [
          '소리는 파동으로 전달돼요.',
          '물결도 파동이에요.',
          '바다에서 파도가 치는 것을 보면 파동이 에너지를 전달하는 방식을 직접 눈으로 확인할 수 있다.',
          '지진이 발생하면 지진파라는 파동이 땅속을 통해 전달되어 먼 곳까지 영향을 미친다.',
        ],
      },
      en: {
        word: 'Wave',
        explanation: 'A vibration phenomenon where energy spreads. Sound and light are also waves.',
        examples: [
          '소리는 파동으로 전달돼요. - Sound travels as waves.',
          '물결도 파동이에요. - Water ripples are waves too.',
          'Watching ocean waves, you can directly see how waves transfer energy.',
          'When an earthquake occurs, seismic waves travel through the ground and affect distant areas.',
        ],
      },
    },
  },
  {
    id: 'him',
    korean: '힘',
    romanization: 'him',
    partOfSpeech: 'noun',
    categoryId: 'physics',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['physics', 'force'],
    translations: {
      ko: {
        word: '힘',
        explanation: '물체의 운동 상태를 변화시키는 작용. 밀기, 당기기 등.',
        examples: [
          '힘을 주세요.',
          '중력은 힘이에요.',
          '뉴턴의 운동 법칙에 따르면, 힘은 물체의 질량과 가속도의 곱으로 계산할 수 있다.',
          '문이 무거워서 두 손으로 힘을 주어야 겨우 열 수 있었다.',
        ],
      },
      en: {
        word: 'Force',
        explanation:
          'An action that changes the state of motion of an object. Pushing, pulling, etc.',
        examples: [
          '힘을 주세요. - Give it some force.',
          '중력은 힘이에요. - Gravity is a force.',
          "According to Newton's laws of motion, force can be calculated as the product of mass and acceleration.",
          'The door was so heavy that I had to push with both hands to barely open it.',
        ],
      },
    },
  },
  {
    id: 'sokdo',
    korean: '속도',
    romanization: 'sokdo',
    partOfSpeech: 'noun',
    categoryId: 'physics',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['physics', 'speed'],
    translations: {
      ko: {
        word: '속도',
        explanation: '물체가 이동하는 빠르기. 거리를 시간으로 나눈 값.',
        examples: [
          '속도가 빨라요.',
          '속도를 줄이세요.',
          '고속도로에서는 속도 제한을 지키지 않으면 과속 단속 카메라에 찍혀 벌금을 낼 수 있다.',
          '물리학에서 속도는 방향까지 포함하는 벡터량이고, 속력은 크기만을 나타내는 스칼라량이다.',
        ],
      },
      en: {
        word: 'Speed / Velocity',
        explanation: 'How fast an object moves. Distance divided by time.',
        examples: [
          '속도가 빨라요. - The speed is fast.',
          '속도를 줄이세요. - Reduce your speed.',
          "On highways, if you don't follow the speed limit, you can get caught by speed cameras and be fined.",
          'In physics, velocity is a vector quantity that includes direction, while speed is a scalar quantity that only indicates magnitude.',
        ],
      },
    },
  },
  {
    id: 'ondo',
    korean: '온도',
    romanization: 'ondo',
    partOfSpeech: 'noun',
    categoryId: 'physics',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['physics', 'temperature'],
    translations: {
      ko: {
        word: '온도',
        explanation: '물체의 차갑고 뜨거운 정도. 섭씨(°C)나 화씨(°F)로 측정한다.',
        examples: [
          '오늘 온도가 높아요.',
          '온도를 측정했어요.',
          '물이 끓는 온도는 섭씨 100도이고, 얼음이 녹는 온도는 섭씨 0도다.',
          '요리할 때 오븐 온도를 정확하게 맞추지 않으면 음식이 타거나 덜 익을 수 있다.',
        ],
      },
      en: {
        word: 'Temperature',
        explanation: 'The degree of hotness or coldness. Measured in Celsius or Fahrenheit.',
        examples: [
          "오늘 온도가 높아요. - Today's temperature is high.",
          '온도를 측정했어요. - I measured the temperature.',
          'Water boils at 100 degrees Celsius and ice melts at 0 degrees Celsius.',
          "If you don't set the oven temperature correctly when cooking, the food may burn or be undercooked.",
        ],
      },
    },
  },
  {
    id: 'jeongi',
    korean: '전기',
    romanization: 'jeongi',
    partOfSpeech: 'noun',
    categoryId: 'physics',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['physics', 'electricity'],
    translations: {
      ko: {
        word: '전기',
        explanation: '전하의 흐름. 우리 생활에 필수적인 에너지원.',
        examples: [
          '전기를 아껴 써요.',
          '전기가 나갔어요.',
          '현대 사회에서 전기 없이 하루를 보내는 것은 거의 불가능할 정도로 우리는 전기에 의존하고 있다.',
          '정전이 되었을 때 촛불 하나로 밤을 보내면서 전기의 소중함을 새삼 느꼈다.',
        ],
      },
      en: {
        word: 'Electricity',
        explanation: 'The flow of electric charge. An essential energy source for our lives.',
        examples: [
          "전기를 아껴 써요. - Let's save electricity.",
          '전기가 나갔어요. - The power went out.',
          'In modern society, we are so dependent on electricity that it is almost impossible to spend a day without it.',
          'When the power went out and I spent the night with just a candle, I realized how precious electricity is.',
        ],
      },
    },
  },
  {
    id: 'jasuk',
    korean: '자석',
    romanization: 'jaseok',
    partOfSpeech: 'noun',
    categoryId: 'physics',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['physics', 'magnet'],
    translations: {
      ko: {
        word: '자석',
        explanation: '철을 끌어당기는 물체. N극과 S극이 있다.',
        examples: [
          '자석이 철을 끌어당겨요.',
          '냉장고에 자석을 붙였어요.',
          '자석의 같은 극끼리는 밀어내고 다른 극끼리는 끌어당기는 성질을 이용해 모터와 발전기가 작동한다.',
          '나침반이 항상 북쪽을 가리키는 이유는 지구 자체가 거대한 자석이기 때문이다.',
        ],
      },
      en: {
        word: 'Magnet',
        explanation: 'An object that attracts iron. Has north and south poles.',
        examples: [
          '자석이 철을 끌어당겨요. - The magnet attracts iron.',
          '냉장고에 자석을 붙였어요. - I put a magnet on the fridge.',
          'Motors and generators work using the property that like magnetic poles repel and opposite poles attract.',
          'The reason a compass always points north is because the Earth itself is a giant magnet.',
        ],
      },
    },
  },

  // Math
  {
    id: 'sutja',
    korean: '숫자',
    romanization: 'sutja',
    partOfSpeech: 'noun',
    categoryId: 'math',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['math', 'number'],
    translations: {
      ko: {
        word: '숫자',
        explanation: '양을 나타내는 기호. 0, 1, 2, 3... 등.',
        examples: [
          '숫자를 세요.',
          '이 숫자가 뭐예요?',
          '아라비아 숫자가 전 세계에서 공통으로 사용되기 전까지는 각 나라마다 다른 숫자 체계를 사용했다.',
          '어릴 때 숫자를 처음 배울 때는 손가락으로 세면서 하나, 둘, 셋을 익혔다.',
        ],
      },
      en: {
        word: 'Number',
        explanation: 'Symbols representing quantity. 0, 1, 2, 3... etc.',
        examples: [
          '숫자를 세요. - Count the numbers.',
          '이 숫자가 뭐예요? - What is this number?',
          'Before Arabic numerals became universally used worldwide, each country had its own number system.',
          'When I first learned numbers as a child, I counted on my fingers saying one, two, three.',
        ],
      },
    },
  },
  {
    id: 'deotssem',
    korean: '덧셈',
    romanization: 'deotsem',
    partOfSpeech: 'noun',
    categoryId: 'math',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['math', 'operation'],
    translations: {
      ko: {
        word: '덧셈',
        explanation: '두 수를 더하는 연산. 더하기(+).',
        examples: [
          '덧셈을 해요.',
          '덧셈이 쉬워요.',
          '초등학교 1학년 때 덧셈을 처음 배우고 나서 일상생활에서 물건 값을 계산하는 재미가 생겼다.',
          '암산으로 큰 숫자의 덧셈을 빠르게 하려면 자릿수를 나누어서 계산하는 방법이 효과적이다.',
        ],
      },
      en: {
        word: 'Addition',
        explanation: 'The operation of adding two numbers. Plus (+).',
        examples: [
          "덧셈을 해요. - Let's do addition.",
          '덧셈이 쉬워요. - Addition is easy.',
          'After learning addition in first grade, I started to enjoy calculating prices of items in daily life.',
          'To quickly do mental addition with large numbers, splitting them by place value is an effective method.',
        ],
      },
    },
  },
  {
    id: 'ppelssem',
    korean: '뺄셈',
    romanization: 'ppaelsem',
    partOfSpeech: 'noun',
    categoryId: 'math',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['math', 'operation'],
    translations: {
      ko: {
        word: '뺄셈',
        explanation: '한 수에서 다른 수를 빼는 연산. 빼기(-).',
        examples: [
          '뺄셈을 배워요.',
          '뺄셈이 어려워요?',
          '가게에서 돈을 내고 거스름돈을 받을 때 뺄셈을 사용해서 정확한 금액을 확인한다.',
          '어릴 때 뺄셈에서 받아내림이 나오면 헷갈려서 자주 틀렸던 기억이 있다.',
        ],
      },
      en: {
        word: 'Subtraction',
        explanation: 'The operation of subtracting one number from another. Minus (-).',
        examples: [
          "뺄셈을 배워요. - Let's learn subtraction.",
          '뺄셈이 어려워요? - Is subtraction difficult?',
          'When paying at a store and receiving change, I use subtraction to verify the correct amount.',
          'When I was young, I often made mistakes with subtraction when borrowing was involved because it was confusing.',
        ],
      },
    },
  },
  {
    id: 'gopssem',
    korean: '곱셈',
    romanization: 'gopsem',
    partOfSpeech: 'noun',
    categoryId: 'math',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['math', 'operation'],
    translations: {
      ko: {
        word: '곱셈',
        explanation: '두 수를 곱하는 연산. 곱하기(×).',
        examples: [
          '곱셈 구구단을 외웠어요.',
          '곱셈을 해보세요.',
          '한국에서는 초등학교 2학년 때 구구단을 외우면서 곱셈의 기초를 다지는데, 처음에는 노래로 외우기도 한다.',
          '면적을 구할 때 가로와 세로 길이를 곱셈하면 되니까 곱셈은 실생활에서 정말 많이 쓰인다.',
        ],
      },
      en: {
        word: 'Multiplication',
        explanation: 'The operation of multiplying two numbers. Times (×).',
        examples: [
          '곱셈 구구단을 외웠어요. - I memorized the multiplication table.',
          '곱셈을 해보세요. - Try multiplication.',
          'In Korea, children memorize multiplication tables in second grade to build the foundation of multiplication, sometimes using songs.',
          'Since you just need to multiply the length by the width to find the area, multiplication is used a lot in real life.',
        ],
      },
    },
  },
  {
    id: 'nanusem',
    korean: '나눗셈',
    romanization: 'nanutsem',
    partOfSpeech: 'noun',
    categoryId: 'math',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['math', 'operation'],
    translations: {
      ko: {
        word: '나눗셈',
        explanation: '한 수를 다른 수로 나누는 연산. 나누기(÷).',
        examples: [
          '나눗셈을 배우고 있어요.',
          '나눗셈이 어려워요.',
          '친구들과 과자를 똑같이 나눌 때 나눗셈을 사용하면 각자 몇 개씩 받을 수 있는지 쉽게 알 수 있다.',
          '나눗셈에서 나누어떨어지지 않는 경우에는 나머지가 생기는데, 이것을 활용하는 문제도 많다.',
        ],
      },
      en: {
        word: 'Division',
        explanation: 'The operation of dividing one number by another. Divided by (÷).',
        examples: [
          "나눗셈을 배우고 있어요. - I'm learning division.",
          '나눗셈이 어려워요. - Division is difficult.',
          'When sharing snacks equally among friends, using division easily shows how many each person gets.',
          "When division doesn't divide evenly, there is a remainder, and many problems make use of this concept.",
        ],
      },
    },
  },
  {
    id: 'hamsu',
    korean: '함수',
    romanization: 'hamsu',
    partOfSpeech: 'noun',
    categoryId: 'math',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['math', 'function'],
    translations: {
      ko: {
        word: '함수',
        explanation: '입력값을 받아 출력값을 내는 관계. 수학의 중요한 개념.',
        examples: [
          '함수를 배워요.',
          '이것은 일차 함수예요.',
          '프로그래밍에서도 함수 개념이 매우 중요한데, 특정 입력을 받아 원하는 결과를 반환하는 코드 블록을 함수라고 부른다.',
          '고등학교 수학에서 이차 함수의 그래프를 그리고 최댓값과 최솟값을 구하는 법을 배웠다.',
        ],
      },
      en: {
        word: 'Function',
        explanation: 'A relationship that takes input and gives output. An important math concept.',
        examples: [
          "함수를 배워요. - Let's learn functions.",
          '이것은 일차 함수예요. - This is a linear function.',
          'The concept of functions is also very important in programming, where a block of code that takes specific input and returns desired output is called a function.',
          'In high school math, I learned how to graph quadratic functions and find their maximum and minimum values.',
        ],
      },
    },
  },
  {
    id: 'gihahak',
    korean: '기하학',
    romanization: 'gihahak',
    partOfSpeech: 'noun',
    categoryId: 'math',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['math', 'geometry'],
    translations: {
      ko: {
        word: '기하학',
        explanation: '도형과 공간을 연구하는 수학 분야. 삼각형, 원 등을 다룬다.',
        examples: [
          '기하학이 재미있어요.',
          '기하학 문제를 풀었어요.',
          '고대 그리스의 유클리드가 정리한 기하학은 수천 년이 지난 지금도 수학 교육의 기초가 되고 있다.',
          '건축가들은 기하학적 원리를 활용하여 아름답고 안정적인 건물을 설계한다.',
        ],
      },
      en: {
        word: 'Geometry',
        explanation:
          'The branch of math studying shapes and space. Deals with triangles, circles, etc.',
        examples: [
          '기하학이 재미있어요. - Geometry is interesting.',
          '기하학 문제를 풀었어요. - I solved a geometry problem.',
          'The geometry organized by Euclid in ancient Greece still serves as the foundation of mathematics education thousands of years later.',
          'Architects use geometric principles to design buildings that are both beautiful and structurally stable.',
        ],
      },
    },
  },
  {
    id: 'bangjeongshik',
    korean: '방정식',
    romanization: 'bangjeongsik',
    partOfSpeech: 'noun',
    categoryId: 'math',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['math', 'equation'],
    translations: {
      ko: {
        word: '방정식',
        explanation: '미지수를 포함한 등식. x를 구하는 것이 목표.',
        examples: [
          '방정식을 풀어요.',
          '이차 방정식을 배웠어요.',
          '아인슈타인의 유명한 E=mc² 방정식은 에너지와 질량의 관계를 간결하게 표현한 것이다.',
          '연립 방정식을 풀기 위해서는 미지수의 개수만큼 식이 필요하다는 것을 수학 시간에 배웠다.',
        ],
      },
      en: {
        word: 'Equation',
        explanation: 'An equality containing unknowns. The goal is to find x.',
        examples: [
          "방정식을 풀어요. - Let's solve the equation.",
          '이차 방정식을 배웠어요. - I learned quadratic equations.',
          "Einstein's famous E=mc² equation concisely expresses the relationship between energy and mass.",
          'I learned in math class that to solve a system of equations, you need as many equations as there are unknowns.',
        ],
      },
    },
  },
  {
    id: 'bunsu',
    korean: '분수',
    romanization: 'bunsu',
    partOfSpeech: 'noun',
    categoryId: 'math',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['math', 'fraction'],
    translations: {
      ko: {
        word: '분수',
        explanation: '전체를 나눈 부분을 나타내는 수. 분자와 분모로 이루어진다.',
        examples: [
          '분수를 배워요.',
          '이분의 일은 0.5예요.',
          '피자를 여덟 조각으로 나누어 세 조각을 먹었으니 팔분의 삼을 먹은 것이다.',
          '분수의 덧셈을 할 때는 먼저 분모를 같게 통분한 다음 분자끼리 더해야 한다.',
        ],
      },
      en: {
        word: 'Fraction',
        explanation:
          'A number representing a part of a whole. Consists of numerator and denominator.',
        examples: [
          "분수를 배워요. - Let's learn fractions.",
          '이분의 일은 0.5예요. - One half is 0.5.',
          'I divided the pizza into eight slices and ate three, so I ate three-eighths of it.',
          'When adding fractions, you must first find a common denominator, then add the numerators.',
        ],
      },
    },
  },
  {
    id: 'gyesan',
    korean: '계산',
    romanization: 'gyesan',
    partOfSpeech: 'noun',
    categoryId: 'math',
    difficulty: 'beginner',
    frequency: 'common',
    tags: ['math', 'calculation'],
    translations: {
      ko: {
        word: '계산',
        explanation: '수를 더하고, 빼고, 곱하고, 나누는 것. 수학의 기본 활동.',
        examples: [
          '계산이 빨라요.',
          '계산기로 계산해요.',
          '컴퓨터는 초당 수십억 번의 계산을 수행할 수 있어서 복잡한 과학 시뮬레이션도 빠르게 처리한다.',
          '마트에서 장을 볼 때 암산으로 대략적인 총액을 계산해 보는 습관이 있다.',
        ],
      },
      en: {
        word: 'Calculation',
        explanation: 'Adding, subtracting, multiplying, dividing numbers. Basic math activity.',
        examples: [
          '계산이 빨라요. - Your calculation is fast.',
          '계산기로 계산해요. - I calculate with a calculator.',
          'Computers can perform billions of calculations per second, allowing them to quickly process complex scientific simulations.',
          'When shopping at the supermarket, I have a habit of mentally calculating the approximate total.',
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
export function searchEntries(query: string, lang: Language): MeaningEntry[] {
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
export function getFeaturedEntries(count = 6): MeaningEntry[] {
  return meaningEntries
    .filter((e) => e.difficulty === 'beginner' && e.frequency === 'common')
    .slice(0, count);
}

// Get entries by difficulty
export function getEntriesByDifficulty(difficulty: MeaningEntry['difficulty']): MeaningEntry[] {
  return meaningEntries.filter((e) => e.difficulty === difficulty);
}
