/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Callback from "./_components/Callback";
import { generateCodeVerifier } from "@/utils/pkce";
import { getUserById, setUserToken } from "@/utils/stograte";
import { OauthOptions } from "@/app/types/OauthOptions";
import {
  storeAuthorizationCode,
  storeAuthorizationEmail,
} from "@/utils/authorizationCodeStorage";
import { stringify } from "querystring";

const checkValidationSSO = (session_sso: string) => {
  return session_sso;
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<OauthOptions>;
}) {
  const cookieStore = await cookies();
  const parramsResolved = await searchParams;
  console.log("=> ~ SuccessPage ~ parramsResolved:", parramsResolved);
  const session = cookieStore.get("session_sso")?.value || "";
  if (!checkValidationSSO(session)) {
    redirect(`/authoerize?${stringify(parramsResolved)}`);
  }

  const authorization_code = generateCodeVerifier();

  storeAuthorizationCode(authorization_code, parramsResolved.code_challenge);
  storeAuthorizationEmail(authorization_code, session.split("-").at(-1) || "");

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Authorization Successful
      </h1>
      <p style={{ fontSize: "1.2rem" }}>
        You have successfully authorized the application. You can now close this
        window and return to the application.
      </p>
      <Suspense fallback={<div>Loading callback...</div>}>
        <Callback data={{ ...parramsResolved, authorization_code }}></Callback>
      </Suspense>
    </div>
  );
}
