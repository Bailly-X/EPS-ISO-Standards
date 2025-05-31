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
        notification_reminder: resolve(__dirname, "./notification_reminder.html"),
        chose_text: resolve(__dirname, "./chose-text.html"),
        write_your_text: resolve(__dirname, "./write-your-text.html"),
        play_round: resolve(__dirname, "./play-round.html"),
        round_transition: resolve(__dirname, "./round-transition.html"),
        result: resolve(__dirname, "./result.html"),
        badges_menu: resolve(__dirname, "./badges_menu.html"),
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
