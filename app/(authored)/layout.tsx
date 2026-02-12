import { NavBar } from "./_components/NavBar";
import { UserProvider } from "./_components/UserContext";
import { fetchUserProfile, getAuthContext } from "@/utils/auth";
import { UserProfile } from "@/types/UserProfile";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthContext()
  let initialUser: UserProfile | null = null;
  let initialError: string | null = null;

  console.log("Auth Context in Layout:", auth);

  if (auth.isAuthenticated) {
    const profile = await fetchUserProfile(auth.userId);
    if (profile) {
      initialUser = profile as UserProfile;
    } else {
      initialError = "Khong the tai thong tin nguoi dung";
    }
  } else {
    initialError = "Unauthorized";
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
