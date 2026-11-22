import type { PatternDerivation } from '../types';

export const bayesTheoremDerivation: PatternDerivation = {
  id: 'bayes_theorem',
  pattern: 'bayes_theorem',
  title: "Bayes' Theorem",
  subtitle: 'Conditional Probability Inversion and Hypothesis Updating',
  category: 'Probability & Statistics',
  catalogueId: 'bayes-theorem',
  isEngineSupported: true,
  difficulty: 'Foundational',
  tags: ['probability', 'statistics', 'bayes', 'conditional', 'inference'],
  summary:
    "Bayes' theorem formalizes rational belief updating: it calculates the posterior probability of a hypothesis A given observed evidence B by weighting the prior probability by the likelihood of the evidence.",
  canonicalFormulaLatex: 'P(A\\mid B) = \\frac{P(B\\mid A) P(A)}{P(B)} = \\frac{P(A \\cap B)}{P(B)}',
  targetWhatItCalculates:
    'Updates our initial degree of belief P(A) into an updated posterior probability P(A|B) after observing new evidence B.',
  symbols: [
    {
      symbol: 'A',
      name: 'Hypothesis or Event',
      mathDomain: 'A \\subseteq \\Omega',
      role: 'Unobserved state of nature, condition, or latent hypothesis being tested.'
    },
    {
      symbol: 'B',
      name: 'Observed Evidence',
      mathDomain: 'B \\subseteq \\Omega, \\; P(B) > 0',
      role: 'Empirically observed data, diagnostic test result, or experimental indicator.'
    },
    {
      symbol: 'P(A)',
      name: 'Prior Probability',
      mathDomain: 'P(A) \\in [0, 1]',
      role: 'Baseline probability of hypothesis A before conditioning on evidence B.'
    },
    {
      symbol: 'P(B\\mid A)',
      name: 'Likelihood',
      mathDomain: 'P(B\\mid A) \\in [0, 1]',
      role: 'Probability of observing evidence B assuming hypothesis A is true (True Positive Rate).'
    },
    {
      symbol: 'P(B)',
      name: 'Marginal Evidence Probability',
      mathDomain: 'P(B) \\in (0, 1]',
      role: 'Total probability of observing evidence B across all possible mutually exclusive hypotheses.'
    },
    {
      symbol: 'P(A\\mid B)',
      name: 'Posterior Probability',
      mathDomain: 'P(A\\mid B) \\in [0, 1]',
      role: 'Updated probability of hypothesis A after incorporating observed evidence B.'
    }
  ],
  assumptions: [
    'All probabilities must satisfy Kolmogorov axioms within the closed interval [0, 1].',
    'The marginal probability of evidence P(B) must be strictly greater than zero (P(B) > 0) to avoid division by zero.',
    'Consistency invariant: joint probability P(A and B) = P(B|A)P(A) cannot exceed the marginal evidence P(B).'
  ],
  steps: [
    {
      id: 'step-1-conditional-definition',
      stepNumber: 1,
      title: 'Define Conditional Probability and Joint Conjunction',
      latex: 'P(A \\cap B) = P(B \\cap A) = P(B\\mid A) P(A)',
      explanation:
        'By the Kolmogorov definition of conditional probability, the joint probability that both A and B occur is the probability of A happening multiplied by the conditional probability of B given A.',
      pythonSnippet: 'joint_probability = likelihood * prior',
      pythonExplanation: 'Computes the joint probability P(A and B).',
      keyTakeaway: 'Joint probability is symmetric, but conditional probabilities P(A|B) != P(B|A) in general.'
    },
    {
      id: 'step-2-symmetric-product-rule',
      stepNumber: 2,
      title: 'Equate Symmetric Formulations of the Joint Event',
      latex: 'P(A \\cap B) = P(A\\mid B) P(B)',
      explanation:
        'Conditioning in the reverse direction, the exact same joint event P(A and B) can be expressed as the posterior probability P(A|B) multiplied by the marginal probability P(B).',
      pythonSnippet: '# P(A and B) = P(A|B) * P(B) = P(B|A) * P(A)',
      pythonExplanation: 'Both expressions describe the identical joint conjunction probability.',
      keyTakeaway: 'P(B|A)P(A) = P(A|B)P(B) is the fundamental identity behind Bayesian inversion.'
    },
    {
      id: 'step-3-isolate-posterior',
      stepNumber: 3,
      title: 'Isolate Posterior Probability by Dividing by Marginal Evidence',
      latex: 'P(A\\mid B) = \\frac{P(B\\mid A) P(A)}{P(B)}',
      explanation:
        'Dividing both sides by the non-zero marginal probability P(B) isolates the posterior probability P(A|B). The marginal P(B) acts as a normalizer ensuring the sum of all mutually exclusive posteriors equals 1.',
      pythonSnippet: 'if marginal <= 0.0:\n    raise ValueError("Marginal probability P(B) must be strictly positive")\nposterior = (likelihood * prior) / marginal',
      pythonExplanation: 'Safely divides joint likelihood by marginal evidence.',
      keyTakeaway: 'Posterior is proportional to Likelihood times Prior, normalized by Evidence.'
    },
    {
      id: 'step-4-total-probability-expansion',
      stepNumber: 4,
      title: 'Expand Marginal Denominator via the Law of Total Probability',
      latex: 'P(B) = P(B\\mid A)P(A) + P(B\\mid \\neg A)P(\\neg A)',
      explanation:
        'In binary classification and medical testing, the marginal P(B) is decomposed into the sum of the true positive conjunction P(B|A)P(A) and false positive conjunction P(B|~A)(1 - P(A)).',
      pythonSnippet: 'marginal = (likelihood * prior) + (false_positive_rate * (1.0 - prior))',
      pythonExplanation: 'Evaluates total evidence across positive and negative states.',
      keyTakeaway: 'Allows computing P(B) even when only conditional rates are known.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Rare Disease Diagnostic Screening',
    description: 'Calculate posterior probability of disease given a positive test result.',
    inputs: [
      {
        name: 'prior P(A)',
        value: '0.01',
        representation: 'P(\\text{Disease}) = 0.01 \\; (1\\% \\text{ population prevalence})'
      },
      {
        name: 'likelihood P(B|A)',
        value: '0.95',
        representation: 'P(\\text{Pos}\\mid\\text{Disease}) = 0.95 \\; (95\\% \\text{ test sensitivity})'
      },
      {
        name: 'marginal P(B)',
        value: '0.05',
        representation: 'P(\\text{Pos}) = 0.05 \\; (5\\% \\text{ total positive test rate})'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Compute Joint Probability (True Positives)',
        computation: 'P(\\text{Pos} \\cap \\text{Disease}) = 0.95 \\times 0.01',
        result: '0.0095'
      },
      {
        step: 'Divide by Marginal Evidence Rate',
        computation: 'P(\\text{Disease}\\mid\\text{Pos}) = \\frac{0.0095}{0.05}',
        result: '0.19'
      }
    ],
    finalOutput: {
      name: 'P(A|B)',
      value: '0.19',
      interpretation: 'P(\\text{Disease}\\mid\\text{Pos}) = 0.19 \\quad (19\\% \\text{ chance of having disease})'
    },
    verifiedNote: 'Independently verified: (0.95 * 0.01) / 0.05 == 0.19. Demonstrates the Base Rate Fallacy.'
  },
  commonMistakes: [
    'Base Rate Fallacy: ignoring the prior P(A), assuming a 95% sensitive test implies a 95% chance of disease.',
    'Prosecutor\'s Fallacy: confusing P(B|A) (likelihood of evidence given guilt) with P(A|B) (probability of guilt given evidence).',
    'Allowing P(B) = 0, causing division by zero on impossible evidence.',
    'Using inconsistent probabilities where likelihood * prior > marginal (violates subset axiom P(A and B) <= P(B)).'
  ],
  numericalStabilityNotes: [
    'When multiplying many small probabilities (e.g. Naive Bayes), compute in log-space: log P(A|B) = log P(B|A) + log P(A) - log P(B) to prevent underflow to zero.'
  ],
  limitations: [
    'Requires well-specified prior probabilities; subjective priors can introduce bias in small-sample regimes.'
  ]
};
