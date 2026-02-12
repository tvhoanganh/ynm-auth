import { inject, injectable } from "tsyringe";
import { RedisService } from "./RedisService";

const DEFAULT_TTL_SECONDS = 300;

export interface AuthorizationData {
  email: string;
  codeChallenge: string;
}

@injectable()
export class SsoService {
  constructor(@inject(RedisService) private redisService: RedisService) {}

  private codeKey(code: string): string {
    return `sso:code:${code}`;
  }

  async storeAuthorizationData(
    code: string,
    data: AuthorizationData,
    ttlSeconds = DEFAULT_TTL_SECONDS
  ): Promise<void> {
    await this.redisService.set(
      this.codeKey(code),
      JSON.stringify(data),
      ttlSeconds
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
    codeChallenge: string
  ): Promise<boolean> {
    const stored = await this.getAuthorizationData(code);
    return Boolean(stored && stored.codeChallenge === codeChallenge);
  }

  async removeAuthorizationData(code: string): Promise<void> {
    await this.redisService.del(this.codeKey(code));
  }
}
