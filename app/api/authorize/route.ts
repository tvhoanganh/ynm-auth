import { generateCodeVerifier } from "@/utils/pkce";
import { setUserToken } from "@/utils/stograte";
import { NextRequest, NextResponse } from "next/server";

const SL_API_URL = process.env.SL_API_URL || "http://api-testing.ynm.local";

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
  const code = generateCodeVerifier();

  setUserToken(oauth.code_challenge, code, user);

  return NextResponse.json({
    code,
  });
}
