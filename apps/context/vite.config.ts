import { createAppViteConfig } from '@soundblue/config/vite';

export default createAppViteConfig({
  port: 3003,
  pwaMaxFileSize: 35 * 1024 * 1024, // 35MB (16,836 entries with enrichment)
});
