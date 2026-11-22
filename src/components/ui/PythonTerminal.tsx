import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  Zap,
  AlertTriangle,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import type { ExecutionResult, PyodideStatus } from '../../services/pyodideService';

interface PythonTerminalProps {
  executionResult: ExecutionResult | null;
  isRunning: boolean;
  status: PyodideStatus;
  statusMessage: string;
  onRun?: () => void;
  onClear?: () => void;
  title?: string;
  className?: string;
}

export const PythonTerminal: React.FC<PythonTerminalProps> = ({
  executionResult,
  isRunning,
  status,
  statusMessage,
  onRun,
  onClear,
  title = 'Python 3.12 Live WASM Console',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (executionResult && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [executionResult]);

  const handleCopy = async () => {
    if (!executionResult) return;
    const textToCopy = [
      executionResult.stdout,
      executionResult.stderr ? `Error:\n${executionResult.stderr}` : ''
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`rounded-xl border border-slate-700/80 bg-slate-950 text-slate-100 overflow-hidden shadow-lg flex flex-col font-mono text-xs ${className}`}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {/* Mac-style window dots */}
          <div className="flex items-center gap-1.5 mr-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 border border-rose-400/40"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 border border-amber-400/40"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 border border-emerald-400/40"></span>
          </div>

          <Terminal className="w-3.5 h-3.5 text-teal-400" />
          <span className="font-semibold text-slate-200 text-xs tracking-tight">{title}</span>

          {/* Engine Status Badge */}
          {executionResult?.engine === 'pyodide_wasm' ? (
            <Badge variant="emerald" size="sm" className="hidden sm:inline-flex">
              <Cpu className="w-3 h-3 mr-1" />
              Pyodide WASM
            </Badge>
          ) : executionResult?.engine === 'simulated_fallback' ? (
            <Badge variant="blue" size="sm" className="hidden sm:inline-flex">
              <Layers className="w-3 h-3 mr-1" />
              Client Simulator
            </Badge>
          ) : (
            <Badge variant="slate" size="sm" className="hidden sm:inline-flex">
              WebAssembly
            </Badge>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {executionResult && (
            <span className="text-[11px] text-teal-400 flex items-center gap-1 mr-1 px-2 py-0.5 rounded bg-teal-950/60 border border-teal-800/40">
              <Zap className="w-3 h-3 fill-teal-400 text-teal-400" />
              {executionResult.executionTimeMs} ms
            </span>
          )}

          {executionResult && (
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Copy console output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          {onClear && executionResult && (
            <button
              type="button"
              onClick={onClear}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Clear console output"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {onRun && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onRun}
              isLoading={isRunning}
              leftIcon={<Play className="w-3 h-3 fill-white" />}
              className="text-[11px] py-1 px-2.5 h-7 shadow-xs bg-teal-600 hover:bg-teal-500 font-sans font-semibold cursor-pointer"
            >
              Run Code
            </Button>
          )}
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div
        ref={scrollRef}
        className="p-3.5 bg-slate-950 min-h-[160px] max-h-[440px] overflow-y-auto font-mono text-xs leading-relaxed space-y-2 select-text"
      >
        {/* Loading / Runtime Initializing State */}
        {isRunning && (
          <div className="py-6 flex flex-col items-center justify-center gap-2.5 text-slate-400">
            <div className="relative w-8 h-8">
              <div className="w-8 h-8 rounded-full border-2 border-teal-500/20 border-t-teal-400 animate-spin" />
              <Sparkles className="w-4 h-4 text-teal-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <span className="text-xs text-teal-300 font-sans font-medium">
              {statusMessage || 'Executing in WebAssembly...'}
            </span>
            <span className="text-[10px] text-slate-500 font-sans">
              Running CPython directly in your browser with NumPy
            </span>
          </div>
        )}

        {/* Successful Output */}
        {!isRunning && executionResult && executionResult.status === 'success' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] border-b border-slate-900 pb-1">
              <span className="text-emerald-400 font-bold">✓ Process exited successfully</span>
              <span>•</span>
              <span>Runtime: {executionResult.executionTimeMs} ms</span>
              <span>•</span>
              <span className="capitalize">{executionResult.engine.replace('_', ' ')}</span>
            </div>

            <pre className="whitespace-pre-wrap text-slate-200 font-mono text-xs leading-5">
              {executionResult.stdout}
            </pre>
          </div>
        )}

        {/* Error Output */}
        {!isRunning && executionResult && executionResult.status === 'error' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-[11px] border-b border-rose-950 pb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-bold">Execution Error in Python</span>
              <span>•</span>
              <span>Time: {executionResult.executionTimeMs} ms</span>
            </div>

            {executionResult.stdout && (
              <pre className="whitespace-pre-wrap text-slate-300 text-xs">
                {executionResult.stdout}
              </pre>
            )}

            <pre className="p-2.5 rounded bg-rose-950/40 border border-rose-900/60 text-rose-300 whitespace-pre-wrap text-xs font-mono">
              {executionResult.stderr || executionResult.errorDetail || 'Unknown execution error'}
            </pre>
          </div>
        )}

        {/* Idle Empty State */}
        {!isRunning && !executionResult && (
          <div className="py-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <Terminal className="w-7 h-7 text-slate-600 stroke-1" />
            <p className="text-xs text-slate-400 font-sans">
              Click <strong className="text-teal-400 font-semibold font-mono">Run Code</strong> to execute this Python function live in your browser.
            </p>
            <p className="text-[11px] text-slate-600 font-sans">
              Runs in WebAssembly (WASM) via Pyodide • Zero backend server required
            </p>
          </div>
        )}
      </div>

      {/* Terminal Footer Info Bar */}
      <div className="px-3 py-1.5 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-sans">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300">
            {status === 'idle'
              ? 'WASM Engine Ready (Pyodide v0.26.4)'
              : statusMessage}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <span>Press</span>
          <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[9px] border border-slate-700">
            Ctrl + Enter
          </kbd>
          <span>to run</span>
        </div>
      </div>
    </div>
  );
};
