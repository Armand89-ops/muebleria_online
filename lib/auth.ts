import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'muebleria_online_secret_key_change_in_production';
const COOKIE_NAME = 'auth_token';
const TOKEN_EXPIRY = '7d';

// ============================================================
// Password hashing
// ============================================================

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// ============================================================
// JWT tokens
// ============================================================

export interface JWTPayload {
    userId: number;
    email: string;
}

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

// ============================================================
// Cookie management
// ============================================================

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

export async function removeAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function getAuthCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}

// ============================================================
// Get current user from request
// ============================================================

export async function getCurrentUser(): Promise<JWTPayload | null> {
    const token = await getAuthCookie();
    if (!token) return null;
    return verifyToken(token);
}
