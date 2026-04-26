import { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://globaleconmacrolens.vercel.app";
  return [
    {url:base,             lastModified:new Date(),changeFrequency:"daily",  priority:1},
    {url:`${base}/#gdp`,       lastModified:new Date(),changeFrequency:"weekly",priority:0.8},
    {url:`${base}/#inflation`, lastModified:new Date(),changeFrequency:"weekly",priority:0.8},
    {url:`${base}/#debt`,      lastModified:new Date(),changeFrequency:"weekly",priority:0.7},
    {url:`${base}/#country`,   lastModified:new Date(),changeFrequency:"weekly",priority:0.8},
  ];
}