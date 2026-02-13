import { NavBar } from "./_components/NavBar";
import { UserProvider } from "./_components/UserContext";
import { fetchUserProfile, getAuthContext } from "@/utils/auth";
import { UserProfile } from "@/types/UserProfile";


export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialUser: UserProfile | null = null;
  let initialError: string | null = null;

  try {
    const auth = await getAuthContext();
    initialUser = await fetchUserProfile(auth.userId);
  } catch {
    initialError = "FETCH_PROFILE_FAILED";
  }

  if (initialError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Có lỗi xảy ra
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Vui lòng refresh lại trang để thử lại.
          </p>
        </div>
      </div>
    );
  }

  return (
    <UserProvider initialUser={initialUser} initialError={initialError}>
      <div className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950">
        <NavBar />
        <main>{children}</main>
      </div>
    </UserProvider>
  );
}
