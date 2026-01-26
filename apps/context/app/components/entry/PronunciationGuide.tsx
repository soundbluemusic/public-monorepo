/**
 * @fileoverview 발음 가이드 컴포넌트 (영어 버전 전용)
 *
 * 외국인 한국어 학습자를 위한 발음 가이드를 제공합니다.
 * - 음절 분리 표시
 * - 발음 힌트
 * - 강세 가이드
 */

import { Volume2 } from 'lucide-react';

interface PronunciationGuideProps {
  korean: string;
  romanization: string;
  pronunciation?: {
    korean: string;
    ipa?: string;
  };
}

/**
 * 로마자를 음절로 분리합니다.
 * 한국어 음절 구조에 맞게 대략적으로 분리합니다.
 */
function splitIntoSyllables(romanization: string): string {
  // 일반적인 한국어 로마자 음절 패턴
  // 모음: a, e, i, o, u, ae, eo, eu, oe, ui, wa, we, wi, wo, ya, ye, yo, yu
  const vowelPattern = /([aeiouy]+)/gi;

  // 간단한 음절 분리: 자음 + 모음 패턴으로 분리
  const syllables: string[] = [];
  let current = '';

  for (let i = 0; i < romanization.length; i++) {
    const char = romanization[i] ?? '';
    current += char;

    // 모음 뒤에 자음이 오면 음절 경계
    if (vowelPattern.test(char) && i < romanization.length - 1) {
      const nextChar = romanization[i + 1] ?? '';
      // 다음 문자가 자음이고, 그 다음이 모음이면 분리
      if (!/[aeiou]/i.test(nextChar) && i + 2 < romanization.length) {
        const afterNext = romanization[i + 2] ?? '';
        if (/[aeiou]/i.test(afterNext)) {
          syllables.push(current);
          current = '';
        }
      }
    }
  }

  if (current) {
    syllables.push(current);
  }

  // 최소 2음절 이상일 때만 분리 표시
  return syllables.length > 1 ? syllables.join('·') : romanization;
}

/**
 * 발음 힌트를 생성합니다.
 */
function getPronunciationHints(romanization: string): string[] {
  const hints: string[] = [];
  const lower = romanization.toLowerCase();

  // 특수 발음 패턴 감지
  if (lower.includes('eo')) {
    hints.push('"eo" sounds like "uh" in "butter"');
  }
  if (lower.includes('eu')) {
    hints.push('"eu" is like "oo" but with unrounded lips');
  }
  if (lower.includes('ae')) {
    hints.push('"ae" sounds like "a" in "cat"');
  }
  if (lower.includes('ng')) {
    hints.push('"ng" is a soft nasal sound like in "sing"');
  }
  if (lower.includes('ss')) {
    hints.push('"ss" is a tense "s" sound');
  }
  if (lower.includes('pp')) {
    hints.push('"pp" is a tense, unaspirated "p"');
  }
  if (lower.includes('tt')) {
    hints.push('"tt" is a tense, unaspirated "t"');
  }
  if (lower.includes('kk')) {
    hints.push('"kk" is a tense, unaspirated "k"');
  }
  if (lower.includes('jj')) {
    hints.push('"jj" is a tense "j" sound');
  }

  return hints.slice(0, 2); // 최대 2개만 표시
}

export function PronunciationGuide({
  korean,
  romanization,
  pronunciation,
}: PronunciationGuideProps) {
  const syllabified = splitIntoSyllables(romanization);
  const hints = getPronunciationHints(romanization);

  return (
    <div className="p-4 rounded-xl bg-(--bg-elevated) border border-(--border-primary)">
      <div className="flex items-center gap-2 mb-3">
        <Volume2 size={18} className="text-(--accent-primary)" />
        <h3 className="font-semibold text-(--text-primary)">Pronunciation Guide</h3>
      </div>

      <div className="space-y-3">
        {/* 메인 발음 표시 */}
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-medium text-(--text-primary)">{korean}</span>
          <span className="text-lg text-(--accent-primary) font-mono">[{syllabified}]</span>
        </div>

        {/* IPA 표기 (있는 경우) */}
        {pronunciation?.ipa && (
          <div className="text-sm text-(--text-secondary)">
            <span className="font-medium">IPA:</span>{' '}
            <span className="font-mono">{pronunciation.ipa}</span>
          </div>
        )}

        {/* 발음 힌트 */}
        {hints.length > 0 && (
          <div className="pt-2 border-t border-(--border-secondary)">
            <p className="text-xs font-medium text-(--text-tertiary) mb-1.5">Pronunciation Tips:</p>
            <ul className="space-y-1">
              {hints.map((hint) => (
                <li key={hint} className="text-sm text-(--text-secondary) flex items-start gap-1.5">
                  <span className="text-(--accent-primary) mt-1">•</span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
