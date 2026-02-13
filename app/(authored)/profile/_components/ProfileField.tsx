"use client";

import { tv } from "tailwind-variants";

interface ProfileFieldProps {
  label: string;
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  type?: string;
}

const input = tv({
  base: "w-full px-4 py-2.5 rounded-xl text-sm transition-all border",
  variants: {
    readOnly: {
      true: "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed",
      false:
        "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none",
    },
  },
  defaultVariants: {
    readOnly: false,
  },
});

export function ProfileField({
  label,
  id,
  value,
  onChange,
  readOnly = false,
  type = "text",
}: ProfileFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={input({ readOnly })}
      />
    </div>
  );
}
