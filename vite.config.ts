import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
  },
  server: {
    port: 8800,
    host: '127.0.0.1',
    allowedHosts: true,
  },
});
