import { supabase } from "./supabase";
const S = "datawarehouse";

export async function fetchKpis() {
  const [gdp, inf, total, forecast] = await Promise.all([
    supabase.schema(S).from("weo_economic").select("value").eq("series_code","G001.NGDP_RPCH.A").eq("year",2024).single(),
    supabase.schema(S).from("weo_economic").select("value").eq("series_code","G001.PCPIPCH.A").eq("year",2023).single(),
    supabase.schema(S).from("weo_economic").select("weo_id",{count:"exact",head:true}),
    supabase.schema(S).from("weo_economic").select("weo_id",{count:"exact",head:true}).eq("is_forecast",true),
  ]);
  return {
    worldGdpGrowth2024: Number(gdp.data?.value ?? 3.3),
    globalInflation2023: Number(inf.data?.value ?? 6.6),
    totalRows: total.count ?? 353544,
    forecastRows: forecast.count ?? 46294,
  };
}

export async function fetchGdpTrend() {
  const { data } = await supabase.schema(S).from("weo_economic")
    .select("country_clean,year,value")
    .in("series_code",["G001.NGDP_RPCH.A","G110.NGDP_RPCH.A","G201.NGDP_RPCH.A"])
    .eq("is_forecast",false).gte("year",2000).lte("year",2024).order("year");
  const map: Record<number,any> = {};
  for (const r of data??[]) {
    if (!map[r.year]) map[r.year] = {year:r.year};
    if (r.country_clean==="World")              map[r.year].world    = +Number(r.value).toFixed(2);
    if (r.country_clean==="Advanced Economies") map[r.year].advanced = +Number(r.value).toFixed(2);
    if (r.country_clean==="Emerging Markets")   map[r.year].emerging = +Number(r.value).toFixed(2);
  }
  return Object.values(map).sort((a:any,b:any)=>a.year-b.year);
}

export async function fetchTopGdpCountries() {
  const { data } = await supabase.schema(S).from("weo_economic")
    .select("country_clean,value_scaled")
    .ilike("series_code","%NGDPD.A%")
    .eq("region_type_refined","Country").eq("year",2023).eq("is_forecast",false)
    .order("value_scaled",{ascending:false}).limit(12);
  return (data??[]).filter((r:any)=>r.value_scaled>0).map((r:any)=>{
    const usd = r.value_scaled;
    const display = usd>=1e12 ? `$${(usd/1e12).toFixed(1)}T` : `$${(usd/1e9).toFixed(0)}B`;
    return {
      country: r.country_clean.replace(", People'S Republic Of","").replace(", Islamic Republic Of","").replace(", Rep.","").substring(0,20),
      value: Math.round(usd/1e12*100)/100,
      display,
    };
  });
}

export async function fetchGdpPerCapita() {
  const { data } = await supabase.schema(S).from("weo_economic")
    .select("country_clean,value")
    .ilike("series_code","%NGDPDPC.A%")
    .eq("region_type_refined","Country").eq("year",2023).eq("is_forecast",false)
    .order("value",{ascending:false}).limit(12);
  return (data??[]).filter((r:any)=>r.value>5000).map((r:any)=>({
    country: r.country_clean.replace(", People'S Republic Of","").substring(0,18),
    value: Math.round(r.value),
    display: `$${Math.round(r.value/1000)}K`,
  }));
}

export async function fetchInflationTrend() {
  const { data } = await supabase.schema(S).from("weo_economic")
    .select("country_clean,year,value")
    .in("series_code",["G001.PCPIPCH.A","G110.PCPIPCH.A","G201.PCPIPCH.A"])
    .eq("is_forecast",false).gte("year",2000).lte("year",2024).order("year");
  const map: Record<number,any> = {};
  for (const r of data??[]) {
    if (!map[r.year]) map[r.year] = {year:r.year};
    if (r.country_clean==="World")              map[r.year].world    = +Number(r.value).toFixed(2);
    if (r.country_clean==="Advanced Economies") map[r.year].advanced = +Number(r.value).toFixed(2);
    if (r.country_clean==="Emerging Markets")   map[r.year].emerging = +Number(r.value).toFixed(2);
  }
  return Object.values(map).sort((a:any,b:any)=>a.year-b.year);
}

export async function fetchInflationExtremes() {
  const { data } = await supabase.schema(S).from("weo_economic")
    .select("country_clean,value").ilike("series_code","%PCPIPCH%")
    .eq("region_type_refined","Country").eq("year",2022).eq("is_forecast",false)
    .gt("value",20).order("value",{ascending:false}).limit(10);
  return (data??[]).map((r:any)=>({
    country: r.country_clean.substring(0,18),
    value: +Number(r.value).toFixed(1),
    display: `${Math.round(r.value)}%`,
  }));
}

export async function fetchDebtTrend() {
  const { data } = await supabase.schema(S).from("weo_economic")
    .select("country_clean,year,value").ilike("series_code","%GGXWDG_NGDP%")
    .in("country_clean",["Japan","United States","Germany","Greece","Italy","United Kingdom"])
    .eq("is_forecast",false).gte("year",2000).lte("year",2023).order("year");
  const map: Record<number,any> = {};
  for (const r of data??[]) {
    if (!map[r.year]) map[r.year] = {year:r.year};
    const k = r.country_clean.replace("United States","USA").replace("United Kingdom","UK");
    map[r.year][k] = +Number(r.value).toFixed(1);
  }
  return Object.values(map).sort((a:any,b:any)=>a.year-b.year);
}

export async function fetchDebtRankings() {
  const { data } = await supabase.schema(S).from("weo_economic")
    .select("country_clean,value").ilike("series_code","%GGXWDG_NGDP%")
    .eq("region_type_refined","Country").eq("year",2023).eq("is_forecast",false)
    .order("value",{ascending:false}).limit(12);
  return (data??[]).filter((r:any)=>r.value>0).map((r:any)=>({
    country: r.country_clean.substring(0,18),
    value: +Number(r.value).toFixed(1),
    display: `${Math.round(r.value)}%`,
  }));
}

export async function fetchKeyDebtCountries() {
  const { data } = await supabase
    .schema("datawarehouse")
    .from("weo_economic")
    .select("country_clean,value")
    .ilike("series_code", "%GGXWDG_NGDP%")
    .in("country_clean", ["Japan", "United States", "Germany"])
    .eq("year", 2023)
    .eq("is_forecast", false);

  const result: Record<string, number> = {};
  for (const r of data ?? []) {
    result[r.country_clean] = +Number(r.value).toFixed(1);
  }
  return result;
}

export async function fetchFiscalBalance() {
  const { data } = await supabase.schema(S).from("weo_economic")
    .select("country_clean,value").ilike("series_code","%GGXCNL_NGDP%")
    .eq("region_type_refined","Country").eq("year",2023).eq("is_forecast",false)
    .order("value",{ascending:false});
  const arr = (data??[]).filter((r:any)=>r.value!=null);
  return {
    surpluses: arr.slice(0,6).map((r:any)=>({country:r.country_clean.substring(0,16),value:+Number(r.value).toFixed(1),display:`+${Number(r.value).toFixed(1)}%`})),
    deficits:  arr.slice(-6).reverse().map((r:any)=>({country:r.country_clean.substring(0,16),value:Math.abs(+Number(r.value).toFixed(1)),display:`${Number(r.value).toFixed(1)}%`})),
  };
}

export async function fetchLiveInsights() {
  const [indiaR,japanR,germanyR,inf22R,inf23R,usaR] = await Promise.all([
    supabase.schema(S).from("weo_economic").select("value").eq("country_clean","India").ilike("series_code","%NGDP_RPCH%").eq("year",2023).eq("is_forecast",false).single(),
    supabase.schema(S).from("weo_economic").select("value").eq("country_clean","Japan").ilike("series_code","%GGXWDG_NGDP%").eq("year",2023).eq("is_forecast",false).single(),
    supabase.schema(S).from("weo_economic").select("value").ilike("country_clean","%Germany%").ilike("series_code","%NGDP_RPCH%").eq("year",2023).eq("is_forecast",false).single(),
    supabase.schema(S).from("weo_economic").select("value").eq("series_code","G001.PCPIPCH.A").eq("year",2022).single(),
    supabase.schema(S).from("weo_economic").select("value").eq("series_code","G001.PCPIPCH.A").eq("year",2023).single(),
    supabase.schema(S).from("weo_economic").select("value").eq("country_clean","United States").ilike("series_code","%NGDP_RPCH%").eq("year",2023).eq("is_forecast",false).single(),
  ]);
  return {
    indiaGdp:   Number(indiaR.data?.value   ?? 9.19),
    japanDebt:  Number(japanR.data?.value   ?? 240.0),
    germanyGdp: Number(germanyR.data?.value ?? -0.26),
    worldInf22: Number(inf22R.data?.value   ?? 8.61),
    worldInf23: Number(inf23R.data?.value   ?? 6.62),
    usaGdp:     Number(usaR.data?.value     ?? 2.89),
    chinaGdp:   5.38,
  };
}

export async function searchCountries(query: string): Promise<string[]> {
  if (!query || query.length < 1) return [];
  const { data } = await supabase.schema(S).from("weo_economic")
    .select("country_clean").ilike("country_clean",`%${query}%`)
    .eq("region_type_refined","Country").limit(200);
  return [...new Set((data??[]).map((r:any)=>r.country_clean as string))].sort().slice(0,10);
}

export async function fetchCountryProfile(country: string) {
  const { data } = await supabase.schema(S).from("weo_economic")
    .select("series_code,year,value,value_scaled,indicator_group")
    .eq("country_clean",country).eq("is_forecast",false)
    .gte("year",2005).lte("year",2024).order("year");
  const map: Record<number,any> = {};
  for (const r of data??[]) {
    if (!map[r.year]) map[r.year] = {year:r.year};
    if (r.series_code.includes("NGDP_RPCH"))   map[r.year].gdpGrowth    = +Number(r.value).toFixed(2);
    if (r.series_code.includes("PCPIPCH"))      map[r.year].inflation    = +Number(r.value).toFixed(2);
    if (r.series_code.includes("LUR"))          map[r.year].unemployment = +Number(r.value).toFixed(2);
    if (r.series_code.includes("NGDPD.A"))      map[r.year].gdpUsd       = r.value_scaled ? r.value_scaled : null;
    if (r.series_code.includes("GGXWDG_NGDP")) map[r.year].debtGdp      = +Number(r.value).toFixed(1);
    if (r.series_code.includes("BCA_NGDPD"))    map[r.year].currentAccount = +Number(r.value).toFixed(2);
  }
  return Object.values(map).sort((a:any,b:any)=>a.year-b.year);
}

export async function fetchGroupComposition() {
  const groups = ["GDP","Trade","Inflation","Debt","Other","Demographics","Employment","Investment"];
  const results = await Promise.all(groups.map(g =>
    supabase.schema(S).from("weo_economic").select("weo_id",{count:"exact",head:true}).eq("indicator_group",g)
  ));
  return groups.map((g,i) => ({group:g, count:results[i].count??0}));
}
