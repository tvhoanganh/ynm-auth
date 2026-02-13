import "reflect-metadata";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  JWT_SECRET,
  SL_API_TOKEN_COOKIE_NAME,
} from "@/constants/auth";
import { cookies } from "next/headers";
import { SL_API_URL } from "@/constants/SL_API_DOMAIN";
import { container } from "@/services/di-container";
import { JwtService } from "@/services";
import { cache } from "react";
import { UserProfile } from "@/types/UserProfile";

export interface AuthContext {
  userId: string;
  email: string;
  name?: string;
  role?: string;
  isAuthenticated: boolean;
}

const UNAUTH_CONTEXT: AuthContext = {
  userId: "",
  email: "",
  isAuthenticated: false,
};

/**
 * Verify JWT token from cookies and return auth context
 * This is for Server Components only
 */
export const getAuthContext = cache(async (): Promise<AuthContext> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!token || !JWT_SECRET) {
    return UNAUTH_CONTEXT;
  }

  const jwtService = container.resolve(JwtService);
  const { valid, payload } = await jwtService.verifyJwt(token);
  if (!valid || !payload?.sub) {
    return UNAUTH_CONTEXT;
  }

  return {
    userId: String(payload.sub),
    email: String(payload.email ?? ""),
    name: String(payload.name ?? ""),
    role: String(payload.role ?? ""),
    isAuthenticated: true,
  };
});

/**
 * Simple auth check for Server Components
 * Returns true if current request has a valid auth session
 */
export async function isUserLoggedIn(): Promise<boolean> {
  const auth = await getAuthContext();
  return auth.isAuthenticated;
}

/**
 * Get SL_API token from cookies for backend API calls
 */
export const getSLApiToken = cache(async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(SL_API_TOKEN_COOKIE_NAME)?.value || null;
});

/**
 * Fetch user profile from SL_API using the token
 */
export const fetchUserProfile = cache(async (userId: string): Promise<UserProfile | null> => {
  const slApiToken = await getSLApiToken();
  if (!slApiToken) return null;

  try {
    const res = await fetch(`${SL_API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${slApiToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as UserProfile;
  } catch {
    return null;
  }
});
