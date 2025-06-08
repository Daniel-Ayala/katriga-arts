import jwt from 'jsonwebtoken';

// Your secret key (store this in an environment variable)
const JWT_SECRET: string = import.meta.env.JWT_SECRET || 'your-secret-key';

// Define the token payload interface
interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Create a JWT token
 * @param userId - The user identifier to include in the token
 * @returns The signed JWT token
 */
export function createToken(userId: string): string {
  // Valid date is now plus 24 hours
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Verify a JWT token
 * @param token - The token to verify
 * @returns The decoded token payload or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null; // Token invalid or expired
  }
}