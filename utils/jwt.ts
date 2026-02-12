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
