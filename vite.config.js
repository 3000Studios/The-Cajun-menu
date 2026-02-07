import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        catering: resolve(__dirname, 'catering.html'),
        delivery: resolve(__dirname, 'delivery.html'),
        projectPlan: resolve(__dirname, 'project-plan.html')
      }
    }
  }
});
