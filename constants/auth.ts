export const SESSION_COOKIE_NAME = "session_sso";
export const ACCESS_TOKEN_COOKIE_NAME = "access_token";

export const JWT_ISSUER = "ynm-auth";
export const JWT_EXPIRES_IN_SECONDS = 60 * 60;
export const JWT_SECRET =
	process.env.JWT_SECRET ||
	(process.env.NODE_ENV !== "production" ? "dev_secret" : "");

/** Paths that require login (authored route group) */
export const PROTECTED_PATHS = ["/profile"] as const;

export const LOGIN_PATH = "/login";
