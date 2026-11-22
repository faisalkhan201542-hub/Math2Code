import type { PatternDerivation } from '../types';

export const meanAbsoluteErrorDerivation: PatternDerivation = {
  id: 'mean-absolute-error',
  pattern: 'mean_absolute_error',
  title: 'Mean Absolute Error (MAE Loss)',
  subtitle: 'Linear Residual Rectification & Outlier-Robust Averaging',
  category: 'Statistics & Evaluation',
  summary:
    'Mean Absolute Error measures the average magnitude of the errors in a set of predictions, without considering their direction, providing a robust metric that does not excessively penalize outliers.',
  canonicalFormulaLatex: '\\operatorname{MAE} = \\frac{1}{n} \\sum_{i=1}^{n} |y_i - \\hat{y}_i|',
  targetWhatItCalculates:
    'Calculates the average absolute linear discrepancy between ground-truth values y and predictions y_hat in original physical units.',
  symbols: [
    {
      symbol: 'y_i',
      name: 'Actual Target Value',
      mathDomain: 'y_i \\in \\mathbb{R}',
      role: 'True observed measurement for sample i.'
    },
    {
      symbol: '\\hat{y}_i',
      name: 'Predicted Value',
      mathDomain: '\\hat{y}_i \\in \\mathbb{R}',
      role: 'Estimated output from model for sample i.'
    },
    {
      symbol: '|y_i - \\hat{y}_i|',
      name: 'Absolute Residual Error',
      mathDomain: '|e_i| \\in [0, \\infty)',
      role: 'Magnitude of error independent of sign.'
    },
    {
      symbol: 'n',
      name: 'Number of Observations',
      mathDomain: 'n \\in \\mathbb{N}, \\; n \\ge 1',
      role: 'Sample count.'
    },
    {
      symbol: '\\operatorname{MAE}',
      name: 'Mean Absolute Error',
      mathDomain: '\\operatorname{MAE} \\in [0, \\infty)',
      role: 'Linear loss metric in same units as target y.'
    }
  ],
  assumptions: [
    'Arrays y and y_hat must be non-empty 1D vectors of identical size n.',
    'Inputs must consist of finite real numerical entries.',
    'MAE is strictly non-negative; MAE = 0 if and only if predictions match targets identically.'
  ],
  steps: [
    {
      id: 'step-1-residuals',
      stepNumber: 1,
      title: 'Calculate Signed Residual Discrepancies',
      latex: 'e_i = y_i - \\hat{y}_i \\quad \\text{for } i = 1, \\dots, n',
      explanation:
        'Subtract predicted value from actual value for each sample. The residual e_i carries both magnitude and sign information.',
      pythonSnippet: 'residuals = y_true - y_pred',
      pythonExplanation: 'Computes signed error differences for each individual sample.',
      keyTakeaway: 'Captures the raw signed difference between observation and model.'
    },
    {
      id: 'step-2-absolute-value',
      stepNumber: 2,
      title: 'Apply Absolute Value Rectification',
      latex: '|e_i| = |y_i - \\hat{y}_i| = \\begin{cases} y_i - \\hat{y}_i & \\text{if } y_i \\ge \\hat{y}_i \\\\ \\hat{y}_i - y_i & \\text{if } y_i < \\hat{y}_i \\end{cases}',
      explanation:
        'Taking the absolute value strips directional sign so negative and positive errors cannot cancel. Unlike MSE, MAE uses linear scaling: an error of 4 is penalized exactly 4 times as much as an error of 1 (not 16 times).',
      pythonSnippet: 'abs_errors = np.abs(residuals)',
      pythonExplanation: 'np.abs computes element-wise absolute value across the array.',
      keyTakeaway: 'Ensures non-negativity with linear, proportional error weighting.'
    },
    {
      id: 'step-3-sum-of-errors',
      stepNumber: 3,
      title: 'Sum the Absolute Residuals (SAE)',
      latex: '\\operatorname{SAE} = \\sum_{i=1}^{n} |y_i - \\hat{y}_i|',
      explanation:
        'Accumulate all individual absolute errors into the total Sum of Absolute Errors.',
      pythonSnippet: 'sae = np.sum(abs_errors)',
      pythonExplanation: 'Reduces the rectified error array to a single cumulative scalar.',
      keyTakeaway: 'Aggregates the total absolute linear deviation over the dataset.'
    },
    {
      id: 'step-4-arithmetic-average',
      stepNumber: 4,
      title: 'Average Across All Samples',
      latex: '\\operatorname{MAE} = \\frac{1}{n} \\sum_{i=1}^{n} |y_i - \\hat{y}_i|',
      explanation:
        'Divide total absolute error by sample size n. Because no squaring or root operations are performed, MAE retains the exact physical units of the target variable y.',
      pythonSnippet: 'mae = np.mean(abs_errors)  # Or sae / len(y_true)',
      pythonExplanation: 'np.mean divides the sum of absolute errors by sample count n.',
      keyTakeaway: 'Yields an intuitive average error expressed in original target units.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: 4-Sample Error Evaluation',
    description: 'Calculate MAE for the same predictions evaluated in the MSE demonstration.',
    inputs: [
      {
        name: 'y_true',
        value: '[3.0, -0.5, 2.0, 7.0]',
        representation: '\\mathbf{y} = [3.0, -0.5, 2.0, 7.0]^T'
      },
      {
        name: 'y_pred',
        value: '[2.5, 0.0, 2.0, 8.0]',
        representation: '\\mathbf{\\hat{y}} = [2.5, 0.0, 2.0, 8.0]^T'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Residuals (y - y_hat)',
        computation: '[3.0 - 2.5, \\; -0.5 - 0.0, \\; 2.0 - 2.0, \\; 7.0 - 8.0]',
        result: '[0.5, -0.5, 0.0, -1.0]'
      },
      {
        step: 'Absolute Residuals',
        computation: '[|0.5|, \\; |-0.5|, \\; |0.0|, \\; |-1.0|]',
        result: '[0.5, 0.5, 0.0, 1.0]'
      },
      {
        step: 'Sum of Absolute Errors (SAE)',
        computation: '0.5 + 0.5 + 0.0 + 1.0',
        result: '2.0'
      },
      {
        step: 'Average Error (SAE / n)',
        computation: '2.0 / 4',
        result: '0.50'
      }
    ],
    finalOutput: {
      name: 'MAE',
      value: '0.50',
      interpretation: 'On average, model predictions deviate by 0.50 units from actual target values.'
    },
    verifiedNote: 'Verified analytically: (0.5 + 0.5 + 0 + 1.0) / 4 = 2.0 / 4 = 0.50.'
  },
  commonMistakes: [
    'Confusing MAE and MSE: MAE measures expected median deviation, whereas MSE measures variance around the conditional mean.',
    'Expecting MAE to be differentiable at zero error; the derivative of |e| has a discontinuity at e = 0 requiring subgradient methods.'
  ],
  numericalStabilityNotes: [
    'MAE does not suffer from floating-point overflow during intermediate squaring, making it inherently more stable than MSE for large values.',
    'Subgradient of MAE is sign(e), which remains constant (+1 or -1) regardless of how close e is to zero.'
  ],
  limitations: [
    'Non-smooth derivative at residual e = 0 makes gradient-based optimization slower near convergence compared to MSE.',
    'Treats all errors proportionally, which may be undesirable if large errors carry catastrophic practical consequences.'
  ],
  catalogueId: 'mean-absolute-error',
  isEngineSupported: false,
  difficulty: 'Foundational',
  tags: ['regression', 'loss', 'evaluation', 'metrics', 'statistics']
};
