/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SlApiAuthResponse {
  accessToken: string;
  authentication: {
    accessToken: string;
    payload: {
      user: { id: number; email: string; fullname: string };
      exp: number;
      iat: number;
      iss: string;
      sub: string;
    };
  };
  refreshToken: string;
  user: {
    id: number;
    email: string;
    fullname: string;
    name?: string;
    phone?: string;
    department?: string;
    company_name?: string;
    status?: string;
    avatar_url?: string | null;
    verified?: number;
    [key: string]: any;
  };
  [key: string]: unknown;
}
