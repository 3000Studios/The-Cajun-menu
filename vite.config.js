import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rewrite-planner',
      // Render uses vite preview for production in render.yaml, so we configure preview server
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/planner') {
            req.url = '/project-plan.html';
          }
          next();
        });
      },
      // Also configure dev server so it works locally during development
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/planner') {
            req.url = '/project-plan.html';
          }
          next();
        });
      }
    }
  ],
  build: {
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
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
