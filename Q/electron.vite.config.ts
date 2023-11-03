import { defineConfig, externalizeDepsPlugin } from "electron-vite";

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: "src/electron",
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
});
