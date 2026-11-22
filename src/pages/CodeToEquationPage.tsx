import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  ArrowRight,
  Sigma,
  Trash2,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { MathRenderer } from '../components/math/MathRenderer';
import {
  convertCodeToEquation,
  SUPPORTED_REVERSE_PRESETS,
  type ReverseConversionResult
} from '../reverse-engine';

export const CodeToEquationPage: React.FC = () => {
  const initialCode = 'C = A @ B';
  const [codeContent, setCodeContent] = useState(initialCode);
  const [showSampleEquation, setShowSampleEquation] = useState(false);
  const [activeModal, setActiveModal] = useState<'explain' | null>(null);
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    SUPPORTED_REVERSE_PRESETS.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredPresets = useMemo(() => {
    if (activeCategory === 'All') return SUPPORTED_REVERSE_PRESETS;
    return SUPPORTED_REVERSE_PRESETS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Initialize conversion result directly from initial code
  const [conversionResult, setConversionResult] = useState<ReverseConversionResult>(() =>
    convertCodeToEquation(initialCode)
  );

  const sampleDifferentialLatex = `\\begin{aligned}
\\frac{dx}{dt} &= \\alpha x - \\beta x y \\\\
\\frac{dy}{dt} &= \\delta x y - \\gamma y
\\end{aligned}`;

  const handleClear = () => {
    setCodeContent('');
    setShowSampleEquation(false);
    setConversionResult(convertCodeToEquation(''));
  };

  const handleConvert = () => {
    setShowSampleEquation(false);
    const result = convertCodeToEquation(codeContent);
    setConversionResult(result);
  };

  const handleSelectPreset = (code: string) => {
    setCodeContent(code);
    setShowSampleEquation(false);
    const result = convertCodeToEquation(code);
    setConversionResult(result);
  };

  const handleCopyLatex = async () => {
    if (!conversionResult.latex) return;
    try {
      await navigator.clipboard.writeText(conversionResult.latex);
      setCopiedLatex(true);
      setTimeout(() => setCopiedLatex(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-cyan-500/10 dark:from-blue-950/40 dark:via-slate-900/60 dark:to-indigo-950/30 border border-blue-500/20 dark:border-blue-500/30 p-5 sm:p-6 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-blue-500/15 via-transparent to-transparent blur-2xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 shrink-0">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
                  AST Reverse Decompiler
                </span>
                <Badge variant="blue" size="sm">Python 3.11 Grammar</Badge>
                <Badge variant="indigo" size="sm">Zero Execution / Safe AST</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Code → Equation Decompiler
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                Decompile computational Python and NumPy source routines into symbolic LaTeX mathematical equations and operator mappings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <Badge variant="blue" size="md" className="py-1 px-3">
              Source: Python 3.11 AST
            </Badge>
          </div>
        </div>
      </div>

      {/* Preset Code Snippets Bar */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Selectable Canonical Python Presets:</span>
          </span>
          <Badge variant="blue" size="sm">
            {filteredPresets.length} / {SUPPORTED_REVERSE_PRESETS.length} Models
          </Badge>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-0.5" />
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {filteredPresets.map((preset) => {
            const isSelected = codeContent.trim() === preset.code.trim();
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.code)}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/30 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400/60 dark:hover:border-blue-600/60 hover:bg-blue-50/30 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate w-full flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-slate-400 dark:bg-slate-600'}`} />
                  {preset.name}
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate w-full mt-1.5 bg-slate-100 dark:bg-slate-950/60 px-1.5 py-0.5 rounded">
                  {preset.code}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Interface: Code Editor (Left) & Equation Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Code Editor */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-sm">Python Source Routine</CardTitle>
                <CardDescription>Enter or edit computational Python code to decompile</CardDescription>
              </div>
              <Badge variant="teal" size="sm">Restricted Python Grammar</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <textarea
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  placeholder="# Enter Python mathematical expression or function, e.g. C = A @ B"
                  rows={11}
                  className="w-full p-3.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-y"
                  spellCheck={false}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={!codeContent && !showSampleEquation}
                  leftIcon={<Trash2 className="w-3.5 h-3.5 text-slate-400" />}
                >
                  Clear Editor
                </Button>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {conversionResult?.status === 'success' &&
                    conversionResult.pattern !== 'unsupported' &&
                    conversionResult.pattern !== 'generic_algebraic' && (
                      <Link to={`/derivation?pattern=${conversionResult.pattern}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<GraduationCap className="w-3.5 h-3.5 text-teal-500" />}
                        >
                          Step-by-Step Derivation
                        </Button>
                      </Link>
                    )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveModal('explain')}
                    leftIcon={<HelpCircle className="w-3.5 h-3.5 text-teal-500" />}
                  >
                    Explain Code
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleConvert}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Convert to Equation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reference Demo Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-600 dark:text-slate-300">
              {showSampleEquation
                ? 'Viewing static reference differential system (Lotka-Volterra).'
                : 'Viewing live AST decompilation output.'}
            </span>
            <Button
              variant={showSampleEquation ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowSampleEquation(!showSampleEquation)}
              className="text-xs"
            >
              {showSampleEquation ? 'Return to Decompiled Output' : 'Preview Reference ODE'}
            </Button>
          </div>

          {/* Safety & Sandboxing Notice */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>Safe AST Decomposition (Zero Execution)</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Python source code is parsed purely as an abstract syntax tree using restricted lexical grammar. Python <code>eval</code>, <code>exec</code>, or arbitrary dynamic imports are never executed.
            </p>
          </div>
        </div>

        {/* Right Column: Decompiled Equation Output */}
        <div className="space-y-4">
          {/* Conversion Status Banner */}
          {conversionResult && (
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                conversionResult.status === 'success'
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-100'
                  : conversionResult.status === 'unsupported_syntax'
                  ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 text-amber-950 dark:text-amber-100'
                  : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/50 text-rose-950 dark:text-rose-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  {conversionResult.status === 'success' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {conversionResult.status === 'unsupported_syntax' && (
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  )}
                  {conversionResult.status === 'invalid_input' && (
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm">
                        {conversionResult.status === 'success' && 'Decompilation Successful'}
                        {conversionResult.status === 'unsupported_syntax' && 'Unsupported Python Syntax'}
                        {conversionResult.status === 'invalid_input' && 'Invalid Code Input'}
                      </span>
                      <Badge
                        variant={
                          conversionResult.status === 'success'
                            ? 'emerald'
                            : conversionResult.status === 'unsupported_syntax'
                            ? 'amber'
                            : 'slate'
                        }
                        size="sm"
                      >
                        {conversionResult.equationName}
                      </Badge>
                    </div>

                    <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                      {conversionResult.status === 'success' && (
                        <span>
                          {conversionResult.explanation?.summary || 'Syntax tree recognized and converted to mathematical equation.'}
                        </span>
                      )}
                      {conversionResult.status === 'unsupported_syntax' && (
                        <span>
                          {conversionResult.errorMessage}
                          {conversionResult.diagnosticLocation && (
                            <strong className="block mt-0.5 font-mono text-[11px] text-amber-700 dark:text-amber-300">
                              Location: {conversionResult.diagnosticLocation}
                            </strong>
                          )}
                        </span>
                      )}
                      {conversionResult.status === 'invalid_input' && (
                        <span>Please enter Python source code or select a verified preset from above.</span>
                      )}
                    </p>

                    {conversionResult.status === 'success' &&
                      conversionResult.pattern !== 'unsupported' &&
                      conversionResult.pattern !== 'generic_algebraic' && (
                        <div className="mt-2.5">
                          <Link to={`/derivation?pattern=${conversionResult.pattern}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              leftIcon={<GraduationCap className="w-3 h-3 text-teal-500" />}
                            >
                              Explore Step-by-Step Derivation & Worked Example
                            </Button>
                          </Link>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Supported template shortcuts if unsupported */}
              {conversionResult.status === 'unsupported_syntax' && (
                <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-800/40">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-2">
                    Try A Verified Canonical Python Pattern:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUPPORTED_REVERSE_PRESETS.slice(0, 4).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPreset(p.code)}
                        className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reconstructed Mathematical Equation Display */}
          <Card className="min-h-[220px]">
            <CardHeader className="py-2.5 px-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Sigma className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <CardTitle className="text-xs sm:text-sm">Reconstructed Mathematical Equation</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {conversionResult?.latex && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyLatex}
                      className="text-xs h-7 px-2"
                      leftIcon={copiedLatex ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    >
                      {copiedLatex ? 'Copied LaTeX' : 'Copy LaTeX'}
                    </Button>
                  )}
                  <Badge variant="teal" size="sm">KaTeX Rendered</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 flex flex-col justify-center items-center text-center">
              {showSampleEquation ? (
                <div className="w-full space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <MathRenderer math={sampleDifferentialLatex} displayMode={true} />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-mono">
                    <Badge variant="sample" size="sm">Static Reference Demo</Badge>
                    <span>Lotka-Volterra Coupled Dynamical System</span>
                  </div>
                </div>
              ) : conversionResult.status === 'success' && conversionResult.latex ? (
                <div className="w-full space-y-4">
                  {/* KaTeX Main Equation Rendering */}
                  <div className="p-5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-center overflow-x-auto min-h-[90px]">
                    <MathRenderer math={conversionResult.latex} displayMode={true} />
                  </div>

                  {/* Raw LaTeX Display */}
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left font-mono text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                      LaTeX Source:
                    </span>
                    <code>{conversionResult.latex}</code>
                  </div>
                </div>
              ) : (
                <div className="max-w-md space-y-2.5 py-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <Sigma className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {conversionResult.status === 'unsupported_syntax'
                      ? 'No Mathematical Output'
                      : 'Awaiting Python Decompilation'}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {conversionResult.status === 'unsupported_syntax'
                      ? 'The input code contains statements or syntax not supported by the decompiler.'
                      : 'Enter Python code on the left or select a verified preset above, then click "Convert to Equation".'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Python-to-Mathematics Operation Mapping Table */}
          {conversionResult.status === 'success' && conversionResult.explanation?.operationMappings && conversionResult.explanation.operationMappings.length > 0 && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="py-2.5 px-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-teal-500" />
                  <CardTitle className="text-xs">Python → Mathematics Operation Mapping</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      <tr>
                        <th className="py-1.5 px-2.5">Python Syntax</th>
                        <th className="py-1.5 px-2.5">Math Symbol</th>
                        <th className="py-1.5 px-2.5">Operation Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      {conversionResult.explanation.operationMappings.map((om, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-1.5 px-2.5 text-purple-600 dark:text-purple-400 font-semibold">{om.pythonSyntax}</td>
                          <td className="py-1.5 px-2.5 text-teal-600 dark:text-teal-400 font-semibold">{om.mathSymbol}</td>
                          <td className="py-1.5 px-2.5 font-sans text-slate-600 dark:text-slate-400">{om.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Semantic Grounding Table: Inferred Labels vs Source Facts */}
          {conversionResult.status === 'success' && conversionResult.explanation?.variableMappings && conversionResult.explanation.variableMappings.length > 0 && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="py-2.5 px-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-teal-500" />
                    <CardTitle className="text-xs">Variable Roles & Semantic Grounding</CardTitle>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Source Facts vs Inferred Labels
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      <tr>
                        <th className="py-1.5 px-2.5">Code Identifier</th>
                        <th className="py-1.5 px-2.5">Math Symbol</th>
                        <th className="py-1.5 px-2.5">Role</th>
                        <th className="py-1.5 px-2.5">Grounding</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      {conversionResult.explanation.variableMappings.map((vm, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-1.5 px-2.5 font-semibold text-slate-800 dark:text-slate-200">{vm.pythonVariable}</td>
                          <td className="py-1.5 px-2.5 text-teal-600 dark:text-teal-400 font-semibold">{vm.mathSymbol}</td>
                          <td className="py-1.5 px-2.5 font-sans text-slate-600 dark:text-slate-400">{vm.role}</td>
                          <td className="py-1.5 px-2.5">
                            <Badge
                              variant={vm.isInferred ? 'amber' : 'slate'}
                              size="sm"
                            >
                              {vm.isInferred ? 'Inferred' : 'Source Fact'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal: Detailed Code & Mathematical Derivation Explanation */}
      <Modal
        isOpen={activeModal === 'explain'}
        onClose={() => setActiveModal(null)}
        title={
          conversionResult.explanation
            ? `Mathematical Explanation: ${conversionResult.explanation.title}`
            : 'Decompiler Analysis'
        }
        description={
          conversionResult.explanation
            ? `${conversionResult.explanation.category} • Mathematical Invariants & Complexity`
            : 'Static analysis and decompilation properties'
        }
        maxWidth="lg"
      >
        {conversionResult.explanation ? (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-h-[75vh] overflow-y-auto pr-1">
            {/* KaTeX Display */}
            {conversionResult.latex && (
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center">
                <MathRenderer math={conversionResult.latex} displayMode={true} />
              </div>
            )}

            {/* Summary */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                Mathematical Interpretation
              </h4>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                {conversionResult.explanation.summary}
              </p>
            </div>

            {/* Domain */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                Mathematical Domain
              </h4>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
                <MathRenderer math={conversionResult.explanation.mathDomain} displayMode={false} />
              </div>
            </div>

            {/* Assumptions */}
            {conversionResult.explanation.assumptions.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-500" />
                  Mathematical & Dimension Assumptions
                </h4>
                <ul className="space-y-1 list-disc list-inside text-xs text-slate-600 dark:text-slate-400">
                  {conversionResult.explanation.assumptions.map((assump, idx) => (
                    <li key={idx}>{assump}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Limitations */}
            {conversionResult.explanation.limitations.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block mb-1">
                  Scope & Decompiler Limitations:
                </span>
                <ul className="space-y-1 list-disc list-inside text-xs text-amber-900/80 dark:text-amber-200/80">
                  {conversionResult.explanation.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 text-xs">
              <strong>Structured Explanation Requires Supported Routine</strong>
              <p className="mt-1">
                Detailed mathematical explanations, operation mappings, and invariant checks are provided for verified supported Python patterns.
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Select any of the supported canonical presets (e.g. Matrix Multiplication, Sigmoid, Bayes&apos; Theorem, Vector L2 Norm) to explore its mathematical breakdown.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
