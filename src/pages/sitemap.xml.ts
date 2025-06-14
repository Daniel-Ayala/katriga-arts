export const prerender = false;

import type { APIRoute } from "astro";
import { createClient } from "@libsql/client";

const baseUrl = "https://katriga.art";

export const GET: APIRoute = async ({ request }) => {
  console.log("🚀 Generating dynamic sitemap...");
  
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Initialize Turso client
  let blogEntries = [];

  try {
    const client = createClient({
      url: import.meta.env.ASTRO_DB_REMOTE_URL,
      authToken: import.meta.env.ASTRO_DB_APP_TOKEN,
    });
    
    console.log("📡 Fetching blog entries from database...");
    const result = await client.execute({
      sql: "SELECT slug, date FROM BlogEntries ORDER BY date DESC",
    });
    
    blogEntries = result.rows;
    console.log(`✅ ${blogEntries.length} blog entries found`);
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
  }

  // Static pages with their priorities and change frequencies
  const staticPages = [
    {
      url: "/",
      priority: "1.0",
      changefreq: "weekly",
      lastmod: today
    },
    {
      url: "/blogs",
      priority: "0.8",
      changefreq: "weekly",
      lastmod: today
    }
  ];

  // Generate URLs for blog entries
  const blogUrls = blogEntries.map((entry: any) => {
    const entryDate = new Date(entry.date).toISOString().split("T")[0];
    return {
      url: `/blog/${entry.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: entryDate
    };
  });

  // Combine all URLs
  const allUrls = [...staticPages, ...blogUrls];

  // Generate XML sitemap
  const urlsXml = allUrls.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  console.log(`✅ Sitemap generated successfully with ${allUrls.length} URLs`);
  console.log(`📝 Static pages: ${staticPages.length}`);
  console.log(`📝 Blog entries: ${blogEntries.length}`);
  console.log(`📅 Generation date: ${today}`);

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
};