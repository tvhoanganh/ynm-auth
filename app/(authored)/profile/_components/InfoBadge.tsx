type InfoBadgeVariant = "default" | "success" | "warning";

interface InfoBadgeProps {
  label: string;
  value: string;
  variant?: InfoBadgeVariant;
}

const variantClasses: Record<
  InfoBadgeVariant,
  string
> = {
  default:
    "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60",
  success:
    "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/30",
  warning:
    "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/30",
};

/** Server component: read-only info badge */
export function InfoBadge({
  label,
  value,
  variant = "default",
}: InfoBadgeProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span
        className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-sm font-medium w-fit ${variantClasses[variant]}`}
      >
        {value}
      </span>
    </div>
  );
}
