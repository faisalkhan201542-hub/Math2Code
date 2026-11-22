import type { PatternDerivation } from '../types';

export const dotProductDerivation: PatternDerivation = {
  id: 'dot-product',
  pattern: 'dot_product',
  title: 'Vector Dot Product (Inner Product)',
  subtitle: 'Component-wise Sum of Products & Orthogonal Projection',
  category: 'Linear Algebra',
  summary:
    'The algebraic dot product computes the sum of the products of corresponding components of two vectors, geometrically reflecting the product of their Euclidean lengths and the cosine of the angle between them.',
  canonicalFormulaLatex: '\\mathbf{x} \\cdot \\mathbf{w} = \\sum_{i=1}^{n} x_i w_i = \\mathbf{x}^T \\mathbf{w}',
  targetWhatItCalculates:
    'Measures the scalar inner product of two real vectors x and w in R^n, characterizing their geometric directional alignment and projection.',
  symbols: [
    {
      symbol: '\\mathbf{x}',
      name: 'Input Vector',
      mathDomain: '\\mathbf{x} \\in \\mathbb{R}^{n}',
      role: 'Coordinate vector of feature values or coordinates.'
    },
    {
      symbol: '\\mathbf{w}',
      name: 'Weight / Direction Vector',
      mathDomain: '\\mathbf{w} \\in \\mathbb{R}^{n}',
      role: 'Coordinate vector of weights, coefficients, or projection axis.'
    },
    {
      symbol: 'x_i, w_i',
      name: 'i-th Vector Components',
      mathDomain: 'x_i, w_i \\in \\mathbb{R}, \\; 1 \\le i \\le n',
      role: 'Corresponding coordinate components along the i-th orthogonal basis.'
    },
    {
      symbol: 'n',
      name: 'Vector Dimension',
      mathDomain: 'n \\in \\mathbb{N}, \\; n \\ge 1',
      role: 'Number of elements / dimensions.'
    },
    {
      symbol: '\\theta',
      name: 'Subtended Angle',
      mathDomain: '\\theta \\in [0, \\pi]',
      role: 'Angle between vectors x and w in Euclidean space.'
    }
  ],
  assumptions: [
    'Vectors x and w must have identical lengths (dimension n).',
    'Empty vectors (dimension n = 0) are mathematically undefined.',
    'Vectors must consist of finite real numerical entries.',
    'Satisfies symmetry (x · w = w · x), linearity in both arguments, and positive definiteness (x · x >= 0, x · x = 0 iff x = 0).'
  ],
  steps: [
    {
      id: 'step-1-component-alignment',
      stepNumber: 1,
      title: 'Pair Corresponding Vector Components',
      latex: '(\\mathbf{x}, \\mathbf{w}) \\mapsto \\{ (x_1, w_1), (x_2, w_2), \\dots, (x_n, w_n) \\}',
      explanation:
        'Verify that vectors x and w inhabit the identical n-dimensional Euclidean vector space R^n and align components along each corresponding basis axis.',
      pythonSnippet: 'assert len(x) == len(w), "Vector dimensions must match"',
      pythonExplanation: 'Length validation guarantees 1-to-1 coordinate pairing without out-of-bounds indexing.',
      keyTakeaway: 'Both vectors must share the exact same dimensionality for component pairing.'
    },
    {
      id: 'step-2-component-multiplication',
      stepNumber: 2,
      title: 'Compute Component-Wise Products',
      latex: 'p_i = x_i \\cdot w_i \\quad \\text{for } i = 1, \\dots, n',
      explanation:
        'Multiply each element of vector x by the corresponding element of vector w. If components share the same sign, their product is positive; if opposite signs, negative.',
      pythonSnippet: 'component_products = x * w',
      pythonExplanation: 'NumPy performs element-wise multiplication across matching 1D arrays.',
      keyTakeaway: 'Measures contribution to alignment along each individual coordinate dimension.'
    },
    {
      id: 'step-3-summation',
      stepNumber: 3,
      title: 'Accumulate Products into Scalar Sum',
      latex: 'S = \\sum_{i=1}^{n} p_i = \\sum_{i=1}^{n} x_i w_i = \\mathbf{x}^T \\mathbf{w}',
      explanation:
        'Sum all n component-wise products. The result S is an invariant scalar under coordinate rotations.',
      pythonSnippet: 'dot_val = np.sum(component_products)  # Or np.dot(x, w)',
      pythonExplanation: 'np.dot(x, w) or the @ operator performs this reduction in optimized BLAS routines.',
      keyTakeaway: 'Consolidates multi-dimensional interactions into a single scalar metric.'
    },
    {
      id: 'step-4-geometric-projection',
      stepNumber: 4,
      title: 'Geometric Interpretation & Angle Subtension',
      latex: '\\mathbf{x} \\cdot \\mathbf{w} = \\|\\mathbf{x}\\|_2 \\|\\mathbf{w}\\|_2 \\cos(\\theta)',
      explanation:
        'By the law of cosines, the algebraic dot product equals the product of Euclidean norms multiplied by cos(theta). Two non-zero vectors are perpendicular (orthogonal) if and only if their dot product is exactly 0.',
      pythonSnippet: 'cos_theta = np.dot(x, w) / (np.linalg.norm(x) * np.linalg.norm(w))',
      pythonExplanation: 'Forms the direct foundation for cosine similarity in machine learning.',
      keyTakeaway: 'Connects algebraic component summation directly to geometric angle and projection.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: 3D Vector Inner Product',
    description: 'Calculate the dot product of two small 3D feature vectors.',
    inputs: [
      {
        name: 'x',
        value: '[1.0, 2.0, 3.0]',
        representation: '\\mathbf{x} = \\begin{pmatrix} 1.0 & 2.0 & 3.0 \\end{pmatrix}^T'
      },
      {
        name: 'w',
        value: '[4.0, -1.0, 2.0]',
        representation: '\\mathbf{w} = \\begin{pmatrix} 4.0 & -1.0 & 2.0 \\end{pmatrix}^T'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Component 1 (i=1)',
        computation: 'x_1 \\cdot w_1 = (1.0) \\cdot (4.0)',
        result: '4.0'
      },
      {
        step: 'Component 2 (i=2)',
        computation: 'x_2 \\cdot w_2 = (2.0) \\cdot (-1.0)',
        result: '-2.0'
      },
      {
        step: 'Component 3 (i=3)',
        computation: 'x_3 \\cdot w_3 = (3.0) \\cdot (2.0)',
        result: '6.0'
      },
      {
        step: 'Accumulation',
        computation: 'S = 4.0 + (-2.0) + 6.0',
        result: '8.0'
      }
    ],
    finalOutput: {
      name: 'x · w',
      value: '8.0',
      interpretation: 'Positive dot product indicates acute angle (theta < 90 deg) and positive directional correlation.'
    },
    verifiedNote: 'Verified analytically: 1*4 + 2*(-1) + 3*2 = 4 - 2 + 6 = 8.0.'
  },
  commonMistakes: [
    'Attempting dot products between vectors of unequal lengths.',
    'Confusing inner dot product (scalar output) with outer tensor product x w^T (matrix output).',
    'Assuming orthogonal vectors must have zero magnitude; orthogonal non-zero vectors simply have cos(theta) = 0.'
  ],
  numericalStabilityNotes: [
    'Summing long vectors with extreme magnitude disparities can cause cancellation error; use pairwise summation for large n.',
    'NumPy np.dot uses BLAS ddot which incorporates compensated summation where hardware allows.'
  ],
  limitations: [
    'Requires vectors defined in standard flat Euclidean coordinate spaces.',
    'Linear metric: does not capture non-linear manifold correlations without kernel tricks.'
  ],
  catalogueId: 'dot-product',
  isEngineSupported: false,
  difficulty: 'Foundational',
  tags: ['linear algebra', 'inner product', 'projection', 'vector']
};
