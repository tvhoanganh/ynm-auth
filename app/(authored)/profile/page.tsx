import { fetchUserProfile, getAuthContext } from "@/utils/auth";
import { ProfileClient, ProfileFetchRetry, ProfileMessage } from "./_components";

export default async function ProfilePage() {
  const auth = await getAuthContext();
  const profile = await fetchUserProfile(auth.userId);

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 text-center">
          <ProfileMessage
            type="error"
            text="Không thể tải thông tin người dùng"
          />
          <ProfileFetchRetry />
        </div>
      </div>
    );
  }

  return <ProfileClient initialProfile={profile} />;
}
