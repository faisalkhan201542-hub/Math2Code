import type { PatternDerivation } from '../types';

export const reluDerivation: PatternDerivation = {
  id: 'relu',
  pattern: 'relu',
  title: 'Rectified Linear Unit (ReLU) Activation',
  subtitle: 'Piecewise Linear Threshold Activation Mitigating Vanishing Gradients',
  category: 'Deep Learning',
  catalogueId: 'relu-activation',
  plottableExpr: '0.5 * (x + abs(x))',
  difficulty: 'Foundational',
  tags: ['deep-learning', 'activations', 'relu', 'piecewise-linear', 'neural-networks'],
  isEngineSupported: false,
  summary:
    'The Rectified Linear Unit (ReLU) applies a piecewise linear ramp function that outputs the input directly if positive, and zero otherwise. It resolves the vanishing gradient problem in deep neural networks and promotes sparse representations.',
  canonicalFormulaLatex: '\\operatorname{ReLU}(x) = \\max(0, x) = \\begin{cases} x & \\text{if } x > 0 \\\\ 0 & \\text{if } x \\le 0 \\end{cases}',
  targetWhatItCalculates:
    'Applies non-linear rectification to scalar, vector, or tensor inputs x in R, zeroing negative values while passing positive values with constant unity gradient.',
  symbols: [
    {
      symbol: 'x',
      name: 'Input Activation / Pre-activation Logit',
      mathDomain: 'x \\in \\mathbb{R}',
      role: 'Weighted linear combination z = w^T x + b passed into the activation.'
    },
    {
      symbol: '\\operatorname{ReLU}(x)',
      name: 'Rectified Output',
      mathDomain: '\\operatorname{ReLU}(x) \\in [0, \\infty)',
      role: 'Post-activation signal passed forward to the next network layer.'
    },
    {
      symbol: '\\frac{d}{dx}\\operatorname{ReLU}(x)',
      name: 'Subgradient / Derivative',
      mathDomain: '\\begin{cases} 1 & x > 0 \\\\ 0 & x < 0 \\\\ [0, 1] & x = 0 \\end{cases}',
      role: 'Gradient propagated backward during backpropagation (standard implementation convention assigns 0 at x = 0).'
    }
  ],
  assumptions: [
    'Domain is all real numbers x in (-infinity, +infinity).',
    'Piecewise continuous and convex, but not differentiable at the corner point x = 0.',
    'At x = 0, the generalized subdifferential is the set [0, 1]; deep learning frameworks standardly choose subgradient 0 at x = 0.'
  ],
  steps: [
    {
      id: 'step-1-piecewise-partition',
      stepNumber: 1,
      title: 'Partition the Domain by Sign of Input',
      latex: '\\mathbb{R} = (-\\infty, 0) \\cup \\{0\\} \\cup (0, \\infty)',
      explanation:
        'The input domain is partitioned into strictly negative, zero, and strictly positive regions. Rectification treats positive signals as active information while extinguishing inhibitory negative signals.',
      pythonSnippet: 'is_positive = x > 0',
      pythonExplanation: 'Boolean mask identifying active positive neurons.',
      keyTakeaway: 'The function divides the input space into active and inactive regimes.'
    },
    {
      id: 'step-2-threshold-application',
      stepNumber: 2,
      title: 'Apply Piecewise Max Operator',
      latex: 'y = \\max(0, x) = \\frac{x + |x|}{2}',
      explanation:
        'For x > 0, |x| = x, so (x + x)/2 = x. For x < 0, |x| = -x, so (x - x)/2 = 0. For x = 0, both yield 0. This single algebraic identity matches max(0, x) everywhere on the real line.',
      pythonSnippet: 'rectified = np.maximum(0.0, x)',
      pythonExplanation: 'Element-wise maximum against scalar 0.',
      keyTakeaway: 'Extremely efficient to compute; avoids transcendental exp() evaluations.'
    },
    {
      id: 'step-3-derivative-subgradient',
      stepNumber: 3,
      title: 'Compute Subgradient for Backpropagation',
      latex: '\\frac{dy}{dx} = \\begin{cases} 1 & \\text{if } x > 0 \\\\ 0 & \\text{if } x \\le 0 \\end{cases}',
      explanation:
        'For positive inputs, the derivative is strictly 1 (no saturation, solving vanishing gradients). For negative inputs, the derivative is 0. At exactly x = 0, the function is non-differentiable; standard autograd frameworks use subgradient 0 (or right-derivative 1).',
      pythonSnippet: 'grad = (x > 0).astype(float)',
      pythonExplanation: 'Gradient is 1 for positive inputs and 0 for non-positive inputs.',
      keyTakeaway: 'Non-saturating derivative of 1 prevents gradients from vanishing as network depth increases.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Batch ReLU Evaluation',
    description: 'Evaluate ReLU on a representative batch containing negative, zero, and positive inputs.',
    inputs: [
      {
        name: 'x',
        value: '[-3.5, 0.0, 2.8, -0.2, 5.1]',
        representation: '\\mathbf{x} = [-3.5, \\, 0.0, \\, 2.8, \\, -0.2, \\, 5.1]'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Evaluate Negative Term x_1 = -3.5',
        computation: '\\max(0, -3.5) = 0.0',
        result: '0.0'
      },
      {
        step: 'Evaluate Boundary Term x_2 = 0.0',
        computation: '\\max(0, 0.0) = 0.0',
        result: '0.0'
      },
      {
        step: 'Evaluate Positive Term x_3 = 2.8',
        computation: '\\max(0, 2.8) = 2.8',
        result: '2.8'
      },
      {
        step: 'Evaluate Small Negative x_4 = -0.2',
        computation: '\\max(0, -0.2) = 0.0',
        result: '0.0'
      },
      {
        step: 'Evaluate Large Positive x_5 = 5.1',
        computation: '\\max(0, 5.1) = 5.1',
        result: '5.1'
      }
    ],
    finalOutput: {
      name: 'ReLU(x)',
      value: '[0.0, 0.0, 2.8, 0.0, 5.1]',
      interpretation: 'Outputs retain original positive values and squash all negative signals to 0.'
    },
    verifiedNote: 'Verified element-wise against np.maximum(0.0, x).'
  },
  commonMistakes: [
    'Dying ReLU problem: large negative bias updates can cause neurons to output 0 for all dataset samples, producing zero gradients forever (remedied by Leaky ReLU, ELU, or careful weight initialization like He/Kaiming).',
    'Claiming ordinary differentiability at zero: ReLU is mathematically non-differentiable at x=0; autograd engines implement a subgradient.',
    'Unbounded activation range: ReLU outputs are in [0, inf), requiring normalization techniques like Batch Normalization or Layer Normalization to avoid exploding activations.'
  ],
  numericalStabilityNotes: [
    'No transcendental operations; immune to floating-point underflow/overflow during forward evaluation.',
    'Because output is unbounded for x > 0, weights must be initialized with He/Kaiming normal scaling sqrt(2/fan_in) to prevent exploding activations.'
  ],
  limitations: [
    'Zero gradient for all negative inputs (inactive neurons cannot recover if constantly negative).',
    'Not zero-centered: mean activation is always positive, which can introduce bias drift in subsequent layers.'
  ]
};
