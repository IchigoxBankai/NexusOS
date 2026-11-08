import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@nexus/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@nexus/validation': path.resolve(__dirname, '../../packages/validation/src/index.ts'),
      '@nexus/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      '@nexus/api': path.resolve(__dirname, '../../packages/api/src/index.ts'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
