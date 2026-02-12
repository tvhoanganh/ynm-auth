import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME, SL_API_TOKEN_COOKIE_NAME } from "@/constants/auth";

/**
 * POST /api/auth/logout
 * Clear authentication tokens (internal + SL_API)
 */
export async function POST() {
  const res = NextResponse.json({ ok: true });

  res.cookies.set(ACCESS_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set(SL_API_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return res;
}
