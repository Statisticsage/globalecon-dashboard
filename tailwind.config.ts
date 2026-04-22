import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Instrument Serif'","serif"],
        mono:    ["'JetBrains Mono'","monospace"],
        sans:    ["'Plus Jakarta Sans'","sans-serif"],
      },
      colors: {
        bg:     "#0b0f1a",
        sur:    "#111624",
        sur2:   "#161c2e",
        gold:   { DEFAULT:"#d4a843", light:"#f0c86a" },
        teal:   { DEFAULT:"#2dd4bf", dark:"#14b8a6"  },
        coral:  { DEFAULT:"#f87171", dark:"#ef4444"  },
        cobalt: { DEFAULT:"#60a5fa", dark:"#3b82f6"  },
        muted:  "#5a6280",
      },
      borderColor: { DEFAULT: "rgba(255,255,255,0.06)" },
    },
  },
  safelist: [
    "text-gold","text-gold-light","bg-gold/10","border-gold/20",
    "text-teal","text-teal-dark","bg-teal/10","border-teal/20",
    "text-coral","text-coral-dark","bg-coral/10","border-coral/20",
    "text-cobalt","bg-cobalt/10","border-cobalt/20",
    "text-green-400","bg-green-400/10","border-green-400/20",
  ],
  plugins: [],
};
export default config;
