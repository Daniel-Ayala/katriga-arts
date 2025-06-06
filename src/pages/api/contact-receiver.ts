// filepath: d:\portfolio-kat\src\pages\api\contact-receiver.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 5; // Maximum requests per IP in the window
const ipRequestMap = new Map<string, { count: number; timestamp: number }>();

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Rate limiting
    const ip = clientAddress;
    const now = Date.now();
    const ipData = ipRequestMap.get(ip);

    console.log("IP Address:", ip);
    console.log(ipData);

    // Check if this IP has made requests before
    if (ipData) {
      // Reset count if outside the window
      if (now - ipData.timestamp > RATE_LIMIT_WINDOW) {
        ipRequestMap.set(ip, { count: 1, timestamp: now });
      } else if (ipData.count >= MAX_REQUESTS_PER_IP) {
        // Too many requests
        return new Response(
          JSON.stringify({
            error: "Too many requests. Please try again later.",
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      } else {
        // Increment count
        ipRequestMap.set(ip, {
          count: ipData.count + 1,
          timestamp: ipData.timestamp,
        });
      }
    } else {
      // First request from this IP
      ipRequestMap.set(ip, { count: 1, timestamp: now });
    }

    // Parse the JSON body
    const body = await request.json();

    if (body.writeMe) {
      // If this field is filled, it's likely a bot
      console.log("Bot detected, silently rejecting");
      return new Response(
        JSON.stringify({ message: "Your message has been received" }), // Fake success
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract parameters
    let name = body.name || "Anonymous";
    let email = body.email;
    let message = body.message;

    // Validation (keep your existing validation)
    if (!email || !message) {
      return new Response(
        JSON.stringify({ error: "Email and message are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Initialize Resend with your API key
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    // Send email
    const { data, error } = await resend.emails.send({
      from: "Contact Form <contact-form@katriga.art>",
      to: ["dominik.rnjak@protonmail.com"],
      subject: `New contact from ${name}`,
      replyTo: email,
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #2a2a2a; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Form Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #7c3aed; margin-bottom: 20px;">
        ${message.replace(/\n/g, "<br>")}
      </div>
      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${email}" style="background-color: #7c3aed; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reply to ${name}</a>
      </div>
    </div>`,
    });

    if (error) {
      console.error("Error sending email:", error.message);
      return new Response(
        JSON.stringify({
          error:
            "Failed to send your message. Please contact directly using the provided email address.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        message:
          "Your message has been received successfully. We will get back to you soon.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error:
          "An error occurred while processing your request. Please contact directly using the provided email address.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
