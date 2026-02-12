interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

/** Server component: feature card for landing page */
export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-400/40 dark:hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="text-3xl mb-4 rounded-xl bg-linear-to-br from-emerald-400 to-cyan-500 p-3 w-fit text-white shadow-lg shadow-emerald-500/25">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
