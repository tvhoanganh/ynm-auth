import { NextRequest, NextResponse } from "next/server";

// Giả lập database token (nên thay bằng DB thực tế)
const tokens: Record<string, { user_id: string; client_id: string }> = {};

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }
  const access_token = auth.slice(7);
  const tokenData = tokens[access_token];
  if (!tokenData) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }
  // Trả về thông tin user
  return NextResponse.json({
    sub: tokenData.user_id,
    name: "Demo User",
    email: "user@example.com",
  });
}
