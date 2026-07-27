import type { Library } from '../library-types';

export const visualsGraphicsLibraries: Library[] = [
  {
    name: 'CanvasKit',
    description: 'Skia graphics library compiled to WebAssembly',
    descriptionKo: 'WebAssembly로 컴파일된 Skia 그래픽 라이브러리',
    categories: ['Visuals & Graphics'],
    license: 'BSD-3-Clause',
    github: 'https://github.com/google/skia',
    website: 'https://skia.org/docs/user/modules/canvaskit/',
    npm: 'canvaskit-wasm',
    stars: '11k',
    trending: true,
    yearReleased: 2019,
    wasmBased: true,
    tags: ['WASM', 'Graphics', 'Skia'],
    useCases: {
      en: 'High-performance 2D graphics, Flutter web rendering, PDF generation, SVG rendering',
      ko: '고성능 2D 그래픽, Flutter 웹 렌더링, PDF 생성, SVG 렌더링',
    },
    codeExample: `import CanvasKitInit from 'canvaskit-wasm';
const CanvasKit = await CanvasKitInit();
const surface = CanvasKit.MakeCanvasSurface('canvas');
const canvas = surface.getCanvas();`,
  },
  {
    name: 'Konva',
    description: '2D canvas library for desktop and mobile',
    descriptionKo: '데스크톱 및 모바일용 2D 캔버스 라이브러리',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/konvajs/konva',
    website: 'https://konvajs.org',
    npm: 'konva',
    stars: '11k',
    trending: true,
    yearReleased: 2015,
    tags: ['Canvas', '2D', 'Interactive'],
    useCases: {
      en: 'Interactive graphics, drag-and-drop editors, data visualization, image annotation',
      ko: '인터랙티브 그래픽, 드래그 앤 드롭 에디터, 데이터 시각화, 이미지 주석',
    },
    codeExample: `import Konva from 'konva';
const stage = new Konva.Stage({ container: 'container', width: 500, height: 500 });
const layer = new Konva.Layer();
const circle = new Konva.Circle({ x: 100, y: 100, radius: 50, fill: 'red' });
layer.add(circle); stage.add(layer);`,
  },
  {
    name: 'Fabric.js',
    description: 'Powerful canvas library with interactive object model',
    descriptionKo: '인터랙티브 객체 모델을 갖춘 강력한 캔버스 라이브러리',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/fabricjs/fabric.js',
    website: 'https://fabricjs.com',
    npm: 'fabric',
    stars: '29k',
    yearReleased: 2010,
    tags: ['Canvas', 'Editor', 'SVG'],
    useCases: {
      en: 'Image editors, design tools, whiteboard apps, canvas-based games',
      ko: '이미지 에디터, 디자인 도구, 화이트보드 앱, 캔버스 기반 게임',
    },
    codeExample: `import { Canvas, Rect } from 'fabric';
const canvas = new Canvas('c');
const rect = new Rect({ left: 100, top: 100, fill: 'red', width: 50, height: 50 });
canvas.add(rect);`,
  },
  {
    name: 'Paper.js',
    description: 'Vector graphics scripting framework',
    descriptionKo: '벡터 그래픽 스크립팅 프레임워크',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/paperjs/paper.js',
    npm: 'paper',
    stars: '14k',
    yearReleased: 2011,
    tags: ['Canvas', 'Vector', 'SVG'],
    useCases: {
      en: 'Vector illustrations, generative art, path manipulation, interactive graphics',
      ko: '벡터 일러스트레이션, 제너레이티브 아트, 경로 조작, 인터랙티브 그래픽',
    },
    codeExample: `import paper from 'paper';
paper.setup('myCanvas');
const path = new paper.Path.Circle(new paper.Point(80, 50), 30);
path.fillColor = 'red';`,
  },
  {
    name: 'p5.js',
    description: 'JavaScript library for creative coding',
    descriptionKo: '크리에이티브 코딩을 위한 JavaScript 라이브러리',
    categories: ['Visuals & Graphics'],
    license: 'LGPL-2.1',
    github: 'https://github.com/processing/p5.js',
    website: 'https://p5js.org',
    npm: 'p5',
    stars: '22k',
    yearReleased: 2014,
    tags: ['Creative', 'Art', 'Education'],
    useCases: {
      en: 'Creative coding, generative art, interactive visualizations, educational projects',
      ko: '크리에이티브 코딩, 제너레이티브 아트, 인터랙티브 시각화, 교육 프로젝트',
    },
    codeExample: `function setup() {
  createCanvas(400, 400);
}
function draw() {
  background(220);
  ellipse(mouseX, mouseY, 50, 50);
}`,
  },
  {
    name: 'Three.js',
    description: '3D library for creating WebGL content',
    descriptionKo: 'WebGL 콘텐츠 생성을 위한 3D 라이브러리',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/mrdoob/three.js',
    website: 'https://threejs.org',
    npm: 'three',
    stars: '103k',
    trending: true,
    yearReleased: 2010,
    tags: ['3D', 'WebGL', 'Graphics'],
    useCases: {
      en: '3D games, product visualizers, architectural visualization, VR/AR experiences',
      ko: '3D 게임, 제품 시각화, 건축 시각화, VR/AR 경험',
    },
    codeExample: `import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();`,
  },
  {
    name: 'Babylon.js',
    description: 'Powerful 3D game engine for the web',
    descriptionKo: '웹을 위한 강력한 3D 게임 엔진',
    categories: ['Visuals & Graphics'],
    license: 'Apache-2.0',
    github: 'https://github.com/BabylonJS/Babylon.js',
    website: 'https://www.babylonjs.com',
    npm: '@babylonjs/core',
    stars: '23k',
    trending: true,
    yearReleased: 2013,
    tags: ['3D', 'Game Engine', 'WebGL'],
    useCases: {
      en: '3D games, interactive 3D experiences, product configurators, virtual showrooms',
      ko: '3D 게임, 인터랙티브 3D 경험, 제품 구성기, 가상 쇼룸',
    },
    codeExample: `import { Engine, Scene, FreeCamera, HemisphericLight } from '@babylonjs/core';
const engine = new Engine(canvas, true);
const scene = new Scene(engine);`,
  },
  {
    name: 'React Three Fiber',
    description: 'React renderer for Three.js',
    descriptionKo: 'Three.js를 위한 React 렌더러',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/pmndrs/react-three-fiber',
    website: 'https://pmndrs.github.io/react-three-fiber/',
    npm: '@react-three/fiber',
    stars: '28k',
    trending: true,
    yearReleased: 2019,
    tags: ['React', 'Three.js', '3D'],
    useCases: {
      en: 'Declarative 3D in React, interactive 3D components, 3D data visualization',
      ko: 'React에서 선언적 3D, 인터랙티브 3D 컴포넌트, 3D 데이터 시각화',
    },
    codeExample: `import { Canvas } from '@react-three/fiber';
function App() {
  return <Canvas><mesh><boxGeometry /><meshStandardMaterial /></mesh></Canvas>;
}`,
  },
  {
    name: 'A-Frame',
    description: 'Web framework for building VR experiences',
    descriptionKo: 'VR 경험 구축을 위한 웹 프레임워크',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/aframevr/aframe',
    website: 'https://aframe.io',
    npm: 'aframe',
    stars: '17k',
    yearReleased: 2015,
    tags: ['VR', 'AR', 'WebXR'],
    useCases: {
      en: 'VR websites, AR experiences, 360 tours, immersive storytelling',
      ko: 'VR 웹사이트, AR 경험, 360도 투어, 몰입형 스토리텔링',
    },
    codeExample: `<a-scene>
  <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
  <a-sky color="#ECECEC"></a-sky>
</a-scene>`,
  },
  {
    name: 'Sharp',
    description: 'High performance image processing',
    descriptionKo: '고성능 이미지 처리',
    categories: ['Visuals & Graphics'],
    license: 'Apache-2.0',
    github: 'https://github.com/lovell/sharp',
    website: 'https://sharp.pixelplumbing.com',
    npm: 'sharp',
    stars: '29k',
    trending: true,
    yearReleased: 2013,
    tags: ['Image', 'Resize', 'Convert'],
    useCases: {
      en: 'Image resizing, format conversion, thumbnail generation, image optimization',
      ko: '이미지 리사이징, 포맷 변환, 썸네일 생성, 이미지 최적화',
    },
    codeExample: `import sharp from 'sharp';
await sharp('input.jpg')
  .resize(300, 200)
  .toFormat('webp')
  .toFile('output.webp');`,
  },
  {
    name: 'Jimp',
    description: 'JavaScript Image Manipulation Program',
    descriptionKo: 'JavaScript 이미지 조작 프로그램',
    categories: ['Visuals & Graphics'],
    license: 'MIT',
    github: 'https://github.com/jimp-dev/jimp',
    npm: 'jimp',
    stars: '14k',
    yearReleased: 2014,
    tags: ['Image', 'Pure JS', 'Manipulation'],
    useCases: {
      en: 'Image manipulation without native dependencies, browser image editing, Node.js processing',
      ko: '네이티브 의존성 없는 이미지 조작, 브라우저 이미지 편집, Node.js 처리',
    },
    codeExample: `import Jimp from 'jimp';
const image = await Jimp.read('image.png');
image.resize(256, 256).quality(80).write('output.jpg');`,
  },
];
