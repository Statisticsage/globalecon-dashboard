# GlobalEcon Intelligence

> Live IMF World Economic Outlook dashboard — 196 countries, 353,544 observations, real-time charts

## Overview
GlobalEcon Intelligence is a production-grade economic data platform built on the IMF World Economic Outlook dataset. It covers 196 sovereign states across 145 economic indicators from 1980 to 2030, with real-time data refresh via Supabase.

## Features
- **5 analytical tabs** — Overview, GDP & Growth, Inflation, Debt & Fiscal, Country Explorer
- **196-country search** — live search across all sovereign states
- **Real-time updates** — Supabase Realtime auto-refreshes charts when new data is ingested
- **Zero hardcoded values** — every figure pulls directly from the database
- **Security hardened** — CSP, HSTS, X-Frame-Options, Permissions-Policy headers
- **Fully responsive** — mobile hamburger menu, scrollable tab strip on tablet

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4 |
| Charts | Recharts |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

## Data Source
All data sourced from the **IMF World Economic Outlook 2024** release.
353,544 observations · 196 countries · 145 indicators · 1980–2030

*Not affiliated with or endorsed by the International Monetary Fund.*

## Getting Started

\\\ash
npm install
cp .env.example .env.local
# Fill in your Supabase credentials
npm run dev
\\\

## Environment Variables

\\\
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
\\\

## License
MIT
