import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Create __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'constants': path.resolve(__dirname, 'src/constants'),
      'service': path.resolve(__dirname, 'src/service'),
      'components': path.resolve(__dirname, 'src/components'),
    },
  },
})
