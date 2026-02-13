import { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME, JWT_ISSUER, JWT_SECRET } from "@/constants/auth";
import { container } from "@/services/di-container";
import { JwtService } from "@/services";
import { unauthorized } from "@/utils/apiResponse";

export interface WithAuthOptions {
  cookieName?: string;
  issuer?: "ynm-auth" | "ynm-sso";
  secret?: string;
}

export interface AuthContext {
  user: {
    id: string;
    email?: string;
    name?: string;
    role?: string;
  };
}

export type AuthedRouteHandler = (
  req: NextRequest,
  auth: AuthContext,
) => Promise<Response> | Response;

type RouteHandler = (req: NextRequest) => Promise<Response> | Response;

export function withAuth(
  handler: AuthedRouteHandler,
  options: WithAuthOptions = {},
): RouteHandler {
  return async (req: NextRequest) => {
    const cookieName = options.cookieName ?? ACCESS_TOKEN_COOKIE_NAME;
    const token = req.cookies.get(cookieName)?.value;

    if (!token) {
      return unauthorized();
    }

    const jwtService = container.resolve(JwtService);
    const { valid, payload } = await jwtService.verifyJwt(
      token,
      options.secret ?? JWT_SECRET,
      options.issuer ?? JWT_ISSUER,
    );

    if (!valid || !payload?.sub) {
      return unauthorized();
    }

    return handler(req, {
      user: {
        id: String(payload.sub),
        email: payload.email as string | undefined,
        name: payload.name as string | undefined,
        role: payload.role as string | undefined,
      },
    });
  };
}
