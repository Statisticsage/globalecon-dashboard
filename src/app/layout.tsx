import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://globaleconmacrolens.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MacroLens — Live Global Macroeconomic Intelligence Dashboard",
    template: "%s | MacroLens",
  },
  description:
    "Live IMF economic data for 196 countries — GDP growth, inflation, government debt and fiscal balance. Real-time charts and projections to 2030.",
  keywords: [
    "macroeconomics dashboard","IMF economic data","world economic outlook 2024",
    "GDP growth by country","global inflation tracker","government debt GDP ratio",
    "country economic profile","WEO dashboard","macroeconomic indicators",
    "fiscal balance","economic forecast 2030","MacroLens","196 countries economic data",
  ],
  authors:   [{ name: "MacroLens" }],
  creator:   "MacroLens",
  publisher: "MacroLens",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "MacroLens",
    title: "MacroLens — Live Global Macroeconomic Intelligence Dashboard",
    description:
      "Live IMF economic data for 196 countries — GDP growth, inflation, government debt and fiscal balance. Real-time charts and projections to 2030.",
    images: [
      {
        url: `${BASE_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "MacroLens — Global Macroeconomic Intelligence Dashboard showing GDP growth, inflation and debt data for 196 countries",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MacroLens — Live Global Macroeconomic Intelligence",
    description:
      "Live IMF economic data for 196 countries — GDP growth, inflation, government debt. Real-time charts, projections to 2030.",
    images: [`${BASE_URL}/og-image.svg`],
  },
  alternates: { canonical: BASE_URL },
  category: "finance",
};

export const viewport: Viewport = {
  themeColor: "#070b14",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "MacroLens",
  "url": BASE_URL,
  "description": "Live IMF World Economic Outlook dashboard covering 196 countries and 145 economic indicators from 1980 to 2030.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": { "@type": "Organization", "name": "MacroLens", "url": BASE_URL },
  "inLanguage": "en",
  "isAccessibleForFree": true,
  "featureList": [
    "196 country economic profiles",
    "Real-time GDP growth tracking",
    "Global inflation monitoring",
    "Government debt analysis",
    "IMF projections to 2030",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="xwWleL67HnkmX5Dhn-O43G9m-AYlBUmygivSQD_MhEo" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}