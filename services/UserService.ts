import { injectable, inject } from "tsyringe";
import { SL_API_URL } from "@/constants/SL_API_DOMAIN";
import { AuthService } from "./AuthService";

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
  constructor(@inject(AuthService) private authService: AuthService) {}

  public async getProfile(token: string): Promise<UserProfile> {
    const res = await fetch(`${SL_API_URL}/users/self`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return await res.json();
  }

  public async updateProfile(
    token: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    const res = await fetch(`${SL_API_URL}/users/self`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      throw new Error("Failed to update user profile");
    }

    return await res.json();
  }

  public async searchUsers(token: string, query: string): Promise<UserProfile[]> {
    const res = await fetch(`${SL_API_URL}/users?search=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to search users");
    }

    return await res.json();
  }
}
