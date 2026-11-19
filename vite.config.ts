import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  server: { port: 8080 },
  preview: { port: 8080 },
  build: { outDir: "dist", emptyOutDir: true },
  css: {
    modules: { generateScopedName: "[local]-[hash:base64:5]" },
  },
  test: {
    include: ["shared/**/*.test.ts", "convex/**/*.test.ts", "src/**/*.test.{ts,tsx}"],
    environment: "node",
    server: { deps: { inline: ["convex-test"] } },
  },
});
