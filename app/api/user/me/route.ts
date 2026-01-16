/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserById } from "@/utils/stograte";
import { NextRequest, NextResponse } from "next/server";

/**
 * Extract Bearer token from Authorization header
 */
function extractBearerToken(authHeader: string): string {
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new Error("Invalid authorization header format");
  }
  return parts[1];
}

/**
 * Get token from cookies
 */
function getTokenFromCookies(req: NextRequest): string | null {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  // Parse cookies
  const cookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    },
    {} as Record<string, string>
  );

  return cookies.access_token || null;
}

/**
 * Decode JWT token and extract payload
 */
function decodeJWT(token: string): any {
  try {
    const [, encodedPayload] = token.split(".");
    if (!encodedPayload) {
      throw new Error("Invalid JWT format");
    }

    // Decode Base64URL to JSON
    const decoded = Buffer.from(
      encodedPayload.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf-8");
    
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Token decode error:", error);
    throw new Error("Invalid token format");
  }
}

/**
 * Extract user ID from JWT payload
 */
function getUserIdFromToken(payload: any): string {
  const userId = payload.sub || payload.id || payload.user_id;
  if (!userId) {
    throw new Error("User ID not found in token");
  }
  return userId;
}

/**
 * Add CORS headers to response
 */
function addCORSHeaders(response: NextResponse, origin: string): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "3600");
  
  return response;
}

/**
 * GET /api/user/me
 * Extract user ID from JWT token (from Authorization header or cookies) and return user info
 */
export async function GET(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "http://localhost:3001";
    
    // Try to get token from Authorization header first
    let token: string | null = null;
    const authHeader = req.headers.get("authorization");
    
    if (authHeader) {
      token = extractBearerToken(authHeader);
    } else {
      // Fallback to cookies
      token = getTokenFromCookies(req);
    }

    if (!token) {
      const response = NextResponse.json(
        { error: "Missing authentication token" },
        { status: 401 }
      );
      return addCORSHeaders(response, origin);
    }

    // Decode JWT token payload
    const payload = decodeJWT(token);

    // Extract user ID from token payload
    const userId = getUserIdFromToken(payload);

    // Get user data by ID
    const user = getUserById(userId);
    if (!user) {
      const response = NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
      return addCORSHeaders(response, origin);
    }

    // Return user data
    const response = NextResponse.json(user);
    return addCORSHeaders(response, origin);
  } catch (error) {
    console.error("Get user error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("authorization") || message.includes("token") ? 401 : 500;
    const origin = "http://localhost:3001";
    
    const response = NextResponse.json(
      { error: message },
      { status }
    );
    return addCORSHeaders(response, origin);
  }
}

