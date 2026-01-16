import { SL_API_URL } from "@/constants/SL_API_DOMAIN";
import {
  storeAuthorizationCode,
  storeAuthorizationEmail,
} from "@/utils/authorizationCodeStorage";
import { generateCodeVerifier } from "@/utils/pkce";
import { setUserToken } from "@/utils/stograte";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password, oauth } = await req.json();

  const userLodged = await fetch(`${SL_API_URL}/authentication`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, strategy: "local" }),
  });

  const user = await userLodged.json();

  if (!user) {
    return NextResponse.json(
      { error: "Sai thông tin đăng nhập" },
      { status: 401 }
    );
  }
  const authorization_code = generateCodeVerifier();

  storeAuthorizationCode(authorization_code, oauth.code_challenge);
  console.log(
    "=> ~ POST ~ storeAuthorizationCode:",
    authorization_code,
    oauth.code_challenge
  );
  storeAuthorizationEmail(authorization_code, email);

  const res = NextResponse.json({ code: authorization_code });

  const session_sso = generateCodeVerifier();
  res.cookies.set("session_sso", session_sso + "-" + email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
