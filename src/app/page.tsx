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
    <div className="min-h-screen" style={{background:"#0b0f1a"}}>
      <Header activeTab={tab} onTabChange={setTab}/>
      <main className="max-w-screen-2xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
            transition={{duration:0.28,ease:[0.16,1,0.3,1]}}>
            <Tab/>
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="max-w-screen-2xl mx-auto px-6 py-8 mt-6 border-t border-white/[0.05]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-display text-[15px] text-white/80 mb-1.5">GlobalEcon Intelligence</div>
            <p className="font-mono text-[10px] text-muted leading-relaxed max-w-lg">
              All data sourced directly from the IMF World Economic Outlook (WEO) 2024 release. Figures represent
              official IMF estimates, projections, and historical series. This dashboard covers 196 sovereign states
              and 13 regional aggregates across 145 economic indicators from 1980 to 2030.
              Data refreshes automatically via real-time database subscription.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="live-dot w-1.5 h-1.5 rounded-full bg-teal"/>
              <span className="font-mono text-[10px] text-teal/60">Real-time · Auto-refreshes on new data</span>
            </div>
            <div className="font-mono text-[9px] text-muted">353,544 obs · 196 countries · 145 indicators</div>
            <div className="font-mono text-[9px] text-muted">IMF World Economic Outlook 6.0.0 ·</div>
            <div className="font-mono text-[9px] text-muted/40">Not affiliated with or endorsed by the IMF</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
