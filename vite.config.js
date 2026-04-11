import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const basePath = process.env.VITE_BASE_PATH || '/MyPage/';

export default defineConfig({
  base: basePath,
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
