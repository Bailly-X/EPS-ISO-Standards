/*
export default {
  build: {
    rollupOptions: {
      input: './iso.html',
    },
    outDir: 'dist',
    emptyOutDir: true
  }
}
*/

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./iso.html"),
        startgame: resolve(__dirname, "./src/start-game.html"),
        logout: resolve(__dirname, "./src/logout.js"),
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})