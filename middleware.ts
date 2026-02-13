import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  PROTECTED_PATHS,
  LOGIN_PATH,
} from "@/constants/auth";

const CORS_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
const DEFAULT_CORS_HEADERS = "Content-Type, Authorization";

function getAllowedOrigins(): string[] {
  return (process.env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function resolveAllowedOrigin(req: NextRequest): string | null {
  const origin = req.headers.get("origin");
  if (!origin) return null;

  const allowedOrigins = getAllowedOrigins();
  const isDev = process.env.NODE_ENV !== "production";

  if (allowedOrigins.includes(origin)) {
    return origin;
  }

  if (isDev && allowedOrigins.length === 0) {
    return origin;
  }

  return null;
}

function applyCorsHeaders(req: NextRequest, res: NextResponse) {
  const allowedOrigin = resolveAllowedOrigin(req);
  if (!allowedOrigin) return;

  const requestHeaders = req.headers.get("access-control-request-headers");

  res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", CORS_METHODS);
  res.headers.set(
    "Access-Control-Allow-Headers",
    requestHeaders || DEFAULT_CORS_HEADERS,
  );
  res.headers.set("Vary", "Origin");
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api/")) {
    if (req.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 204 });
      applyCorsHeaders(req, response);
      return response;
    }

    const response = NextResponse.next();
    applyCorsHeaders(req, response);
    return response;
  }

  if (isProtectedPath(pathname)) {
    const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

    if (!accessToken) {
      const loginUrl = new URL(LOGIN_PATH, req.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
