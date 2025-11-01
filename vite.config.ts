import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@google/generative-ai': path.resolve(__dirname, 'utils/googleGenerativeAiShim.ts'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-konva': ['konva', 'react-konva'],
        }
      }
    }
  }
});
