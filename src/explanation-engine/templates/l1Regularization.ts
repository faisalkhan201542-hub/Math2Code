import type { PatternDerivation } from '../types';

export const l1RegularizationDerivation: PatternDerivation = {
  id: 'l1-regularization',
  pattern: 'l1_regularization',
  title: 'L1 Regularization (Lasso Penalty)',
  subtitle: 'Absolute Weight Penalty & Sparse Feature Selection',
  category: 'Machine Learning & Optimization',
  summary:
    'L1 regularization adds an absolute-value penalty proportional to the sum of model weights to the loss function. Its diamond-shaped constraint geometry drives non-informative coefficients exactly to zero, performing automated sparse feature selection.',
  canonicalFormulaLatex: 'J(\\mathbf{w}) = L(\\mathbf{w}) + \\lambda \\sum_{i=1}^d |w_i| = L(\\mathbf{w}) + \\lambda \\|\\mathbf{w}\\|_1',
  targetWhatItCalculates:
    'Penalizes model complexity by adding the L1 norm of weights to training loss, encouraging parsimonious sparse representations.',
  symbols: [
    {
      symbol: 'L(\\mathbf{w})',
      name: 'Unregularized Empirical Loss',
      mathDomain: 'L: \\mathbb{R}^d \\to \\mathbb{R}',
      role: 'Measures training error (e.g. MSE or Cross-Entropy).'
    },
    {
      symbol: '\\lambda',
      name: 'Regularization Coefficient',
      mathDomain: '\\lambda \\in [0, \\infty)',
      role: 'Hyperparameter governing strength of shrinkage penalty.'
    },
    {
      symbol: 'w_i',
      name: 'Model Weight Parameter',
      mathDomain: 'w_i \\in \\mathbb{R}',
      role: 'Coefficient assigned to feature i.'
    },
    {
      symbol: '\\|\\mathbf{w}\\|_1',
      name: 'L1 Norm of Weights',
      mathDomain: '\\|\\mathbf{w}\\|_1 = \\sum |w_i| \\ge 0',
      role: 'Sum of absolute magnitudes of all weights.'
    },
    {
      symbol: 'J(\\mathbf{w})',
      name: 'Total Regularized Objective',
      mathDomain: 'J \\in \\mathbb{R}',
      role: 'Cost function minimized during model training.'
    }
  ],
  assumptions: [
    'Regularization strength lambda must be non-negative (lambda >= 0).',
    'Weights must be real numerical parameters.',
    'The absolute-value function |w_i| is non-differentiable at w_i = 0, so standard ordinary derivatives do not exist at zero; optimization relies on subgradient descent or coordinate descent / soft-thresholding.'
  ],
  steps: [
    {
      id: 'step-1-empirical-loss',
      stepNumber: 1,
      title: 'Define Base Empirical Loss Function',
      latex: 'L(\\mathbf{w}) = \\frac{1}{n} \\sum_{i=1}^n \\ell(y_i, \\hat{y}_i(\\mathbf{w}))',
      explanation:
        'The unregularized loss measures how well the model fits the training data. Without regularization, overparameterized models can overfit noise by developing arbitrarily large, canceling weights.',
      pythonSnippet: 'loss = compute_data_loss(y_true, y_pred)',
      pythonExplanation: 'Computes base prediction loss on the dataset.',
      keyTakeaway: 'The empirical loss drives model accuracy on training data.'
    },
    {
      id: 'step-2-l1-penalty-term',
      stepNumber: 2,
      title: 'Formulate the L1 Absolute Norm Penalty',
      latex: '\\Omega(\\mathbf{w}) = \\sum_{j=1}^d |w_j| = \\|\\mathbf{w}\\|_1',
      explanation:
        'Sum the absolute values of all weights. Each non-zero weight contributes linearly to the complexity budget regardless of whether it is positive or negative.',
      pythonSnippet: 'l1_penalty = np.sum(np.abs(w))',
      pythonExplanation: 'np.abs computes absolute values and np.sum aggregates them.',
      keyTakeaway: 'Penalizes model complexity linearly with weight magnitude.'
    },
    {
      id: 'step-3-sparsity-geometry',
      stepNumber: 3,
      title: 'Geometric Intuition: Diamond Corners & Exact Zeros',
      latex: '\\|\\mathbf{w}\\|_1 \\le t \\implies \\text{Hyperoctahedron (Diamond) Contours in } \\mathbb{R}^d',
      explanation:
        'In 2D, the L1 constraint region is a diamond with sharp vertices on the coordinate axes (w1=0 or w2=0). Because elliptic loss contours expand outward from the unconstrained minimum, they almost always touch one of these sharp corners first, driving that coordinate exactly to zero.',
      pythonSnippet: '# Non-zero weights become exactly zero under proximal soft-thresholding:\n# w = sign(w) * max(0, abs(w) - lambda * lr)',
      pythonExplanation: 'Proximal soft-thresholding sets small weights exactly to 0.',
      keyTakeaway: 'The geometric corners of L1 norm balls produce exact feature sparsity.'
    },
    {
      id: 'step-4-subgradient-at-zero',
      stepNumber: 4,
      title: 'Subgradient Formulation & Non-Differentiability at Zero',
      latex: '\\partial |w_j| = \\begin{cases} +1 & \\text{if } w_j > 0 \\\\ -1 & \\text{if } w_j < 0 \\\\ [-1, +1] & \\text{if } w_j = 0 \\end{cases}',
      explanation:
        'The absolute value function has a sharp corner at zero where the ordinary derivative does not exist. Instead, convex analysis defines the subdifferential at zero as the entire interval [-1, +1]. Standard gradient descent is replaced by subgradient descent or coordinate descent (e.g. glmnet/scikit-learn Lasso).',
      pythonSnippet: 'subgrad = np.sign(w)  # Note: sign(0) = 0 in NumPy convention',
      pythonExplanation: 'Demonstrates subgradient selection at non-zero points.',
      keyTakeaway: 'L1 is non-differentiable at zero, requiring subgradient or proximal algorithms.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Regularized Loss Calculation',
    description: 'Calculate total L1 regularized loss for a model with 4 weights, empirical loss L = 2.50, and lambda = 0.5.',
    inputs: [
      {
        name: 'L(w)',
        value: '2.50',
        representation: 'L(\\mathbf{w}) = 2.50 \\text{ (empirical training loss)}'
      },
      {
        name: 'w',
        value: '[0.4, -0.3, 0.0, 0.1]',
        representation: '\\mathbf{w} = [0.4, -0.3, 0.0, 0.1]^T'
      },
      {
        name: 'lambda',
        value: '0.5',
        representation: '\\lambda = 0.5'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Compute Absolute Weights',
        computation: '[|0.4|, \\; |-0.3|, \\; |0.0|, \\; |0.1|]',
        result: '[0.4, 0.3, 0.0, 0.1]'
      },
      {
        step: 'L1 Norm (Sum of Absolutes)',
        computation: '0.4 + 0.3 + 0.0 + 0.1',
        result: '0.80'
      },
      {
        step: 'Scaled Penalty Term',
        computation: '\\lambda \\cdot \\|\\mathbf{w}\\|_1 = 0.5 \\times 0.80',
        result: '0.40'
      },
      {
        step: 'Total Objective J(w)',
        computation: 'J(\\mathbf{w}) = L(\\mathbf{w}) + \\lambda \\|\\mathbf{w}\\|_1 = 2.50 + 0.40',
        result: '2.90'
      }
    ],
    finalOutput: {
      name: 'J(w)',
      value: '2.90',
      interpretation: 'Regularized cost includes 2.50 data loss plus 0.40 complexity penalty, encouraging weight pruning.'
    },
    verifiedNote: 'Verified analytically: 2.50 + 0.5 * (|0.4| + |-0.3| + |0.0| + |0.1|) = 2.50 + 0.5 * 0.8 = 2.90.'
  },
  commonMistakes: [
    'Claiming that the ordinary derivative of |w| at w = 0 is 0 (it is non-differentiable; subdifferential is [-1, 1]).',
    'Applying standard smooth gradient descent and expecting weights to hit exact zero (floating-point updates will oscillate around zero without proximal soft-thresholding).',
    'Regularizing the bias/intercept term (standard practice only regularizes feature weights, not intercept b).'
  ],
  numericalStabilityNotes: [
    'Lasso optimization should use coordinate descent (shooting algorithm) or FISTA/ISTA for fast, exact zero convergence.',
    'lambda = 0 reduces to ordinary least squares (OLS).'
  ],
  limitations: [
    'If features are highly correlated, Lasso tends to arbitrarily select one and zero out the others (Elastic Net balances L1 and L2 to mitigate this).',
    'In p > n settings (more features than samples), Lasso can select at most n features.'
  ],
  catalogueId: 'l1-regularization',
  isEngineSupported: false,
  difficulty: 'Intermediate',
  tags: ['regularization', 'lasso', 'l1 norm', 'sparsity', 'feature selection']
};
