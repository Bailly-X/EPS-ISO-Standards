/*
export default {
  build: {
    rollupOptions: {
      input: './login.html',
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
        main: resolve(__dirname, "./login.html"),
        startgame: resolve(__dirname, "./start-game.html"),
        game_menu: resolve(__dirname, "./game-menu.html"),
        select_friend: resolve(__dirname, "./select-friend.html"),
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});