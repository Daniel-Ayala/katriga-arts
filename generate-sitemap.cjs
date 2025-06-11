// generate-sitemap.cjs
require('dotenv').config();
const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

const baseUrl = "https://katriga.art";
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

async function generateSitemap() {
  console.log("🚀 Generando sitemap...");

  // Initialize Turso client
  let client = null;
  let blogEntries = [];

  try {
    client = createClient({
      url: process.env.ASTRO_DB_REMOTE_URL,
      authToken: process.env.ASTRO_DB_APP_TOKEN,
    });
    
    console.log("📡 Obteniendo entradas del blog desde la base de datos...");
    const result = await client.execute({
      sql: "SELECT slug, date FROM BlogEntries ORDER BY date DESC",
    });
    
    blogEntries = result.rows;
    console.log(`✅ ${blogEntries.length} entradas de blog encontradas`);
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error);
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
    },
    /*{
      url: "/addPic", // Only if you want this indexed (usually you don't)
      priority: "0.1",
      changefreq: "never",
      lastmod: today
    }*/
  ];

  // Generate URLs for blog entries
  const blogUrls = blogEntries.map(entry => {
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
</urlset>
`;

  // Write sitemap to public directory
  const outputPath = path.join(__dirname, "public", "sitemap.xml");
  
  // Ensure public directory exists
  const publicDir = path.dirname(outputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, sitemap);
  
  console.log(`✅ Sitemap generado exitosamente con ${allUrls.length} URLs`);
  console.log(`📝 Páginas estáticas: ${staticPages.length}`);
  console.log(`📝 Entradas de blog: ${blogEntries.length}`);
  console.log(`📅 Fecha de generación: ${today}`);
  console.log(`📍 Ubicación: ${outputPath}`);
}

// Run the generator
generateSitemap().catch(error => {
  console.error("❌ Error generando sitemap:", error);
  process.exit(1);
});