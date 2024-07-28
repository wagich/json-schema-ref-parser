import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    dir: "test",
    exclude: ["**/__IGNORED__/**"],
    watch: false,
    globalSetup: ["./test/fixtures/server.ts"],
    testTimeout: 5000,
    globals: true,
    passWithNoTests: true,
    reporters: ["verbose"],
    coverage: { reporter: ["lcov", "html", "text"] },
  },
});
