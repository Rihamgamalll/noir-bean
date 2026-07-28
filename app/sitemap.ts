import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { const base=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'; return ['','/menu','/account','/favorites','/orders'].map(path=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:path===''?'weekly':'daily',priority:path===''?1:.8})); }
