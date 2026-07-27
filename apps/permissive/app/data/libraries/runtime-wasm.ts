import type { Library } from '../library-types';

export const runtimeWasmLibraries: Library[] = [
  {
    name: 'Bun',
    description: 'All-in-one JavaScript runtime',
    descriptionKo: '올인원 자바스크립트 런타임',
    categories: ['Runtime & WASM'],
    license: 'MIT',
    github: 'https://github.com/oven-sh/bun',
    website: 'https://bun.sh',
    npm: 'bun',
    stars: '75k',
    trending: true,
    yearReleased: 2021,
    tags: ['Runtime', 'Fast', 'Zig'],
  },
  {
    name: 'Deno',
    description: 'Secure runtime for JavaScript',
    descriptionKo: '안전한 자바스크립트 런타임',
    categories: ['Runtime & WASM'],
    license: 'MIT',
    github: 'https://github.com/denoland/deno',
    website: 'https://deno.com',
    npm: 'deno',
    stars: '97k',
    trending: true,
    yearReleased: 2018,
    tags: ['Runtime', 'Secure', 'Rust'],
  },
  {
    name: 'Node.js',
    description: 'JavaScript runtime built on V8',
    descriptionKo: 'V8 기반 자바스크립트 런타임',
    categories: ['Runtime & WASM'],
    license: 'MIT',
    github: 'https://github.com/nodejs/node',
    website: 'https://nodejs.org/en',
    stars: '108k',
    yearReleased: 2009,
    tags: ['Runtime', 'Classic'],
  },
  {
    name: 'FFmpeg.wasm',
    description: 'FFmpeg compiled to WebAssembly for browser video/audio processing',
    descriptionKo: '브라우저에서 비디오/오디오 처리를 위해 WebAssembly로 컴파일된 FFmpeg',
    categories: ['Runtime & WASM'],
    license: 'MIT',
    github: 'https://github.com/ffmpegwasm/ffmpeg.wasm',
    website: 'https://ffmpegwasm.netlify.app',
    npm: '@ffmpeg/ffmpeg',
    stars: '14k',
    trending: true,
    yearReleased: 2019,
    wasmBased: true,
    tags: ['WASM', 'Video', 'Audio', 'Codec'],
    useCases: {
      en: 'Video editing, format conversion, thumbnail extraction, audio processing in the browser without server',
      ko: '서버 없이 브라우저에서 비디오 편집, 포맷 변환, 썸네일 추출, 오디오 처리',
    },
    codeExample: `import { FFmpeg } from '@ffmpeg/ffmpeg';
const ffmpeg = new FFmpeg();
await ffmpeg.load();
await ffmpeg.exec(['-i', 'input.mp4', 'output.gif']);`,
  },
  {
    name: 'sql.js',
    description: 'SQLite compiled to JavaScript via Emscripten',
    descriptionKo: 'Emscripten을 통해 JavaScript로 컴파일된 SQLite',
    categories: ['Runtime & WASM'],
    license: 'MIT',
    github: 'https://github.com/sql-js/sql.js',
    website: 'https://sql.js.org',
    npm: 'sql.js',
    stars: '13k',
    trending: true,
    yearReleased: 2014,
    wasmBased: true,
    tags: ['WASM', 'Database', 'SQLite'],
    useCases: {
      en: 'Client-side databases, offline-first apps, data analysis in browser, educational SQL tools',
      ko: '클라이언트 측 데이터베이스, 오프라인 우선 앱, 브라우저 데이터 분석, SQL 학습 도구',
    },
    codeExample: `import initSqlJs from 'sql.js';
const SQL = await initSqlJs();
const db = new SQL.Database();
db.run('CREATE TABLE users (id, name)');
db.run('INSERT INTO users VALUES (1, "Alice")');`,
  },
  {
    name: 'Pyodide',
    description: 'Python runtime for the browser via WebAssembly',
    descriptionKo: 'WebAssembly를 통한 브라우저용 Python 런타임',
    categories: ['Runtime & WASM'],
    license: 'MPL-2.0',
    github: 'https://github.com/pyodide/pyodide',
    website: 'https://pyodide.org/en/stable/',
    npm: 'pyodide',
    stars: '12k',
    trending: true,
    yearReleased: 2019,
    wasmBased: true,
    tags: ['WASM', 'Python', 'Scientific'],
    useCases: {
      en: 'Run Python in browser, data science notebooks, NumPy/Pandas in web apps, Python education',
      ko: '브라우저에서 Python 실행, 데이터 과학 노트북, 웹 앱에서 NumPy/Pandas, Python 교육',
    },
    codeExample: `import { loadPyodide } from 'pyodide';
const pyodide = await loadPyodide();
await pyodide.loadPackage('numpy');
const result = pyodide.runPython('import numpy; numpy.array([1, 2, 3])');`,
  },
  {
    name: 'AssemblyScript',
    description: 'TypeScript-like language that compiles to WebAssembly',
    descriptionKo: 'WebAssembly로 컴파일되는 TypeScript 유사 언어',
    categories: ['Runtime & WASM'],
    license: 'Apache-2.0',
    github: 'https://github.com/AssemblyScript/assemblyscript',
    website: 'https://www.assemblyscript.org',
    npm: 'assemblyscript',
    stars: '17k',
    trending: true,
    yearReleased: 2017,
    wasmBased: true,
    tags: ['WASM', 'TypeScript', 'Compiler'],
    useCases: {
      en: 'Write performant WASM modules in TypeScript syntax, game engines, crypto algorithms',
      ko: 'TypeScript 문법으로 고성능 WASM 모듈 작성, 게임 엔진, 암호화 알고리즘',
    },
    codeExample: `// add.ts (AssemblyScript)
export function add(a: i32, b: i32): i32 {
  return a + b;
}
// Compile: asc add.ts -o add.wasm`,
  },
  {
    name: 'wasm-bindgen',
    description: 'Facilitates communication between Rust and JavaScript',
    descriptionKo: 'Rust와 JavaScript 간 통신을 용이하게 하는 도구',
    categories: ['Runtime & WASM'],
    license: 'MIT OR Apache-2.0',
    github: 'https://github.com/wasm-bindgen/wasm-bindgen',
    website: 'https://rustwasm.github.io/docs/wasm-bindgen/',
    stars: '9k',
    yearReleased: 2018,
    wasmBased: true,
    tags: ['WASM', 'Rust', 'Binding'],
    useCases: {
      en: 'Build Rust libraries for web, call JavaScript from Rust, expose Rust APIs to JavaScript',
      ko: '웹용 Rust 라이브러리 빌드, Rust에서 JavaScript 호출, JavaScript에 Rust API 노출',
    },
    codeExample: `// Rust code
use wasm_bindgen::prelude::*;
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}`,
  },
  {
    name: 'Emscripten',
    description: 'LLVM-to-WebAssembly compiler toolchain',
    descriptionKo: 'LLVM에서 WebAssembly로 컴파일하는 툴체인',
    categories: ['Runtime & WASM'],
    license: 'MIT',
    github: 'https://github.com/emscripten-core/emscripten',
    website: 'https://emscripten.org',
    stars: '26k',
    yearReleased: 2011,
    wasmBased: true,
    tags: ['WASM', 'C', 'C++', 'Compiler'],
    useCases: {
      en: 'Port C/C++ libraries to web, compile games to browser, bring native code to JavaScript',
      ko: 'C/C++ 라이브러리를 웹으로 포팅, 게임을 브라우저로 컴파일, 네이티브 코드를 JavaScript로',
    },
    codeExample: `// Compile C code to WASM
// emcc hello.c -o hello.js -s WASM=1
#include <stdio.h>
int main() {
  printf("Hello from WASM!\\n");
  return 0;
}`,
  },
];
