import { AuthService, JwtService, PkceService, SsoService } from "@/services";
import { NextRequest, NextResponse } from "next/server";
import { container } from "@/services/di-container";
import { AUTHORIZATION_SSO_SESSION, JWT_ISSUER } from "@/constants/auth";

export async function POST(req: NextRequest) {
  const { email, password, oauth } = await req.json();

  const authService = container.resolve(AuthService);
  const ssoService = container.resolve(SsoService);
  const jwtService = container.resolve(JwtService);

  const user = await authService.login({ email, password });

  if (!user) {
    return NextResponse.json(
      { error: "Sai thông tin đăng nhập" },
      { status: 401 },
    );
  }
  const pkceService = container.resolve(PkceService);
  const authorization_code = pkceService.generateCodeVerifier();

  await ssoService.storeAuthorizationData(authorization_code, {
    email,
    codeChallenge: oauth.code_challenge,
  });

  const res = NextResponse.json({ code: authorization_code });

  const now = Math.floor(Date.now() / 1000);
  const authSsoSession = await jwtService.signJwt({
    sub: String(user.id),
    email: user.email,
    name: user.name,
    iss: JWT_ISSUER,
    iat: now,
    exp: now + 100 * 365 * 24 * 60 * 60, // 100 years expiration for SSO session
  });

  res.cookies.set(AUTHORIZATION_SSO_SESSION, authSsoSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
