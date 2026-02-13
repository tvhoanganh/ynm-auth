import { NavBar } from "./_components/NavBar";
import { isUserLoggedIn } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = await isUserLoggedIn();

  if (!isLoggedIn) {
    redirect("/login");
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <NavBar />
      <main>{children}</main>
    </div>
  );
}
