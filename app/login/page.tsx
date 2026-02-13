import { redirect } from "next/navigation";
import { LoginForm } from "./_components/LoginForm";
import { AuthorizeBranding } from "@/app/authorize/_components/AuthorizeBranding";
import { isUserLoggedIn } from "@/utils/auth";

/** Login page: standalone login (no OAuth). Server layout + client form. */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const userLoggedIn = await isUserLoggedIn();

  if (userLoggedIn) {
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
