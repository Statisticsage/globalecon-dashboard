import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { params: { eventsPerSecond: 10 } },
});

// ── Type definitions ──────────────────────────────────────────────
export interface WeoRow {
  weo_id: string;
  country: string;
  country_clean: string;
  region_type: string;
  region_type_refined: string;
  indicator: string;
  indicator_group: string;
  series_code: string;
  unit: string | null;
  scale: string;
  year: number;
  is_forecast: boolean;
  value: number;
  value_scaled: number | null;
  value_diff: number | null;
  value_pct_diff: number | null;
}

export interface KpiData {
  worldGdpGrowth2024: number;
  globalInflation2023: number;
  totalCountries: number;
  forecastRows: number;
  totalRows: number;
}

export interface GdpTrendPoint {
  year: number;
  world: number | null;
  advanced: number | null;
  emerging: number | null;
}

export interface CountryGdp {
  country: string;
  gdp_usd_trillion: number;
}

export interface InflationPoint {
  country: string;
  value: number;
}

export interface DebtPoint {
  country: string;
  value: number;
}
