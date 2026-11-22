import type { PatternDerivation } from '../types';

export const meanSquaredErrorDerivation: PatternDerivation = {
  id: 'mean-squared-error',
  pattern: 'mean_squared_error',
  title: 'Mean Squared Error (MSE Loss)',
  subtitle: 'Quadratic Residual Loss & Sample Averaging',
  category: 'Statistics & Evaluation',
  summary:
    'Mean Squared Error measures the average squared difference between estimated values and the actual target value, imposing a quadratic penalty that strongly penalizes large prediction errors.',
  canonicalFormulaLatex: '\\operatorname{MSE} = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2',
  targetWhatItCalculates:
    'Computes the mean squared deviation between true observed outcomes y and predicted model outputs y_hat across n observations.',
  symbols: [
    {
      symbol: 'y_i',
      name: 'Actual Target Value',
      mathDomain: 'y_i \\in \\mathbb{R}',
      role: 'True ground-truth observation for sample i.'
    },
    {
      symbol: '\\hat{y}_i',
      name: 'Predicted Value',
      mathDomain: '\\hat{y}_i \\in \\mathbb{R}',
      role: 'Model estimate/prediction for sample i.'
    },
    {
      symbol: 'e_i = y_i - \\hat{y}_i',
      name: 'Residual Error',
      mathDomain: 'e_i \\in \\mathbb{R}',
      role: 'Signed error difference between ground truth and prediction.'
    },
    {
      symbol: 'n',
      name: 'Sample Size',
      mathDomain: 'n \\in \\mathbb{N}, \\; n \\ge 1',
      role: 'Total number of evaluated samples.'
    },
    {
      symbol: '\\operatorname{MSE}',
      name: 'Mean Squared Error',
      mathDomain: '\\operatorname{MSE} \\in [0, \\infty)',
      role: 'Non-negative quadratic loss metric.'
    }
  ],
  assumptions: [
    'Actual targets y and predictions y_hat must be non-empty 1D arrays of identical length n.',
    'Inputs must consist of finite real values (no NaN or infinite elements).',
    'MSE is strictly non-negative; MSE = 0 if and only if predictions match ground truth perfectly across all samples.'
  ],
  steps: [
    {
      id: 'step-1-residuals',
      stepNumber: 1,
      title: 'Compute Sample Residuals (Errors)',
      latex: 'e_i = y_i - \\hat{y}_i \\quad \\text{for } i = 1, \\dots, n',
      explanation:
        'Subtract the model prediction from the true observation for each sample. A positive residual means the model underestimated; negative means it overestimated.',
      pythonSnippet: 'residuals = y_true - y_pred',
      pythonExplanation: 'NumPy computes element-wise subtraction across aligned arrays.',
      keyTakeaway: 'Measures the signed error distance for every individual observation.'
    },
    {
      id: 'step-2-square-errors',
      stepNumber: 2,
      title: 'Square Each Residual (Quadratic Penalty)',
      latex: 'e_i^2 = (y_i - \\hat{y}_i)^2 \\ge 0',
      explanation:
        'Squaring ensures all errors become positive, preventing positive and negative errors from canceling each other out. Crucially, squaring penalizes larger errors quadratically: an error of 4 is penalized 16 times as much as an error of 1.',
      pythonSnippet: 'squared_errors = residuals ** 2',
      pythonExplanation: 'Element-wise exponentiation guarantees non-negativity and convex gradient properties.',
      keyTakeaway: 'Squares eliminate negative signs and heavily penalize severe outlier errors.'
    },
    {
      id: 'step-3-sum-of-squared-errors',
      stepNumber: 3,
      title: 'Sum the Squared Errors (SSE)',
      latex: '\\operatorname{SSE} = \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2',
      explanation:
        'Accumulate all individual squared errors across the dataset. The resulting Sum of Squared Errors represents the total unnormalized variance unexplained by the model.',
      pythonSnippet: 'sse = np.sum(squared_errors)',
      pythonExplanation: 'Reduces the array of squared residuals to a single total error scalar.',
      keyTakeaway: 'Aggregates overall prediction divergence across the entire dataset.'
    },
    {
      id: 'step-4-sample-average',
      stepNumber: 4,
      title: 'Compute the Arithmetic Mean Normalization',
      latex: '\\operatorname{MSE} = \\frac{1}{n} \\operatorname{SSE} = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2',
      explanation:
        'Dividing by sample size n makes the metric invariant to dataset size, allowing fair comparison across datasets with differing numbers of samples.',
      pythonSnippet: 'mse = np.mean(squared_errors)  # Or sse / len(y_true)',
      pythonExplanation: 'np.mean provides direct arithmetic averaging across array elements.',
      keyTakeaway: 'Normalizes total error into a sample-independent average loss.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: 4-Sample Regression Residuals',
    description: 'Calculate the MSE between true continuous targets and model predictions.',
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
        step: 'Squared Errors',
        computation: '[(0.5)^2, \\; (-0.5)^2, \\; (0.0)^2, \\; (-1.0)^2]',
        result: '[0.25, 0.25, 0.0, 1.0]'
      },
      {
        step: 'Sum of Squared Errors (SSE)',
        computation: '0.25 + 0.25 + 0.0 + 1.0',
        result: '1.50'
      },
      {
        step: 'Mean Error (SSE / n)',
        computation: '1.50 / 4',
        result: '0.375'
      }
    ],
    finalOutput: {
      name: 'MSE',
      value: '0.375',
      interpretation: 'Average squared prediction error across the 4 samples is 0.375 units squared.'
    },
    verifiedNote: 'Verified analytically: (0.25 + 0.25 + 0 + 1.0) / 4 = 1.50 / 4 = 0.375.'
  },
  commonMistakes: [
    'Evaluating MSE on arrays with differing sample counts or unaligned indices.',
    'Comparing MSE values across targets measured in different units (since MSE is expressed in squared units of y).',
    'Assuming an MSE of 1.0 means average error is 1.0 unit (taking the square root yields RMSE, which restores original units).'
  ],
  numericalStabilityNotes: [
    'For very large datasets with large values of y, squaring can overflow standard float32 precision; use float64 accumulators.',
    'Differentiable everywhere, making its gradient 2(y_hat - y)/n smooth and ideal for gradient descent.'
  ],
  limitations: [
    'Highly sensitive to outliers: a single massive error will dominate the metric.',
    'Units are squared (e.g. dollars squared, meters squared), requiring RMSE for direct physical interpretation.'
  ],
  catalogueId: 'mean-squared-error',
  isEngineSupported: false,
  difficulty: 'Foundational',
  tags: ['regression', 'loss', 'evaluation', 'metrics', 'statistics']
};
