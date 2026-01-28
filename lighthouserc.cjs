// Lighthouse CI config for SSR apps (production URL testing)
// Use APP environment variable to test different apps:
// APP=context pnpm lhci
// APP=permissive pnpm lhci
// APP=roots pnpm lhci (default)
//
// Note: SSR apps don't have static index.html, so we test production URLs

const app = process.env.APP || 'roots';

const PROD_URLS = {
  context: 'https://context.soundbluemusic.com',
  permissive: 'https://permissive.soundbluemusic.com',
  roots: 'https://roots.soundbluemusic.com',
};

module.exports = {
  ci: {
    collect: {
      // SSR 앱은 프로덕션 URL 테스트 (staticDistDir 사용 불가)
      url: [PROD_URLS[app]],
      numberOfRuns: 1,
      ...(process.env.CHROME_PATH ? { chromePath: process.env.CHROME_PATH } : {}),
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --headless',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
