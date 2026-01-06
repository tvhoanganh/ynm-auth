import { NextRequest, NextResponse } from "next/server";
import { generateCodeChallenge } from "@/utils/pkce";
import { getUserToken } from "@/utils/stograte";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, code_verifier } = body;
  console.log("=> ~ POST ~ code_verifier:", code_verifier)
  console.log("=> ~ POST ~ code:", code)

  const code_challenge = await generateCodeChallenge(code_verifier);

  const user = getUserToken(code_challenge, code);

  return NextResponse.json(user);
}
