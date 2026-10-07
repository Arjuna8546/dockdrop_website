import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GSAP + Motion + React land in one ~170 KB gzipped bundle (budget: 300 KB, guide 15.1).
  build: { chunkSizeWarningLimit: 600 },
  server: {
    // Keep the dev server away from folders that are not part of the website.
    watch: { ignored: ['**/cloudflare-image-mcp/**', '**/test-artifacts/**', '**/art-review/**'] },
  },
});
