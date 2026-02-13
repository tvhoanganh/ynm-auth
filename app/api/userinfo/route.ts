import "reflect-metadata";
import { isAxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { SL_API_TOKEN_COOKIE_NAME } from "@/constants/auth";
import { internalServerError, unauthorized } from "@/utils/apiResponse";
import { withAuth } from "@/utils/withAuth";
import { container } from "@/services/di-container";
import { HttpServiceFactory } from "@/services";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  const slApiToken = req.cookies.get(SL_API_TOKEN_COOKIE_NAME)?.value;
  const userId = user.id;

  if (!slApiToken) {
    return unauthorized();
  }

  try {
    const httpServiceFactory = container.resolve(HttpServiceFactory);
    const client = httpServiceFactory.getClientWithBearer("slApi", slApiToken);
    const userInfo = await client.get<Record<string, unknown>>(
      `/users/${encodeURIComponent(userId)}`,
    );

    return NextResponse.json(userInfo);
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined;

    if (status) {
      return NextResponse.json(
        { error: "Failed to fetch user info" },
        { status },
      );
    }

    return internalServerError(error);
  }
});
