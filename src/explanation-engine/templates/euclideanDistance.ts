import type { PatternDerivation } from '../types';

export const euclideanDistanceDerivation: PatternDerivation = {
  id: 'euclidean-distance',
  pattern: 'euclidean_distance',
  title: 'Euclidean Distance (L2 Metric)',
  subtitle: 'Coordinate Differences & Multi-Dimensional Pythagorean Metric',
  category: 'Linear Algebra',
  summary:
    'Euclidean distance measures the ordinary straight-line distance between two points in Euclidean n-space, calculated by taking the square root of the sum of squared coordinate differences.',
  canonicalFormulaLatex: 'd(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_{i=1}^{n} (x_i - y_i)^2} = \\|\\mathbf{x} - \\mathbf{y}\\|_2',
  targetWhatItCalculates:
    'Calculates the geometric metric separation between two coordinate points x and y in R^n.',
  symbols: [
    {
      symbol: '\\mathbf{x}, \\mathbf{y}',
      name: 'Coordinate Points (Vectors)',
      mathDomain: '\\mathbf{x}, \\mathbf{y} \\in \\mathbb{R}^{n}',
      role: 'Endpoints between which geometric distance is evaluated.'
    },
    {
      symbol: 'x_i - y_i',
      name: 'Coordinate Displacement',
      mathDomain: 'x_i - y_i \\in \\mathbb{R}',
      role: 'Signed component separation along the i-th orthogonal axis.'
    },
    {
      symbol: 'n',
      name: 'Spatial Dimension',
      mathDomain: 'n \\in \\mathbb{N}, \\; n \\ge 1',
      role: 'Number of spatial dimensions or features.'
    },
    {
      symbol: 'd(\\mathbf{x}, \\mathbf{y})',
      name: 'Euclidean Metric Distance',
      mathDomain: 'd \\in [0, \\infty)',
      role: 'Non-negative scalar measurement of geometric separation.'
    }
  ],
  assumptions: [
    'Vectors x and y must possess identical dimensions (matching shape n).',
    'Both vectors must contain finite real numerical entries.',
    'Empty vectors (dimension n = 0) are undefined.',
    'Satisfies the four formal metric space axioms: non-negativity, identity of indiscernibles (d(x,y)=0 iff x=y), symmetry (d(x,y)=d(y,x)), and triangle inequality (d(x,z) <= d(x,y) + d(y,z)).'
  ],
  steps: [
    {
      id: 'step-1-coordinate-differences',
      stepNumber: 1,
      title: 'Compute Coordinate Differences (Displacement Vector)',
      latex: '\\Delta_i = x_i - y_i \\quad \\text{for } i = 1, \\dots, n',
      explanation:
        'Subtract coordinates component by component. The vector Delta = x - y represents the directed spatial translation from point y to point x.',
      pythonSnippet: 'diff = x - y',
      pythonExplanation: 'Computes element-wise differences across the coordinate arrays.',
      keyTakeaway: 'Calculates the distance along each individual coordinate axis.'
    },
    {
      id: 'step-2-squared-differences',
      stepNumber: 2,
      title: 'Square Each Coordinate Difference',
      latex: '\\Delta_i^2 = (x_i - y_i)^2 \\ge 0',
      explanation:
        'Squaring differences removes directionality (negative signs) and applies the Pythagorean principle: the square of any real number is non-negative.',
      pythonSnippet: 'sq_diff = diff ** 2',
      pythonExplanation: 'Guarantees non-negativity and scales quadratic contributions.',
      keyTakeaway: 'Eliminates negative signs while quadratically penalizing larger component separations.'
    },
    {
      id: 'step-3-sum-of-squares',
      stepNumber: 3,
      title: 'Sum the Squared Coordinate Differences',
      latex: 'S = \\sum_{i=1}^{n} (x_i - y_i)^2 = \\|\\mathbf{x} - \\mathbf{y}\\|_2^2',
      explanation:
        'Accumulate the squared displacements across all n dimensions. This yields the total squared Euclidean distance, proportional to squared Pythagorean hypotenuse.',
      pythonSnippet: 'sum_sq = np.sum(sq_diff)',
      pythonExplanation: 'Reduces the array of squared differences to a single scalar sum.',
      keyTakeaway: 'Aggregates multi-dimensional spatial variance into a single squared metric.'
    },
    {
      id: 'step-4-principal-square-root',
      stepNumber: 4,
      title: 'Extract the Non-Negative Principal Square Root',
      latex: 'd(\\mathbf{x}, \\mathbf{y}) = \\sqrt{S} = \\sqrt{\\sum_{i=1}^{n} (x_i - y_i)^2}',
      explanation:
        'Taking the principal square root converts the squared units back into the original linear scale of the coordinate system.',
      pythonSnippet: 'dist = np.sqrt(sum_sq)  # Or np.linalg.norm(x - y)',
      pythonExplanation: 'np.linalg.norm(x - y) computes the L2 norm of the difference vector.',
      keyTakeaway: 'Restores the original linear unit of spatial measurement.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: 2D Coordinate Distance',
    description: 'Calculate the Euclidean distance between two points on the 2D Cartesian plane.',
    inputs: [
      {
        name: 'x',
        value: '[1.0, 2.0]',
        representation: '\\mathbf{x} = (1.0, 2.0)'
      },
      {
        name: 'y',
        value: '[4.0, 6.0]',
        representation: '\\mathbf{y} = (4.0, 6.0)'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Displacement (x - y)',
        computation: '\\Delta = (1.0 - 4.0, \\; 2.0 - 6.0) = (-3.0, \\; -4.0)',
        result: '[-3.0, -4.0]'
      },
      {
        step: 'Squared Differences',
        computation: '(-3.0)^2 + (-4.0)^2 = 9.0 + 16.0',
        result: '25.0'
      },
      {
        step: 'Square Root',
        computation: 'd = \\sqrt{25.0}',
        result: '5.0'
      }
    ],
    finalOutput: {
      name: 'd(x, y)',
      value: '5.0',
      interpretation: 'The geometric straight-line separation is exactly 5.0 coordinate units (classic 3-4-5 right triangle).'
    },
    verifiedNote: 'Verified analytically: sqrt((-3)^2 + (-4)^2) = sqrt(9 + 16) = sqrt(25) = 5.0.'
  },
  commonMistakes: [
    'Comparing points with differing dimensionalities or mismatched feature orders.',
    'Forgetting the square root (which yields squared Euclidean distance, not distance).',
    'Applying Euclidean distance to features of vastly different scales without z-score normalization (the larger scale feature will dominate).'
  ],
  numericalStabilityNotes: [
    'For very large inputs, squaring can cause intermediate floating-point overflow. In production, scipy/numpy hypot or scaling by max absolute value prevents overflow.',
    'In high dimensions (curse of dimensionality), distances between points tend to concentrate around a narrow band.'
  ],
  limitations: [
    'Sensitive to feature scaling; variables measured in meters vs millimeters will distort distance.',
    'Assumes isotropic, flat Euclidean metric space; inappropriate for manifold surfaces or categorical variables.'
  ],
  catalogueId: 'euclidean-distance',
  isEngineSupported: false,
  difficulty: 'Foundational',
  tags: ['linear algebra', 'distance', 'metric', 'knn', 'clustering']
};
