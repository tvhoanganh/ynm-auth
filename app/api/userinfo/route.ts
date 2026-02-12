import "reflect-metadata";
import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  JWT_ISSUER,
  JWT_SECRET,
  SL_API_TOKEN_COOKIE_NAME,
} from "@/constants/auth";
import { SL_API_URL } from "@/constants/SL_API_DOMAIN";
import { container } from "@/services/di-container";
import { JwtService } from "@/services";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;


  if (!token || !JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jwtService = container.resolve(JwtService);
  const { valid, payload } = await jwtService.verifyJwt(
    token,
    JWT_SECRET,
    JWT_ISSUER,
  );

  if (!valid || !payload?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slApiToken = req.cookies.get(SL_API_TOKEN_COOKIE_NAME)?.value;

  const userId = String(payload.sub);

  try {
    const res = await fetch(
      `${SL_API_URL}/users/${encodeURIComponent(userId)}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${slApiToken}`,
        },
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user info" },
        { status: res.status },
      );
    }

    const userInfo = await res.json();
    return NextResponse.json(userInfo);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
