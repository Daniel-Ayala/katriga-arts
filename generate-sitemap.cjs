// generate-sitemap.js
const fs = require("fs");
const path = require("path");

const baseUrl = "https://katriga.art";
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

const outputPath = path.join(__dirname, "public", "sitemap.xml");

fs.writeFileSync(outputPath, sitemap);
console.log("✅ Sitemap generado con fecha:", today);
