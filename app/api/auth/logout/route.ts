import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME, SESSION_COOKIE_NAME } from "@/constants/auth";

function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set(ACCESS_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}

export async function GET() {
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}
