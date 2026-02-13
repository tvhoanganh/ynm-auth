import { injectable, inject } from "tsyringe";
import { HttpServiceFactory } from "./HttpServiceFactory";
import { RequestTokenService } from "./RequestTokenService";

export interface UserProfile {
  id: number | string;
  email: string;
  fullname: string;
  phone?: string;
  department?: string;
  company_name?: string;
  status?: string;
  avatar_url?: string;
  verified?: number;
}

/**
 * User Service
 * Service interface để quản lý user profile và thông tin
 */
@injectable()
export class UserService {
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

  public async getProfile(token?: string): Promise<UserProfile> {
    const resolvedToken = await this.resolveSlApiToken(token);
    const client = this.httpServiceFactory.getClientWithBearer(
      "slApi",
      resolvedToken,
    );

    return client.get<UserProfile>("/users/self");
  }

  public async updateProfile(
    token: string | undefined,
    updates: Partial<UserProfile>,
  ): Promise<UserProfile> {
    const resolvedToken = await this.resolveSlApiToken(token);
    const client = this.httpServiceFactory.getClientWithBearer(
      "slApi",
      resolvedToken,
    );

    return client.patch<UserProfile, Partial<UserProfile>>(
      "/users/self",
      updates,
    );
  }

  public async searchUsers(
    token: string | undefined,
    query: string,
  ): Promise<UserProfile[]> {
    const resolvedToken = await this.resolveSlApiToken(token);
    const client = this.httpServiceFactory.getClientWithBearer(
      "slApi",
      resolvedToken,
    );

    return client.get<UserProfile[]>("/users", {
      params: {
        search: query,
      },
    });
  }
}
