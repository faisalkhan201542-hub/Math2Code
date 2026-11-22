import type { PatternDerivation } from '../types';

export const chainRuleDerivation: PatternDerivation = {
  id: 'chain-rule',
  pattern: 'chain_rule',
  title: 'Calculus Chain Rule',
  subtitle: 'Differentiation of Composite Functions & Backpropagation Core',
  category: 'Calculus & Optimization',
  summary:
    'The chain rule computes the derivative of a composite function by multiplying the derivative of the outer function evaluated at the inner function by the derivative of the inner function.',
  canonicalFormulaLatex: 'y = f(g(x)) \\implies \\frac{dy}{dx} = f\'(g(x)) \\cdot g\'(x) = \\frac{dy}{du} \\cdot \\frac{du}{dx} \\quad \\text{where } u = g(x)',
  targetWhatItCalculates:
    'Calculates the instantaneous rate of change of a composite function with respect to its fundamental independent variable.',
  symbols: [
    {
      symbol: 'x',
      name: 'Independent Variable',
      mathDomain: 'x \\in \\mathbb{R}',
      role: 'Core input variable.'
    },
    {
      symbol: 'u = g(x)',
      name: 'Intermediate Inner Function',
      mathDomain: 'g: \\mathbb{R} \\to \\mathbb{R}',
      role: 'First transformation applied to x.'
    },
    {
      symbol: 'y = f(u)',
      name: 'Outer Function',
      mathDomain: 'f: \\mathbb{R} \\to \\mathbb{R}',
      role: 'Second transformation applied to intermediate result u.'
    },
    {
      symbol: '\\frac{dy}{du} = f\'(u)',
      name: 'Outer Derivative',
      mathDomain: 'f\' \\in \\mathbb{R}',
      role: 'Sensitivity of y to changes in intermediate variable u.'
    },
    {
      symbol: '\\frac{du}{dx} = g\'(x)',
      name: 'Inner Derivative',
      mathDomain: 'g\' \\in \\mathbb{R}',
      role: 'Sensitivity of u to changes in primary input x.'
    }
  ],
  assumptions: [
    'Function g must be differentiable at point x.',
    'Function f must be differentiable at point u = g(x).',
    'Forms the mathematical foundation of deep learning backpropagation, where loss gradients propagate backward through sequential layer compositions.'
  ],
  steps: [
    {
      id: 'step-1-composite-decomposition',
      stepNumber: 1,
      title: 'Decompose the Composite Function',
      latex: 'y = f(g(x)) \\implies \\text{Define intermediate variable } u = g(x) \\implies y = f(u)',
      explanation:
        'Break the nested operation into a sequential pipeline: the input x is transformed by g to produce u, and u is transformed by f to produce y.',
      pythonSnippet: 'u = g(x)\ny = f(u)',
      pythonExplanation: 'Represents the forward pass through two sequential computational layers.',
      keyTakeaway: 'Expresses a complex composite function as a composition of simpler primitive functions.'
    },
    {
      id: 'step-2-differentiate-outer',
      stepNumber: 2,
      title: 'Differentiate Outer Function with Respect to Inner Variable',
      latex: '\\frac{dy}{du} = f\'(u) = f\'(g(x))',
      explanation:
        'Compute the derivative of f treating u as a single independent variable. This measures how fast y changes when u shifts by a small delta.',
      pythonSnippet: 'dy_du = df_du(u)',
      pythonExplanation: 'Evaluates the outer derivative at the intermediate activation value.',
      keyTakeaway: 'The outer derivative isolates the sensitivity of output to intermediate state.'
    },
    {
      id: 'step-3-differentiate-inner',
      stepNumber: 3,
      title: 'Differentiate Inner Function with Respect to Input x',
      latex: '\\frac{du}{dx} = g\'(x)',
      explanation:
        'Compute the derivative of the inner transformation g with respect to x. This measures how much u changes per unit change in input x.',
      pythonSnippet: 'du_dx = dg_dx(x)',
      pythonExplanation: 'Evaluates the inner Jacobian / gradient with respect to primary input.',
      keyTakeaway: 'The inner derivative isolates the sensitivity of intermediate state to primary input.'
    },
    {
      id: 'step-4-chain-multiplication',
      stepNumber: 4,
      title: 'Multiply the Rates of Change (Chain Step)',
      latex: '\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx} = f\'(g(x)) \\cdot g\'(x)',
      explanation:
        'By the chain rule, the overall sensitivity dy/dx is the product of the intermediate sensitivities. In multi-layer neural networks, backpropagation repeats this multiplication across all layers using tensor contractions.',
      pythonSnippet: 'dy_dx = dy_du * du_dx',
      pythonExplanation: 'Multiplies the sensitivities together to obtain total end-to-end gradient.',
      keyTakeaway: 'Sensitivities chain multiplicatively across sequential transformations.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: y = (3x + 1)²',
    description: 'Differentiate the composite quadratic function y = (3x + 1)^2 and evaluate at x = 2.0.',
    inputs: [
      {
        name: 'f(u)',
        value: 'u^2',
        representation: 'f(u) = u^2 \\implies f\'(u) = 2u'
      },
      {
        name: 'g(x)',
        value: '3x + 1',
        representation: 'g(x) = 3x + 1 \\implies g\'(x) = 3'
      },
      {
        name: 'x_eval',
        value: '2.0',
        representation: 'x = 2.0'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Evaluate Inner Function u = g(2)',
        computation: 'u = 3(2.0) + 1 = 6.0 + 1',
        result: '7.0'
      },
      {
        step: 'Outer Derivative dy/du at u = 7.0',
        computation: '\\frac{dy}{du} = 2u = 2(7.0)',
        result: '14.0'
      },
      {
        step: 'Inner Derivative du/dx',
        computation: '\\frac{du}{dx} = 3',
        result: '3.0'
      },
      {
        step: 'Chain Rule Product (dy/dx)',
        computation: '\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx} = 14.0 \\times 3.0',
        result: '42.0'
      },
      {
        step: 'Analytical Verification via Polynomial Expansion',
        computation: 'y = 9x^2 + 6x + 1 \\implies y\' = 18x + 6; \\quad y\'(2) = 18(2) + 6 = 36 + 6',
        result: '42.0 (Exact Match)'
      }
    ],
    finalOutput: {
      name: 'dy/dx at x=2.0',
      value: '42.0',
      interpretation: 'At x = 2.0, the composite function y increases at an instantaneous rate of 42.0 units per unit change in x.'
    },
    verifiedNote: 'Verified analytically: Chain rule yields 2(3x+1)*3 = 18x + 6. At x=2: 18(2)+6 = 42.0. Expansion yields 18x + 6 = 42.0.'
  },
  commonMistakes: [
    'Forgetting to multiply by the inner derivative g\'(x) (e.g. claiming d/dx (3x+1)^2 = 2(3x+1) instead of 6(3x+1)).',
    'Evaluating the outer derivative at x instead of at u = g(x).',
    'In matrix calculus, multiplying Jacobians in the wrong order (matrix multiplication is non-commutative).'
  ],
  numericalStabilityNotes: [
    'Chaining many derivatives smaller than 1.0 causes the vanishing gradient problem in deep networks.',
    'Chaining many derivatives larger than 1.0 causes exploding gradients, requiring gradient clipping or residual connections.'
  ],
  limitations: [
    'Requires both f and g to be differentiable at the point of interest.',
    'Functions with sharp corners (like ReLU at 0 or absolute value at 0) require subgradient calculus.'
  ],
  catalogueId: 'backpropagation-chain-rule',
  isEngineSupported: false,
  difficulty: 'Intermediate',
  tags: ['calculus', 'derivatives', 'chain rule', 'backpropagation', 'deep learning']
};
