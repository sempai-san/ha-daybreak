import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

export default defineConfig({
  define: { __DAYBREAK_VERSION__: JSON.stringify(pkg.version) },
  build: {
    target: "es2021",
    minify: "esbuild",
    outDir: "../custom_components/daybreak/frontend",
    emptyOutDir: false,
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: () => "daybreak.js",
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
