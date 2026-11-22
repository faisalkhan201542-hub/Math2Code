import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sigma,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  LineChart,
  ShieldCheck,
  Layers,
  Code2
} from 'lucide-react';
import { MathRenderer } from './MathRenderer';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { ExecutionResult } from '../../services/pyodideService';

export interface StepCalculation {
  step: string;
  description?: string;
  latex: string;
}

export interface PresetMathMetadata {
  id: string;
  name: string;
  category: string;
  latex: string;
  dimensions: string;
  mathExplanation: string;
  derivationRoute?: string;
  equationRoute?: string;
  plotterExpression?: string;
  properties: { label: string; value: string; badge?: string }[];
  resultLatex: string;
  stepCalculations?: StepCalculation[];
}

interface MathematicalResultViewProps {
  preset: PresetMathMetadata;
  executionResult: ExecutionResult | null;
  isRunning: boolean;
  onRun?: () => void;
  className?: string;
}

export const MathematicalResultView: React.FC<MathematicalResultViewProps> = ({
  preset,
  executionResult,
  isRunning,
  onRun,
  className = ''
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`rounded-xl border border-teal-500/30 dark:border-teal-500/40 bg-white dark:bg-slate-900/90 shadow-md overflow-hidden flex flex-col ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-cyan-500/10 dark:from-teal-950/50 dark:via-slate-900 dark:to-emerald-950/40 border-b border-teal-500/20 dark:border-teal-500/30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-500 text-white flex items-center justify-center shadow-xs">
            <Sigma className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              Mathematical Output &amp; Analytic Context
            </h3>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">
              Formal KaTeX Evaluation • Rigorous Academic Notation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {executionResult && (
            <Badge variant="emerald" size="sm">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Calculated ({executionResult.executionTimeMs} ms)
            </Badge>
          )}
          {onRun && !executionResult && !isRunning && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onRun}
              className="text-xs h-7 px-3 bg-teal-600 hover:bg-teal-500"
            >
              Evaluate
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5 overflow-y-auto max-h-[500px]">
        {/* Active LaTeX Equation Card */}
        <div className="p-3.5 rounded-xl border border-teal-500/20 dark:border-teal-500/30 bg-teal-50/40 dark:bg-teal-950/20">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              Governing Mathematical Equation
            </span>
            <span className="font-mono text-[10px] lowercase text-slate-500 dark:text-slate-400">
              {preset.category}
            </span>
          </div>

          <div className="py-2 overflow-x-auto text-center flex items-center justify-center">
            <MathRenderer math={preset.latex} displayMode={true} />
          </div>

          <div className="mt-2 pt-2 border-t border-teal-500/20 dark:border-teal-500/30 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-2">
            <div className="font-mono text-[11px] text-teal-800 dark:text-teal-200">
              <MathRenderer math={preset.dimensions} />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal max-w-md">
              {preset.mathExplanation}
            </p>
          </div>
        </div>

        {/* Computed Mathematical Result */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-500" />
              Computed Mathematical Representation
            </h4>
            {executionResult && (
              <span className="text-[10px] text-slate-500 font-mono">
                Engine: {executionResult.engine === 'pyodide_wasm' ? 'CPython 3.12 (WASM)' : 'Client Engine'}
              </span>
            )}
          </div>

          {isRunning ? (
            <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-slate-500">
              <div className="w-8 h-8 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin" />
              <p className="text-xs text-teal-600 dark:text-teal-300 font-medium">
                Evaluating mathematical tensors and IEEE-754 floats...
              </p>
            </div>
          ) : executionResult ? (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 space-y-4">
              {/* Render computed LaTeX matrices/values */}
              <div className="py-2 overflow-x-auto text-center flex flex-col items-center justify-center gap-2">
                <MathRenderer math={preset.resultLatex} displayMode={true} />
              </div>

              {/* Step calculations if available */}
              {preset.stepCalculations && preset.stepCalculations.length > 0 && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Inner Algebraic Steps:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {preset.stepCalculations.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col gap-1.5 min-w-0"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                          <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-300">
                            <MathRenderer math={step.step} />
                          </span>
                          {step.description && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              {step.description}
                            </span>
                          )}
                        </div>
                        <div className="py-1 text-slate-800 dark:text-slate-100 text-xs overflow-x-auto flex items-center justify-center text-center">
                          <MathRenderer math={step.latex} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 text-center space-y-2">
              <Sigma className="w-8 h-8 text-slate-400 mx-auto stroke-1" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Click "Run Script" to compute and render the mathematical tensors
              </p>
              <p className="text-[11px] text-slate-500">
                Pyodide will execute the Python code and map numeric values directly into standard KaTeX notation.
              </p>
            </div>
          )}
        </div>

        {/* Mathematical Invariants & Verification */}
        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Verified Mathematical Properties
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {preset.properties.map((prop, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">
                    {prop.label}
                  </span>
                  {prop.badge && (
                    <Badge variant="teal" size="sm" className="text-[9px] px-1 py-0">
                      {prop.badge}
                    </Badge>
                  )}
                </div>
                <div className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200">
                  <MathRenderer math={prop.value} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seamless Navigation to Derivation, Equation to Code, Plotter */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
          {preset.derivationRoute && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(preset.derivationRoute!)}
              className="text-xs bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50"
              leftIcon={<GraduationCap className="w-3.5 h-3.5" />}
            >
              Step-by-Step Proof
            </Button>
          )}

          {preset.equationRoute && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(preset.equationRoute!)}
              className="text-xs bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800 hover:bg-teal-50"
              leftIcon={<Code2 className="w-3.5 h-3.5" />}
            >
              Equation → Code Synthesis
            </Button>
          )}

          {preset.plotterExpression && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(`/graph-plotter?f=${encodeURIComponent(preset.plotterExpression!)}`)}
              className="text-xs bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-50"
              leftIcon={<LineChart className="w-3.5 h-3.5" />}
            >
              Plot 2D Graph
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
