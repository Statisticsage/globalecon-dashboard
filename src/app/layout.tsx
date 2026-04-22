import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://macrolens.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MacroLens | Global Economic Intelligence Platform",
    template: "%s | MacroLens",
  },
  description: "MacroLens is a live macroeconomic intelligence platform covering 196 countries, 145 IMF indicators and projections to 2030. Explore GDP growth, inflation, government debt and fiscal balance in real time.",
  keywords: ["macroeconomics","IMF economic data","world economic outlook","GDP growth","global inflation","government debt","economic dashboard","WEO 2024","MacroLens"],
  authors: [{name:"MacroLens"}],
  creator: "MacroLens",
  publisher: "MacroLens",
  robots: {index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large"}},
  openGraph: {
    type:"website",locale:"en_US",url:BASE_URL,siteName:"MacroLens",
    title:"MacroLens | Global Economic Intelligence Platform",
    description:"Live macroeconomic intelligence — 196 countries, 353,544 data points, IMF WEO projections to 2030.",
    images:[{url:"/og-image.png",width:1200,height:630,alt:"MacroLens Dashboard"}],
  },
  twitter: {
    card:"summary_large_image",
    title:"MacroLens | Global Economic Intelligence",
    description:"Live macroeconomic intelligence — 196 countries, 353,544 data points, IMF WEO projections to 2030.",
    images:["/og-image.png"],
  },
  alternates:{canonical:BASE_URL},
};

export const viewport: Viewport = {
  themeColor:"#070b14",colorScheme:"dark",
  width:"device-width",initialScale:1,maximumScale:5,
};

const jsonLd = {
  "@context":"https://schema.org","@type":"WebApplication",
  "name":"MacroLens",
  "description":"Live IMF World Economic Outlook dashboard covering 196 countries and 145 economic indicators from 1980 to 2030.",
  "url":BASE_URL,"applicationCategory":"FinanceApplication","operatingSystem":"Any",
  "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
  "author":{"@type":"Organization","name":"MacroLens"},
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return(
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
        <link rel="icon" href="/favicon.ico" sizes="any"/>
        <link rel="manifest" href="/manifest.json"/>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>
      </head>
      <body>{children}</body>
    </html>
  );
}