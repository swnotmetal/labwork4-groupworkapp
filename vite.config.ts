import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Prevent Vite/esbuild from trying to bundle the 'history' package
  // (Ionic's react-router build imports it but we don't need it bundled in the Vite dev build)
  optimizeDeps: {
    exclude: ['history']
  },
  build: {
    rollupOptions: {
      external: ['history']
    }
  },
  // If using SSR, also mark it external there
  ssr: {
    external: ['history']
  }
});