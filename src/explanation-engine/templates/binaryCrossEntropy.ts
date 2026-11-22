import type { PatternDerivation } from '../types';

export const binaryCrossEntropyDerivation: PatternDerivation = {
  id: 'binary_cross_entropy',
  pattern: 'binary_cross_entropy',
  title: 'Binary Cross-Entropy Loss (BCE / Log Loss)',
  subtitle: 'Negative Log-Likelihood Objective for Calibrated Binary Classification',
  category: 'Deep Learning',
  catalogueId: 'binary-cross-entropy',
  difficulty: 'Intermediate',
  tags: ['deep-learning', 'loss-functions', 'bce', 'cross-entropy', 'logistic-loss'],
  isEngineSupported: false,
  summary:
    'Binary Cross-Entropy (also known as Log Loss) measures the divergence between true binary labels and predicted probabilities by computing the negative log-likelihood under a Bernoulli likelihood model.',
  canonicalFormulaLatex:
    'J(y, p) = -\\frac{1}{n}\\sum_{i=1}^{n}\\left[ y_i \\ln(p_i) + (1 - y_i)\\ln(1 - p_i) \\right]',
  targetWhatItCalculates:
    'Quantifies average penalty per sample, assigning near-zero penalty for confident correct predictions and approaching infinity as predicted probabilities diverge from true binary ground-truth labels.',
  symbols: [
    {
      symbol: 'y_i',
      name: 'True Binary Ground Truth Label',
      mathDomain: 'y_i \\in \\{0, 1\\}',
      role: 'Deterministic indicator for negative (0) or positive (1) class membership.'
    },
    {
      symbol: 'p_i',
      name: 'Predicted Positive Probability',
      mathDomain: 'p_i \\in [0, 1] \\quad (\\text{clipped to } [\\epsilon, 1-\\epsilon])',
      role: 'Model confidence score P(Y = 1 | x_i), typically produced by a Sigmoid output.'
    },
    {
      symbol: '\\ln(p_i)',
      name: 'Natural Logarithm of Predicted Probability',
      mathDomain: '\\ln(p_i) \\in (-\\infty, 0]',
      role: 'Surrogate penalty that escalates dramatically as p_i approaches 0 when y_i = 1.'
    },
    {
      symbol: 'n',
      name: 'Sample Size / Batch Size',
      mathDomain: 'n \\in \\mathbb{Z}_{\\ge 1}',
      role: 'Number of observations over which the loss is averaged.'
    },
    {
      symbol: 'J',
      name: 'Average Binary Cross-Entropy Loss',
      mathDomain: 'J \\in [0, \\infty)',
      role: 'Scalar training loss minimized during stochastic gradient descent.'
    }
  ],
  assumptions: [
    'True labels y_i are strictly binary: y_i in {0, 1}.',
    'Predicted inputs p_i represent probabilities bounded in [0, 1], NOT unconstrained linear logits (if starting from logits z, use J = max(z, 0) - z*y + ln(1 + e^{-|z|})).',
    'To avoid computing ln(0) = -inf, probabilities are clipped to [eps, 1 - eps] where eps ~ 1e-15.',
    'Samples are conditionally independent given features (i.i.d. Bernoulli trials).'
  ],
  steps: [
    {
      id: 'step-1-bernoulli-likelihood',
      stepNumber: 1,
      title: 'Formulate the Bernoulli Likelihood Model',
      latex: 'P(Y = y_i \\mid p_i) = p_i^{y_i} (1 - p_i)^{1 - y_i}',
      explanation:
        'When y_i = 1, the likelihood reduces to p_i^1 (1-p_i)^0 = p_i. When y_i = 0, it reduces to p_i^0 (1-p_i)^1 = 1 - p_i. This compact single expression encapsulates both positive and negative cases.',
      pythonSnippet: 'likelihood = (p ** y) * ((1 - p) ** (1 - y))',
      pythonExplanation: 'Compact algebraic definition of Bernoulli mass function.',
      keyTakeaway: 'The Bernoulli product form unifies both binary outcomes into one continuous function.'
    },
    {
      id: 'step-2-log-likelihood',
      stepNumber: 2,
      title: 'Apply Natural Logarithm to Convert Products into Sums',
      latex: '\\ln P(Y = y_i \\mid p_i) = y_i \\ln(p_i) + (1 - y_i)\\ln(1 - p_i)',
      explanation:
        'Taking the log transforms the joint product likelihood over independent samples into a summation: ln(prod_i L_i) = sum_i ln(L_i). Logarithm is strictly monotonic, preserving all extrema.',
      pythonSnippet: 'log_lik = y * np.log(p) + (1 - y) * np.log(1 - p)',
      pythonExplanation: 'Logarithm replaces fragile multiplications with numerically stable sums.',
      keyTakeaway: 'Log transformation linearizes products and prevents numerical underflow.'
    },
    {
      id: 'step-3-negative-log-loss',
      stepNumber: 3,
      title: 'Negate and Average Over Dataset (Negative Log-Likelihood)',
      latex: 'J = -\\frac{1}{n}\\sum_{i=1}^n \\left[ y_i \\ln(p_i) + (1 - y_i)\\ln(1 - p_i) \\right]',
      explanation:
        'Since optimization algorithms minimize loss rather than maximizing likelihood, we negate the log-likelihood. Dividing by n scales the loss independently of batch size.',
      pythonSnippet: 'loss = -np.mean(y * np.log(p_clipped) + (1 - y) * np.log(1 - p_clipped))',
      pythonExplanation: 'Negation yields a positive loss metric minimized by gradient descent.',
      keyTakeaway: 'Maximizing likelihood is mathematically identical to minimizing negative log-likelihood.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Three-Sample Batch BCE Calculation',
    description: 'Calculate average binary cross-entropy loss for 3 predictions against ground truth labels.',
    inputs: [
      {
        name: 'y_true',
        value: '[1, 0, 1]',
        representation: '\\mathbf{y} = [1, \\, 0, \\, 1]^T'
      },
      {
        name: 'y_pred',
        value: '[0.9, 0.2, 0.4]',
        representation: '\\mathbf{p} = [0.9, \\, 0.2, \\, 0.4]^T'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Sample 1 (y=1, p=0.9)',
        computation: '-\\ln(0.9) \\approx -(-0.10536)',
        result: '0.1054'
      },
      {
        step: 'Sample 2 (y=0, p=0.2)',
        computation: '-\\ln(1 - 0.2) = -\\ln(0.8) \\approx -(-0.22314)',
        result: '0.2231'
      },
      {
        step: 'Sample 3 (y=1, p=0.4)',
        computation: '-\\ln(0.4) \\approx -(-0.91629)',
        result: '0.9163'
      },
      {
        step: 'Batch Average J',
        computation: '\\frac{0.1054 + 0.2231 + 0.9163}{3} = \\frac{1.2448}{3}',
        result: '0.4149'
      }
    ],
    finalOutput: {
      name: 'BCE Loss J',
      value: '0.4149',
      interpretation: 'Average negative log-likelihood across the three samples is 0.4149 nats.'
    },
    verifiedNote: 'Verified against sklearn.metrics.log_loss([1, 0, 1], [0.9, 0.2, 0.4]).'
  },
  commonMistakes: [
    'Passing unconstrained logits directly into BCE: if input can be negative or > 1, apply Sigmoid first or use BCEWithLogitsLoss.',
    'Forgetting probability clipping: if a prediction is exactly 0.0 or 1.0 and wrong, log(0) produces -inf, resulting in NaN losses during backprop.',
    'Non-binary targets: BCE assumes y in {0, 1}; multi-class targets must use Categorical Cross-Entropy.'
  ],
  numericalStabilityNotes: [
    'Clip probabilities p to [eps, 1 - eps] with eps = 1e-15 to eliminate log(0) evaluation.',
    'For neural network training, use the logits form J = max(z, 0) - z*y + log(1 + exp(-|z|)) which combines sigmoid and BCE into a single stable operator.'
  ],
  limitations: [
    'Sensitive to label noise: wrong labels with confident predictions (e.g., y=0 with p=0.999) produce extreme loss penalties that can destabilize gradients.',
    'Requires well-calibrated probabilities for reliable decision-making under class imbalance.'
  ]
};
