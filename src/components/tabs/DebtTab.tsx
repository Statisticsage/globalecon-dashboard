"use client";
import { useEffect, useState } from "react";
import { LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,ReferenceLine } from "recharts";
import { motion } from "framer-motion";
import KpiCard from "../KpiCard";
import ChartCard from "../ChartCard";
import BarRace from "../BarRace";
import { SkeletonChart,SkeletonKpi } from "../Skeleton";
import { fetchDebtTrend,fetchDebtRankings,fetchFiscalBalance,fetchKeyDebtCountries } from "@/lib/queries";

const TT=({active,payload,label}:any)=>{
  if(!active||!payload?.length)return null;
  return(<div className="dash-tooltip"><div className="font-mono text-[10px] text-white/40 mb-1.5">{label}</div>
    {payload.map((p:any)=>p.value!=null&&(<div key={p.name} className="flex items-center gap-2 mb-0.5">
      <div className="w-2 h-2 rounded-full" style={{background:p.color}}/><span className="text-white/60 text-[10px]">{p.name}:</span>
      <span className="text-white font-medium">{Number(p.value).toFixed(1)}%</span></div>))}
  </div>);
};

const DEBT_COLORS:Record<string,string>={Japan:"#f87171",USA:"#60a5fa",Germany:"#2dd4bf",Greece:"#d4a843",Italy:"#a78bfa",UK:"#eef0f8"};

export default function DebtTab(){
  const[trend,setTrend]   = useState<any[]>([]);
  const[rank,setRank]     = useState<any[]>([]);
  const[keyCountries,setKeyCountries] = useState<Record<string,number>>({});
  const[fiscal,setFiscal] = useState<any>({surpluses:[],deficits:[]});
  const[loading,setLoading] = useState(true);

  useEffect(()=>{
    Promise.all([fetchDebtTrend(),fetchDebtRankings(),fetchFiscalBalance(),fetchKeyDebtCountries()])
      .then(([t,r,f,k])=>{setTrend(t);setRank(r);setFiscal(f);setKeyCountries(k);setLoading(false);});
  },[]);

  const japanVal   = keyCountries["Japan"];
  const usaVal     = keyCountries["United States"];
  const germanyVal = keyCountries["Germany"];
  const japanNote  = japanVal ? `${(japanVal/90).toFixed(1)}x the IMF 90% sustainability threshold` : undefined;
  const japanProse = japanVal
    ? `Japan at ${japanVal.toFixed(0)}% is a notable outlier - ultra-low yields and domestic creditors have kept it stable, but the long-term risk is elevated.`
    : "";

  return(
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? Array.from({length:4}).map((_,i)=><SkeletonKpi key={i}/>) : <>
          <KpiCard
            label={japanVal ? "Japan - highest advanced economy" : "Highest debt 2023"}
            value={japanVal ? japanVal.toFixed(0) : (rank[0]?.value.toFixed(0) ?? "-")}
            suffix="%" accent="coral" delay={0.05}
            sub="Govt gross debt / GDP" note={japanNote}/>
          <KpiCard label="USA federal debt 2023"
            value={usaVal ? usaVal.toFixed(0) : "-"}
            suffix="%" accent="cobalt" delay={0.10}
            sub="Post-COVID fiscal expansion"/>
          <KpiCard label="Germany 2023"
            value={germanyVal ? germanyVal.toFixed(0) : "-"}
            suffix="%" accent="teal" delay={0.15}
            sub="EU fiscal anchor"/>
          <KpiCard label="IMF risk threshold" value="90" suffix="%" accent="gold" delay={0.20}
            sub="Debt sustainability warning"
            note="Economies above 90% face elevated rollover risk"/>
        </>}
      </div>

      {loading ? <SkeletonChart height={260}/> : (
        <ChartCard title="Government debt as % of GDP" subtitle="Annual % - Japan, USA, Germany, Greece, Italy, UK - 2000 to 2023" delay={0.1} source="IMF Fiscal Monitor 2024">
          <div className="flex flex-wrap gap-4 mb-4">
            {Object.entries(DEBT_COLORS).map(([name,color])=>(
              <div key={name} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded-full" style={{background:color}}/>
                <span className="font-mono text-[10px]" style={{color:"var(--muted2)"}}>{name}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend} margin={{top:5,right:10,bottom:0,left:-10}}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="year" tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fontSize:9,fontFamily:"JetBrains Mono",fill:"#5a6280"}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<TT/>}/>
              <ReferenceLine y={90} stroke="#f87171" strokeDasharray="4 2" strokeOpacity={0.4}
                label={{value:"90% IMF",fill:"#f87171",fontSize:8,fontFamily:"JetBrains Mono",position:"right"}}/>
              {Object.entries(DEBT_COLORS).map(([name,color])=>(
                <Line key={name} type="monotone" dataKey={name} stroke={color}
                  strokeWidth={name==="Japan"?2.5:1.8} dot={false} name={name}
                  connectNulls activeDot={{r:3,fill:color}}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <ChartCard title="Highest debt/GDP ratios 2023" subtitle="Government gross debt as % of GDP - top 12 countries" delay={0.2} source="IMF WEO 2024">
          {!rank.length ? <div className="h-56 skeleton rounded-xl"/> :
            <BarRace data={rank.map(d=>({label:d.country,value:d.value,display:d.display}))}
              colorFn={i=>i<3?"#f87171":i<6?"#d4a843":"#60a5fa"}/>}
        </ChartCard>
        <ChartCard title="Fiscal balance 2023" subtitle="Net lending (+) or borrowing (-) as % of GDP" delay={0.25} source="IMF Fiscal Monitor 2024">
          {!fiscal.surpluses.length ? <div className="h-56 skeleton rounded-xl"/> : (
            <div className="space-y-4">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-wider mb-2.5" style={{color:"var(--teal)"}}>Surplus countries</div>
                <BarRace data={fiscal.surpluses.map((d:any)=>({label:d.country,value:Math.abs(d.value),display:d.display}))} colorFn={()=>"#2dd4bf"}/>
              </div>
              <div className="pt-4" style={{borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                <div className="font-mono text-[9px] uppercase tracking-wider mb-2.5" style={{color:"var(--coral)"}}>Deficit countries</div>
                <BarRace data={fiscal.deficits.map((d:any)=>({label:d.country,value:Math.abs(d.value),display:d.display}))} colorFn={()=>"#f87171"}/>
              </div>
            </div>
          )}
        </ChartCard>
      </div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
        className="dash-card p-4" style={{borderLeft:"4px solid rgba(77,159,255,0.35)"}}>
        <div className="font-mono text-[9px] uppercase tracking-wider mb-1.5" style={{color:"var(--muted2)"}}>Reading guide</div>
        <p className="text-[11px] leading-relaxed" style={{color:"rgba(255,255,255,0.45)"}}>
          Debt/GDP compares total government borrowing to the economy size. The IMF flags 90% as a sustainability threshold
          - above it, debt servicing can crowd out productive spending. {japanProse} A fiscal surplus means government
          collected more than it spent that year; a deficit means it borrowed the shortfall.
        </p>
      </motion.div>
    </div>
  );
}
