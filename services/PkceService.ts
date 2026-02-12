/**
 * PKCE service (RFC 7636)
 * Dung cho OAuth Authorization Code Flow
 * Client-side only (Browser / Electron renderer)
 */

import { injectable } from "tsyringe";

@injectable()
export class PkceService {
  /**
   * Base64 URL encode
   */
  private base64UrlEncode(buffer: Uint8Array): string {
    return btoa(String.fromCharCode(...Array.from(buffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  /**
   * Generate code_verifier
   * - length: 32 bytes -> ~43 chars (RFC: 43-128)
   */
  generateCodeVerifier(length = 32): string {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return this.base64UrlEncode(bytes);
  }

  /**
   * Generate code_challenge from code_verifier
   * method: S256 (RECOMMENDED)
   */
  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);

    const digest = await crypto.subtle.digest("SHA-256", data);
    return this.base64UrlEncode(new Uint8Array(digest));
  }

  /**
   * Generate PKCE pair
   */
  async generatePKCE() {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    return {
      codeVerifier,
      codeChallenge,
      codeChallengeMethod: "S256" as const,
    };
  }
}

