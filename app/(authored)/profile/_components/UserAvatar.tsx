import Link from "next/link";

interface UserAvatarProps {
  avatarUrl: string | null;
  fullname: string;
}

/** Server component: user avatar and name block */
export function UserAvatar({ avatarUrl, fullname }: UserAvatarProps) {
  const initial = (fullname || "U").slice(0, 1).toUpperCase();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 bg-linear-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/25">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={fullname}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl font-bold text-white">{initial}</span>
        )}
      </div>
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {fullname || "User"}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Account ID</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
