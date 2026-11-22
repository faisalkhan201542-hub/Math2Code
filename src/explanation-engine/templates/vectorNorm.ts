import type { PatternDerivation } from '../types';

export const vectorNormDerivation: PatternDerivation = {
  id: 'vector_l2_norm',
  pattern: 'vector_l2_norm',
  title: 'Vector L2 Euclidean Norm',
  subtitle: 'Geometric Distance from Origin via Pythagorean Theorem',
  category: 'Linear Algebra',
  catalogueId: 'vector-l2-norm',
  isEngineSupported: true,
  difficulty: 'Foundational',
  tags: ['linear algebra', 'norm', 'euclidean', 'magnitude'],
  summary:
    'The Euclidean L2 norm calculates the geometric straight-line length of a real coordinate vector in n-dimensional Euclidean space, generalizing the Pythagorean theorem.',
  canonicalFormulaLatex: '\\|x\\|_2 = \\sqrt{\\sum_{i=1}^{n} x_i^2} = \\sqrt{x^T x}',
  targetWhatItCalculates:
    'Measures the Euclidean magnitude (straight-line distance from the origin) of an n-dimensional vector x in R^n.',
  symbols: [
    {
      symbol: 'x',
      name: 'Real Coordinate Vector',
      mathDomain: 'x \\in \\mathbb{R}^{n}',
      role: 'One-dimensional array of n real coordinate values.'
    },
    {
      symbol: 'x_i',
      name: 'i-th Vector Component',
      mathDomain: 'x_i \\in \\mathbb{R}, \\; 1 \\le i \\le n',
      role: 'Scalar component projection along the i-th orthogonal coordinate axis.'
    },
    {
      symbol: 'n',
      name: 'Vector Dimension',
      mathDomain: 'n \\in \\mathbb{N}, \\; n \\ge 1',
      role: 'Number of elements / spatial dimensions.'
    },
    {
      symbol: '\\|x\\|_2',
      name: 'Euclidean L2 Norm',
      mathDomain: '\\|x\\|_2 \\in [0, \\infty)',
      role: 'Non-negative scalar representing geometric vector magnitude.'
    }
  ],
  assumptions: [
    'Vector x must be a 1D real coordinate array.',
    'Empty vectors (dimension n = 0) are mathematically undefined.',
    'Satisfies the three rigorous norm axioms: positivity (||x|| >= 0, ||x|| = 0 iff x = 0), absolute homogeneity (||alpha x|| = |alpha| ||x||), and the triangle inequality (||x + y|| <= ||x|| + ||y||).'
  ],
  steps: [
    {
      id: 'step-1-square-components',
      stepNumber: 1,
      title: 'Square Each Coordinate Component',
      latex: 'x_i \\mapsto x_i^2 \\ge 0 \\quad \\text{for } i = 1, \\dots, n',
      explanation:
        'Squaring each component eliminates directional negative signs and quadratically penalizes larger deviations. The square of any real number is non-negative.',
      pythonSnippet: 'squared_components = x ** 2',
      pythonExplanation: 'In NumPy, x ** 2 computes element-wise squares efficiently.',
      keyTakeaway: 'Eliminates negative signs while preserving magnitude information.'
    },
    {
      id: 'step-2-summation',
      stepNumber: 2,
      title: 'Sum the Squared Components (Dot Product with Itself)',
      latex: 'S = \\sum_{i=1}^{n} x_i^2 = x \\cdot x = x^T x',
      explanation:
        'Summing the squared coordinates computes the total squared Euclidean distance. Geometrically, this is identical to the inner product of vector x with itself.',
      pythonSnippet: 'sum_of_squares = np.sum(squared_components)  # Or np.dot(x, x)',
      pythonExplanation: 'np.sum reduces the 1D array along its axis to a single scalar.',
      keyTakeaway: 'The sum of squares is proportional to the total kinetic or geometric energy.'
    },
    {
      id: 'step-3-square-root',
      stepNumber: 3,
      title: 'Extract the Principal Square Root',
      latex: '\\|x\\|_2 = \\sqrt{S} = \\sqrt{\\sum_{i=1}^{n} x_i^2}',
      explanation:
        'Taking the positive principal square root restores the original units of measurement. Because S >= 0, the square root is always a real, well-defined non-negative number.',
      pythonSnippet: 'norm = np.sqrt(sum_of_squares)  # Or np.linalg.norm(x, ord=2)',
      pythonExplanation: 'np.linalg.norm(x, ord=2) is the standard NumPy implementation.',
      keyTakeaway: 'Restores linear scale from quadratic squared units.'
    },
    {
      id: 'step-4-norm-axioms',
      stepNumber: 4,
      title: 'Verify Rigorous Norm Axioms',
      latex: '\\|x\\|_2 = 0 \\iff x = \\mathbf{0}, \\quad \\|x + y\\|_2 \\le \\|x\\|_2 + \\|y\\|_2',
      explanation:
        'The L2 norm satisfies positive definiteness, scalar scalability, and the Minkowski triangle inequality, making R^n with the L2 norm a complete normed Hilbert space.',
      pythonSnippet: 'assert norm >= 0.0, "Norm must be non-negative"',
      pythonExplanation: 'Norms are guaranteed non-negative by definition of the principal square root.',
      keyTakeaway: 'Forms the foundation for metric distance, inner products, and Cauchy-Schwarz inequalities.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: 2D Pythagorean Vector',
    description: 'Calculate the Euclidean norm of the classic 3-4-5 right triangle vector.',
    inputs: [
      {
        name: 'x',
        value: '[3.0, 4.0]',
        representation: 'x = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix} \\in \\mathbb{R}^2'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Square component 1 (x_1)',
        computation: 'x_1^2 = 3.0^2 = 3.0 \\times 3.0',
        result: '9.0'
      },
      {
        step: 'Square component 2 (x_2)',
        computation: 'x_2^2 = 4.0^2 = 4.0 \\times 4.0',
        result: '16.0'
      },
      {
        step: 'Sum squared coordinates',
        computation: 'S = 9.0 + 16.0',
        result: '25.0'
      },
      {
        step: 'Extract principal square root',
        computation: '\\|x\\|_2 = \\sqrt{25.0}',
        result: '5.0'
      }
    ],
    finalOutput: {
      name: '||x||_2',
      value: '5.0',
      interpretation: '\\|x\\|_2 = 5.0 \\quad \\text{(Exact integer Euclidean length)}'
    },
    verifiedNote: 'Independently verified against NumPy np.linalg.norm([3.0, 4.0]) == 5.0.'
  },
  commonMistakes: [
    'Forgetting the square root: computing sum(x ** 2) is the squared norm (energy), not the Euclidean norm.',
    'Passing a 2D matrix without specifying an axis (np.linalg.norm on a 2D matrix defaults to the Frobenius matrix norm).',
    'Squaring very large numbers (e.g. 1e160) causes overflow to infinity in IEEE 754 before the square root can be taken.'
  ],
  numericalStabilityNotes: [
    'Blue\'s algorithm scales components by max(|x_i|) before squaring to prevent floating-point underflow or overflow.',
    'NumPy np.linalg.norm utilizes LAPACK dnrm2 under the hood, which handles scale normalization automatically.'
  ],
  limitations: [
    'Applies to the standard Euclidean L2 norm (p=2); other norms (L1 Manhattan, L-infinity Chebyshev) use different formulations.'
  ]
};
