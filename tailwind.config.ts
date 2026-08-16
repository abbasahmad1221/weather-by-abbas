import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        storm: {
          950: "#0a0e1a",
          900: "#0d1526",
          800: "#131c33",
          700: "#1a2540",
        },
        amber: {
          400: "#f5b942",
          500: "#f0a825",
          600: "#d68f16",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-barlow)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "storm-gradient":
          "linear-gradient(160deg, #0a0e1a 0%, #131c33 55%, #1a2540 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
