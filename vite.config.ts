import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/cc-adventure/' : '/',
  build: {
    target: 'es2020',
  },
  server: {
    port: 8800,
    host: '127.0.0.1',
    allowedHosts: true,
  },
}));
