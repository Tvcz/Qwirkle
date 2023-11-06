import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: 'src/electron/main'
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    build: {
      lib: {
        entry: 'src/electron/preload'
      }
    }
  },
  renderer: {
    build: {
      lib: {
        entry: 'src/electron/renderer'
      }
    }
  }
});
