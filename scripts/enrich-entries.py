#!/usr/bin/env python3
"""
Enrich new entries with romanization, dialogue, and variations.
Adds missing data to all 14,936 new entries.
"""

import json
import os
import re
from pathlib import Path

# Korean to Romanization mapping (Revised Romanization of Korean)
ROMANIZATION_MAP = {
    # Vowels
    'ㅏ': 'a', 'ㅐ': 'ae', 'ㅑ': 'ya', 'ㅒ': 'yae', 'ㅓ': 'eo', 'ㅔ': 'e',
    'ㅕ': 'yeo', 'ㅖ': 'ye', 'ㅗ': 'o', 'ㅘ': 'wa', 'ㅙ': 'wae', 'ㅚ': 'oe',
    'ㅛ': 'yo', 'ㅜ': 'u', 'ㅝ': 'wo', 'ㅞ': 'we', 'ㅟ': 'wi', 'ㅠ': 'yu',
    'ㅡ': 'eu', 'ㅢ': 'ui', 'ㅣ': 'i',

    # Consonants (initial)
    'ㄱ': 'g', 'ㄲ': 'kk', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄸ': 'tt', 'ㄹ': 'r',
    'ㅁ': 'm', 'ㅂ': 'b', 'ㅃ': 'pp', 'ㅅ': 's', 'ㅆ': 'ss', 'ㅇ': '',
    'ㅈ': 'j', 'ㅉ': 'jj', 'ㅊ': 'ch', 'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h',
}

# Final consonants (종성)
FINAL_CONSONANTS = {
    '': '', 'ㄱ': 'k', 'ㄲ': 'k', 'ㄳ': 'k', 'ㄴ': 'n', 'ㄵ': 'n', 'ㄶ': 'n',
    'ㄷ': 't', 'ㄹ': 'l', 'ㄺ': 'k', 'ㄻ': 'm', 'ㄼ': 'l', 'ㄽ': 'l', 'ㄾ': 'l',
    'ㄿ': 'p', 'ㅀ': 'l', 'ㅁ': 'm', 'ㅂ': 'p', 'ㅄ': 'p', 'ㅅ': 't', 'ㅆ': 't',
    'ㅇ': 'ng', 'ㅈ': 't', 'ㅊ': 't', 'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 't',
}

# Decompose Korean character
CHOSUNG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
JUNGSUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ']
JONGSUNG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

def decompose_korean(char):
    """Decompose a Korean character into cho, jung, jong."""
    if '가' <= char <= '힣':
        code = ord(char) - ord('가')
        cho = code // (21 * 28)
        jung = (code % (21 * 28)) // 28
        jong = code % 28
        return CHOSUNG[cho], JUNGSUNG[jung], JONGSUNG[jong]
    return None

def korean_to_romanization(korean_text):
    """Convert Korean text to romanization."""
    result = []
    prev_jong = ''

    for char in korean_text:
        decomposed = decompose_korean(char)
        if decomposed:
            cho, jung, jong = decomposed

            # Handle initial consonant
            cho_rom = ROMANIZATION_MAP.get(cho, '')

            # Special cases for 'ㄹ' as initial after certain finals
            if cho == 'ㄹ' and prev_jong in ['ㄴ', 'ㄹ']:
                cho_rom = 'l'
            elif cho == 'ㅇ' and prev_jong:
                cho_rom = ''  # Silent when following a syllable

            # Handle vowel
            jung_rom = ROMANIZATION_MAP.get(jung, '')

            # Handle final consonant
            jong_rom = FINAL_CONSONANTS.get(jong, '')

            result.append(cho_rom + jung_rom + jong_rom)
            prev_jong = jong
        elif char == ' ':
            result.append(' ')
            prev_jong = ''
        elif char.isascii():
            result.append(char)
            prev_jong = ''
        else:
            result.append(char)
            prev_jong = ''

    return ''.join(result)

def generate_dialogue(korean_word, english_word, category_id):
    """Generate dialogue examples based on word and category."""

    # Category-specific dialogue templates
    category_dialogues = {
        'greetings': {
            'context_ko': '일상에서 인사하며',
            'context_en': 'Greeting in daily life',
            'templates': [
                {'A_ko': f'{korean_word}!', 'B_ko': f'네, {korean_word}!',
                 'A_en': f'{english_word}!', 'B_en': f'Yes, {english_word}!'},
            ]
        },
        'food': {
            'context_ko': '식당에서 주문하며',
            'context_en': 'Ordering at a restaurant',
            'templates': [
                {'A_ko': f'{korean_word} 있어요?', 'B_ko': f'네, {korean_word} 있어요.',
                 'A_en': f'Do you have {english_word}?', 'B_en': f'Yes, we have {english_word}.'},
            ]
        },
        'emotions': {
            'context_ko': '감정을 표현하며',
            'context_en': 'Expressing emotions',
            'templates': [
                {'A_ko': f'지금 기분이 어때요?', 'B_ko': f'{korean_word} 느낌이에요.',
                 'A_en': f'How do you feel now?', 'B_en': f'I feel {english_word}.'},
            ]
        },
        'daily-life': {
            'context_ko': '일상 대화에서',
            'context_en': 'In daily conversation',
            'templates': [
                {'A_ko': f'{korean_word}이/가 뭐예요?', 'B_ko': f'{korean_word}은/는 이거예요.',
                 'A_en': f'What is {english_word}?', 'B_en': f'This is {english_word}.'},
            ]
        },
        'travel': {
            'context_ko': '여행 중 대화에서',
            'context_en': 'While traveling',
            'templates': [
                {'A_ko': f'{korean_word} 어디 있어요?', 'B_ko': f'{korean_word}은/는 저기 있어요.',
                 'A_en': f'Where is {english_word}?', 'B_en': f'{english_word} is over there.'},
            ]
        },
        'work': {
            'context_ko': '직장에서 대화하며',
            'context_en': 'At the workplace',
            'templates': [
                {'A_ko': f'{korean_word} 처리했어요?', 'B_ko': f'네, {korean_word} 완료했어요.',
                 'A_en': f'Did you handle {english_word}?', 'B_en': f'Yes, I finished {english_word}.'},
            ]
        },
        'shopping': {
            'context_ko': '쇼핑하며',
            'context_en': 'While shopping',
            'templates': [
                {'A_ko': f'{korean_word} 얼마예요?', 'B_ko': f'{korean_word}은/는 만 원이에요.',
                 'A_en': f'How much is {english_word}?', 'B_en': f'{english_word} is 10,000 won.'},
            ]
        },
    }

    # Default template
    default = {
        'context_ko': '일상 대화에서',
        'context_en': 'In daily conversation',
        'templates': [
            {'A_ko': f'{korean_word}이/가 뭐예요?', 'B_ko': f'{korean_word}은/는 {english_word}(이)에요.',
             'A_en': f'What is "{korean_word}"?', 'B_en': f'"{korean_word}" means "{english_word}".'},
        ]
    }

    config = category_dialogues.get(category_id, default)
    template = config['templates'][0]

    romanization_a = korean_to_romanization(template['A_ko'])
    romanization_b = korean_to_romanization(template['B_ko'])

    return {
        'ko': {
            'context': config['context_ko'],
            'dialogue': [
                {'speaker': 'A', 'text': template['A_ko'], 'romanization': romanization_a, 'translation': template['A_en']},
                {'speaker': 'B', 'text': template['B_ko'], 'romanization': romanization_b, 'translation': template['B_en']},
            ]
        },
        'en': {
            'context': config['context_en'],
            'dialogue': [
                {'speaker': 'A', 'text': template['A_en'], 'romanization': '', 'translation': template['A_ko']},
                {'speaker': 'B', 'text': template['B_en'], 'romanization': '', 'translation': template['B_ko']},
            ]
        }
    }

def generate_variations(korean_word, english_word, category_id):
    """Generate formal/casual/short variations."""

    # Common patterns
    formal_patterns_ko = [
        f'{korean_word}입니다.',
        f'{korean_word}이/가 있습니다.',
    ]
    casual_patterns_ko = [
        f'{korean_word}이야.',
        f'{korean_word} 있어.',
    ]
    short_patterns_ko = [
        korean_word[:2] if len(korean_word) > 2 else korean_word,
    ]

    formal_patterns_en = [
        f'It is {english_word}.',
        f'There is {english_word}.',
    ]
    casual_patterns_en = [
        f"It's {english_word}.",
        f'{english_word}, you know.',
    ]
    short_patterns_en = [
        english_word.split()[0] if ' ' in english_word else english_word,
    ]

    return {
        'ko': {
            'formal': formal_patterns_ko,
            'casual': casual_patterns_ko,
            'short': short_patterns_ko,
        },
        'en': {
            'formal': formal_patterns_en,
            'casual': casual_patterns_en,
            'short': short_patterns_en,
        }
    }

def enrich_entry(entry):
    """Enrich a single entry with romanization, dialogue, and variations."""
    korean = entry.get('korean', '')
    english = entry.get('translations', {}).get('en', {}).get('word', '')
    category_id = entry.get('categoryId', 'basic-words')

    # Skip if already has romanization (original entries)
    if entry.get('romanization'):
        return entry

    # Add romanization
    entry['romanization'] = korean_to_romanization(korean)

    # Generate dialogue
    dialogue_data = generate_dialogue(korean, english, category_id)

    # Add dialogue to translations
    if 'translations' in entry:
        if 'ko' in entry['translations']:
            entry['translations']['ko']['dialogue'] = dialogue_data['ko']
            variations = generate_variations(korean, english, category_id)
            entry['translations']['ko']['variations'] = variations['ko']
        if 'en' in entry['translations']:
            entry['translations']['en']['dialogue'] = dialogue_data['en']
            variations = generate_variations(korean, english, category_id)
            entry['translations']['en']['variations'] = variations['en']

    # Add pronunciation field
    ipa = korean_to_romanization(korean)
    entry['pronunciation'] = {
        'korean': f'[{korean}]',
        'ipa': f'[{ipa}]'
    }

    return entry

def process_file(file_path):
    """Process a single JSON file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        entries = json.load(f)

    enriched_count = 0
    for i, entry in enumerate(entries):
        # Check if needs enrichment (no romanization = new entry)
        if not entry.get('romanization'):
            entries[i] = enrich_entry(entry)
            enriched_count += 1

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)

    return len(entries), enriched_count

def main():
    entries_dir = Path('/Volumes/X10 Pro/monorepo-project/public-monorepo/apps/context/app/data/entries')

    # Files that contain original entries (don't modify these)
    original_files = {
        'greetings.json', 'emotions.json', 'daily-life.json', 'food.json',
        'travel.json', 'work.json', 'culture.json', 'numbers.json',
        'music.json', 'art.json', 'sports.json', 'space.json',
        'physics.json', 'math.json', 'time-date.json', 'family.json',
        'shopping.json', 'transportation.json', 'coding.json', 'countries.json'
    }

    # Files to enrich (new files)
    new_files = [
        'basic-words.json', 'colors.json', 'idioms.json', 'onomatopoeia.json',
        'cultural-expressions.json', 'phrasal-verbs.json', 'compound-words.json',
        'verb-stems.json', 'body.json', 'medical.json', 'legal.json',
        'education.json', 'interjections.json', 'adjectives-basic.json',
        'verbs-basic.json', 'particles.json', 'geography.json'
    ]

    total_entries = 0
    total_enriched = 0

    print("=" * 60)
    print("Enriching entries with romanization, dialogue, and variations")
    print("=" * 60)

    for filename in new_files:
        file_path = entries_dir / filename
        if file_path.exists():
            count, enriched = process_file(file_path)
            total_entries += count
            total_enriched += enriched
            print(f"  {filename}: {count} entries, {enriched} enriched")
        else:
            print(f"  {filename}: NOT FOUND")

    # Also process original files that might have new entries added
    print("\nChecking original files for new entries...")
    for filename in original_files:
        file_path = entries_dir / filename
        if file_path.exists():
            count, enriched = process_file(file_path)
            if enriched > 0:
                total_entries += count
                total_enriched += enriched
                print(f"  {filename}: {enriched} new entries enriched")

    print("\n" + "=" * 60)
    print(f"Total: {total_entries} entries processed, {total_enriched} enriched")
    print("=" * 60)

if __name__ == '__main__':
    main()
