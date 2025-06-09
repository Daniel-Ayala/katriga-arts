// src/pages/api/verify-token.ts
import { verifyToken } from "../../utils/jwt";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const { token } = await request.json();
  const isValid = token ? verifyToken(token) : null;
  
  return new Response(JSON.stringify({ isValid: !!isValid }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};