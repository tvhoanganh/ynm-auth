import { injectable } from "tsyringe";
import { SlApiAuthResponse } from "@/types/ISLApiAuthResponse";
import { inject } from "tsyringe";
import { HttpServiceFactory } from "./HttpServiceFactory";
import { RequestTokenService } from "./RequestTokenService";

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
  constructor(
    @inject(HttpServiceFactory)
    private readonly httpServiceFactory: HttpServiceFactory,
    @inject(RequestTokenService)
    private readonly requestTokenService: RequestTokenService,
  ) {}

  private async resolveSlApiToken(token?: string): Promise<string> {
    if (token) {
      return token;
    }

    return this.requestTokenService.getSlApiTokenOrThrow();
  }

  public async login(credentials: LoginCredentials): Promise<SlApiAuthResponse> {
    const client = this.httpServiceFactory.getClient("slApi");

    return client.post<SlApiAuthResponse, Record<string, unknown>>(
      "/authentication",
      {
        email: credentials.email,
        password: credentials.password,
        strategy: "local",
      },
    );
  }

  public async logout(token?: string): Promise<void> {
    const resolvedToken = await this.resolveSlApiToken(token);
    const client = this.httpServiceFactory.getClientWithBearer("slApi", resolvedToken);

    try {
      await client.delete<unknown>("/authentication");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  public async refresh(token?: string): Promise<AuthResponse> {
    const resolvedToken = await this.resolveSlApiToken(token);
    const client = this.httpServiceFactory.getClientWithBearer("slApi", resolvedToken);

    return client.post<AuthResponse, { strategy: string }>("/authentication", {
      strategy: "jwt",
    });
  }
}
