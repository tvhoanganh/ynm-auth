import { NextRequest, NextResponse } from "next/server";
import { SL_API_URL } from "@/constants/SL_API_DOMAIN";
import { container } from "@/services/di-container";
import { PkceService, SsoService } from "@/services";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, code_verifier } = body;
  
  const pkceService = container.resolve(PkceService);
  const ssoService = container.resolve(SsoService);

  const authorizationData = await ssoService.getAuthorizationData(code);
  const code_challenge = await pkceService.generateCodeChallenge(code_verifier);


  const isValid = await ssoService.isAuthorizationCodeValid(
    code,
    code_challenge
  );
  if (!isValid) {
    return NextResponse.json(
      { error: "invalid_grant", message: "Invalid authorization code" },
      { status: 400 }
    );
  }

  if (!authorizationData?.email) {
    return NextResponse.json(
      { error: "invalid_grant", message: "Authorization data not found" },
      { status: 400 }
    );
  }

  const userLodged = await fetch(`${SL_API_URL}/authentication`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: authorizationData.email, strategy: "sso" }),
  });

  const user = await userLodged.json();

  return NextResponse.json(user);
}
