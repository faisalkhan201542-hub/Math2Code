import React, { useState } from 'react';
import { Eye, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { MathRenderer } from './MathRenderer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface EquationPreviewProps {
  math: string;
  title?: string;
  className?: string;
  showModeToggle?: boolean;
}

export const EquationPreview: React.FC<EquationPreviewProps> = ({
  math,
  title = 'Live Mathematical KaTeX Preview',
  className = '',
  showModeToggle = true
}) => {
  const [displayMode, setDisplayMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleCopyLatex = async () => {
    if (!math) return;
    try {
      await navigator.clipboard.writeText(math);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const hasContent = Boolean(math && math.trim());

  return (
    <div className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden flex flex-col ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            {title}
          </span>
          <Badge variant="teal" size="sm">
            KaTeX v0.19
          </Badge>
        </div>

        <div className="flex items-center gap-1.5">
          {showModeToggle && (
            <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 rounded-md p-0.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setDisplayMode(true)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  displayMode
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Display / Block math mode"
              >
                Display
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode(false)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  !displayMode
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Inline math mode"
              >
                Inline
              </button>
            </div>
          )}

          {hasContent && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsZoomed(!isZoomed)}
              className="h-7 w-7 p-0 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              title={isZoomed ? 'Standard View' : 'Enlarge Formula'}
              aria-label={isZoomed ? 'Standard View' : 'Enlarge Formula'}
            >
              {isZoomed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </Button>
          )}

          {hasContent && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyLatex}
              className="h-7 px-2 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              title="Copy LaTeX"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-500 mr-1" />
                  <span className="text-[11px] text-teal-600 dark:text-teal-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mathematical Preview Surface */}
      <div
        className={`p-5 sm:p-6 flex items-center justify-center min-h-[140px] bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 overflow-x-auto transition-all relative ${
          isZoomed ? 'text-xl sm:text-2xl min-h-[220px]' : 'text-base sm:text-lg'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.06),transparent_70%)] pointer-events-none" />
        {hasContent ? (
          <div className="w-full relative z-10">
            <MathRenderer
              math={math}
              displayMode={displayMode}
              fallbackText="Equation is empty"
              showErrorDetails={true}
            />
          </div>
        ) : (
          <div className="text-center space-y-1.5 py-4 relative z-10">
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 italic">
              No mathematical equation entered yet.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-600">
              Type LaTeX above, click a symbol from the toolbar, or pick an example equation.
            </p>
          </div>
        )}
      </div>

      {/* Subtitle / Status bar */}
      <div className="px-3.5 py-1.5 bg-slate-100/60 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span>Render Mode: {displayMode ? 'Display ($$)' : 'Inline ($)'}</span>
        <span>TeX Engine: Client-Side KaTeX</span>
      </div>
    </div>
  );
};
