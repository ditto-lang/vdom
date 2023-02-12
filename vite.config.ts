import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        counter: resolve(__dirname, "examples/counter/index.html"),
        ticker: resolve(__dirname, "examples/ticker/index.html"),
        hooks: resolve(__dirname, "examples/hooks/index.html"),
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
  },
});
