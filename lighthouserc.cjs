// Default config for roots app
// Use APP environment variable to test different apps:
// APP=context pnpm lhci
// APP=permissive pnpm lhci
// APP=roots pnpm lhci (default)

const app = process.env.APP || 'roots';

module.exports = {
  ci: {
    collect: {
      staticDistDir: `./apps/${app}/dist/client`,
      url: ['http://localhost/index.html'],
      numberOfRuns: 1,
      // chromePath는 환경변수 CHROME_PATH가 있으면 사용, 없으면 자동 감지
      // GitHub Actions에서는 workflow에서 CHROME_PATH 설정 필요
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
