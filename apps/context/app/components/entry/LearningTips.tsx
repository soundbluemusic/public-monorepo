/**
 * @fileoverview 학습 팁 컴포넌트 (영어 버전 전용)
 *
 * 외국인 한국어 학습자를 위한 학습 팁을 제공합니다.
 * - 격식 수준 안내
 * - 문화적 맥락
 * - 자주 하는 실수
 * - 비슷한 표현
 */

import { Lightbulb } from 'lucide-react';
import type { DifficultyLevel, PartOfSpeech } from '@/data/types';

interface LearningTipsProps {
  korean: string;
  difficulty: DifficultyLevel;
  partOfSpeech: PartOfSpeech;
  categoryId: string;
  translationWord: string;
}

/**
 * 난이도별 학습 조언을 반환합니다.
 */
function getDifficultyTip(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case 'beginner':
      return 'This is a common beginner-level word. Practice using it in daily conversations!';
    case 'intermediate':
      return 'This word requires understanding of Korean context. Try using it in appropriate situations.';
    case 'advanced':
      return 'This is an advanced expression. Pay attention to formality levels and nuances.';
    default:
      return '';
  }
}

/**
 * 품사별 학습 팁을 반환합니다.
 */
function getPartOfSpeechTip(partOfSpeech: PartOfSpeech): string {
  switch (partOfSpeech) {
    case 'verb':
      return 'Korean verbs conjugate based on tense and politeness level. Learn the stem first.';
    case 'adjective':
      return 'Korean adjectives work like verbs and can end sentences directly.';
    case 'noun':
      return 'Nouns are often followed by particles (은/는, 이/가, 을/를) to indicate their role.';
    case 'particle':
      return 'Particles are essential in Korean. They attach to nouns to show grammatical relationships.';
    case 'interjection':
      return 'Interjections add emotion and naturalness to your Korean speech.';
    case 'expression':
      return 'Expressions are best learned as fixed phrases. Memorize them as a whole.';
    case 'adverb':
      return 'Adverbs usually come before the verb they modify in Korean sentences.';
    case 'conjunction':
      return 'Conjunctions help connect sentences and ideas smoothly.';
    case 'pronoun':
      return 'Pronouns are often omitted in Korean when the context is clear.';
    case 'determiner':
      return 'Determiners come before nouns and help specify which one you mean.';
    default:
      return '';
  }
}

/**
 * 카테고리별 문화 팁을 반환합니다.
 */
function getCategoryTip(categoryId: string): string | null {
  const categoryTips: Record<string, string> = {
    greetings:
      'Koreans value respectful greetings. Bow slightly when greeting elders or in formal situations.',
    emotions:
      'Expressing emotions directly is common among close friends but may be toned down in formal settings.',
    family:
      'Family terms in Korean reflect hierarchical relationships. Using the wrong term can be awkward.',
    food: 'Food vocabulary is essential in Korean culture. Meals are often shared social events.',
    'k-pop': 'K-pop terms often mix Korean and English. Fans worldwide use these expressions.',
    colors: 'Colors can have cultural significance. White represents purity, red means luck.',
    numbers:
      'Korean has two number systems: native Korean (하나, 둘) and Sino-Korean (일, 이). Learn when to use each.',
    time: 'Time expressions often use Sino-Korean numbers. The word order is Year-Month-Day.',
    weather: 'Weather is a common conversation starter in Korea, just like in many cultures.',
    travel:
      'Learning travel vocabulary helps navigate Korea. Many signs have English, but Korean helps greatly.',
    slang:
      'Slang changes quickly. What sounds cool today might be outdated tomorrow. Use with friends only.',
  };

  return categoryTips[categoryId] || null;
}

/**
 * 일반적인 학습 팁을 반환합니다.
 */
function getGeneralTips(korean: string, translationWord: string): string[] {
  const tips: string[] = [];

  // 단어 길이에 따른 팁
  if (korean.length === 1) {
    tips.push('Single-syllable words are often used in compound words.');
  } else if (korean.length >= 4) {
    tips.push('Longer words may be compound words. Try to identify the root components.');
  }

  // 영어 번역이 여러 단어인 경우
  if (translationWord.includes(' ') || translationWord.includes('/')) {
    tips.push('This Korean word may have multiple meanings depending on context.');
  }

  return tips;
}

export function LearningTips({
  korean,
  difficulty,
  partOfSpeech,
  categoryId,
  translationWord,
}: LearningTipsProps) {
  const difficultyTip = getDifficultyTip(difficulty);
  const partOfSpeechTip = getPartOfSpeechTip(partOfSpeech);
  const categoryTip = getCategoryTip(categoryId);
  const generalTips = getGeneralTips(korean, translationWord);

  const allTips = [difficultyTip, partOfSpeechTip, categoryTip, ...generalTips].filter(
    (tip): tip is string => Boolean(tip),
  );

  // 최대 3개 팁만 표시
  const displayTips = allTips.slice(0, 3);

  if (displayTips.length === 0) {
    return null;
  }

  return (
    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={18} className="text-amber-600 dark:text-amber-400" />
        <h3 className="font-semibold text-amber-900 dark:text-amber-100">Learning Tips</h3>
      </div>

      <ul className="space-y-2">
        {displayTips.map((tip) => (
          <li
            key={tip}
            className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2"
          >
            <span className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0">💡</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>

      {/* 난이도 배지 */}
      <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-700 dark:text-amber-300">Difficulty:</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              difficulty === 'beginner'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                : difficulty === 'intermediate'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
            }`}
          >
            {difficulty === 'beginner'
              ? 'Beginner (TOPIK 1-2)'
              : difficulty === 'intermediate'
                ? 'Intermediate (TOPIK 3-4)'
                : 'Advanced (TOPIK 5-6)'}
          </span>
        </div>
      </div>
    </div>
  );
}
