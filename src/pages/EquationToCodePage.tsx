import React, { useState, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sigma,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  GraduationCap,
  LineChart
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { CodePanel } from '../components/ui/CodePanel';
import { EquationInput, type EquationInputRef } from '../components/math/EquationInput';
import { EquationPreview } from '../components/math/EquationPreview';
import { EquationSymbolToolbar } from '../components/math/EquationSymbolToolbar';
import { EquationExamples } from '../components/math/EquationExamples';
import { MathRenderer } from '../components/math/MathRenderer';
import { convertEquationToPython, type ConversionResult } from '../engine';
import { parseExpression } from '../plot-engine';

export const EquationToCodePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialLatex = searchParams.get('latex') || '\\sigma(z) = \\frac{1}{1 + e^{-z}}';

  const [equationInput, setEquationInput] = useState(initialLatex);
  const [targetLanguage, setTargetLanguage] = useState('python');
  const [showSampleCode, setShowSampleCode] = useState(false);
  const [activeModal, setActiveModal] = useState<'explain' | null>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResult>(() =>
    convertEquationToPython(initialLatex)
  );

  const equationInputRef = useRef<EquationInputRef>(null);

  // Determine if current equation can be safely plotted as a 1D function of x
  const plottableExpression = useMemo(() => {
    if (conversionResult?.status === 'success') {
      if (conversionResult.pattern === 'sigmoid') {
        return '1 / (1 + exp(-x))';
      }
      if (conversionResult.pattern === 'gaussian_pdf') {
        return '(1 / sqrt(2 * pi)) * exp(-0.5 * x^2)';
      }
      if (conversionResult.pattern === 'relu') {
        return 'max(0, x)';
      }
      if (conversionResult.pattern === 'l1_regularization' || conversionResult.pattern === 'mean_absolute_error') {
        return 'abs(x)';
      }
      if (conversionResult.pattern === 'l2_regularization' || conversionResult.pattern === 'mean_squared_error') {
        return 'x^2';
      }
      if (conversionResult.pattern === 'z_score') {
        return 'x';
      }
    }
    // Only if equationInput parses cleanly as a function of scalar x
    if (equationInput && equationInput.trim().length > 0) {
      const parsed = parseExpression(equationInput);
      if (parsed.success && parsed.normalizedExpression) {
        return parsed.normalizedExpression;
      }
    }
    return null;
  }, [conversionResult, equationInput]);

  const sampleReferenceCode = `import numpy as np

# Static Reference Demonstration (Sigmoidal Logistic Activation)
# Note: Toggle off to view engine-generated Python code
def sigmoid(z: np.ndarray) -> np.ndarray:
    """Compute numerically stable logistic sigmoid activation function."""
    z_arr = np.asarray(z, dtype=float)
    pos_mask = (z_arr >= 0)
    result = np.empty_like(z_arr)
    result[pos_mask] = 1.0 / (1.0 + np.exp(-z_arr[pos_mask]))
    exp_z = np.exp(z_arr[~pos_mask])
    result[~pos_mask] = exp_z / (1.0 + exp_z)
    return result`;

  const handleInsertSymbol = (snippet: string) => {
    if (equationInputRef.current) {
      equationInputRef.current.insertAtCursor(snippet);
    } else {
      setEquationInput((prev) => prev + snippet);
    }
  };

  const handleSelectExample = (latex: string) => {
    setEquationInput(latex);
    setShowSampleCode(false);
    const result = convertEquationToPython(latex);
    setConversionResult(result);
  };

  const handleClear = () => {
    setEquationInput('');
    setShowSampleCode(false);
    const result = convertEquationToPython('');
    setConversionResult(result);
  };

  const handleGenerateCode = () => {
    setShowSampleCode(false);
    const result = convertEquationToPython(equationInput);
    setConversionResult(result);
  };

  const handleLoadTemplate = (latex: string) => {
    setEquationInput(latex);
    setShowSampleCode(false);
    const result = convertEquationToPython(latex);
    setConversionResult(result);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header Hero Card with Specular Glassmorphism */}
      <div className="glass-panel relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/80 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
        {/* Specular ambient light refraction */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-teal-500/20 via-emerald-500/10 to-transparent blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/4 w-60 h-24 bg-cyan-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 ring-1 ring-white/30 shrink-0">
              <Sigma className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
                  Symbolic Synthesis Pipeline
                </span>
                <Badge variant="emerald" size="sm">NumPy Engine Active</Badge>
                <Badge variant="teal" size="sm">LaTeX / KaTeX v0.19</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Equation → Code Synthesis
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                Formulate mathematical expressions in LaTeX and convert them into production-ready, numerically validated Python &amp; NumPy routines.
              </p>
            </div>
          </div>

          {/* Target Language Selector with Frosted Glass Pill */}
          <div className="flex items-center gap-2 self-start md:self-center glass-panel p-2 rounded-xl border border-white/80 dark:border-white/10 shadow-xs">
            <label htmlFor="language-select" className="text-xs font-medium text-slate-600 dark:text-slate-400 pl-1">
              Target Language:
            </label>
            <select
              id="language-select"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-teal-500/30 dark:border-teal-500/40 bg-teal-50/70 dark:bg-teal-950/60 backdrop-blur-md text-teal-900 dark:text-teal-200 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="python">Python 3.11 (NumPy / SciPy)</option>
              <option value="julia" disabled>Julia (Coming Soon)</option>
              <option value="rust" disabled>Rust ndarray (Coming Soon)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Selectable Standard Academic Examples */}
      <EquationExamples
        onSelect={handleSelectExample}
        selectedLatex={equationInput}
      />

      {/* Main 2-Column Interface: Math Formulation (Left) & Output / Code Pipeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Equation Input, Symbol Toolbar & KaTeX Live Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-sm">Mathematical Equation Formulation</CardTitle>
                <CardDescription>Enter LaTeX, scan from image/notes, or select a preset</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="teal" size="sm">Interactive Editor</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Controlled LaTeX Equation Input */}
              <EquationInput
                ref={equationInputRef}
                value={equationInput}
                onChange={setEquationInput}
                onClear={handleClear}
                label="Mathematical Equation (LaTeX)"
                rows={5}
                placeholder="Enter LaTeX formula, e.g. \sigma(z) = \frac{1}{1 + e^{-z}}"
              />

              {/* Symbol Toolbar (Inserts at cursor) */}
              <EquationSymbolToolbar
                onInsert={handleInsertSymbol}
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={!equationInput && !showSampleCode}
                >
                  Clear All
                </Button>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {conversionResult?.status === 'success' && (
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
                  {plottableExpression && (
                    <Link to={`/graph-plotter?expr=${encodeURIComponent(plottableExpression)}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<LineChart className="w-3.5 h-3.5 text-teal-500" />}
                      >
                        Plot this Function
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveModal('explain')}
                    leftIcon={<HelpCircle className="w-3.5 h-3.5 text-teal-500" />}
                  >
                    Explain Equation
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleGenerateCode}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Generate Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live KaTeX Preview Component */}
          <EquationPreview
            math={equationInput}
            title="KaTeX Live Mathematical Typesetting"
            showModeToggle={true}
          />
        </div>

        {/* Right Column: Code Editor Output & Status Panels */}
        <div className="space-y-4">
          {/* Conversion Status Banner */}
          {conversionResult && (
            <div
              className={`p-4 rounded-2xl border transition-all glass-panel shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] ${
                conversionResult.status === 'success'
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/30 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
                  : conversionResult.status === 'unsupported_syntax'
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500/30 dark:border-amber-500/30 text-amber-950 dark:text-amber-100'
                  : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-500/30 dark:border-rose-500/30 text-rose-950 dark:text-rose-100'
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
                        {conversionResult.status === 'success' && 'Conversion Successful'}
                        {conversionResult.status === 'unsupported_syntax' && 'Unsupported Syntax'}
                        {conversionResult.status === 'invalid_input' && 'Invalid Equation Input'}
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
                        {conversionResult.metadata?.displayName || (conversionResult.status === 'success' ? 'Validated Pattern' : 'Syntax Check')}
                      </Badge>
                    </div>

                    <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                      {conversionResult.status === 'success' && (
                        <span>
                          Canonical pattern parsed. Numerical safeguards and dimension checks generated with NumPy.
                        </span>
                      )}
                      {conversionResult.status === 'unsupported_syntax' && (
                        <span>{conversionResult.errorMessage}</span>
                      )}
                      {conversionResult.status === 'invalid_input' && (
                        <span>Please enter a mathematical expression or pick a verified preset from above.</span>
                      )}
                    </p>

                    {conversionResult.status === 'success' && (
                      <div className="mt-2.5 flex items-center gap-2 flex-wrap">
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
                        {plottableExpression && (
                          <Link to={`/graph-plotter?expr=${encodeURIComponent(plottableExpression)}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              leftIcon={<LineChart className="w-3 h-3 text-teal-500" />}
                            >
                              Plot in Graph Plotter
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Template Picker when syntax is unsupported */}
              {conversionResult.status === 'unsupported_syntax' && conversionResult.suggestedTemplates && (
                <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-800/40">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-2">
                    Available Canonical Equations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {conversionResult.suggestedTemplates.map((tmplLatex, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleLoadTemplate(tmplLatex)}
                        className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        {tmplLatex}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input Assumptions & Variable Contract Box */}
          {conversionResult?.status === 'success' && conversionResult.metadata && (
            <Card className="border-teal-200/80 dark:border-teal-900/50">
              <CardHeader className="py-2.5 px-4 bg-teal-50/40 dark:bg-teal-950/10 border-b border-teal-100 dark:border-teal-900/30">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <CardTitle className="text-xs">Contract Assumptions & Input Dimensions</CardTitle>
                  </div>
                  <Badge variant="teal" size="sm">
                    {conversionResult.metadata.variables.length} Variables
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3.5 space-y-3">
                {/* Assumptions List */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Mathematical Assumptions:
                  </span>
                  <ul className="grid grid-cols-1 gap-1 text-xs text-slate-600 dark:text-slate-400">
                    {conversionResult.metadata.assumptions.map((assump, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-teal-500 font-bold">•</span>
                        <span>{assump}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Variable Requirements Table */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                    Required Input Variables:
                  </span>
                  <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        <tr>
                          <th className="py-1 px-2.5">Variable</th>
                          <th className="py-1 px-2">Type</th>
                          <th className="py-1 px-2">Shape</th>
                          <th className="py-1 px-2.5">Role / Constraints</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {conversionResult.metadata.variables.map((v) => (
                          <tr key={v.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="py-1 px-2.5 font-semibold text-teal-600 dark:text-teal-400">{v.name}</td>
                            <td className="py-1 px-2">{v.type}</td>
                            <td className="py-1 px-2 text-slate-500">{v.shape}</td>
                            <td className="py-1 px-2.5 font-sans text-slate-600 dark:text-slate-400">
                              {v.description} {v.constraints ? `(${v.constraints})` : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Python Code Editor Output */}
          <CodePanel
            code={showSampleCode ? sampleReferenceCode : (conversionResult?.code || '')}
            language="Python 3.11 (NumPy)"
            title={
              showSampleCode
                ? 'Reference Demo Code (Static Sigmoid)'
                : conversionResult?.metadata?.displayName
                ? `Generated Python: ${conversionResult.metadata.displayName}`
                : 'Generated Python Routine'
            }
            placeholder={`# Awaiting Equation Input...
#
# Enter an equation on the left or select a verified preset above.
# Click "Generate Code" to run the AST synthesis pipeline.`}
            phaseBadge={conversionResult?.status === 'success' ? 'Verified Engine' : 'AST Pipeline'}
            minHeight="min-h-[380px]"
          />

          {/* Code View Controls & Reference Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-600 dark:text-slate-300">
              {showSampleCode
                ? 'Viewing static reference demonstration code.'
                : 'Viewing live engine-generated Python code.'}
            </span>
            <Button
              variant={showSampleCode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowSampleCode(!showSampleCode)}
              className="text-xs"
            >
              {showSampleCode ? 'Return to Engine Code' : 'View Static Sample'}
            </Button>
          </div>

          {/* Safe Execution & Verification Notice */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
              <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Safe Execution & Run/Verify Status</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
              Runtime Python execution is safely isolated. The code emitted above is safely generated static text ready for review, inspection, and copying. Code preview does not constitute mathematical verification without testing.
            </p>
          </div>
        </div>
      </div>

      {/* Modal: Real Mathematical Explanation & Derivation */}
      <Modal
        isOpen={activeModal === 'explain'}
        onClose={() => setActiveModal(null)}
        title={
          conversionResult?.explanation
            ? `Mathematical Explanation: ${conversionResult.metadata?.displayName || 'Equation Breakdown'}`
            : 'Equation Analysis'
        }
        description={
          conversionResult?.explanation
            ? 'Formal definition, parameter bounds, operation mapping, and computational complexity'
            : 'Analytical breakdown for mathematical expressions'
        }
        maxWidth="lg"
      >
        {conversionResult?.explanation ? (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-h-[75vh] overflow-y-auto pr-1">
            {/* KaTeX Equation Header */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center">
              <MathRenderer
                math={conversionResult.metadata?.standardLatex || equationInput}
                displayMode={true}
              />
            </div>

            {/* Formal Definition */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                Formal Definition
              </h4>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                {conversionResult.explanation.formalDefinition}
              </p>
            </div>

            {/* Domain & Constraints */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                Domain & Invariant Constraints
              </h4>
              <ul className="space-y-1 list-disc list-inside text-xs text-slate-600 dark:text-slate-400">
                {conversionResult.explanation.domainAndConstraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Variable Roles Table */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-500" />
                Variable Semantic Roles
              </h4>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <tr>
                      <th className="py-1.5 px-3">Symbol</th>
                      <th className="py-1.5 px-3">Shape</th>
                      <th className="py-1.5 px-3">Mathematical Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                    {conversionResult.explanation.variableRoles.map((vr) => (
                      <tr key={vr.symbol}>
                        <td className="py-1.5 px-3 font-semibold text-teal-600 dark:text-teal-400">{vr.symbol}</td>
                        <td className="py-1.5 px-3 text-slate-500">{vr.shape}</td>
                        <td className="py-1.5 px-3 font-sans text-slate-600 dark:text-slate-400">{vr.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Operation Mapping */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-500" />
                Mathematical → Python Operation Mapping
              </h4>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <tr>
                      <th className="py-1.5 px-3">Math Notation</th>
                      <th className="py-1.5 px-3">Python / NumPy Implementation</th>
                      <th className="py-1.5 px-3">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                    {conversionResult.explanation.operationMapping.map((om, i) => (
                      <tr key={i}>
                        <td className="py-1.5 px-3 text-teal-600 dark:text-teal-400">{om.mathSymbol}</td>
                        <td className="py-1.5 px-3 text-purple-600 dark:text-purple-400 font-semibold">{om.pythonEquivalent}</td>
                        <td className="py-1.5 px-3 font-sans text-slate-600 dark:text-slate-400">{om.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Numerical Safeguards */}
            {conversionResult.explanation.numericalSafeguards && conversionResult.explanation.numericalSafeguards.length > 0 && (
              <div className="p-3 rounded-lg bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50">
                <span className="text-xs font-semibold text-teal-800 dark:text-teal-300 block mb-1">
                  Numerical Safeguards & Invariants:
                </span>
                <ul className="space-y-1 list-disc list-inside text-xs text-teal-900/80 dark:text-teal-200/80">
                  {conversionResult.explanation.numericalSafeguards.map((ns, idx) => (
                    <li key={idx}>{ns}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Computational Complexity */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Complexity:</span>
              <div className="flex items-center gap-2">
                <Badge variant="teal" size="sm">
                  Time: {conversionResult.explanation.computationalComplexity.time}
                </Badge>
                <Badge variant="purple" size="sm">
                  Space: {conversionResult.explanation.computationalComplexity.space}
                </Badge>
                <Badge variant="slate" size="sm">
                  FLOPs: {conversionResult.explanation.computationalComplexity.flops}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 text-xs">
              <strong>Structured Explanation Requires Supported Equation</strong>
              <p className="mt-1">
                Detailed mathematical breakdowns, invariant definitions, parameter bounds, and operation mappings are available for the 6 canonical equations.
              </p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Select any of the canonical presets from the main page (e.g. Matrix Multiplication, Sigmoid, Bayes&apos; Theorem, Gaussian PDF) to explore its mathematical structure and Python mapping.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
