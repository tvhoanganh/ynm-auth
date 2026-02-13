import { ACCESS_TOKEN_COOKIE_NAME, SL_API_TOKEN_COOKIE_NAME } from "@/constants/auth";
import { cookies } from "next/headers";
import { injectable } from "tsyringe";

@injectable()
export class RequestTokenService {
  async getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value ?? null;
  }

  async getSlApiToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(SL_API_TOKEN_COOKIE_NAME)?.value ?? null;
  }

  async getSlApiTokenOrThrow(): Promise<string> {
    const token = await this.getSlApiToken();

    if (!token) {
      throw new Error("Missing SL API token in request cookies");
    }

    return token;
  }
}
