import { inject, injectable } from "tsyringe";
import { RedisService } from "./RedisService";
import { JwtService } from "./JwtService";
import { JWT_SECRET, JWT_SSO_ISSUER } from "@/constants/auth";

const DEFAULT_TTL_SECONDS = 300;
const SSO_SESSION_EXPIRES_IN_SECONDS = 12 * 60 * 60;

export interface AuthorizationData {
  email: string;
  codeChallenge: string;
}

export interface SsoSessionPayload {
  userId: string;
  email: string;
}

@injectable()
export class SsoService {
  constructor(
    @inject(RedisService) private redisService: RedisService,
    @inject(JwtService) private jwtService: JwtService,
  ) {}

  private codeKey(code: string): string {
    return `sso:code:${code}`;
  }

  async storeAuthorizationData(
    code: string,
    data: AuthorizationData,
    ttlSeconds = DEFAULT_TTL_SECONDS,
  ): Promise<void> {
    await this.redisService.set(
      this.codeKey(code),
      JSON.stringify(data),
      ttlSeconds,
    );
  }

  async getAuthorizationData(code: string): Promise<AuthorizationData | null> {
    const raw = await this.redisService.get(this.codeKey(code));
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthorizationData;
    } catch {
      return null;
    }
  }

  async isAuthorizationCodeValid(
    code: string,
    codeChallenge: string,
  ): Promise<boolean> {
    const stored = await this.getAuthorizationData(code);
    return Boolean(stored && stored.codeChallenge === codeChallenge);
  }

  async removeAuthorizationData(code: string): Promise<void> {
    await this.redisService.del(this.codeKey(code));
  }

  async createSsoSessionToken(payload: SsoSessionPayload): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    return this.jwtService.signJwt({
      sub: payload.userId,
      email: payload.email,
      iss: JWT_SSO_ISSUER,
      iat: now,
      exp: now + SSO_SESSION_EXPIRES_IN_SECONDS,
    });
  }

  async verifySsoSessionToken(
    token: string,
  ): Promise<{ valid: boolean; payload?: SsoSessionPayload }> {
    const { valid, payload } = await this.jwtService.verifyJwt(
      token,
      JWT_SECRET,
      JWT_SSO_ISSUER,
    );

    if (!valid || !payload) {
      return { valid: false };
    }

    return {
      valid: true,
      payload: {
        userId: payload.sub as string,
        email: payload.email as string,
      },
    };
  }

  getSsoSessionCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
  }
}
