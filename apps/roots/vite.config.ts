import { createAppViteConfig } from '@soundblue/config/vite';

export default createAppViteConfig({
  port: 3005,
  pwaAssets: ['favicon.svg', 'apple-touch-icon.svg', 'icons/*.svg'],
  pwaCaching: 'none',
});
