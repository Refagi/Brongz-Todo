/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,  // Untuk menggunakan global seperti atob
    setupFiles: './setup.ts',  // Memuat file setup
    environment: 'node',  // Menentukan lingkungan Node.js
  },
});
