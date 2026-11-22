import type { PatternDerivation } from '../types';

export const sigmoidDerivation: PatternDerivation = {
  id: 'sigmoid',
  pattern: 'sigmoid',
  title: 'Sigmoidal Logistic Activation',
  subtitle: 'Smooth S-Curve Squashing Function Mapping Real Logits to Probabilities',
  category: 'Machine Learning',
  catalogueId: 'logistic-sigmoid',
  isEngineSupported: true,
  plottableExpr: '1 / (1 + exp(-x))',
  difficulty: 'Foundational',
  tags: ['machine learning', 'activations', 'sigmoid', 'logistic', 'probability'],
  summary:
    'The logistic sigmoid function squashes any real-valued input from negative to positive infinity into a strictly bounded probability interval between 0 and 1.',
  canonicalFormulaLatex: '\\sigma(z) = \\frac{1}{1 + e^{-z}} = \\frac{e^z}{1 + e^z}',
  targetWhatItCalculates:
    'Converts continuous linear logits z in (-inf, inf) into calibrated probabilities sigma(z) in (0, 1) for binary classification and neural activations.',
  symbols: [
    {
      symbol: 'z',
      name: 'Input Logit',
      mathDomain: 'z \\in \\mathbb{R}',
      role: 'Real scalar, vector, or tensor log-odds input score.'
    },
    {
      symbol: 'e',
      name: "Euler's Number",
      mathDomain: 'e \\approx 2.718281828459',
      role: 'Mathematical constant serving as base of natural logarithms.'
    },
    {
      symbol: '\\sigma(z)',
      name: 'Sigmoid Probability Output',
      mathDomain: '\\sigma(z) \\in (0, 1)',
      role: 'Smoothly squashed activation score interpreted as posterior probability P(Y=1|z).'
    }
  ],
  assumptions: [
    'Input z is defined for all real numbers from -infinity to +infinity.',
    'Monotonically increasing: z_1 < z_2 implies sigma(z_1) < sigma(z_2).',
    'Symmetric around the origin: sigma(0) = 0.5, and sigma(-z) = 1 - sigma(z).'
  ],
  steps: [
    {
      id: 'step-1-negation-and-exp',
      stepNumber: 1,
      title: 'Negate Input and Compute Exponential Decay',
      latex: 'z \\mapsto -z \\implies E = e^{-z} > 0',
      explanation:
        'When z is large and positive, -z is large and negative, so e^(-z) asymptotically approaches 0. When z is large and negative, -z is large and positive, so e^(-z) grows exponentially toward infinity.',
      pythonSnippet: 'exp_neg_z = np.exp(-z)',
      pythonExplanation: 'Computes base-e exponential of negated input.',
      keyTakeaway: 'Inverts the sign of z so positive inputs suppress the denominator.'
    },
    {
      id: 'step-2-add-one',
      stepNumber: 2,
      title: 'Shift Denominator to Bound Away from Zero',
      latex: 'D = 1 + e^{-z} \\in (1, \\infty)',
      explanation:
        'Since the exponential function is strictly positive for all real values (e^(-z) > 0), adding 1 guarantees the denominator is strictly greater than 1, completely preventing division by zero.',
      pythonSnippet: 'denominator = 1.0 + exp_neg_z',
      pythonExplanation: 'Denominator strictly exceeds 1 for all real inputs.',
      keyTakeaway: 'The denominator is strictly in (1, infinity), ensuring numerical regularity.'
    },
    {
      id: 'step-3-reciprocal',
      stepNumber: 3,
      title: 'Take the Reciprocal to Bound Outputs in (0, 1)',
      latex: '\\sigma(z) = \\frac{1}{D} = \\frac{1}{1 + e^{-z}} \\in (0, 1)',
      explanation:
        'Taking the reciprocal inverts the range (1, infinity) into the bounded interval (0, 1). As z -> +infinity, sigma(z) -> 1. As z -> -infinity, sigma(z) -> 0. At z = 0, sigma(0) = 1 / (1 + 1) = 0.5.',
      pythonSnippet: 'sigma = 1.0 / denominator',
      pythonExplanation: 'Produces calibrated probabilities in (0, 1).',
      keyTakeaway: 'Smooth, continuous transition from 0 to 1 with a decision threshold at 0.5.'
    },
    {
      id: 'step-4-symmetry-and-derivative',
      stepNumber: 4,
      title: 'Exploit Point Symmetry and Simple Analytical Derivative',
      latex: '\\sigma(-z) = 1 - \\sigma(z), \\quad \\frac{d\\sigma}{dz} = \\sigma(z)(1 - \\sigma(z))',
      explanation:
        'The sigmoid function possesses rotational point symmetry around (0, 0.5). Its derivative is computed directly from its output without evaluating further exponentials.',
      pythonSnippet: 'sigmoid_derivative = sigma * (1.0 - sigma)',
      pythonExplanation: 'Enables rapid backpropagation gradients during neural network training.',
      keyTakeaway: 'Derivative reaches its maximum of 0.25 at z = 0, and decays to 0 in the tails.'
    },
    {
      id: 'step-5-numerical-stabilization',
      stepNumber: 5,
      title: 'Implement Dual-Branch Numerical Stabilization',
      latex: '\\sigma(z) = \\begin{cases} \\frac{1}{1 + e^{-z}}, & z \\ge 0 \\\\[6pt] \\frac{e^z}{1 + e^z}, & z < 0 \\end{cases}',
      explanation:
        'In 64-bit IEEE floating-point arithmetic, computing e^(-z) for z < -709 overflows to +inf, producing NaN or RuntimeWarning. Multiplying numerator and denominator by e^z yields the equivalent form e^z / (1 + e^z), which safely underflows to 0 for large negative z.',
      pythonSnippet: 'def stable_sigmoid(z):\n    z_arr = np.asarray(z, dtype=float)\n    pos = (z_arr >= 0)\n    res = np.empty_like(z_arr)\n    res[pos] = 1.0 / (1.0 + np.exp(-z_arr[pos]))\n    exp_z = np.exp(z_arr[~pos])\n    res[~pos] = exp_z / (1.0 + exp_z)\n    return res',
      pythonExplanation: 'Prevents float64 overflow when evaluating extreme negative logits.',
      keyTakeaway: 'Dual-branch implementation guarantees numerical stability for all z in (-inf, +inf).'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Logit Evaluation',
    description: 'Evaluate sigmoid at the decision boundary z = 0 and at positive logit z = 2.0.',
    inputs: [
      {
        name: 'z_boundary',
        value: '0.0',
        representation: 'z_0 = 0.0 \\quad \\text{(Neutral logit / Decision boundary)}'
      },
      {
        name: 'z_positive',
        value: '2.0',
        representation: 'z_1 = 2.0 \\quad \\text{(Positive confidence logit)}'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Compute e^(-0.0)',
        computation: 'e^{-0.0} = 1.0',
        result: '1.0'
      },
      {
        step: 'Compute sigma(0.0)',
        computation: '\\sigma(0.0) = \\frac{1}{1 + 1.0} = \\frac{1}{2.0}',
        result: '0.5'
      },
      {
        step: 'Compute e^(-2.0)',
        computation: 'e^{-2.0} = \\frac{1}{e^2} \\approx \\frac{1}{7.389056}',
        result: '0.135335'
      },
      {
        step: 'Compute sigma(2.0)',
        computation: '\\sigma(2.0) = \\frac{1}{1 + 0.135335} = \\frac{1}{1.135335}',
        result: '0.880797'
      }
    ],
    finalOutput: {
      name: 'sigma(z)',
      value: '[0.5, 0.880797]',
      interpretation: '\\sigma(0.0) = 0.5000, \\quad \\sigma(2.0) \\approx 0.8808 \\; (88.08\\% \\text{ probability})'
    },
    verifiedNote: 'Independently verified against scipy.special.expit([0.0, 2.0]).'
  },
  commonMistakes: [
    'Evaluating 1 / (1 + exp(-z)) for z < -709 without overflow safeguards.',
    'Vanishing gradient problem: when |z| > 5, derivative sigma\'(z) < 0.006, causing deep gradient updates to stall.',
    'Assuming sigmoid outputs can exactly equal 0.0 or 1.0 (they are open asymptotic bounds (0, 1)).'
  ],
  numericalStabilityNotes: [
    'Always use the dual-branch formulation to eliminate IEEE 754 overflow for large negative arguments.',
    'When computing binary cross-entropy loss, combine sigmoid and log into log-sum-exp to prevent catastrophic log(0) cancellation.'
  ],
  limitations: [
    'Limited to single binary decision probabilities; multiclass categorical distributions require the vector softmax function.'
  ]
};
