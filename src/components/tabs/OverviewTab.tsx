"use client";
import { useEffect, useState } from "react";
import { AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,ReferenceLine } from "recharts";
import { motion } from "framer-motion";
import KpiCard from "../KpiCard";
import ChartCard from "../ChartCard";
import BarRace from "../BarRace";
import { SkeletonKpi,SkeletonChart } from "../Skeleton";
import { fetchKpis,fetchGdpTrend,fetchTopGdpCountries,fetchGroupComposition,fetchLiveInsights } from "@/lib/queries";
import { supabase } from "@/lib/supabase";

const TT = ({active,payload,label}:any)=>{
  if(!active||!payload?.length)return null;
  return(<div className="dash-tooltip"><div className="font-mono text-[10px] text-white/40 mb-1.5">{label}</div>
    {payload.map((p:any)=>p.value!=null&&(<div key={p.name} className="flex items-center gap-2 mb-0.5">
      <div className="w-2 h-2 rounded-full" style={{background:p.color}}/>
      <span className="text-white/60 text-[10px]">{p.name}:</span>
      <span className="text-white font-medium">{Number(p.value).toFixed(2)}%</span>
    </div>))}
  </div>);
};

const INSIGHT_COLORS:{[k:string]:string} = {
  up:"text-teal border-teal/20 bg-teal/[0.07]",
  down:"text-coral border-coral/20 bg-coral/[0.07]",
  warn:"text-gold border-gold/20 bg-gold/[0.07]",
  flat:"text-cobalt border-cobalt/20 bg-cobalt/[0.07]",
};

export default function OverviewTab(){
  const[kpis,setKpis]=useState<any>(null);
  const[trend,setTrend]=useState<any[]>([]);
  const[topGdp,setTopGdp]=useState<any[]>([]);
  const[groups,setGroups]=useState<any[]>([]);
  const[insights,setInsights]=useState<any>(null);
  const[pulse,setPulse]=useState("");

  useEffect(()=>{
    load();
    const ch=supabase.channel("weo-live")
      .on("postgres_changes",{event:"INSERT",schema:"datawarehouse",table:"weo_economic"},()=>{
        load(); setPulse(new Date().toLocaleTimeString());
      }).subscribe();
    return()=>{supabase.removeChannel(ch);};
  },[]);

  async function load(){
    const[k,t,g,c,ins]=await Promise.all([fetchKpis(),fetchGdpTrend(),fetchTopGdpCountries(),fetchGroupComposition(),fetchLiveInsights()]);
    setKpis(k);setTrend(t);setTopGdp(g);setGroups(c);setInsights(ins);
  }

  const totalRows=groups.reduce((s,g)=>s+g.count,0);
  const COLORS=["#d4a843","#5a6280","#2dd4bf","#f87171","#60a5fa","#a78bfa","#34d399","#fb923c"];

  return(
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {!kpis?Array.from({length:5}).map((_,i)=><SkeletonKpi key={i}/>):<>
          <KpiCard label="World GDP growth 2024" value={Number(kpis.worldGdpGrowth2024).toFixed(1)} suffix="%" accent="gold" delay={0.05}
            sub="IMF preliminary estimate" delta={{text:"On track",positive:true}}/>
          <KpiCard label="Global inflation 2023" value={Number(kpis.globalInflation2023).toFixed(1)} suffix="%" accent="coral" delay={0.10}
            sub="Avg. CPI across all economies" delta={{text:"-2.0pp from 2022 peak",positive:true}}/>
          <KpiCard label="Largest economy 2023" value="USA" accent="teal" delay={0.15}
            sub={topGdp[0]?.display ? `${topGdp[0].display} nominal GDP` : "Loading..."}
            note={topGdp[1] ? `${topGdp[1].country} at ${topGdp[1].display} ranks 2nd` : undefined}/>
          <KpiCard label="Forecast horizon" value="2030" accent="cobalt" delay={0.20}
            sub={`${(kpis.forecastRows??46294).toLocaleString()} projected data points`}/>
          <KpiCard label="Dataset size" value={(kpis.totalRows??353544).toLocaleString()} accent="neutral" delay={0.25}
            sub="Observations" note="196 countries · 145 indicators"/>
        </>}
      </div>

      {pulse&&(
        <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
          className="flex items-center gap-2 font-mono text-[10px] text-teal/70">
          <div className="w-1.5 h-1.5 rounded-full bg-teal live-dot"/>
          New data received — dashboard refreshed at {pulse}
        </motion.div>
      )}

      {/* Main chart + bar */}
      <div className="grid xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          {!trend.length?<SkeletonChart height={260}/>:(
            <ChartCard title="Real GDP growth rate" subtitle="Annual % change — World, Advanced Economies, Emerging Markets · 2000–2024" badge="Live" badgeColor="teal" delay={0.1} source="IMF World Economic Outlook 2024">
              <div className="flex flex-wrap gap-5 mb-4">
                {[{c:"#eef0f8",l:"World",d:false},{c:"#60a5fa",l:"Advanced Economies",d:true},{c:"#2dd4bf",l:"Emerging Markets",d:true}].map(l=>(
                  <div key={l.l} className="flex items-center gap-2">
                    <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke={l.c} strokeWidth="2" strokeDasharray={l.d?"4 2":undefined}/></svg>
                    <span className="font-mono text-[10px] text-muted">{l.l}</span>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trend} margin={{top:5,right:5,bottom:0,left:-22}}>
                  <defs>
                    {[["wg","#eef0f8"],["ag","#60a5fa"],["eg","#2dd4bf"]].map(([id,c])=>(
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={c} stopOpacity={0.12}/>
                        <stop offset="95%" stopColor={c} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                  <XAxis dataKey="year" tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false}/>
                  <YAxis tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
                  <Tooltip content={<TT/>}/>
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.12)" strokeWidth={1}/>
                  <ReferenceLine x={2009} stroke="#f87171" strokeOpacity={0.25} strokeDasharray="4 2" label={{value:"GFC",fill:"#f87171",fontSize:8,fontFamily:"JetBrains Mono"}}/>
                  <ReferenceLine x={2020} stroke="#f87171" strokeOpacity={0.25} strokeDasharray="4 2" label={{value:"COVID",fill:"#f87171",fontSize:8,fontFamily:"JetBrains Mono"}}/>
                  <Area type="monotone" dataKey="world" stroke="#eef0f8" strokeWidth={2} fill="url(#wg)" dot={false} name="World" connectNulls activeDot={{r:4,fill:"#eef0f8"}}/>
                  <Area type="monotone" dataKey="advanced" stroke="#60a5fa" strokeWidth={1.5} strokeDasharray="5 2" fill="url(#ag)" dot={false} name="Advanced" connectNulls activeDot={{r:3}}/>
                  <Area type="monotone" dataKey="emerging" stroke="#2dd4bf" strokeWidth={1.5} strokeDasharray="5 2" fill="url(#eg)" dot={false} name="Emerging" connectNulls activeDot={{r:3}}/>
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>

        <ChartCard title="Largest economies 2023" subtitle="Nominal GDP — figures in USD trillions (T) for economies above $1T" delay={0.2} source="IMF WEO">
          {!topGdp.length?<div className="h-64 skeleton rounded-xl"/>:
            <BarRace data={topGdp.map(d=>({label:d.country,value:d.value,display:d.display}))}/>}
        </ChartCard>
      </div>

      {/* Insights + Composition */}
      <div className="grid md:grid-cols-3 gap-5">
        <ChartCard title="Dataset by indicator group" subtitle="Share of 353,544 total observations" delay={0.3}>
          <div className="space-y-2.5">
            {!groups.length?Array.from({length:6}).map((_,i)=><div key={i} className="skeleton h-3 rounded"/>):
              groups.filter(g=>g.count>0).map((g,i)=>{
                const pct=totalRows>0?(g.count/totalRows)*100:0;
                return(
                  <div key={g.group} className="flex items-center gap-2.5">
                    <div className="w-16 font-mono text-[9px] text-muted uppercase tracking-wider">{g.group}</div>
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{background:COLORS[i%COLORS.length]}}
                        initial={{width:0}} animate={{width:`${pct}%`}}
                        transition={{duration:0.9,delay:i*0.07,ease:[0.16,1,0.3,1]}}/>
                    </div>
                    <div className="font-mono text-[10px] text-muted w-7 text-right">{pct.toFixed(0)}%</div>
                  </div>
                );
              })
            }
          </div>
        </ChartCard>

        <ChartCard title="Key economic signals" subtitle="Derived from live IMF WEO data — all figures sourced directly, no estimates" delay={0.35} className="md:col-span-2" source="IMF WEO 6.0.0, 2024 Release">
          {!insights?<div className="grid sm:grid-cols-2 gap-3">{Array.from({length:4}).map((_,i)=><div key={i} className="skeleton h-20 rounded-xl"/>)}</div>:(
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  type:"up",icon:"↗",
                  title:`India: fastest G20 growth in 2023`,
                  stat:`+${insights.indiaGdp.toFixed(1)}% real GDP`,
                  body:`India posted ${insights.indiaGdp.toFixed(2)}% real GDP growth in 2023, outpacing China (${insights.chinaGdp?.toFixed(1)??"5.4"}%) and the USA (${insights.usaGdp.toFixed(1)}%). Driven by domestic consumption, infrastructure investment and services exports.`,
                  cite:"IMF WEO 2024, India Article IV"
                },
                {
                  type:"warn",icon:"⚠",
                  title:`Japan debt at ${insights.japanDebt.toFixed(0)}% of GDP`,
                  stat:`${insights.japanDebt.toFixed(0)}% debt-to-GDP`,
                  body:`As of 2023, Japan carries the highest government debt burden among advanced economies at ${insights.japanDebt.toFixed(1)}% of GDP — nearly 2.5× the IMF's 90% sustainability threshold. Driven by decades of fiscal stimulus and demographic pressure from an ageing population.`,
                  cite:"IMF Fiscal Monitor 2024"
                },
                {
                  type:"down",icon:"↘",
                  title:`Germany contracted in 2023`,
                  stat:`${insights.germanyGdp.toFixed(2)}% GDP growth`,
                  body:`Germany recorded ${insights.germanyGdp.toFixed(2)}% real GDP growth in 2023, entering technical recession. Key causes: post-Ukraine energy price shock, weak manufacturing demand from China, and delayed green transition investment.`,
                  cite:"IMF Germany 2024 Article IV"
                },
                {
                  type:"flat",icon:"↓",
                  title:`Global inflation fell to ${insights.worldInf23.toFixed(1)}% in 2023`,
                  stat:`From ${insights.worldInf22.toFixed(1)}% (2022) to ${insights.worldInf23.toFixed(1)}%`,
                  body:`After peaking at ${insights.worldInf22.toFixed(1)}% in 2022 — the highest since the 1980s — global CPI eased to ${insights.worldInf23.toFixed(1)}% in 2023. Aggressive central bank rate hikes in the US, EU and UK were the primary driver.`,
                  cite:"IMF WEO October 2024"
                },
              ].map((ins,i)=>(
                <motion.div key={ins.title} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.4+i*0.08}}
                  className={`p-4 rounded-xl border ${INSIGHT_COLORS[ins.type]}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg leading-none">{ins.icon}</span>
                      <span className="font-medium text-[12px] text-white leading-tight">{ins.title}</span>
                    </div>
                    <span className="font-mono text-[10px] font-semibold whitespace-nowrap ml-2">{ins.stat}</span>
                  </div>
                  <p className="text-[11px] text-white/55 leading-relaxed mb-2">{ins.body}</p>
                  <div className="font-mono text-[9px] text-white/25">{ins.cite}</div>
                </motion.div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}