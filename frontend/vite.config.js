import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    proxy: {
      "/cdn": {
        target: "https://unpkg.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn/, ""),
      },
      "/api": {
        target: "https://api.example.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      '/socket.io': {
                target: 'http://localhost:8080',
                ws: true,
                changeOrigin: true
      },
  },
}});
