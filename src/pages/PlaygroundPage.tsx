import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  RotateCcw,
  Zap,
  Code2,
  Cpu,
  BookOpen,
  Sigma,
  Terminal,
  GraduationCap,
  LineChart
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PythonTerminal } from '../components/ui/PythonTerminal';
import { MathRenderer } from '../components/math/MathRenderer';
import {
  MathematicalResultView,
  type PresetMathMetadata
} from '../components/math/MathematicalResultView';
import {
  pyodideService,
  type ExecutionResult,
  type PyodideStatus
} from '../services/pyodideService';

interface CodePreset extends PresetMathMetadata {
  code: string;
  description: string;
}

const PRESET_PROGRAMS: CodePreset[] = [
  {
    id: 'matrix-multiplication',
    name: 'Matrix Multiplication (2x3 @ 3x2)',
    category: 'Linear Algebra',
    description: 'Inner product summation over shared dimension k producing a 2x2 matrix',
    latex: '\\mathbf{C} = \\mathbf{A}\\mathbf{B}, \\quad C_{i,j} = \\sum_{k=1}^{m} A_{i,k} \\cdot B_{k,j}',
    dimensions: '\\mathbf{A} \\in \\mathbb{R}^{2 \\times 3}, \\quad \\mathbf{B} \\in \\mathbb{R}^{3 \\times 2} \\implies \\mathbf{C} \\in \\mathbb{R}^{2 \\times 2}',
    mathExplanation: 'Matrix multiplication performs an inner product between each row vector of A and column vector of B. Dimension matching condition: columns of A (3) equal rows of B (3).',
    derivationRoute: '/derivation/matrix_multiplication',
    equationRoute: '/equation-to-code?latex=C%20%3D%20AB%20%5Cquad%20C_%7Bij%7D%20%3D%20%5Csum_%7Bk%3D1%7D%5Em%20A_%7Bik%7D%20B_%7Bkj%7D',
    properties: [
      { label: 'Dimension Check', value: '(2 \\times 3) \\times (3 \\times 2) \\to (2 \\times 2)', badge: 'Conforming' },
      { label: 'Determinant', value: '\\det(\\mathbf{C}) = 90.0 \\neq 0', badge: 'Invertible' },
      { label: 'Rank', value: '\\text{rank}(\\mathbf{C}) = 2', badge: 'Full Rank' },
      { label: 'Commutativity', value: '\\mathbf{A}\\mathbf{B} \\neq \\mathbf{B}\\mathbf{A}', badge: 'Non-Abelian' }
    ],
    resultLatex: '\\begin{aligned} \\mathbf{A} &= \\begin{bmatrix} 1.0 & 2.0 & 3.0 \\\\ 4.0 & 5.0 & 6.0 \\end{bmatrix}_{2 \\times 3}, \\quad \\mathbf{B} = \\begin{bmatrix} 7.0 & 8.0 \\\\ 9.0 & 1.0 \\\\ 2.0 & 3.0 \\end{bmatrix}_{3 \\times 2} \\\\[6pt] \\mathbf{C} &= \\mathbf{A}\\mathbf{B} = \\begin{bmatrix} 31.0 & 19.0 \\\\ 85.0 & 55.0 \\end{bmatrix}_{2 \\times 2} \\end{aligned}',
    stepCalculations: [
      { step: 'C_{1,1}', description: 'Row 1 · Col 1', latex: '1(7) + 2(9) + 3(2) = 31.0' },
      { step: 'C_{1,2}', description: 'Row 1 · Col 2', latex: '1(8) + 2(1) + 3(3) = 19.0' },
      { step: 'C_{2,1}', description: 'Row 2 · Col 1', latex: '4(7) + 5(9) + 6(2) = 85.0' },
      { step: 'C_{2,2}', description: 'Row 2 · Col 2', latex: '4(8) + 5(1) + 6(3) = 55.0' }
    ],
    code: `import numpy as np

# Define matrices A and B
A = np.array([[1.0, 2.0, 3.0],
              [4.0, 5.0, 6.0]])

B = np.array([[7.0, 8.0],
              [9.0, 1.0],
              [2.0, 3.0]])

# Perform matrix multiplication C = A @ B
C = np.matmul(A, B)

print("Matrix A (2x3):")
print(A)
print("\\nMatrix B (3x2):")
print(B)
print("\\nResult Matrix C (2x2):")
print(C)
`
  },
  {
    id: 'sigmoid-benchmark',
    name: 'Sigmoidal Logistic Activation',
    category: 'Machine Learning',
    description: 'Vectorized evaluation over floating-point array with IEEE overflow prevention',
    latex: '\\sigma(z) = \\frac{1}{1 + e^{-z}} = \\frac{e^z}{e^z + 1}',
    dimensions: 'z \\in \\mathbb{R} \\implies \\sigma(z) \\in (0, 1)',
    mathExplanation: 'Logistic sigmoid activation mapping any real value to the bounded open unit interval (0, 1). First derivative satisfies: \\sigma\'(z) = \\sigma(z)(1 - \\sigma(z)).',
    derivationRoute: '/derivation/sigmoid',
    equationRoute: '/equation-to-code?latex=%5Csigma(z)%20%3D%20%5Cfrac%7B1%7D%7B1%20%2B%20e%5E%7B-z%7D%7D',
    plotterExpression: '1 / (1 + exp(-x))',
    properties: [
      { label: 'Inflection Center', value: '\\sigma(0.0) = 0.5000', badge: 'Symmetric' },
      { label: 'Range Bounds', value: '0 < \\sigma(z) < 1', badge: 'Bounded' },
      { label: 'First Derivative', value: '\\sigma\'(z) = \\sigma(z)(1 - \\sigma(z))', badge: 'Autonomous' },
      { label: 'Limits', value: '\\lim_{z \\to \\infty} = 1, \\; \\lim_{z \\to -\\infty} = 0', badge: 'Monotonic' }
    ],
    resultLatex: '\\sigma(-10.0) = 0.000045, \\quad \\sigma(0.0) = 0.500000, \\quad \\sigma(+10.0) = 0.999955',
    stepCalculations: [
      { step: '\\sigma(-10.0)', description: 'Saturation (-)', latex: '\\frac{1}{1 + e^{10}} \\approx 0.0000454' },
      { step: '\\sigma(0.0)', description: 'Inflection Center', latex: '\\frac{1}{1 + e^0} = \\frac{1}{2} = 0.5000' },
      { step: '\\sigma(+2.0)', description: 'Positive Value', latex: '\\frac{1}{1 + e^{-2}} \\approx 0.880797' },
      { step: '\\sigma(+10.0)', description: 'Saturation (+)', latex: '\\frac{1}{1 + e^{-10}} \\approx 0.999955' }
    ],
    code: `import numpy as np
import time

def sigmoid(z: np.ndarray | float) -> np.ndarray:
    """Numerically stable logistic sigmoid activation function."""
    z_arr = np.asarray(z, dtype=float)
    pos_mask = (z_arr >= 0)
    result = np.empty_like(z_arr, dtype=float)
    result[pos_mask] = 1.0 / (1.0 + np.exp(-z_arr[pos_mask]))
    exp_z = np.exp(z_arr[~pos_mask])
    result[~pos_mask] = exp_z / (1.0 + exp_z)
    return result

# Test over 100,000 values directly in browser WebAssembly
test_inputs = np.linspace(-10.0, 10.0, 100_000)
t0 = time.perf_counter()
activations = sigmoid(test_inputs)
t1 = time.perf_counter()

print("Array size:          ", f"{len(test_inputs):,} elements")
print("Min activation:      ", f"{activations[0]:.8f}")
print("Midpoint sigma(0):   ", f"{sigmoid(0.0):.4f}")
print("Max activation:      ", f"{activations[-1]:.8f}")
print("NumPy Vectorized Time:", f"{(t1 - t0)*1000:.3f} ms")
`
  },
  {
    id: 'softmax-distribution',
    name: 'Softmax Probability Distribution',
    category: 'Deep Learning',
    description: 'Shift-invariant categorical probability vector with max-logit subtraction',
    latex: '\\text{Softmax}(\\mathbf{z})_i = \\frac{e^{z_i - \\max(\\mathbf{z})}}{\\sum_{j=1}^{K} e^{z_j - \\max(\\mathbf{z})}}',
    dimensions: '\\mathbf{z} \\in \\mathbb{R}^K \\implies \\mathbf{p} \\in \\Delta^{K-1}, \\quad \\sum_{i=1}^K p_i = 1',
    mathExplanation: 'Converts a vector of arbitrary real logits into a normalized categorical probability distribution that strictly sums to 1.0.',
    derivationRoute: '/derivation/softmax',
    equationRoute: '/equation-to-code?latex=%5Csigma(%5Cmathbf%7Bz%7D)_i%20%3D%20%5Cfrac%7Be%5E%7Bz_i%7D%7D%7B%5Csum_j%20e%5E%7Bz_j%7D%7D',
    properties: [
      { label: 'Shift Invariance', value: '\\text{Softmax}(\\mathbf{z} - c) = \\text{Softmax}(\\mathbf{z})', badge: 'Stable' },
      { label: 'Sum to Unity', value: '\\sum_{i=0}^4 p_i = 1.00000000', badge: 'Normalized' },
      { label: 'Dominant Class', value: '\\text{argmax}(\\mathbf{p}) = \\text{Class 4 } (p=0.7619)', badge: 'Mode' },
      { label: 'Entropy', value: 'H(\\mathbf{p}) = 0.7711 \\text{ nats}', badge: 'Dispersion' }
    ],
    resultLatex: '\\begin{aligned} \\mathbf{z} &= [2.5, \\, 1.0, \\, 0.2, \\, -1.5, \\, 3.8] \\\\[4pt] \\mathbf{p} &= [0.2072, \\, 0.0463, \\, 0.0208, \\, 0.0038, \\, 0.7619]^T \\end{aligned}',
    stepCalculations: [
      { step: 'p_0', description: 'Class 0 (z=2.5)', latex: '\\frac{e^{2.5-3.8}}{\\sum e^{\\Delta z}} = 0.2072' },
      { step: 'p_1', description: 'Class 1 (z=1.0)', latex: '\\frac{e^{1.0-3.8}}{\\sum e^{\\Delta z}} = 0.0463' },
      { step: 'p_2', description: 'Class 2 (z=0.2)', latex: '\\frac{e^{0.2-3.8}}{\\sum e^{\\Delta z}} = 0.0208' },
      { step: 'p_4', description: 'Dominant Argmax', latex: '\\frac{e^{3.8-3.8}}{\\sum e^{\\Delta z}} = 0.7619' }
    ],
    code: `import numpy as np

def softmax(logits: np.ndarray) -> np.ndarray:
    """Compute stabilized categorical softmax probabilities."""
    shift_z = logits - np.max(logits, axis=-1, keepdims=True)
    exp_z = np.exp(shift_z)
    return exp_z / np.sum(exp_z, axis=-1, keepdims=True)

# 5-class classification logits
sample_logits = np.array([2.5, 1.0, 0.2, -1.5, 3.8])
probs = softmax(sample_logits)

print("Input Logits:       ", sample_logits)
print("Softmax Probabilities:")
for idx, p in enumerate(probs):
    bar = "█" * int(p * 30)
    print(f"  Class {idx}: {p:.4f}  {bar}")

print("Total Sum:          ", np.sum(probs))
assert np.isclose(np.sum(probs), 1.0), "Probabilities must sum to 1.0!"
`
  },
  {
    id: 'mse-mae-comparison',
    name: 'MSE vs MAE Loss Comparison',
    category: 'Statistics',
    description: 'Quadratic residual penalty vs Linear absolute residual penalty',
    latex: '\\text{MSE} = \\frac{1}{n}\\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2, \\quad \\text{MAE} = \\frac{1}{n}\\sum_{i=1}^{n} |y_i - \\hat{y}_i|',
    dimensions: '\\mathbf{y}, \\hat{\\mathbf{y}} \\in \\mathbb{R}^4 \\implies \\mathcal{L}_{\\text{MSE}}, \\mathcal{L}_{\\text{MAE}} \\in [0, \\infty)',
    mathExplanation: 'MSE penalizes large outliers quadratically (L2 norm), whereas MAE provides linear robust penalization (L1 norm).',
    derivationRoute: '/derivation/mean_squared_error',
    properties: [
      { label: 'Residual Vector', value: '\\mathbf{e} = [0.5, -0.5, 0.0, -1.0]', badge: 'Residuals' },
      { label: 'MSE Loss (L2)', value: '\\text{MSE} = 0.375000', badge: 'Quadratic' },
      { label: 'MAE Loss (L1)', value: '\\text{MAE} = 0.500000', badge: 'Linear' },
      { label: 'Differentiability', value: '\\nabla_{\\hat{y}} \\text{MSE} = -\\frac{2}{n}(y - \\hat{y})', badge: 'Smooth' }
    ],
    resultLatex: '\\begin{aligned} \\mathbf{e} &= \\mathbf{y} - \\hat{\\mathbf{y}} = [0.5, \\, -0.5, \\, 0.0, \\, -1.0] \\\\[4pt] \\text{MSE} &= 0.3750, \\quad \\text{MAE} = 0.5000 \\end{aligned}',
    stepCalculations: [
      { step: 'e_1', description: '3.0 - 2.5', latex: '0.5 \\implies e_1^2 = 0.25' },
      { step: 'e_2', description: '-0.5 - 0.0', latex: '-0.5 \\implies e_2^2 = 0.25' },
      { step: 'e_4', description: '7.0 - 8.0', latex: '-1.0 \\implies e_4^2 = 1.00' },
      { step: '\\text{Loss}', description: 'Averaging Errors', latex: '\\text{MSE} = 0.375, \\; \\text{MAE} = 0.500' }
    ],
    code: `import numpy as np

y_true = np.array([3.0, -0.5, 2.0, 7.0])
y_pred = np.array([2.5,  0.0, 2.0, 8.0])

residuals = y_true - y_pred
mse = np.mean(residuals ** 2)
mae = np.mean(np.abs(residuals))

print("Ground Truth (y):    ", y_true)
print("Predictions (y_hat): ", y_pred)
print("Residuals:           ", residuals)
print("------------------------------------------")
print("Mean Squared Error (MSE): ", f"{mse:.6f}")
print("Mean Absolute Error (MAE):", f"{mae:.6f}")
`
  },
  {
    id: 'gradient-descent',
    name: 'Gradient Descent Optimization Loop',
    category: 'Optimization',
    description: 'Iterative steepest descent parameter updates for f(θ) = θ²',
    latex: '\\theta_{t+1} = \\theta_t - \\alpha \\nabla_\\theta \\mathcal{L}(\\theta_t), \\quad \\mathcal{L}(\\theta) = \\theta^2, \\quad \\nabla_\\theta \\mathcal{L} = 2\\theta',
    dimensions: '\\theta \\in \\mathbb{R}, \\quad \\alpha = 0.1 \\implies \\theta^* = 0.0',
    mathExplanation: 'Iterative first-order optimization method for finding local minima of differentiable functions by following the negative gradient direction.',
    derivationRoute: '/derivation/gradient_descent',
    plotterExpression: 'x^2',
    properties: [
      { label: 'Learning Rate', value: '\\alpha = 0.1', badge: 'Step Size' },
      { label: 'Loss Objective', value: '\\mathcal{L}(\\theta) = \\theta^2', badge: 'Convex' },
      { label: 'Analytical Minimum', value: '\\theta^* = 0.0, \\; \\mathcal{L}^* = 0.0', badge: 'Global Min' },
      { label: 'Contraction Factor', value: '1 - 2\\alpha = 0.8', badge: 'Linear Rate' }
    ],
    resultLatex: '\\begin{aligned} \\theta_0 &= 10.0 \\xrightarrow{\\text{Step 1}} \\theta_1 = 8.0 \\xrightarrow{\\text{Step 5}} \\theta_5 = 3.28 \\\\[4pt] &\\xrightarrow{\\text{Step 15}} \\theta_{15} = 0.35 \\implies \\lim_{t \\to \\infty} \\theta_t = 0.0 \\end{aligned}',
    stepCalculations: [
      { step: '\\theta_1', description: 'Step 1 (θ_0 = 10)', latex: '10 - 0.1(20) = 8.0 \\implies \\mathcal{L}=64.0' },
      { step: '\\theta_2', description: 'Step 2 (θ_1 = 8.0)', latex: '8.0 - 0.1(16) = 6.4 \\implies \\mathcal{L}=40.96' },
      { step: '\\theta_5', description: 'Step 5 (Geometric)', latex: '10(0.8)^5 = 3.2768 \\implies \\mathcal{L}=10.74' },
      { step: '\\theta_{15}', description: 'Step 15 (Near Minimum)', latex: '10(0.8)^{15} = 0.3518 \\implies \\mathcal{L}=0.124' }
    ],
    code: `import numpy as np

# Minimize J(θ) = θ² with gradient dJ/dθ = 2θ
theta = 10.0
learning_rate = 0.1
history = []

for step in range(1, 16):
    grad = 2.0 * theta
    theta = theta - learning_rate * grad
    loss = theta ** 2
    history.append((step, theta, loss))
    if step in [1, 2, 3, 5, 10, 15]:
        print(f"Step {step:2d}: θ = {theta:8.5f} | Loss = {loss:10.6f}")

print(f"\\nFinal converged θ: {theta:.8f}")
`
  }
];

export const PlaygroundPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_PROGRAMS[0].id);
  const [code, setCode] = useState(PRESET_PROGRAMS[0].code);
  const [outputTab, setOutputTab] = useState<'math' | 'terminal'>('math');

  // Pyodide Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [pyodideStatus, setPyodideStatus] = useState<PyodideStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('Pyodide WASM Engine Ready');

  const activePreset = useMemo(() => {
    return PRESET_PROGRAMS.find((p) => p.id === selectedPresetId) || PRESET_PROGRAMS[0];
  }, [selectedPresetId]);

  React.useEffect(() => {
    const unsub = pyodideService.subscribe((status, msg) => {
      setPyodideStatus(status);
      if (msg) setStatusMessage(msg);
    });
    return unsub;
  }, []);

  const handleSelectPreset = (preset: CodePreset) => {
    setSelectedPresetId(preset.id);
    setCode(preset.code);
    setExecutionResult(null);
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    try {
      const result = await pyodideService.runPython(code);
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
  };

  const handleResetCode = () => {
    const current = PRESET_PROGRAMS.find((p) => p.id === selectedPresetId);
    if (current) {
      setCode(current.code);
      setExecutionResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/10 via-teal-500/5 to-indigo-500/10 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 border border-cyan-500/20 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-cyan-500/15 via-transparent to-transparent blur-2xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
                  Client-Side Runtime
                </span>
                <Badge variant="teal" size="sm">
                  In-Browser WebAssembly
                </Badge>
                <Badge variant="emerald" size="sm">
                  Zero Backend Server
                </Badge>
                <Badge variant="blue" size="sm">CPython 3.12</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Live Python Playground (Pyodide REPL)
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Run authentic CPython 3.12 and NumPy calculations directly inside your browser.
                Benchmark vector speeds, modify equations, and inspect printed terminal outputs in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleRunCode}
              isLoading={isRunning}
              leftIcon={<Play className="w-4 h-4 fill-white" />}
              className="bg-emerald-600 hover:bg-emerald-500 shadow-md font-semibold cursor-pointer"
            >
              Run Script (Ctrl+Enter)
            </Button>
          </div>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1 mr-1">
          <Sigma className="w-3.5 h-3.5 text-teal-500" />
          Mathematical Presets:
        </span>
        {PRESET_PROGRAMS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedPresetId === preset.id
                ? 'bg-teal-600 text-white shadow-xs font-semibold ring-2 ring-teal-500/40'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-400'
            }`}
          >
            <span>{preset.name}</span>
            <span className="text-[10px] opacity-75">({preset.category})</span>
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Mathematical Context Banner & Code Editor (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active Mathematical Formula Bar */}
          <div className="p-4 rounded-xl border border-teal-500/20 dark:border-teal-500/30 bg-teal-50/50 dark:bg-slate-900/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-200">
                  {activePreset.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {activePreset.derivationRoute && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(activePreset.derivationRoute!)}
                    className="text-[11px] h-6 px-2 text-indigo-600 dark:text-indigo-400"
                    leftIcon={<GraduationCap className="w-3 h-3" />}
                  >
                    Proof
                  </Button>
                )}
                {activePreset.plotterExpression && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/graph-plotter?f=${encodeURIComponent(activePreset.plotterExpression!)}`)}
                    className="text-[11px] h-6 px-2 text-cyan-600 dark:text-cyan-400"
                    leftIcon={<LineChart className="w-3 h-3" />}
                  >
                    Plot
                  </Button>
                )}
              </div>
            </div>

            <div className="py-2.5 px-3 rounded-lg bg-white/90 dark:bg-slate-950/60 border border-teal-500/20 text-center overflow-x-auto">
              <MathRenderer math={activePreset.latex} displayMode={true} />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="font-mono text-[11px] text-teal-700 dark:text-teal-300">
                <MathRenderer math={activePreset.dimensions} />
              </span>
              <span className="text-[11px] text-slate-500 truncate max-w-[280px]">
                {activePreset.mathExplanation}
              </span>
            </div>
          </div>

          {/* Interactive Code Editor Card */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-teal-500" />
                  Python 3.12 Script Editor
                </CardTitle>
                <CardDescription className="mt-0.5">
                  Full syntax editable. Tweak values, change dimensions, or benchmark vector operations.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetCode}
                  className="text-xs h-7 px-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  leftIcon={<RotateCcw className="w-3 h-3" />}
                  title="Reset code to original preset"
                >
                  Reset Code
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault();
                      handleRunCode();
                    }
                  }}
                  rows={14}
                  spellCheck={false}
                  className="w-full p-4 bg-slate-950 text-slate-100 font-mono text-xs leading-6 resize-y focus:outline-hidden border-t border-slate-800"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Dual Tab Output (Mathematical Result vs Terminal) (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Dual Mode Tab Selector */}
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-1 w-full">
              <button
                type="button"
                onClick={() => setOutputTab('math')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  outputTab === 'math'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sigma className="w-3.5 h-3.5 text-teal-500" />
                <span>Mathematical Result (KaTeX)</span>
                {executionResult && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setOutputTab('terminal')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  outputTab === 'terminal'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-teal-500" />
                <span>Python Terminal Output</span>
                {executionResult && (
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono ml-1">
                    ({executionResult.executionTimeMs} ms)
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tab 1: Mathematical View */}
          {outputTab === 'math' ? (
            <MathematicalResultView
              preset={activePreset}
              executionResult={executionResult}
              isRunning={isRunning}
              onRun={handleRunCode}
            />
          ) : (
            /* Tab 2: Terminal View */
            <PythonTerminal
              executionResult={executionResult}
              isRunning={isRunning}
              status={pyodideStatus}
              statusMessage={statusMessage}
              onRun={handleRunCode}
              onClear={() => setExecutionResult(null)}
              title="Pyodide Live Output Terminal"
            />
          )}

          {/* Performance & WASM Metrics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                WebAssembly Performance Specs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] uppercase font-semibold text-slate-500">Python Version</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">CPython 3.12 (WASM)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] uppercase font-semibold text-slate-500">Core Package</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">NumPy 1.26.4</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] uppercase font-semibold text-slate-500">Architecture</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Client-Side Thread</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] uppercase font-semibold text-slate-500">Network Dependency</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">0 KB per Run</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 text-indigo-900 dark:text-indigo-200 text-xs flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <p>
                  All 26 mathematical equations in Math2Code generate vectorized NumPy code that can be run directly here or from any Code Panel across the app.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
