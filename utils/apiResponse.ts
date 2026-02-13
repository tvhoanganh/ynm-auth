import { NextResponse } from "next/server";

export function jsonError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorized(message = "Unauthorized") {
  return jsonError(message, 401);
}

export function invalidCredentials(message = "Wrong email or password") {
  return jsonError(message, 401);
}

export function internalServerError(error: unknown) {
  const message = error instanceof Error ? error.message : "Internal server error";
  return jsonError(message, 500);
}