import type { Library } from '../library-types';

export const aiVisionLibraries: Library[] = [
  {
    name: 'OpenCV.js',
    description: 'OpenCV compiled to JavaScript for browser-based computer vision',
    descriptionKo: '브라우저 기반 컴퓨터 비전을 위해 JavaScript로 컴파일된 OpenCV',
    categories: ['AI & Vision'],
    license: 'Apache-2.0',
    github: 'https://github.com/opencv/opencv',
    website: 'https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html',
    npm: '@techstark/opencv-js',
    stars: '79k',
    trending: true,
    yearReleased: 2017,
    wasmBased: true,
    tags: ['WASM', 'Vision', 'Image'],
    useCases: {
      en: 'Face detection, object tracking, image filtering, edge detection, feature matching',
      ko: '얼굴 감지, 객체 추적, 이미지 필터링, 에지 감지, 특징점 매칭',
    },
    codeExample: `const cv = await import('@techstark/opencv-js');
const src = cv.imread('image');
const dst = new cv.Mat();
cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
cv.imshow('output', dst);`,
  },
  {
    name: 'MediaPipe',
    description: 'Google ML solutions for face, hand, and pose detection',
    descriptionKo: '얼굴, 손, 자세 감지를 위한 Google ML 솔루션',
    categories: ['AI & Vision'],
    license: 'Apache-2.0',
    github: 'https://github.com/google-ai-edge/mediapipe',
    website: 'https://ai.google.dev/edge/mediapipe/solutions/guide',
    npm: '@mediapipe/tasks-vision',
    stars: '28k',
    trending: true,
    yearReleased: 2019,
    wasmBased: true,
    tags: ['ML', 'Google', 'Pose', 'Hand'],
    useCases: {
      en: 'Hand tracking, pose estimation, face mesh, gesture recognition, AR filters',
      ko: '손 추적, 자세 추정, 얼굴 메시, 제스처 인식, AR 필터',
    },
    codeExample: `import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
const vision = await FilesetResolver.forVisionTasks('...');
const landmarker = await FaceLandmarker.createFromOptions(vision, { ... });
const results = landmarker.detect(image);`,
  },
  {
    name: 'TensorFlow.js',
    description: 'Machine learning library for JavaScript',
    descriptionKo: 'JavaScript용 머신러닝 라이브러리',
    categories: ['AI & Vision'],
    license: 'Apache-2.0',
    github: 'https://github.com/tensorflow/tfjs',
    website: 'https://www.tensorflow.org/js',
    npm: '@tensorflow/tfjs',
    stars: '18k',
    trending: true,
    yearReleased: 2018,
    wasmBased: true,
    tags: ['ML', 'AI', 'Google', 'WASM'],
    useCases: {
      en: 'Train ML models in browser, run pre-trained models, transfer learning, real-time predictions',
      ko: '브라우저에서 ML 모델 학습, 사전 학습 모델 실행, 전이 학습, 실시간 예측',
    },
    codeExample: `import * as tf from '@tensorflow/tfjs';
const model = tf.sequential();
model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });`,
  },
  {
    name: 'ONNX Runtime Web',
    description: 'Run ONNX models in browser with WebAssembly/WebGL',
    descriptionKo: 'WebAssembly/WebGL로 브라우저에서 ONNX 모델 실행',
    categories: ['AI & Vision'],
    license: 'MIT',
    github: 'https://github.com/microsoft/onnxruntime',
    website: 'https://onnxruntime.ai',
    npm: 'onnxruntime-web',
    stars: '15k',
    trending: true,
    yearReleased: 2019,
    wasmBased: true,
    tags: ['ML', 'ONNX', 'Microsoft', 'WASM'],
    useCases: {
      en: 'Run PyTorch/TensorFlow models in browser, cross-platform ML inference, edge AI',
      ko: '브라우저에서 PyTorch/TensorFlow 모델 실행, 크로스 플랫폼 ML 추론, 엣지 AI',
    },
    codeExample: `import * as ort from 'onnxruntime-web';
const session = await ort.InferenceSession.create('model.onnx');
const results = await session.run({ input: tensor });`,
  },
  {
    name: 'Transformers.js',
    description: 'Run Hugging Face transformers in the browser',
    descriptionKo: '브라우저에서 Hugging Face 트랜스포머 실행',
    categories: ['AI & Vision'],
    license: 'Apache-2.0',
    github: 'https://github.com/huggingface/transformers.js',
    website: 'https://huggingface.co/docs/transformers.js/index',
    npm: '@huggingface/transformers',
    stars: '16k',
    trending: true,
    yearReleased: 2023,
    wasmBased: true,
    tags: ['ML', 'NLP', 'Hugging Face', 'WASM'],
    useCases: {
      en: 'Text generation, translation, summarization, sentiment analysis, image classification',
      ko: '텍스트 생성, 번역, 요약, 감정 분석, 이미지 분류',
    },
    codeExample: `import { pipeline } from '@huggingface/transformers';
const classifier = await pipeline('sentiment-analysis');
const result = await classifier('I love this!');
// [{ label: 'POSITIVE', score: 0.99 }]`,
  },
  {
    name: 'ml5.js',
    description: 'Friendly machine learning for the web',
    descriptionKo: '웹을 위한 친화적인 머신러닝',
    categories: ['AI & Vision'],
    license: 'MIT',
    github: 'https://github.com/ml5js/ml5-next-gen',
    website: 'https://ml5js.org',
    npm: 'ml5',
    stars: '200',
    yearReleased: 2018,
    tags: ['ML', 'Beginner', 'p5.js'],
    useCases: {
      en: 'Creative coding with ML, beginner-friendly AI, image classification, pose detection',
      ko: 'ML을 활용한 크리에이티브 코딩, 초보자 친화적 AI, 이미지 분류, 자세 감지',
    },
    codeExample: `const classifier = ml5.imageClassifier('MobileNet', modelReady);
function modelReady() {
  classifier.classify(document.getElementById('image'), gotResult);
}`,
  },
  {
    name: 'Brain.js',
    description: 'GPU accelerated neural networks in JavaScript',
    descriptionKo: 'JavaScript에서 GPU 가속 신경망',
    categories: ['AI & Vision'],
    license: 'MIT',
    github: 'https://github.com/BrainJS/brain.js',
    website: 'https://brain.js.org',
    npm: 'brain.js',
    stars: '14k',
    yearReleased: 2010,
    tags: ['ML', 'Neural Network', 'GPU'],
    useCases: {
      en: 'Simple neural networks, pattern recognition, time series prediction, text classification',
      ko: '간단한 신경망, 패턴 인식, 시계열 예측, 텍스트 분류',
    },
    codeExample: `const brain = require('brain.js');
const net = new brain.NeuralNetwork();
net.train([{ input: [0, 0], output: [0] }, { input: [1, 1], output: [1] }]);
const output = net.run([1, 0]);`,
  },
];
