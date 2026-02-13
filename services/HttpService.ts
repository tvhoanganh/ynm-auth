import axios, { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from "axios";

export interface HttpServiceConfig extends CreateAxiosDefaults {
  baseURL: string;
}

export class HttpService {
  private readonly client: AxiosInstance;

  constructor(config: HttpServiceConfig) {
    this.client = axios.create(config);
  }

  async request<TResponse>(config: AxiosRequestConfig): Promise<TResponse> {
    const response = await this.client.request<TResponse>(config);
    return response.data;
  }

  async get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.request<TResponse>({ ...config, method: "GET", url });
  }

  async post<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    return this.request<TResponse>({ ...config, method: "POST", url, data });
  }

  async put<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    return this.request<TResponse>({ ...config, method: "PUT", url, data });
  }

  async patch<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    return this.request<TResponse>({ ...config, method: "PATCH", url, data });
  }

  async delete<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.request<TResponse>({ ...config, method: "DELETE", url });
  }
}
