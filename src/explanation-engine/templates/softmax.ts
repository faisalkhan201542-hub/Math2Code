import type { PatternDerivation } from '../types';

export const softmaxDerivation: PatternDerivation = {
  id: 'softmax',
  pattern: 'softmax',
  title: 'Softmax Probability Normalization',
  subtitle: 'Exponential Categorical Normalization Mapping Logits to Probability Distributions',
  category: 'Deep Learning',
  catalogueId: 'softmax-activation',
  difficulty: 'Intermediate',
  tags: ['deep-learning', 'activations', 'softmax', 'classification', 'probability'],
  isEngineSupported: false,
  summary:
    'Softmax normalizes an arbitrary K-dimensional vector of real-valued unconstrained logits into a valid categorical probability distribution over K mutually exclusive classes where all values are strictly positive and sum to 1.',
  canonicalFormulaLatex: 'p_i = \\frac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}, \\quad \\text{for } i = 1, 2, \\dots, K',
  targetWhatItCalculates:
    'Transforms raw unnormalized network logits z in R^K into normalized posterior class probabilities p in (0, 1)^K satisfying sum_{i=1}^K p_i = 1.',
  symbols: [
    {
      symbol: '\\mathbf{z} = (z_1, \\dots, z_K)',
      name: 'Logit Vector',
      mathDomain: '\\mathbf{z} \\in \\mathbb{R}^K',
      role: 'Unconstrained real-valued scores produced by the final linear layer of a classifier.'
    },
    {
      symbol: 'K',
      name: 'Number of Classes',
      mathDomain: 'K \\in \\mathbb{Z}_{\\ge 2}',
      role: 'Total count of mutually exclusive target classes.'
    },
    {
      symbol: 'e^{z_i}',
      name: 'Unnormalized Likelihood / Exponentiated Logit',
      mathDomain: 'e^{z_i} \\in (0, \\infty)',
      role: 'Guarantees strictly positive non-zero likelihoods for all classes.'
    },
    {
      symbol: '\\sum_{j=1}^K e^{z_j}',
      name: 'Partition Function (Normalization Constant)',
      mathDomain: 'Z \\in (0, \\infty)',
      role: 'Sum of all exponentiated logits ensuring posterior probabilities sum to unity.'
    },
    {
      symbol: 'p_i',
      name: 'Posterior Class Probability',
      mathDomain: 'p_i \\in (0, 1)',
      role: 'Calibrated predicted probability P(Y = i | z) for class i.'
    }
  ],
  assumptions: [
    'Classes are mutually exclusive and collectively exhaustive (each input belongs to exactly one class).',
    'Dimension K >= 2 (for K=2, Softmax is mathematically equivalent to the two-class Sigmoid).',
    'To prevent numerical overflow when computing e^{z_i} for large logits, we subtract max(z): e^{z_i - c} / sum_j e^{z_j - c} where c = max(z).'
  ],
  steps: [
    {
      id: 'step-1-max-subtraction',
      stepNumber: 1,
      title: 'Shift Logits by Maximum for Numerical Stability',
      latex: '\\tilde{z}_i = z_i - \\max_{j}(z_j) \\le 0',
      explanation:
        'Because e^{z_i} / sum_j e^{z_j} = e^{z_i - c} / sum_j e^{z_j - c} for any constant c, setting c = max(z) ensures all shifted logits are <= 0. This guarantees that e^{\\tilde{z}_i} <= 1, completely eliminating IEEE 754 floating-point overflow without altering the mathematical probability ratio.',
      pythonSnippet: 'shifted_z = z - np.max(z, axis=-1, keepdims=True)',
      pythonExplanation: 'Subtract the maximum element per sample to ensure exp() does not overflow to infinity.',
      keyTakeaway: 'Softmax is invariant to uniform scalar addition: Softmax(z + c) = Softmax(z).'
    },
    {
      id: 'step-2-exponentiation',
      stepNumber: 2,
      title: 'Exponentiate Shifted Logits',
      latex: 'u_i = e^{\\tilde{z}_i} \\in (0, 1]',
      explanation:
        'The natural exponential function maps real numbers to positive values. Since the shifted logits are non-positive, all exponentiated values u_i lie strictly in the stable interval (0, 1], with the maximum logit achieving exactly e^0 = 1.',
      pythonSnippet: 'unnormalized = np.exp(shifted_z)',
      pythonExplanation: 'Exponentiate each shifted component to obtain positive unnormalized weights.',
      keyTakeaway: 'Ensures strictly non-negative weights while keeping magnitudes under control.'
    },
    {
      id: 'step-3-partition-sum',
      stepNumber: 3,
      title: 'Compute Partition Sum Across All Classes',
      latex: 'S = \\sum_{j=1}^{K} u_j = \\sum_{j=1}^{K} e^{\\tilde{z}_j} \\ge 1',
      explanation:
        'Sum all exponentiated values across the K dimensions. Because the largest shifted logit is 0 and e^0 = 1, the sum S is guaranteed to be >= 1, preventing division by zero.',
      pythonSnippet: 'partition_sum = np.sum(unnormalized, axis=-1, keepdims=True)',
      pythonExplanation: 'Sum weights along the class axis to compute the normalizing denominator.',
      keyTakeaway: 'Provides the normalizing denominator representing total mass.'
    },
    {
      id: 'step-4-normalize',
      stepNumber: 4,
      title: 'Divide Each Component by Partition Sum',
      latex: 'p_i = \\frac{u_i}{S} = \\frac{e^{\\tilde{z}_i}}{\\sum_{j=1}^{K} e^{\\tilde{z}_j}}',
      explanation:
        'Dividing each exponentiated component by the total partition sum yields calibrated probabilities where each p_i in (0, 1) and sum_{i=1}^K p_i = 1.',
      pythonSnippet: 'probabilities = unnormalized / partition_sum',
      pythonExplanation: 'Normalize by dividing each element by the partition sum.',
      keyTakeaway: 'Produces a valid multinomial probability distribution.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Three-Class Logit Normalization',
    description: 'Convert three raw model logits z = [2.0, 1.0, 0.1] into normalized probabilities.',
    inputs: [
      {
        name: 'z',
        value: '[2.0, 1.0, 0.1]',
        representation: '\\mathbf{z} = \\begin{pmatrix} 2.0 & 1.0 & 0.1 \\end{pmatrix}'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Max Subtraction (Stability Shift)',
        computation: 'c = \\max(2.0, 1.0, 0.1) = 2.0; \\; \\tilde{\\mathbf{z}} = [0.0, -1.0, -1.9]',
        result: '[0.0, -1.0, -1.9]'
      },
      {
        step: 'Exponentiate Shifted Logits',
        computation: 'u = [e^{0.0}, e^{-1.0}, e^{-1.9}] \\approx [1.0000, 0.3679, 0.1496]',
        result: '[1.0000, 0.3679, 0.1496]'
      },
      {
        step: 'Partition Sum',
        computation: 'S = 1.0000 + 0.3679 + 0.1496',
        result: '1.5175'
      },
      {
        step: 'Normalize Components',
        computation: 'p_i = u_i / 1.5175',
        result: '[0.6590, 0.2424, 0.0986]'
      }
    ],
    finalOutput: {
      name: 'p',
      value: '[0.6590, 0.2424, 0.0986]',
      interpretation: 'Class 1: 65.90%, Class 2: 24.24%, Class 3: 9.86% (Sum = 1.0000)'
    },
    verifiedNote: 'Verified: 0.659001 + 0.242433 + 0.098566 = 1.000000 within IEEE 754 precision.'
  },
  commonMistakes: [
    'Computing raw exp(z) without subtracting max(z): easily overflows to inf for logits > 709 in float64 or > 88 in float32.',
    'Confusing Softmax with Sigmoid: Sigmoid outputs independent probabilities for multi-label tasks; Softmax enforces mutual exclusivity.',
    'Applying Softmax across the wrong dimension in 2D batches (must specify axis=-1 to normalize across classes, not samples).'
  ],
  numericalStabilityNotes: [
    'Always use shifted logits z - max(z) before exponentiation to keep exponents non-positive.',
    'When computing loss alongside softmax, combine into LogSoftmax / CrossEntropy to avoid roundtrip exp() followed by log().'
  ],
  limitations: [
    'Forces sum to 1 even when all input logits are negative or small, which can lead to overconfident predictions on out-of-distribution inputs.',
    'Not suitable for multi-label classification where an instance can belong to multiple categories simultaneously.'
  ]
};
