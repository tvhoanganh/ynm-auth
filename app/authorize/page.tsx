/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import { AuthorizeForm } from "./_components/AuthorizeForm";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { stringify } from "qs";
import { generateCodeVerifier } from "@/utils/pkce";
import {
  storeAuthorizationCode,
  storeAuthorizationEmail,
} from "@/utils/authorizationCodeStorage";

const checkValidationSSO = (session_sso: string) => {
  return session_sso;
};

export default async function LoginPage({
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
  const parramsResolved = await searchParams;
  const { value: session = "" } = cookieStore.get("session_sso") || {};
  const userEmail = session.split("-").at(-1) || "";

  if (checkValidationSSO(session) && parramsResolved.flow === "redirect") {
    const authorization_code = generateCodeVerifier();

    storeAuthorizationCode(authorization_code, parramsResolved.code_challenge);
    storeAuthorizationEmail(authorization_code, userEmail);

    redirect(`${parramsResolved.redirect_uri}?code=${authorization_code}`);
  }

  if (session) {
    redirect(
      `/authorize/success?${stringify(parramsResolved)}`,
      RedirectType.push
    );
  }

  return (
    <Suspense>
      <AuthorizeForm />
    </Suspense>
  );
}
