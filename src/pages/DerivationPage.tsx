import React, { useState, useMemo } from 'react';
import { useSearchParams, useParams, useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Code2,
  Lightbulb,
  CheckCircle2,
  Layers,
  Cpu,
  ArrowRightLeft,
  BookOpen,
  LineChart,
  AlertTriangle,
  Search,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MathRenderer } from '../components/math/MathRenderer';
import {
  ALL_DERIVATIONS,
  getDerivationByPattern,
  type PatternDerivation
} from '../explanation-engine';

const CATEGORIES = [
  'All',
  'Mathematics & Linear Algebra',
  'Probability & Statistics',
  'Machine Learning',
  'Optimization & Information Theory',
  'Deep Learning'
] as const;

export const DerivationPage: React.FC = () => {
  const { pattern: paramPattern } = useParams<{ pattern?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryPattern = searchParams.get('pattern');
  const activePatternKey = paramPattern || queryPattern || 'matrix_multiplication';

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isSymbolsExpanded, setIsSymbolsExpanded] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const derivationResult = useMemo(
    () => getDerivationByPattern(activePatternKey),
    [activePatternKey]
  );

  const isUnsupported = derivationResult.status === 'unsupported' || !derivationResult.derivation;
  const derivation: PatternDerivation = derivationResult.derivation || ALL_DERIVATIONS[0];

  const handleSelectPattern = (patternId: string) => {
    setActiveStepIndex(0);
    if (paramPattern) {
      navigate(`/derivation/${patternId}`);
    } else {
      setSearchParams({ pattern: patternId });
    }
  };

  const filteredDerivations = useMemo(() => {
    return ALL_DERIVATIONS.filter((d) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        d.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'Mathematics & Linear Algebra' && d.category.includes('Linear Algebra')) ||
        (selectedCategory === 'Probability & Statistics' && (d.category.includes('Statistics') || d.category.includes('Probability'))) ||
        (selectedCategory === 'Optimization & Information Theory' && (d.category.includes('Information Theory') || d.category.includes('Optimization')));

      const matchesSearch =
        searchQuery.trim() === '' ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.tags && d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const steps = derivation.steps;
  const currentStep = steps[activeStepIndex] || steps[0];
  const progressPercent = Math.round(((activeStepIndex + 1) / steps.length) * 100);

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  const handleNextStep = () => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-yellow-500/10 dark:from-amber-950/40 dark:via-slate-900/60 dark:to-orange-950/30 border border-amber-500/20 dark:border-amber-500/30 p-5 sm:p-6 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-amber-500/15 via-transparent to-transparent blur-2xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/30 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                  Pedagogical Derivation Engine
                </span>
                <Badge variant="amber" size="sm">26 Verified Derivations</Badge>
                <Badge variant="emerald" size="sm">Code-Mapped Proofs</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Step-by-Step Mathematical Derivations
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                Explore rigorous mathematical breakdowns, invariant domains, and worked examples connected step-by-step to verified Python &amp; NumPy implementations.
              </p>
            </div>
          </div>

          {/* Quick Links back to Conversion Engines */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-center flex-wrap">
            <Link to="/library">
              <Button variant="outline" size="sm" leftIcon={<BookOpen className="w-3.5 h-3.5 text-indigo-500" />}>
                Library
              </Button>
            </Link>
            <Link to="/equation-to-code">
              <Button variant="outline" size="sm" leftIcon={<ArrowRightLeft className="w-3.5 h-3.5 text-teal-500" />}>
                Equation → Code
              </Button>
            </Link>
            <Link to="/code-to-equation">
              <Button variant="outline" size="sm" leftIcon={<Code2 className="w-3.5 h-3.5 text-blue-500" />}>
                Code → Equation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Graceful Unsupported Alert if requested pattern is unknown */}
      {isUnsupported && (
        <Card className="border-amber-300 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-950/40">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                  Requested Pattern &apos;{activePatternKey}&apos; is Not Supported
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                  {derivationResult.errorMessage || 'This pattern does not have a verified derivation template. Showing default template below.'}
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSelectPattern('matrix_multiplication')}
            >
              Load Default Derivation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pattern Selector Tabs with Filtering & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Select Equation to Derive ({filteredDerivations.length} of {ALL_DERIVATIONS.length}):</span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search derivations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Derivations */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-72 overflow-y-auto pr-1">
          {filteredDerivations.map((d) => {
            const isSelected = derivation.id === d.id || derivation.pattern === d.pattern;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => handleSelectPattern(d.pattern)}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 dark:border-amber-500 ring-2 ring-amber-500/30 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400/60 dark:hover:border-amber-600/60 hover:bg-amber-50/30 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate w-full flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-amber-500' : 'bg-slate-400 dark:bg-slate-600'}`} />
                  <span className="truncate">{d.title}</span>
                </div>
                <div className="flex items-center justify-between w-full mt-1.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate bg-slate-100 dark:bg-slate-950/60 px-1.5 py-0.5 rounded">
                    {d.category.split(' ')[0]}
                  </span>
                  {d.isEngineSupported && (
                    <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1 py-0.5 rounded font-bold">
                      Compiler
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Derivation Hero Card */}
      <Card className="border-teal-200 dark:border-teal-900/50 bg-gradient-to-r from-teal-50/30 via-transparent to-slate-50/50 dark:from-teal-950/10 dark:to-slate-900/30">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {derivation.category}
                </span>
                {derivation.difficulty && (
                  <Badge variant="blue" size="sm">{derivation.difficulty}</Badge>
                )}
                {derivation.isEngineSupported ? (
                  <Badge variant="emerald" size="sm">Compiler Verified</Badge>
                ) : (
                  <Badge variant="slate" size="sm">Derivation Template</Badge>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                {derivation.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {derivation.subtitle}
              </p>
            </div>

            {/* Actions for Library & Plotter */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {derivation.catalogueId && (
                <Link to={`/library?selected=${derivation.catalogueId}`}>
                  <Button variant="outline" size="sm" leftIcon={<BookOpen className="w-3.5 h-3.5 text-indigo-500" />}>
                    View in Library
                  </Button>
                </Link>
              )}
              {derivation.plottableExpr && (
                <Link to={`/graph-plotter?expr=${encodeURIComponent(derivation.plottableExpr)}`}>
                  <Button variant="outline" size="sm" leftIcon={<LineChart className="w-3.5 h-3.5 text-emerald-500" />}>
                    Plot Function
                  </Button>
                </Link>
              )}
              {derivation.isEngineSupported && (
                <Link to={`/equation-to-code?template=${derivation.pattern}`}>
                  <Button variant="outline" size="sm" leftIcon={<ArrowRightLeft className="w-3.5 h-3.5 text-teal-500" />}>
                    Compile to Code
                  </Button>
                </Link>
              )}
              <Badge variant="teal" size="md">
                {steps.length} Steps
              </Badge>
            </div>
          </div>

          {/* Canonical Formula in KaTeX */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-center overflow-x-auto min-h-[70px]">
            <MathRenderer math={derivation.canonicalFormulaLatex} displayMode={true} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-white/80 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                Mathematical Meaning:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {derivation.summary}
              </p>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                Target What It Calculates:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {derivation.targetWhatItCalculates}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main 2-Column Interface: Step-by-Step Flow (Left) & Context / Worked Example (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Interactive Step Navigator & Step Details */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="py-3 px-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    Step {currentStep.stepNumber} of {steps.length}: {currentStep.title}
                  </span>
                </div>
                <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">
                  {progressPercent}%
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Progress Track */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 h-full rounded-full transition-all duration-300 ease-out shadow-xs shadow-amber-500/50"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Step Navigation Pill Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {steps.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 flex items-center gap-1.5 ${
                      idx === activeStepIndex
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-sm shadow-amber-500/30'
                        : idx < activeStepIndex
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx < activeStepIndex && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                    <span>Step {s.stepNumber}</span>
                  </button>
                ))}
              </div>

              {/* Active Step Mathematical Formula */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-x-auto min-h-[85px]">
                <MathRenderer math={currentStep.latex} displayMode={true} />
              </div>

              {/* Step Explanation */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Mathematical Explanation:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  {currentStep.explanation}
                </p>
              </div>

              {/* Key Takeaway Callout */}
              {currentStep.keyTakeaway && (
                <div className="p-3 rounded-lg bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-teal-900 dark:text-teal-200">Key Takeaway: </span>
                    <span className="text-teal-800 dark:text-teal-300">{currentStep.keyTakeaway}</span>
                  </div>
                </div>
              )}

              {/* Python Implementation Connection */}
              {currentStep.pythonSnippet && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-teal-500" />
                      NumPy / Python Operation:
                    </span>
                    <Badge variant="slate" size="sm">Python 3.11</Badge>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                    <code>{currentStep.pythonSnippet}</code>
                  </pre>
                  {currentStep.pythonExplanation && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      {currentStep.pythonExplanation}
                    </p>
                  )}
                </div>
              )}

              {/* Previous / Next Step Navigation Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevStep}
                  disabled={activeStepIndex === 0}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous Step
                </Button>

                <span className="text-xs font-mono text-slate-500">
                  {activeStepIndex + 1} / {steps.length}
                </span>

                <Button
                  variant={activeStepIndex === steps.length - 1 ? 'outline' : 'primary'}
                  size="sm"
                  onClick={handleNextStep}
                  disabled={activeStepIndex === steps.length - 1}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  {activeStepIndex === steps.length - 1 ? 'Final Step' : 'Next Step'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Assumptions & Domain Restrictions Card */}
          <Card>
            <CardHeader className="py-2.5 px-4 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <CardTitle className="text-xs sm:text-sm">Assumptions &amp; Domain Restrictions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3.5">
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {derivation.assumptions.map((assump, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{assump}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Worked Example & Expandable Mathematical Invariants */}
        <div className="lg:col-span-5 space-y-4">
          {/* Verified Numerical Worked Example Card */}
          <Card className="border-teal-200/80 dark:border-teal-900/60 shadow-xs">
            <CardHeader className="py-2.5 px-4 bg-teal-50/50 dark:bg-teal-950/20 border-b border-teal-100 dark:border-teal-900/40">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <CardTitle className="text-xs sm:text-sm">Verified Worked Example</CardTitle>
                </div>
                <Badge variant="emerald" size="sm">Independently Computed</Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3.5 text-xs">
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                  {derivation.workedExample.title}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  {derivation.workedExample.description}
                </p>
              </div>

              {/* Sample Inputs */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Input Parameters:
                </span>
                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  {derivation.workedExample.inputs.map((inp, i) => (
                    <div key={i} className="flex items-center justify-between font-mono text-[11px]">
                      <span className="font-semibold text-teal-600 dark:text-teal-400">{inp.name}:</span>
                      <MathRenderer math={inp.representation} displayMode={false} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Numerical Arithmetic */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Computation Breakdown:
                </span>
                <div className="space-y-1.5">
                  {derivation.workedExample.stepByStepComputation.map((st, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1"
                    >
                      <div className="font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                        {st.step}
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        <MathRenderer math={st.computation} displayMode={false} />
                        <span className="font-bold text-teal-600 dark:text-teal-400">
                          = {st.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Computed Output */}
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-0.5">
                  Final Computed Result:
                </span>
                <div className="font-mono font-semibold text-emerald-900 dark:text-emerald-200 flex items-center justify-center my-1">
                  <MathRenderer math={derivation.workedExample.finalOutput.interpretation} displayMode={false} />
                </div>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 italic text-center">
                  {derivation.workedExample.verifiedNote}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Symbol Definitions (Expandable) */}
          <Card>
            <CardHeader
              className="py-2.5 px-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              onClick={() => setIsSymbolsExpanded(!isSymbolsExpanded)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-500" />
                  <CardTitle className="text-xs">Symbol Definitions &amp; Invariant Domains</CardTitle>
                </div>
                <Badge variant="slate" size="sm">
                  {isSymbolsExpanded ? 'Collapse' : 'Expand'}
                </Badge>
              </div>
            </CardHeader>
            {isSymbolsExpanded && (
              <CardContent className="p-3 space-y-2 border-t border-slate-100 dark:border-slate-800">
                <div className="overflow-x-auto rounded border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-mono text-[10px]">
                      <tr>
                        <th className="py-1 px-2">Symbol</th>
                        <th className="py-1 px-2">Domain</th>
                        <th className="py-1 px-2">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                      {derivation.symbols.map((sym, i) => (
                        <tr key={i}>
                          <td className="py-1 px-2 font-mono font-bold text-teal-600 dark:text-teal-400">
                            <MathRenderer math={sym.symbol} displayMode={false} />
                          </td>
                          <td className="py-1 px-2 font-mono text-slate-500">
                            <MathRenderer math={sym.mathDomain} displayMode={false} />
                          </td>
                          <td className="py-1 px-2 text-slate-600 dark:text-slate-300">{sym.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Common Mistakes & Numerical Stability Card */}
          <Card>
            <CardHeader className="py-2.5 px-4 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <CardTitle className="text-xs sm:text-sm">Common Mistakes &amp; Numerical Stability</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3.5 space-y-3 text-xs">
              <div>
                <span className="font-semibold text-rose-700 dark:text-rose-400 block mb-1">
                  Common Pitfalls:
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                  {derivation.commonMistakes.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {derivation.numericalStabilityNotes && derivation.numericalStabilityNotes.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-teal-700 dark:text-teal-400 block mb-1">
                    Numerical Stability Notes:
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {derivation.numericalStabilityNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-teal-500 font-bold">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {derivation.applications && derivation.applications.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-indigo-700 dark:text-indigo-400 block mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    Key Applications:
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {derivation.applications.map((app, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
