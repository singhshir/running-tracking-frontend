import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// WHAT: Vite configuration for the Running Tracker frontend.
// WHY: We proxy /api requests to the Express backend during development so
//      the browser sees same-origin requests (avoids CORS/cookie headaches)
//      while axios calls are still written as simple relative paths.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
