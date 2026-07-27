import type { Library } from '../library-types';

export const dataSecurityLibraries: Library[] = [
  {
    name: 'fflate',
    description: 'High performance (de)compression in pure JavaScript',
    descriptionKo: '순수 JavaScript로 구현된 고성능 (압축/해제)',
    categories: ['Data & Security'],
    license: 'MIT',
    github: 'https://github.com/101arrowz/fflate',
    npm: 'fflate',
    stars: '2k',
    trending: true,
    yearReleased: 2020,
    tags: ['Compression', 'Zip', 'Gzip'],
    useCases: {
      en: 'Compress/decompress files in browser, create ZIP archives, streaming compression',
      ko: '브라우저에서 파일 압축/해제, ZIP 아카이브 생성, 스트리밍 압축',
    },
    codeExample: `import { gzip, gunzip, strToU8, strFromU8 } from 'fflate';
const compressed = gzip(strToU8('Hello World'));
const decompressed = strFromU8(gunzip(compressed));`,
  },
  {
    name: 'brotli-wasm',
    description: 'Brotli compression compiled to WebAssembly',
    descriptionKo: 'WebAssembly로 컴파일된 Brotli 압축',
    categories: ['Data & Security'],
    license: 'Apache-2.0',
    github: 'https://github.com/httptoolkit/brotli-wasm',
    npm: 'brotli-wasm',
    stars: '300',
    yearReleased: 2020,
    wasmBased: true,
    tags: ['WASM', 'Compression', 'Brotli'],
    useCases: {
      en: 'High-ratio compression in browser, decompress Brotli content, web performance',
      ko: '브라우저에서 고비율 압축, Brotli 콘텐츠 해제, 웹 성능',
    },
    codeExample: `import brotli from 'brotli-wasm';
const compressed = brotli.compress(new TextEncoder().encode('Hello'));
const decompressed = brotli.decompress(compressed);`,
  },
  {
    name: 'zstd-codec',
    description: 'Zstandard compression for JavaScript via WASM',
    descriptionKo: 'WASM을 통한 JavaScript용 Zstandard 압축',
    categories: ['Data & Security'],
    license: 'MIT',
    github: 'https://github.com/yoshihitoh/zstd-codec',
    npm: 'zstd-codec',
    stars: '100',
    yearReleased: 2019,
    wasmBased: true,
    tags: ['WASM', 'Compression', 'Zstandard'],
    useCases: {
      en: 'Fast compression/decompression, game assets, large file handling',
      ko: '빠른 압축/해제, 게임 에셋, 대용량 파일 처리',
    },
    codeExample: `import { ZstdCodec } from 'zstd-codec';
ZstdCodec.run(zstd => {
  const compressed = zstd.compress(data);
  const decompressed = zstd.decompress(compressed);
});`,
  },
  {
    name: 'noble-curves',
    description: 'Audited elliptic curve cryptography in JavaScript',
    descriptionKo: '감사된 JavaScript 타원 곡선 암호화',
    categories: ['Data & Security'],
    license: 'MIT',
    github: 'https://github.com/paulmillr/noble-curves',
    npm: '@noble/curves',
    stars: '700',
    trending: true,
    yearReleased: 2022,
    tags: ['Crypto', 'Elliptic Curve', 'Audited'],
    useCases: {
      en: 'Ethereum/Bitcoin signatures, ECDSA, Ed25519, secp256k1, BLS signatures',
      ko: 'Ethereum/Bitcoin 서명, ECDSA, Ed25519, secp256k1, BLS 서명',
    },
    codeExample: `import { secp256k1 } from '@noble/curves/secp256k1';
const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey);`,
  },
  {
    name: 'libsodium.js',
    description: 'JavaScript port of libsodium cryptographic library',
    descriptionKo: 'libsodium 암호화 라이브러리의 JavaScript 포팅',
    categories: ['Data & Security'],
    license: 'ISC',
    github: 'https://github.com/jedisct1/libsodium.js',
    npm: 'libsodium-wrappers',
    stars: '1k',
    yearReleased: 2016,
    wasmBased: true,
    tags: ['WASM', 'Crypto', 'libsodium'],
    useCases: {
      en: 'Secure encryption, password hashing, key exchange, authenticated encryption',
      ko: '안전한 암호화, 비밀번호 해싱, 키 교환, 인증된 암호화',
    },
    codeExample: `import sodium from 'libsodium-wrappers';
await sodium.ready;
const key = sodium.crypto_secretbox_keygen();
const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);`,
  },
  {
    name: 'crypto-js',
    description: 'JavaScript library of crypto standards',
    descriptionKo: '암호화 표준의 JavaScript 라이브러리',
    categories: ['Data & Security'],
    license: 'MIT',
    github: 'https://github.com/brix/crypto-js',
    npm: 'crypto-js',
    stars: '16k',
    yearReleased: 2009,
    tags: ['Crypto', 'AES', 'SHA', 'MD5'],
    useCases: {
      en: 'AES encryption, SHA hashing, HMAC, PBKDF2, simple encryption needs',
      ko: 'AES 암호화, SHA 해싱, HMAC, PBKDF2, 간단한 암호화 요구',
    },
    codeExample: `import CryptoJS from 'crypto-js';
const encrypted = CryptoJS.AES.encrypt('message', 'secret key').toString();
const decrypted = CryptoJS.AES.decrypt(encrypted, 'secret key').toString(CryptoJS.enc.Utf8);`,
  },
  {
    name: 'protobuf.js',
    description: 'Protocol Buffers for JavaScript',
    descriptionKo: 'JavaScript용 Protocol Buffers',
    categories: ['Data & Security'],
    license: 'BSD-3-Clause',
    github: 'https://github.com/protobufjs/protobuf.js',
    website: 'https://protobufjs.github.io/protobuf.js/',
    npm: 'protobufjs',
    stars: '10k',
    yearReleased: 2013,
    tags: ['Protobuf', 'Binary', 'Google'],
    useCases: {
      en: 'Efficient data serialization, gRPC communication, cross-language data exchange',
      ko: '효율적인 데이터 직렬화, gRPC 통신, 크로스 언어 데이터 교환',
    },
    codeExample: `import protobuf from 'protobufjs';
const root = await protobuf.load('awesome.proto');
const Message = root.lookupType('package.Message');
const buffer = Message.encode({ field: 'value' }).finish();`,
  },
  {
    name: 'FlatBuffers',
    description: 'Efficient cross-platform serialization library',
    descriptionKo: '효율적인 크로스 플랫폼 직렬화 라이브러리',
    categories: ['Data & Security'],
    license: 'Apache-2.0',
    github: 'https://github.com/google/flatbuffers',
    website: 'https://flatbuffers.dev',
    npm: 'flatbuffers',
    stars: '26k',
    yearReleased: 2014,
    tags: ['Binary', 'Google', 'Gaming'],
    useCases: {
      en: 'Game data serialization, zero-copy deserialization, real-time data exchange',
      ko: '게임 데이터 직렬화, 제로 카피 역직렬화, 실시간 데이터 교환',
    },
    codeExample: `import * as flatbuffers from 'flatbuffers';
const builder = new flatbuffers.Builder(256);
// Build your FlatBuffer...
const buf = builder.asUint8Array();`,
  },
  {
    name: 'msgpackr',
    description: 'Fast MessagePack encoder/decoder',
    descriptionKo: '빠른 MessagePack 인코더/디코더',
    categories: ['Data & Security'],
    license: 'MIT',
    github: 'https://github.com/kriszyp/msgpackr',
    npm: 'msgpackr',
    stars: '700',
    trending: true,
    yearReleased: 2020,
    tags: ['MessagePack', 'Binary', 'Fast'],
    useCases: {
      en: 'Compact JSON alternative, WebSocket communication, efficient storage',
      ko: '컴팩트한 JSON 대안, WebSocket 통신, 효율적인 저장',
    },
    codeExample: `import { pack, unpack } from 'msgpackr';
const encoded = pack({ hello: 'world' });
const decoded = unpack(encoded);`,
  },
  {
    name: 'cbor-x',
    description: 'Fast CBOR encoder/decoder',
    descriptionKo: '빠른 CBOR 인코더/디코더',
    categories: ['Data & Security'],
    license: 'MIT',
    github: 'https://github.com/kriszyp/cbor-x',
    npm: 'cbor-x',
    stars: '200',
    yearReleased: 2020,
    tags: ['CBOR', 'Binary', 'IoT'],
    useCases: {
      en: 'IoT data encoding, WebAuthn, compact binary format, COSE signatures',
      ko: 'IoT 데이터 인코딩, WebAuthn, 컴팩트 바이너리 포맷, COSE 서명',
    },
    codeExample: `import { encode, decode } from 'cbor-x';
const encoded = encode({ hello: 'world' });
const decoded = decode(encoded);`,
  },
];
