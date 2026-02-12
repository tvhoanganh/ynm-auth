import { JWT_SECRET } from "@/constants/auth";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { injectable } from "tsyringe";

type JwtPayload = JWTPayload & Record<string, unknown>;

@injectable()
export class JwtService {
  private encoder = new TextEncoder();

  async signJwt(payload: JwtPayload, secret: string = JWT_SECRET): Promise<string> {
    const key = this.encoder.encode(secret);

    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .sign(key);
  }

  async verifyJwt(
    token: string,
    secret: string = JWT_SECRET,
    issuer?: string
  ): Promise<{ valid: boolean; payload?: JwtPayload }> {
    try {
      const key = this.encoder.encode(secret);
      const { payload } = await jwtVerify(token, key, issuer ? { issuer } : {});
      return { valid: true, payload: payload as JwtPayload };
    } catch {
      return { valid: false };
    }
  }
}
