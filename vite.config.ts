import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    sourcemap: true,
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  }
});
