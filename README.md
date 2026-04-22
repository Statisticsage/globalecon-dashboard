# MacroLens

> Global macroeconomic intelligence — 196 countries, 353,544 IMF data points, live charts

## What it does
MacroLens is a production-grade economic data platform built on the IMF World Economic Outlook dataset. It surfaces complex macroeconomic data in a clean, accessible dashboard — built for analysts, researchers, students, and anyone curious about the world economy.

## Coverage
- **196 sovereign states** with full economic profiles
- **145 indicators** — GDP, inflation, debt, trade, employment, demographics
- **1980 to 2030** — historical data plus IMF projections
- **Zero hardcoded values** — every figure pulls live from the database

## Tabs
| Tab | What you see |
|---|---|
| Overview | World GDP trend, key economic signals, dataset composition |
| GDP & Growth | Growth by economic group, largest economies, GDP per capita |
| Inflation | Global CPI trajectory, 2022 crisis analysis, country extremes |
| Debt & Fiscal | Government debt rankings, fiscal balance, country comparisons |
| Country Explorer | Full economic profile for any of 196 countries with live search |

## Stack
`Next.js 16` `TypeScript` `Tailwind CSS v4` `Supabase` `Recharts` `Framer Motion` `Vercel`

## Local setup
```bash
npm install
cp .env.example .env.local
# Add your Supabase credentials
npm run dev
```

## Environment variables
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_BASE_URL=https://macrolens.vercel.app
```

## Data source
IMF World Economic Outlook 2024 — Not affiliated with or endorsed by the IMF.

## License
MIT