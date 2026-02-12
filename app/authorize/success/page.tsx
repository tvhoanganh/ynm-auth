import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Callback from "./_components/Callback";
import { generateCodeVerifier } from "@/utils/pkce";
import { OauthOptions } from "@/app/types/OauthOptions";
import {
  storeAuthorizationCode,
  storeAuthorizationEmail,
} from "@/utils/authorizationCodeStorage";
import { stringify } from "querystring";
import { Spinner } from "@/components/ui/Spinner";

function checkValidationSSO(sessionSso: string) {
  return Boolean(sessionSso);
}

export default async function AuthorizeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<OauthOptions>;
}) {
  const cookieStore = await cookies();
  const paramsResolved = await searchParams;
  const session = cookieStore.get("session_sso")?.value || "";

  if (!checkValidationSSO(session)) {
    redirect(`/authorize?${stringify(paramsResolved)}`);
  }

  const authorizationCode = generateCodeVerifier();
  storeAuthorizationCode(authorizationCode, paramsResolved.code_challenge);
  storeAuthorizationEmail(
    authorizationCode,
    session.split("-").at(-1) || "",
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 py-12">
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        aria-hidden
      >
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-3xl" />
      </div>
      <div className="relative rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-sm p-8 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-500 to-cyan-600 flex items-center justify-center mx-auto mb-6 text-white">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Ủy quyền thành công
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-6">
          Bạn đã ủy quyền ứng dụng thành công. Bạn có thể đóng cửa sổ này và
          quay lại ứng dụng.
        </p>
        <Suspense
          fallback={
            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <Spinner size="sm" />
              Đang chuyển hướng...
            </div>
          }
        >
          <Callback
            data={{ ...paramsResolved, authorization_code: authorizationCode }}
          />
        </Suspense>
      </div>
    </div>
  );
}
