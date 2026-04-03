import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hemp: {
          green: "#2E7D32",
          leaf: "#4CAF50",
          gold: "#FFD54F",
          cream: "#FFF8E1",
          earth: "#5D4037",
          sky: "#81D4FA",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
