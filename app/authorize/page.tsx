/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import { AuthorizeForm } from "./_components/AuthorizeForm";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import qs from "qs";

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
  const session = cookieStore.get("session_sso")?.value;

  if (session) {
    redirect(
      `/authorize/success?${qs.stringify(parramsResolved)}`,
      RedirectType.push
    );
  }

  return (
    <Suspense>
      <AuthorizeForm />
    </Suspense>
  );
}
