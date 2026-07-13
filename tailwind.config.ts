import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D8A63A",
          light: "#E5BE63",
          dark: "#B8862A",
        },
        navy: {
          DEFAULT: "#081A2F",
          light: "#0F2942",
          deep: "#050F1C",
        },
        ink: "#1A1A1A",
        muted: "#666666",
        cream: "#F8F8F8",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 40px -12px rgba(8, 26, 47, 0.18)",
        "card-hover": "0 24px 60px -16px rgba(8, 26, 47, 0.30)",
        widget: "0 20px 60px -20px rgba(8, 26, 47, 0.25)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
