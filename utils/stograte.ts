/* eslint-disable @typescript-eslint/no-explicit-any */
const userToken = new Map<string, any>();

export function setUserToken(code_challenge: string, code: string, token: any) {
  userToken.set(code_challenge + code, token);
}

export function getUserToken(
  code_challenge: string,
  code: string
): any | undefined {
  return userToken.get(code_challenge + code);
}
export function getUserById(id: string): any | undefined {
  return userToken.get(id);
}
