import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const secret = process.env.AUTH_SECRET ?? 'akola-local-development-secret';
const encode = (value: string) => Buffer.from(value).toString('base64url');

export function hashPassword(password: string) { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`; }
export function verifyPassword(password: string, stored: string) { const [salt, hash] = stored.split(':'); if (!salt || !hash) return false; const candidate = scryptSync(password, salt, 64); return timingSafeEqual(candidate, Buffer.from(hash, 'hex')); }
export function signToken(userId: string, expiresInSeconds = 60 * 60 * 24 * 7) { const payload = encode(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + expiresInSeconds })); const signature = createHmac('sha256', secret).update(payload).digest('base64url'); return `${payload}.${signature}`; }
export function verifyToken(token?: string | null) { if (!token) return null; const [payload, signature] = token.split('.'); if (!payload || !signature) return null; const expected = createHmac('sha256', secret).update(payload).digest(); const actual = Buffer.from(signature, 'base64url'); if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null; const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { sub: string; exp: number }; return parsed.exp > Date.now() / 1000 ? parsed.sub : null; }
export function requestUserId(request: Request) { return verifyToken(request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')); }
