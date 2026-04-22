"use client";
import { useEffect, useState } from "react";
import { AreaChart,Area,BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,ReferenceLine } from "recharts";
import { motion } from "framer-motion";
import KpiCard from "../KpiCard";
import ChartCard from "../ChartCard";
import BarRace from "../BarRace";
import { SkeletonChart,SkeletonKpi } from "../Skeleton";
import { fetchGdpTrend,fetchTopGdpCountries,fetchGdpPerCapita } from "@/lib/queries";

const TT=({active,payload,label}:any)=>{
  if(!active||!payload?.length)return null;
  return(<div className="dash-tooltip"><div className="font-mono text-[10px] text-white/40 mb-1.5">{label}</div>
    {payload.map((p:any)=>p.value!=null&&(<div key={p.name} className="flex items-center gap-2 mb-0.5">
      <div className="w-2 h-2 rounded-full" style={{background:p.color}}/><span className="text-white/60 text-[10px]">{p.name}:</span>
      <span className="text-white font-medium">{Number(p.value).toFixed(2)}%</span></div>))}
  </div>);
};

export default function GdpTab(){
  const[trend,setTrend]     = useState<any[]>([]);
  const[top,setTop]         = useState<any[]>([]);
  const[perCap,setPerCap]   = useState<any[]>([]);
  const[loading,setLoading] = useState(true);

  useEffect(()=>{
    Promise.all([fetchGdpTrend(),fetchTopGdpCountries(),fetchGdpPerCapita()])
      .then(([t,tp,pc])=>{setTrend(t);setTop(tp);setPerCap(pc);setLoading(false);});
  },[]);

  const latest = trend[trend.length-1]??{};
  const min2020 = trend.find(d=>d.year===2020)?.world;
  const max2021 = trend.find(d=>d.year===2021)?.world;

  return(
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading?Array.from({length:4}).map((_,i)=><SkeletonKpi key={i}/>):<>
          <KpiCard label="World GDP growth 2024" value={latest.world?.toFixed(1)??"3.3"} suffix="%" accent="gold" delay={0.05} sub="IMF WEO preliminary estimate"/>
          <KpiCard label="Advanced economies" value={latest.advanced?.toFixed(1)??"1.8"} suffix="%" accent="cobalt" delay={0.10} sub="US, EU, Japan — 2024"/>
          <KpiCard label="COVID shock 2020" value={min2020?.toFixed(1)??"−2.7"} suffix="%" accent="coral" delay={0.15} sub="Worst contraction since WW2"/>
          <KpiCard label="2021 rebound" value={max2021!=null?`+${max2021.toFixed(1)}`:"+6.6"} accent="teal" delay={0.20} sub="Fastest recovery in 50 years"/>
        </>}
      </div>

      {loading?<SkeletonChart height={260}/>:(
        <ChartCard title="Real GDP growth by economic group" subtitle="Annual % change · World, Advanced Economies, Emerging Markets · 2000–2024" badge="IMF WEO" badgeColor="teal" delay={0.1} source="IMF World Economic Outlook 6.0.0">
          <div className="flex flex-wrap gap-5 mb-4">
            {[{c:"#eef0f8",l:"World"},{c:"#60a5fa",l:"Advanced Economies",d:true},{c:"#2dd4bf",l:"Emerging Markets",d:true}].map(l=>(
              <div key={l.l} className="flex items-center gap-2">
                <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke={l.c} strokeWidth="2" strokeDasharray={(l as any).d?"4 2":undefined}/></svg>
                <span className="font-mono text-[10px] text-muted">{l.l}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trend} margin={{top:5,right:5,bottom:0,left:-22}}>
              <defs>
                {[["g1","#eef0f8"],["g2","#60a5fa"],["g3","#2dd4bf"]].map(([id,c])=>(
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.12}/><stop offset="95%" stopColor={c} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="year" tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<TT/>}/>
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1}/>
              <ReferenceLine x={2009} stroke="#f87171" strokeOpacity={0.2} strokeDasharray="4 2" label={{value:"GFC",fill:"#f87171",fontSize:8,fontFamily:"JetBrains Mono"}}/>
              <ReferenceLine x={2020} stroke="#f87171" strokeOpacity={0.2} strokeDasharray="4 2" label={{value:"COVID",fill:"#f87171",fontSize:8,fontFamily:"JetBrains Mono"}}/>
              <Area type="monotone" dataKey="world" stroke="#eef0f8" strokeWidth={2} fill="url(#g1)" dot={false} name="World" connectNulls activeDot={{r:4}}/>
              <Area type="monotone" dataKey="advanced" stroke="#60a5fa" strokeWidth={1.5} strokeDasharray="5 2" fill="url(#g2)" dot={false} name="Advanced" connectNulls activeDot={{r:3}}/>
              <Area type="monotone" dataKey="emerging" stroke="#2dd4bf" strokeWidth={1.5} strokeDasharray="5 2" fill="url(#g3)" dot={false} name="Emerging" connectNulls activeDot={{r:3}}/>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <ChartCard title="Largest economies by GDP 2023" subtitle="Nominal GDP in USD — T = Trillion, B = Billion" delay={0.2} source="IMF WEO 2024">
          {!top.length?<div className="h-56 skeleton rounded-xl"/>:<BarRace data={top.map(d=>({label:d.country,value:d.value,display:d.display}))}/>}
        </ChartCard>
        <ChartCard title="GDP per capita 2023" subtitle="Nominal USD per person — T = Thousand" delay={0.25} source="IMF WEO 2024">
          {!perCap.length?<div className="h-56 skeleton rounded-xl"/>:<BarRace data={perCap.map(d=>({label:d.country,value:d.value,display:d.display}))} colorFn={i=>"#60a5fa"}/>}
        </ChartCard>
      </div>

      {/* Context note */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
        className="dash-card p-4 border-l-4 border-gold/30">
        <div className="font-mono text-[9px] text-muted uppercase tracking-wider mb-1.5">Reading guide — GDP figures</div>
        <p className="text-[11px] text-white/50 leading-relaxed">
          <span className="text-white/70 font-medium">Nominal GDP</span> measures total output in current USD. 
          Values above $1 trillion (T) are shown in trillions; smaller economies use billions (B).
          <span className="text-white/70 font-medium ml-1">Real GDP growth</span> adjusts for inflation — it measures how much the economy actually expanded in volume terms.
          Source: IMF World Economic Outlook 2024.
        </p>
      </motion.div>
    </div>
  );
}