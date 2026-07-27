import type { Library } from '../library-types';

export const mediaDocumentsLibraries: Library[] = [
  {
    name: 'Tone.js',
    description: 'Web Audio framework for music synthesis',
    descriptionKo: '음악 합성을 위한 Web Audio 프레임워크',
    categories: ['Media & Documents'],
    license: 'MIT',
    github: 'https://github.com/Tonejs/Tone.js',
    website: 'https://tonejs.github.io',
    npm: 'tone',
    stars: '14k',
    trending: true,
    yearReleased: 2014,
    tags: ['Audio', 'Music', 'Synthesizer'],
    useCases: {
      en: 'Music applications, audio synthesis, interactive sound, music education',
      ko: '음악 애플리케이션, 오디오 합성, 인터랙티브 사운드, 음악 교육',
    },
    codeExample: `import * as Tone from 'tone';
const synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease('C4', '8n');`,
  },
  {
    name: 'Howler.js',
    description: 'Audio library for the modern web',
    descriptionKo: '모던 웹을 위한 오디오 라이브러리',
    categories: ['Media & Documents'],
    license: 'MIT',
    github: 'https://github.com/goldfire/howler.js',
    website: 'https://howlerjs.com',
    npm: 'howler',
    stars: '25k',
    yearReleased: 2013,
    tags: ['Audio', 'Sound', 'Game'],
    useCases: {
      en: 'Game audio, sound effects, music players, audio sprites',
      ko: '게임 오디오, 사운드 효과, 음악 플레이어, 오디오 스프라이트',
    },
    codeExample: `import { Howl } from 'howler';
const sound = new Howl({ src: ['sound.mp3'] });
sound.play();`,
  },
  {
    name: 'WaveSurfer.js',
    description: 'Audio visualization and playback',
    descriptionKo: '오디오 시각화 및 재생',
    categories: ['Media & Documents'],
    license: 'BSD-3-Clause',
    github: 'https://github.com/katspaugh/wavesurfer.js',
    website: 'https://wavesurfer.xyz',
    npm: 'wavesurfer.js',
    stars: '10k',
    trending: true,
    yearReleased: 2013,
    tags: ['Audio', 'Waveform', 'Visualization'],
    useCases: {
      en: 'Audio waveform display, podcast players, audio editors, music visualization',
      ko: '오디오 파형 표시, 팟캐스트 플레이어, 오디오 에디터, 음악 시각화',
    },
    codeExample: `import WaveSurfer from 'wavesurfer.js';
const wavesurfer = WaveSurfer.create({ container: '#waveform' });
wavesurfer.load('audio.mp3');`,
  },
  {
    name: 'Video.js',
    description: 'HTML5 video player framework',
    descriptionKo: 'HTML5 비디오 플레이어 프레임워크',
    categories: ['Media & Documents'],
    license: 'Apache-2.0',
    github: 'https://github.com/videojs/video.js',
    website: 'https://videojs.org',
    npm: 'video.js',
    stars: '38k',
    yearReleased: 2010,
    tags: ['Video', 'Player', 'Streaming'],
    useCases: {
      en: 'Video streaming, custom video players, HLS/DASH playback, video ads',
      ko: '비디오 스트리밍, 커스텀 비디오 플레이어, HLS/DASH 재생, 비디오 광고',
    },
    codeExample: `import videojs from 'video.js';
const player = videojs('my-video', { controls: true, autoplay: false });
player.src({ type: 'video/mp4', src: 'video.mp4' });`,
  },
  {
    name: 'PDF.js',
    description: 'PDF reader built with JavaScript',
    descriptionKo: 'JavaScript로 만든 PDF 리더',
    categories: ['Media & Documents'],
    license: 'Apache-2.0',
    github: 'https://github.com/mozilla/pdf.js',
    website: 'https://mozilla.github.io/pdf.js/',
    npm: 'pdfjs-dist',
    stars: '53k',
    yearReleased: 2011,
    tags: ['PDF', 'Viewer', 'Mozilla'],
    useCases: {
      en: 'PDF rendering, document viewers, PDF to canvas, text extraction',
      ko: 'PDF 렌더링, 문서 뷰어, PDF를 캔버스로, 텍스트 추출',
    },
    codeExample: `import * as pdfjsLib from 'pdfjs-dist';
const pdf = await pdfjsLib.getDocument('document.pdf').promise;
const page = await pdf.getPage(1);`,
  },
  {
    name: 'Mammoth',
    description: 'Convert Word documents to HTML',
    descriptionKo: 'Word 문서를 HTML로 변환',
    categories: ['Media & Documents'],
    license: 'BSD-2-Clause',
    github: 'https://github.com/mwilliamson/mammoth.js',
    npm: 'mammoth',
    stars: '6k',
    yearReleased: 2014,
    tags: ['Word', 'DOCX', 'HTML'],
    useCases: {
      en: 'DOCX to HTML conversion, document import, content migration, CMS integration',
      ko: 'DOCX를 HTML로 변환, 문서 가져오기, 콘텐츠 마이그레이션, CMS 통합',
    },
    codeExample: `import mammoth from 'mammoth';
const result = await mammoth.convertToHtml({ arrayBuffer });
console.log(result.value); // HTML string`,
  },
];
