import type { PatternDerivation } from '../types';

export const pearsonCorrelationDerivation: PatternDerivation = {
  id: 'pearson-correlation',
  pattern: 'pearson_correlation',
  title: 'Pearson Correlation Coefficient (r)',
  subtitle: 'Scale-Invariant Bivariate Linear Association',
  category: 'Statistics & Evaluation',
  summary:
    'The Pearson correlation coefficient normalizes covariance by the product of individual standard deviations, producing a scale-invariant metric bounded strictly between -1 and +1 that quantifies linear association.',
  canonicalFormulaLatex: 'r = \\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum_{i=1}^{n} (x_i - \\bar{x})^2 \\sum_{i=1}^{n} (y_i - \\bar{y})^2}} = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y}',
  targetWhatItCalculates:
    'Measures the strength and direction of the linear relationship between two continuous variables on a dimensionless scale from -1.0 to +1.0.',
  symbols: [
    {
      symbol: 'x_i, y_i',
      name: 'Paired Data Points',
      mathDomain: 'x_i, y_i \\in \\mathbb{R}',
      role: 'Paired quantitative observations.'
    },
    {
      symbol: '\\bar{x}, \\bar{y}',
      name: 'Sample Means',
      mathDomain: '\\bar{x}, \\bar{y} \\in \\mathbb{R}',
      role: 'Arithmetic centers of X and Y.'
    },
    {
      symbol: 's_x, s_y',
      name: 'Standard Deviations',
      mathDomain: 's_x, s_y \\in (0, \\infty)',
      role: 'Scale factors of individual spreads.'
    },
    {
      symbol: 'r',
      name: 'Pearson Correlation Coefficient',
      mathDomain: 'r \\in [-1.0, +1.0]',
      role: 'Dimensionless linear association coefficient.'
    }
  ],
  assumptions: [
    'Variables X and Y must have matching length n >= 2.',
    'Neither X nor Y can be a constant vector (standard deviations must be strictly positive: s_x > 0, s_y > 0).',
    'Cauchy-Schwarz inequality guarantees -1 <= r <= +1.',
    'Assumes a linear relationship; non-linear curves may have r near 0 despite strong deterministic dependency.'
  ],
  steps: [
    {
      id: 'step-1-covariance-numerator',
      stepNumber: 1,
      title: 'Calculate Covariance Cross-Product Numerator',
      latex: '\\operatorname{CovNumerator} = \\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})',
      explanation:
        'Compute the unnormalized sum of cross-products of deviations from their respective means, capturing directional co-movement.',
      pythonSnippet: 'dx = x - np.mean(x)\ndy = y - np.mean(y)\nnum = np.sum(dx * dy)',
      pythonExplanation: 'Calculates the numerator identically to sample covariance.',
      keyTakeaway: 'The numerator establishes the sign (+ or -) of the correlation.'
    },
    {
      id: 'step-2-variance-denominators',
      stepNumber: 2,
      title: 'Calculate Individual Sums of Squared Deviations',
      latex: 'SS_x = \\sum_{i=1}^{n} (x_i - \\bar{x})^2, \\quad SS_y = \\sum_{i=1}^{n} (y_i - \\bar{y})^2',
      explanation:
        'Compute the sums of squared deviations for both X and Y. These represent the total individual variance in each variable.',
      pythonSnippet: 'ss_x = np.sum(dx ** 2)\nss_y = np.sum(dy ** 2)',
      pythonExplanation: 'Measures the scale of variation in each variable separately.',
      keyTakeaway: 'Establishes the scaling normalization factors.'
    },
    {
      id: 'step-3-constant-vector-check',
      stepNumber: 3,
      title: 'Guard Against Zero Standard Deviation (Constant Vectors)',
      latex: '\\text{If } SS_x = 0 \\text{ or } SS_y = 0 \\implies r \\text{ is mathematically undefined}',
      explanation:
        'If either vector has zero variance (all elements identical), its standard deviation is zero. Dividing by zero is undefined, so Pearson correlation cannot be computed for constant vectors.',
      pythonSnippet: 'if ss_x == 0 or ss_y == 0:\n    raise ValueError("Correlation undefined for constant vectors")',
      pythonExplanation: 'Explicitly validates that both vectors have non-zero variance.',
      keyTakeaway: 'Both variables must exhibit non-zero variance for correlation to exist.'
    },
    {
      id: 'step-4-quotient-normalization',
      stepNumber: 4,
      title: 'Compute Normalized Dimensionless Ratio (r)',
      latex: 'r = \\frac{num}{\\sqrt{SS_x \\cdot SS_y}} = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y}',
      explanation:
        'Dividing by the product of standard deviations cancels out measurement units, yielding a dimensionless number bounded in [-1.0, +1.0]. r = +1 denotes perfect positive linear correlation; r = -1 denotes perfect negative linear correlation; r = 0 indicates no linear correlation.',
      pythonSnippet: 'r = num / np.sqrt(ss_x * ss_y)',
      pythonExplanation: 'NumPy np.corrcoef(x, y)[0, 1] implements this directly.',
      keyTakeaway: 'Produces a unit-free score in [-1, +1] measuring linear relationship strength.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Perfect Positive Linear Alignment',
    description: 'Calculate Pearson correlation r between vectors [1, 2, 3] and [2, 4, 6].',
    inputs: [
      {
        name: 'x',
        value: '[1.0, 2.0, 3.0]',
        representation: '\\mathbf{x} = [1.0, 2.0, 3.0]^T'
      },
      {
        name: 'y',
        value: '[2.0, 4.0, 6.0]',
        representation: '\\mathbf{y} = [2.0, 4.0, 6.0]^T'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Means and Deviations',
        computation: '\\bar{x}=2.0, \\; \\bar{y}=4.0 \\implies dx=[-1, 0, 1], \\; dy=[-2, 0, 2]',
        result: 'Centered at zero'
      },
      {
        step: 'Numerator (Sum dx * dy)',
        computation: '(-1)(-2) + (0)(0) + (1)(2) = 2.0 + 0.0 + 2.0',
        result: '4.0'
      },
      {
        step: 'Denominators (SS_x and SS_y)',
        computation: 'SS_x = (-1)^2 + 0^2 + 1^2 = 2.0; \\; SS_y = (-2)^2 + 0^2 + 2^2 = 8.0',
        result: 'SS_x = 2.0, SS_y = 8.0'
      },
      {
        step: 'Denominator Product & Root',
        computation: '\\sqrt{SS_x \\cdot SS_y} = \\sqrt{2.0 \\times 8.0} = \\sqrt{16.0}',
        result: '4.0'
      },
      {
        step: 'Correlation Ratio (r)',
        computation: 'r = 4.0 / 4.0',
        result: '1.0'
      }
    ],
    finalOutput: {
      name: 'r',
      value: '1.0',
      interpretation: 'Perfect positive linear correlation: y = 2x with zero residual noise.'
    },
    verifiedNote: 'Verified analytically: num = 4.0, den = sqrt(2 * 8) = 4.0. r = 4.0 / 4.0 = 1.0.'
  },
  commonMistakes: [
    'Assuming r = 0 implies variables are independent (they can have a perfect nonlinear relationship, like y = x^2 on symmetric domain [-1, 1]).',
    'Attempting to calculate correlation for constant vectors where std = 0.',
    'Confusing correlation with causation.'
  ],
  numericalStabilityNotes: [
    'Floating-point imprecision can produce values like 1.0000000000000002; clip to [-1.0, 1.0] in production to avoid domain errors in downstream arccos.',
    'Computing (x - mean)/std upfront and then taking dot product / (n - 1) is equivalent and highly stable.'
  ],
  limitations: [
    'Strictly sensitive only to linear relationships.',
    'Sensitive to outliers: a single distant point can inflate or deflate r dramatically.'
  ],
  catalogueId: 'covariance-correlation',
  isEngineSupported: false,
  difficulty: 'Intermediate',
  tags: ['statistics', 'correlation', 'pearson', 'association', 'normalized']
};
