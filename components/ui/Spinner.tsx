type SpinnerSize = "sm" | "md" | "lg";

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-2",
};

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  "aria-label"?: string;
}

/** Server-renderable loading spinner */
export function Spinner({
  size = "md",
  className = "",
  "aria-label": ariaLabel = "Loading",
}: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-slate-200 dark:border-slate-700 border-t-emerald-500 ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={ariaLabel}
    />
  );
}
