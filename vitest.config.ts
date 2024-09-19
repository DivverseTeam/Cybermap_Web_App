import { configDefaults, defineConfig } from "vitest/config";
import { loadEnvFile } from "process";
import { join } from "path";

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
