import React, { useState, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LineChart,
  Play,
  RotateCcw,
  Sliders,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  Info,
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MathRenderer } from '../components/math/MathRenderer';
import { useTheme } from '../context/useTheme';
import {
  evaluateCurve,
  validateDomain,
  generateCSV,
  downloadCSV,
  FUNCTION_PRESETS,
  type FunctionPreset,
  type CurveConfig,
  type CurveData,
  type DomainConfig
} from '../plot-engine';
import { PlotVisualizer, type PlotVisualizerRef } from '../components/plot/PlotVisualizer';

const PRESET_COLORS = [
  '#0d9488', // Teal
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#10b981'  // Emerald
];

const DEFAULT_CURVES: CurveConfig[] = [
  {
    id: 'c1',
    name: 'f₁(x)',
    expression: '(1 / sqrt(2 * pi)) * exp(-0.5 * x^2)',
    color: '#0d9488',
    visible: true
  }
];

const DEFAULT_DOMAIN: DomainConfig = {
  xMin: -4.0,
  xMax: 4.0,
  sampleCount: 500
};

export const GraphPlotterPage: React.FC = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();

  // Curve state initialized from URL or defaults
  const [curves, setCurves] = useState<CurveConfig[]>(() => {
    const urlPreset = searchParams.get('preset');
    if (urlPreset) {
      const match = FUNCTION_PRESETS.find((p) => p.id === urlPreset);
      if (match) {
        return [
          {
            id: 'c1',
            name: 'f₁(x)',
            expression: match.expression,
            color: '#0d9488',
            visible: true
          }
        ];
      }
    }

    const urlExpr = searchParams.get('expr');
    if (urlExpr) {
      return [
        {
          id: 'c1',
          name: 'f₁(x)',
          expression: urlExpr,
          color: '#0d9488',
          visible: true
        }
      ];
    }

    return DEFAULT_CURVES;
  });

  // Domain state initialized from URL or defaults
  const [activeDomain, setActiveDomain] = useState<DomainConfig>(() => {
    const urlPreset = searchParams.get('preset');
    if (urlPreset) {
      const match = FUNCTION_PRESETS.find((p) => p.id === urlPreset);
      if (match) {
        return {
          xMin: match.xMin,
          xMax: match.xMax,
          sampleCount: match.sampleCount
        };
      }
    }
    return DEFAULT_DOMAIN;
  });

  const [xMinInput, setXMinInput] = useState(() => activeDomain.xMin.toString());
  const [xMaxInput, setXMaxInput] = useState(() => activeDomain.xMax.toString());
  const [sampleCountInput, setSampleCountInput] = useState(() => activeDomain.sampleCount.toString());
  const [domainError, setDomainError] = useState<string | null>(null);

  // Visualizer ref for PNG export and view resets
  const visualizerRef = useRef<PlotVisualizerRef>(null);

  // Handle Add Curve
  const handleAddCurve = () => {
    if (curves.length >= 5) return;
    const newIdx = curves.length + 1;
    const color = PRESET_COLORS[(newIdx - 1) % PRESET_COLORS.length];
    const newCurve: CurveConfig = {
      id: `c_${Date.now()}`,
      name: `f${newIdx}(x)`,
      expression: 'sin(x)',
      color,
      visible: true
    };
    setCurves((prev) => [...prev, newCurve]);
  };

  // Handle Remove Curve
  const handleRemoveCurve = (id: string) => {
    if (curves.length <= 1) return;
    setCurves((prev) => prev.filter((c) => c.id !== id));
  };

  // Handle Toggle Visibility
  const handleToggleVisibility = (id: string) => {
    setCurves((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    );
  };

  // Handle Change Curve Expression
  const handleExpressionChange = (id: string, newExpr: string) => {
    setCurves((prev) =>
      prev.map((c) => (c.id === id ? { ...c, expression: newExpr } : c))
    );
  };

  // Handle Change Curve Color
  const handleColorChange = (id: string, newColor: string) => {
    setCurves((prev) =>
      prev.map((c) => (c.id === id ? { ...c, color: newColor } : c))
    );
  };

  // Handle Select Preset
  const handleSelectPreset = (preset: FunctionPreset) => {
    setCurves([
      {
        id: 'c1',
        name: 'f₁(x)',
        expression: preset.expression,
        color: '#0d9488',
        visible: true
      }
    ]);
    setXMinInput(preset.xMin.toString());
    setXMaxInput(preset.xMax.toString());
    setSampleCountInput(preset.sampleCount.toString());
    setActiveDomain({
      xMin: preset.xMin,
      xMax: preset.xMax,
      sampleCount: preset.sampleCount
    });
    setDomainError(null);
  };

  // Handle Plot Execution (Form Submit)
  const handlePlot = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const min = parseFloat(xMinInput);
    const max = parseFloat(xMaxInput);
    const samples = parseInt(sampleCountInput, 10);

    const check = validateDomain({ xMin: min, xMax: max, sampleCount: samples });
    if (!check.isValid) {
      setDomainError(check.error || 'Invalid domain boundaries.');
      return;
    }

    setDomainError(null);
    setActiveDomain({ xMin: min, xMax: max, sampleCount: samples });
  };

  // Handle Reset to Default Domain
  const handleResetDomain = () => {
    setXMinInput(DEFAULT_DOMAIN.xMin.toString());
    setXMaxInput(DEFAULT_DOMAIN.xMax.toString());
    setSampleCountInput(DEFAULT_DOMAIN.sampleCount.toString());
    setActiveDomain(DEFAULT_DOMAIN);
    setDomainError(null);
    visualizerRef.current?.resetView();
  };

  // Handle Clear All Curves
  const handleClearCurves = () => {
    setCurves([
      {
        id: 'c1',
        name: 'f₁(x)',
        expression: '',
        color: '#0d9488',
        visible: true
      }
    ]);
  };

  // Evaluate all curves reactively based on activeDomain
  const evaluatedCurves: CurveData[] = useMemo(() => {
    return curves.map((c) =>
      evaluateCurve(c.id, c.name, c.expression, c.color, c.visible, activeDomain)
    );
  }, [curves, activeDomain]);

  // Aggregate statistics
  const stats = useMemo(() => {
    let totalValid = 0;
    let totalInvalid = 0;
    let globalMinY: number | null = null;
    let globalMaxY: number | null = null;

    for (const c of evaluatedCurves) {
      if (!c.visible || c.hasError) continue;
      totalValid += c.validCount;
      totalInvalid += c.invalidCount;
      if (c.minY !== null && (globalMinY === null || c.minY < globalMinY)) {
        globalMinY = c.minY;
      }
      if (c.maxY !== null && (globalMaxY === null || c.maxY > globalMaxY)) {
        globalMaxY = c.maxY;
      }
    }

    return {
      totalValid,
      totalInvalid,
      globalMinY,
      globalMaxY,
      stepSize: (activeDomain.xMax - activeDomain.xMin) / (activeDomain.sampleCount - 1)
    };
  }, [evaluatedCurves, activeDomain]);

  // CSV Export
  const handleExportCSV = () => {
    const csv = generateCSV(evaluatedCurves);
    downloadCSV(`math2code_plot_samples_${Date.now()}.csv`, csv);
  };

  // PNG Export
  const handleExportPNG = () => {
    visualizerRef.current?.downloadPNG(`math2code_plot_${Date.now()}.png`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 via-pink-600/5 to-indigo-500/10 dark:from-purple-950/40 dark:via-slate-900/60 dark:to-pink-950/30 border border-purple-500/20 dark:border-purple-500/30 p-5 sm:p-6 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-purple-500/15 via-transparent to-transparent blur-2xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-purple-500/30 shrink-0">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">
                  Numerical Plotting Engine
                </span>
                <Badge variant="purple" size="sm">Singularity Safe AST</Badge>
                <Badge variant="emerald" size="sm">HTML5 Canvas Visualizer</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Interactive Mathematical Graph Plotter
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                Safely evaluate mathematical expressions over continuous domains and render high-precision curves with interactive crosshairs and singularity detection.
              </p>
            </div>
          </div>

          {/* Global Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
            >
              Export CSV
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportPNG}
              leftIcon={<Download className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
            >
              Download PNG
            </Button>
          </div>
        </div>
      </div>

      {/* Preset Buttons Bar */}
      <div className="flex items-center gap-2 flex-wrap text-xs bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <span className="text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5 shrink-0 pl-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          Canonical Curves:
        </span>
        {FUNCTION_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelectPreset(p)}
            className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-purple-500/60 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 transition-all font-medium cursor-pointer text-xs"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Plotter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Curve Inputs & Domain Controls (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          {/* Curves Specification Card */}
          <Card>
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-500" />
                  Function Curves ({curves.length}/5)
                </CardTitle>
                <CardDescription>Mathematical expressions f(x)</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCurve}
                disabled={curves.length >= 5}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="text-xs h-7"
              >
                Add Curve
              </Button>
            </CardHeader>
            <CardContent className="space-y-3.5 p-4">
              {curves.map((curve) => {
                const evalData = evaluatedCurves.find((c) => c.id === curve.id);
                return (
                  <div
                    key={curve.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Color Selector */}
                        <input
                          type="color"
                          value={curve.color}
                          onChange={(e) => handleColorChange(curve.id, e.target.value)}
                          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                          title="Change curve line color"
                        />
                        <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {curve.name}:
                        </span>
                      </div>

                      {/* Curve Action Icons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(curve.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer"
                          title={curve.visible ? 'Hide curve from plot' : 'Show curve on plot'}
                        >
                          {curve.visible ? (
                            <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>

                        {curves.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCurve(curve.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                            title="Remove curve"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expression input */}
                    <input
                      type="text"
                      value={curve.expression}
                      onChange={(e) => handleExpressionChange(curve.id, e.target.value)}
                      placeholder="e.g. sin(x), x^2, exp(-0.5*x^2)"
                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />

                    {/* KaTeX Live Render Preview */}
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 min-h-[36px] flex items-center justify-center overflow-x-auto">
                      <MathRenderer
                        math={
                          curve.expression
                            ? `${curve.name} = ${curve.expression}`
                            : `${curve.name} = \\text{empty}`
                        }
                        displayMode={false}
                        fallbackText={`${curve.name} preview`}
                      />
                    </div>

                    {/* Error or Warning Banner */}
                    {evalData?.hasError && (
                      <div className="flex items-start gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-mono bg-rose-50/50 dark:bg-rose-950/20 p-2 rounded border border-rose-200 dark:border-rose-900/40">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{evalData.errorMessage}</span>
                      </div>
                    )}

                    {!evalData?.hasError && evalData?.warningMessage && (
                      <div className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-mono bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded border border-amber-200 dark:border-amber-900/40">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{evalData.warningMessage}</span>
                      </div>
                    )}

                    {!evalData?.hasError && evalData?.validCount !== undefined && (
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-0.5">
                        <span>Valid: {evalData.validCount}/{activeDomain.sampleCount}</span>
                        {evalData.minY !== null && evalData.maxY !== null && (
                          <span>y ∈ [{evalData.minY.toFixed(2)}, {evalData.maxY.toFixed(2)}]</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Domain & Sampling Parameters Card */}
          <Card>
            <CardHeader className="py-3 px-4">
              <div>
                <CardTitle className="text-sm">Domain & Evaluation Grid</CardTitle>
                <CardDescription>Domain boundaries and discrete sample count</CardDescription>
              </div>
              <Sliders className="w-4 h-4 text-teal-500" />
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <form onSubmit={handlePlot} className="space-y-4">
                {/* Domain Bounds: x_min and x_max */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="xmin-field" className="block text-xs font-mono font-medium text-slate-600 dark:text-slate-400 mb-1">
                      x_min:
                    </label>
                    <input
                      id="xmin-field"
                      type="number"
                      step="any"
                      value={xMinInput}
                      onChange={(e) => setXMinInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="xmax-field" className="block text-xs font-mono font-medium text-slate-600 dark:text-slate-400 mb-1">
                      x_max:
                    </label>
                    <input
                      id="xmax-field"
                      type="number"
                      step="any"
                      value={xMaxInput}
                      onChange={(e) => setXMaxInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Sampling Resolution */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="res-field" className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                      Sampling Points (N):
                    </label>
                    <span className="text-xs font-mono font-semibold text-teal-600 dark:text-teal-400">
                      {sampleCountInput} points
                    </span>
                  </div>
                  <input
                    id="res-field"
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={sampleCountInput}
                    onChange={(e) => setSampleCountInput(e.target.value)}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>50 (Fast)</span>
                    <span>500 (Standard)</span>
                    <span>2000 (Fine)</span>
                  </div>
                </div>

                {domainError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{domainError}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleResetDomain}
                      leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
                      className="text-xs"
                    >
                      Reset Domain
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearCurves}
                      className="text-xs text-rose-500 hover:text-rose-600"
                    >
                      Clear
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    leftIcon={<Play className="w-3.5 h-3.5" />}
                  >
                    Plot Curves
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Interactive Plotly Visualizer & Numerical Summary (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          {/* Chart Card */}
          <Card className="overflow-hidden">
            <CardHeader className="py-2.5 px-4 bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-200/80 dark:border-slate-800 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Domain: [{activeDomain.xMin}, {activeDomain.xMax}]
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="text-xs text-slate-500 font-mono">
                  {activeDomain.sampleCount} evaluation nodes (Δx = {stats.stepSize.toFixed(4)})
                </span>
              </div>
              <Badge variant="teal" size="sm">High-DPI Interactive</Badge>
            </CardHeader>

            <CardContent className="p-2 sm:p-4 bg-white dark:bg-slate-900">
              <PlotVisualizer
                ref={visualizerRef}
                curves={evaluatedCurves}
                domain={activeDomain}
                theme={theme}
              />
            </CardContent>
          </Card>

          {/* Numerical Summary & Singularity Card */}
          <Card>
            <CardHeader className="py-2.5 px-4">
              <div>
                <CardTitle className="text-sm">Numerical Evaluation Summary</CardTitle>
                <CardDescription>Sample point metrics and analytical bounds</CardDescription>
              </div>
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {/* Quick metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">Domain</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    [{activeDomain.xMin}, {activeDomain.xMax}]
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">Valid Samples</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.totalValid} pts
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">Undefined / Gaps</div>
                  <div className={`font-bold ${stats.totalInvalid > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                    {stats.totalInvalid} pts
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">Computed Y Bounds</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                    {stats.globalMinY !== null && stats.globalMaxY !== null
                      ? `[${stats.globalMinY.toFixed(2)}, ${stats.globalMaxY.toFixed(2)}]`
                      : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Scientific Disclaimer & Rigor Note */}
              <div className="p-3 rounded-lg bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <Info className="w-3.5 h-3.5 text-teal-500" />
                  <span>Mathematical Approximation Note</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  Plotted curves approximate continuous mathematical functions by discrete sampling at {activeDomain.sampleCount} uniformly spaced coordinates. Discontinuities and singularities (such as logarithms of non-positive numbers, square roots of negatives, or division by zero) are safely detected and rendered as disconnected curve gaps rather than interpolating across asymptotes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
