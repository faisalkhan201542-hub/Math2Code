import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'accent' | 'code' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'glass-panel rounded-2xl relative overflow-hidden',
    glass: 'glass-panel rounded-2xl relative overflow-hidden',
    subtle: 'glass-panel-subtle rounded-2xl relative overflow-hidden',
    accent: 'bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-cyan-500/10 dark:from-teal-950/40 dark:via-slate-900/60 dark:to-cyan-950/30 backdrop-blur-2xl border border-teal-500/30 dark:border-teal-400/25 shadow-[0_8px_32px_0_rgba(13,148,136,0.08)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)] dark:shadow-[inset_0_1px_1px_rgba(45,212,191,0.15)] rounded-2xl relative overflow-hidden',
    code: 'bg-slate-950/85 dark:bg-slate-950/90 backdrop-blur-2xl text-slate-100 border border-slate-800/90 shadow-xl shadow-slate-950/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] rounded-2xl relative overflow-hidden'
  };

  return (
    <div
      className={`transition-all duration-200 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-4 sm:p-5 border-b border-slate-200/60 dark:border-white/5 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-4 sm:p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-4 sm:p-5 pt-0 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between mt-auto ${className}`} {...props}>
    {children}
  </div>
);
