"use client";
import { useEffect, useState } from "react";
import { LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,ReferenceLine,ReferenceArea } from "recharts";
import { motion } from "framer-motion";
import KpiCard from "../KpiCard";
import ChartCard from "../ChartCard";
import BarRace from "../BarRace";
import { SkeletonChart,SkeletonKpi } from "../Skeleton";
import { fetchInflationTrend,fetchInflationExtremes } from "@/lib/queries";

const TT=({active,payload,label}:any)=>{
  if(!active||!payload?.length)return null;
  return(<div className="dash-tooltip"><div className="font-mono text-[10px] text-white/40 mb-1.5">{label}</div>
    {payload.map((p:any)=>p.value!=null&&(<div key={p.name} className="flex items-center gap-2 mb-0.5">
      <div className="w-2 h-2 rounded-full" style={{background:p.color}}/><span className="text-white/60 text-[10px]">{p.name}:</span>
      <span className="text-white font-medium">{Number(p.value).toFixed(1)}%</span></div>))}
  </div>);
};

export default function InflationTab(){
  const[trend,setTrend]       = useState<any[]>([]);
  const[extremes,setExtremes] = useState<any[]>([]);
  const[loading,setLoading]   = useState(true);

  useEffect(()=>{
    Promise.all([fetchInflationTrend(),fetchInflationExtremes()])
      .then(([t,e])=>{setTrend(t);setExtremes(e);setLoading(false);});
  },[]);

  const w23=trend.find(d=>d.year===2023)?.world;
  const w22=trend.find(d=>d.year===2022)?.world;
  const adv23=trend.find(d=>d.year===2023)?.advanced;

  return(
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading?Array.from({length:4}).map((_,i)=><SkeletonKpi key={i}/>):<>
          <KpiCard label="Global CPI 2023" value={w23?.toFixed(1)??"6.6"} suffix="%" accent="coral" delay={0.05} sub="World average inflation rate" delta={{text:"−2.0pp from 2022",positive:true}}/>
          <KpiCard label="2022 crisis peak" value={w22?.toFixed(1)??"8.6"} suffix="%" accent="coral" delay={0.10} sub="Highest since 1980s oil shock" note="Triggered by Ukraine war + supply chains"/>
          <KpiCard label="Advanced economies" value={adv23?.toFixed(1)??"4.6"} suffix="%" accent="cobalt" delay={0.15} sub="US, EU, Japan — CPI 2023"/>
          <KpiCard label="Target rate" value="2" suffix="%" accent="teal" delay={0.20} sub="Fed / ECB / BoE target" note="Most central banks aim for 2% stability"/>
        </>}
      </div>

      {loading?<SkeletonChart height={260}/>:(
        <ChartCard title="Global inflation trajectory" subtitle="Annual CPI % change · World, Advanced Economies, Emerging Markets · 2000–2024" delay={0.1} source="IMF WEO 2024">
          <div className="flex flex-wrap gap-5 mb-4">
            {[{c:"#f87171",l:"World"},{c:"#60a5fa",l:"Advanced Economies",d:true},{c:"#d4a843",l:"Emerging Markets",d:true}].map(l=>(
              <div key={l.l} className="flex items-center gap-2">
                <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke={l.c} strokeWidth="2" strokeDasharray={(l as any).d?"4 2":undefined}/></svg>
                <span className="font-mono text-[10px] text-muted">{l.l}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend} margin={{top:5,right:5,bottom:0,left:-22}}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="year" tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<TT/>}/>
              <ReferenceLine y={2} stroke="#2dd4bf" strokeDasharray="4 2" strokeOpacity={0.5} label={{value:"2% target",fill:"#2dd4bf",fontSize:8,fontFamily:"JetBrains Mono",position:"right"}}/>
              <ReferenceArea x1={2021} x2={2023} fill="#f87171" fillOpacity={0.04}/>
              <Line type="monotone" dataKey="world" stroke="#f87171" strokeWidth={2.5} dot={false} name="World" connectNulls activeDot={{r:4,fill:"#f87171"}}/>
              <Line type="monotone" dataKey="advanced" stroke="#60a5fa" strokeWidth={1.5} strokeDasharray="5 2" dot={false} name="Advanced" connectNulls activeDot={{r:3}}/>
              <Line type="monotone" dataKey="emerging" stroke="#d4a843" strokeWidth={1.5} strokeDasharray="5 2" dot={false} name="Emerging" connectNulls activeDot={{r:3}}/>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <ChartCard title="Highest inflation in 2022" subtitle="Countries with CPI above 20% — post-Ukraine war energy and supply chain crisis" delay={0.2} source="IMF WEO 2024">
          {!extremes.length?<div className="h-56 skeleton rounded-xl"/>:
            <BarRace data={extremes.map(d=>({label:d.country,value:d.value,display:d.display}))} colorFn={()=>"#f87171"}/>}
        </ChartCard>

        <ChartCard title="Why did inflation spike in 2022?" subtitle="Context for the global inflation crisis" delay={0.25}>
          <div className="space-y-3">
            {[
              {icon:"⚡",color:"text-coral",title:"Energy price shock",body:"Russia's invasion of Ukraine in February 2022 cut European gas supplies by 40%, driving energy prices to record highs and feeding directly into CPI."},
              {icon:"🚢",color:"text-gold",title:"Supply chain breakdown",body:"COVID-era shipping disruptions, port congestion, and chip shortages kept goods prices elevated throughout 2021–2022."},
              {icon:"💵",color:"text-cobalt",title:"Stimulus overhang",body:"An estimated $13 trillion in global fiscal and monetary stimulus was injected during 2020–2021, creating excess demand that outpaced supply recovery. (IMF Fiscal Monitor 2022)"},
              {icon:"🌾",color:"text-teal",title:"Food price surge",body:"Ukraine and Russia account for 30% of global wheat exports. The war triggered food price spikes across 50+ importing nations."},
            ].map((r,i)=>(
              <motion.div key={r.title} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.07}}
                className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-xl flex-shrink-0 mt-0.5">{r.icon}</span>
                <div>
                  <div className={`font-semibold text-[12px] mb-0.5 ${r.color}`}>{r.title}</div>
                  <p className="text-[11px] text-white/45 leading-relaxed">{r.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}