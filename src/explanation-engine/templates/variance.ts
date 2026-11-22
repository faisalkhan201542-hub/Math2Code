import type { PatternDerivation } from '../types';

export const varianceDerivation: PatternDerivation = {
  id: 'variance',
  pattern: 'variance',
  title: 'Variance & Bessel\'s Correction',
  subtitle: 'Population Variance vs. Unbiased Sample Estimator',
  category: 'Statistics & Evaluation',
  summary:
    'Variance quantifies the statistical dispersion of data points around their arithmetic mean. For full populations, dividing by N computes the true variance; for samples, dividing by n - 1 (Bessel\'s correction) eliminates downward estimation bias.',
  canonicalFormulaLatex: '\\sigma^2 = \\frac{1}{N}\\sum_{i=1}^{N}(x_i - \\mu)^2 \\quad \\text{vs.} \\quad s^2 = \\frac{1}{n-1}\\sum_{i=1}^{n}(x_i - \\bar{x})^2',
  targetWhatItCalculates:
    'Measures the expected squared deviation of a random variable or sample array from its central mean value.',
  symbols: [
    {
      symbol: 'x_i',
      name: 'Observed Data Point',
      mathDomain: 'x_i \\in \\mathbb{R}',
      role: 'Individual measurement in population or sample.'
    },
    {
      symbol: '\\mu, \\bar{x}',
      name: 'Population / Sample Mean',
      mathDomain: '\\mu, \\bar{x} \\in \\mathbb{R}',
      role: 'Arithmetic center of the distribution.'
    },
    {
      symbol: 'N',
      name: 'Population Size',
      mathDomain: 'N \\in \\mathbb{N}, \\; N \\ge 1',
      role: 'Total count of all members of the entire population.'
    },
    {
      symbol: 'n',
      name: 'Sample Size',
      mathDomain: 'n \\in \\mathbb{N}, \\; n \\ge 2',
      role: 'Count of observed subset measurements for sample estimation.'
    },
    {
      symbol: '\\sigma^2, s^2',
      name: 'Population / Sample Variance',
      mathDomain: '\\sigma^2, s^2 \\in [0, \\infty)',
      role: 'Squared dispersion metric.'
    }
  ],
  assumptions: [
    'For population variance, N >= 1; for sample variance, n >= 2 (to prevent division by zero in n - 1).',
    'Data points must be finite real numerical observations.',
    'Variance is strictly non-negative; variance = 0 if and only if all observed values are identical (constant array).'
  ],
  steps: [
    {
      id: 'step-1-mean-calculation',
      stepNumber: 1,
      title: 'Compute the Central Arithmetic Mean',
      latex: '\\mu = \\frac{1}{N}\\sum_{i=1}^N x_i \\quad \\text{or} \\quad \\bar{x} = \\frac{1}{n}\\sum_{i=1}^n x_i',
      explanation:
        'Calculate the center of mass of the data. The sum of deviations around the arithmetic mean is identically zero: sum(x_i - mean) = 0.',
      pythonSnippet: 'mean_val = np.mean(x)',
      pythonExplanation: 'np.mean computes the average of the array values.',
      keyTakeaway: 'The mean is the reference anchor around which all dispersion is evaluated.'
    },
    {
      id: 'step-2-mean-deviations',
      stepNumber: 2,
      title: 'Calculate Centered Deviations from the Mean',
      latex: 'd_i = x_i - \\mu \\quad \\text{(or } x_i - \\bar{x} \\text{)}',
      explanation:
        'Subtract the mean from each data point. Values greater than the mean yield positive deviations; values less than the mean yield negative deviations.',
      pythonSnippet: 'deviations = x - mean_val',
      pythonExplanation: 'Centers the data distribution exactly at zero.',
      keyTakeaway: 'Measures signed distance of each sample from the distribution center.'
    },
    {
      id: 'step-3-sum-of-squared-deviations',
      stepNumber: 3,
      title: 'Square Deviations and Accumulate (SS)',
      latex: 'SS = \\sum_{i=1}^{n} (x_i - \\bar{x})^2',
      explanation:
        'Squaring ensures all distances contribute positively and penalizes wider deviations quadratically. The sum of squared deviations (SS) captures total raw variability.',
      pythonSnippet: 'ss = np.sum((x - mean_val) ** 2)',
      pythonExplanation: 'Computes sum of squares of centered deviations.',
      keyTakeaway: 'Aggregates total unnormalized dispersion.'
    },
    {
      id: 'step-4-denominator-bessels-correction',
      stepNumber: 4,
      title: 'Degrees of Freedom: Population N vs Sample n - 1',
      latex: '\\sigma^2 = \\frac{SS}{N} \\quad \\text{vs.} \\quad s^2 = \\frac{SS}{n - 1}',
      explanation:
        'When evaluating an entire population, all N deviations from true mean mu are known, so we divide by N. However, in sample data, the true population mean mu is unknown and replaced by sample mean x_bar. Because x_bar is chosen to minimize sum(x_i - x_bar)^2, sample deviations are artificially tighter around x_bar than around true mu. Dividing by n underestimates true variance by a factor of (n-1)/n. Dividing by n - 1 (Bessel\'s correction) cancels this bias exactly, ensuring E[s^2] = sigma^2.',
      pythonSnippet: 'var_pop = np.var(x, ddof=0)  # N\nvar_sample = np.var(x, ddof=1)  # n-1',
      pythonExplanation: 'NumPy np.var takes ddof (Delta Degrees of Freedom): ddof=0 for population, ddof=1 for sample.',
      keyTakeaway: 'Bessel\'s correction n - 1 provides an unbiased variance estimator for samples.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: 8-Sample Variance Calculation',
    description: 'Calculate both population variance and unbiased sample variance for a discrete dataset.',
    inputs: [
      {
        name: 'x',
        value: '[2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0]',
        representation: 'x = \\{2, 4, 4, 4, 5, 5, 7, 9\\}, \\; n = 8'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Compute Mean',
        computation: '\\bar{x} = (2 + 4 + 4 + 4 + 5 + 5 + 7 + 9) / 8 = 40.0 / 8',
        result: '5.0'
      },
      {
        step: 'Deviations (x - 5.0)',
        computation: '[2-5, 4-5, 4-5, 4-5, 5-5, 5-5, 7-5, 9-5]',
        result: '[-3, -1, -1, -1, 0, 0, 2, 4]'
      },
      {
        step: 'Squared Deviations (SS)',
        computation: '(-3)^2 + 3(-1)^2 + 2(0)^2 + (2)^2 + (4)^2 = 9 + 3 + 0 + 4 + 16',
        result: '32.0'
      },
      {
        step: 'Population Variance (N=8)',
        computation: '\\sigma^2 = 32.0 / 8',
        result: '4.0'
      },
      {
        step: 'Sample Variance (n-1=7)',
        computation: 's^2 = 32.0 / (8 - 1) = 32.0 / 7',
        result: '4.5714'
      }
    ],
    finalOutput: {
      name: 'Variance Results',
      value: 'Pop: 4.0 | Sample: 4.5714',
      interpretation: 'Sample variance (4.5714) is larger than population variance (4.0) to correct for sample mean estimation bias.'
    },
    verifiedNote: 'Verified analytically: sum of squares = 32.0. Pop var = 32/8 = 4.0. Sample var = 32/7 = 4.5714.'
  },
  commonMistakes: [
    'Using default numpy ddof=0 when an unbiased sample variance estimator is required (use ddof=1).',
    'Attempting sample variance on a single observation (n = 1), causing division by zero (n - 1 = 0).',
    'Confusing variance (squared units) with standard deviation (square root of variance, original units).'
  ],
  numericalStabilityNotes: [
    'The naive formula sum(x^2)/n - mean^2 suffers from severe catastrophic cancellation when mean^2 >> var; two-pass or Welford\'s algorithm is numerically stable.',
    'For constant inputs (all identical elements), variance is exactly 0.0.'
  ],
  limitations: [
    'Variance is expressed in squared units of measurement, making direct physical interpretation less intuitive than standard deviation.',
    'Heavily influenced by extreme outliers due to quadratic squaring.'
  ],
  catalogueId: 'variance-std',
  isEngineSupported: false,
  difficulty: 'Foundational',
  tags: ['statistics', 'variance', 'dispersion', 'bessel correction', 'sample']
};
