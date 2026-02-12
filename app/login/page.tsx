import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginForm } from "./_components/LoginForm";
import { AuthorizeBranding } from "@/app/authorize/_components/AuthorizeBranding";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/constants/auth";

/** Login page: standalone login (no OAuth). Server layout + client form. */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value ?? "";
  if (accessToken) {
    const { returnTo } = await searchParams;
    redirect(returnTo && returnTo.startsWith("/") ? returnTo : "/profile");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row text-slate-900 dark:text-slate-100">
      <AuthorizeBranding />
      <LoginForm />
    </div>
  );
}
