import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Trash2, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EquationInputRef {
  insertAtCursor: (snippet: string) => void;
  focus: () => void;
  clear: () => void;
}

export interface EquationInputProps {
  value: string;
  onChange: (val: string) => void;
  onClear?: () => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

export const EquationInput = forwardRef<EquationInputRef, EquationInputProps>(({
  value,
  onChange,
  onClear,
  placeholder = 'e.g. \\sigma(z) = \\frac{1}{1 + e^{-z}}',
  label = 'Mathematical Equation (LaTeX)',
  rows = 5,
  disabled = false,
  className = ''
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Expose imperative handle for inserting at cursor
  useImperativeHandle(ref, () => ({
    insertAtCursor: (snippet: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        onChange(value + snippet);
        return;
      }

      const start = textarea.selectionStart ?? value.length;
      const end = textarea.selectionEnd ?? value.length;
      const before = value.substring(0, start);
      const after = value.substring(end);

      const newValue = before + snippet + after;
      onChange(newValue);

      // Re-position cursor inside or directly after snippet
      requestAnimationFrame(() => {
        textarea.focus();
        const newCursorPos = start + snippet.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      });
    },
    focus: () => {
      textareaRef.current?.focus();
    },
    clear: () => {
      onChange('');
      onClear?.();
      textareaRef.current?.focus();
    }
  }), [value, onChange, onClear]);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const lineCount = value.split('\n').length;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Header bar with Label, Line Counter, and Quick Actions */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="equation-latex-input"
          className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
        >
          <span>{label}</span>
          <span className="text-[10px] text-slate-400 font-sans">
            ({value.length} chars, {lineCount} {lineCount === 1 ? 'line' : 'lines'})
          </span>
        </label>

        <div className="flex items-center gap-1">
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              title="Copy LaTeX source"
              aria-label="Copy LaTeX source"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-teal-500" />
                  <span className="text-[11px] text-teal-600 dark:text-teal-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="text-[11px]">Copy LaTeX</span>
                </>
              )}
            </Button>
          )}

          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange('');
                onClear?.();
              }}
              className="h-6 px-1.5 text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
              title="Clear equation input"
              aria-label="Clear equation input"
            >
              <Trash2 className="w-3 h-3" />
              <span className="text-[11px]">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Multiline Input Textarea */}
      <div className="relative rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all overflow-hidden shadow-2xs">
        <textarea
          id="equation-latex-input"
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          spellCheck={false}
          className="w-full p-3 bg-transparent text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm leading-relaxed resize-y focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={label}
        />
      </div>
    </div>
  );
});

EquationInput.displayName = 'EquationInput';
