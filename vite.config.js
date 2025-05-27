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
        notification_reminder: resolve(__dirname, "./notification_reminder.html"),
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
