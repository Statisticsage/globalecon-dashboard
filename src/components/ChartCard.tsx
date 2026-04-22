"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  title:string; subtitle?:string; children:ReactNode;
  className?:string; delay?:number;
  badge?:string; badgeColor?:"gold"|"teal"|"coral"|"cobalt"|"violet"|"green";
  action?:ReactNode; source?:string;
}

const BADGE_CLS:Record<string,string> = {
  gold:  "badge badge-gold",
  teal:  "badge badge-teal",
  coral: "badge badge-coral",
  cobalt:"badge badge-cobalt",
  violet:"badge badge-violet",
  green: "badge badge-green",
};

export default function ChartCard({title,subtitle,children,className="",delay=0,badge,badgeColor="teal",action,source}:Props){
  return(
    <motion.div
      initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
      transition={{duration:0.55,delay,ease:[0.16,1,0.3,1]}}
      className={`dash-card p-6 ${className}`}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h3 className="font-display text-[16px]" style={{color:"var(--txt)"}}>{title}</h3>
            {badge&&<span className={BADGE_CLS[badgeColor??""]}>{badge}</span>}
          </div>
          {subtitle&&<p className="font-mono text-[10px] leading-relaxed" style={{color:"var(--muted2)"}}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
      {source&&(
        <div className="mt-4 pt-3" style={{borderTop:"1px solid rgba(255,255,255,0.05)"}}>
          <span className="font-mono text-[9px]" style={{color:"var(--muted)"}}>Source: {source}</span>
        </div>
      )}
    </motion.div>
  );
}