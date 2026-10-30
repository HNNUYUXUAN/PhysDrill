import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  base: "/PhysDrill/",
  plugins: [tailwindcss()],
  server: {
    watch: {
      ignored: [
        "**/.local/**",
        "**/.playwright-cli/**",
        "**/docs/assets/**",
        "**/public/wolfram/**",
      ],
    },
  },
});
