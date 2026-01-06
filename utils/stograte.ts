const userToken = new Map<string, string>();

export function setUserToken(
  code_challenge: string,
  code: string,
  token: string
) {
  userToken.set(code_challenge + code, token);
}

export function getUserToken(
  code_challenge: string,
  code: string
): string | undefined {
  return userToken.get(code_challenge + code);
}
