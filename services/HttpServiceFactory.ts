import { inject, injectable } from "tsyringe";
import { HttpService, HttpServiceConfig } from "./HttpService";

export const HTTP_CLIENT_CONFIGS = "HTTP_CLIENT_CONFIGS";

export type HttpClientConfigMap = Record<string, HttpServiceConfig>;

@injectable()
export class HttpServiceFactory {
  private readonly clients = new Map<string, HttpService>();

  constructor(
    @inject(HTTP_CLIENT_CONFIGS)
    private readonly configs: HttpClientConfigMap,
  ) {}

  getClient(clientName: string, overrides?: Partial<HttpServiceConfig>): HttpService {
    const baseConfig = this.configs[clientName];

    if (!baseConfig) {
      throw new Error(`Http client config not found for: ${clientName}`);
    }

    if (!overrides) {
      const existing = this.clients.get(clientName);
      if (existing) {
        return existing;
      }
    }

    const mergedConfig: HttpServiceConfig = {
      ...baseConfig,
      ...overrides,
      headers: {
        ...(baseConfig.headers || {}),
        ...(overrides?.headers || {}),
      },
    };

    const client = new HttpService(mergedConfig);

    if (!overrides) {
      this.clients.set(clientName, client);
    }

    return client;
  }

  getClientWithBearer(
    clientName: string,
    bearerToken: string,
    overrides?: Partial<HttpServiceConfig>,
  ): HttpService {
    const authOverrides: Partial<HttpServiceConfig> = {
      ...overrides,
      headers: {
        ...(overrides?.headers || {}),
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    return this.getClient(clientName, authOverrides);
  }
}
