import type { PatternDerivation } from '../types';

export const entropyDerivation: PatternDerivation = {
  id: 'entropy',
  pattern: 'entropy',
  title: 'Shannon Entropy',
  subtitle: 'Expected Information Content & Uncertainty in Probability Distributions',
  category: 'Probability & Information Theory',
  summary:
    'Shannon entropy quantifies the expected amount of information, surprise, or uncertainty inherent in a discrete probability distribution. It reaches zero for deterministic outcomes and attains its maximum for uniform distributions.',
  canonicalFormulaLatex: 'H(X) = -\\sum_{i=1}^{K} p_i \\log_2(p_i) = \\sum_{i=1}^{K} p_i \\log_2\\left(\\frac{1}{p_i}\\right)',
  targetWhatItCalculates:
    'Measures the average information (in bits when using base-2 logarithm) required to encode an event drawn from discrete probability distribution P.',
  symbols: [
    {
      symbol: 'p_i',
      name: 'Event Probability',
      mathDomain: 'p_i \\in [0.0, 1.0], \\; \\sum_{i=1}^K p_i = 1.0',
      role: 'Probability of outcome i in sample space.'
    },
    {
      symbol: 'K',
      name: 'Number of Discrete Outcomes',
      mathDomain: 'K \\in \\mathbb{N}, \\; K \\ge 1',
      role: 'Cardinality of discrete state space.'
    },
    {
      symbol: 'I(x_i) = -\\log_2(p_i)',
      name: 'Surprise (Self-Information)',
      mathDomain: 'I \\in [0, \\infty)',
      role: 'Information content in bits conveyed by observation of outcome i.'
    },
    {
      symbol: 'H(X)',
      name: 'Shannon Entropy',
      mathDomain: 'H \\in [0.0, \\log_2(K)]',
      role: 'Expected value of self-information.'
    }
  ],
  assumptions: [
    'Probabilities must be non-negative: p_i >= 0 for all i.',
    'Probabilities must sum to 1.0: sum(p_i) = 1.0 (valid probability simplex).',
    'Zero-probability boundary condition: By continuity, lim_{p -> 0+} p * log_2(p) = 0. Therefore, any term with p_i = 0 contributes exactly 0 to the summation.'
  ],
  steps: [
    {
      id: 'step-1-self-information',
      stepNumber: 1,
      title: 'Information Content (Surprise) of an Outcome',
      latex: 'I(x_i) = \\log_2\\left(\\frac{1}{p_i}\\right) = -\\log_2(p_i)',
      explanation:
        'Claude Shannon established that rare events carry more information than common ones. If an event is guaranteed (p = 1), its information content is log2(1) = 0 bits (zero surprise). An event with p = 0.5 conveys 1 bit of information.',
      pythonSnippet: 'surprise = -np.log2(p_i)',
      pythonExplanation: 'Computes self-information in bits.',
      keyTakeaway: 'Information content is inversely related to probability.'
    },
    {
      id: 'step-2-expected-information',
      stepNumber: 2,
      title: 'Formulate Expected Information Across Distribution',
      latex: 'H(X) = \\mathbb{E}[I(X)] = \\sum_{i=1}^{K} p_i I(x_i) = -\\sum_{i=1}^{K} p_i \\log_2(p_i)',
      explanation:
        'To find the average uncertainty of the system, take the expected value of self-information by weighting each surprise term by its probability of occurrence p_i.',
      pythonSnippet: 'weighted_surprise = -p * np.log2(p)',
      pythonExplanation: 'Weights surprise terms by probability.',
      keyTakeaway: 'Entropy is the probability-weighted average surprise.'
    },
    {
      id: 'step-3-zero-probability-continuity',
      stepNumber: 3,
      title: 'Handle Zero-Probability Limit via L\'Hôpital\'s Rule',
      latex: '\\lim_{p \\to 0^+} p \\log_2(p) = \\lim_{p \\to 0^+} \\frac{\\log_2 p}{1 / p} = \\lim_{p \\to 0^+} \\frac{1 / (p \\ln 2)}{-1 / p^2} = \\lim_{p \\to 0^+} \\left(-\\frac{p}{\\ln 2}\\right) = 0',
      explanation:
        'When p_i = 0, log2(0) is undefined (-infinity). However, by L\'Hôpital\'s rule, the limit of p * log2(p) as p approaches 0 from above is exactly 0. Thus, impossible outcomes contribute zero uncertainty to the total entropy.',
      pythonSnippet: 'terms = np.where(p > 0, -p * np.log2(p), 0.0)',
      pythonExplanation: 'np.where cleanly sets 0 * log(0) terms to 0.0, avoiding NaN.',
      keyTakeaway: '0 * log(0) = 0 by continuity, so impossible events contribute zero entropy.'
    },
    {
      id: 'step-4-extremes-bounds',
      stepNumber: 4,
      title: 'Entropy Extremes: Certainty (0) vs Uniform Maximum (log2 K)',
      latex: 'H_{\\text{min}} = 0 \\quad (\\text{Certainty, } p_k = 1) \\le H(X) \\le H_{\\text{max}} = \\log_2(K) \\quad (\\text{Uniform, } p_i = 1/K)',
      explanation:
        'If one outcome is certain (e.g. p = [1, 0]), H = -1*log2(1) - 0 = 0 bits (zero uncertainty). If all K outcomes are equally likely (p_i = 1/K), H = -sum( (1/K)*log2(1/K) ) = log2(K) bits, which represents maximum possible randomness.',
      pythonSnippet: 'h_max = np.log2(len(p))',
      pythonExplanation: 'Maximum entropy is achieved when all outcomes are equiprobable.',
      keyTakeaway: 'Entropy is bounded in [0, log2(K)], providing an absolute benchmark for uncertainty.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Fair Coin vs. Biased Coin vs. Certain Outcome',
    description: 'Calculate Shannon entropy for three distinct probability distributions.',
    inputs: [
      {
        name: 'Fair Coin (P_fair)',
        value: '[0.5, 0.5]',
        representation: 'P_{\\text{fair}} = [0.5, 0.5]^T'
      },
      {
        name: 'Biased Coin (P_bias)',
        value: '[0.9, 0.1]',
        representation: 'P_{\\text{bias}} = [0.9, 0.1]^T'
      },
      {
        name: 'Deterministic (P_cert)',
        value: '[1.0, 0.0]',
        representation: 'P_{\\text{cert}} = [1.0, 0.0]^T'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Fair Coin Entropy H(P_fair)',
        computation: '-[0.5 \\log_2(0.5) + 0.5 \\log_2(0.5)] = -[0.5(-1) + 0.5(-1)] = 0.5 + 0.5',
        result: '1.0 bit (Maximum binary uncertainty)'
      },
      {
        step: 'Biased Coin Entropy H(P_bias)',
        computation: '-[0.9 \\log_2(0.9) + 0.1 \\log_2(0.1)] = -[0.9(-0.1520) + 0.1(-3.3219)] = 0.1368 + 0.3322',
        result: '0.4690 bits (Reduced uncertainty)'
      },
      {
        step: 'Deterministic Outcome H(P_cert)',
        computation: '-[1.0 \\log_2(1.0) + 0.0] = -[1.0(0) + 0]',
        result: '0.0 bits (Zero uncertainty)'
      }
    ],
    finalOutput: {
      name: 'Entropy Comparison',
      value: 'Fair: 1.0 bit | Biased: 0.4690 bits | Certain: 0.0 bits',
      interpretation: 'Demonstrates how entropy scales monotonically with uncertainty, peaking at 1.0 bit for fair binary trials.'
    },
    verifiedNote: 'Verified analytically: -0.5*log2(0.5)*2 = 1.0. -0.9*log2(0.9) - 0.1*log2(0.1) = 0.13680 + 0.33219 = 0.46899... matches 0.4690 bits.'
  },
  commonMistakes: [
    'Allowing probabilities that do not sum to 1.0 (must be normalized first).',
    'Allowing negative probability inputs or probabilities greater than 1.0.',
    'Throwing a numerical error on p = 0 instead of applying the continuity rule 0 * log(0) = 0.'
  ],
  numericalStabilityNotes: [
    'Use np.where(p > 0, -p * np.log2(p), 0.0) or add an tiny epsilon only when necessary.',
    'Logarithm base can be changed to natural log (giving nats) using H_nats = H_bits * ln(2).'
  ],
  limitations: [
    'Discrete entropy cannot be directly extended to continuous distributions without accounting for differential entropy quirks (differential entropy can be negative).',
    'Treats all outcomes as symmetrically abstract categories; ignores distance between category values.'
  ],
  catalogueId: 'shannon-entropy',
  isEngineSupported: false,
  difficulty: 'Foundational',
  tags: ['information theory', 'probability', 'entropy', 'shannon', 'uncertainty']
};
