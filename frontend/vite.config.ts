import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});

//Frontend anropar /api. Vite fångar upp anropet och skickar det vidare till Express på port 3000. Det gör att vi slipper hantera CORS mellan våra två lokala utvecklingsservrar.
//Källa: https://vite.dev/config/server-options /Maria
