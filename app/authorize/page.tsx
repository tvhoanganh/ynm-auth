import { Suspense } from "react";
import { AuthorizeForm } from "./_components/AuthorizeForm";
import { AuthorizeBranding } from "./_components/AuthorizeBranding";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { stringify } from "qs";
import { PkceService, SsoService } from "@/services";
import { FLOW_REDIRECT } from "@/constants/oauth";
import { Spinner } from "@/components/ui/Spinner";
import { container } from "@/services/di-container";
import { AUTHORIZATION_SSO_SESSION } from "@/constants/auth";

export default async function AuthorizePage({
  searchParams,
}: {
  searchParams: Promise<{
    client_id: string;
    redirect_uri: string;
    state: string;
    response_type: string;
    scope: string;
    code_challenge: string;
    code_challenge_method: string;
    flow: string;
  }>;
}) {
  const cookieStore = await cookies();
  const paramsResolved = await searchParams;

  if (cookieStore.has(AUTHORIZATION_SSO_SESSION)) {
    const ssoService = container.resolve(SsoService);

    const { value: session = "" } =
      cookieStore.get(AUTHORIZATION_SSO_SESSION) || {};

    const { valid, payload } = await ssoService.verifySsoSessionToken(session);

    if (valid && payload && paramsResolved.flow === FLOW_REDIRECT) {
      const pkceService = container.resolve(PkceService);

      const authorizationCode = pkceService.generateCodeVerifier();

      const [authSsoSession] = await Promise.all([
        await ssoService.createSsoSessionToken({
          userId: String(payload.userId),
          email: payload.email as string,
        }),
        await ssoService.storeAuthorizationData(authorizationCode, {
          email: payload.email as string,
          codeChallenge: paramsResolved.code_challenge,
        }),
      ]);

      cookieStore.set(
        AUTHORIZATION_SSO_SESSION,
        authSsoSession,
        ssoService.getSsoSessionCookieOptions(),
      );

      redirect(`${paramsResolved.redirect_uri}?code=${authorizationCode}`);
    }

    if (valid && payload) {
      redirect(
        `/authorize/success?${stringify(paramsResolved)}`,
        RedirectType.push,
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="lg" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Đang tải...
              </p>
            </div>
          </div>
        }
      >
        <AuthorizeBranding />
        <AuthorizeForm />
      </Suspense>
    </div>
  );
}
