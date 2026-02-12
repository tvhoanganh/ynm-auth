import Link from "next/link";

/**
 * Server component: static branding panel for authorize page (left side).
 * Renders without client JS.
 */
export function AuthorizeBranding() {
  return (
    <div className="relative flex-1 flex flex-col justify-center items-center px-6 sm:px-10 py-12 lg:py-0 order-2 lg:order-1">
      <div className="max-w-md w-full flex flex-col items-center lg:items-start gap-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
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
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white text-center lg:text-left leading-tight">
          <span className="bg-linear-to-r from-emerald-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
            Account ID
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 text-center lg:text-left max-w-sm">
          Đăng nhập một tài khoản, bảo mật OAuth 2.0.
          <span className="block mt-2 font-medium text-emerald-600 dark:text-emerald-400">
            Bảo vệ tài khoản của bạn với xác thực hiện đại.
          </span>
        </p>
        <ul className="text-slate-500 dark:text-slate-400 text-sm flex flex-col gap-3">
          <li className="flex items-center gap-3">
            <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Đăng nhập nhanh chóng
          </li>
          <li className="flex items-center gap-3">
            <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-cyan-500" />
            Bảo mật chuẩn OAuth 2.0
          </li>
          <li className="flex items-center gap-3">
            <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500" />
            Hỗ trợ đa nền tảng
          </li>
        </ul>
      </div>
    </div>
  );
}
