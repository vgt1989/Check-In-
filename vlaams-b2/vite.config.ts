import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the build works from any folder or static host (GitHub Pages, Netlify...)
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 3001 },
});
