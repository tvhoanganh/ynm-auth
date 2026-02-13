"use client";

import { useRouter } from "next/navigation";

export function ProfileFetchRetry() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="mt-4 w-full px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
    >
      Thử lại
    </button>
  );
}
