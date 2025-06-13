export const prerender = false;

import type { APIRoute } from "astro";
import { verifyToken } from "../../utils/jwt";
import { refreshItems } from "./gallery";
import fs from "node:fs/promises";
import path from "node:path";
import { array } from "astro:schema";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@libsql/client";

async function uploadBlogEntryToTurso(
  slug: string,
  title: string,
  image: string,
  thumbnail: string,
  imageAlt: string,
  description: string,
  content: string,
  date: number
) {
  const client = createClient({
    url: import.meta.env.ASTRO_DB_REMOTE_URL,
    authToken: import.meta.env.ASTRO_DB_APP_TOKEN,
  });

  // Insert the blog entry into the database
  const result = await client.execute({
    sql: "INSERT INTO BlogEntries (slug, title, image, thumbnail, imageAlt, description, content, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id",
    args: [slug, title, image, thumbnail, imageAlt, description, content, date],
  });

  return result.rows[0].id; // Return the inserted blog entry ID
}

async function uploadImageToTurso(
  src: string,
  thumbnailSrc: string,
  alt: string,
  title: string,
  description: string,
  categories: string[],
  priority: number
) {
  const client = createClient({
    url: import.meta.env.ASTRO_DB_REMOTE_URL,
    authToken: import.meta.env.ASTRO_DB_APP_TOKEN,
  });

  // Insert the picture into the database
  const result = await client.execute({
    sql: "INSERT INTO Pictures (src, thumbnail, alt, title, description, categories, priority) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id",
    args: [src, thumbnailSrc, alt, title, description, categories, priority],
  });

  return result.rows[0].id; // Return the inserted picture ID
}

async function uploadImageToCloudinary(
  file: File,
  title: string
): Promise<
  { url: string; thumbnailUrl: string; publicId: string } | { error: string }
> {
  // Upload the file to cloudinary
  cloudinary.config({
    cloud_name: import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.PUBLIC_CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET,
  });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const publicId = title
    .replaceAll(/\s+/g, "-")
    .toLowerCase()
    .replaceAll(/[\?&#\\%<>]/g, "");

  console.log("Uploading to Cloudinary with public_id:", publicId);

  // Upload original image
  try {
    // Wrap upload_stream in a Promise
    const originalUpload: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: publicId,
            folder: "gallery",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              console.error("Original upload error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    // Create thumbnail version with the same buffer
    const thumbnailUpload: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: `${publicId}_thumbnail`,
            folder: "gallery",
            resource_type: "image",
            transformation: [
              { width: 1200, crop: "limit" }, // Max width 1200px, keep aspect ratio
            ],
          },
          (error, result) => {
            if (error) {
              console.error("Thumbnail upload error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    return {
      url: originalUpload.secure_url,
      thumbnailUrl: thumbnailUpload.secure_url,
      publicId: originalUpload.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { error: error.message };
  }
}

export const POST: APIRoute = async ({ request }) => {
  let token = null;
  try {
    // Before anything, verify the token
    // Get the token from the cookie
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    } else {
      const cookies = Object.fromEntries(
        cookieHeader.split(";").map((cookie) => {
          const [key, value] = cookie.trim().split("=");
          return [key, decodeURIComponent(value)];
        })
      );
      token = cookies["token"]; // Assuming the token is stored in a cookie named 'token'
    }
    if (!token || !verifyToken(token)) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract form values
    const formData = await request.formData();
    console.log("Received form data:", [...formData.entries()]);
    let categories = formData.get("categories");
    if (typeof categories === "string") {
      categories = JSON.parse(categories);
    }
    const title = formData.get("title");
    const description = formData.get("description");
    const priority = formData.get("priority");
    const includesBlogPost = formData.get("includesBlogPost") === "true";
    const blogTitle = formData.get("blogTitle");
    const blogDescription = formData.get("shortDescription");
    const blogContent = formData.get("content");

    // Extract file from formData
    const file = formData.get("image");
    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ success: false, message: "No image file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("File received:", file.name, "of type", file.type);
    console.log("Title:", title);
    console.log("Categories:", categories);
    console.log("Includes blog post:", includesBlogPost);
    console.log("Blog title:", blogTitle);
    console.log("Blog description:", blogDescription);
    console.log("Blog content:", blogContent);

    // Upload the image
    const uploadResult = await uploadImageToCloudinary(file, title);

    if ("error" in uploadResult) {
      console.error("Error uploading image:", uploadResult.error);
      return new Response(
        JSON.stringify({ success: false, message: uploadResult.error }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Image uploaded successfully to:", uploadResult.url);
    console.log("Thumbnail created at:", uploadResult.thumbnailUrl);

    // Upload the image metadata to Turso
    const pictureId = await uploadImageToTurso(
      uploadResult.url,
      uploadResult.thumbnailUrl,
      title || file.name,
      title || "",
      description || "",
      categories || [],
      priority || 0
    );

    refreshItems(); // Refresh the gallery items cache

    console.log("Image uploaded successfully");

    if (includesBlogPost) {
      // If a blog post is included, save it to the file system
      const slug = blogTitle
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      // Date is stored as a number
      const date = Date.now();

      const uploadBlogResult = await uploadBlogEntryToTurso(
        slug,
        blogTitle || title,
        uploadResult.url,
        uploadResult.thumbnailUrl, // Add thumbnail URL
        title || file.name,
        blogDescription || description,
        blogContent,
        date
      );

      console.log("Blog entry uploaded successfully with slug:", slug);
    }

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
