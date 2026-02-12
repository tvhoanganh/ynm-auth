import { injectable } from "tsyringe";
import { SL_API_URL } from "@/constants/SL_API_DOMAIN";
import { SlApiAuthResponse } from "@/app/types/ISLApiAuthResponse";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Record<string, unknown>;
  refreshToken?: string;
}

/**
 * Authentication Service
 * Service interface cho login, logout, token refresh
 */
@injectable()
export class AuthService {
  public async login(credentials: LoginCredentials): Promise<SlApiAuthResponse> {
    const res = await fetch(`${SL_API_URL}/authentication`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        strategy: "local",
      }),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    return await res.json();
  }

  public async logout(token: string): Promise<void> {
    try {
      await fetch(`${SL_API_URL}/authentication`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  public async refresh(token: string): Promise<AuthResponse> {
    const res = await fetch(`${SL_API_URL}/authentication`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ strategy: "jwt" }),
    });

    if (!res.ok) {
      throw new Error("Token refresh failed");
    }

    return await res.json();
  }
}
