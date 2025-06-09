export const prerender = false;

import type { APIRoute } from "astro";

// Load items from JSON file
import items from "../../data/gallery.json";
export { items };

// Add id to each item
items.forEach((item, index) => {
  item.id = `photo${index + 1}`; // Start IDs from 1
});

// Compute unique categories
export const allCategories = Array.from(
  new Set(items.flatMap(item => item.category).filter(Boolean))
);

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
      filteredItems = items.filter(item => {
        // Handle both array and string category fields
        // All categories must be present in the item category
        return categories.every(cat => {return item.category.includes(cat);});
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
