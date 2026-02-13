import { NextRequest, NextResponse } from "next/server";
import "reflect-metadata";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  SL_API_TOKEN_COOKIE_NAME,
} from "@/constants/auth";
import { container } from "@/services/di-container";
import { AuthService, LoginService } from "@/services";
import { internalServerError } from "@/utils/apiResponse";

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

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax" as const,
    };

    // Set internal access token cookie
    res.cookies.set(ACCESS_TOKEN_COOKIE_NAME, internalToken, cookieOptions);

    // Set SL_API access token cookie for backend calls
    res.cookies.set(SL_API_TOKEN_COOKIE_NAME, slApiToken, cookieOptions);

    return res;
  } catch (error) {
    return internalServerError(error);
  }
}
