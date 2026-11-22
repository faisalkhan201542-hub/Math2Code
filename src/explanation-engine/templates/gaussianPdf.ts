import type { PatternDerivation } from '../types';

export const gaussianPdfDerivation: PatternDerivation = {
  id: 'gaussian_pdf',
  pattern: 'gaussian_pdf',
  title: 'Gaussian Normal Probability Density',
  subtitle: 'Univariate Bell-Shaped Continuous Density Function',
  category: 'Probability & Distributions',
  catalogueId: 'gaussian-pdf',
  isEngineSupported: true,
  plottableExpr: '(1 / (1.0 * sqrt(2 * 3.14159265))) * exp(-0.5 * (x / 1.0)^2)',
  difficulty: 'Foundational',
  tags: ['probability', 'statistics', 'gaussian', 'normal', 'bell-curve'],
  summary:
    'The Gaussian probability density function describes the likelihood distribution of a continuous random variable clustered symmetrically around a central mean mu with spread controlled by standard deviation sigma.',
  canonicalFormulaLatex: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)',
  targetWhatItCalculates:
    'Evaluates the instantaneous continuous probability density f(x) > 0 at evaluation coordinate x for a Gaussian random variable X ~ N(mu, sigma^2).',
  symbols: [
    {
      symbol: 'x',
      name: 'Evaluation Coordinate',
      mathDomain: 'x \\in \\mathbb{R}',
      role: 'Continuous value on the real number line where probability density is evaluated.'
    },
    {
      symbol: '\\mu',
      name: 'Distribution Mean (Expected Value)',
      mathDomain: '\\mu \\in \\mathbb{R}',
      role: 'Location parameter specifying the center of symmetry and peak of the bell curve.'
    },
    {
      symbol: '\\sigma',
      name: 'Standard Deviation (Scale Parameter)',
      mathDomain: '\\sigma \\in (0, \\infty)',
      role: 'Strictly positive scale parameter controlling distribution dispersion and width.'
    },
    {
      symbol: '\\sigma^2',
      name: 'Variance',
      mathDomain: '\\sigma^2 \\in (0, \\infty)',
      role: 'Second central moment measuring average squared deviation from the mean.'
    },
    {
      symbol: 'f(x)',
      name: 'Probability Density Value',
      mathDomain: 'f(x) \\in (0, \\infty)',
      role: 'Relative likelihood density (area under any interval represents probability).'
    }
  ],
  assumptions: [
    'Scale constraint: standard deviation \\sigma must be strictly positive (\\sigma > 0). Non-positive \\sigma is mathematically undefined.',
    'Total probability normalization: the integral over the entire real line strictly equals unity: \\int_{-\\infty}^{\\infty} f(x) dx = 1.',
    'Symmetry: the curve is perfectly symmetric around the mean: f(\\mu + d) = f(\\mu - d) for all d.'
  ],
  steps: [
    {
      id: 'step-1-centered-deviation',
      stepNumber: 1,
      title: 'Measure Centered Deviation from the Mean',
      latex: '\\Delta = x - \\mu \\in \\mathbb{R}',
      explanation:
        'Calculates the signed distance from the evaluation point x to the center of distribution mass mu. When x = mu, Delta = 0.',
      pythonSnippet: 'diff = x - mu',
      pythonExplanation: 'Subtracts distribution mean from sample coordinates.',
      keyTakeaway: 'Shifts coordinate system so the peak is centered at origin 0.'
    },
    {
      id: 'step-2-standardization',
      stepNumber: 2,
      title: 'Standardize Deviation into Z-Score and Square',
      latex: 'z = \\frac{x - \\mu}{\\sigma} \\implies z^2 = \\frac{(x - \\mu)^2}{\\sigma^2}',
      explanation:
        'Dividing by sigma standardizes the deviation into dimensionless standard deviation units (z-score). Squaring eliminates negative signs, ensuring points equidistant on both sides of mu receive equal density.',
      pythonSnippet: 'z = (x - mu) / sigma\nz_squared = z ** 2',
      pythonExplanation: 'Standardizes scale and squares the dimensionless deviation.',
      keyTakeaway: 'Squaring creates quadratic penalty and guarantees bilateral symmetry.'
    },
    {
      id: 'step-3-exponential-kernel',
      stepNumber: 3,
      title: 'Evaluate the Exponential Gaussian Decay Kernel',
      latex: 'K(x) = \\exp\\left(-\\frac{1}{2} z^2\\right) = \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right) \\in (0, 1]',
      explanation:
        'The negative exponential produces the classic bell curve. At x = mu, z = 0 and K(x) reaches its maximum of exp(0) = 1. As x moves away from mu, K(x) decays rapidly toward 0 at an exponential-quadratic rate.',
      pythonSnippet: 'kernel = np.exp(-0.5 * z_squared)',
      pythonExplanation: 'Computes exponential bell curve profile.',
      keyTakeaway: 'Kernel value is bounded in (0, 1], peaking at exactly 1 when x = mu.'
    },
    {
      id: 'step-4-normalization-constant',
      stepNumber: 4,
      title: 'Scale by Normalization Factor to Ensure Unit Area',
      latex: 'C = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\implies f(x) = C \\cdot K(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)',
      explanation:
        'The Gaussian integral \\int_{-\\infty}^{\\infty} \\exp(-u^2) du = \\sqrt{\\pi}. To make the total area under f(x) strictly equal 1.0, we must scale by 1 / (sigma * sqrt(2 * pi)). When sigma is small, C is large, creating a tall narrow peak.',
      pythonSnippet: 'norm_const = 1.0 / (sigma * np.sqrt(2.0 * np.pi))\nf = norm_const * kernel',
      pythonExplanation: 'Scales kernel by the Gaussian normalization constant.',
      keyTakeaway: 'Guarantees the integral over the entire real line equals 1.0.'
    },
    {
      id: 'step-5-sigma-positivity',
      stepNumber: 5,
      title: 'Enforce Strict Positivity of Standard Deviation',
      latex: '\\sigma > 0 \\quad (\\text{Variance } \\sigma^2 > 0)',
      explanation:
        'If sigma <= 0, the denominator would involve division by zero or an imaginary number. As sigma -> 0, the Gaussian distribution collapses into the Dirac delta function delta(x - mu).',
      pythonSnippet: 'if sigma <= 0.0:\n    raise ValueError(f"Standard deviation sigma must be strictly positive (got {sigma})")',
      pythonExplanation: 'Defensive guard checking sigma > 0 before evaluation.',
      keyTakeaway: 'A positive dispersion scale is a strict mathematical requirement.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Standard Normal N(0, 1) at Peak and 1-Sigma',
    description: 'Evaluate standard normal distribution (mu=0, sigma=1) at the peak x=0 and at x=1.0.',
    inputs: [
      {
        name: 'mu',
        value: '0.0',
        representation: '\\mu = 0.0 \\; (\\text{Standard normal mean})'
      },
      {
        name: 'sigma',
        value: '1.0',
        representation: '\\sigma = 1.0 \\; (\\text{Standard deviation})'
      },
      {
        name: 'x_peak',
        value: '0.0',
        representation: 'x_0 = 0.0 \\; (\\text{Distribution peak})'
      },
      {
        name: 'x_tail',
        value: '1.0',
        representation: 'x_1 = 1.0 \\; (\\text{One standard deviation away})'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Compute Normalization Constant C',
        computation: 'C = \\frac{1}{1.0 \\times \\sqrt{2\\pi}} = \\frac{1}{\\sqrt{6.2831853}}',
        result: '0.398942'
      },
      {
        step: 'Evaluate at Peak x=0.0',
        computation: 'f(0.0) = 0.398942 \\times \\exp(-0.5 \\times 0^2) = 0.398942 \\times 1.0',
        result: '0.398942'
      },
      {
        step: 'Evaluate at x=1.0 (z = 1.0)',
        computation: 'f(1.0) = 0.398942 \\times \\exp(-0.5 \\times 1.0^2) = 0.398942 \\times 0.606531',
        result: '0.241971'
      }
    ],
    finalOutput: {
      name: 'f(x)',
      value: '[0.398942, 0.241971]',
      interpretation: 'f(0) \\approx 0.3989, \\quad f(1) \\approx 0.2420 \\; (60.65\\% \\text{ of peak height})'
    },
    verifiedNote: 'Independently verified against scipy.stats.norm.pdf([0.0, 1.0], loc=0.0, scale=1.0).'
  },
  commonMistakes: [
    'Confusing probability density f(x) with probability P(X = x). For a continuous distribution, P(X = x) is identically zero; probabilities are integrals over intervals P(a <= X <= b).',
    'Assuming f(x) cannot exceed 1.0: if sigma < 0.3989, f(mu) > 1.0.',
    'Forgetting the factor of 2 in 2 * sigma^2 in the denominator of the exponent.',
    'Passing sigma <= 0, causing division by zero.'
  ],
  numericalStabilityNotes: [
    'When evaluating probabilities for extreme outliers (|z| > 37), exp(-0.5 * z^2) underflows to 0.0 in float64. Use log-density: log f(x) = -log(sigma * sqrt(2*pi)) - 0.5 * ((x - mu)/sigma)^2 to prevent underflow.'
  ],
  limitations: [
    'Univariate 1D formulation; multivariate Gaussian requires covariance matrix determinant and Mahalanobis quadratic distance.'
  ]
};
