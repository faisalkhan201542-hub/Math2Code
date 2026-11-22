import type { PatternDerivation } from '../types';

export const covarianceDerivation: PatternDerivation = {
  id: 'covariance',
  pattern: 'covariance',
  title: 'Covariance (Joint Variability)',
  subtitle: 'Directional Co-Movement Between Paired Variables',
  category: 'Statistics & Evaluation',
  summary:
    'Covariance measures the joint variability and directional association between two random variables. A positive covariance indicates that variables tend to increase together, while negative covariance indicates an inverse relationship.',
  canonicalFormulaLatex: '\\operatorname{Cov}(X, Y) = \\frac{1}{N}\\sum_{i=1}^N (x_i - \\mu_X)(y_i - \\mu_Y) \\quad \\text{vs.} \\quad s_{xy} = \\frac{1}{n-1}\\sum_{i=1}^n (x_i - \\bar{x})(y_i - \\bar{y})',
  targetWhatItCalculates:
    'Quantifies whether two paired quantitative variables deviate from their respective means in the same or opposite directions.',
  symbols: [
    {
      symbol: 'x_i, y_i',
      name: 'Paired Data Points',
      mathDomain: 'x_i, y_i \\in \\mathbb{R}',
      role: 'Corresponding observations from variables X and Y for sample i.'
    },
    {
      symbol: '\\bar{x}, \\bar{y}',
      name: 'Arithmetic Sample Means',
      mathDomain: '\\bar{x}, \\bar{y} \\in \\mathbb{R}',
      role: 'Centers of variables X and Y.'
    },
    {
      symbol: 'n',
      name: 'Paired Sample Size',
      mathDomain: 'n \\in \\mathbb{N}, \\; n \\ge 2',
      role: 'Number of paired observations.'
    },
    {
      symbol: '\\operatorname{Cov}(X, Y)',
      name: 'Covariance Metric',
      mathDomain: '\\operatorname{Cov} \\in (-\\infty, \\infty)',
      role: 'Signed measure of linear co-movement.'
    }
  ],
  assumptions: [
    'Vectors x and y must have identical lengths n >= 2.',
    'Data must be measured in pairs (bivariate observations on the same underlying units).',
    'Inputs must consist of finite real numerical entries.',
    'Symmetric: Cov(X, Y) = Cov(Y, X). Cov(X, X) equals the variance Var(X).'
  ],
  steps: [
    {
      id: 'step-1-mean-centering',
      stepNumber: 1,
      title: 'Compute Sample Means and Mean-Center Both Variables',
      latex: '\\bar{x} = \\frac{1}{n}\\sum_{i=1}^n x_i, \\quad \\bar{y} = \\frac{1}{n}\\sum_{i=1}^n y_i \\implies \\Delta x_i = x_i - \\bar{x}, \\quad \\Delta y_i = y_i - \\bar{y}',
      explanation:
        'Subtract their respective sample means so that values above the mean are positive and values below are negative for both X and Y.',
      pythonSnippet: 'dx = x - np.mean(x)\ndy = y - np.mean(y)',
      pythonExplanation: 'Centers both series around their respective centroids.',
      keyTakeaway: 'Establishes origin at the joint bivariate mean (x_bar, y_bar).'
    },
    {
      id: 'step-2-cross-product',
      stepNumber: 2,
      title: 'Calculate Cross-Products of Mean Deviations',
      latex: 'c_i = (x_i - \\bar{x})(y_i - \\bar{y})',
      explanation:
        'Multiply deviations for each sample. If both are above their means (+ * + = +) or both below (- * - = +), the product is positive. If one is above and the other below (+ * - = -), the product is negative.',
      pythonSnippet: 'cross_products = dx * dy',
      pythonExplanation: 'Computes element-wise product of centered coordinates.',
      keyTakeaway: 'Quadrant-based scoring: positive for co-movement, negative for opposing movement.'
    },
    {
      id: 'step-3-sum-of-cross-products',
      stepNumber: 3,
      title: 'Sum Cross-Products Across All Observations',
      latex: 'SP = \\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})',
      explanation:
        'The Sum of Products (SP) represents the total unnormalized directional alignment between variables X and Y.',
      pythonSnippet: 'sp = np.sum(cross_products)',
      pythonExplanation: 'Reduces the array of cross products to a single scalar sum.',
      keyTakeaway: 'Net total of concordant vs discordant data point deviations.'
    },
    {
      id: 'step-4-normalization-interpretation',
      stepNumber: 4,
      title: 'Degrees of Freedom Normalization & Interpretation',
      latex: '\\operatorname{Cov}_{\\text{sample}}(X, Y) = \\frac{SP}{n - 1} \\quad \\text{vs.} \\quad \\operatorname{Cov}_{\\text{pop}} = \\frac{SP}{N}',
      explanation:
        'Divide by n - 1 for unbiased sample covariance (or N for full population). Meaning: Cov > 0 indicates positive association; Cov < 0 indicates inverse association; Cov = 0 indicates absence of linear correlation. Crucially, the magnitude depends directly on the measurement units of X and Y.',
      pythonSnippet: 'cov_sample = np.sum(dx * dy) / (len(x) - 1)',
      pythonExplanation: 'NumPy np.cov(x, y, ddof=1)[0, 1] provides standard unbiased sample covariance.',
      keyTakeaway: 'Normalizes into directional covariance whose magnitude reflects product of measurement units.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: 3-Sample Covariance',
    description: 'Calculate sample and population covariance for two paired variable vectors.',
    inputs: [
      {
        name: 'x',
        value: '[1.0, 2.0, 3.0]',
        representation: '\\mathbf{x} = [1.0, 2.0, 3.0]^T, \\; \\bar{x} = 2.0'
      },
      {
        name: 'y',
        value: '[2.0, 4.0, 6.0]',
        representation: '\\mathbf{y} = [2.0, 4.0, 6.0]^T, \\; \\bar{y} = 4.0'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Centered Deviations',
        computation: 'x - 2.0 = [-1, 0, 1] \\quad \\text{and} \\quad y - 4.0 = [-2, 0, 2]',
        result: 'dx=[-1, 0, 1], dy=[-2, 0, 2]'
      },
      {
        step: 'Cross Products (dx * dy)',
        computation: '(-1)(-2) = 2, \\; (0)(0) = 0, \\; (1)(2) = 2',
        result: '[2.0, 0.0, 2.0]'
      },
      {
        step: 'Sum of Products (SP)',
        computation: '2.0 + 0.0 + 2.0',
        result: '4.0'
      },
      {
        step: 'Sample Covariance (n-1 = 2)',
        computation: 'SP / (3 - 1) = 4.0 / 2',
        result: '2.0'
      },
      {
        step: 'Population Covariance (N = 3)',
        computation: 'SP / 3 = 4.0 / 3',
        result: '1.3333'
      }
    ],
    finalOutput: {
      name: 'Cov(X, Y)',
      value: 'Sample: 2.0 | Pop: 1.3333',
      interpretation: 'Positive covariance confirms strong co-movement: when X increases, Y reliably increases.'
    },
    verifiedNote: 'Verified analytically: cross products sum to 4.0. Sample cov = 4/2 = 2.0. Pop cov = 4/3 = 1.3333.'
  },
  commonMistakes: [
    'Comparing covariance values between different pairs of variables without normalizing for their scales.',
    'Assuming zero covariance implies statistical independence (it only implies zero linear relationship; nonlinear relationships like y = x^2 can have zero covariance).',
    'Mixing population (N) and sample (n - 1) denominators when constructing covariance matrices.'
  ],
  numericalStabilityNotes: [
    'Computing E[XY] - E[X]E[Y] in one pass can cause catastrophic cancellation; computing deviations from the mean in two passes is stable.',
    'For constant vectors, covariance with any other vector is identically zero.'
  ],
  limitations: [
    'Scale-dependent: changing units (e.g. meters to millimeters) multiplies covariance by 1,000 without altering underlying relationship (use Pearson correlation for scale invariance).',
    'Only captures linear association; blind to complex non-monotonic dependencies.'
  ],
  catalogueId: 'covariance-correlation',
  isEngineSupported: false,
  difficulty: 'Intermediate',
  tags: ['statistics', 'covariance', 'association', 'bivariate', 'dispersion']
};
