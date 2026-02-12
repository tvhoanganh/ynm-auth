import { NextRequest, NextResponse } from "next/server";
import { SL_API_URL } from "@/constants/SL_API_DOMAIN";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  JWT_EXPIRES_IN_SECONDS,
  JWT_ISSUER,
  JWT_SECRET,
} from "@/constants/auth";
import { signJwt } from "@/utils/jwt";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const userResponse = await fetch(`${SL_API_URL}/authentication`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, strategy: "local" }),
  });

  if (!userResponse.ok) {
    return NextResponse.json(
      { error: "Sai thong tin dang nhap" },
      { status: 401 }
    );
  }

  const payload = (await userResponse.json()) as Record<string, unknown>;

  const user =
    (payload.user as Record<string, unknown> | undefined) ||
    (payload.data as Record<string, unknown> | undefined) ||
    payload;

  const userId =
    typeof user.id === "string" || typeof user.id === "number"
      ? user.id
      : undefined;
  const userName = typeof user.name === "string" ? user.name : undefined;
  const userEmail =
    typeof user.email === "string" ? user.email : email;

  if (!userId) {
    return NextResponse.json(
      { error: "Khong tim thay thong tin nguoi dung" },
      { status: 502 }
    );
  }

  if (!JWT_SECRET) {
    return NextResponse.json(
      { error: "JWT secret chua duoc cau hinh" },
      { status: 500 }
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const token = await signJwt(
    {
      sub: String(userId),
      email: userEmail,
      name: userName,
      iss: JWT_ISSUER,
      iat: now,
      exp: now + JWT_EXPIRES_IN_SECONDS,
    },
    JWT_SECRET
  );

  const res = NextResponse.json({
    id: userId,
    name: userName,
    email: userEmail,
  });

  res.cookies.set(ACCESS_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  return res;
}
