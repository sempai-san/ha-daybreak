import { defineConfig } from "vite";

export default defineConfig({
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
