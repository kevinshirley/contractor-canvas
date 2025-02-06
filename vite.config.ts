import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outDir: "dist", // Correct property name
      include: ["src/**/*.ts", "src/**/*.tsx"], // Ensure all TypeScript files are included
      rollupTypes: true, // Ensures types are bundled properly
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    conditions: ["module", "import", "default"],  // Ensures ESM resolution
  },
  build: {
    lib: {
      entry: "src/index.ts",
      name: "SofteloProjecthub",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        format: "es",  // Force ESM
      },
    },
  },
}));
