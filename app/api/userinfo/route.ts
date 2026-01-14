import { NextRequest, NextResponse } from "next/server";

// Mock user profile data
let userProfile = {
  id: 5867,
  fullname: "AnhTVH",
  email: "anhtvh@younetgroup.com",
  phone: "0123456785",
  department: "pr",
  company_name: "Younet",
  status: "active",
  last_login: "2026-01-14 08:03:32",
  avatar_url: "http://api-testing.ynm.local/uploads/9dc7b0bfe4536ab5a346d08c332970efabe6d7f0e1457a5dd5121131d01fe4a5.png",
  verified: 1,
  younet_company: "YouNet Media",
};

/**
 * GET: Return user profile information
 */
export async function GET(_req: NextRequest) {
  return NextResponse.json(userProfile);
}

/**
 * PUT: Update user profile information
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    userProfile = {
      ...userProfile,
      ...body,
    };
    return NextResponse.json(userProfile);
  } catch (error) {
    return NextResponse.json(
      { error: "invalid_request", message: "Failed to parse request body" },
      { status: 400 }
    );
  }
}
