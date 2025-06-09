export const prerender = false;

import type { APIRoute } from "astro";
import fs from 'node:fs/promises';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    console.log("Received form data with entries:", [...formData.entries()].map(e => e[0]));
    
    // Extract form values
    let categories = formData.get("categories");
    if (typeof categories === "string") {
      categories = JSON.parse(categories);
    }
    const name = formData.get("name");
    const includesBlogPost = formData.get("includesBlogPost") === "true";
    let blogTitle = formData.get("title");
    let blogDescription = formData.get("shortDescription");
    let blogContent = formData.get("content");
    
    // Extract file from formData
    const file = formData.get("image");
    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ success: false, message: "No image file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // genrate filename from the name
    const filename = `${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}${path.extname(file.name)}`;

    // Store the uploaded file in /img/gallery
    const publicDir = path.resolve(process.cwd(), "public");
    const imgGalleryDir = path.join(publicDir, "img", "gallery");

    // Open json for storing the uploaded picture
    const galleryFilePath = new URL("../../data/gallery.json", import.meta.url);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Picture uploaded successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error while uploading picture:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
