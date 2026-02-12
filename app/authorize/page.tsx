import { Suspense } from "react";
import { AuthorizeForm } from "./_components/AuthorizeForm";
import { AuthorizeBranding } from "./_components/AuthorizeBranding";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { stringify } from "qs";
import { generateCodeVerifier } from "@/utils/pkce";
import {
  storeAuthorizationCode,
  storeAuthorizationEmail,
} from "@/utils/authorizationCodeStorage";
import { FLOW_REDIRECT } from "@/constants/oauth";
import { Spinner } from "@/components/ui/Spinner";

function checkValidationSSO(sessionSso: string) {
  return Boolean(sessionSso);
}

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
  const { value: session = "" } = cookieStore.get("session_sso") || {};
  const userEmail = session.split("-").at(-1) || "";

  if (checkValidationSSO(session) && paramsResolved.flow === FLOW_REDIRECT) {
    const authorizationCode = generateCodeVerifier();
    storeAuthorizationCode(authorizationCode, paramsResolved.code_challenge);
    storeAuthorizationEmail(authorizationCode, userEmail);
    redirect(`${paramsResolved.redirect_uri}?code=${authorizationCode}`);
  }

  if (session) {
    redirect(
      `/authorize/success?${stringify(paramsResolved)}`,
      RedirectType.push,
    );
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
