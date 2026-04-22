"use client";
import { motion } from "framer-motion";

type Accent = "gold"|"teal"|"coral"|"cobalt"|"violet"|"green"|"neutral";

const CFG: Record<Accent,{card:string; bar:string; val:string; delta_p:string; delta_n:string}> = {
  gold:   {card:"card-gold",   bar:"#f5c842", val:"#f5c842", delta_p:"bg-[rgba(0,229,204,0.12)] text-[#00e5cc] border-[rgba(0,229,204,0.2)]",   delta_n:"bg-[rgba(255,107,107,0.12)] text-[#ff6b6b] border-[rgba(255,107,107,0.2)]"},
  teal:   {card:"card-teal",   bar:"#00e5cc", val:"#00e5cc", delta_p:"bg-[rgba(0,229,204,0.12)] text-[#00e5cc] border-[rgba(0,229,204,0.2)]",   delta_n:"bg-[rgba(255,107,107,0.12)] text-[#ff6b6b] border-[rgba(255,107,107,0.2)]"},
  coral:  {card:"card-coral",  bar:"#ff6b6b", val:"#ff6b6b", delta_p:"bg-[rgba(0,229,204,0.12)] text-[#00e5cc] border-[rgba(0,229,204,0.2)]",   delta_n:"bg-[rgba(255,107,107,0.12)] text-[#ff6b6b] border-[rgba(255,107,107,0.2)]"},
  cobalt: {card:"card-cobalt", bar:"#4d9fff", val:"#4d9fff", delta_p:"bg-[rgba(0,229,204,0.12)] text-[#00e5cc] border-[rgba(0,229,204,0.2)]",   delta_n:"bg-[rgba(255,107,107,0.12)] text-[#ff6b6b] border-[rgba(255,107,107,0.2)]"},
  violet: {card:"card-violet", bar:"#a78bfa", val:"#a78bfa", delta_p:"bg-[rgba(0,229,204,0.12)] text-[#00e5cc] border-[rgba(0,229,204,0.2)]",   delta_n:"bg-[rgba(255,107,107,0.12)] text-[#ff6b6b] border-[rgba(255,107,107,0.2)]"},
  green:  {card:"card-green",  bar:"#34d399", val:"#34d399", delta_p:"bg-[rgba(52,211,153,0.12)] text-[#34d399] border-[rgba(52,211,153,0.2)]", delta_n:"bg-[rgba(255,107,107,0.12)] text-[#ff6b6b] border-[rgba(255,107,107,0.2)]"},
  neutral:{card:"",            bar:"rgba(255,255,255,0.2)", val:"#e8ecf8", delta_p:"bg-[rgba(0,229,204,0.12)] text-[#00e5cc] border-[rgba(0,229,204,0.2)]", delta_n:"bg-[rgba(255,107,107,0.12)] text-[#ff6b6b] border-[rgba(255,107,107,0.2)]"},
};

interface Props {
  label:string; value:string; sub?:string;
  delta?:{text:string;positive:boolean};
  accent?:Accent; delay?:number; suffix?:string; note?:string;
}

export default function KpiCard({label,value,sub,delta,accent="gold",delay=0,suffix,note}:Props){
  const c = CFG[accent];
  return(
    <motion.div
      initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
      transition={{duration:0.5,delay,ease:[0.16,1,0.3,1]}}
      className={`dash-card ${c.card} p-5 cursor-default group`}
    >
      {/* Glowing top bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{background:c.bar, boxShadow:`0 0 12px ${c.bar}80`}}/>

      {/* Corner glow orb */}
      <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40"
        style={{background:c.bar}}/>

      <div className="relative">
        <div className="font-mono text-[9px] uppercase tracking-[0.14em] mb-2.5" style={{color:"var(--muted2)"}}>
          {label}
        </div>

        <div className="flex items-end gap-1 mb-2">
          <span className="font-display text-[34px] leading-none" style={{color:c.val}}>
            {value}
          </span>
          {suffix && (
            <span className="font-display text-[20px] leading-none mb-0.5" style={{color:c.val,opacity:0.5}}>
              {suffix}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {sub && <span className="text-[11px]" style={{color:"var(--muted2)"}}>{sub}</span>}
          {delta && (
            <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border font-medium ${
              delta.positive ? c.delta_p : c.delta_n
            }`}>
              {delta.positive ? "+" : ""}{delta.text}
            </span>
          )}
        </div>

        {note && (
          <div className="mt-2 text-[10px] leading-relaxed" style={{color:"var(--muted)"}}>
            {note}
          </div>
        )}
      </div>
    </motion.div>
  );
}