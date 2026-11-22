import type { PatternDerivation } from '../types';

export const zScoreDerivation: PatternDerivation = {
  id: 'z-score',
  pattern: 'z_score',
  title: 'Z-Score Standardization',
  subtitle: 'Mean Centering & Unit Variance Scaling',
  category: 'Statistics & Evaluation',
  summary:
    'Z-score standardization transforms an observation into the number of standard deviations it lies from the distribution mean, rescaling disparate features to share mean 0 and standard deviation 1.',
  canonicalFormulaLatex: 'z = \\frac{x - \\mu}{\\sigma} \\quad \\text{or} \\quad z_i = \\frac{x_i - \\bar{x}}{s}',
  targetWhatItCalculates:
    'Computes the standard normal deviation score representing how many standard deviations an observation x is above or below the mean.',
  symbols: [
    {
      symbol: 'x',
      name: 'Raw Observed Value',
      mathDomain: 'x \\in \\mathbb{R}',
      role: 'Unstandardized measurement in original units.'
    },
    {
      symbol: '\\mu, \\bar{x}',
      name: 'Population / Sample Mean',
      mathDomain: '\\mu, \\bar{x} \\in \\mathbb{R}',
      role: 'Center of the distribution.'
    },
    {
      symbol: '\\sigma, s',
      name: 'Population / Sample Standard Deviation',
      mathDomain: '\\sigma, s \\in (0, \\infty)',
      role: 'Scale factor measuring spread around the mean.'
    },
    {
      symbol: 'z',
      name: 'Standard Score (Z-Score)',
      mathDomain: 'z \\in (-\\infty, \\infty)',
      role: 'Dimensionless standardized deviation score.'
    }
  ],
  assumptions: [
    'Standard deviation must be strictly positive (sigma > 0). If all values in the dataset are identical (sigma = 0), z-score is mathematically undefined.',
    'Inputs must consist of finite real numerical entries.',
    'Linear transformation: preserves distribution shape, skewness, and kurtosis; does not turn a non-normal distribution into a normal one.'
  ],
  steps: [
    {
      id: 'step-1-mean-centering',
      stepNumber: 1,
      title: 'Centering by Subtracting the Mean',
      latex: '\\Delta = x - \\mu \\quad \\text{(or } x_i - \\bar{x} \\text{)}',
      explanation:
        'Subtracting the mean shifts the entire distribution along the real axis so that its new mean is exactly 0. Points greater than the mean become positive; points less than the mean become negative.',
      pythonSnippet: 'centered = x - np.mean(x)',
      pythonExplanation: 'Shifts coordinate origin to the arithmetic mean.',
      keyTakeaway: 'Establishes a zero-centered baseline for all measurements.'
    },
    {
      id: 'step-2-zero-std-guard',
      stepNumber: 2,
      title: 'Validate Non-Zero Standard Deviation',
      latex: '\\text{If } \\sigma = 0 \\implies z \\text{ is undefined (Zero Variance Guard)}',
      explanation:
        'If all elements in a feature column are identical, the standard deviation is zero. Dividing by zero is undefined. In preprocessing pipelines, such constant features must either raise an error or be handled by setting z = 0.',
      pythonSnippet: 'std_val = np.std(x, ddof=0)\nif std_val == 0.0:\n    raise ValueError("Cannot standardize constant vector with zero standard deviation")',
      pythonExplanation: 'Defensive check preventing runtime ZeroDivisionError.',
      keyTakeaway: 'A non-zero spread is required to scale variance.'
    },
    {
      id: 'step-3-scale-by-std',
      stepNumber: 3,
      title: 'Scale by Standard Deviation (Unit Variance)',
      latex: 'z = \\frac{x - \\mu}{\\sigma}',
      explanation:
        'Dividing by sigma scales the spread so that the new variance is exactly 1.0 (unit variance). The resulting z-scores are dimensionless and express distance purely in terms of standard deviation units.',
      pythonSnippet: 'z = (x - mean_val) / std_val',
      pythonExplanation: 'Calculates the standardized z-scores across the array.',
      keyTakeaway: 'Normalizes the spread so features with wildly different units become directly comparable.'
    },
    {
      id: 'step-4-interpretation',
      stepNumber: 4,
      title: 'Statistical Interpretation of Z-Score Magnitudes',
      latex: 'z > 0 \\implies x > \\mu, \\quad z = 0 \\implies x = \\mu, \\quad z < 0 \\implies x < \\mu',
      explanation:
        'A z-score of +2.0 indicates an observation 2 standard deviations above the mean (top ~2.3% in a standard normal distribution). A z-score of -1.5 indicates 1.5 standard deviations below the mean. In Gaussian distributions, 68% of data falls within |z| <= 1, 95% within |z| <= 2, and 99.7% within |z| <= 3.',
      pythonSnippet: '# Outlier detection rule: abs(z) > 3.0 indicates potential outlier',
      pythonExplanation: 'Standard threshold for 3-sigma anomaly detection.',
      keyTakeaway: 'Provides an immediate, probabilistic interpretation of extremity.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Standardizing Value x = 45.0',
    description: 'Calculate the z-score for observation x = 45.0 from dataset [10.0, 20.0, 30.0, 40.0, 50.0].',
    inputs: [
      {
        name: 'Dataset',
        value: '[10.0, 20.0, 30.0, 40.0, 50.0]',
        representation: 'X = \\{10, 20, 30, 40, 50\\}, \\; N = 5'
      },
      {
        name: 'x_target',
        value: '45.0',
        representation: 'x = 45.0'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Population Mean (mu)',
        computation: '\\mu = (10 + 20 + 30 + 40 + 50) / 5 = 150.0 / 5',
        result: '30.0'
      },
      {
        step: 'Population Variance and Std (sigma)',
        computation: '\\sigma^2 = [(-20)^2 + (-10)^2 + 0^2 + 10^2 + 20^2] / 5 = 1000 / 5 = 200.0 \\implies \\sigma = \\sqrt{200} \\approx 14.1421',
        result: '14.1421'
      },
      {
        step: 'Mean Deviation (x - mu)',
        computation: '45.0 - 30.0',
        result: '15.0'
      },
      {
        step: 'Standard Score z',
        computation: 'z = \\frac{15.0}{14.1421}',
        result: '+1.0607'
      }
    ],
    finalOutput: {
      name: 'z-score',
      value: '+1.0607',
      interpretation: 'The value 45.0 lies approximately 1.06 standard deviations above the dataset mean of 30.0.'
    },
    verifiedNote: 'Verified analytically: (45 - 30) / sqrt(200) = 15 / 14.1421356... = 1.06066... matches +1.0607.'
  },
  commonMistakes: [
    'Assuming z-score transformation converts a skewed distribution into a bell curve (it is a strictly linear shift and scale; shape is unchanged).',
    'Failing to handle constant features where standard deviation is zero.',
    'Fitting z-score statistics on test data (data leakage); scaler parameters mu and sigma must be fit strictly on training data.'
  ],
  numericalStabilityNotes: [
    'Add an epsilon (e.g. 1e-8) to denominator in neural network batch normalization layers: z = (x - mu) / sqrt(var + eps).',
    'For small datasets with extreme outliers, RobustScaler (median and IQR) is preferred over z-score.'
  ],
  limitations: [
    'Heavily influenced by extreme outliers, which inflate both the mean and standard deviation.',
    'Only meaningful for interval and ratio data; invalid for categorical or ordinal features.'
  ],
  catalogueId: 'z-score',
  isEngineSupported: false,
  difficulty: 'Foundational',
  tags: ['statistics', 'standardization', 'z-score', 'normalization', 'preprocessing']
};
