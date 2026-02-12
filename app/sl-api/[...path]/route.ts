import { NextRequest, NextResponse } from "next/server";
import { SL_API_URL } from "@/constants/SL_API_DOMAIN";
import { SL_API_TOKEN_COOKIE_NAME } from "@/constants/auth";

async function proxyRequest(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/sl-api/, "");
  const targetUrl = `${SL_API_URL}${path}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("content-length");

  const slApiToken = req.cookies.get(SL_API_TOKEN_COOKIE_NAME)?.value;
  if (slApiToken) {
    headers.set("authorization", `Bearer ${slApiToken}`);
  }

  const method = req.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  const res = await fetch(targetUrl, {
    method,
    headers,
    body,
  });

  const responseHeaders = new Headers(res.headers);
  return new NextResponse(res.body, {
    status: res.status,
    headers: responseHeaders,
  });
}

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}

export async function POST(req: NextRequest) {
  return proxyRequest(req);
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req);
}

export async function PATCH(req: NextRequest) {
  return proxyRequest(req);
}

export async function DELETE(req: NextRequest) {
  return proxyRequest(req);
}

export async function HEAD(req: NextRequest) {
  return proxyRequest(req);
}

export async function OPTIONS(req: NextRequest) {
  return proxyRequest(req);
}
