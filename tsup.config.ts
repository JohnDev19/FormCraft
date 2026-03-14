import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
    compilerOptions: {
      noUnusedLocals: false,
      noUnusedParameters: false,
    },
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ["react", "react-dom", "zod"],
  injectStyle: false,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
