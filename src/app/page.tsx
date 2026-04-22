"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Header from "@/components/Header";

const OverviewTab  = dynamic(()=>import("@/components/tabs/OverviewTab"),  {ssr:false});
const GdpTab       = dynamic(()=>import("@/components/tabs/GdpTab"),       {ssr:false});
const InflationTab = dynamic(()=>import("@/components/tabs/InflationTab"), {ssr:false});
const DebtTab      = dynamic(()=>import("@/components/tabs/DebtTab"),      {ssr:false});
const CountryTab   = dynamic(()=>import("@/components/tabs/CountryTab"),   {ssr:false});

const TABS: Record<string, React.ComponentType> = {
  overview: OverviewTab, gdp: GdpTab,
  inflation: InflationTab, debt: DebtTab, country: CountryTab,
};

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const Tab = TABS[tab] ?? OverviewTab;
  return (
    <div className="min-h-screen" style={{background:"#070b14"}}>
      <Header activeTab={tab} onTabChange={setTab}/>
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
            transition={{duration:0.28,ease:[0.16,1,0.3,1]}}>
            <Tab/>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 mt-6"
        style={{borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand + description */}
          <div>
            <div className="font-display text-[16px] mb-2" style={{color:"rgba(255,255,255,0.8)"}}>
              Macro<span style={{color:"var(--gold)",fontStyle:"italic"}}>Lens</span>
            </div>
            <p className="font-mono text-[10px] leading-relaxed max-w-lg" style={{color:"var(--muted)"}}>
              All data sourced from the IMF World Economic Outlook 2024 release.
              Figures represent official IMF estimates, projections and historical series.
              Covers 196 sovereign states and 13 regional aggregates across 145 indicators
              from 1980 to 2030. Dashboard refreshes automatically when new data is added.
            </p>
          </div>

          {/* Meta info */}
          <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="live-dot w-1.5 h-1.5 rounded-full" style={{background:"var(--teal)"}}/>
              <span className="font-mono text-[10px]" style={{color:"rgba(0,229,204,0.6)"}}>
                Real-time · Auto-refreshes on new data
              </span>
            </div>
            <div className="font-mono text-[9px]" style={{color:"var(--muted)"}}>
              353,544 observations · 196 countries · 145 indicators
            </div>
            <div className="font-mono text-[9px]" style={{color:"var(--muted)"}}>
              Source: IMF World Economic Outlook 2024
            </div>
            <div className="font-mono text-[9px]" style={{color:"rgba(255,255,255,0.2)"}}>
              Not affiliated with or endorsed by the IMF
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}