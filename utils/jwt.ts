/**
 * @deprecated Use JwtService from '@/lib/services' instead
 * This file is kept for backward compatibility only
 * 
 * Migration example:
 * // Old way (deprecated):
 * import { signJwt, verifyJwt } from '@/utils/jwt';
 * const token = await signJwt(payload, secret);
 * 
 * // New way (recommended):
 * import { container } from '@/lib/di-container';
 * import { JwtService } from '@/lib/services';
 * const jwtService = container.resolve(JwtService);
 * const token = await jwtService.signJwt(payload, secret);
 */

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

type JwtPayload = JWTPayload & Record<string, unknown>;

const encoder = new TextEncoder();

export async function signJwt(
  payload: JwtPayload,
  secret: string
): Promise<string> {
  const key = encoder.encode(secret);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .sign(key);
}

export async function verifyJwt(
  token: string,
  secret: string,
  issuer?: string
): Promise<{ valid: boolean; payload?: JwtPayload }> {
  try {
    const key = encoder.encode(secret);
    const { payload } = await jwtVerify(token, key, issuer ? { issuer } : {});
    return { valid: true, payload: payload as JwtPayload };
  } catch {
    return { valid: false };
  }
}
