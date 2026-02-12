import { pkceService } from "@/services/PkceService";
import { setUserToken } from "@/utils/stograte";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password, oauth } = await req.json();

  const userLodged = await fetch(
    "http://api-testing.ynm.local/authentication",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, strategy: "local" }),
    }
  );

  const user = await userLodged.json();

  if (!user) {
    return NextResponse.json(
      { error: "Sai thông tin đăng nhập" },
      { status: 401 }
    );
  }
  const code = pkceService.generateCodeVerifier();

  setUserToken(oauth.code_challenge, code, user);

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    code,
  });
}
