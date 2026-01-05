/**
 * Generate comprehensive geography.json from markdown data
 * Run with: npx tsx scripts/generate-geography.ts
 */

interface GeographyEntry {
  id: string;
  korean: string;
  romanization: string;
  partOfSpeech: 'noun';
  categoryId: 'geography';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  frequency: 'common' | 'frequent' | 'occasional' | 'rare';
  tags: string[];
  translations: {
    ko: {
      word: string;
      explanation: string;
      examples: {
        beginner: string;
        intermediate: string;
        advanced: string;
        master: string;
      };
    };
    en: {
      word: string;
      explanation: string;
      examples: {
        beginner: string;
        intermediate: string;
        advanced: string;
        master: string;
      };
    };
  };
}

// Helper to create kebab-case ID
function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Simple romanization helper (basic)
// Uses hardcoded replacements for common geography terms
function romanize(korean: string): string {
  return korean
    .replace(/태평양/g, 'taepyeongyang')
    .replace(/대서양/g, 'daeseoyang')
    .replace(/인도양/g, 'indoyang')
    .replace(/북극해/g, 'bukgeukhae')
    .replace(/남극해/g, 'namgeukhae')
    .replace(/아시아/g, 'asia')
    .replace(/유럽/g, 'yureop')
    .replace(/아프리카/g, 'apeurika')
    .replace(/오세아니아/g, 'oseania')
    .replace(/호주/g, 'hoju')
    .replace(/남극/g, 'namgeuk')
    .replace(/동해/g, 'donghae')
    .replace(/황해/g, 'hwanghae')
    .replace(/지중해/g, 'jijunghae')
    .replace(/카리브해/g, 'karibeuhae')
    .replace(/흑해/g, 'heukhae')
    .replace(/홍해/g, 'honghae')
    .replace(/발트해/g, 'balteuhae')
    .replace(/북해/g, 'bukhae')
    .replace(/한반도/g, 'hanbando')
    .replace(/히말라야/g, 'himalraya')
    .replace(/알프스/g, 'alpeuseu')
    .replace(/로키/g, 'roki')
    .replace(/안데스/g, 'andeseu')
    .replace(/사하라/g, 'sahara')
    .replace(/고비/g, 'gobi')
    .replace(/아마존/g, 'amazon')
    .replace(/나일/g, 'nail')
    .replace(/한강/g, 'hangang')
    .replace(/그랜드캐니언/g, 'geulaendeukaenieon')
    .replace(/에베레스트/g, 'ebereseuteu')
    .replace(/후지산/g, 'fujisan')
    .replace(/백두산/g, 'baekdusan')
    .replace(/한라산/g, 'hallasan')
    .replace(/제주도/g, 'jejudo')
    .replace(/대한해협/g, 'daehanhyeop')
    .replace(/[가-힣]+/g, (match) => {
      // Fallback: convert each character
      return match
        .split('')
        .map((c) => {
          const code = c.charCodeAt(0) - 0xac00;
          if (code < 0 || code > 11171) return c;
          const cho = Math.floor(code / 588);
          const jung = Math.floor((code % 588) / 28);
          const jong = code % 28;
          const choList = [
            'g',
            'kk',
            'n',
            'd',
            'tt',
            'r',
            'm',
            'b',
            'pp',
            's',
            'ss',
            '',
            'j',
            'jj',
            'ch',
            'k',
            't',
            'p',
            'h',
          ];
          const jungList = [
            'a',
            'ae',
            'ya',
            'yae',
            'eo',
            'e',
            'yeo',
            'ye',
            'o',
            'wa',
            'wae',
            'oe',
            'yo',
            'u',
            'wo',
            'we',
            'wi',
            'yu',
            'eu',
            'ui',
            'i',
          ];
          const jongList = [
            '',
            'k',
            'k',
            'k',
            'n',
            'n',
            'n',
            't',
            'l',
            'l',
            'l',
            'l',
            'l',
            'l',
            'l',
            'l',
            'm',
            'p',
            'p',
            's',
            's',
            'ng',
            't',
            't',
            'k',
            't',
            'p',
            't',
          ];
          return (choList[cho] || '') + (jungList[jung] || '') + (jongList[jong] || '');
        })
        .join('');
    });
}

// Geography data organized by category
const geographyData = {
  // Continents (already have most, adding missing ones)
  continents: [
    {
      en: 'Australia',
      ko: '호주',
      desc_ko: '가장 작은 대륙이자 국가입니다.',
      desc_en: 'The smallest continent and a country.',
    },
    {
      en: 'Antarctica',
      ko: '남극 대륙',
      desc_ko: '지구의 최남단에 있는 얼음으로 덮인 대륙입니다.',
      desc_en: 'The ice-covered continent at the southernmost part of Earth.',
    },
  ],

  // Major Seas - Pacific Region
  seasPacific: [
    {
      en: 'East Sea',
      ko: '동해',
      desc_ko: '한반도 동쪽에 있는 바다입니다.',
      desc_en: 'The sea east of the Korean Peninsula.',
    },
    {
      en: 'Yellow Sea',
      ko: '황해',
      desc_ko: '한반도 서쪽에 있는 바다입니다.',
      desc_en: 'The sea west of the Korean Peninsula.',
    },
    {
      en: 'East China Sea',
      ko: '동중국해',
      desc_ko: '중국 동부와 일본 사이에 있는 바다입니다.',
      desc_en: 'The sea between eastern China and Japan.',
    },
    {
      en: 'South China Sea',
      ko: '남중국해',
      desc_ko: '동남아시아 지역의 바다입니다.',
      desc_en: 'The sea in the Southeast Asian region.',
    },
    {
      en: 'Philippine Sea',
      ko: '필리핀해',
      desc_ko: '필리핀 동쪽에 있는 바다입니다.',
      desc_en: 'The sea east of the Philippines.',
    },
    {
      en: 'Coral Sea',
      ko: '산호해',
      desc_ko: '호주 북동쪽에 있는 바다입니다.',
      desc_en: 'The sea northeast of Australia.',
    },
    {
      en: 'Tasman Sea',
      ko: '태즈먼해',
      desc_ko: '호주와 뉴질랜드 사이에 있는 바다입니다.',
      desc_en: 'The sea between Australia and New Zealand.',
    },
    {
      en: 'Bering Sea',
      ko: '베링해',
      desc_ko: '알래스카와 러시아 사이에 있는 바다입니다.',
      desc_en: 'The sea between Alaska and Russia.',
    },
    {
      en: 'Sea of Okhotsk',
      ko: '오호츠크해',
      desc_ko: '러시아 극동 지역의 바다입니다.',
      desc_en: "The sea in Russia's Far East region.",
    },
  ],

  // Major Seas - Atlantic Region
  seasAtlantic: [
    {
      en: 'Caribbean Sea',
      ko: '카리브해',
      desc_ko: '중앙아메리카 지역의 바다입니다.',
      desc_en: 'The sea in the Central American region.',
    },
    {
      en: 'Gulf of Mexico',
      ko: '멕시코만',
      desc_ko: '북아메리카 남부에 있는 큰 만입니다.',
      desc_en: 'A large gulf in southern North America.',
    },
    {
      en: 'Mediterranean Sea',
      ko: '지중해',
      desc_ko: '유럽과 아프리카 사이에 있는 바다입니다.',
      desc_en: 'The sea between Europe and Africa.',
    },
    {
      en: 'North Sea',
      ko: '북해',
      desc_ko: '북유럽에 있는 바다입니다.',
      desc_en: 'The sea in Northern Europe.',
    },
    {
      en: 'Baltic Sea',
      ko: '발트해',
      desc_ko: '북유럽의 내해입니다.',
      desc_en: 'An inland sea in Northern Europe.',
    },
    {
      en: 'Black Sea',
      ko: '흑해',
      desc_ko: '동유럽의 내해입니다.',
      desc_en: 'An inland sea in Eastern Europe.',
    },
    {
      en: 'Norwegian Sea',
      ko: '노르웨이해',
      desc_ko: '노르웨이 서쪽에 있는 바다입니다.',
      desc_en: 'The sea west of Norway.',
    },
  ],

  // Major Seas - Indian Ocean Region
  seasIndian: [
    {
      en: 'Arabian Sea',
      ko: '아라비아해',
      desc_ko: '인도 서쪽에 있는 바다입니다.',
      desc_en: 'The sea west of India.',
    },
    {
      en: 'Bay of Bengal',
      ko: '벵골만',
      desc_ko: '인도 동쪽에 있는 큰 만입니다.',
      desc_en: 'A large bay east of India.',
    },
    {
      en: 'Red Sea',
      ko: '홍해',
      desc_ko: '아프리카와 아라비아 반도 사이에 있는 바다입니다.',
      desc_en: 'The sea between Africa and the Arabian Peninsula.',
    },
    {
      en: 'Persian Gulf',
      ko: '페르시아만',
      desc_ko: '중동 지역의 만입니다.',
      desc_en: 'A gulf in the Middle East region.',
    },
    {
      en: 'Andaman Sea',
      ko: '안다만해',
      desc_ko: '동남아시아의 바다입니다.',
      desc_en: 'A sea in Southeast Asia.',
    },
    {
      en: 'Java Sea',
      ko: '자바해',
      desc_ko: '인도네시아의 바다입니다.',
      desc_en: 'A sea in Indonesia.',
    },
  ],

  // Arctic Seas
  seasArctic: [
    {
      en: 'Barents Sea',
      ko: '바렌츠해',
      desc_ko: '러시아 북부의 바다입니다.',
      desc_en: 'A sea in northern Russia.',
    },
    {
      en: 'Kara Sea',
      ko: '카라해',
      desc_ko: '시베리아 북부의 바다입니다.',
      desc_en: 'A sea in northern Siberia.',
    },
    {
      en: 'Chukchi Sea',
      ko: '축치해',
      desc_ko: '러시아와 알래스카 북부의 바다입니다.',
      desc_en: 'A sea north of Russia and Alaska.',
    },
    {
      en: 'Beaufort Sea',
      ko: '보퍼트해',
      desc_ko: '캐나다 북부의 바다입니다.',
      desc_en: 'A sea in northern Canada.',
    },
    {
      en: 'Greenland Sea',
      ko: '그린란드해',
      desc_ko: '그린란드 동쪽의 바다입니다.',
      desc_en: 'A sea east of Greenland.',
    },
  ],

  // Straits
  straits: [
    {
      en: 'Korea Strait',
      ko: '대한해협',
      desc_ko: '한국과 일본 사이의 해협입니다.',
      desc_en: 'The strait between Korea and Japan.',
    },
    {
      en: 'Strait of Gibraltar',
      ko: '지브롤터 해협',
      desc_ko: '유럽과 아프리카를 연결하는 해협입니다.',
      desc_en: 'The strait connecting Europe and Africa.',
    },
    {
      en: 'Strait of Malacca',
      ko: '말라카 해협',
      desc_ko: '동남아시아의 주요 해상 항로입니다.',
      desc_en: 'A major shipping route in Southeast Asia.',
    },
    {
      en: 'Bering Strait',
      ko: '베링 해협',
      desc_ko: '아시아와 북아메리카 사이의 해협입니다.',
      desc_en: 'The strait between Asia and North America.',
    },
    {
      en: 'English Channel',
      ko: '영국 해협',
      desc_ko: '영국과 프랑스 사이의 해협입니다.',
      desc_en: 'The strait between England and France.',
    },
    {
      en: 'Strait of Hormuz',
      ko: '호르무즈 해협',
      desc_ko: '페르시아만 입구의 해협입니다.',
      desc_en: 'The strait at the entrance of the Persian Gulf.',
    },
    {
      en: 'Taiwan Strait',
      ko: '대만 해협',
      desc_ko: '중국과 대만 사이의 해협입니다.',
      desc_en: 'The strait between China and Taiwan.',
    },
    {
      en: 'Bosphorus',
      ko: '보스포루스 해협',
      desc_ko: '유럽과 아시아의 경계를 이루는 해협입니다.',
      desc_en: 'The strait forming the boundary between Europe and Asia.',
    },
    {
      en: 'Drake Passage',
      ko: '드레이크 해협',
      desc_ko: '남아메리카와 남극 사이의 해협입니다.',
      desc_en: 'The strait between South America and Antarctica.',
    },
  ],

  // Peninsulas
  peninsulas: [
    {
      en: 'Korean Peninsula',
      ko: '한반도',
      desc_ko: '동북아시아에 있는 반도입니다.',
      desc_en: 'A peninsula in Northeast Asia.',
    },
    {
      en: 'Iberian Peninsula',
      ko: '이베리아 반도',
      desc_ko: '스페인과 포르투갈이 있는 반도입니다.',
      desc_en: 'The peninsula where Spain and Portugal are located.',
    },
    {
      en: 'Italian Peninsula',
      ko: '이탈리아 반도',
      desc_ko: '장화 모양의 반도입니다.',
      desc_en: 'A boot-shaped peninsula.',
    },
    {
      en: 'Balkan Peninsula',
      ko: '발칸 반도',
      desc_ko: '남동유럽의 반도입니다.',
      desc_en: 'A peninsula in Southeastern Europe.',
    },
    {
      en: 'Scandinavian Peninsula',
      ko: '스칸디나비아 반도',
      desc_ko: '북유럽의 반도입니다.',
      desc_en: 'A peninsula in Northern Europe.',
    },
    {
      en: 'Arabian Peninsula',
      ko: '아라비아 반도',
      desc_ko: '세계에서 가장 큰 반도입니다.',
      desc_en: 'The largest peninsula in the world.',
    },
    {
      en: 'Indochina Peninsula',
      ko: '인도차이나 반도',
      desc_ko: '동남아시아의 반도입니다.',
      desc_en: 'A peninsula in Southeast Asia.',
    },
    {
      en: 'Malay Peninsula',
      ko: '말레이 반도',
      desc_ko: '동남아시아 남단의 반도입니다.',
      desc_en: 'A peninsula at the southern end of Southeast Asia.',
    },
    {
      en: 'Kamchatka Peninsula',
      ko: '캄차카 반도',
      desc_ko: '러시아 극동의 반도입니다.',
      desc_en: "A peninsula in Russia's Far East.",
    },
    {
      en: 'Sinai Peninsula',
      ko: '시나이 반도',
      desc_ko: '아시아와 아프리카를 연결하는 반도입니다.',
      desc_en: 'A peninsula connecting Asia and Africa.',
    },
    {
      en: 'Florida Peninsula',
      ko: '플로리다 반도',
      desc_ko: '미국 남동부의 반도입니다.',
      desc_en: 'A peninsula in southeastern United States.',
    },
    {
      en: 'Crimean Peninsula',
      ko: '크림 반도',
      desc_ko: '흑해 북부의 반도입니다.',
      desc_en: 'A peninsula in the northern Black Sea.',
    },
    {
      en: 'Anatolia',
      ko: '아나톨리아 반도',
      desc_ko: '터키 본토를 이루는 반도입니다.',
      desc_en: 'The peninsula that makes up mainland Turkey.',
    },
  ],

  // Major Islands
  islands: [
    {
      en: 'Greenland',
      ko: '그린란드',
      desc_ko: '세계에서 가장 큰 섬입니다.',
      desc_en: 'The largest island in the world.',
    },
    {
      en: 'New Guinea',
      ko: '뉴기니',
      desc_ko: '세계에서 두 번째로 큰 섬입니다.',
      desc_en: 'The second largest island in the world.',
    },
    {
      en: 'Borneo',
      ko: '보르네오',
      desc_ko: '세계에서 세 번째로 큰 섬입니다.',
      desc_en: 'The third largest island in the world.',
    },
    {
      en: 'Madagascar',
      ko: '마다가스카르',
      desc_ko: '아프리카 동쪽에 있는 큰 섬입니다.',
      desc_en: 'A large island east of Africa.',
    },
    {
      en: 'Great Britain',
      ko: '그레이트브리튼',
      desc_ko: '영국의 본섬입니다.',
      desc_en: 'The main island of the United Kingdom.',
    },
    {
      en: 'Honshu',
      ko: '혼슈',
      desc_ko: '일본에서 가장 큰 섬입니다.',
      desc_en: 'The largest island in Japan.',
    },
    {
      en: 'Sumatra',
      ko: '수마트라',
      desc_ko: '인도네시아의 대형 섬입니다.',
      desc_en: 'A large island in Indonesia.',
    },
    {
      en: 'Java',
      ko: '자바',
      desc_ko: '인도네시아의 인구 중심 섬입니다.',
      desc_en: 'The population center island of Indonesia.',
    },
    {
      en: 'Iceland',
      ko: '아이슬란드',
      desc_ko: '북대서양의 섬나라입니다.',
      desc_en: 'An island nation in the North Atlantic.',
    },
    {
      en: 'Cuba',
      ko: '쿠바',
      desc_ko: '카리브해에서 가장 큰 섬입니다.',
      desc_en: 'The largest island in the Caribbean.',
    },
    {
      en: 'Taiwan',
      ko: '대만',
      desc_ko: '동아시아의 섬입니다.',
      desc_en: 'An island in East Asia.',
    },
    {
      en: 'Sri Lanka',
      ko: '스리랑카',
      desc_ko: '인도 남단의 섬입니다.',
      desc_en: 'An island at the southern tip of India.',
    },
    {
      en: 'Jeju Island',
      ko: '제주도',
      desc_ko: '한국에서 가장 큰 섬입니다.',
      desc_en: 'The largest island in Korea.',
    },
    {
      en: 'Sicily',
      ko: '시칠리아',
      desc_ko: '지중해에서 가장 큰 섬입니다.',
      desc_en: 'The largest island in the Mediterranean.',
    },
    {
      en: 'Hokkaido',
      ko: '홋카이도',
      desc_ko: '일본 북부의 섬입니다.',
      desc_en: 'The northern island of Japan.',
    },
    {
      en: 'Tasmania',
      ko: '태즈메이니아',
      desc_ko: '호주 남부의 섬입니다.',
      desc_en: 'An island south of Australia.',
    },
    {
      en: 'Crete',
      ko: '크레타',
      desc_ko: '그리스에서 가장 큰 섬입니다.',
      desc_en: 'The largest island in Greece.',
    },
    {
      en: 'Cyprus',
      ko: '키프로스',
      desc_ko: '지중해 동부의 섬입니다.',
      desc_en: 'An island in the eastern Mediterranean.',
    },
  ],

  // Archipelagos
  archipelagos: [
    {
      en: 'Hawaiian Islands',
      ko: '하와이 제도',
      desc_ko: '태평양 중앙의 군도입니다.',
      desc_en: 'An archipelago in the central Pacific.',
    },
    {
      en: 'Philippine Archipelago',
      ko: '필리핀 군도',
      desc_ko: '7,000여 개의 섬으로 이루어진 군도입니다.',
      desc_en: 'An archipelago consisting of over 7,000 islands.',
    },
    {
      en: 'Indonesian Archipelago',
      ko: '인도네시아 군도',
      desc_ko: '세계에서 가장 큰 군도입니다.',
      desc_en: 'The largest archipelago in the world.',
    },
    {
      en: 'Japanese Archipelago',
      ko: '일본 열도',
      desc_ko: '동아시아의 섬나라입니다.',
      desc_en: 'An island nation in East Asia.',
    },
    {
      en: 'British Isles',
      ko: '영국 제도',
      desc_ko: '북서유럽의 군도입니다.',
      desc_en: 'An archipelago in Northwestern Europe.',
    },
    {
      en: 'Caribbean Islands',
      ko: '카리브 제도',
      desc_ko: '중앙아메리카의 섬들입니다.',
      desc_en: 'Islands in Central America.',
    },
    {
      en: 'Maldives',
      ko: '몰디브',
      desc_ko: '인도양의 산호섬 군도입니다.',
      desc_en: 'A coral island archipelago in the Indian Ocean.',
    },
    {
      en: 'Galapagos Islands',
      ko: '갈라파고스 제도',
      desc_ko: '에콰도르령 태평양 섬입니다.',
      desc_en: 'Ecuadorian Pacific islands.',
    },
    {
      en: 'New Zealand',
      ko: '뉴질랜드',
      desc_ko: '남태평양의 섬나라입니다.',
      desc_en: 'An island nation in the South Pacific.',
    },
    {
      en: 'Canary Islands',
      ko: '카나리아 제도',
      desc_ko: '스페인령 대서양 섬입니다.',
      desc_en: 'Spanish Atlantic islands.',
    },
  ],

  // Mountain Ranges
  mountainRanges: [
    {
      en: 'Himalayas',
      ko: '히말라야 산맥',
      desc_ko: '세계에서 가장 높은 산맥입니다.',
      desc_en: 'The highest mountain range in the world.',
    },
    {
      en: 'Andes',
      ko: '안데스 산맥',
      desc_ko: '세계에서 가장 긴 산맥입니다.',
      desc_en: 'The longest mountain range in the world.',
    },
    {
      en: 'Rocky Mountains',
      ko: '로키 산맥',
      desc_ko: '북미 서부의 산맥입니다.',
      desc_en: 'A mountain range in western North America.',
    },
    {
      en: 'Alps',
      ko: '알프스 산맥',
      desc_ko: '유럽 중앙의 산맥입니다.',
      desc_en: 'A mountain range in central Europe.',
    },
    {
      en: 'Ural Mountains',
      ko: '우랄 산맥',
      desc_ko: '유럽과 아시아의 경계를 이루는 산맥입니다.',
      desc_en: 'A mountain range forming the boundary between Europe and Asia.',
    },
    {
      en: 'Carpathian Mountains',
      ko: '카르파티아 산맥',
      desc_ko: '동유럽의 산맥입니다.',
      desc_en: 'A mountain range in Eastern Europe.',
    },
    {
      en: 'Pyrenees',
      ko: '피레네 산맥',
      desc_ko: '프랑스와 스페인 경계의 산맥입니다.',
      desc_en: 'A mountain range on the France-Spain border.',
    },
    {
      en: 'Caucasus Mountains',
      ko: '캅카스 산맥',
      desc_ko: '유럽과 아시아 경계의 산맥입니다.',
      desc_en: 'A mountain range on the Europe-Asia border.',
    },
    {
      en: 'Atlas Mountains',
      ko: '아틀라스 산맥',
      desc_ko: '북아프리카의 산맥입니다.',
      desc_en: 'A mountain range in North Africa.',
    },
    {
      en: 'Appalachian Mountains',
      ko: '애팔래치아 산맥',
      desc_ko: '북미 동부의 산맥입니다.',
      desc_en: 'A mountain range in eastern North America.',
    },
    {
      en: 'Altai Mountains',
      ko: '알타이 산맥',
      desc_ko: '중앙아시아의 산맥입니다.',
      desc_en: 'A mountain range in Central Asia.',
    },
    {
      en: 'Tian Shan',
      ko: '톈산 산맥',
      desc_ko: '중앙아시아의 산맥입니다.',
      desc_en: 'A mountain range in Central Asia.',
    },
    {
      en: 'Hindu Kush',
      ko: '힌두쿠시 산맥',
      desc_ko: '아프가니스탄의 산맥입니다.',
      desc_en: 'A mountain range in Afghanistan.',
    },
    {
      en: 'Karakoram',
      ko: '카라코람 산맥',
      desc_ko: '히말라야 서부의 산맥입니다.',
      desc_en: 'A mountain range west of the Himalayas.',
    },
    {
      en: 'Sierra Nevada',
      ko: '시에라네바다 산맥',
      desc_ko: '미국 캘리포니아의 산맥입니다.',
      desc_en: 'A mountain range in California, USA.',
    },
    {
      en: 'Taebaek Mountains',
      ko: '태백산맥',
      desc_ko: '한반도 동부의 산맥입니다.',
      desc_en: 'A mountain range in eastern Korean Peninsula.',
    },
  ],

  // Major Mountains
  mountains: [
    {
      en: 'Mount Everest',
      ko: '에베레스트 산',
      desc_ko: '세계에서 가장 높은 산입니다 (8,849m).',
      desc_en: 'The highest mountain in the world (8,849m).',
    },
    {
      en: 'K2',
      ko: 'K2',
      desc_ko: '세계에서 두 번째로 높은 산입니다 (8,611m).',
      desc_en: 'The second highest mountain in the world (8,611m).',
    },
    {
      en: 'Mont Blanc',
      ko: '몽블랑',
      desc_ko: '알프스의 최고봉입니다.',
      desc_en: 'The highest peak in the Alps.',
    },
    {
      en: 'Mount Kilimanjaro',
      ko: '킬리만자로 산',
      desc_ko: '아프리카의 최고봉입니다.',
      desc_en: 'The highest peak in Africa.',
    },
    {
      en: 'Mount Fuji',
      ko: '후지산',
      desc_ko: '일본의 최고봉입니다.',
      desc_en: 'The highest peak in Japan.',
    },
    {
      en: 'Denali',
      ko: '데날리',
      desc_ko: '북미의 최고봉입니다.',
      desc_en: 'The highest peak in North America.',
    },
    {
      en: 'Aconcagua',
      ko: '아콩카과',
      desc_ko: '남미의 최고봉입니다.',
      desc_en: 'The highest peak in South America.',
    },
    {
      en: 'Mount Elbrus',
      ko: '엘브루스 산',
      desc_ko: '유럽의 최고봉입니다.',
      desc_en: 'The highest peak in Europe.',
    },
    {
      en: 'Matterhorn',
      ko: '마터호른',
      desc_ko: '알프스의 상징적인 봉우리입니다.',
      desc_en: 'An iconic peak in the Alps.',
    },
    {
      en: 'Mount Vesuvius',
      ko: '베수비오 산',
      desc_ko: '이탈리아의 활화산입니다.',
      desc_en: 'An active volcano in Italy.',
    },
    {
      en: 'Mount Etna',
      ko: '에트나 산',
      desc_ko: '유럽 최대의 활화산입니다.',
      desc_en: 'The largest active volcano in Europe.',
    },
    {
      en: 'Mauna Kea',
      ko: '마우나케아',
      desc_ko: '하와이의 최고봉입니다.',
      desc_en: 'The highest peak in Hawaii.',
    },
    {
      en: 'Hallasan',
      ko: '한라산',
      desc_ko: '한국의 최고봉입니다.',
      desc_en: 'The highest peak in South Korea.',
    },
    {
      en: 'Baekdusan',
      ko: '백두산',
      desc_ko: '한반도의 최고봉입니다.',
      desc_en: 'The highest peak on the Korean Peninsula.',
    },
  ],

  // Deserts
  deserts: [
    {
      en: 'Sahara Desert',
      ko: '사하라 사막',
      desc_ko: '세계에서 가장 큰 열사막입니다.',
      desc_en: 'The largest hot desert in the world.',
    },
    {
      en: 'Arabian Desert',
      ko: '아라비아 사막',
      desc_ko: '아라비아 반도의 사막입니다.',
      desc_en: 'The desert on the Arabian Peninsula.',
    },
    {
      en: 'Gobi Desert',
      ko: '고비 사막',
      desc_ko: '동아시아의 사막입니다.',
      desc_en: 'A desert in East Asia.',
    },
    {
      en: 'Kalahari Desert',
      ko: '칼라하리 사막',
      desc_ko: '남아프리카의 사막입니다.',
      desc_en: 'A desert in Southern Africa.',
    },
    {
      en: 'Atacama Desert',
      ko: '아타카마 사막',
      desc_ko: '세계에서 가장 건조한 사막입니다.',
      desc_en: 'The driest desert in the world.',
    },
    {
      en: 'Mojave Desert',
      ko: '모하비 사막',
      desc_ko: '미국 캘리포니아의 사막입니다.',
      desc_en: 'A desert in California, USA.',
    },
    {
      en: 'Sonoran Desert',
      ko: '소노란 사막',
      desc_ko: '미국과 멕시코의 사막입니다.',
      desc_en: 'A desert in USA and Mexico.',
    },
    {
      en: 'Taklamakan Desert',
      ko: '타클라마칸 사막',
      desc_ko: '중국 서부의 사막입니다.',
      desc_en: 'A desert in western China.',
    },
    {
      en: 'Thar Desert',
      ko: '타르 사막',
      desc_ko: '인도와 파키스탄의 사막입니다.',
      desc_en: 'A desert in India and Pakistan.',
    },
    {
      en: 'Antarctic Desert',
      ko: '남극 사막',
      desc_ko: '세계에서 가장 큰 한랭 사막입니다.',
      desc_en: 'The largest cold desert in the world.',
    },
  ],

  // Major Rivers
  rivers: [
    {
      en: 'Nile River',
      ko: '나일강',
      desc_ko: '세계에서 가장 긴 강입니다.',
      desc_en: 'The longest river in the world.',
    },
    {
      en: 'Amazon River',
      ko: '아마존강',
      desc_ko: '세계에서 가장 많은 물이 흐르는 강입니다.',
      desc_en: 'The river with the largest flow in the world.',
    },
    {
      en: 'Yangtze River',
      ko: '양쯔강',
      desc_ko: '아시아에서 가장 긴 강입니다.',
      desc_en: 'The longest river in Asia.',
    },
    {
      en: 'Yellow River',
      ko: '황허강',
      desc_ko: '중국 문명의 발상지입니다.',
      desc_en: 'The birthplace of Chinese civilization.',
    },
    {
      en: 'Mississippi River',
      ko: '미시시피강',
      desc_ko: '북미에서 가장 긴 강입니다.',
      desc_en: 'The longest river in North America.',
    },
    {
      en: 'Ganges River',
      ko: '갠지스강',
      desc_ko: '인도의 성스러운 강입니다.',
      desc_en: 'A sacred river in India.',
    },
    {
      en: 'Mekong River',
      ko: '메콩강',
      desc_ko: '동남아시아의 대하천입니다.',
      desc_en: 'A major river in Southeast Asia.',
    },
    {
      en: 'Danube River',
      ko: '다뉴브강',
      desc_ko: '유럽에서 두 번째로 긴 강입니다.',
      desc_en: 'The second longest river in Europe.',
    },
    {
      en: 'Volga River',
      ko: '볼가강',
      desc_ko: '유럽에서 가장 긴 강입니다.',
      desc_en: 'The longest river in Europe.',
    },
    {
      en: 'Rhine River',
      ko: '라인강',
      desc_ko: '서유럽의 주요 강입니다.',
      desc_en: 'A major river in Western Europe.',
    },
    {
      en: 'Congo River',
      ko: '콩고강',
      desc_ko: '아프리카에서 두 번째로 긴 강입니다.',
      desc_en: 'The second longest river in Africa.',
    },
    {
      en: 'Indus River',
      ko: '인더스강',
      desc_ko: '파키스탄의 주요 강입니다.',
      desc_en: 'A major river in Pakistan.',
    },
    {
      en: 'Han River',
      ko: '한강',
      desc_ko: '서울을 관통하는 강입니다.',
      desc_en: 'A river flowing through Seoul.',
    },
    {
      en: 'Nakdong River',
      ko: '낙동강',
      desc_ko: '한국 남동부의 강입니다.',
      desc_en: 'A river in southeastern Korea.',
    },
    {
      en: 'Thames River',
      ko: '템스강',
      desc_ko: '런던을 관통하는 강입니다.',
      desc_en: 'A river flowing through London.',
    },
    {
      en: 'Seine River',
      ko: '센강',
      desc_ko: '파리를 관통하는 강입니다.',
      desc_en: 'A river flowing through Paris.',
    },
  ],

  // Major Lakes
  lakes: [
    {
      en: 'Caspian Sea',
      ko: '카스피해',
      desc_ko: '세계에서 가장 큰 호수입니다.',
      desc_en: 'The largest lake in the world.',
    },
    {
      en: 'Lake Superior',
      ko: '슈피리어호',
      desc_ko: '면적 기준 가장 큰 담수호입니다.',
      desc_en: 'The largest freshwater lake by area.',
    },
    {
      en: 'Lake Victoria',
      ko: '빅토리아호',
      desc_ko: '아프리카에서 가장 큰 호수입니다.',
      desc_en: 'The largest lake in Africa.',
    },
    {
      en: 'Lake Baikal',
      ko: '바이칼호',
      desc_ko: '세계에서 가장 깊은 호수입니다.',
      desc_en: 'The deepest lake in the world.',
    },
    {
      en: 'Lake Tanganyika',
      ko: '탕가니카호',
      desc_ko: '세계에서 가장 긴 호수입니다.',
      desc_en: 'The longest lake in the world.',
    },
    {
      en: 'Lake Michigan',
      ko: '미시간호',
      desc_ko: '오대호 중 하나입니다.',
      desc_en: 'One of the Great Lakes.',
    },
    {
      en: 'Lake Huron',
      ko: '휴런호',
      desc_ko: '오대호 중 하나입니다.',
      desc_en: 'One of the Great Lakes.',
    },
    {
      en: 'Lake Erie',
      ko: '이리호',
      desc_ko: '오대호 중 하나입니다.',
      desc_en: 'One of the Great Lakes.',
    },
    {
      en: 'Lake Ontario',
      ko: '온타리오호',
      desc_ko: '오대호 중 하나입니다.',
      desc_en: 'One of the Great Lakes.',
    },
    {
      en: 'Lake Titicaca',
      ko: '티티카카호',
      desc_ko: '세계에서 가장 높은 항행 가능 호수입니다.',
      desc_en: 'The highest navigable lake in the world.',
    },
    {
      en: 'Dead Sea',
      ko: '사해',
      desc_ko: '세계에서 가장 낮은 호수입니다.',
      desc_en: 'The lowest lake in the world.',
    },
    {
      en: 'Lake Geneva',
      ko: '제네바호',
      desc_ko: '스위스와 프랑스의 호수입니다.',
      desc_en: 'A lake between Switzerland and France.',
    },
    {
      en: 'Loch Ness',
      ko: '네스호',
      desc_ko: '스코틀랜드의 유명한 호수입니다.',
      desc_en: 'A famous lake in Scotland.',
    },
  ],

  // Waterfalls
  waterfalls: [
    {
      en: 'Niagara Falls',
      ko: '나이아가라 폭포',
      desc_ko: '북미를 대표하는 폭포입니다.',
      desc_en: 'A representative waterfall of North America.',
    },
    {
      en: 'Victoria Falls',
      ko: '빅토리아 폭포',
      desc_ko: '아프리카의 대폭포입니다.',
      desc_en: 'A great waterfall in Africa.',
    },
    {
      en: 'Angel Falls',
      ko: '앙헬 폭포',
      desc_ko: '세계에서 낙차가 가장 큰 폭포입니다.',
      desc_en: 'The waterfall with the highest drop in the world.',
    },
    {
      en: 'Iguazu Falls',
      ko: '이구아수 폭포',
      desc_ko: '남미의 대폭포입니다.',
      desc_en: 'A great waterfall in South America.',
    },
    {
      en: 'Yosemite Falls',
      ko: '요세미티 폭포',
      desc_ko: '미국을 대표하는 폭포입니다.',
      desc_en: 'A representative waterfall of the United States.',
    },
  ],

  // Plains and Plateaus
  plainsPlateaus: [
    {
      en: 'Tibetan Plateau',
      ko: '티베트 고원',
      desc_ko: '세계의 지붕이라 불리는 고원입니다.',
      desc_en: 'A plateau called the Roof of the World.',
    },
    {
      en: 'Great Plains',
      ko: '그레이트플레인스',
      desc_ko: '북미의 대평원입니다.',
      desc_en: 'The great plains of North America.',
    },
    {
      en: 'Siberian Plain',
      ko: '서시베리아 평원',
      desc_ko: '세계에서 가장 큰 평원입니다.',
      desc_en: 'The largest plain in the world.',
    },
    {
      en: 'Pampas',
      ko: '팜파스',
      desc_ko: '아르헨티나의 초원입니다.',
      desc_en: 'The grasslands of Argentina.',
    },
    {
      en: 'Savanna',
      ko: '사바나',
      desc_ko: '열대 초원 지대입니다.',
      desc_en: 'Tropical grassland region.',
    },
    {
      en: 'Steppe',
      ko: '스텝',
      desc_ko: '중앙아시아의 초원입니다.',
      desc_en: 'The grasslands of Central Asia.',
    },
    {
      en: 'Tundra',
      ko: '툰드라',
      desc_ko: '극지의 동토 지대입니다.',
      desc_en: 'Arctic permafrost region.',
    },
    {
      en: 'Taiga',
      ko: '타이가',
      desc_ko: '북방의 침엽수림입니다.',
      desc_en: 'Northern coniferous forest.',
    },
    {
      en: 'Deccan Plateau',
      ko: '데칸 고원',
      desc_ko: '인도 남부의 고원입니다.',
      desc_en: 'A plateau in southern India.',
    },
    {
      en: 'Colorado Plateau',
      ko: '콜로라도 고원',
      desc_ko: '미국 서부의 고원입니다.',
      desc_en: 'A plateau in western USA.',
    },
  ],

  // Canyons and Valleys
  canyonsValleys: [
    {
      en: 'Grand Canyon',
      ko: '그랜드캐니언',
      desc_ko: '미국의 대협곡입니다.',
      desc_en: 'A great canyon in the USA.',
    },
    {
      en: 'Great Rift Valley',
      ko: '그레이트 리프트 밸리',
      desc_ko: '동아프리카의 열곡대입니다.',
      desc_en: 'The rift valley in East Africa.',
    },
    {
      en: 'Death Valley',
      ko: '데스밸리',
      desc_ko: '미국에서 가장 낮은 지점입니다.',
      desc_en: 'The lowest point in the USA.',
    },
    {
      en: 'Nile Valley',
      ko: '나일 계곡',
      desc_ko: '이집트 문명의 발상지입니다.',
      desc_en: 'The birthplace of Egyptian civilization.',
    },
    {
      en: 'Silicon Valley',
      ko: '실리콘밸리',
      desc_ko: '미국의 IT 중심지입니다.',
      desc_en: 'The IT center of the USA.',
    },
  ],

  // Capes
  capes: [
    {
      en: 'Cape of Good Hope',
      ko: '희망봉',
      desc_ko: '아프리카 남단의 곶입니다.',
      desc_en: 'A cape at the southern tip of Africa.',
    },
    {
      en: 'Cape Horn',
      ko: '혼곶',
      desc_ko: '남미 최남단의 곶입니다.',
      desc_en: 'A cape at the southernmost tip of South America.',
    },
  ],

  // General Geography Terms
  terms: [
    { en: 'continent', ko: '대륙', desc_ko: '대규모의 육지입니다.', desc_en: 'A large landmass.' },
    { en: 'ocean', ko: '대양', desc_ko: '대규모의 바다입니다.', desc_en: 'A large body of water.' },
    {
      en: 'sea',
      ko: '바다',
      desc_ko: '대양보다 작은 수역입니다.',
      desc_en: 'A body of water smaller than an ocean.',
    },
    {
      en: 'island',
      ko: '섬',
      desc_ko: '물에 둘러싸인 육지입니다.',
      desc_en: 'Land surrounded by water.',
    },
    {
      en: 'peninsula',
      ko: '반도',
      desc_ko: '삼면이 물인 육지입니다.',
      desc_en: 'Land with water on three sides.',
    },
    {
      en: 'strait',
      ko: '해협',
      desc_ko: '두 수역을 연결하는 좁은 수로입니다.',
      desc_en: 'A narrow waterway connecting two bodies of water.',
    },
    {
      en: 'gulf',
      ko: '만',
      desc_ko: '육지로 들어간 바다입니다.',
      desc_en: 'A body of water extending into land.',
    },
    { en: 'bay', ko: '만', desc_ko: '작은 만입니다.', desc_en: 'A small gulf.' },
    {
      en: 'cape',
      ko: '곶',
      desc_ko: '바다로 돌출한 육지입니다.',
      desc_en: 'Land projecting into the sea.',
    },
    { en: 'mountain', ko: '산', desc_ko: '높이 솟은 지형입니다.', desc_en: 'Elevated terrain.' },
    {
      en: 'volcano',
      ko: '화산',
      desc_ko: '마그마가 분출하는 산입니다.',
      desc_en: 'A mountain that erupts magma.',
    },
    {
      en: 'valley',
      ko: '계곡',
      desc_ko: '산 사이의 낮은 지형입니다.',
      desc_en: 'Low terrain between mountains.',
    },
    { en: 'canyon', ko: '협곡', desc_ko: '깊은 계곡입니다.', desc_en: 'A deep valley.' },
    {
      en: 'plateau',
      ko: '고원',
      desc_ko: '높고 평탄한 지형입니다.',
      desc_en: 'High and flat terrain.',
    },
    {
      en: 'plain',
      ko: '평원',
      desc_ko: '넓고 평탄한 지형입니다.',
      desc_en: 'Wide and flat terrain.',
    },
    { en: 'desert', ko: '사막', desc_ko: '건조한 지역입니다.', desc_en: 'An arid region.' },
    { en: 'glacier', ko: '빙하', desc_ko: '얼음 덩어리입니다.', desc_en: 'A mass of ice.' },
    { en: 'river', ko: '강', desc_ko: '흐르는 물입니다.', desc_en: 'Flowing water.' },
    { en: 'lake', ko: '호수', desc_ko: '육지 내의 물입니다.', desc_en: 'Water within land.' },
    {
      en: 'waterfall',
      ko: '폭포',
      desc_ko: '물이 떨어지는 곳입니다.',
      desc_en: 'Where water falls.',
    },
    {
      en: 'delta',
      ko: '삼각주',
      desc_ko: '하구의 퇴적 지형입니다.',
      desc_en: 'Sediment formation at a river mouth.',
    },
    {
      en: 'reef',
      ko: '암초',
      desc_ko: '수중의 암석 지형입니다.',
      desc_en: 'Underwater rock formation.',
    },
    {
      en: 'coral reef',
      ko: '산호초',
      desc_ko: '산호가 형성한 암초입니다.',
      desc_en: 'Reef formed by coral.',
    },
    {
      en: 'archipelago',
      ko: '군도',
      desc_ko: '섬의 집합체입니다.',
      desc_en: 'A group of islands.',
    },
    {
      en: 'equator',
      ko: '적도',
      desc_ko: '지구의 중앙선입니다.',
      desc_en: 'The central line of Earth.',
    },
    { en: 'latitude', ko: '위도', desc_ko: '남북 위치입니다.', desc_en: 'North-south position.' },
    { en: 'longitude', ko: '경도', desc_ko: '동서 위치입니다.', desc_en: 'East-west position.' },
    { en: 'hemisphere', ko: '반구', desc_ko: '지구의 절반입니다.', desc_en: 'Half of Earth.' },
    {
      en: 'North Pole',
      ko: '북극',
      desc_ko: '지구의 최북단입니다.',
      desc_en: 'The northernmost point of Earth.',
    },
    {
      en: 'South Pole',
      ko: '남극',
      desc_ko: '지구의 최남단입니다.',
      desc_en: 'The southernmost point of Earth.',
    },
    {
      en: 'climate',
      ko: '기후',
      desc_ko: '장기적인 날씨 패턴입니다.',
      desc_en: 'Long-term weather pattern.',
    },
    { en: 'monsoon', ko: '몬순', desc_ko: '계절풍입니다.', desc_en: 'Seasonal wind.' },
    {
      en: 'typhoon',
      ko: '태풍',
      desc_ko: '서태평양의 열대폭풍입니다.',
      desc_en: 'Tropical storm in the western Pacific.',
    },
    {
      en: 'hurricane',
      ko: '허리케인',
      desc_ko: '대서양의 열대폭풍입니다.',
      desc_en: 'Tropical storm in the Atlantic.',
    },
    {
      en: 'earthquake',
      ko: '지진',
      desc_ko: '땅의 흔들림입니다.',
      desc_en: 'Shaking of the ground.',
    },
    { en: 'tsunami', ko: '쓰나미', desc_ko: '지진 해일입니다.', desc_en: 'Seismic sea wave.' },
  ],

  // Regional Divisions
  regions: [
    {
      en: 'East Asia',
      ko: '동아시아',
      desc_ko: '한국, 중국, 일본 등의 지역입니다.',
      desc_en: 'The region including Korea, China, and Japan.',
    },
    {
      en: 'Southeast Asia',
      ko: '동남아시아',
      desc_ko: '베트남, 태국 등의 지역입니다.',
      desc_en: 'The region including Vietnam and Thailand.',
    },
    {
      en: 'South Asia',
      ko: '남아시아',
      desc_ko: '인도, 파키스탄 등의 지역입니다.',
      desc_en: 'The region including India and Pakistan.',
    },
    {
      en: 'Central Asia',
      ko: '중앙아시아',
      desc_ko: '카자흐스탄 등의 지역입니다.',
      desc_en: 'The region including Kazakhstan.',
    },
    {
      en: 'Middle East',
      ko: '중동',
      desc_ko: '서아시아와 북아프리카 지역입니다.',
      desc_en: 'The West Asian and North African region.',
    },
    {
      en: 'Western Europe',
      ko: '서유럽',
      desc_ko: '프랑스, 독일 등의 지역입니다.',
      desc_en: 'The region including France and Germany.',
    },
    {
      en: 'Eastern Europe',
      ko: '동유럽',
      desc_ko: '폴란드, 러시아 등의 지역입니다.',
      desc_en: 'The region including Poland and Russia.',
    },
    {
      en: 'Northern Europe',
      ko: '북유럽',
      desc_ko: '스칸디나비아 등의 지역입니다.',
      desc_en: 'The region including Scandinavia.',
    },
    {
      en: 'Southern Europe',
      ko: '남유럽',
      desc_ko: '이탈리아, 스페인 등의 지역입니다.',
      desc_en: 'The region including Italy and Spain.',
    },
    {
      en: 'North Africa',
      ko: '북아프리카',
      desc_ko: '이집트, 모로코 등의 지역입니다.',
      desc_en: 'The region including Egypt and Morocco.',
    },
    {
      en: 'Sub-Saharan Africa',
      ko: '사하라 이남 아프리카',
      desc_ko: '사하라 사막 남쪽 지역입니다.',
      desc_en: 'The region south of the Sahara Desert.',
    },
    {
      en: 'Caribbean',
      ko: '카리브',
      desc_ko: '카리브해 지역입니다.',
      desc_en: 'The Caribbean region.',
    },
    {
      en: 'Central America',
      ko: '중앙아메리카',
      desc_ko: '멕시코와 콜롬비아 사이 지역입니다.',
      desc_en: 'The region between Mexico and Colombia.',
    },
    {
      en: 'Latin America',
      ko: '라틴아메리카',
      desc_ko: '스페인어/포르투갈어권 아메리카입니다.',
      desc_en: 'Spanish/Portuguese-speaking Americas.',
    },
    {
      en: 'Polynesia',
      ko: '폴리네시아',
      desc_ko: '태평양 동부의 섬들입니다.',
      desc_en: 'Islands in the eastern Pacific.',
    },
    {
      en: 'Melanesia',
      ko: '멜라네시아',
      desc_ko: '태평양 서부의 섬들입니다.',
      desc_en: 'Islands in the western Pacific.',
    },
    {
      en: 'Micronesia',
      ko: '미크로네시아',
      desc_ko: '태평양 서부의 작은 섬들입니다.',
      desc_en: 'Small islands in the western Pacific.',
    },
  ],
};

// Generate examples for each entry
function generateExamples(
  ko: string,
  en: string,
  tag: string,
): {
  ko: GeographyEntry['translations']['ko']['examples'];
  en: GeographyEntry['translations']['en']['examples'];
} {
  const templates = {
    ocean: {
      ko: {
        beginner: `${ko}은 넓습니다.`,
        intermediate: `${ko}에 많은 배가 다닙니다.`,
        advanced: `${ko}은 세계 해양 생태계에 중요한 역할을 합니다.`,
        master: `${ko}의 해류는 전 세계 기후에 영향을 미칩니다.`,
      },
      en: {
        beginner: `The ${en} is vast.`,
        intermediate: `Many ships sail across the ${en}.`,
        advanced: `The ${en} plays an important role in the global marine ecosystem.`,
        master: `The currents of the ${en} affect the climate worldwide.`,
      },
    },
    sea: {
      ko: {
        beginner: `${ko}은 아름답습니다.`,
        intermediate: `${ko}에서 많은 물고기가 잡힙니다.`,
        advanced: `${ko}은 주변 국가들의 주요 항로입니다.`,
        master: `${ko}의 생태계는 지역 경제에 큰 영향을 미칩니다.`,
      },
      en: {
        beginner: `The ${en} is beautiful.`,
        intermediate: `Many fish are caught in the ${en}.`,
        advanced: `The ${en} is a major shipping route for surrounding countries.`,
        master: `The ecosystem of the ${en} greatly affects the regional economy.`,
      },
    },
    continent: {
      ko: {
        beginner: `${ko}은 큽니다.`,
        intermediate: `${ko}에는 많은 나라가 있습니다.`,
        advanced: `${ko}에는 다양한 문화가 공존합니다.`,
        master: `${ko}의 역사와 문화는 세계에 큰 영향을 미쳤습니다.`,
      },
      en: {
        beginner: `${en} is large.`,
        intermediate: `There are many countries in ${en}.`,
        advanced: `Various cultures coexist in ${en}.`,
        master: `The history and culture of ${en} have greatly influenced the world.`,
      },
    },
    strait: {
      ko: {
        beginner: `${ko}은 좁습니다.`,
        intermediate: `${ko}을 통해 배가 지나갑니다.`,
        advanced: `${ko}은 중요한 해상 교통로입니다.`,
        master: `${ko}의 전략적 중요성은 역사적으로 많은 분쟁의 원인이 되었습니다.`,
      },
      en: {
        beginner: `The ${en} is narrow.`,
        intermediate: `Ships pass through the ${en}.`,
        advanced: `The ${en} is an important maritime route.`,
        master: `The strategic importance of the ${en} has historically been a cause of many conflicts.`,
      },
    },
    peninsula: {
      ko: {
        beginner: `${ko}은 삼면이 바다입니다.`,
        intermediate: `${ko}에는 독특한 문화가 있습니다.`,
        advanced: `${ko}의 지정학적 위치는 역사에 큰 영향을 미쳤습니다.`,
        master: `${ko}은 해양 문화와 대륙 문화가 만나는 지점입니다.`,
      },
      en: {
        beginner: `${en} is surrounded by sea on three sides.`,
        intermediate: `${en} has a unique culture.`,
        advanced: `The geopolitical location of ${en} has greatly influenced history.`,
        master: `${en} is a meeting point of maritime and continental cultures.`,
      },
    },
    island: {
      ko: {
        beginner: `${ko}은 아름다운 섬입니다.`,
        intermediate: `${ko}에 많은 관광객이 방문합니다.`,
        advanced: `${ko}은 독특한 생태계를 가지고 있습니다.`,
        master: `${ko}의 고립된 환경은 독특한 종의 진화를 이끌었습니다.`,
      },
      en: {
        beginner: `${en} is a beautiful island.`,
        intermediate: `Many tourists visit ${en}.`,
        advanced: `${en} has a unique ecosystem.`,
        master: `The isolated environment of ${en} has led to the evolution of unique species.`,
      },
    },
    archipelago: {
      ko: {
        beginner: `${ko}에는 많은 섬이 있습니다.`,
        intermediate: `${ko}은 관광지로 유명합니다.`,
        advanced: `${ko}은 다양한 해양 생물의 서식지입니다.`,
        master: `${ko}의 섬들은 각각 고유한 문화와 생태계를 발전시켜 왔습니다.`,
      },
      en: {
        beginner: `There are many islands in ${en}.`,
        intermediate: `${en} is famous as a tourist destination.`,
        advanced: `${en} is home to various marine life.`,
        master: `Each island in ${en} has developed its own unique culture and ecosystem.`,
      },
    },
    mountain: {
      ko: {
        beginner: `${ko}은 높습니다.`,
        intermediate: `많은 등산객이 ${ko}을 찾습니다.`,
        advanced: `${ko}은 중요한 수원지입니다.`,
        master: `${ko}의 형성은 지질학적으로 중요한 의미를 가집니다.`,
      },
      en: {
        beginner: `${en} is high.`,
        intermediate: `Many hikers visit ${en}.`,
        advanced: `${en} is an important water source.`,
        master: `The formation of ${en} has significant geological importance.`,
      },
    },
    mountainRange: {
      ko: {
        beginner: `${ko}은 길게 뻗어 있습니다.`,
        intermediate: `${ko}에는 많은 높은 봉우리가 있습니다.`,
        advanced: `${ko}은 주변 지역의 기후에 큰 영향을 미칩니다.`,
        master: `${ko}의 형성은 대륙의 지질학적 역사를 보여줍니다.`,
      },
      en: {
        beginner: `${en} stretches far.`,
        intermediate: `${en} has many high peaks.`,
        advanced: `${en} greatly affects the climate of surrounding areas.`,
        master: `The formation of ${en} shows the geological history of the continent.`,
      },
    },
    desert: {
      ko: {
        beginner: `${ko}은 매우 건조합니다.`,
        intermediate: `${ko}에서는 물이 매우 귀합니다.`,
        advanced: `${ko}의 생태계는 극한 환경에 적응해 있습니다.`,
        master: `${ko}의 확장은 기후 변화의 중요한 지표입니다.`,
      },
      en: {
        beginner: `${en} is very dry.`,
        intermediate: `Water is very precious in ${en}.`,
        advanced: `The ecosystem of ${en} is adapted to extreme conditions.`,
        master: `The expansion of ${en} is an important indicator of climate change.`,
      },
    },
    river: {
      ko: {
        beginner: `${ko}은 길게 흐릅니다.`,
        intermediate: `${ko} 주변에 많은 도시가 있습니다.`,
        advanced: `${ko}은 지역 경제에 중요한 역할을 합니다.`,
        master: `${ko}의 유역은 고대 문명의 발상지입니다.`,
      },
      en: {
        beginner: `${en} flows long.`,
        intermediate: `Many cities are located along ${en}.`,
        advanced: `${en} plays an important role in the regional economy.`,
        master: `The basin of ${en} is the birthplace of ancient civilizations.`,
      },
    },
    lake: {
      ko: {
        beginner: `${ko}은 물이 맑습니다.`,
        intermediate: `${ko} 주변은 관광지입니다.`,
        advanced: `${ko}은 담수 생태계의 보고입니다.`,
        master: `${ko}의 수질 변화는 환경 오염의 지표가 됩니다.`,
      },
      en: {
        beginner: `${en} has clear water.`,
        intermediate: `The area around ${en} is a tourist destination.`,
        advanced: `${en} is a treasure trove of freshwater ecosystems.`,
        master: `Changes in water quality of ${en} are indicators of environmental pollution.`,
      },
    },
    waterfall: {
      ko: {
        beginner: `${ko}은 아름답습니다.`,
        intermediate: `${ko}에서 물이 쏟아집니다.`,
        advanced: `${ko}은 세계적인 관광 명소입니다.`,
        master: `${ko}의 형성 과정은 지질학적으로 흥미로운 연구 대상입니다.`,
      },
      en: {
        beginner: `${en} is beautiful.`,
        intermediate: `Water pours down at ${en}.`,
        advanced: `${en} is a world-famous tourist attraction.`,
        master: `The formation process of ${en} is a geologically interesting subject of study.`,
      },
    },
    plateau: {
      ko: {
        beginner: `${ko}은 높고 평평합니다.`,
        intermediate: `${ko}에는 독특한 생태계가 있습니다.`,
        advanced: `${ko}의 기후는 주변 저지대와 다릅니다.`,
        master: `${ko}의 지질학적 형성 과정은 대륙의 역사를 보여줍니다.`,
      },
      en: {
        beginner: `${en} is high and flat.`,
        intermediate: `${en} has a unique ecosystem.`,
        advanced: `The climate of ${en} differs from surrounding lowlands.`,
        master: `The geological formation of ${en} shows the history of the continent.`,
      },
    },
    plain: {
      ko: {
        beginner: `${ko}은 넓고 평평합니다.`,
        intermediate: `${ko}은 농업에 적합합니다.`,
        advanced: `${ko}은 주요 농업 지대입니다.`,
        master: `${ko}의 형성은 빙하기 퇴적 작용의 결과입니다.`,
      },
      en: {
        beginner: `${en} is wide and flat.`,
        intermediate: `${en} is suitable for agriculture.`,
        advanced: `${en} is a major agricultural area.`,
        master: `The formation of ${en} is the result of glacial sedimentation.`,
      },
    },
    canyon: {
      ko: {
        beginner: `${ko}은 깊습니다.`,
        intermediate: `${ko}의 경치는 장관입니다.`,
        advanced: `${ko}은 수백만 년에 걸쳐 형성되었습니다.`,
        master: `${ko}의 지층은 지구 역사의 기록입니다.`,
      },
      en: {
        beginner: `${en} is deep.`,
        intermediate: `The scenery of ${en} is spectacular.`,
        advanced: `${en} was formed over millions of years.`,
        master: `The strata of ${en} are a record of Earth's history.`,
      },
    },
    cape: {
      ko: {
        beginner: `${ko}은 바다로 뻗어 있습니다.`,
        intermediate: `${ko}에서 아름다운 경치를 볼 수 있습니다.`,
        advanced: `${ko}은 역사적으로 중요한 항해 지점입니다.`,
        master: `${ko}은 대항해 시대에 중요한 이정표였습니다.`,
      },
      en: {
        beginner: `${en} extends into the sea.`,
        intermediate: `You can see beautiful scenery at ${en}.`,
        advanced: `${en} is a historically important navigation point.`,
        master: `${en} was an important landmark during the Age of Exploration.`,
      },
    },
    term: {
      ko: {
        beginner: `${ko}은 지리 용어입니다.`,
        intermediate: `${ko}의 의미를 알아봅시다.`,
        advanced: `${ko}은 지리학에서 중요한 개념입니다.`,
        master: `${ko}의 정확한 정의는 지역에 따라 다를 수 있습니다.`,
      },
      en: {
        beginner: `${en} is a geography term.`,
        intermediate: `Let's learn the meaning of ${en}.`,
        advanced: `${en} is an important concept in geography.`,
        master: `The exact definition of ${en} may vary by region.`,
      },
    },
    region: {
      ko: {
        beginner: `${ko}에는 여러 나라가 있습니다.`,
        intermediate: `${ko}의 문화는 다양합니다.`,
        advanced: `${ko}은 지정학적으로 중요한 지역입니다.`,
        master: `${ko}의 역사와 문화는 세계사에 큰 영향을 미쳤습니다.`,
      },
      en: {
        beginner: `There are several countries in ${en}.`,
        intermediate: `The culture of ${en} is diverse.`,
        advanced: `${en} is a geopolitically important region.`,
        master: `The history and culture of ${en} have greatly influenced world history.`,
      },
    },
  };

  const template = templates[tag as keyof typeof templates] || templates.term;
  return {
    ko: template.ko,
    en: template.en,
  };
}

// Convert data to entries
function createEntry(
  en: string,
  ko: string,
  desc_ko: string,
  desc_en: string,
  tag: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
  frequency: 'common' | 'frequent' | 'occasional' | 'rare' = 'common',
): GeographyEntry {
  const id = toKebabCase(en);
  const examples = generateExamples(ko, en, tag);

  return {
    id,
    korean: ko,
    romanization: romanize(ko),
    partOfSpeech: 'noun',
    categoryId: 'geography',
    difficulty,
    frequency,
    tags: [tag, 'geography'],
    translations: {
      ko: {
        word: ko,
        explanation: desc_ko,
        examples: examples.ko,
      },
      en: {
        word: en,
        explanation: desc_en,
        examples: examples.en,
      },
    },
  };
}

// Generate all entries
function generateAllEntries(): GeographyEntry[] {
  const entries: GeographyEntry[] = [];
  const existingIds = new Set<string>();

  // Helper to add entry if not duplicate
  const addEntry = (entry: GeographyEntry) => {
    if (!existingIds.has(entry.id)) {
      existingIds.add(entry.id);
      entries.push(entry);
    }
  };

  // Existing entries (5 oceans + 6 continents)
  const existingEntries = [
    'pacific-ocean',
    'atlantic-ocean',
    'indian-ocean',
    'arctic-ocean',
    'southern-ocean',
    'asia',
    'europe',
    'africa',
    'north-america',
    'south-america',
    'oceania',
  ];
  for (const id of existingEntries) {
    existingIds.add(id);
  }

  // Add continents
  geographyData.continents.forEach((d) => {
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'continent', 'beginner'));
  });

  // Add seas
  [
    ...geographyData.seasPacific,
    ...geographyData.seasAtlantic,
    ...geographyData.seasIndian,
    ...geographyData.seasArctic,
  ].forEach((d) => {
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'sea', 'intermediate', 'occasional'));
  });

  // Add straits
  geographyData.straits.forEach((d) => {
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'strait', 'intermediate', 'occasional'));
  });

  // Add peninsulas
  geographyData.peninsulas.forEach((d) => {
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'peninsula', 'intermediate'));
  });

  // Add islands
  geographyData.islands.forEach((d) => {
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'island', 'intermediate'));
  });

  // Add archipelagos
  geographyData.archipelagos.forEach((d) => {
    addEntry(
      createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'archipelago', 'intermediate', 'occasional'),
    );
  });

  // Add mountain ranges
  geographyData.mountainRanges.forEach((d) => {
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'mountainRange', 'intermediate'));
  });

  // Add mountains
  geographyData.mountains.forEach((d) => {
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'mountain', 'intermediate'));
  });

  // Add deserts
  geographyData.deserts.forEach((d) => {
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'desert', 'intermediate', 'occasional'));
  });

  // Add rivers
  geographyData.rivers.forEach((d) => {
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'river', 'intermediate'));
  });

  // Add lakes
  geographyData.lakes.forEach((d) => {
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'lake', 'intermediate'));
  });

  // Add waterfalls
  geographyData.waterfalls.forEach((d) => {
    addEntry(
      createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'waterfall', 'intermediate', 'occasional'),
    );
  });

  // Add plains and plateaus
  geographyData.plainsPlateaus.forEach((d) => {
    const tag =
      d.en.toLowerCase().includes('plateau') || d.en.toLowerCase().includes('highland')
        ? 'plateau'
        : 'plain';
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, tag, 'intermediate', 'occasional'));
  });

  // Add canyons and valleys
  geographyData.canyonsValleys.forEach((d) => {
    const tag =
      d.en.toLowerCase().includes('canyon') || d.en.toLowerCase().includes('gorge')
        ? 'canyon'
        : 'plain';
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, tag, 'intermediate', 'occasional'));
  });

  // Add capes
  geographyData.capes.forEach((d) => {
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'cape', 'intermediate', 'rare'));
  });

  // Add terms
  geographyData.terms.forEach((d) => {
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'term', 'beginner'));
  });

  // Add regions
  geographyData.regions.forEach((d) => {
    addEntry(createEntry(d.en, d.ko, d.desc_ko, d.desc_en, 'region', 'intermediate'));
  });

  return entries;
}

// Main
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const existingPath = path.join(__dirname, '..', 'app', 'data', 'entries', 'geography.json');
const existing = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));
const newEntries = generateAllEntries();

// Merge existing with new (existing first)
const merged = [...existing, ...newEntries];

// Write output
fs.writeFileSync(existingPath, `${JSON.stringify(merged, null, 2)}\n`);
console.log(
  `✅ Generated ${merged.length} geography entries (${existing.length} existing + ${newEntries.length} new)`,
);
