// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import dotenv from "dotenv";
import { createClient } from "@libsql/client";

const site = "https://katriga.art/";

dotenv.config();
const client = createClient({
  url: process.env.ASTRO_DB_REMOTE_URL,
  authToken: process.env.ASTRO_DB_APP_TOKEN,
});

console.log("📡 Obteniendo entradas del blog desde la base de datos...");
const result = await client.execute({
  sql: "SELECT slug, date FROM BlogEntries ORDER BY date DESC",
});

const blogEntries = result.rows;
const customPages = blogEntries.map(entry => site+`blog/${entry.slug}`);
console.log("CUSTOM PAGES:", customPages.length);
console.log(customPages);

// https://astro.build/config
export default defineConfig({
  site: site,
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    /*sitemap({
      filter: (page) => !page.endsWith("addPic") && !page.endsWith("login"),
      customPages: customPages,
    }),*/
  ],
  adapter: vercel(),
  security: {
    checkOrigin: false,
  },
  trailingSlash: "never",
  build: {
    format: "directory",
  },
});
