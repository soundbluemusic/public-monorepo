#!/usr/bin/env python3
"""
어휘 데이터 변환 스크립트
soundblue-monorepo/data → public-monorepo/data/context/entries

15,182개 어휘를 Context 앱 스키마로 변환
"""

import json
import os
import re
from typing import Any
from collections import defaultdict

# 경로 설정
SOURCE_BASE = "/Volumes/X10 Pro/monorepo-project/soundblue-monorepo/data/dictionaries"
TARGET_BASE = "/Volumes/X10 Pro/monorepo-project/public-monorepo/data/context/entries"
CATEGORIES_PATH = "/Volumes/X10 Pro/monorepo-project/public-monorepo/data/context/categories.json"

# 도메인 → 카테고리 매핑
DOMAIN_TO_CATEGORY = {
    # 기존 카테고리 매핑
    "arts": "art",
    "emotions": "emotions",
    "food": "food",
    "shopping": "shopping",
    "sports": "sports",
    "education": "education",
    "home": "daily-life",
    "fitness": "sports",
    "books": "culture",

    # 의료/신체 관련
    "medical": "medical",
    "hospital": "medical",
    "body-movements": "body",
    "body/articular": "body",
    "body/body-regions": "body",
    "body/cardiovascular": "body",
    "body/digestive": "body",
    "body/endocrine": "body",
    "body/integumentary": "body",
    "body/lymphatic": "body",
    "body/muscular": "body",
    "body/nervous": "body",
    "body/reproductive": "body",
    "body/respiratory": "body",
    "body/sensory": "body",
    "body/skeletal": "body",
    "body/tissues": "body",
    "body/urinary": "body",

    # 법률
    "legal": "legal",

    # 기술 관련 → coding 카테고리
    "technology/architecture": "coding",
    "technology/collaboration": "coding",
    "technology/data-structures": "coding",
    "technology/database": "coding",
    "technology/devops-cloud": "coding",
    "technology/fields-roles": "coding",
    "technology/frameworks": "coding",
    "technology/languages": "coding",
    "technology/misc": "coding",
    "technology/monitoring": "coding",
    "technology/network-web": "coding",
    "technology/programming-concepts": "coding",
    "technology/security-testing": "coding",
    "technology/tools": "coding",
    "technology/ui-ux": "coding",
    "technology/version-control": "coding",
    "technology/web-development": "coding",
}

# 새로 추가할 카테고리 정의
NEW_CATEGORIES = [
    {
        "id": "colors",
        "name": {"ko": "색상", "en": "Colors"},
        "description": {"ko": "색상과 색채 관련 단어", "en": "Color and hue related vocabulary"},
        "icon": "◉",
        "color": "pink",
        "order": 25
    },
    {
        "id": "idioms",
        "name": {"ko": "관용구", "en": "Idioms"},
        "description": {"ko": "한국어 관용 표현과 속담", "en": "Korean idiomatic expressions and proverbs"},
        "icon": "≋",
        "color": "purple",
        "order": 26
    },
    {
        "id": "onomatopoeia",
        "name": {"ko": "의성어/의태어", "en": "Onomatopoeia"},
        "description": {"ko": "소리와 모양을 흉내내는 단어", "en": "Sound and mimetic words"},
        "icon": "∿",
        "color": "orange",
        "order": 27
    },
    {
        "id": "cultural-expressions",
        "name": {"ko": "문화 표현", "en": "Cultural Expressions"},
        "description": {"ko": "한국 문화 특유의 표현", "en": "Uniquely Korean cultural expressions"},
        "icon": "◈",
        "color": "red",
        "order": 28
    },
    {
        "id": "phrasal-verbs",
        "name": {"ko": "구동사", "en": "Phrasal Verbs"},
        "description": {"ko": "동사구와 복합 동사 표현", "en": "Verb phrases and compound verb expressions"},
        "icon": "⇢",
        "color": "teal",
        "order": 29
    },
    {
        "id": "compound-words",
        "name": {"ko": "복합어", "en": "Compound Words"},
        "description": {"ko": "두 단어 이상이 결합된 복합어", "en": "Words formed by combining two or more words"},
        "icon": "⊕",
        "color": "blue",
        "order": 30
    },
    {
        "id": "verb-stems",
        "name": {"ko": "동사 어간", "en": "Verb Stems"},
        "description": {"ko": "한국어 동사의 기본 어간", "en": "Basic stems of Korean verbs"},
        "icon": "∨",
        "color": "green",
        "order": 31
    },
    {
        "id": "body",
        "name": {"ko": "신체", "en": "Body"},
        "description": {"ko": "인체와 신체 부위 관련 단어", "en": "Human body and anatomy vocabulary"},
        "icon": "◯",
        "color": "red",
        "order": 32
    },
    {
        "id": "medical",
        "name": {"ko": "의학", "en": "Medical"},
        "description": {"ko": "의학과 건강 관련 단어", "en": "Medical and health related vocabulary"},
        "icon": "+",
        "color": "red",
        "order": 33
    },
    {
        "id": "legal",
        "name": {"ko": "법률", "en": "Legal"},
        "description": {"ko": "법률과 법적 용어", "en": "Legal and law related vocabulary"},
        "icon": "§",
        "color": "indigo",
        "order": 34
    },
    {
        "id": "education",
        "name": {"ko": "교육", "en": "Education"},
        "description": {"ko": "교육과 학습 관련 단어", "en": "Education and learning vocabulary"},
        "icon": "◻",
        "color": "blue",
        "order": 35
    },
    {
        "id": "interjections",
        "name": {"ko": "감탄사", "en": "Interjections"},
        "description": {"ko": "감정을 표현하는 감탄사", "en": "Exclamations expressing emotions"},
        "icon": "!",
        "color": "yellow",
        "order": 36
    },
    {
        "id": "basic-words",
        "name": {"ko": "기본 단어", "en": "Basic Words"},
        "description": {"ko": "일상에서 자주 쓰는 기본 단어", "en": "Basic words commonly used in daily life"},
        "icon": "·",
        "color": "gray",
        "order": 37
    },
]


def korean_to_id(korean: str, prefix: str = "") -> str:
    """한국어를 kebab-case ID로 변환"""
    # 특수문자 제거, 공백을 하이픈으로
    cleaned = re.sub(r'[^\w\s가-힣a-zA-Z0-9]', '', korean)
    cleaned = cleaned.strip().lower()
    cleaned = re.sub(r'\s+', '-', cleaned)

    # 한글을 로마자로 (간단한 변환)
    romanization_map = {
        '가': 'ga', '나': 'na', '다': 'da', '라': 'ra', '마': 'ma',
        '바': 'ba', '사': 'sa', '아': 'a', '자': 'ja', '차': 'cha',
        '카': 'ka', '타': 'ta', '파': 'pa', '하': 'ha',
        '거': 'geo', '너': 'neo', '더': 'deo', '러': 'reo', '머': 'meo',
        '버': 'beo', '서': 'seo', '어': 'eo', '저': 'jeo', '처': 'cheo',
        '커': 'keo', '터': 'teo', '퍼': 'peo', '허': 'heo',
        '고': 'go', '노': 'no', '도': 'do', '로': 'ro', '모': 'mo',
        '보': 'bo', '소': 'so', '오': 'o', '조': 'jo', '초': 'cho',
        '코': 'ko', '토': 'to', '포': 'po', '호': 'ho',
        '구': 'gu', '누': 'nu', '두': 'du', '루': 'ru', '무': 'mu',
        '부': 'bu', '수': 'su', '우': 'u', '주': 'ju', '추': 'chu',
        '쿠': 'ku', '투': 'tu', '푸': 'pu', '후': 'hu',
        '그': 'geu', '느': 'neu', '드': 'deu', '르': 'reu', '므': 'meu',
        '브': 'beu', '스': 'seu', '으': 'eu', '즈': 'jeu', '츠': 'cheu',
        '크': 'keu', '트': 'teu', '프': 'peu', '흐': 'heu',
        '기': 'gi', '니': 'ni', '디': 'di', '리': 'ri', '미': 'mi',
        '비': 'bi', '시': 'si', '이': 'i', '지': 'ji', '치': 'chi',
        '키': 'ki', '티': 'ti', '피': 'pi', '히': 'hi',
        '개': 'gae', '내': 'nae', '대': 'dae', '래': 'rae', '매': 'mae',
        '배': 'bae', '새': 'sae', '애': 'ae', '재': 'jae', '채': 'chae',
        '게': 'ge', '네': 'ne', '데': 'de', '레': 're', '메': 'me',
        '베': 'be', '세': 'se', '에': 'e', '제': 'je', '체': 'che',
        '과': 'gwa', '놔': 'nwa', '돠': 'dwa', '롸': 'rwa', '뫄': 'mwa',
        '봐': 'bwa', '솨': 'swa', '와': 'wa', '좌': 'jwa', '촤': 'chwa',
        '괴': 'goe', '뇌': 'noe', '되': 'doe', '뢰': 'roe', '뫼': 'moe',
        '뵈': 'boe', '쇠': 'soe', '외': 'oe', '죄': 'joe', '최': 'choe',
        '권': 'gwon', '눈': 'nun', '둔': 'dun', '룬': 'run', '문': 'mun',
        '분': 'bun', '순': 'sun', '운': 'un', '준': 'jun', '춘': 'chun',
        '균': 'gyun', '뉸': 'nyun', '듄': 'dyun', '륜': 'ryun', '뮨': 'myun',
        '뷴': 'byun', '슌': 'syun', '윤': 'yun', '쥰': 'jyun', '츈': 'chyun',
        '끼': 'kki', '삐': 'ppi', '씨': 'ssi', '찌': 'jji', '띠': 'tti',
        '까': 'kka', '빠': 'ppa', '싸': 'ssa', '짜': 'jja', '따': 'tta',
        '꺼': 'kkeo', '뻐': 'ppeo', '써': 'sseo', '쩌': 'jjeo', '떠': 'tteo',
        '꼬': 'kko', '뽀': 'ppo', '쏘': 'sso', '쪼': 'jjo', '또': 'tto',
        '꾸': 'kku', '뿌': 'ppu', '쑤': 'ssu', '쭈': 'jju', '뚜': 'ttu',
        '끄': 'kkeu', '쁘': 'ppeu', '쓰': 'sseu', '쯔': 'jjeu', '뜨': 'tteu',
        '긴': 'gin', '닌': 'nin', '딘': 'din', '린': 'rin', '민': 'min',
        '빈': 'bin', '신': 'sin', '인': 'in', '진': 'jin', '친': 'chin',
        '킨': 'kin', '틴': 'tin', '핀': 'pin', '힌': 'hin',
        '간': 'gan', '난': 'nan', '단': 'dan', '란': 'ran', '만': 'man',
        '반': 'ban', '산': 'san', '안': 'an', '잔': 'jan', '찬': 'chan',
        '칸': 'kan', '탄': 'tan', '판': 'pan', '한': 'han',
        '건': 'geon', '넌': 'neon', '던': 'deon', '런': 'reon', '먼': 'meon',
        '번': 'beon', '선': 'seon', '언': 'eon', '전': 'jeon', '천': 'cheon',
        '곤': 'gon', '논': 'non', '돈': 'don', '론': 'ron', '몬': 'mon',
        '본': 'bon', '손': 'son', '온': 'on', '존': 'jon', '촌': 'chon',
        '점': 'jeom', '검': 'geom', '넘': 'neom', '덤': 'deom', '럼': 'reom',
        '범': 'beom', '섬': 'seom', '엄': 'eom', '점': 'jeom', '첨': 'cheom',
        '곰': 'gom', '놈': 'nom', '돔': 'dom', '롬': 'rom', '몸': 'mom',
        '봄': 'bom', '솜': 'som', '옴': 'om', '좀': 'jom', '촘': 'chom',
        '김': 'gim', '님': 'nim', '딤': 'dim', '림': 'rim', '밈': 'mim',
        '빔': 'bim', '심': 'sim', '임': 'im', '짐': 'jim', '침': 'chim',
        '감': 'gam', '남': 'nam', '담': 'dam', '람': 'ram', '맘': 'mam',
        '밤': 'bam', '삼': 'sam', '암': 'am', '잠': 'jam', '참': 'cham',
        '검': 'geom', '넘': 'neom', '덤': 'deom', '럼': 'reom', '멈': 'meom',
        '법': 'beob', '섭': 'seob', '엽': 'yeob', '접': 'jeob', '첩': 'cheob',
        '곱': 'gob', '놉': 'nob', '돕': 'dob', '롭': 'rob', '몹': 'mob',
        '볍': 'byeob', '솝': 'sob', '옵': 'ob', '좁': 'job', '촙': 'chob',
        '읍': 'eub', '급': 'geub', '늡': 'neub', '듭': 'deub', '릅': 'reub',
        '쁨': 'ppeum', '슴': 'seum', '음': 'eum', '즘': 'jeum', '츰': 'cheum',
        '각': 'gak', '낙': 'nak', '닥': 'dak', '락': 'rak', '막': 'mak',
        '박': 'bak', '삭': 'sak', '악': 'ak', '작': 'jak', '착': 'chak',
        '격': 'gyeok', '녁': 'nyeok', '덕': 'deok', '력': 'ryeok', '멱': 'myeok',
        '벽': 'byeok', '석': 'seok', '역': 'yeok', '적': 'jeok', '척': 'cheok',
        '곡': 'gok', '녹': 'nok', '독': 'dok', '록': 'rok', '목': 'mok',
        '복': 'bok', '속': 'sok', '옥': 'ok', '족': 'jok', '촉': 'chok',
        '국': 'guk', '눅': 'nuk', '둑': 'duk', '룩': 'ruk', '묵': 'muk',
        '북': 'buk', '숙': 'suk', '욱': 'uk', '죽': 'juk', '축': 'chuk',
        '극': 'geuk', '늑': 'neuk', '득': 'deuk', '륵': 'reuk', '믁': 'meuk',
        '븍': 'beuk', '슥': 'seuk', '윽': 'euk', '즉': 'jeuk', '측': 'cheuk',
        '픽': 'pik', '힉': 'hik', '킥': 'kik', '틱': 'tik',
        '팍': 'pak', '학': 'hak', '칵': 'kak', '탁': 'tak',
        '폭': 'pok', '혹': 'hok', '콕': 'kok', '톡': 'tok',
        '풀': 'pul', '훌': 'hul', '쿨': 'kul', '툴': 'tul',
        '플': 'peul', '흘': 'heul', '클': 'keul', '틀': 'teul',
        '필': 'pil', '힐': 'hil', '킬': 'kil', '틸': 'til',
        '팔': 'pal', '할': 'hal', '칼': 'kal', '탈': 'tal',
        '펄': 'peol', '헐': 'heol', '컬': 'keol', '털': 'teol',
        '폴': 'pol', '홀': 'hol', '콜': 'kol', '톨': 'tol',
        '말': 'mal', '발': 'bal', '살': 'sal', '알': 'al',
        '갈': 'gal', '날': 'nal', '달': 'dal', '랄': 'ral',
        '걸': 'geol', '널': 'neol', '덜': 'deol', '렬': 'ryeol',
        '골': 'gol', '놀': 'nol', '돌': 'dol', '롤': 'rol',
        '굴': 'gul', '눌': 'nul', '둘': 'dul', '룰': 'rul',
        '글': 'geul', '늘': 'neul', '들': 'deul', '를': 'reul',
        '길': 'gil', '닐': 'nil', '딜': 'dil', '릴': 'ril',
        '밀': 'mil', '빌': 'bil', '실': 'sil', '일': 'il',
        '질': 'jil', '칠': 'chil', '킬': 'kil', '틸': 'til',
        '멀': 'meol', '벌': 'beol', '설': 'seol', '열': 'yeol',
        '절': 'jeol', '철': 'cheol', '켤': 'kyeol', '텰': 'tyeol',
        '몰': 'mol', '볼': 'bol', '솔': 'sol', '올': 'ol',
        '졸': 'jol', '촐': 'chol', '콜': 'kol', '톨': 'tol',
        '물': 'mul', '불': 'bul', '술': 'sul', '울': 'ul',
        '줄': 'jul', '출': 'chul', '쿨': 'kul', '툴': 'tul',
        '뭘': 'mwol', '뷸': 'bwol', '쉴': 'swil', '윌': 'wil',
        '쥴': 'jwil', '췰': 'chwil', '퀼': 'kwil', '튈': 'twil',
        '왕': 'wang', '광': 'gwang', '낭': 'nang', '당': 'dang',
        '랑': 'rang', '망': 'mang', '방': 'bang', '상': 'sang',
        '장': 'jang', '창': 'chang', '캉': 'kang', '탕': 'tang',
        '팡': 'pang', '항': 'hang',
        '웅': 'ung', '궁': 'gung', '눙': 'nung', '둥': 'dung',
        '룽': 'rung', '뭉': 'mung', '붕': 'bung', '숭': 'sung',
        '중': 'jung', '충': 'chung', '쿵': 'kung', '퉁': 'tung',
        '풍': 'pung', '훙': 'hung',
        '응': 'eung', '긍': 'geung', '능': 'neung', '등': 'deung',
        '릉': 'reung', '믕': 'meung', '븡': 'beung', '승': 'seung',
        '증': 'jeung', '층': 'cheung', '큥': 'keung', '틍': 'teung',
        '픙': 'peung', '흥': 'heung',
        '영': 'yeong', '경': 'gyeong', '녕': 'nyeong', '덩': 'deong',
        '령': 'ryeong', '명': 'myeong', '병': 'byeong', '성': 'seong',
        '정': 'jeong', '청': 'cheong', '켱': 'kyeong', '텽': 'tyeong',
        '평': 'pyeong', '형': 'hyeong',
        '용': 'yong', '공': 'gong', '농': 'nong', '동': 'dong',
        '롱': 'rong', '몽': 'mong', '봉': 'bong', '송': 'song',
        '종': 'jong', '총': 'chong', '콩': 'kong', '통': 'tong',
        '퐁': 'pong', '홍': 'hong',
        '앙': 'ang', '강': 'gang', '낭': 'nang', '당': 'dang',
        '랑': 'rang', '망': 'mang', '방': 'bang', '상': 'sang',
        '양': 'yang', '장': 'jang', '창': 'chang',
        '엉': 'eong', '겅': 'geong', '넝': 'neong', '덩': 'deong',
        '렁': 'reong', '멍': 'meong', '벙': 'beong', '성': 'seong',
        '영': 'yeong', '정': 'jeong', '청': 'cheong',
        '옹': 'ong', '공': 'gong', '농': 'nong', '동': 'dong',
        '롱': 'rong', '몽': 'mong', '봉': 'bong', '송': 'song',
        '요': 'yo', '교': 'gyo', '뇨': 'nyo', '됴': 'dyo',
        '료': 'ryo', '묘': 'myo', '뵤': 'byo', '쇼': 'syo',
        '야': 'ya', '갸': 'gya', '냐': 'nya', '댜': 'dya',
        '랴': 'rya', '먀': 'mya', '뱌': 'bya', '샤': 'sya',
        '여': 'yeo', '겨': 'gyeo', '녀': 'nyeo', '뎌': 'dyeo',
        '려': 'ryeo', '며': 'myeo', '벼': 'byeo', '셔': 'syeo',
        '유': 'yu', '규': 'gyu', '뉴': 'nyu', '듀': 'dyu',
        '류': 'ryu', '뮤': 'myu', '뷰': 'byu', '슈': 'syu',
        '얘': 'yae', '걔': 'gyae', '냬': 'nyae', '뎨': 'dyae',
        '례': 'ryae', '몌': 'myae', '볘': 'byae', '셰': 'syae',
        '예': 'ye', '계': 'gye', '녜': 'nye', '뎨': 'dye',
        '례': 'rye', '몌': 'mye', '볘': 'bye', '셰': 'sye',
    }

    result = []
    i = 0
    while i < len(cleaned):
        found = False
        # 2글자 매칭 시도
        if i + 2 <= len(cleaned):
            two_char = cleaned[i:i+2]
            if two_char in romanization_map:
                result.append(romanization_map[two_char])
                i += 2
                found = True
        # 1글자 매칭
        if not found:
            char = cleaned[i]
            if char in romanization_map:
                result.append(romanization_map[char])
            elif char.isalnum() or char == '-':
                result.append(char)
            i += 1

    base_id = ''.join(result)
    if not base_id:
        base_id = 'unknown'

    # prefix 추가
    if prefix:
        base_id = f"{prefix}-{base_id}"

    # 길이 제한 (100자)
    if len(base_id) > 100:
        base_id = base_id[:100]

    return base_id


def create_entry(korean: str, english: str, category_id: str,
                 part_of_speech: str = "noun", prefix: str = "") -> dict[str, Any]:
    """Context 앱 Entry 스키마로 변환"""
    entry_id = korean_to_id(korean, prefix)

    return {
        "id": entry_id,
        "korean": korean,
        "romanization": "",  # 빈 값으로 설정
        "partOfSpeech": part_of_speech,
        "categoryId": category_id,
        "difficulty": "beginner",
        "frequency": "common",
        "tags": [],
        "translations": {
            "ko": {
                "word": korean,
                "explanation": f"{korean}의 뜻은 '{english}'입니다.",
                "examples": {
                    "beginner": f"\"{korean}\"는 한국어로 말해요.",
                    "intermediate": f"한국에서는 \"{korean}\"를 자주 써요.",
                    "advanced": f"\"{korean}\"는 한국어에서 중요한 표현입니다.",
                    "master": f"\"{korean}\"의 문화적 맥락을 이해하면 더 자연스럽게 소통할 수 있습니다."
                },
                "variations": {
                    "formal": [],
                    "casual": [],
                    "short": []
                }
            },
            "en": {
                "word": english,
                "explanation": f"'{korean}' means '{english}' in English.",
                "examples": {
                    "beginner": f"We say \"{korean}\" in Korean.",
                    "intermediate": f"In Korea, people often say \"{korean}\".",
                    "advanced": f"\"{korean}\" is an important expression in Korean.",
                    "master": f"Understanding the cultural context of \"{korean}\" makes communication more natural."
                },
                "variations": {
                    "formal": [],
                    "casual": [],
                    "short": []
                }
            }
        }
    }


def load_json(filepath: str) -> Any:
    """JSON 파일 로드"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_json(filepath: str, data: Any) -> None:
    """JSON 파일 저장"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def convert_words_ko_to_en() -> list[dict]:
    """ko-to-en.json 변환"""
    data = load_json(f"{SOURCE_BASE}/words/ko-to-en.json")
    entries = []

    for item in data:
        ko = item.get('ko', '')
        en = item.get('en', '')
        if ko and en:
            # 감탄사 분류
            if ko in ['와', '와우', '우와', '음', '음음', '아', '아아', '오오', '어', '어어', '에', '아이고', '아이쿠', '아이구', '헉', '헐', '어머', '어머나', '세상에', '맙소사', '오호', '오', '아하', '유레카']:
                category = 'interjections'
                pos = 'interjection'
            else:
                category = 'basic-words'
                pos = 'noun'

            entries.append(create_entry(ko, en, category, pos, "w"))

    return entries


def convert_words_en_to_ko() -> list[dict]:
    """en-to-ko.json 변환"""
    data = load_json(f"{SOURCE_BASE}/words/en-to-ko.json")
    entries = []

    for item in data:
        ko = item.get('ko', '')
        en = item.get('en', '')
        if ko and en:
            entries.append(create_entry(ko, en, 'basic-words', 'noun', "ek"))

    return entries


def convert_stems() -> list[dict]:
    """stems.json 변환"""
    data = load_json(f"{SOURCE_BASE}/words/stems.json")
    entries = []

    for item in data:
        stem = item.get('stem', '')
        en = item.get('en', '')
        word_type = item.get('type', 'verb')

        if stem and en:
            pos = 'verb' if word_type == 'verb' else 'adjective'
            entries.append(create_entry(stem, en, 'verb-stems', pos, "st"))

    return entries


def convert_colors() -> list[dict]:
    """colors.json 변환"""
    data = load_json(f"{SOURCE_BASE}/words/colors.json")
    entries = []

    # 구조 확인: dict with koToEn/enToKo keys
    if isinstance(data, dict):
        for key, items in data.items():
            if isinstance(items, list):
                for item in items:
                    ko = item.get('ko', '')
                    en = item.get('en', '')
                    if ko and en:
                        entries.append(create_entry(ko, en, 'colors', 'noun', "col"))

    return entries


def convert_idioms() -> list[dict]:
    """idioms.json 변환"""
    data = load_json(f"{SOURCE_BASE}/idioms/idioms.json")
    entries = []

    for item in data:
        ko = item.get('ko', '')
        en = item.get('en', '')
        if ko and en:
            entries.append(create_entry(ko, en, 'idioms', 'phrase', "id"))

    return entries


def convert_compound_words() -> list[dict]:
    """compound-words.json 변환"""
    data = load_json(f"{SOURCE_BASE}/expressions/compound-words.json")
    entries = []

    for item in data:
        ko = item.get('ko', '')
        en = item.get('en', '')
        if ko and en:
            entries.append(create_entry(ko, en, 'compound-words', 'noun', "cw"))

    return entries


def convert_phrasal_verbs() -> list[dict]:
    """phrasal-verbs.json 변환"""
    data = load_json(f"{SOURCE_BASE}/expressions/phrasal-verbs.json")
    entries = []

    for item in data:
        ko = item.get('ko', '')
        en = item.get('en', '')
        if ko and en:
            entries.append(create_entry(ko, en, 'phrasal-verbs', 'verb', "pv"))

    return entries


def convert_cultural() -> list[dict]:
    """cultural.json 변환"""
    data = load_json(f"{SOURCE_BASE}/expressions/cultural.json")
    entries = []

    for item in data:
        ko = item.get('ko', '')
        en = item.get('en', '')
        if ko and en:
            entries.append(create_entry(ko, en, 'cultural-expressions', 'phrase', "cu"))

    return entries


def convert_onomatopoeia() -> list[dict]:
    """onomatopoeia.json 변환"""
    data = load_json(f"{SOURCE_BASE}/expressions/onomatopoeia.json")
    entries = []

    for item in data:
        ko = item.get('ko', '')
        en = item.get('en', '')
        if ko and en:
            entries.append(create_entry(ko, en, 'onomatopoeia', 'adverb', "on"))

    return entries


def convert_domains() -> dict[str, list[dict]]:
    """all-domains.json 변환 - 카테고리별로 분류"""
    data = load_json(f"{SOURCE_BASE}/domains/all-domains.json")
    categorized: dict[str, list[dict]] = defaultdict(list)

    if isinstance(data, dict):
        for key, items in data.items():
            if isinstance(items, list):
                for item in items:
                    ko = item.get('ko', '')
                    en = item.get('en', '')
                    domain = item.get('domain', '')

                    if ko and en:
                        category = DOMAIN_TO_CATEGORY.get(domain, 'basic-words')
                        entry = create_entry(ko, en, category, 'noun', f"d-{domain.split('/')[-1][:3]}")
                        categorized[category].append(entry)

    return categorized


def deduplicate_entries(entries: list[dict]) -> list[dict]:
    """중복 ID 제거 및 고유 ID 생성"""
    seen_ids: dict[str, int] = {}
    result = []

    for entry in entries:
        original_id = entry['id']

        if original_id in seen_ids:
            seen_ids[original_id] += 1
            entry['id'] = f"{original_id}-{seen_ids[original_id]}"
        else:
            seen_ids[original_id] = 0

        result.append(entry)

    return result


def main():
    print("=== 어휘 데이터 변환 시작 ===\n")

    # 1. 기존 카테고리 로드 및 새 카테고리 추가
    print("1. 카테고리 업데이트...")
    categories = load_json(CATEGORIES_PATH)
    existing_ids = {c['id'] for c in categories}

    for new_cat in NEW_CATEGORIES:
        if new_cat['id'] not in existing_ids:
            categories.append(new_cat)
            print(f"   + 새 카테고리: {new_cat['id']}")

    save_json(CATEGORIES_PATH, categories)
    print(f"   총 카테고리: {len(categories)}개\n")

    # 2. 각 소스 파일 변환
    all_entries: dict[str, list[dict]] = defaultdict(list)

    print("2. words/ko-to-en.json 변환...")
    entries = convert_words_ko_to_en()
    for e in entries:
        all_entries[e['categoryId']].append(e)
    print(f"   → {len(entries)}개 변환\n")

    print("3. words/en-to-ko.json 변환...")
    entries = convert_words_en_to_ko()
    for e in entries:
        all_entries[e['categoryId']].append(e)
    print(f"   → {len(entries)}개 변환\n")

    print("4. words/stems.json 변환...")
    entries = convert_stems()
    for e in entries:
        all_entries[e['categoryId']].append(e)
    print(f"   → {len(entries)}개 변환\n")

    print("5. words/colors.json 변환...")
    entries = convert_colors()
    for e in entries:
        all_entries[e['categoryId']].append(e)
    print(f"   → {len(entries)}개 변환\n")

    print("6. idioms/idioms.json 변환...")
    entries = convert_idioms()
    for e in entries:
        all_entries[e['categoryId']].append(e)
    print(f"   → {len(entries)}개 변환\n")

    print("7. expressions/compound-words.json 변환...")
    entries = convert_compound_words()
    for e in entries:
        all_entries[e['categoryId']].append(e)
    print(f"   → {len(entries)}개 변환\n")

    print("8. expressions/phrasal-verbs.json 변환...")
    entries = convert_phrasal_verbs()
    for e in entries:
        all_entries[e['categoryId']].append(e)
    print(f"   → {len(entries)}개 변환\n")

    print("9. expressions/cultural.json 변환...")
    entries = convert_cultural()
    for e in entries:
        all_entries[e['categoryId']].append(e)
    print(f"   → {len(entries)}개 변환\n")

    print("10. expressions/onomatopoeia.json 변환...")
    entries = convert_onomatopoeia()
    for e in entries:
        all_entries[e['categoryId']].append(e)
    print(f"   → {len(entries)}개 변환\n")

    print("11. domains/all-domains.json 변환...")
    domain_entries = convert_domains()
    for cat_id, cat_entries in domain_entries.items():
        all_entries[cat_id].extend(cat_entries)
    total_domain = sum(len(v) for v in domain_entries.values())
    print(f"   → {total_domain}개 변환\n")

    # 3. 카테고리별 파일 저장
    print("12. JSON 파일 저장...")
    total_entries = 0

    for category_id, entries in all_entries.items():
        # 중복 제거
        entries = deduplicate_entries(entries)

        filepath = f"{TARGET_BASE}/{category_id}.json"

        # 기존 파일이 있으면 병합
        if os.path.exists(filepath):
            existing = load_json(filepath)
            existing_ids = {e['id'] for e in existing}

            # 새 항목만 추가
            new_entries = [e for e in entries if e['id'] not in existing_ids]
            entries = existing + new_entries
            entries = deduplicate_entries(entries)

        save_json(filepath, entries)
        print(f"   {category_id}.json: {len(entries)}개")
        total_entries += len(entries)

    print(f"\n=== 변환 완료 ===")
    print(f"총 엔트리: {total_entries}개")
    print(f"총 카테고리: {len(categories)}개")


if __name__ == "__main__":
    main()
