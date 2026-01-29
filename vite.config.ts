import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootPath = path.resolve(__dirname);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': rootPath,
    },
  },
  server: {
    port: 5173,
    host: true,
    open: true,
    hmr: {
      overlay: false
    }
  }
});
