import { comparePassword } from '../../utils/auth';
import { createToken } from '../../utils/jwt';

export const prerender = false;

import type { APIRoute } from "astro";

// Store this hash in a secure place or database
const ADMIN_PASSWORD_HASH = '$2b$10$1HgsJUG0kPPXI75mvzgdEOyp7yj4nKHy41fDgV4.4VpAIAVA1SEXG'; // pre-generated with hashPassword()

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const data = await request.json();
  const { password } = data;
  
  const isValid = await comparePassword(password, ADMIN_PASSWORD_HASH);
  
  if (isValid) {
    const token = createToken('admin');
    return new Response(JSON.stringify({
      success: true,
      token
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({
    success: false,
    message: 'Invalid password'
  }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}