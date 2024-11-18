import { join } from "path";
import { loadEnvFile } from "process";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig(({ mode: _ }) => {
  loadEnvFile();

  return {
    test: {
      exclude: [...configDefaults.exclude, "**/e2e/**"],
    },
    resolve: {
      alias: {
        "~/": join(__dirname, "./src/"),
      },
    },
  };
});
