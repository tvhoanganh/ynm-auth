import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  JWT_ISSUER,
  JWT_SECRET,
  PROTECTED_PATHS,
  LOGIN_PATH,
} from "@/constants/auth";
import { verifyJwt } from "@/utils/jwt";

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (isProtectedPath(pathname)) {
    const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
    const isValidToken = accessToken && JWT_SECRET
      ? (await verifyJwt(accessToken, JWT_SECRET, JWT_ISSUER)).valid
      : false;

    if (!isValidToken) {
      const loginUrl = new URL(LOGIN_PATH, req.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS",
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { headers: res.headers });
  }

  return res;
}
