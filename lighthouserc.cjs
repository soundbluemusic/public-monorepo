// Default config for roots app
// Use APP environment variable to test different apps:
// APP=context pnpm lhci
// APP=permissive pnpm lhci
// APP=roots pnpm lhci (default)

const app = process.env.APP || 'roots';

module.exports = {
  ci: {
    collect: {
      staticDistDir: `./apps/${app}/build/client`,
      url: ['http://localhost/index.html'],
      numberOfRuns: 1,
      chromePath: '/root/.cache/ms-playwright/chromium-1200/chrome-linux64/chrome',
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
