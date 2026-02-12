import { NextRequest, NextResponse } from "next/server";
import "reflect-metadata";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  SL_API_TOKEN_COOKIE_NAME,
} from "@/constants/auth";
import { container } from "@/services/di-container";
import { AuthService, LoginService } from "@/services";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    // Step 1: Authenticate with SL_API
    const authService = container.resolve(AuthService);
    const slApiPayload = await authService.login({
      email,
      password,
    });

    // Step 2: Process login (extract user, create internal JWT)
    const loginService = container.resolve(LoginService);
    const { user, internalToken, slApiToken } =
      await loginService.processLogin(slApiPayload);

    // Step 3: Build response with cookies
    const res = NextResponse.json(user);

    // Set internal access token cookie
    res.cookies.set(ACCESS_TOKEN_COOKIE_NAME, internalToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    // Set SL_API access token cookie for backend calls
    res.cookies.set(SL_API_TOKEN_COOKIE_NAME, slApiToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message });
  }
}
