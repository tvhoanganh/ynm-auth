interface StepItemProps {
  step: number;
  title: string;
  description: string;
}

/** Server component: numbered step for "How it works" section */
export function StepItem({ step, title, description }: StepItemProps) {
  return (
    <div className="flex gap-5 items-start">
      <div className="shrink-0 flex items-center justify-center h-12 w-12 rounded-2xl bg-linear-to-br from-emerald-500 to-cyan-600 text-white font-bold text-lg shadow-lg shadow-emerald-500/30">
        {step}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );
}
