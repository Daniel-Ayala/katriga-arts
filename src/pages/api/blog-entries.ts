export const prerender = false;
import { createClient } from "@libsql/client";
import type { APIRoute } from "astro";

let client: any = null;
let entries: any[] = [];
let entriesWithoutContent: any[] = [];

// Function to set the date property of each entry to an ISO string including only the day
const setEntriesDate = (entries: any[]) => {
  return entries.map((entry) => {
    return {
      ...entry,
      date: new Date(entry.date).toISOString().split("T")[0], // Convert to ISO string and keep only the date part
    };
  });
};

try {
  client = createClient({
    url: import.meta.env.ASTRO_DB_REMOTE_URL,
    authToken: import.meta.env.ASTRO_DB_APP_TOKEN,
  });
  console.log("Querying blog entries from the database...");
  entries = (
    await client.execute({
      sql: "SELECT * FROM BlogEntries ORDER BY date ASC",
    })
  ).rows;
  console.log("Retrieved blog entries from the database:", entries.length);
} catch (error) {
  console.error("Error connecting to the database:", error);
}

entries = setEntriesDate(entries);
entriesWithoutContent = entries.map(({ content, ...rest }) => rest);

export { entries, entriesWithoutContent };

export const getEntryBySlug = async (slug: string) => {
  return entries.find((entry) => entry.slug === slug);
};

export const refreshEntries = async () => {
  console.log("Refreshing blog entries from the database...");
  entries = (
    await client.execute({
      sql: "SELECT * FROM BlogEntries ORDER BY date ASC",
    })
  ).rows;
  entries = setEntriesDate(entries);
  console.log("Entries refreshed successfully.");
};

/*
export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Check if there is a slug parameter indicating a specific blog entry must be fetched
    if (body.slug) {
      const entry = entries.find((e) => e.slug === body.slug);
      if (entry) {
        return new Response(JSON.stringify(entry), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(
          JSON.stringify({ error: "Blog entry not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      // If no slug is provided, return all entries without the content
      return new Response(JSON.stringify(entriesWithoutContent), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error fetching blog entries:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};*/
