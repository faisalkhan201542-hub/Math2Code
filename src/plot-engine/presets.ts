export interface FunctionPreset {
  id: string;
  name: string;
  category: 'Polynomial' | 'Trigonometric' | 'Transcendental' | 'Probability & ML' | 'Oscillation';
  expression: string;
  xMin: number;
  xMax: number;
  sampleCount: number;
  description: string;
  latex: string;
}

export const FUNCTION_PRESETS: FunctionPreset[] = [
  {
    id: 'linear',
    name: 'Linear Function',
    category: 'Polynomial',
    expression: '2 * x - 1',
    xMin: -5,
    xMax: 5,
    sampleCount: 200,
    description: 'First-degree polynomial representing a straight line with constant slope.',
    latex: 'f(x) = 2x - 1'
  },
  {
    id: 'quadratic',
    name: 'Quadratic Parabola',
    category: 'Polynomial',
    expression: 'x^2 - 4',
    xMin: -4,
    xMax: 4,
    sampleCount: 300,
    description: 'Second-degree polynomial with vertex at (0, -4) and roots at x = ±2.',
    latex: 'f(x) = x^2 - 4'
  },
  {
    id: 'cubic',
    name: 'Cubic Inflection Curve',
    category: 'Polynomial',
    expression: 'x^3 - 3 * x',
    xMin: -3,
    xMax: 3,
    sampleCount: 400,
    description: 'Third-degree polynomial with local maximum at x = -1, local minimum at x = 1, and inflection at origin.',
    latex: 'f(x) = x^3 - 3x'
  },
  {
    id: 'sine',
    name: 'Sine Wave',
    category: 'Trigonometric',
    expression: 'sin(x)',
    xMin: -6.28318,
    xMax: 6.28318,
    sampleCount: 500,
    description: 'Fundamental harmonic oscillation over two periods [-2π, 2π].',
    latex: 'f(x) = \\sin(x)'
  },
  {
    id: 'cosine',
    name: 'Cosine Wave',
    category: 'Trigonometric',
    expression: 'cos(x)',
    xMin: -6.28318,
    xMax: 6.28318,
    sampleCount: 500,
    description: 'Phase-shifted harmonic wave with even symmetry over [-2π, 2π].',
    latex: 'f(x) = \\cos(x)'
  },
  {
    id: 'sigmoid',
    name: 'Sigmoidal Logistic Curve',
    category: 'Probability & ML',
    expression: '1 / (1 + exp(-x))',
    xMin: -6,
    xMax: 6,
    sampleCount: 400,
    description: 'S-shaped smooth activation mapping real numbers to probabilities in (0, 1).',
    latex: '\\sigma(x) = \\frac{1}{1 + e^{-x}}'
  },
  {
    id: 'gaussian',
    name: 'Gaussian Normal Density (Standard)',
    category: 'Probability & ML',
    expression: '(1 / sqrt(2 * pi)) * exp(-0.5 * x^2)',
    xMin: -4,
    xMax: 4,
    sampleCount: 500,
    description: 'Standard normal probability density function with mean μ = 0 and variance σ² = 1.',
    latex: 'f(x) = \\frac{1}{\\sqrt{2\\pi}} e^{-\\frac{1}{2}x^2}'
  },
  {
    id: 'damped_oscillator',
    name: 'Damped Harmonic Oscillator',
    category: 'Oscillation',
    expression: 'exp(-0.3 * x) * sin(2 * pi * x)',
    xMin: 0,
    xMax: 8,
    sampleCount: 600,
    description: 'Decaying sinusoidal vibration common in classical mechanics and circuits.',
    latex: 'f(x) = e^{-0.3x} \\sin(2\\pi x)'
  },
  {
    id: 'exponential',
    name: 'Natural Exponential',
    category: 'Transcendental',
    expression: 'exp(x)',
    xMin: -3,
    xMax: 3,
    sampleCount: 300,
    description: 'Eulerian exponential function growing proportionally to its value.',
    latex: 'f(x) = e^x'
  },
  {
    id: 'logarithm',
    name: 'Natural Logarithm (Singular at x=0)',
    category: 'Transcendental',
    expression: 'log(x)',
    xMin: 0.05,
    xMax: 10,
    sampleCount: 400,
    description: 'Inverse of exponential function, demonstrating singularity and non-positive domain handling.',
    latex: 'f(x) = \\ln(x)'
  },
  {
    id: 'square_root',
    name: 'Square Root (Domain x ≥ 0)',
    category: 'Transcendental',
    expression: 'sqrt(x)',
    xMin: 0,
    xMax: 16,
    sampleCount: 300,
    description: 'Radical function undefined for negative x in real numbers.',
    latex: 'f(x) = \\sqrt{x}'
  }
];
