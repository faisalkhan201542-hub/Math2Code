import type { PatternDerivation } from '../types';

export const l2RegularizationDerivation: PatternDerivation = {
  id: 'l2-regularization',
  pattern: 'l2_regularization',
  title: 'L2 Regularization (Ridge Penalty / Weight Decay)',
  subtitle: 'Squared Weight Penalty & Smooth Shrinkage',
  category: 'Machine Learning & Optimization',
  summary:
    'L2 regularization penalizes the sum of squared weights, shrinking parameters smoothly toward zero. Its strictly convex, spherical geometry handles multicollinearity and prevents overfitting without forcing weights to exact zero.',
  canonicalFormulaLatex: 'J(\\mathbf{w}) = L(\\mathbf{w}) + \\lambda \\sum_{i=1}^d w_i^2 = L(\\mathbf{w}) + \\lambda \\|\\mathbf{w}\\|_2^2',
  targetWhatItCalculates:
    'Penalizes large weights by adding their squared Euclidean magnitude to the loss, stabilizing matrix condition numbers and suppressing variance.',
  symbols: [
    {
      symbol: 'L(\\mathbf{w})',
      name: 'Empirical Loss',
      mathDomain: 'L: \\mathbb{R}^d \\to \\mathbb{R}',
      role: 'Base training loss function.'
    },
    {
      symbol: '\\lambda',
      name: 'Regularization Strength',
      mathDomain: '\\lambda \\in [0, \\infty)',
      role: 'Hyperparameter scaling penalty intensity.'
    },
    {
      symbol: 'w_i',
      name: 'Model Weight',
      mathDomain: 'w_i \\in \\mathbb{R}',
      role: 'Coefficient parameter for feature i.'
    },
    {
      symbol: '\\sum w_i^2 = \\|\\mathbf{w}\\|_2^2',
      name: 'Squared L2 Norm',
      mathDomain: '\\|\\mathbf{w}\\|_2^2 \\in [0, \\infty)',
      role: 'Sum of squared parameter values.'
    },
    {
      symbol: 'J(\\mathbf{w})',
      name: 'Regularized Cost',
      mathDomain: 'J \\in \\mathbb{R}',
      role: 'Combined loss optimized during training.'
    }
  ],
  assumptions: [
    'Regularization hyperparameter lambda >= 0.',
    'Weights are real numerical values.',
    'L2 penalty is strictly convex, smooth, and continuously differentiable everywhere (including at w = 0).'
  ],
  steps: [
    {
      id: 'step-1-squared-penalty',
      stepNumber: 1,
      title: 'Formulate the Squared L2 Penalty Term',
      latex: '\\Omega(\\mathbf{w}) = \\sum_{j=1}^d w_j^2 = \\|\\mathbf{w}\\|_2^2 = \\mathbf{w}^T \\mathbf{w}',
      explanation:
        'Square each weight and sum the results. Squaring penalizes large weights severely while penalizing very small weights lightly. This prevents individual features from dominating the prediction.',
      pythonSnippet: 'l2_penalty = np.sum(w ** 2)',
      pythonExplanation: 'Computes sum of squared weights in vectorized NumPy.',
      keyTakeaway: 'Differentiable quadratic penalty that disproportionately shrinks large weights.'
    },
    {
      id: 'step-2-convention-distinction',
      stepNumber: 2,
      title: 'Conventions: lambda vs. lambda / 2 Scaling',
      latex: 'J_1(\\mathbf{w}) = L(\\mathbf{w}) + \\lambda \\sum w_i^2 \\quad \\text{vs.} \\quad J_2(\\mathbf{w}) = L(\\mathbf{w}) + \\frac{\\lambda}{2} \\sum w_i^2',
      explanation:
        'In statistics and standard Ridge regression, the penalty is typically written with lambda. In deep learning and optimization textbooks, the penalty is often written with lambda / 2 so that when taking the derivative, the 2 from the exponent cancels out with 1/2.',
      pythonSnippet: '# Convention 1: grad_penalty = 2 * lambda * w\n# Convention 2: grad_penalty = lambda * w',
      pythonExplanation: 'Shows the difference in gradient updates between the two standard formulations.',
      keyTakeaway: 'Under lambda * sum(w^2), the gradient is 2*lambda*w; under (lambda/2) * sum(w^2), it is lambda*w.'
    },
    {
      id: 'step-3-gradient-weight-decay',
      stepNumber: 3,
      title: 'Gradient Descent & Weight Decay Update Rule',
      latex: '\\nabla_{\\mathbf{w}} J(\\mathbf{w}) = \\nabla L(\\mathbf{w}) + 2\\lambda \\mathbf{w} \\implies \\mathbf{w}_{t+1} = (1 - 2\\eta\\lambda)\\mathbf{w}_t - \\eta \\nabla L(\\mathbf{w}_t)',
      explanation:
        'Applying gradient descent subtracts eta * (grad(L) + 2*lambda*w). Factoring out w_t shows that each step multiplies the existing weight by (1 - 2*eta*lambda) < 1 before subtracting the loss gradient. This multiplicative shrinking at each step is why L2 regularization is known as "weight decay".',
      pythonSnippet: 'w_next = (1.0 - 2.0 * eta * lmbda) * w - eta * grad_loss',
      pythonExplanation: 'Shows the direct weight decay shrinkage mechanism in gradient descent.',
      keyTakeaway: 'At every iteration, weights are shrunk by a constant decay factor before receiving data updates.'
    },
    {
      id: 'step-4-smooth-shrinkage-geometry',
      stepNumber: 4,
      title: 'Smooth Spherical Geometry (No Exact Zeros)',
      latex: '\\|\\mathbf{w}\\|_2^2 \\le t \\implies \\text{Smooth Spherical / Elliptic Contours}',
      explanation:
        'Unlike the diamond contours of L1, the level sets of L2 are smooth circles / hyperspheres. When elliptical loss contours touch the L2 boundary, the intersection point rarely lies exactly on an axis, so weights shrink toward zero but almost never reach exact zero.',
      pythonSnippet: '# Weights become small (e.g. 0.001) but retain non-zero signals',
      pythonExplanation: 'Explains why L2 does not perform hard feature selection.',
      keyTakeaway: 'L2 performs continuous smooth shrinkage rather than sparse selection.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Regularized Loss & Gradient',
    description: 'Calculate regularized loss J(w) and penalty gradient for L(w) = 1.80, w = [1.0, -2.0, 3.0], and lambda = 0.1.',
    inputs: [
      {
        name: 'L(w)',
        value: '1.80',
        representation: 'L(\\mathbf{w}) = 1.80'
      },
      {
        name: 'w',
        value: '[1.0, -2.0, 3.0]',
        representation: '\\mathbf{w} = [1.0, -2.0, 3.0]^T'
      },
      {
        name: 'lambda',
        value: '0.1',
        representation: '\\lambda = 0.1'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Squared Weights',
        computation: '[(1.0)^2, \\; (-2.0)^2, \\; (3.0)^2]',
        result: '[1.0, 4.0, 9.0]'
      },
      {
        step: 'Sum of Squares',
        computation: '1.0 + 4.0 + 9.0',
        result: '14.0'
      },
      {
        step: 'Regularization Term',
        computation: '\\lambda \\cdot \\sum w_i^2 = 0.1 \\times 14.0',
        result: '1.40'
      },
      {
        step: 'Total Loss J(w)',
        computation: 'J(\\mathbf{w}) = 1.80 + 1.40',
        result: '3.20'
      },
      {
        step: 'Penalty Gradient Contribution',
        computation: '2 \\lambda \\mathbf{w} = 2(0.1)[1.0, -2.0, 3.0]',
        result: '[0.20, -0.40, 0.60]'
      }
    ],
    finalOutput: {
      name: 'Results',
      value: 'J(w) = 3.20 | Grad = [0.20, -0.40, 0.60]',
      interpretation: 'Total loss is 3.20. The penalty pushes the gradient to pull parameters smoothly back toward zero.'
    },
    verifiedNote: 'Verified analytically: J = 1.80 + 0.1*(1 + 4 + 9) = 1.80 + 1.40 = 3.20. Gradient = 2 * 0.1 * w = 0.2 * [1, -2, 3] = [0.2, -0.4, 0.6].'
  },
  commonMistakes: [
    'Confusing gradient of lambda * sum(w^2) with lambda/2 * sum(w^2) (forgetting the factor of 2).',
    'Expecting L2 regularization to zero out irrelevant features (L2 never sets weights exactly to zero; use L1 for that).',
    'Penalizing the bias term b (bias should not be decayed).'
  ],
  numericalStabilityNotes: [
    'In Ridge regression, adding lambda * I to the normal equations matrix (X^T X + lambda I) guarantees invertibility even when X^T X is singular or collinear.',
    'Provides closed-form analytical solution for linear models: w = (X^T X + lambda I)^(-1) X^T y.'
  ],
  limitations: [
    'Retains all features in the model, providing no feature selection.',
    'Does not handle non-linear complex feature interactions without kernel transformation.'
  ],
  catalogueId: 'l2-regularization',
  isEngineSupported: false,
  difficulty: 'Intermediate',
  tags: ['regularization', 'ridge', 'l2 norm', 'weight decay', 'shrinkage']
};
