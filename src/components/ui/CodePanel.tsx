import React, { useState, useEffect, useCallback } from 'react';
import {
  Copy,
  Check,
  Terminal,
  FileCode2,
  Play,
  Pencil,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { PythonTerminal } from './PythonTerminal';
import {
  pyodideService,
  type ExecutionResult,
  type PyodideStatus
} from '../../services/pyodideService';

export interface CodePanelProps {
  code: string;
  language?: string;
  title?: string;
  readOnly?: boolean;
  onChange?: (val: string) => void;
  placeholder?: string;
  phaseBadge?: string;
  minHeight?: string;
  executable?: boolean;
}

export const CodePanel: React.FC<CodePanelProps> = ({
  code,
  language = 'Python 3.11',
  title = 'Python Executable Output',
  readOnly = true,
  onChange,
  placeholder = '# Python code will appear here...',
  phaseBadge = 'Code Pipeline',
  minHeight = 'min-h-[260px]',
  executable
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditable, setIsEditable] = useState(!readOnly);

  // Store user edited code; reset if prop code changes
  const [prevPropCode, setPrevPropCode] = useState(code);
  const [userEditedCode, setUserEditedCode] = useState<string | null>(null);

  if (prevPropCode !== code) {
    setPrevPropCode(code);
    setUserEditedCode(null);
  }

  const activeCode = userEditedCode ?? code;

  // Pyodide Execution State
  const isPython = language.toLowerCase().includes('python') || language.toLowerCase().includes('py');
  const isExecutable = executable ?? isPython;

  const [isRunning, setIsRunning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [pyodideStatus, setPyodideStatus] = useState<PyodideStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('Ready');

  useEffect(() => {
    if (!isExecutable) return;
    const unsubscribe = pyodideService.subscribe((status, msg) => {
      setPyodideStatus(status);
      if (msg) setStatusMessage(msg);
    });
    return unsubscribe;
  }, [isExecutable]);

  const handleCopy = async () => {
    if (!activeCode) return;
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleRunCode = useCallback(async () => {
    if (!activeCode.trim()) return;

    setIsRunning(true);
    setShowTerminal(true);

    try {
      const result = await pyodideService.runPython(activeCode);
      setExecutionResult(result);
    } catch (err) {
      setExecutionResult({
        status: 'error',
        stdout: '',
        stderr: err instanceof Error ? err.message : 'Unknown execution failure',
        executionTimeMs: 0,
        engine: 'pyodide_wasm',
        packagesLoaded: []
      });
    } finally {
      setIsRunning(false);
    }
  }, [activeCode]);

  // Handle Ctrl+Enter shortcut to run code
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && isExecutable) {
        e.preventDefault();
        handleRunCode();
      }
    },
    [handleRunCode, isExecutable]
  );

  const lines: string[] = activeCode ? activeCode.split('\n') : [''];

  return (
    <div
      onKeyDown={handleKeyDown}
      className="rounded-xl border border-slate-700/80 bg-slate-950 text-slate-100 overflow-hidden shadow-md flex flex-col font-mono text-xs sm:text-sm"
    >
      {/* Code Editor Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 border border-rose-400/40"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 border border-amber-400/40"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 border border-emerald-400/40"></span>
          </div>
          <FileCode2 className="w-4 h-4 text-teal-400" />
          <span className="font-semibold text-slate-200 text-xs sm:text-sm tracking-tight">{title}</span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {phaseBadge && (
            <Badge variant="teal" size="sm" className="hidden sm:inline-flex">
              {phaseBadge}
            </Badge>
          )}

          {/* Toggle Edit Mode */}
          {readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditable(!isEditable)}
              className="text-slate-400 hover:text-slate-200 h-7 px-2 text-[11px] font-sans"
              title={isEditable ? 'Switch to read-only view' : 'Edit code to tweak inputs or test cases'}
            >
              {isEditable ? (
                <>
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  View
                </>
              ) : (
                <>
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Edit
                </>
              )}
            </Button>
          )}

          {/* Copy Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-slate-300 hover:text-white hover:bg-slate-800 h-7 px-2"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-[11px] text-teal-400 font-sans">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px] font-sans">Copy</span>
              </>
            )}
          </Button>

          {/* Run (Pyodide WebAssembly) Button */}
          {isExecutable && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleRunCode}
              isLoading={isRunning}
              leftIcon={<Play className="w-3 h-3 fill-white" />}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-semibold text-xs h-7 px-2.5 shadow-xs cursor-pointer"
              title="Execute code in browser via Pyodide WebAssembly (Ctrl+Enter)"
            >
              Run Code
            </Button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className={`p-0 flex flex-1 ${minHeight} bg-slate-950 overflow-x-auto relative`}>
        {isEditable ? (
          <div className="relative w-full flex">
            <textarea
              value={activeCode}
              onChange={(e) => {
                setUserEditedCode(e.target.value);
                onChange?.(e.target.value);
              }}
              placeholder={placeholder}
              spellCheck={false}
              className="w-full h-full p-4 bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-hidden placeholder:text-slate-600"
              rows={Math.max(8, lines.length)}
            />
          </div>
        ) : (
          <div className="flex w-full">
            {/* Line Numbers */}
            <div className="py-3 px-3 bg-slate-900/50 border-r border-slate-800/80 text-right select-none text-slate-600 text-xs font-mono min-w-[42px]">
              {lines.map((_, idx) => (
                <div key={idx} className="leading-6">
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Code Content */}
            <div className="py-3 px-4 flex-1 font-mono text-slate-200 leading-6 whitespace-pre overflow-x-auto">
              {activeCode ? (
                <code>{activeCode}</code>
              ) : (
                <span className="text-slate-500 italic select-none">
                  {placeholder}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Footer */}
      <div className="px-4 py-1.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Terminal className="w-3 h-3 text-teal-400" />
            {language}
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">UTF-8</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">WebAssembly Ready</span>
        </div>

        <div className="flex items-center gap-2">
          <span>{lines.length} {lines.length === 1 ? 'line' : 'lines'}</span>
          {showTerminal && (
            <button
              type="button"
              onClick={() => setShowTerminal(!showTerminal)}
              className="text-teal-400 hover:text-teal-300 flex items-center gap-0.5 ml-2 font-sans text-[10px] cursor-pointer"
            >
              {showTerminal ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              Console Output
            </button>
          )}
        </div>
      </div>

      {/* Integrated Live Python WebAssembly Terminal Output */}
      {showTerminal && (
        <div className="border-t border-slate-800 bg-slate-950 p-2">
          <PythonTerminal
            executionResult={executionResult}
            isRunning={isRunning}
            status={pyodideStatus}
            statusMessage={statusMessage}
            onRun={handleRunCode}
            onClear={() => setExecutionResult(null)}
          />
        </div>
      )}
    </div>
  );
};
