/**
 * PKCE utilities (RFC 7636)
 * Dùng cho OAuth Authorization Code Flow
 * Client-side only (Browser / Electron renderer)
 */

/**
 * Base64 URL encode
 */
function base64UrlEncode(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...Array.from(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Generate code_verifier
 * - length: 32 bytes -> ~43 chars (RFC: 43–128)
 */
export function generateCodeVerifier(length = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

/**
 * Generate code_challenge from code_verifier
 * method: S256 (RECOMMENDED)
 */
export async function generateCodeChallenge(
  codeVerifier: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);

  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

/**
 * Generate PKCE pair
 */
export async function generatePKCE() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: "S256" as const,
  };
}