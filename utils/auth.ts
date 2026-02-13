import "reflect-metadata";
import { ACCESS_TOKEN_COOKIE_NAME, JWT_ISSUER, JWT_SECRET, SL_API_TOKEN_COOKIE_NAME } from "@/constants/auth";
import { cookies } from "next/headers";
import { SL_API_URL } from "@/constants/SL_API_DOMAIN";
import { container } from "@/services/di-container";
import { JwtService } from "@/services";

export interface AuthContext {
  userId: string;
  email: string;
  name?: string;
  role?: string;
  isAuthenticated: boolean;
}

/**
 * Verify JWT token from cookies and return auth context
 * This is for Server Components only
 */
export async function getAuthContext(): Promise<AuthContext> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!token || !JWT_SECRET) {
    return { userId: "", email: "", isAuthenticated: false };
  }

  const jwtService = container.resolve(JwtService);
  const { valid, payload } = await jwtService.verifyJwt(token);
  if (!valid || !payload?.sub) {
    return { userId: "", email: "", isAuthenticated: false };
  }

  return {
    userId: payload.sub as string,
    email: (payload.email as string) || "",
    name: (payload.name as string) || "",
    role: (payload.role as string) || "",
    isAuthenticated: true,
  };
}

/**
 * Get SL_API token from cookies for backend API calls
 */
export async function getSLApiToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SL_API_TOKEN_COOKIE_NAME)?.value || null;
}

/**
 * Fetch user profile from SL_API using the token
 */
export async function fetchUserProfile(userId: string) {
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
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Verify auth and fetch user profile
 * Returns null if not authenticated
 */
export async function verifyAuthAndFetchUser() {
  const auth = await getAuthContext();
  if (!auth.isAuthenticated) return null;

  const profile = await fetchUserProfile(auth.userId);
  return { ...auth, profile };
}

/**
 * Check if user has required role
 */
export function hasRole(auth: AuthContext, requiredRoles: string[]): boolean {
  return auth.isAuthenticated && auth.role && requiredRoles.includes(auth.role);
}
