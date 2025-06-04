export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Extract parameters from the body
    let name = body.name || "Anonymous";
    let email = body.email;
    let message = body.message;
    
    // email and message are required
    if (!email || !message) {
      return new Response(
        JSON.stringify({ error: "Email and message are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    } 

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Received contact request:", { name, email, message });

    return new Response(
      JSON.stringify({ message: "Your message has been received successfully. We will get back to you soon." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    ); 
    
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request. Please, contact directly with the provided email" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
