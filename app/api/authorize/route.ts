import { AuthService, PkceService, SsoService } from "@/services";
import { NextRequest, NextResponse } from "next/server";
import { container } from "@/services/di-container";
import { AUTHORIZATION_SSO_SESSION } from "@/constants/auth";
import { invalidCredentials } from "@/utils/apiResponse";

export async function POST(req: NextRequest) {
  const { email, password, oauth } = await req.json();

  const authService = container.resolve(AuthService);

  const user = await authService.login({ email, password });

  if (!user) {
    return invalidCredentials();
  }

  const ssoService = container.resolve(SsoService);
  const pkceService = container.resolve(PkceService);
  const authorization_code = pkceService.generateCodeVerifier();

  const [authSsoSession] = await Promise.all([
    await ssoService.createSsoSessionToken({
      userId: String(user.id),
      email: String(user.email),
    }),
    await ssoService.storeAuthorizationData(authorization_code, {
      email,
      codeChallenge: oauth.code_challenge,
    }),
  ]);

  const res = NextResponse.json({ code: authorization_code });

  res.cookies.set(
    AUTHORIZATION_SSO_SESSION,
    authSsoSession,
    ssoService.getSsoSessionCookieOptions(),
  );

  return res;
}
