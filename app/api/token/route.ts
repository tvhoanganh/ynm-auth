import { NextRequest, NextResponse } from "next/server";
import { generateCodeChallenge } from "@/utils/pkce";
import { SL_API_URL } from "@/constants/SL_API_DOMAIN";
import {
  getAuthorizationEmail,
  isAuthorizationCodeValid,
} from "@/utils/authorizationCodeStorage";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, code_verifier } = body;

  const email = getAuthorizationEmail(code);

  const code_challenge = await generateCodeChallenge(code_verifier);

  const isValid = isAuthorizationCodeValid(code, code_challenge);
  if (!isValid) {
    return NextResponse.json(
      { error: "invalid_grant", message: "Invalid authorization code" },
      { status: 400 }
    );
  }

  const userLodged = await fetch(`${SL_API_URL}/authentication`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, strategy: "sso" }),
  });

  const user = await userLodged.json();

  return NextResponse.json(user);
}
