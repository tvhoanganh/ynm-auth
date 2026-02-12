type Variant = "default" | "compact";

const variants = {
  default: (
    <>
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
      <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-cyan-400/15 dark:bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-20 right-1/3 w-72 h-72 rounded-full bg-indigo-400/10 dark:bg-indigo-500/5 blur-3xl" />
    </>
  ),
  compact: (
    <>
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 -left-40 w-80 h-80 rounded-full bg-cyan-400/10 dark:bg-cyan-500/5 blur-3xl" />
    </>
  ),
};

interface BlurDecorationProps {
  variant?: Variant;
}

/** Server-renderable background blur orbs for consistent page styling */
export function BlurDecoration({ variant = "default" }: BlurDecorationProps) {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {variants[variant]}
    </div>
  );
}
