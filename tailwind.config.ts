import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Instrument Serif'", "serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
        sans:    ["'Plus Jakarta Sans'", "sans-serif"],
      },
      colors: {
        bg:     "#070b14",
        sur:    "#0e1422",
        sur2:   "#131929",
        gold:   { DEFAULT:"#f5c842", light:"#ffd96a" },
        teal:   { DEFAULT:"#00e5cc", dark:"#00b8a3"  },
        coral:  { DEFAULT:"#ff6b6b", dark:"#e04444"  },
        cobalt: { DEFAULT:"#4d9fff", dark:"#2e7fd4"  },
        muted:  "#4e5a7a",
      },
    },
  },
  plugins: [],
};

export default config;