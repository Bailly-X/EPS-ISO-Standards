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
        main_menu: resolve(__dirname, "./main-menu.html"),
        game_menu: resolve(__dirname, "./game-menu.html"),
        select_friend: resolve(__dirname, "./select-friend.html"),
        chose_text: resolve(__dirname, "./chose-text.html"),
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});