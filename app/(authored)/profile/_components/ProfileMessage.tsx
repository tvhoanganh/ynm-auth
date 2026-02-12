interface ProfileMessageProps {
  type: "success" | "error";
  text: string;
}

/** Server component: inline message/alert for profile form */
export function ProfileMessage({ type, text }: ProfileMessageProps) {
  const isSuccess = type === "success";
  return (
    <div
      className={`px-6 py-3.5 border-b flex items-center gap-2 ${
        isSuccess
          ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/60 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
          : "bg-red-50 dark:bg-red-500/10 border-red-200/60 dark:border-red-500/20 text-red-800 dark:text-red-300"
      }`}
    >
      {isSuccess ? (
        <svg
          className="w-5 h-5 shrink-0"
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
      ) : (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      {text}
    </div>
  );
}
