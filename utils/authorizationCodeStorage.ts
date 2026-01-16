const authorizationCodeStorage = new Map<string, string>();
const authorizationEmailStorage = new Map<string, string>();

export function storeAuthorizationCode(
  authorization_code: string,
  code_challenge: string
) {
  console.log("storeAuthorizationCode", {
    key: authorization_code,
    value: code_challenge,
  });
  authorizationCodeStorage.set(authorization_code, code_challenge);
}

export function isAuthorizationCodeValid(
  code: string,
  code_challenge: string
): boolean {
  console.log("authorizationCodeStorage.get(code)", authorizationCodeStorage);
  return (
    authorizationCodeStorage.has(code) &&
    authorizationCodeStorage.get(code) === code_challenge
  );
}

export function removeAuthorizationCode(code: string) {
  authorizationCodeStorage.delete(code);
}

export function storeAuthorizationEmail(
  authorization_code: string,
  email: string
) {
  authorizationEmailStorage.set(authorization_code, email);
}

export function getAuthorizationEmail(
  authorization_code: string
): string | undefined {
  return authorizationEmailStorage.get(authorization_code);
}

export function removeAuthorizationEmail(authorization_code: string) {
  authorizationEmailStorage.delete(authorization_code);
}
