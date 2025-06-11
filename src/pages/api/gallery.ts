export const prerender = false;
import { createClient } from "@libsql/client";
import type { APIRoute } from "astro";

import fallbackItems from "../../data/gallery.json";
let usedFallback = false;
let items:any = fallbackItems;

let client: any = null;

try {
  client = createClient({
    url: import.meta.env.ASTRO_DB_REMOTE_URL,
    authToken: import.meta.env.ASTRO_DB_APP_TOKEN,
  });
  console.log("Querying items from the database...");
  items = (
    await client.execute({
      sql: "SELECT src, alt, title, description, categories, priority FROM Pictures ORDER BY priority ASC",
    })
  ).rows;
  console.log("Retrieved items from the database:", items.length);
} catch (error) {
  console.error("Error connecting to the database:", error);
  console.error("Using fallback data from gallery.json");
  usedFallback = true;

}

export { items };

// Add id to each item
items.forEach((item, index) => {
  item.id = `photo${index + 1}`; // Start IDs from 1
  if (!usedFallback) {
    item.category = item.categories.split(",").map((cat) => cat.trim()); // Ensure category is an array
  }
});

export const getAllCategories = () => {
  return Array.from(new Set(items.flatMap((item) => item.category).filter(Boolean)));
};

export const refreshItems = async () => {
  console.log("Refreshing items from the database...");
  items = (
    await client.execute({
      sql: "SELECT src, alt, title, description, categories, priority FROM Pictures ORDER BY priority ASC",
    })
  ).rows;
  items.forEach((item, index) => {
    item.id = `photo${index + 1}`; // Start IDs from 1
    item.category = item.categories.split(",").map((cat) => cat.trim()); // Ensure category is an array
  });
  console.log("Items refreshed successfully.");
};

export const GET: APIRoute = async ({ request }) => {
  return new Response(
    JSON.stringify({
      items: items,
      total: items.length,
      page: 1,
      pageSize: items.length, // Return all items by default
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Extract parameters from the body
    let pageSize = body.pageSize || 10;
    let page = body.page || 1;
    let categories = body.categories || [];

    // Filter items by category if specified
    let filteredItems = items;
    if (categories.length > 0) {
      filteredItems = items.filter((item) => {
        // Handle both array and string category fields
        // All categories must be present in the item category
        return categories.every((cat) => {
          return item.category.includes(cat);
        });
      });
    }

    // Same pagination logic as GET
    let startIndex = (page - 1) * pageSize;
    let endIndex = startIndex + pageSize;
    let paginatedItems = filteredItems.slice(startIndex, endIndex);

    return new Response(
      JSON.stringify({
        items: paginatedItems,
        total: filteredItems.length,
        page: page,
        pageSize: pageSize,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing POST request:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error.message,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
