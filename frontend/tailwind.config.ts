import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ultra: {
          bg: "#02040a",        // Darker than black (Void)
          card: "#0f111a",      // Panel background
          border: "#1e2130",    // Subtle borders
          primary: "#6366f1",   // Indigo Neon (Main Brand)
          secondary: "#a855f7", // Purple Neon (Accents)
          accent: "#06b6d4",    // Cyan Neon (Status/Info)
          success: "#10b981",   // Emerald (Success)
          error: "#ef4444",     // Red (Danger)
          warning: "#f59e0b",   // Amber (Warning)
        }
      },
      fontFamily: {
        mono: ['var(--font-fira-code)', 'monospace'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1e2130 1px, transparent 1px), linear-gradient(to bottom, #1e2130 1px, transparent 1px)",
        'glow-primary': "conic-gradient(from 180deg at 50% 50%, #6366f1 0deg, #a855f7 180deg, #6366f1 360deg)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
      },
      keyframes: {
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;