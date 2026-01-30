-- Migration: Add 10 new categories (double-consonants, weather, animals, nature, clothing, honorifics, seasons, professions, drinks, conjunctions)
-- Date: 2026-01-30

-- ============================================================================
-- 1. Categories (10개)
-- ============================================================================

INSERT OR REPLACE INTO categories (id, name_ko, name_en, description_ko, description_en, icon, color, "order") VALUES
  ('double-consonants', '쌍자음', 'Double Consonants', '한글 쌍자음(된소리) 5개 (ㄲ, ㄸ, ㅃ, ㅆ, ㅉ)', '5 Korean double (tense) consonants', 'ㄲ', 'red', 56),
  ('weather', '날씨', 'Weather', '날씨와 기상 관련 단어', 'Weather and climate vocabulary', '☀', 'yellow', 57),
  ('animals', '동물', 'Animals', '동물 관련 단어', 'Animal vocabulary', '🐾', 'orange', 58),
  ('nature', '자연', 'Nature', '자연과 풍경 관련 단어', 'Nature and landscape vocabulary', '🌿', 'green', 59),
  ('clothing', '의류', 'Clothing', '옷과 패션 관련 단어', 'Clothing and fashion vocabulary', '👔', 'purple', 60),
  ('honorifics', '존댓말', 'Honorifics', '한국어 존칭과 경어 표현', 'Korean honorific expressions and politeness levels', '🙇', 'indigo', 61),
  ('seasons', '계절', 'Seasons', '계절과 명절 관련 단어', 'Seasons and holidays vocabulary', '🍂', 'teal', 62),
  ('professions', '직업', 'Professions', '직업과 직종 관련 단어', 'Professions and occupations vocabulary', '💼', 'blue', 63),
  ('drinks', '음료', 'Drinks', '음료와 마실 것 관련 단어', 'Beverages and drinks vocabulary', '☕', 'orange', 64),
  ('conjunctions', '접속사', 'Conjunctions', '문장을 연결하는 접속사와 연결어미', 'Conjunctions and connective endings', '⟷', 'pink', 65);

-- ============================================================================
-- 2. Double Consonants (쌍자음) - 5 entries
-- ============================================================================

INSERT OR REPLACE INTO entries (id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations) VALUES
  ('ssang-giyeok', 'ㄲ', 'ssang-giyeok', 'noun', 'double-consonants', 'beginner', 'common', '["alphabet","consonant","double"]', '{"ko":{"word":"ㄲ (쌍기역)","explanation":"ㄱ을 두 번 쓴 된소리(경음) 글자입니다."},"en":{"word":"ssang-giyeok (ㄲ)","explanation":"A tense consonant, written as double ㄱ. Pronounced with a tight throat and no aspiration."}}'),
  ('ssang-digeut', 'ㄸ', 'ssang-digeut', 'noun', 'double-consonants', 'beginner', 'common', '["alphabet","consonant","double"]', '{"ko":{"word":"ㄸ (쌍디귿)","explanation":"ㄷ을 두 번 쓴 된소리(경음) 글자입니다."},"en":{"word":"ssang-digeut (ㄸ)","explanation":"A tense consonant, written as double ㄷ."}}'),
  ('ssang-bieup', 'ㅃ', 'ssang-bieup', 'noun', 'double-consonants', 'beginner', 'common', '["alphabet","consonant","double"]', '{"ko":{"word":"ㅃ (쌍비읍)","explanation":"ㅂ을 두 번 쓴 된소리(경음) 글자입니다."},"en":{"word":"ssang-bieup (ㅃ)","explanation":"A tense consonant, written as double ㅂ."}}'),
  ('ssang-siot', 'ㅆ', 'ssang-siot', 'noun', 'double-consonants', 'beginner', 'common', '["alphabet","consonant","double"]', '{"ko":{"word":"ㅆ (쌍시옷)","explanation":"ㅅ을 두 번 쓴 된소리(경음) 글자입니다."},"en":{"word":"ssang-siot (ㅆ)","explanation":"A tense consonant, written as double ㅅ."}}'),
  ('ssang-jieut', 'ㅉ', 'ssang-jieut', 'noun', 'double-consonants', 'beginner', 'common', '["alphabet","consonant","double"]', '{"ko":{"word":"ㅉ (쌍지읒)","explanation":"ㅈ을 두 번 쓴 된소리(경음) 글자입니다."},"en":{"word":"ssang-jieut (ㅉ)","explanation":"A tense consonant, written as double ㅈ."}}');

-- ============================================================================
-- 3. Weather (날씨) - 8 entries
-- ============================================================================

INSERT OR REPLACE INTO entries (id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations) VALUES
  ('bi', '비', 'bi', 'noun', 'weather', 'beginner', 'common', '["weather","nature"]', '{"ko":{"word":"비","explanation":"하늘에서 물방울이 떨어지는 기상 현상입니다."},"en":{"word":"rain","explanation":"Rain, a weather phenomenon where water droplets fall from clouds."}}'),
  ('nun', '눈', 'nun', 'noun', 'weather', 'beginner', 'common', '["weather","nature","winter"]', '{"ko":{"word":"눈","explanation":"하늘에서 얼음 결정이 내리는 기상 현상입니다."},"en":{"word":"snow","explanation":"Snow, frozen precipitation in the form of ice crystals."}}'),
  ('makda', '맑다', 'makda', 'adjective', 'weather', 'beginner', 'common', '["weather","adjective"]', '{"ko":{"word":"맑다","explanation":"하늘에 구름이 없고 날씨가 좋은 상태를 뜻합니다."},"en":{"word":"clear (weather)","explanation":"Describes clear, cloudless weather."}}'),
  ('heurida', '흐리다', 'heurida', 'adjective', 'weather', 'beginner', 'common', '["weather","adjective"]', '{"ko":{"word":"흐리다","explanation":"구름이 많이 끼어 하늘이 어두운 상태를 뜻합니다."},"en":{"word":"cloudy","explanation":"Describes overcast or cloudy weather."}}'),
  ('taepung', '태풍', 'taepung', 'noun', 'weather', 'intermediate', 'common', '["weather","nature","disaster"]', '{"ko":{"word":"태풍","explanation":"열대 해상에서 발생하는 강한 폭풍입니다."},"en":{"word":"typhoon","explanation":"A powerful tropical storm that forms over the Pacific Ocean."}}'),
  ('baram', '바람', 'baram', 'noun', 'weather', 'beginner', 'common', '["weather","nature"]', '{"ko":{"word":"바람","explanation":"공기가 움직이는 현상입니다."},"en":{"word":"wind","explanation":"The movement of air."}}'),
  ('deopda', '덥다', 'deopda', 'adjective', 'weather', 'beginner', 'common', '["weather","adjective","summer"]', '{"ko":{"word":"덥다","explanation":"기온이 높아 몸이 더운 느낌을 뜻합니다."},"en":{"word":"hot (weather)","explanation":"Describes hot weather or feeling warm."}}'),
  ('chupda', '춥다', 'chupda', 'adjective', 'weather', 'beginner', 'common', '["weather","adjective","winter"]', '{"ko":{"word":"춥다","explanation":"기온이 낮아 몸이 추운 느낌을 뜻합니다."},"en":{"word":"cold (weather)","explanation":"Describes cold weather or feeling cold."}}');

-- ============================================================================
-- 4. Animals (동물) - 5 entries
-- ============================================================================

INSERT OR REPLACE INTO entries (id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations) VALUES
  ('gae', '개', 'gae', 'noun', 'animals', 'beginner', 'common', '["animals","pets"]', '{"ko":{"word":"개","explanation":"가정에서 키우는 반려동물입니다."},"en":{"word":"dog","explanation":"A domesticated companion animal."}}'),
  ('goyangi', '고양이', 'goyangi', 'noun', 'animals', 'beginner', 'common', '["animals","pets"]', '{"ko":{"word":"고양이","explanation":"독립적인 성격으로 알려진 반려동물입니다."},"en":{"word":"cat","explanation":"A companion animal known for its independent personality."}}'),
  ('sae', '새', 'sae', 'noun', 'animals', 'beginner', 'common', '["animals","nature"]', '{"ko":{"word":"새","explanation":"날개가 있고 날 수 있는 동물의 총칭입니다."},"en":{"word":"bird","explanation":"A general term for feathered, winged animals."}}'),
  ('mulgogi', '물고기', 'mulgogi', 'noun', 'animals', 'beginner', 'common', '["animals","nature","water"]', '{"ko":{"word":"물고기","explanation":"물속에 사는 동물의 총칭입니다."},"en":{"word":"fish","explanation":"A general term for aquatic animals."}}'),
  ('horangi', '호랑이', 'horangi', 'noun', 'animals', 'beginner', 'common', '["animals","culture","wildlife"]', '{"ko":{"word":"호랑이","explanation":"한국을 상징하는 동물입니다."},"en":{"word":"tiger","explanation":"A symbol of Korea."}}');

-- ============================================================================
-- 5. Nature (자연) - 6 entries
-- ============================================================================

INSERT OR REPLACE INTO entries (id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations) VALUES
  ('san', '산', 'san', 'noun', 'nature', 'beginner', 'common', '["nature","landscape"]', '{"ko":{"word":"산","explanation":"땅이 높이 솟아오른 지형입니다."},"en":{"word":"mountain","explanation":"An elevated landform rising above the surrounding area."}}'),
  ('bada', '바다', 'bada', 'noun', 'nature', 'beginner', 'common', '["nature","landscape","water"]', '{"ko":{"word":"바다","explanation":"넓은 짠물이 있는 곳입니다."},"en":{"word":"sea / ocean","explanation":"A large body of saltwater."}}'),
  ('gang', '강', 'gang', 'noun', 'nature', 'beginner', 'common', '["nature","landscape","water"]', '{"ko":{"word":"강","explanation":"물이 흐르는 큰 수로입니다."},"en":{"word":"river","explanation":"A large natural waterway."}}'),
  ('haneul', '하늘', 'haneul', 'noun', 'nature', 'beginner', 'common', '["nature","landscape"]', '{"ko":{"word":"하늘","explanation":"머리 위에 보이는 공간입니다."},"en":{"word":"sky","explanation":"The expanse of air above the earth."}}'),
  ('kkot', '꽃', 'kkot', 'noun', 'nature', 'beginner', 'common', '["nature","plants"]', '{"ko":{"word":"꽃","explanation":"식물의 생식 기관으로, 아름다운 색과 향기가 있습니다."},"en":{"word":"flower","explanation":"The reproductive part of a plant, known for its beauty and fragrance."}}'),
  ('namu', '나무', 'namu', 'noun', 'nature', 'beginner', 'common', '["nature","plants"]', '{"ko":{"word":"나무","explanation":"줄기와 가지가 있는 큰 식물입니다."},"en":{"word":"tree","explanation":"A large plant with a trunk and branches."}}');

-- ============================================================================
-- 6. Clothing (의류) - 5 entries
-- ============================================================================

INSERT OR REPLACE INTO entries (id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations) VALUES
  ('ot', '옷', 'ot', 'noun', 'clothing', 'beginner', 'common', '["clothing","daily-life"]', '{"ko":{"word":"옷","explanation":"몸에 입는 것의 총칭입니다."},"en":{"word":"clothes","explanation":"A general term for garments worn on the body."}}'),
  ('sinbal', '신발', 'sinbal', 'noun', 'clothing', 'beginner', 'common', '["clothing","daily-life"]', '{"ko":{"word":"신발","explanation":"발에 신는 것의 총칭입니다."},"en":{"word":"shoes","explanation":"A general term for footwear."}}'),
  ('moja', '모자', 'moja', 'noun', 'clothing', 'beginner', 'common', '["clothing","accessories"]', '{"ko":{"word":"모자","explanation":"머리에 쓰는 것의 총칭입니다."},"en":{"word":"hat / cap","explanation":"A general term for headwear."}}'),
  ('baji', '바지', 'baji', 'noun', 'clothing', 'beginner', 'common', '["clothing","daily-life"]', '{"ko":{"word":"바지","explanation":"하반신에 입는 옷입니다."},"en":{"word":"pants / trousers","explanation":"A garment worn on the lower body."}}'),
  ('chima', '치마', 'chima', 'noun', 'clothing', 'beginner', 'common', '["clothing","daily-life"]', '{"ko":{"word":"치마","explanation":"허리에서 아래로 펼쳐지는 옷입니다."},"en":{"word":"skirt","explanation":"A garment that hangs from the waist down."}}');

-- ============================================================================
-- 7. Honorifics (존댓말) - 5 entries
-- ============================================================================

INSERT OR REPLACE INTO entries (id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations) VALUES
  ('yo', '-요', 'yo', 'particle', 'honorifics', 'beginner', 'common', '["honorifics","grammar","politeness"]', '{"ko":{"word":"-요","explanation":"해요체의 종결어미로, 존댓말의 가장 기본적인 표현입니다."},"en":{"word":"-yo (polite ending)","explanation":"The most common polite sentence ending in Korean."}}'),
  ('seumnida', '-습니다', 'seumnida', 'particle', 'honorifics', 'beginner', 'common', '["honorifics","grammar","politeness","formal"]', '{"ko":{"word":"-습니다 / -ㅂ니다","explanation":"격식체의 종결어미로, 가장 공손한 존댓말 형태입니다."},"en":{"word":"-seumnida (formal ending)","explanation":"The most formal and polite sentence ending in Korean."}}'),
  ('nim', '님', 'nim', 'noun', 'honorifics', 'beginner', 'common', '["honorifics","suffix","politeness"]', '{"ko":{"word":"님","explanation":"상대방을 높여 부를 때 이름이나 직함 뒤에 붙이는 존칭 접미사입니다."},"en":{"word":"-nim (honorific suffix)","explanation":"An honorific suffix attached after a name or title to show respect."}}'),
  ('seonsaengnim', '선생님', 'seonsaengnim', 'noun', 'honorifics', 'beginner', 'common', '["honorifics","title","education"]', '{"ko":{"word":"선생님","explanation":"교사, 의사, 변호사 등 전문직 종사자나 연장자를 높여 부르는 호칭입니다."},"en":{"word":"teacher / sir / ma''am","explanation":"An honorific title used for teachers, doctors, lawyers, and other respected professionals."}}'),
  ('jondaenmal', '존댓말', 'jondaenmal', 'noun', 'honorifics', 'beginner', 'common', '["honorifics","grammar","culture"]', '{"ko":{"word":"존댓말","explanation":"상대방을 높여 말하는 말투의 총칭입니다."},"en":{"word":"formal/polite speech","explanation":"The general term for polite or formal speech in Korean."}}');

-- ============================================================================
-- 8. Seasons (계절) - 6 entries
-- ============================================================================

INSERT OR REPLACE INTO entries (id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations) VALUES
  ('bom', '봄', 'bom', 'noun', 'seasons', 'beginner', 'common', '["seasons","nature","time"]', '{"ko":{"word":"봄","explanation":"3월~5월의 계절입니다."},"en":{"word":"spring","explanation":"The season from March to May."}}'),
  ('yeoreum', '여름', 'yeoreum', 'noun', 'seasons', 'beginner', 'common', '["seasons","nature","time"]', '{"ko":{"word":"여름","explanation":"6월~8월의 계절입니다."},"en":{"word":"summer","explanation":"The season from June to August."}}'),
  ('gaeul', '가을', 'gaeul', 'noun', 'seasons', 'beginner', 'common', '["seasons","nature","time"]', '{"ko":{"word":"가을","explanation":"9월~11월의 계절입니다."},"en":{"word":"autumn / fall","explanation":"The season from September to November."}}'),
  ('gyeoul', '겨울', 'gyeoul', 'noun', 'seasons', 'beginner', 'common', '["seasons","nature","time"]', '{"ko":{"word":"겨울","explanation":"12월~2월의 계절입니다."},"en":{"word":"winter","explanation":"The season from December to February."}}'),
  ('seollal', '설날', 'seollal', 'noun', 'seasons', 'intermediate', 'common', '["seasons","culture","holiday"]', '{"ko":{"word":"설날","explanation":"음력 1월 1일, 한국의 가장 큰 명절 중 하나입니다."},"en":{"word":"Lunar New Year (Seollal)","explanation":"January 1st of the lunar calendar, one of Korea''s biggest holidays."}}'),
  ('chuseok', '추석', 'chuseok', 'noun', 'seasons', 'intermediate', 'common', '["seasons","culture","holiday"]', '{"ko":{"word":"추석","explanation":"음력 8월 15일, 한국의 추수감사절입니다."},"en":{"word":"Chuseok (Korean Thanksgiving)","explanation":"August 15th of the lunar calendar, Korea''s harvest festival."}}');

-- ============================================================================
-- 9. Professions (직업) - 5 entries
-- ============================================================================

INSERT OR REPLACE INTO entries (id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations) VALUES
  ('uisa', '의사', 'uisa', 'noun', 'professions', 'beginner', 'common', '["professions","medical"]', '{"ko":{"word":"의사","explanation":"병을 치료하는 전문직입니다."},"en":{"word":"doctor","explanation":"A medical professional who treats illness."}}'),
  ('gyeongchal', '경찰', 'gyeongchal', 'noun', 'professions', 'beginner', 'common', '["professions","public-service"]', '{"ko":{"word":"경찰","explanation":"법과 질서를 유지하고 시민을 보호하는 공무원입니다."},"en":{"word":"police","explanation":"A public servant who maintains law and order."}}'),
  ('yorisa', '요리사', 'yorisa', 'noun', 'professions', 'beginner', 'common', '["professions","food"]', '{"ko":{"word":"요리사","explanation":"음식을 만드는 것이 직업인 사람입니다."},"en":{"word":"chef / cook","explanation":"A professional who cooks food."}}'),
  ('hoesawon', '회사원', 'hoesawon', 'noun', 'professions', 'beginner', 'common', '["professions","business"]', '{"ko":{"word":"회사원","explanation":"회사에 다니는 직장인입니다."},"en":{"word":"office worker","explanation":"A person who works at a company."}}'),
  ('haksaeng', '학생', 'haksaeng', 'noun', 'professions', 'beginner', 'common', '["professions","education"]', '{"ko":{"word":"학생","explanation":"학교에서 공부하는 사람입니다."},"en":{"word":"student","explanation":"A person studying at a school."}}');

-- ============================================================================
-- 10. Drinks (음료) - 6 entries
-- ============================================================================

INSERT OR REPLACE INTO entries (id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations) VALUES
  ('mul', '물', 'mul', 'noun', 'drinks', 'beginner', 'common', '["drinks","daily-life"]', '{"ko":{"word":"물","explanation":"마시는 액체의 기본입니다."},"en":{"word":"water","explanation":"The most basic drink."}}'),
  ('keopi', '커피', 'keopi', 'noun', 'drinks', 'beginner', 'common', '["drinks","daily-life","loanword"]', '{"ko":{"word":"커피","explanation":"영어 coffee에서 온 외래어입니다."},"en":{"word":"coffee","explanation":"A loanword from English."}}'),
  ('cha', '차', 'cha', 'noun', 'drinks', 'beginner', 'common', '["drinks","culture"]', '{"ko":{"word":"차","explanation":"잎이나 열매를 우린 음료입니다."},"en":{"word":"tea","explanation":"A drink made by steeping leaves or fruits."}}'),
  ('juseu', '주스', 'juseu', 'noun', 'drinks', 'beginner', 'common', '["drinks","loanword"]', '{"ko":{"word":"주스","explanation":"영어 juice에서 온 외래어입니다."},"en":{"word":"juice","explanation":"A loanword from English."}}'),
  ('soju', '소주', 'soju', 'noun', 'drinks', 'intermediate', 'common', '["drinks","culture","alcohol"]', '{"ko":{"word":"소주","explanation":"한국의 대표적인 증류주입니다."},"en":{"word":"soju","explanation":"Korea''s signature distilled liquor."}}'),
  ('maekju', '맥주', 'maekju', 'noun', 'drinks', 'beginner', 'common', '["drinks","culture","alcohol"]', '{"ko":{"word":"맥주","explanation":"보리를 발효시켜 만든 술입니다."},"en":{"word":"beer","explanation":"An alcoholic drink made by fermenting barley."}}');

-- ============================================================================
-- 11. Conjunctions (접속사) - 5 entries
-- ============================================================================

INSERT OR REPLACE INTO entries (id, korean, romanization, part_of_speech, category_id, difficulty, frequency, tags, translations) VALUES
  ('geurigo', '그리고', 'geurigo', 'conjunction', 'conjunctions', 'beginner', 'common', '["conjunctions","grammar"]', '{"ko":{"word":"그리고","explanation":"앞의 내용에 뒤의 내용을 더할 때 쓰는 접속사입니다."},"en":{"word":"and / and then","explanation":"A conjunction used to add or list items."}}'),
  ('hajiman', '하지만', 'hajiman', 'conjunction', 'conjunctions', 'beginner', 'common', '["conjunctions","grammar"]', '{"ko":{"word":"하지만","explanation":"앞의 내용과 반대되거나 대조되는 내용을 연결하는 접속사입니다."},"en":{"word":"but / however","explanation":"A conjunction that introduces a contrasting idea."}}'),
  ('geuraeseo', '그래서', 'geuraeseo', 'conjunction', 'conjunctions', 'beginner', 'common', '["conjunctions","grammar"]', '{"ko":{"word":"그래서","explanation":"앞 문장의 원인이나 이유에 대한 결과를 나타내는 접속사입니다."},"en":{"word":"so / therefore","explanation":"A conjunction that shows the result of a preceding cause."}}'),
  ('go', '-고', 'go', 'particle', 'conjunctions', 'beginner', 'common', '["conjunctions","grammar","connective-ending"]', '{"ko":{"word":"-고","explanation":"동사나 형용사 어간 뒤에 붙어 두 가지 동작이나 상태를 나열하는 연결어미입니다."},"en":{"word":"-go (and / and then)","explanation":"A connective ending attached to verb/adjective stems to list two actions."}}'),
  ('myeon', '-면', 'myeon', 'particle', 'conjunctions', 'beginner', 'common', '["conjunctions","grammar","connective-ending","conditional"]', '{"ko":{"word":"-면 / -으면","explanation":"조건을 나타내는 연결어미입니다."},"en":{"word":"-myeon (if / when)","explanation":"A conditional connective ending meaning if or when."}}');

-- ============================================================================
-- Update category entry counts
-- ============================================================================

UPDATE categories SET entry_count = (SELECT COUNT(*) FROM entries WHERE category_id = categories.id);
