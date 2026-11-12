import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'generate-404-fallback',
        closeBundle() {
          try {
            const distDir = path.resolve(process.cwd(), 'dist');
            const indexFile = path.join(distDir, 'index.html');
            const fourOhFourFile = path.join(distDir, '404.html');
            if (fs.existsSync(indexFile)) {
              fs.copyFileSync(indexFile, fourOhFourFile);
            }
          } catch (e) {
            // Non-critical fallback
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
