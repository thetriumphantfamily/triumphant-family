import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // BRAND COLOURS - THE TRIUMPHANT FAMILY
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        brand: {
          purple: {
            50:  "#FAF5FB",
            100: "#F3E8F7",
            200: "#E5CCEC",
            300: "#D0A3DC",
            400: "#B370C5",
            500: "#8E3FA8",
            600: "#6B1F8A",
            700: "#561670",
            800: "#421155",
            900: "#2E0B3B",
            950: "#1A0622",
          },
          gold: {
            50:  "#FFFAEB",
            100: "#FFF3C7",
            200: "#FFE588",
            300: "#FFD449",
            400: "#FFC72C",
            500: "#F0A911",
            600: "#D08308",
            700: "#A85D0A",
            800: "#88480F",
            900: "#723B11",
            950: "#421E04",
          },
          magenta: {
            400: "#E879F9",
            500: "#D946EF",
            600: "#C026D3",
          },
          violet: {
            700: "#4A1259",
            800: "#3A0E47",
            900: "#260832",
          },
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body:    ["var(--font-inter)", "sans-serif"],
        script:  ["var(--font-great-vibes)", "cursive"],
      },
      backgroundImage: {
        "gradient-purple":      "linear-gradient(135deg, #6B1F8A 0%, #4A1259 100%)",
        "gradient-purple-gold": "linear-gradient(135deg, #6B1F8A 0%, #D946EF 50%, #FFC72C 100%)",
        "gradient-hero":        "linear-gradient(135deg, #2E0B3B 0%, #6B1F8A 50%, #D946EF 100%)",
        "gradient-gold":        "linear-gradient(135deg, #FFC72C 0%, #F0A911 100%)",
      },
      animation: {
        "fade-in":    "fadeIn 0.6s ease-in-out",
        "slide-up":   "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.6s ease-out",
        "scale-in":   "scaleIn 0.4s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float":      "float 3s ease-in-out infinite",
        "shimmer":    "shimmer 2s linear infinite",
        "ken-burns":  "kenBurns 7s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%":   { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        kenBurns: {
          "0%":   { transform: "scale(1) translateY(0)" },
          "100%": { transform: "scale(1.08) translateY(-1%)" },
        },
      },
      boxShadow: {
        "brand":    "0 4px 20px rgba(107, 31, 138, 0.25)",
        "brand-lg": "0 10px 40px rgba(107, 31, 138, 0.35)",
        "gold":     "0 4px 20px rgba(255, 199, 44, 0.35)",
        "gold-lg":  "0 10px 40px rgba(255, 199, 44, 0.45)",
        "glow":     "0 0 30px rgba(217, 70, 239, 0.5)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm:      "1.5rem",
          lg:      "2rem",
          xl:      "3rem",
        },
      },
    },
  },
  plugins: [],
};

export default config;