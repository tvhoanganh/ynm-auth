/**
 * PKCE utilities (RFC 7636)
 * Dung cho OAuth Authorization Code Flow
 * Client-side only (Browser / Electron renderer)
 */

import { pkceService } from "@/services/PkceService";

export function generateCodeVerifier(length = 32): string {
  return pkceService.generateCodeVerifier(length);
}

export async function generateCodeChallenge(
  codeVerifier: string
): Promise<string> {
  return pkceService.generateCodeChallenge(codeVerifier);
}

export async function generatePKCE() {
  return pkceService.generatePKCE();
}