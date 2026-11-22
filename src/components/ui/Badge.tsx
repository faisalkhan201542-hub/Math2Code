import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'slate' | 'teal' | 'emerald' | 'amber' | 'blue' | 'purple' | 'indigo' | 'rose' | 'cyan' | 'sample';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[10px] font-medium tracking-wide',
    md: 'px-2.5 py-0.5 text-xs font-medium'
  };

  const variantStyles = {
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800/90 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80',
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/80 dark:border-teal-700/60 shadow-xs shadow-teal-500/10',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-700/60 shadow-xs shadow-emerald-500/10',
    amber: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-700/60 shadow-xs shadow-amber-500/10',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-700/60 shadow-xs shadow-blue-500/10',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/80 dark:border-purple-700/60 shadow-xs shadow-purple-500/10',
    indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-700/60 shadow-xs shadow-indigo-500/10',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-700/60 shadow-xs shadow-rose-500/10',
    cyan: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-700/60 shadow-xs shadow-cyan-500/10',
    sample: 'bg-amber-50/80 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-dashed border-amber-300 dark:border-amber-700/60'
  };

  return (
    <span
      className={`inline-flex items-center rounded-md font-mono ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
