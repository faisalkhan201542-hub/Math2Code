import type { PatternDerivation } from '../types';

export const gradientDescentDerivation: PatternDerivation = {
  id: 'gradient-descent',
  pattern: 'gradient_descent',
  title: 'Gradient Descent Optimization Rule',
  subtitle: 'First-Order Iterative Objective Minimization',
  category: 'Machine Learning & Optimization',
  summary:
    'Gradient descent minimizes a differentiable objective function by iteratively moving in the direction of steepest descent, defined by the negative gradient scaled by a learning rate parameter.',
  canonicalFormulaLatex: '\\theta_{t+1} = \\theta_t - \\eta \\nabla J(\\theta_t)',
  targetWhatItCalculates:
    'Updates model parameters theta iteratively to locate local or global minima of loss function J(theta).',
  symbols: [
    {
      symbol: '\\theta_t',
      name: 'Current Parameter Vector',
      mathDomain: '\\theta_t \\in \\mathbb{R}^d',
      role: 'Model parameters at iteration t.'
    },
    {
      symbol: '\\theta_{t+1}',
      name: 'Updated Parameter Vector',
      mathDomain: '\\theta_{t+1} \\in \\mathbb{R}^d',
      role: 'New parameter values for iteration t + 1.'
    },
    {
      symbol: '\\eta',
      name: 'Learning Rate (Step Size)',
      mathDomain: '\\eta \\in (0, \\infty)',
      role: 'Positive scalar controlling magnitude of update along gradient direction.'
    },
    {
      symbol: '\\nabla J(\\theta_t)',
      name: 'Gradient Vector',
      mathDomain: '\\nabla J \\in \\mathbb{R}^d',
      role: 'Vector of first-order partial derivatives pointing in the direction of steepest ascent.'
    },
    {
      symbol: 'J(\\theta)',
      name: 'Objective / Loss Function',
      mathDomain: 'J: \\mathbb{R}^d \\to \\mathbb{R}',
      role: 'Differentiable scalar function to be minimized.'
    }
  ],
  assumptions: [
    'Objective function J(theta) must be differentiable at the current evaluation point theta_t.',
    'Learning rate eta must be strictly positive (eta > 0).',
    'For convergence to global minimum, J(theta) should be convex; in non-convex landscapes, gradient descent may converge to a local minimum or saddle point.'
  ],
  steps: [
    {
      id: 'step-1-evaluate-gradient',
      stepNumber: 1,
      title: 'Evaluate the Gradient (Steepest Ascent)',
      latex: '\\nabla J(\\theta_t) = \\left[ \\frac{\\partial J}{\\partial \\theta_1}, \\dots, \\frac{\\partial J}{\\partial \\theta_d} \\right]^T',
      explanation:
        'Compute the vector of partial derivatives at the current parameter position theta_t. Geometrically, the gradient vector points in the direction of the maximum rate of increase of J.',
      pythonSnippet: 'grad = compute_gradient(theta)',
      pythonExplanation: 'Evaluates analytical or automatic differentiation gradient vector.',
      keyTakeaway: 'The gradient vector defines the orientation of steepest ascent.'
    },
    {
      id: 'step-2-negate-gradient',
      stepNumber: 2,
      title: 'Invert Direction for Steepest Descent',
      latex: '\\mathbf{v} = -\\nabla J(\\theta_t)',
      explanation:
        'Because our objective is minimization rather than maximization, we invert the gradient. The vector -grad(J) points in the direction of steepest descent.',
      pythonSnippet: 'direction = -grad',
      pythonExplanation: 'Negation points opposite to the uphill slope.',
      keyTakeaway: 'Negative gradient points directly downhill toward minimum loss.'
    },
    {
      id: 'step-3-scale-learning-rate',
      stepNumber: 3,
      title: 'Scale Step by Learning Rate (eta)',
      latex: '\\Delta \\theta = -\\eta \\nabla J(\\theta_t)',
      explanation:
        'Multiply the descent direction by learning rate eta. If eta is too large, the update can overshoot and diverge; if eta is too small, convergence will be prohibitively slow.',
      pythonSnippet: 'step = eta * grad',
      pythonExplanation: 'Scales displacement vector by step size hyperparameter.',
      keyTakeaway: 'Controls step length along the descent trajectory.'
    },
    {
      id: 'step-4-parameter-update',
      stepNumber: 4,
      title: 'Apply Parameter Update',
      latex: '\\theta_{t+1} = \\theta_t - \\eta \\nabla J(\\theta_t)',
      explanation:
        'Add the displacement vector to the current parameter vector. Repeat this iteration until the norm of the gradient is smaller than tolerance epsilon or max iterations are reached.',
      pythonSnippet: 'theta_next = theta - eta * grad',
      pythonExplanation: 'Executes the core recurrence relation of gradient descent.',
      keyTakeaway: 'Advances parameter state one step closer to loss minimum.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: 3 Steps on Convex Parabola J(θ) = θ²',
    description: 'Minimize 1D scalar function J(theta) = theta^2 starting from theta_0 = 4.0 with learning rate eta = 0.1.',
    inputs: [
      {
        name: 'theta_0',
        value: '4.0',
        representation: '\\theta_0 = 4.0'
      },
      {
        name: 'eta',
        value: '0.1',
        representation: '\\eta = 0.1, \\; \\nabla J(\\theta) = 2\\theta'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Iteration 1 (t=0)',
        computation: '\\nabla J(4.0) = 2(4.0) = 8.0 \\implies \\theta_1 = 4.0 - 0.1(8.0) = 4.0 - 0.8',
        result: '3.2'
      },
      {
        step: 'Iteration 2 (t=1)',
        computation: '\\nabla J(3.2) = 2(3.2) = 6.4 \\implies \\theta_2 = 3.2 - 0.1(6.4) = 3.2 - 0.64',
        result: '2.56'
      },
      {
        step: 'Iteration 3 (t=2)',
        computation: '\\nabla J(2.56) = 2(2.56) = 5.12 \\implies \\theta_3 = 2.56 - 0.1(5.12) = 2.56 - 0.512',
        result: '2.048'
      }
    ],
    finalOutput: {
      name: 'theta_3',
      value: '2.048',
      interpretation: 'In 3 steps, theta decreased from 4.0 to 2.048, converging geometrically toward true minimum theta* = 0.'
    },
    verifiedNote: 'Verified analytically: theta_t = (1 - 2*eta)^t * theta_0 = (0.8)^3 * 4 = 0.512 * 4 = 2.048.'
  },
  commonMistakes: [
    'Adding the gradient instead of subtracting it (which performs gradient ascent toward maximum).',
    'Setting learning rate too high, causing loss to explode to infinity.',
    'Ignoring vanishing or exploding gradients in deep networks.'
  ],
  numericalStabilityNotes: [
    'Gradient clipping prevents exploding gradients during deep backpropagation.',
    'Adaptive learning rates (Adam, RMSprop) scale individual coordinates to handle ill-conditioned curvature.'
  ],
  limitations: [
    'First-order method: ignores second-order curvature (Hessian matrix), slowing convergence in ravines.',
    'Sensitive to learning rate hyperparameter schedule.'
  ],
  catalogueId: 'gradient-descent-update',
  isEngineSupported: false,
  difficulty: 'Foundational',
  tags: ['optimization', 'gradient descent', 'learning rate', 'convex', 'machine learning']
};
