"use client";
import { useEffect, useState, useRef } from "react";
import { ComposedChart,Bar,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,ReferenceLine } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import ChartCard from "../ChartCard";
import { fetchCountryProfile, searchCountries } from "@/lib/queries";

const POPULAR = [
  "India","United States","China, People'S Republic Of","Germany","Brazil",
  "Japan","United Kingdom","France","South Africa","Nigeria","Indonesia","Australia",
  "Saudi Arabia","Mexico","Turkey","Argentina","Egypt","Pakistan","Bangladesh","Vietnam",
];

function cleanName(n:string){
  return n.replace(", People'S Republic Of","").replace(", Islamic Republic Of","")
    .replace(", United Republic Of","").replace(", Rep.","")
    .replace(", Lao People'S Democratic Republic","");
}

// FIX BUG-1: value_scaled is already raw USD (e.g. 3638490000000 for India)
// Do NOT multiply by 1e12 again
function fmtGdp(rawUsd:number|null){
  if(rawUsd==null||rawUsd<=0) return "—";
  if(rawUsd>=1e12) return `$${(rawUsd/1e12).toFixed(2)}T`;
  if(rawUsd>=1e9)  return `$${(rawUsd/1e9).toFixed(1)}B`;
  if(rawUsd>=1e6)  return `$${(rawUsd/1e6).toFixed(0)}M`;
  return "—";
}

const TT = ({active,payload,label}:any)=>{
  if(!active||!payload?.length) return null;
  return(
    <div className="dash-tooltip">
      <div className="font-mono text-[10px] text-white/40 mb-1.5">{label}</div>
      {payload.map((p:any)=>p.value!=null&&(
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{background:p.color}}/>
          <span className="text-white/60 text-[10px]">{p.name}:</span>
          <span className="text-white font-medium">{Number(p.value).toFixed(2)}%</span>
        </div>
      ))}
    </div>
  );
};

export default function CountryTab(){
  const[selected,setSelected]   = useState("India");
  const[chartData,setChartData] = useState<any[]>([]);
  const[loading,setLoading]     = useState(false);
  const[query,setQuery]         = useState("");
  const[suggestions,setSugg]    = useState<string[]>([]);
  const[searching,setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ loadCountry(selected); },[selected]);

  useEffect(()=>{
    const h=(e:MouseEvent)=>{
      if(searchRef.current&&!searchRef.current.contains(e.target as Node)) setSugg([]);
    };
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);

  async function loadCountry(name:string){
    setLoading(true);
    const data = await fetchCountryProfile(name);
    setChartData(data);
    setLoading(false);
  }

  async function handleSearch(val:string){
    setQuery(val);
    if(val.length<1){setSugg([]);return;}
    setSearching(true);
    const res = await searchCountries(val);
    setSugg(res);
    setSearching(false);
  }

  function pick(name:string){ setSelected(name); setQuery(""); setSugg([]); }

  const latest = chartData[chartData.length-1]??{};
  const prev   = chartData[chartData.length-2]??{};
  const growthDelta = latest.gdpGrowth!=null&&prev.gdpGrowth!=null
    ? (latest.gdpGrowth - prev.gdpGrowth) : null;

  return(
    <div className="space-y-5">

      {/* ── Country selector panel ── */}
      <div className="dash-card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider">Explorer</span>
            <span className="font-mono text-[9px] text-white/20 px-2 py-0.5 rounded-full border border-white/[0.08]">
              196 countries
            </span>
          </div>
          {/* Search */}
          <div ref={searchRef} className="relative w-full sm:w-72">
            <svg className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" placeholder="Search any of 196 countries..." value={query}
              onChange={e=>handleSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-[12px] border border-white/10 rounded-lg outline-none focus:border-gold/40 transition-colors bg-white/[0.04] text-white placeholder:text-muted font-mono"/>
            {searching&&<div className="absolute right-3 top-2.5 w-3.5 h-3.5 border-2 border-white/20 border-t-gold rounded-full animate-spin"/>}
            <AnimatePresence>
              {suggestions.length>0&&(
                <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
                  className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-white/10 overflow-hidden z-50 shadow-2xl"
                  style={{background:"#161c2e"}}>
                  {suggestions.map((s,i)=>(
                    <motion.button key={s} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                      onClick={()=>pick(s)}
                      className="w-full text-left px-4 py-3 text-[12px] text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors border-b border-white/[0.04] last:border-0 font-medium">
                      <span>{cleanName(s)}</span>
                      <span className="font-mono text-[9px] text-muted ml-2">{s}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Quick-pick buttons */}
        <div className="flex flex-wrap gap-1.5">
          {POPULAR.map(c=>(
            <motion.button key={c} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
              onClick={()=>pick(c)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all border ${
                selected===c
                  ? "bg-gold/15 text-gold border-gold/30 shadow-sm"
                  : "text-muted border-white/[0.07] hover:text-white/70 hover:border-white/15 bg-transparent"
              }`}>
              {cleanName(c)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── FIX BUG-4: Prominent country name banner ── */}
      <AnimatePresence mode="wait">
        <motion.div key={selected}
          initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
          transition={{duration:0.3}}
          className="dash-card px-6 py-5 border-l-4 border-gold/50 flex items-center justify-between">
          <div>
            <div className="font-mono text-[9px] text-muted uppercase tracking-[0.15em] mb-1">
              Currently viewing
            </div>
            <div className="font-display text-3xl text-white">{cleanName(selected)}</div>
            <div className="font-mono text-[10px] text-muted mt-1">
              IMF data coverage: 2005–2024 · {chartData.length} annual observations loaded
            </div>
          </div>
          <div className="text-right">
            {latest.gdpGrowth!=null&&(
              <div>
                <div className="font-mono text-[9px] text-muted uppercase mb-1">GDP growth 2024</div>
                <div className={`font-display text-2xl ${latest.gdpGrowth>=0?"text-teal":"text-coral"}`}>
                  {latest.gdpGrowth>=0?"+":""}{latest.gdpGrowth.toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {l:"Nominal GDP",       v:fmtGdp(latest.gdpUsd),            note:"USD · 2023"},
          {l:"Real GDP growth",   v:latest.gdpGrowth!=null?`${latest.gdpGrowth>=0?"+":""}${latest.gdpGrowth.toFixed(1)}%`:"—", note:"Annual % change"},
          {l:"Inflation (CPI)",   v:latest.inflation!=null?`${latest.inflation.toFixed(1)}%`:"—",   note:"Annual average"},
          {l:"Unemployment",      v:latest.unemployment!=null?`${latest.unemployment.toFixed(1)}%`:"—", note:"% of labour force"},
          {l:"Govt debt / GDP",   v:latest.debtGdp!=null?`${latest.debtGdp.toFixed(0)}%`:"—",     note:"Gross debt 2023"},
        ].map((k,i)=>(
          <motion.div key={k.l} initial={{opacity:0,y:10}} animate={{opacity:loading?0.3:1,y:0}} transition={{delay:i*0.06,duration:0.4}}
            className="dash-card p-4">
            <div className="font-mono text-[8px] text-muted uppercase tracking-[0.12em] mb-2">{k.l}</div>
            <div className="font-display text-[22px] leading-none text-white">{k.v}</div>
            <div className="font-mono text-[9px] text-muted/50 mt-1.5">{k.note}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Growth vs Inflation chart ── */}
      <ChartCard
        title={`${cleanName(selected)} — GDP growth vs Inflation`}
        subtitle="Real GDP growth (bars) vs CPI inflation (line) — annual % · Source: IMF WEO 2024"
        source="IMF World Economic Outlook 2024"
        delay={0.1}>
        {loading
          ? <div className="h-72 skeleton rounded-xl"/>
          : chartData.length===0
          ? <div className="h-72 flex items-center justify-center font-mono text-[11px] text-muted">No data available for {cleanName(selected)}</div>
          : (
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={chartData} margin={{top:5,right:10,bottom:0,left:-18}}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                <XAxis dataKey="year" tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false}/>
                <YAxis tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
                <Tooltip content={<TT/>}/>
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1}/>
                <Bar dataKey="gdpGrowth" name="GDP Growth" fill="#2dd4bf" opacity={0.8} radius={[3,3,0,0]}/>
                <Line type="monotone" dataKey="inflation" name="Inflation" stroke="#f87171" strokeWidth={2.5} dot={false} activeDot={{r:4,fill:"#f87171"}}/>
              </ComposedChart>
            </ResponsiveContainer>
          )
        }
      </ChartCard>

      {/* ── Fiscal position chart (conditional) ── */}
      {!loading&&chartData.some(d=>d.debtGdp)&&(
        <ChartCard
          title={`${cleanName(selected)} — Fiscal position`}
          subtitle="Govt gross debt % GDP (bars) · Current account balance % GDP (line)"
          source="IMF WEO 2024"
          delay={0.2}>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={chartData} margin={{top:5,right:10,bottom:0,left:-18}}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="year" tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<TT/>}/>
              <Bar dataKey="debtGdp" name="Debt/GDP" fill="#60a5fa" opacity={0.75} radius={[2,2,0,0]}/>
              <Line type="monotone" dataKey="currentAccount" name="Current Acct" stroke="#d4a843" strokeWidth={2} dot={false} activeDot={{r:3}}/>
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* ── Unemployment chart (conditional) ── */}
      {!loading&&chartData.some(d=>d.unemployment)&&(
        <ChartCard
          title={`${cleanName(selected)} — Unemployment rate`}
          subtitle="% of total labour force — annual · Source: IMF WEO 2024"
          source="IMF WEO 2024"
          delay={0.25}>
          <ResponsiveContainer width="100%" height={160}>
            <ComposedChart data={chartData} margin={{top:5,right:10,bottom:0,left:-18}}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="year" tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<TT/>}/>
              <Bar dataKey="unemployment" name="Unemployment" fill="#a78bfa" opacity={0.8} radius={[2,2,0,0]}/>
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

    </div>
  );
}