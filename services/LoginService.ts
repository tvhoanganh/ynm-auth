import { injectable, inject } from "tsyringe";
import { JwtService } from "./JwtService";
import {
  JWT_EXPIRES_IN_SECONDS,
  JWT_ISSUER,
  JWT_SECRET,
} from "@/constants/auth";
import { SlApiAuthResponse } from "@/types/ISLApiAuthResponse";

export type UserData = SlApiAuthResponse["user"];

export interface LoginResponse {
  user: UserData;
  internalToken: string;
  slApiToken: string;
}

@injectable()
export class LoginService {
  constructor(@inject(JwtService) private jwtService: JwtService) {}

  /**
   * Create internal JWT token for the user
   */
  private async createInternalToken(user: UserData): Promise<string> {
    if (!JWT_SECRET) {
      throw new Error("JWT secret chua duoc cau hinh");
    }

    const now = Math.floor(Date.now() / 1000);
    return this.jwtService.signJwt({
      sub: String(user.id),
      email: user.email,
      name: user.name,
      iss: JWT_ISSUER,
      iat: now,
      exp: now + JWT_EXPIRES_IN_SECONDS,
    });
  }

  /**
   * Process complete login flow: extract user, create JWT, return response data
   */
  async processLogin(payload: SlApiAuthResponse): Promise<LoginResponse> {
    // Create internal JWT token
    const internalToken = await this.createInternalToken(
      payload.user as UserData,
    );

    return {
      user: payload.user,
      internalToken,
      slApiToken: payload.accessToken,
    };
  }
}
