import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color, #e11d48)",
        secondary: "var(--secondary-color, rgba(225, 29, 72, 0.1))",
        background: "var(--bg-color, #000000)",
        foreground: "var(--text-color, #ffffff)",
      },
      fontFamily: {
        sans: ["var(--body-font, Inter)", "Inter", "sans-serif"],
        heading: ["var(--heading-font, Playfair Display)", "serif"],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.7', filter: 'brightness(1.5)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
