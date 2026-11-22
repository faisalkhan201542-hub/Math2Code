import React, { useMemo } from 'react';
import katex from 'katex';
import { AlertCircle } from 'lucide-react';

export interface MathRendererProps {
  math: string;
  displayMode?: boolean;
  className?: string;
  fallbackText?: string;
  showErrorDetails?: boolean;
  onError?: (error: Error) => void;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  math,
  displayMode = true,
  className = '',
  fallbackText = 'No equation provided',
  showErrorDetails = true,
  onError
}) => {
  const trimmed = math ? math.trim() : '';

  const { html, error } = useMemo(() => {
    if (!trimmed) {
      return { html: '', error: null };
    }

    try {
      const rendered = katex.renderToString(trimmed, {
        displayMode,
        throwOnError: true,
        strict: false,
        trust: false, // Ensure safe rendering, avoid HTML injection
      });
      return { html: rendered, error: null };
    } catch (err) {
      const katexError = err instanceof Error ? err : new Error(String(err));
      onError?.(katexError);
      return { html: '', error: katexError };
    }
  }, [trimmed, displayMode, onError]);

  if (!trimmed) {
    return (
      <span className="text-slate-400 dark:text-slate-500 italic text-xs select-none">
        {fallbackText}
      </span>
    );
  }

  if (error) {
    return (
      <div className={`p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs ${className}`}>
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="font-semibold block text-xs">
              LaTeX Syntax Parsing Error
            </span>
            {showErrorDetails && (
              <p className="font-mono text-[11px] mt-1 break-words bg-rose-100/60 dark:bg-rose-900/40 p-1.5 rounded">
                {error.message}
              </p>
            )}
            <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
              Please check unclosed braces <code>&#123; &#125;</code>, valid command names, or matrix environments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`katex-wrapper transition-colors overflow-x-auto ${
        displayMode ? 'text-center py-2' : 'inline-block'
      } ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
