import { Spinner } from "@/components/ui/Spinner";

/** Server component: loading state for profile page */
export function ProfileLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Spinner size="lg" aria-label="Đang tải hồ sơ" />
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Đang tải hồ sơ...
      </p>
    </div>
  );
}
