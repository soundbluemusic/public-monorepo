/**
 * @fileoverview 음악수학 개념 데이터
 */
import type { MathConcept } from "../types";

export const musicConcepts: MathConcept[] = [
  {
    id: "frequency-ratio",
    name: {
      ko: "주파수 비율",
      en: "Frequency Ratio",
      ja: "周波数比",
    },
    field: "applied-music",
    subfield: "acoustics",
    difficulty: 2,
    content: {
      ko: {
        definition:
          "음정은 두 음의 주파수 비율로 정의됩니다. 같은 비율은 같은 음정을 나타내며, 이것이 화성학의 수학적 기초입니다.",
        formulas: [
          {
            latex: "\\text{옥타브} = 2:1",
            description: "주파수가 2배면 한 옥타브 위",
          },
          {
            latex: "\\text{완전5도} = 3:2",
            description: "가장 협화적인 음정",
          },
          {
            latex: "\\text{완전4도} = 4:3",
            description: "옥타브의 보완",
          },
          {
            latex: "\\text{장3도} = 5:4",
            description: "순정률에서의 장3도",
          },
        ],
        examples: [
          {
            problem: "A4 = 440Hz일 때, A5의 주파수는?",
            solution: "A5 = 440 × 2 = 880Hz (한 옥타브 위)",
          },
          {
            problem: "A4에서 완전5도 위의 E5 주파수는?",
            solution: "E5 = 440 × (3/2) = 660Hz",
          },
        ],
        history: {
          discoveredBy: "피타고라스",
          year: "기원전 6세기",
          background: "현의 길이와 음정의 관계를 발견하여 음악과 수학의 연결을 최초로 규명",
        },
        applications: [
          { field: "악기 제작", description: "현 길이, 관 길이 설계" },
          { field: "화성학", description: "협화음/불협화음 이해" },
          { field: "음향공학", description: "사운드 디자인" },
        ],
      },
      en: {
        definition:
          "Musical intervals are defined by frequency ratios. Same ratio = same interval. This is the mathematical foundation of harmony.",
        formulas: [
          {
            latex: "\\text{Octave} = 2:1",
            description: "Double frequency = one octave up",
          },
          {
            latex: "\\text{Perfect 5th} = 3:2",
            description: "Most consonant interval",
          },
          {
            latex: "\\text{Perfect 4th} = 4:3",
            description: "Complement of octave",
          },
          {
            latex: "\\text{Major 3rd} = 5:4",
            description: "Just intonation major third",
          },
        ],
        examples: [
          {
            problem: "If A4 = 440Hz, what is A5?",
            solution: "A5 = 440 × 2 = 880Hz (one octave up)",
          },
          {
            problem: "What is E5 (perfect 5th above A4)?",
            solution: "E5 = 440 × (3/2) = 660Hz",
          },
        ],
        history: {
          discoveredBy: "Pythagoras",
          year: "6th century BCE",
          background: "Discovered relationship between string length and pitch, first linking music and math",
        },
        applications: [
          { field: "Instrument Making", description: "String/tube length design" },
          { field: "Harmony", description: "Consonance/dissonance understanding" },
          { field: "Sound Engineering", description: "Sound design" },
        ],
      },
    },
    relations: {
      prerequisites: ["ratio", "fraction"],
      nextTopics: ["equal-temperament", "just-intonation"],
      related: ["harmonic-series-music"],
    },
    tags: ["주파수", "음정", "frequency", "interval"],
  },
  {
    id: "equal-temperament",
    name: {
      ko: "12평균율",
      en: "12-Tone Equal Temperament",
      ja: "12平均律",
    },
    field: "applied-music",
    subfield: "tuning",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "12평균율은 옥타브를 12개의 동일한 반음으로 나누는 조율 체계입니다. 모든 조에서 같은 음정을 제공합니다.",
        formulas: [
          {
            latex: "r = \\sqrt[12]{2} = 2^{1/12} \\approx 1.05946",
            description: "반음의 주파수 비율",
          },
          {
            latex: "f_n = f_0 \\times 2^{n/12}",
            description: "n 반음 위의 주파수",
          },
          {
            latex: "\\text{온음} = 2^{2/12} = 2^{1/6} \\approx 1.1225",
            description: "온음 = 2반음",
          },
        ],
        examples: [
          {
            problem: "A4 = 440Hz에서 C5 (3반음 위)의 주파수는?",
            solution: "C5 = 440 × 2^(3/12) = 440 × 1.1892 ≈ 523.25Hz",
          },
          {
            problem: "평균율 완전5도와 순정률 완전5도의 차이는?",
            solution: "평균율: 2^(7/12) ≈ 1.4983, 순정률: 3/2 = 1.5. 차이 ≈ 2센트",
          },
        ],
        history: {
          discoveredBy: "주재육 (중국), 시몬 스테빈 (유럽)",
          year: "1584년 (중국), 1605년 (유럽)",
          background: "바흐의 평균율 클라비어곡집으로 널리 보급됨",
        },
        applications: [
          { field: "피아노 조율", description: "표준 조율 체계" },
          { field: "전자음악", description: "MIDI 표준" },
          { field: "조옮김", description: "모든 조에서 동일한 연주 가능" },
        ],
      },
      en: {
        definition:
          "12-TET divides the octave into 12 equal semitones. Provides consistent intervals in all keys.",
        formulas: [
          {
            latex: "r = \\sqrt[12]{2} = 2^{1/12} \\approx 1.05946",
            description: "Semitone frequency ratio",
          },
          {
            latex: "f_n = f_0 \\times 2^{n/12}",
            description: "Frequency n semitones up",
          },
          {
            latex: "\\text{Whole tone} = 2^{2/12} = 2^{1/6} \\approx 1.1225",
            description: "Whole tone = 2 semitones",
          },
        ],
        examples: [
          {
            problem: "A4 = 440Hz. What is C5 (3 semitones up)?",
            solution: "C5 = 440 × 2^(3/12) = 440 × 1.1892 ≈ 523.25Hz",
          },
          {
            problem: "Difference between equal and just perfect 5th?",
            solution: "Equal: 2^(7/12) ≈ 1.4983, Just: 3/2 = 1.5. Diff ≈ 2 cents",
          },
        ],
        history: {
          discoveredBy: "Zhu Zaiyu (China), Simon Stevin (Europe)",
          year: "1584 (China), 1605 (Europe)",
          background: "Popularized by Bach's Well-Tempered Clavier",
        },
        applications: [
          { field: "Piano Tuning", description: "Standard tuning system" },
          { field: "Electronic Music", description: "MIDI standard" },
          { field: "Transposition", description: "Play in any key equally" },
        ],
      },
    },
    relations: {
      prerequisites: ["frequency-ratio", "exponents", "logarithm"],
      nextTopics: ["microtonal", "pythagorean-tuning"],
      related: ["sqrt2-constant"],
    },
    tags: ["평균율", "조율", "temperament", "tuning"],
  },
  {
    id: "time-signature",
    name: {
      ko: "박자",
      en: "Time Signature",
      ja: "拍子",
    },
    field: "applied-music",
    subfield: "rhythm",
    difficulty: 1,
    content: {
      ko: {
        definition:
          "박자는 음악에서 시간을 분할하는 방식입니다. 분수 형태로 표기하며, 위는 박 수, 아래는 기준 음표를 나타냅니다.",
        formulas: [
          {
            latex: "\\frac{\\text{박 수}}{\\text{기준 음표}}",
            description: "박자표 형식",
          },
          {
            latex: "\\frac{4}{4} = \\text{4분음표가 한 마디에 4개}",
            description: "4/4 박자 (보통박자)",
          },
          {
            latex: "\\frac{3}{4} = \\text{4분음표가 한 마디에 3개}",
            description: "3/4 박자 (왈츠)",
          },
          {
            latex: "\\frac{6}{8} = \\text{8분음표가 한 마디에 6개}",
            description: "6/8 박자 (겹박자)",
          },
        ],
        examples: [
          {
            problem: "4/4 박자에서 한 마디의 총 박 길이는?",
            solution: "4분음표 4개 = 온음표 1개 길이",
          },
          {
            problem: "6/8과 3/4의 차이는?",
            solution: "6/8은 2박 계열 (점4분음표 2개), 3/4은 3박 계열",
          },
        ],
        applications: [
          { field: "작곡", description: "리듬 구조 설계" },
          { field: "연주", description: "박자 맞춰 연주" },
          { field: "댄스", description: "춤 스텝과 음악 동기화" },
        ],
      },
      en: {
        definition:
          "Time signature divides time in music. Written as fraction: top = beats per measure, bottom = note value per beat.",
        formulas: [
          {
            latex: "\\frac{\\text{beats}}{\\text{note value}}",
            description: "Time signature format",
          },
          {
            latex: "\\frac{4}{4} = \\text{4 quarter notes per measure}",
            description: "4/4 (common time)",
          },
          {
            latex: "\\frac{3}{4} = \\text{3 quarter notes per measure}",
            description: "3/4 (waltz)",
          },
          {
            latex: "\\frac{6}{8} = \\text{6 eighth notes per measure}",
            description: "6/8 (compound duple)",
          },
        ],
        examples: [
          {
            problem: "Total beat length of one measure in 4/4?",
            solution: "4 quarter notes = 1 whole note",
          },
          {
            problem: "Difference between 6/8 and 3/4?",
            solution: "6/8 is duple (2 dotted quarters), 3/4 is triple",
          },
        ],
        applications: [
          { field: "Composition", description: "Rhythmic structure design" },
          { field: "Performance", description: "Playing in time" },
          { field: "Dance", description: "Synchronizing steps to music" },
        ],
      },
    },
    relations: {
      prerequisites: ["fraction"],
      nextTopics: ["polyrhythm", "odd-meters"],
      related: ["division"],
    },
    tags: ["박자", "리듬", "time signature", "rhythm"],
  },
  {
    id: "harmonic-series-music",
    name: {
      ko: "배음렬",
      en: "Harmonic Series (Music)",
      ja: "倍音列",
    },
    field: "applied-music",
    subfield: "acoustics",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "배음렬은 기본음 위에 자연스럽게 발생하는 배음들의 주파수 패턴입니다. 악기의 음색을 결정하고 화성의 기초가 됩니다.",
        formulas: [
          {
            latex: "f_n = n \\times f_1",
            description: "n번째 배음 주파수",
          },
          {
            latex: "\\text{배음}: f, 2f, 3f, 4f, 5f, 6f, ...",
            description: "배음렬 패턴",
          },
          {
            latex: "\\text{음정}: \\text{기본음}, \\text{옥타브}, \\text{5도}, \\text{옥타브}, \\text{장3도}, \\text{5도}, ...",
            description: "배음에 해당하는 음정",
          },
        ],
        examples: [
          {
            problem: "C2(65.4Hz)의 처음 6개 배음은?",
            solution: "65.4, 130.8(C3), 196.2(G3), 261.6(C4), 327(E4), 392.4(G4)",
          },
          {
            problem: "왜 장3화음이 협화적인가?",
            solution: "장3화음(1, 3, 5도)은 배음렬의 4:5:6 비율과 일치하여 자연스러움",
          },
        ],
        history: {
          discoveredBy: "피타고라스, 조제프 소보르",
          year: "기원전 6세기 ~ 1701년",
          background: "자연에서 발생하는 음향 현상의 수학적 분석",
        },
        applications: [
          { field: "악기 설계", description: "음색 조절" },
          { field: "보컬 기법", description: "오버톤 싱잉" },
          { field: "오케스트레이션", description: "악기 조합" },
        ],
      },
      en: {
        definition:
          "Harmonic series is the pattern of overtones naturally occurring above a fundamental. Determines timbre and underlies harmony.",
        formulas: [
          {
            latex: "f_n = n \\times f_1",
            description: "nth harmonic frequency",
          },
          {
            latex: "\\text{Harmonics}: f, 2f, 3f, 4f, 5f, 6f, ...",
            description: "Harmonic series pattern",
          },
          {
            latex: "\\text{Intervals}: \\text{root}, \\text{octave}, \\text{5th}, \\text{octave}, \\text{M3}, \\text{5th}, ...",
            description: "Intervals corresponding to harmonics",
          },
        ],
        examples: [
          {
            problem: "First 6 harmonics of C2 (65.4Hz)?",
            solution: "65.4, 130.8(C3), 196.2(G3), 261.6(C4), 327(E4), 392.4(G4)",
          },
          {
            problem: "Why is major triad consonant?",
            solution: "Major triad (1, 3, 5) matches harmonic series ratio 4:5:6",
          },
        ],
        history: {
          discoveredBy: "Pythagoras, Joseph Sauveur",
          year: "6th century BCE - 1701",
          background: "Mathematical analysis of natural acoustic phenomena",
        },
        applications: [
          { field: "Instrument Design", description: "Timbre control" },
          { field: "Vocal Technique", description: "Overtone singing" },
          { field: "Orchestration", description: "Instrument combination" },
        ],
      },
    },
    relations: {
      prerequisites: ["frequency-ratio", "multiplication"],
      nextTopics: ["spectral-analysis", "fourier-series"],
      related: ["standing-waves"],
    },
    tags: ["배음", "음색", "harmonics", "overtone"],
  },
  {
    id: "chord-theory",
    name: {
      ko: "화음 이론",
      en: "Chord Theory",
      ja: "和音理論",
    },
    field: "applied-music",
    subfield: "harmony",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "화음은 동시에 울리는 3개 이상의 음입니다. 음정 관계의 수학적 구조가 화음의 성격을 결정합니다.",
        formulas: [
          {
            latex: "\\text{장3화음} = \\text{근음} + \\text{장3도} + \\text{완전5도}",
            description: "장3화음 구조 (반음: 0-4-7)",
          },
          {
            latex: "\\text{단3화음} = \\text{근음} + \\text{단3도} + \\text{완전5도}",
            description: "단3화음 구조 (반음: 0-3-7)",
          },
          {
            latex: "\\text{감3화음} = \\text{근음} + \\text{단3도} + \\text{감5도}",
            description: "감3화음 구조 (반음: 0-3-6)",
          },
          {
            latex: "\\text{증3화음} = \\text{근음} + \\text{장3도} + \\text{증5도}",
            description: "증3화음 구조 (반음: 0-4-8)",
          },
        ],
        examples: [
          {
            problem: "C장3화음의 구성음은?",
            solution: "C(0) + E(4반음) + G(7반음) = C-E-G",
          },
          {
            problem: "A단3화음의 구성음은?",
            solution: "A(0) + C(3반음) + E(7반음) = A-C-E",
          },
        ],
        applications: [
          { field: "작곡", description: "화성 진행 설계" },
          { field: "편곡", description: "보이싱과 화음 확장" },
          { field: "즉흥연주", description: "코드 톤 활용" },
        ],
      },
      en: {
        definition:
          "A chord is 3+ notes sounding together. Mathematical structure of intervals determines chord character.",
        formulas: [
          {
            latex: "\\text{Major triad} = \\text{root} + \\text{M3} + \\text{P5}",
            description: "Major triad structure (semitones: 0-4-7)",
          },
          {
            latex: "\\text{Minor triad} = \\text{root} + \\text{m3} + \\text{P5}",
            description: "Minor triad structure (semitones: 0-3-7)",
          },
          {
            latex: "\\text{Diminished} = \\text{root} + \\text{m3} + \\text{d5}",
            description: "Diminished triad (semitones: 0-3-6)",
          },
          {
            latex: "\\text{Augmented} = \\text{root} + \\text{M3} + \\text{A5}",
            description: "Augmented triad (semitones: 0-4-8)",
          },
        ],
        examples: [
          {
            problem: "Notes in C major triad?",
            solution: "C(0) + E(4 semitones) + G(7 semitones) = C-E-G",
          },
          {
            problem: "Notes in A minor triad?",
            solution: "A(0) + C(3 semitones) + E(7 semitones) = A-C-E",
          },
        ],
        applications: [
          { field: "Composition", description: "Harmonic progression design" },
          { field: "Arrangement", description: "Voicing and chord extensions" },
          { field: "Improvisation", description: "Using chord tones" },
        ],
      },
    },
    relations: {
      prerequisites: ["frequency-ratio", "equal-temperament"],
      nextTopics: ["seventh-chords", "chord-progressions"],
      related: ["harmonic-series-music"],
    },
    tags: ["화음", "화성", "chord", "harmony"],
  },
  {
    id: "decibel-scale",
    name: {
      ko: "데시벨 스케일",
      en: "Decibel Scale",
      ja: "デシベルスケール",
    },
    field: "applied-music",
    subfield: "acoustics",
    difficulty: 3,
    content: {
      ko: {
        definition:
          "데시벨(dB)은 소리 크기의 로그 스케일입니다. 인간의 청각이 로그적으로 인식하기 때문에 사용됩니다.",
        formulas: [
          {
            latex: "L = 10 \\log_{10}\\left(\\frac{I}{I_0}\\right) \\text{ dB}",
            description: "음압 레벨 (강도 기준)",
          },
          {
            latex: "L = 20 \\log_{10}\\left(\\frac{P}{P_0}\\right) \\text{ dB}",
            description: "음압 레벨 (압력 기준)",
          },
          {
            latex: "I_0 = 10^{-12} \\text{ W/m}^2",
            description: "기준 강도 (청력 역치)",
          },
          {
            latex: "+3\\text{dB} \\approx \\times 2 \\text{ (강도)}",
            description: "3dB 증가 = 강도 2배",
          },
        ],
        examples: [
          {
            problem: "속삭임(30dB)과 대화(60dB)의 강도 차이는?",
            solution: "30dB 차이 = 10^(30/10) = 1000배 강도 차이",
          },
          {
            problem: "2개의 같은 소리가 합쳐지면?",
            solution: "강도 2배 → +3dB 증가",
          },
        ],
        applications: [
          { field: "음향 측정", description: "소음 레벨 측정" },
          { field: "오디오 엔지니어링", description: "믹싱, 마스터링" },
          { field: "청력 보호", description: "안전 기준 설정" },
        ],
      },
      en: {
        definition:
          "Decibel (dB) is a logarithmic scale for sound intensity. Used because human hearing perceives logarithmically.",
        formulas: [
          {
            latex: "L = 10 \\log_{10}\\left(\\frac{I}{I_0}\\right) \\text{ dB}",
            description: "Sound level (intensity basis)",
          },
          {
            latex: "L = 20 \\log_{10}\\left(\\frac{P}{P_0}\\right) \\text{ dB}",
            description: "Sound level (pressure basis)",
          },
          {
            latex: "I_0 = 10^{-12} \\text{ W/m}^2",
            description: "Reference intensity (hearing threshold)",
          },
          {
            latex: "+3\\text{dB} \\approx \\times 2 \\text{ (intensity)}",
            description: "+3dB = double intensity",
          },
        ],
        examples: [
          {
            problem: "Intensity difference: whisper (30dB) vs conversation (60dB)?",
            solution: "30dB difference = 10^(30/10) = 1000× intensity difference",
          },
          {
            problem: "Two identical sounds combined?",
            solution: "2× intensity → +3dB increase",
          },
        ],
        applications: [
          { field: "Acoustics", description: "Noise level measurement" },
          { field: "Audio Engineering", description: "Mixing, mastering" },
          { field: "Hearing Protection", description: "Safety standards" },
        ],
      },
    },
    relations: {
      prerequisites: ["logarithm"],
      nextTopics: ["sound-intensity", "audio-compression"],
      related: ["weber-fechner-law"],
    },
    tags: ["데시벨", "음량", "decibel", "acoustics"],
  },
];
