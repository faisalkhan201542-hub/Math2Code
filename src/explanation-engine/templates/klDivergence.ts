import type { PatternDerivation } from '../types';

export const klDivergenceDerivation: PatternDerivation = {
  id: 'kl-divergence',
  pattern: 'kl_divergence',
  title: 'Kullback-Leibler (KL) Divergence',
  subtitle: 'Relative Entropy & Information Discrepancy Between Distributions',
  category: 'Probability & Information Theory',
  summary:
    'KL divergence measures the statistical distance or information inefficiency incurred when an approximating distribution Q is used to represent a true distribution P. It is non-negative and asymmetric, and is not a true distance metric.',
  canonicalFormulaLatex: 'D_{\\mathrm{KL}}(P \\parallel Q) = \\sum_{i=1}^{K} p_i \\ln\\left(\\frac{p_i}{q_i}\\right) = \\sum_{i=1}^{K} p_i [\\ln(p_i) - \\ln(q_i)]',
  targetWhatItCalculates:
    'Quantifies the excess expected surprise (in nats when using natural log) when encoding outcomes distributed according to P using code optimized for Q.',
  symbols: [
    {
      symbol: 'P',
      name: 'True Probability Distribution',
      mathDomain: 'p_i \\in [0.0, 1.0], \\; \\sum p_i = 1.0',
      role: 'Reference / ground-truth distribution.'
    },
    {
      symbol: 'Q',
      name: 'Approximating Distribution',
      mathDomain: 'q_i \\in [0.0, 1.0], \\; \\sum q_i = 1.0',
      role: 'Model / estimated probability distribution.'
    },
    {
      symbol: '\\ln(p_i / q_i)',
      name: 'Log-Likelihood Ratio',
      mathDomain: '\\mathbb{R} \\cup \\{+\\infty\\}',
      role: 'Pointwise surprise discrepancy for state i.'
    },
    {
      symbol: 'D_{\\mathrm{KL}}(P \\parallel Q)',
      name: 'Relative Entropy',
      mathDomain: 'D_{\\mathrm{KL}} \\in [0.0, \\infty]',
      role: 'Non-negative asymmetric divergence metric.'
    }
  ],
  assumptions: [
    'Both P and Q must be valid probability distributions on the same discrete state space: p_i >= 0, q_i >= 0, sum(p_i) = 1, sum(q_i) = 1.',
    'Support condition: If p_i > 0 and q_i = 0, D_KL(P || Q) = +infinity (Q is impossible where P is possible).',
    'Zero contribution: If p_i = 0, the term p_i * ln(p_i / q_i) contributes 0 by continuity, even if q_i > 0.',
    'Not a distance metric: Fails symmetry (D_KL(P || Q) != D_KL(Q || P)) and fails the triangle inequality.',
    'No silent smoothing: Implementations must not silently add arbitrary Laplace or epsilon smoothing unless explicitly configured.'
  ],
  steps: [
    {
      id: 'step-1-log-ratio',
      stepNumber: 1,
      title: 'Formulate the Log-Likelihood Ratio',
      latex: '\\ln\\left(\\frac{p_i}{q_i}\\right) = \\ln(p_i) - \\ln(q_i)',
      explanation:
        'Compare the probabilities assigned to outcome i. If model Q assigns lower probability than true P (q_i < p_i), the ratio is greater than 1 and its log is positive, indicating an information penalty for underestimating.',
      pythonSnippet: 'log_ratio = np.log(p / q)',
      pythonExplanation: 'Computes pointwise log probability ratios.',
      keyTakeaway: 'The log ratio measures the relative surprise difference per outcome.'
    },
    {
      id: 'step-2-expected-discrepancy',
      stepNumber: 2,
      title: 'Take the Expectation Under True Distribution P',
      latex: 'D_{\\mathrm{KL}}(P \\parallel Q) = \\mathbb{E}_{X \\sim P}\\left[\\ln\\left(\\frac{P(X)}{Q(X)}\\right)\\right] = \\sum_{i=1}^K p_i \\ln\\left(\\frac{p_i}{q_i}\\right)',
      explanation:
        'Because the true data generation process follows distribution P, we weight the log-ratios by p_i. Notice that expectations are taken under P, not Q, which directly causes the asymmetry of the divergence.',
      pythonSnippet: 'expected_divergence = np.sum(p * np.log(p / q))',
      pythonExplanation: 'Weights discrepancies by actual occurrence frequencies under P.',
      keyTakeaway: 'Expectation under P creates the foundational asymmetry of KL divergence.'
    },
    {
      id: 'step-3-support-and-zero-conditions',
      stepNumber: 3,
      title: 'Handle Support Conditions and Zero Probabilities',
      latex: '\\begin{cases} p_i = 0 & \\implies p_i \\ln(p_i / q_i) = 0 \\\\ p_i > 0 \\text{ and } q_i = 0 & \\implies D_{\\mathrm{KL}}(P \\parallel Q) = +\\infty \\end{cases}',
      explanation:
        'When p_i = 0, lim_{p -> 0+} p * ln(p / q) = 0 regardless of q_i. However, if p_i > 0 and q_i = 0, model Q claims an event is impossible when it actually occurs, which incurs an infinite information penalty (D_KL = +infinity).',
      pythonSnippet: 'if np.any((p > 0) & (q == 0)):\n    return float("inf")',
      pythonExplanation: 'Strict support condition check prevents silent NaN errors.',
      keyTakeaway: 'Infinite penalty when Q assigns zero probability to an event that occurs in P.'
    },
    {
      id: 'step-4-gibbs-inequality-asymmetry',
      stepNumber: 4,
      title: 'Gibbs\' Inequality & Asymmetry (Why it is Not a Distance)',
      latex: 'D_{\\mathrm{KL}}(P \\parallel Q) \\ge 0, \\quad D_{\\mathrm{KL}}(P \\parallel Q) = 0 \\iff P = Q, \\quad D_{\\mathrm{KL}}(P \\parallel Q) \\ne D_{\\mathrm{KL}}(Q \\parallel P)',
      explanation:
        'By Jensen\'s inequality applied to the convex function -ln(x), D_KL is guaranteed non-negative (Gibbs\' inequality). It equals zero if and only if P and Q are identical. Because D_KL(P || Q) != D_KL(Q || P) and it violates the triangle inequality, it is mathematically a directed divergence, never a metric distance.',
      pythonSnippet: '# D_KL(P || Q) != D_KL(Q || P) in general',
      pythonExplanation: 'Illustrates directional asymmetry.',
      keyTakeaway: 'Non-negative and strictly zero iff P = Q, but fundamentally non-symmetric.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Binary Distributions Divergence',
    description: 'Calculate D_KL(P || Q) and reverse D_KL(Q || P) using natural log (nats) for P = [0.6, 0.4] and Q = [0.5, 0.5].',
    inputs: [
      {
        name: 'True Distribution P',
        value: '[0.6, 0.4]',
        representation: 'P = [0.6, 0.4]^T'
      },
      {
        name: 'Approximating Distribution Q',
        value: '[0.5, 0.5]',
        representation: 'Q = [0.5, 0.5]^T'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Term 1 for P || Q (i=1)',
        computation: 'p_1 \\ln(p_1 / q_1) = 0.6 \\ln(0.6 / 0.5) = 0.6 \\ln(1.2) = 0.6 \\times 0.182321',
        result: '0.109393 nats'
      },
      {
        step: 'Term 2 for P || Q (i=2)',
        computation: 'p_2 \\ln(p_2 / q_2) = 0.4 \\ln(0.4 / 0.5) = 0.4 \\ln(0.8) = 0.4 \\times (-0.223143)',
        result: '-0.089257 nats'
      },
      {
        step: 'Total D_KL(P || Q)',
        computation: '0.109393 + (-0.089257)',
        result: '0.020136 nats'
      },
      {
        step: 'Reverse D_KL(Q || P) Demonstration of Asymmetry',
        computation: '0.5 \\ln(0.5/0.6) + 0.5 \\ln(0.5/0.4) = 0.5(-0.18232) + 0.5(0.22314) = -0.09116 + 0.11157',
        result: '0.020411 nats (!= 0.020136)'
      }
    ],
    finalOutput: {
      name: 'D_KL Results',
      value: 'D_KL(P||Q) = 0.0201 nats | D_KL(Q||P) = 0.0204 nats',
      interpretation: 'The small positive divergence indicates Q is a close approximation of P. Asymmetry is explicitly verified.'
    },
    verifiedNote: 'Verified analytically: 0.6*ln(1.2) + 0.4*ln(0.8) = 0.109392 + (-0.089257) = 0.020135... nats.'
  },
  commonMistakes: [
    'Treating KL divergence as symmetric (assuming D_KL(P || Q) = D_KL(Q || P)).',
    'Calling KL divergence a "distance metric" (it violates symmetry and the triangle inequality).',
    'Adding arbitrary smoothing without documenting it or hiding infinite values when Q has zeros where P does not.'
  ],
  numericalStabilityNotes: [
    'Logarithm base convention: Natural log (nats) is standard in machine learning (PyTorch/TensorFlow); base 2 yields bits.',
    'Scipy entropy function `scipy.stats.entropy(pk, qk)` uses natural log by default.'
  ],
  limitations: [
    'Requires discrete distributions over the exact same domain.',
    'Explodes to infinity whenever Q has zero support where P is positive.'
  ],
  catalogueId: 'kl-divergence',
  isEngineSupported: false,
  difficulty: 'Intermediate',
  tags: ['information theory', 'probability', 'kl divergence', 'relative entropy', 'asymmetric']
};
