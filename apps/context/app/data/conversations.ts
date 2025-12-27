/**
 * @fileoverview 대화 예시 데이터
 *
 * 카테고리별 실생활 대화 예시를 제공합니다.
 * 대화 내 단어는 LinkedExample 컴포넌트를 통해 딥링크로 연결됩니다.
 */
import type { Conversation } from './types';

export const conversations: Conversation[] = [
  // ============================================================================
  // 인사 (Greetings)
  // ============================================================================
  {
    id: 'greetings-morning-1',
    categoryId: 'greetings',
    title: { ko: '아침 인사', en: 'Morning Greeting' },
    dialogue: [
      { speaker: 'A', ko: '안녕하세요!', en: 'Hello!' },
      { speaker: 'B', ko: '안녕하세요! 잘 잤어요?', en: 'Hello! Did you sleep well?' },
      {
        speaker: 'A',
        ko: '네, 잘 잤어요. 오늘 날씨가 좋네요.',
        en: 'Yes, I slept well. The weather is nice today.',
      },
      { speaker: 'B', ko: '그러게요. 좋은 하루 보내세요!', en: 'I know, right. Have a nice day!' },
    ],
  },
  {
    id: 'greetings-goodbye-1',
    categoryId: 'greetings',
    title: { ko: '작별 인사', en: 'Saying Goodbye' },
    dialogue: [
      { speaker: 'A', ko: '저 먼저 가볼게요.', en: "I'll get going now." },
      { speaker: 'B', ko: '네, 조심히 가세요!', en: 'Okay, take care!' },
      { speaker: 'A', ko: '감사합니다. 다음에 또 봬요.', en: 'Thank you. See you next time.' },
      { speaker: 'B', ko: '네, 안녕히 가세요!', en: 'Yes, goodbye!' },
    ],
  },
  {
    id: 'greetings-introduce-1',
    categoryId: 'greetings',
    title: { ko: '자기소개', en: 'Self Introduction' },
    dialogue: [
      { speaker: 'A', ko: '안녕하세요. 저는 민수예요.', en: 'Hello. I am Minsu.' },
      { speaker: 'B', ko: '반갑습니다. 저는 유나예요.', en: 'Nice to meet you. I am Yuna.' },
      { speaker: 'A', ko: '어디서 왔어요?', en: 'Where are you from?' },
      { speaker: 'B', ko: '저는 서울에서 왔어요.', en: 'I am from Seoul.' },
    ],
  },
  {
    id: 'greetings-thankyou-1',
    categoryId: 'greetings',
    title: { ko: '감사 인사', en: 'Saying Thank You' },
    dialogue: [
      { speaker: 'A', ko: '도와주셔서 정말 감사합니다.', en: 'Thank you so much for your help.' },
      {
        speaker: 'B',
        ko: '별말씀을요. 도움이 됐다니 기뻐요.',
        en: "You're welcome. I'm glad I could help.",
      },
      { speaker: 'A', ko: '다음에 제가 밥 살게요!', en: "I'll buy you a meal next time!" },
      { speaker: 'B', ko: '좋아요! 기대할게요.', en: "Sounds good! I'll look forward to it." },
    ],
  },
  {
    id: 'greetings-apology-1',
    categoryId: 'greetings',
    title: { ko: '사과하기', en: 'Apologizing' },
    dialogue: [
      { speaker: 'A', ko: '늦어서 죄송합니다.', en: "I'm sorry for being late." },
      {
        speaker: 'B',
        ko: '괜찮아요. 많이 기다리지 않았어요.',
        en: "It's okay. I didn't wait long.",
      },
      { speaker: 'A', ko: '다음에는 일찍 올게요.', en: "I'll come early next time." },
      { speaker: 'B', ko: '네, 걱정 마세요.', en: "Yes, don't worry about it." },
    ],
  },
  {
    id: 'greetings-weekend-1',
    categoryId: 'greetings',
    title: { ko: '주말 안부', en: 'Weekend Plans' },
    dialogue: [
      { speaker: 'A', ko: '주말 잘 보냈어요?', en: 'Did you have a good weekend?' },
      {
        speaker: 'B',
        ko: '네, 친구들이랑 영화 봤어요.',
        en: 'Yes, I watched a movie with friends.',
      },
      { speaker: 'A', ko: '재미있었어요?', en: 'Was it fun?' },
      { speaker: 'B', ko: '네, 정말 재미있었어요!', en: 'Yes, it was really fun!' },
    ],
  },

  // ============================================================================
  // 감정 (Emotions)
  // ============================================================================
  {
    id: 'emotions-happy-1',
    categoryId: 'emotions',
    title: { ko: '기쁜 소식', en: 'Good News' },
    dialogue: [
      { speaker: 'A', ko: '오늘 정말 기뻐요!', en: "I'm so happy today!" },
      { speaker: 'B', ko: '왜요? 무슨 좋은 일 있어요?', en: 'Why? Did something good happen?' },
      { speaker: 'A', ko: '시험에 합격했어요!', en: 'I passed the exam!' },
      { speaker: 'B', ko: '축하해요! 정말 잘했어요.', en: 'Congratulations! You did great.' },
    ],
  },
  {
    id: 'emotions-sad-1',
    categoryId: 'emotions',
    title: { ko: '위로하기', en: 'Comforting Someone' },
    dialogue: [
      { speaker: 'A', ko: '오늘 좀 슬퍼요.', en: "I'm a bit sad today." },
      { speaker: 'B', ko: '왜요? 무슨 일 있어요?', en: "Why? What's wrong?" },
      { speaker: 'A', ko: '친구가 이사를 가요.', en: 'My friend is moving away.' },
      { speaker: 'B', ko: '속상하겠네요. 힘내세요.', en: 'That must be hard. Cheer up.' },
    ],
  },
  {
    id: 'emotions-tired-1',
    categoryId: 'emotions',
    title: { ko: '피곤한 하루', en: 'Tired Day' },
    dialogue: [
      { speaker: 'A', ko: '오늘 너무 피곤해요.', en: "I'm so tired today." },
      { speaker: 'B', ko: '많이 바빴어요?', en: 'Were you busy?' },
      { speaker: 'A', ko: '네, 일이 많았어요.', en: 'Yes, I had a lot of work.' },
      { speaker: 'B', ko: '오늘은 일찍 쉬세요.', en: 'Get some rest early today.' },
    ],
  },
  {
    id: 'emotions-angry-1',
    categoryId: 'emotions',
    title: { ko: '화난 상황', en: 'Being Upset' },
    dialogue: [
      { speaker: 'A', ko: '정말 화가 나요.', en: "I'm really upset." },
      { speaker: 'B', ko: '무슨 일이에요?', en: 'What happened?' },
      { speaker: 'A', ko: '약속을 안 지켰어요.', en: "They didn't keep their promise." },
      { speaker: 'B', ko: '그건 정말 속상하겠네요.', en: 'That must be really frustrating.' },
    ],
  },
  {
    id: 'emotions-excited-1',
    categoryId: 'emotions',
    title: { ko: '설레는 일', en: 'Feeling Excited' },
    dialogue: [
      { speaker: 'A', ko: '다음 주에 여행 가요!', en: "I'm going on a trip next week!" },
      { speaker: 'B', ko: '진짜요? 어디로 가요?', en: 'Really? Where are you going?' },
      { speaker: 'A', ko: '제주도요. 정말 설레요!', en: "Jeju Island. I'm so excited!" },
      { speaker: 'B', ko: '부러워요! 재미있게 보내요.', en: "I'm jealous! Have fun." },
    ],
  },
  {
    id: 'emotions-nervous-1',
    categoryId: 'emotions',
    title: { ko: '긴장되는 상황', en: 'Feeling Nervous' },
    dialogue: [
      { speaker: 'A', ko: '내일 면접이에요.', en: 'I have an interview tomorrow.' },
      { speaker: 'B', ko: '긴장되세요?', en: 'Are you nervous?' },
      { speaker: 'A', ko: '네, 많이 떨려요.', en: "Yes, I'm very nervous." },
      { speaker: 'B', ko: '잘 될 거예요. 화이팅!', en: "You'll do great. Fighting!" },
    ],
  },

  // ============================================================================
  // 음식 (Food)
  // ============================================================================
  {
    id: 'food-order-1',
    categoryId: 'food',
    title: { ko: '식당 주문', en: 'Ordering at Restaurant' },
    dialogue: [
      { speaker: 'A', ko: '뭐 먹을래요?', en: 'What do you want to eat?' },
      { speaker: 'B', ko: '김치찌개 어때요?', en: 'How about kimchi stew?' },
      { speaker: 'A', ko: '좋아요! 밥은요?', en: 'Sounds good! What about rice?' },
      { speaker: 'B', ko: '공기밥 두 개 주세요.', en: 'Two bowls of rice, please.' },
    ],
  },
  {
    id: 'food-taste-1',
    categoryId: 'food',
    title: { ko: '맛 표현하기', en: 'Describing Taste' },
    dialogue: [
      { speaker: 'A', ko: '이거 맛있어요?', en: 'Is this delicious?' },
      {
        speaker: 'B',
        ko: '네, 정말 맛있어요! 드셔 보세요.',
        en: 'Yes, it is really delicious! Try it.',
      },
      { speaker: 'A', ko: '와, 진짜 맛있네요!', en: 'Wow, this is really good!' },
      { speaker: 'B', ko: '그죠? 여기 음식 다 맛있어요.', en: 'Right? All the food here is good.' },
    ],
  },
  {
    id: 'food-coffee-1',
    categoryId: 'food',
    title: { ko: '커피숍에서', en: 'At a Coffee Shop' },
    dialogue: [
      { speaker: 'A', ko: '뭐 마실래요?', en: 'What would you like to drink?' },
      { speaker: 'B', ko: '아이스 아메리카노 주세요.', en: 'Iced Americano, please.' },
      { speaker: 'A', ko: '사이즈는요?', en: 'What size?' },
      { speaker: 'B', ko: '큰 거로 주세요.', en: 'Large, please.' },
    ],
  },
  {
    id: 'food-cooking-1',
    categoryId: 'food',
    title: { ko: '요리하기', en: 'Cooking' },
    dialogue: [
      { speaker: 'A', ko: '오늘 뭐 만들어요?', en: 'What are you making today?' },
      { speaker: 'B', ko: '불고기 만들어요.', en: "I'm making bulgogi." },
      { speaker: 'A', ko: '도와줄까요?', en: 'Can I help?' },
      { speaker: 'B', ko: '네, 야채 좀 썰어 주세요.', en: 'Yes, please cut the vegetables.' },
    ],
  },
  {
    id: 'food-recommend-1',
    categoryId: 'food',
    title: { ko: '음식 추천', en: 'Food Recommendation' },
    dialogue: [
      {
        speaker: 'A',
        ko: '이 식당 처음이에요. 뭐가 맛있어요?',
        en: "This is my first time here. What's good?",
      },
      { speaker: 'B', ko: '여기 삼겹살이 유명해요.', en: 'The samgyeopsal is famous here.' },
      { speaker: 'A', ko: '그럼 그거 시킬게요.', en: "Then I'll order that." },
      { speaker: 'B', ko: '잘 선택하셨어요!', en: 'Good choice!' },
    ],
  },
  {
    id: 'food-spicy-1',
    categoryId: 'food',
    title: { ko: '매운 음식', en: 'Spicy Food' },
    dialogue: [
      { speaker: 'A', ko: '이거 매워요?', en: 'Is this spicy?' },
      { speaker: 'B', ko: '조금 매워요. 괜찮아요?', en: "It's a bit spicy. Is that okay?" },
      { speaker: 'A', ko: '저는 매운 거 잘 못 먹어요.', en: "I can't eat spicy food well." },
      {
        speaker: 'B',
        ko: '그럼 안 매운 거로 드릴까요?',
        en: 'Then should I get you something not spicy?',
      },
    ],
  },

  // ============================================================================
  // 쇼핑 (Shopping)
  // ============================================================================
  {
    id: 'shopping-clothes-1',
    categoryId: 'shopping',
    title: { ko: '옷 가게에서', en: 'At a Clothing Store' },
    dialogue: [
      { speaker: 'A', ko: '이 옷 입어봐도 돼요?', en: 'Can I try this on?' },
      { speaker: 'B', ko: '네, 탈의실은 저쪽이에요.', en: 'Yes, the fitting room is over there.' },
      {
        speaker: 'A',
        ko: '사이즈가 좀 작아요. 큰 거 있어요?',
        en: 'The size is a bit small. Do you have a bigger one?',
      },
      { speaker: 'B', ko: '잠시만요, 확인해 볼게요.', en: "Just a moment, I'll check." },
    ],
  },
  {
    id: 'shopping-price-1',
    categoryId: 'shopping',
    title: { ko: '가격 묻기', en: 'Asking the Price' },
    dialogue: [
      { speaker: 'A', ko: '이거 얼마예요?', en: 'How much is this?' },
      { speaker: 'B', ko: '오만 원이에요.', en: "It's 50,000 won." },
      {
        speaker: 'A',
        ko: '좀 비싸네요. 할인 돼요?',
        en: "That's a bit expensive. Is there a discount?",
      },
      { speaker: 'B', ko: '오늘은 10% 할인이에요.', en: "Today there's a 10% discount." },
    ],
  },
  {
    id: 'shopping-exchange-1',
    categoryId: 'shopping',
    title: { ko: '교환/환불', en: 'Exchange/Refund' },
    dialogue: [
      { speaker: 'A', ko: '이거 교환하고 싶어요.', en: 'I want to exchange this.' },
      { speaker: 'B', ko: '무슨 문제가 있어요?', en: "What's the problem?" },
      { speaker: 'A', ko: '사이즈가 안 맞아요.', en: "The size doesn't fit." },
      {
        speaker: 'B',
        ko: '영수증 있으시면 교환해 드릴게요.',
        en: "If you have the receipt, I'll exchange it for you.",
      },
    ],
  },
  {
    id: 'shopping-recommend-1',
    categoryId: 'shopping',
    title: { ko: '추천 받기', en: 'Getting Recommendations' },
    dialogue: [
      {
        speaker: 'A',
        ko: '선물 사려고 하는데 추천해 주세요.',
        en: 'I want to buy a gift. Can you recommend something?',
      },
      { speaker: 'B', ko: '누구한테 줄 거예요?', en: 'Who is it for?' },
      { speaker: 'A', ko: '친구 생일 선물이에요.', en: "It's a birthday gift for a friend." },
      {
        speaker: 'B',
        ko: '이 가방 어때요? 요즘 인기 많아요.',
        en: 'How about this bag? It is very popular these days.',
      },
    ],
  },
  {
    id: 'shopping-pay-1',
    categoryId: 'shopping',
    title: { ko: '계산하기', en: 'Paying' },
    dialogue: [
      { speaker: 'A', ko: '계산해 주세요.', en: "I'd like to pay." },
      {
        speaker: 'B',
        ko: '카드로 하시겠어요, 현금으로 하시겠어요?',
        en: 'Would you like to pay by card or cash?',
      },
      { speaker: 'A', ko: '카드로 할게요.', en: "I'll pay by card." },
      { speaker: 'B', ko: '네, 여기 서명해 주세요.', en: 'Yes, please sign here.' },
    ],
  },
  {
    id: 'shopping-online-1',
    categoryId: 'shopping',
    title: { ko: '온라인 쇼핑', en: 'Online Shopping' },
    dialogue: [
      { speaker: 'A', ko: '인터넷으로 뭐 샀어요?', en: 'What did you buy online?' },
      {
        speaker: 'B',
        ko: '신발 샀어요. 반값 세일이었어요.',
        en: 'I bought shoes. They were half price.',
      },
      { speaker: 'A', ko: '좋겠다! 배송은 언제 와요?', en: 'Nice! When does it arrive?' },
      { speaker: 'B', ko: '내일 온대요.', en: "They said it'll come tomorrow." },
    ],
  },

  // ============================================================================
  // 여행 (Travel)
  // ============================================================================
  {
    id: 'travel-direction-1',
    categoryId: 'travel',
    title: { ko: '길 묻기', en: 'Asking for Directions' },
    dialogue: [
      {
        speaker: 'A',
        ko: '실례합니다. 지하철역이 어디예요?',
        en: 'Excuse me. Where is the subway station?',
      },
      { speaker: 'B', ko: '저기 오른쪽으로 가세요.', en: 'Go right over there.' },
      { speaker: 'A', ko: '얼마나 걸려요?', en: 'How long does it take?' },
      { speaker: 'B', ko: '걸어서 5분쯤 걸려요.', en: 'It takes about 5 minutes on foot.' },
    ],
  },
  {
    id: 'travel-taxi-1',
    categoryId: 'travel',
    title: { ko: '택시 타기', en: 'Taking a Taxi' },
    dialogue: [
      { speaker: 'A', ko: '서울역 가 주세요.', en: 'Please take me to Seoul Station.' },
      { speaker: 'B', ko: '네, 알겠습니다.', en: 'Okay, understood.' },
      { speaker: 'A', ko: '얼마나 걸려요?', en: 'How long will it take?' },
      {
        speaker: 'B',
        ko: '지금 길이 막혀서 30분쯤 걸릴 거예요.',
        en: "Traffic is heavy now, so it'll take about 30 minutes.",
      },
    ],
  },
  {
    id: 'travel-hotel-1',
    categoryId: 'travel',
    title: { ko: '호텔 체크인', en: 'Hotel Check-in' },
    dialogue: [
      {
        speaker: 'A',
        ko: '예약했는데요. 김민수입니다.',
        en: 'I have a reservation. My name is Kim Minsu.',
      },
      {
        speaker: 'B',
        ko: '네, 확인됐습니다. 여권 보여 주세요.',
        en: 'Yes, confirmed. Please show me your passport.',
      },
      { speaker: 'A', ko: '여기요. 와이파이 있어요?', en: 'Here you go. Is there Wi-Fi?' },
      {
        speaker: 'B',
        ko: '네, 무료입니다. 비밀번호는 방에 있어요.',
        en: 'Yes, it is free. The password is in the room.',
      },
    ],
  },
  {
    id: 'travel-bus-1',
    categoryId: 'travel',
    title: { ko: '버스 타기', en: 'Taking a Bus' },
    dialogue: [
      { speaker: 'A', ko: '이 버스 명동 가요?', en: 'Does this bus go to Myeongdong?' },
      { speaker: 'B', ko: '아니요, 저 버스 타세요.', en: 'No, take that bus over there.' },
      { speaker: 'A', ko: '감사합니다. 몇 번이에요?', en: 'Thank you. What number is it?' },
      { speaker: 'B', ko: '100번이에요.', en: "It's number 100." },
    ],
  },
  {
    id: 'travel-plan-1',
    categoryId: 'travel',
    title: { ko: '여행 계획', en: 'Travel Plans' },
    dialogue: [
      { speaker: 'A', ko: '휴가 때 어디 가요?', en: 'Where are you going for vacation?' },
      {
        speaker: 'B',
        ko: '부산 가려고요. 바다 보고 싶어요.',
        en: "I'm planning to go to Busan. I want to see the ocean.",
      },
      { speaker: 'A', ko: '좋겠다! 며칠 가요?', en: 'Nice! How many days are you going?' },
      { speaker: 'B', ko: '3박 4일이요.', en: '3 nights and 4 days.' },
    ],
  },
  {
    id: 'travel-ticket-1',
    categoryId: 'travel',
    title: { ko: '표 사기', en: 'Buying Tickets' },
    dialogue: [
      { speaker: 'A', ko: '부산 가는 KTX 표 주세요.', en: 'A KTX ticket to Busan, please.' },
      { speaker: 'B', ko: '몇 시 거로 드릴까요?', en: 'What time would you like?' },
      { speaker: 'A', ko: '오후 2시요.', en: '2 PM, please.' },
      { speaker: 'B', ko: '네, 45,000원입니다.', en: 'Okay, that is 45,000 won.' },
    ],
  },

  // ============================================================================
  // 일상생활 (Daily Life)
  // ============================================================================
  {
    id: 'daily-weather-1',
    categoryId: 'daily-life',
    title: { ko: '날씨 이야기', en: 'Talking About Weather' },
    dialogue: [
      { speaker: 'A', ko: '오늘 날씨 어때요?', en: "How's the weather today?" },
      { speaker: 'B', ko: '좀 추워요. 따뜻하게 입으세요.', en: "It's a bit cold. Dress warmly." },
      { speaker: 'A', ko: '비도 올까요?', en: 'Will it rain too?' },
      {
        speaker: 'B',
        ko: '오후에 올 수도 있대요. 우산 가져가세요.',
        en: 'They say it might rain in the afternoon. Take an umbrella.',
      },
    ],
  },
  {
    id: 'daily-time-1',
    categoryId: 'daily-life',
    title: { ko: '시간 묻기', en: 'Asking the Time' },
    dialogue: [
      { speaker: 'A', ko: '지금 몇 시예요?', en: 'What time is it now?' },
      { speaker: 'B', ko: '2시 30분이에요.', en: "It's 2:30." },
      { speaker: 'A', ko: '벌써요? 시간이 빨리 가네요.', en: 'Already? Time flies.' },
      { speaker: 'B', ko: '그러게요. 곧 수업 시작해요.', en: 'I know. Class starts soon.' },
    ],
  },
  {
    id: 'daily-phone-1',
    categoryId: 'daily-life',
    title: { ko: '전화 통화', en: 'Phone Call' },
    dialogue: [
      { speaker: 'A', ko: '여보세요?', en: 'Hello?' },
      { speaker: 'B', ko: '안녕하세요, 저 민수예요.', en: 'Hello, this is Minsu.' },
      { speaker: 'A', ko: '아, 민수 씨! 무슨 일이에요?', en: 'Oh, Minsu! What is going on?' },
      {
        speaker: 'B',
        ko: '내일 약속 시간 확인하려고요.',
        en: "I'm calling to confirm our appointment time tomorrow.",
      },
    ],
  },
  {
    id: 'daily-hobby-1',
    categoryId: 'daily-life',
    title: { ko: '취미 이야기', en: 'Talking About Hobbies' },
    dialogue: [
      { speaker: 'A', ko: '취미가 뭐예요?', en: 'What are your hobbies?' },
      { speaker: 'B', ko: '저는 영화 보는 거 좋아해요.', en: 'I like watching movies.' },
      { speaker: 'A', ko: '어떤 영화 좋아해요?', en: 'What kind of movies do you like?' },
      {
        speaker: 'B',
        ko: '액션 영화 좋아해요. 요즘 뭐 봤어요?',
        en: 'I like action movies. Have you seen anything lately?',
      },
    ],
  },
  {
    id: 'daily-appointment-1',
    categoryId: 'daily-life',
    title: { ko: '약속 잡기', en: 'Making Plans' },
    dialogue: [
      { speaker: 'A', ko: '이번 주말에 시간 있어요?', en: 'Are you free this weekend?' },
      {
        speaker: 'B',
        ko: '토요일은 바쁜데, 일요일은 괜찮아요.',
        en: "I'm busy Saturday, but Sunday is fine.",
      },
      { speaker: 'A', ko: '그럼 일요일에 만날까요?', en: 'Then shall we meet on Sunday?' },
      {
        speaker: 'B',
        ko: '좋아요! 몇 시에 만날까요?',
        en: 'Sounds good! What time shall we meet?',
      },
    ],
  },
  {
    id: 'daily-sick-1',
    categoryId: 'daily-life',
    title: { ko: '아플 때', en: 'When Sick' },
    dialogue: [
      {
        speaker: 'A',
        ko: '안색이 안 좋아 보여요. 괜찮아요?',
        en: "You don't look well. Are you okay?",
      },
      { speaker: 'B', ko: '머리가 좀 아파요.', en: 'I have a headache.' },
      { speaker: 'A', ko: '약 먹었어요?', en: 'Did you take medicine?' },
      {
        speaker: 'B',
        ko: '아직이요. 약국 가야 해요.',
        en: 'Not yet. I need to go to the pharmacy.',
      },
    ],
  },

  // ============================================================================
  // 직장 (Work)
  // ============================================================================
  {
    id: 'work-meeting-1',
    categoryId: 'work',
    title: { ko: '회의 일정', en: 'Meeting Schedule' },
    dialogue: [
      { speaker: 'A', ko: '내일 회의 몇 시예요?', en: 'What time is the meeting tomorrow?' },
      { speaker: 'B', ko: '오전 10시예요.', en: "It's at 10 AM." },
      { speaker: 'A', ko: '어디서 해요?', en: 'Where is it?' },
      {
        speaker: 'B',
        ko: '3층 회의실이에요.',
        en: "It's in the conference room on the 3rd floor.",
      },
    ],
  },
  {
    id: 'work-request-1',
    categoryId: 'work',
    title: { ko: '업무 부탁', en: 'Work Request' },
    dialogue: [
      { speaker: 'A', ko: '이거 언제까지 필요해요?', en: 'When do you need this by?' },
      { speaker: 'B', ko: '금요일까지 부탁해요.', en: 'By Friday, please.' },
      {
        speaker: 'A',
        ko: '알겠습니다. 목요일까지 끝낼게요.',
        en: "Understood. I'll finish it by Thursday.",
      },
      {
        speaker: 'B',
        ko: '감사합니다. 급한 건 아니니까 천천히 해도 돼요.',
        en: "Thank you. It's not urgent, so take your time.",
      },
    ],
  },
  {
    id: 'work-break-1',
    categoryId: 'work',
    title: { ko: '쉬는 시간', en: 'Break Time' },
    dialogue: [
      { speaker: 'A', ko: '커피 한잔 할까요?', en: 'Shall we grab a coffee?' },
      { speaker: 'B', ko: '좋아요. 잠깐 쉬고 싶었어요.', en: 'Sure. I wanted to take a break.' },
      { speaker: 'A', ko: '1층 카페로 갈까요?', en: 'Shall we go to the cafe on the 1st floor?' },
      { speaker: 'B', ko: '네, 가요!', en: "Yes, let's go!" },
    ],
  },
  {
    id: 'work-overtime-1',
    categoryId: 'work',
    title: { ko: '야근하기', en: 'Working Overtime' },
    dialogue: [
      { speaker: 'A', ko: '오늘 야근해요?', en: 'Are you working overtime today?' },
      { speaker: 'B', ko: '네, 프로젝트 마감이에요.', en: "Yes, it's a project deadline." },
      { speaker: 'A', ko: '힘들겠다. 힘내세요!', en: 'That must be tough. Hang in there!' },
      { speaker: 'B', ko: '고마워요. 내일은 쉴 수 있어요.', en: 'Thanks. I can rest tomorrow.' },
    ],
  },
  {
    id: 'work-email-1',
    categoryId: 'work',
    title: { ko: '이메일 확인', en: 'Checking Email' },
    dialogue: [
      { speaker: 'A', ko: '제 이메일 받으셨어요?', en: 'Did you get my email?' },
      {
        speaker: 'B',
        ko: '아, 아직 못 봤어요. 지금 확인할게요.',
        en: "Oh, I haven't seen it yet. I'll check now.",
      },
      { speaker: 'A', ko: '파일 첨부해서 보냈어요.', en: 'I sent it with a file attached.' },
      { speaker: 'B', ko: '네, 확인하고 답장 드릴게요.', en: "Okay, I'll check and reply." },
    ],
  },
  {
    id: 'work-vacation-1',
    categoryId: 'work',
    title: { ko: '휴가 신청', en: 'Vacation Request' },
    dialogue: [
      { speaker: 'A', ko: '다음 주에 휴가 써도 될까요?', en: 'Can I take vacation next week?' },
      { speaker: 'B', ko: '며칠이요?', en: 'How many days?' },
      { speaker: 'A', ko: '3일이요. 목금월이요.', en: '3 days. Thursday, Friday, and Monday.' },
      { speaker: 'B', ko: '네, 휴가 신청서 내세요.', en: 'Okay, submit your vacation request.' },
    ],
  },
];

// ============================================================================
// Pre-computed Maps for O(1) lookup
// ============================================================================

/** ID → Conversation 맵 */
export const conversationsById = new Map(conversations.map((c) => [c.id, c]));

/** CategoryID → Conversation[] 맵 */
export const conversationsByCategory = new Map<string, Conversation[]>();
for (const conv of conversations) {
  const list = conversationsByCategory.get(conv.categoryId) || [];
  list.push(conv);
  conversationsByCategory.set(conv.categoryId, list);
}

/**
 * ID로 대화 조회 (O(1))
 */
export function getConversationById(id: string): Conversation | undefined {
  return conversationsById.get(id);
}

/**
 * 카테고리 ID로 대화 필터링 (O(1))
 */
export function getConversationsByCategory(categoryId: string): Conversation[] {
  return conversationsByCategory.get(categoryId) || [];
}

/**
 * 대화가 있는 카테고리 ID 목록
 */
export function getCategoriesWithConversations(): string[] {
  return Array.from(conversationsByCategory.keys());
}
