import { comparePassword } from "../../utils/auth";
import { createToken } from "../../utils/jwt";

export const prerender = false;

import type { APIRoute } from "astro";

const ADMIN_PASSWORD_HASH = import.meta.env.ADMIN_PASSWORD_HASH;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const data = await request.json();
    const { password } = data;

    const isValid = await comparePassword(password, ADMIN_PASSWORD_HASH);

    if (isValid) {
      const token = createToken("admin");
      return new Response(
        JSON.stringify({
          success: true,
          token,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid password",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
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
