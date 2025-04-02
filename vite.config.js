import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // server: {
  //   allowedHosts: [
  //     "bead384b-e6f8-4448-a158-d3cc14d235a9-00-518tr9h6oej7.worf.replit.dev",
  //   ],
  // },
});
