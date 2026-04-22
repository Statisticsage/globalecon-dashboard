"use client";
import { motion } from "framer-motion";

interface Item { label:string; value:number; display?:string; }
interface Props { data:Item[]; maxValue?:number; color?:string; colorFn?:(i:number)=>string; }

const PALETTE = ["#d4a843","#2dd4bf","#60a5fa","#f87171","#a78bfa","#34d399","#fb923c","#e879f9","#22d3ee","#4ade80"];

export default function BarRace({data,maxValue,color,colorFn}:Props) {
  const max = maxValue ?? Math.max(...data.map(d=>d.value),1);
  return (
    <div className="space-y-3">
      {data.map((item,i)=>{
        const c = color ?? (colorFn ? colorFn(i) : PALETTE[i%PALETTE.length]);
        const pct = Math.max((item.value/max)*100, 2);
        return (
          <div key={item.label} className="flex items-center gap-3">
            <div className="w-28 font-mono text-[10px] text-white/60 truncate flex-shrink-0">{item.label}</div>
            <div className="flex-1 h-4 bg-white/[0.04] rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{background:c,opacity:0.85}}
                initial={{width:0}} animate={{width:`${pct}%`}}
                transition={{duration:0.9,delay:i*0.05,ease:[0.16,1,0.3,1]}}/>
            </div>
            <div className="font-mono text-[11px] text-white/70 w-16 text-right flex-shrink-0 font-medium">
              {item.display ?? (item.value != null ? item.value.toFixed(1) : "N/A")}
            </div>
          </div>
        );
      })}
    </div>
  );
}
