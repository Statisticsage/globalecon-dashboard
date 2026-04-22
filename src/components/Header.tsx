"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  {id:"overview",   label:"Overview",         color:"#f5c842"},
  {id:"gdp",        label:"GDP & Growth",     color:"#00e5cc"},
  {id:"inflation",  label:"Inflation",        color:"#ff6b6b"},
  {id:"debt",       label:"Debt & Fiscal",    color:"#4d9fff"},
  {id:"country",    label:"Country Explorer", color:"#a78bfa"},
];

export default function Header({activeTab,onTabChange}:{activeTab:string;onTabChange:(t:string)=>void}){
  const[time,setTime]=useState("");
  const[menu,setMenu]=useState(false);
  useEffect(()=>{
    const tick=()=>setTime(new Date().toLocaleTimeString("en-GB",{hour12:false}));
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[]);
  const activeColor=TABS.find(t=>t.id===activeTab)?.color??"#f5c842";
  function handleTab(id:string){onTabChange(id);setMenu(false);}
  return(<>
    <header className="sticky top-0 z-50"
      style={{background:"rgba(7,11,20,0.94)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      <div className="absolute top-0 left-0 right-0 h-[1px] transition-all duration-500"
        style={{background:`linear-gradient(90deg,transparent 0%,${activeColor}60 25%,${activeColor}90 50%,${activeColor}60 75%,transparent 100%)`}}/>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <motion.div initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{duration:0.5}}
          className="flex items-center gap-3 flex-shrink-0">
          <div className="relative w-7 h-7 flex-shrink-0">
            <div className="absolute inset-0 rounded-lg" style={{background:"rgba(245,200,66,0.15)",border:"1px solid rgba(245,200,66,0.3)"}}/>
            <div className="absolute inset-2 rounded-sm" style={{background:"var(--gold)"}}/>
          </div>
          <div>
            <div className="font-display leading-none" style={{color:"white",fontSize:"clamp(15px,4vw,18px)"}}>
              Macro<span style={{color:"var(--gold)",fontStyle:"italic"}}>Lens</span>
            </div>
            <div className="hidden sm:block font-mono text-[8px] tracking-[0.12em] uppercase mt-0.5" style={{color:"rgba(255,255,255,0.2)"}}>
              Global Economic Intelligence
            </div>
          </div>
        </motion.div>
        <div className="hidden lg:flex items-center gap-5">
          {[{v:"353,544",l:"Observations",c:"var(--gold)"},{v:"196",l:"Countries",c:"var(--teal)"},{v:"1980–2030",l:"Coverage",c:"var(--cobalt)"}].map(p=>(
            <div key={p.l} className="text-center">
              <div className="font-mono text-[11px] font-medium" style={{color:p.c}}>{p.v}</div>
              <div className="font-mono text-[8px] uppercase tracking-wider" style={{color:"rgba(255,255,255,0.2)"}}>{p.l}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
            style={{border:"1px solid rgba(0,229,204,0.2)",background:"rgba(0,229,204,0.07)"}}>
            <div className="live-dot w-1.5 h-1.5 rounded-full" style={{background:"var(--teal)"}}/>
            <span className="font-mono text-[10px]" style={{color:"var(--teal)"}}>Live</span>
          </div>
          <span className="hidden md:block font-mono text-[11px]" style={{color:"rgba(255,255,255,0.2)"}}>{time}</span>
          <button onClick={()=>setMenu(m=>!m)} className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg transition-colors"
            style={{background:menu?"rgba(245,200,66,0.1)":"transparent"}} aria-label="Navigation menu">
            {[0,1,2].map(i=>(
              <motion.div key={i} className="w-5 h-0.5 rounded-full" style={{background:menu?"var(--gold)":"rgba(255,255,255,0.5)"}}
                animate={menu?(i===0?{rotate:45,y:8}:i===2?{rotate:-45,y:-8}:{opacity:0}):{rotate:0,y:0,opacity:1}}
                transition={{duration:0.2}}/>
            ))}
          </button>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto hidden lg:flex" style={{borderTop:"1px solid rgba(255,255,255,0.04)"}}>
        {TABS.map((tab,i)=>(
          <motion.button key={tab.id} initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} transition={{delay:0.08+i*0.05}}
            onClick={()=>handleTab(tab.id)}
            className="relative px-5 py-3 text-[11px] font-medium tracking-wider uppercase transition-colors duration-200 flex-shrink-0"
            style={{color:activeTab===tab.id?tab.color:"rgba(255,255,255,0.28)"}}>
            {tab.label}
            {activeTab===tab.id&&(
              <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                style={{background:tab.color,boxShadow:`0 0 8px ${tab.color}80`}}
                transition={{type:"spring",stiffness:500,damping:40}}/>
            )}
          </motion.button>
        ))}
      </div>
      <div className="lg:hidden overflow-x-auto" style={{borderTop:"1px solid rgba(255,255,255,0.04)",scrollbarWidth:"none"}}>
        <div className="flex min-w-max px-4">
          {TABS.map(tab=>(
            <button key={tab.id} onClick={()=>handleTab(tab.id)}
              className="relative px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase flex-shrink-0 transition-colors"
              style={{color:activeTab===tab.id?tab.color:"rgba(255,255,255,0.3)"}}>
              {tab.label}
              {activeTab===tab.id&&(
                <motion.div layoutId="tab-line-mobile" className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                  style={{background:tab.color}} transition={{type:"spring",stiffness:500,damping:40}}/>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
    <AnimatePresence>
      {menu&&(
        <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
          className="fixed inset-x-0 z-40 shadow-2xl"
          style={{top:"112px",background:"rgba(11,15,26,0.98)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div className="max-w-screen-2xl mx-auto px-4 py-4 space-y-1">
            {TABS.map((tab,i)=>(
              <motion.button key={tab.id} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                onClick={()=>handleTab(tab.id)}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all"
                style={{background:activeTab===tab.id?`${tab.color}12`:"transparent",border:`1px solid ${activeTab===tab.id?`${tab.color}30`:"transparent"}`}}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:tab.color}}/>
                <span className="font-medium text-[14px]" style={{color:activeTab===tab.id?tab.color:"rgba(255,255,255,0.7)"}}>{tab.label}</span>
                {activeTab===tab.id&&<span className="ml-auto font-mono text-[9px] px-2 py-0.5 rounded-full" style={{background:`${tab.color}20`,color:tab.color}}>Active</span>}
              </motion.button>
            ))}
            <div className="grid grid-cols-3 gap-3 pt-3 mt-2" style={{borderTop:"1px solid rgba(255,255,255,0.06)"}}>
              {[{v:"353,544",l:"Observations",c:"var(--gold)"},{v:"196",l:"Countries",c:"var(--teal)"},{v:"1980–2030",l:"Coverage",c:"var(--cobalt)"}].map(p=>(
                <div key={p.l} className="text-center p-2 rounded-lg" style={{background:"rgba(255,255,255,0.03)"}}>
                  <div className="font-mono text-[12px] font-medium" style={{color:p.c}}>{p.v}</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider mt-0.5" style={{color:"rgba(255,255,255,0.3)"}}>{p.l}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>);
}