import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from 'path'
dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8090;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "build",
    sourcemap: false, // Disable source maps in production
  },
  preview: {
    port: port,
    strictPort: true,
  },
  server: {
    port: port,
    strictPort: true,
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
