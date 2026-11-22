import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  LineChart,
  ShieldCheck,
  Code2,
  Tag,
  CheckCircle2,
  BookOpen,
  Layers
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CodePanel } from '../ui/CodePanel';
import { MathRenderer } from '../math/MathRenderer';
import type { CatalogueEquation } from '../../types/catalogue';
import { EQUATION_CATALOGUE } from '../../data/equationCatalogue';

interface EquationDetailViewProps {
  equation: CatalogueEquation;
  onBack: () => void;
  onSelectEquation: (id: string) => void;
}

export const EquationDetailView: React.FC<EquationDetailViewProps> = ({
  equation,
  onBack,
  onSelectEquation
}) => {
  const relatedEquations = equation.relatedEquationIds
    .map((id) => EQUATION_CATALOGUE.find((e) => e.id === id))
    .filter((e): e is CatalogueEquation => e !== undefined);

  const getDifficultyBadgeVariant = (diff: string) => {
    switch (diff) {
      case 'Foundational':
        return 'emerald';
      case 'Intermediate':
        return 'blue';
      case 'Advanced':
        return 'purple';
      default:
        return 'slate';
    }
  };

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'Mathematics & Linear Algebra':
        return 'amber';
      case 'Probability & Statistics':
        return 'blue';
      case 'Machine Learning':
        return 'teal';
      case 'Deep Learning':
        return 'purple';
      case 'Optimization & Information Theory':
        return 'rose';
      case 'Bioinformatics':
        return 'emerald';
      default:
        return 'teal';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="self-start text-xs font-mono"
        >
          Back to Catalogue
        </Button>

        {/* Feature Connection Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {equation.isEngineSupported ? (
            <Link to={`/equation-to-code?latex=${encodeURIComponent(equation.latex)}`}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Code2 className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Open in Equation → Code
              </Button>
            </Link>
          ) : (
            <Link to={`/equation-to-code?latex=${encodeURIComponent(equation.latex)}`}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Code2 className="w-3.5 h-3.5 text-slate-400" />}
                className="text-xs"
              >
                Inspect in Equation Editor
              </Button>
            </Link>
          )}

          {equation.derivationPatternId && (
            <Link to={`/derivation?pattern=${equation.derivationPatternId}`}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<GraduationCap className="w-3.5 h-3.5 text-amber-500" />}
                className="text-xs"
              >
                Step-by-Step Derivation
              </Button>
            </Link>
          )}

          {equation.plottableExpr && (
            <Link to={`/graph-plotter?expr=${encodeURIComponent(equation.plottableExpr)}`}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<LineChart className="w-3.5 h-3.5 text-purple-500" />}
                className="text-xs"
              >
                Plot Function
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={getCategoryBadgeVariant(equation.category)} size="sm">
            {equation.category}
          </Badge>
          <Badge variant="slate" size="sm">
            {equation.subcategory}
          </Badge>
          <Badge variant={getDifficultyBadgeVariant(equation.difficulty)} size="sm">
            {equation.difficulty}
          </Badge>
          {equation.isEngineSupported && (
            <Badge variant="emerald" size="sm">
              Synthesis Engine Verified
            </Badge>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {equation.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          {equation.description}
        </p>
      </div>

      {/* Main Formula Card */}
      <Card className="border-teal-200/70 dark:border-teal-900/40 overflow-hidden shadow-xs">
        <CardHeader className="py-2.5 px-4 bg-teal-50/40 dark:bg-teal-950/20 border-b border-teal-100 dark:border-teal-900/30 flex flex-row items-center justify-between">
          <span className="text-xs font-mono font-medium text-teal-800 dark:text-teal-300 uppercase tracking-wider">
            Standard Mathematical Formulation
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Complexity: {equation.complexity}
          </span>
        </CardHeader>
        <CardContent className="p-6 space-y-4 bg-white dark:bg-slate-900">
          <div className="overflow-x-auto py-4 px-2 text-center flex items-center justify-center min-h-[90px] bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <MathRenderer math={equation.latex} displayMode={true} />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 text-xs font-mono text-slate-500 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">Raw LaTeX:</span>
            <code className="px-2 py-1 bg-slate-100 dark:bg-slate-950 rounded text-slate-700 dark:text-slate-300 text-[11px] select-all overflow-x-auto">
              {equation.latex}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Two-Column Grid: Intuition & Variables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mathematical Meaning & Intuition */}
        <Card>
          <CardHeader className="py-3 px-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-500" />
              <CardTitle className="text-sm">Mathematical Meaning & Intuition</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>{equation.mathematicalMeaning}</p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs uppercase tracking-wider">
                Assumptions & Domain Limits:
              </span>
              <ul className="space-y-1.5">
                {equation.assumptionsAndLimitations.map((assump, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold">•</span>
                    <span>{assump}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Variables Table */}
        <Card>
          <CardHeader className="py-3 px-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-500" />
              <CardTitle className="text-sm">Variables & Parameters ({equation.variables.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 font-mono text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Symbol</th>
                  <th className="py-2.5 px-3 font-medium">Variable Name</th>
                  <th className="py-2.5 px-3 font-medium">Description</th>
                  <th className="py-2.5 px-3 font-medium">Domain / Shape</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {equation.variables.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30">
                    <td className="py-2 px-4 font-mono font-bold text-teal-600 dark:text-teal-400">
                      <MathRenderer math={v.symbol} displayMode={false} />
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {v.name}
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                      {v.description}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {v.domainOrShape || 'Scalar ∈ ℝ'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Verified Python Implementation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Verified Python Reference Implementation
            </h3>
          </div>
          {equation.isEngineSupported ? (
            <Badge variant="emerald" size="sm">
              <CheckCircle2 className="w-3 h-3 mr-1 inline" />
              Engine Supported Pattern
            </Badge>
          ) : (
            <Badge variant="slate" size="sm">
              Analytical Specification
            </Badge>
          )}
        </div>

        {!equation.isEngineSupported && (
          <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
            <strong>Note on Automated Conversion:</strong> This equation serves as a verified scientific catalogue specification. Automated 1:1 code generation is supported for canonical patterns in the Equation to Code engine.
          </div>
        )}

        <CodePanel
          code={equation.pythonEquivalent}
          language="Python 3.11 / NumPy"
          title={`${equation.title} Implementation`}
          phaseBadge={equation.isEngineSupported ? 'Synthesis Engine' : 'Catalogue Reference'}
          minHeight="min-h-[220px]"
        />
      </div>

      {/* Related Equations */}
      {relatedEquations.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-teal-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Related Mathematical Equations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedEquations.map((rel) => (
              <button
                key={rel.id}
                type="button"
                onClick={() => onSelectEquation(rel.id)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500/60 hover:bg-teal-50/30 dark:hover:bg-teal-950/20 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>{rel.category}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {rel.title}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-mono">
                  {rel.formula}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
