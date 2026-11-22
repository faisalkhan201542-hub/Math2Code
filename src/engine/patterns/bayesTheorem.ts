import type { EquationMetadata, EquationExplanation } from '../types';

export function matchBayesTheorem(normalized: string, raw: string): boolean {
  const hasConditionalLeft = /P\s*\([a-zA-Z_]\w*\s*\|\s*[a-zA-Z_]\w*\)\s*=/i.test(normalized) ||
    /P\s*\([a-zA-Z_]\w*\\mid\s*[a-zA-Z_]\w*\)\s*=/i.test(raw);

  const hasConditionalLikelihood = /P\s*\([a-zA-Z_]\w*\s*\|\s*[a-zA-Z_]\w*\)/i.test(normalized) ||
    /P\s*\([a-zA-Z_]\w*\\mid\s*[a-zA-Z_]\w*\)/i.test(raw);

  const hasDenominator = /\/\s*\(?P\s*\([a-zA-Z_]\w*\)\)?/i.test(normalized) ||
    /\\frac\{.*\}\{P\s*\([a-zA-Z_]\w*\)\}/i.test(raw);

  return Boolean(hasConditionalLeft && hasConditionalLikelihood && hasDenominator);
}

export function getBayesTheoremMetadata(): EquationMetadata {
  return {
    pattern: 'bayes_theorem',
    displayName: "Bayes' Theorem (Inverse Conditional Probability)",
    category: 'Probability',
    standardLatex: 'P(A\\mid B) = \\frac{P(B\\mid A) P(A)}{P(B)}',
    variables: [
      {
        name: 'prior',
        type: 'float',
        shape: 'Scalar float in [0.0, 1.0]',
        description: 'Prior probability P(A) of hypothesis A'
      },
      {
        name: 'likelihood',
        type: 'float',
        shape: 'Scalar float in [0.0, 1.0]',
        description: 'Likelihood P(B|A) of observing evidence B given hypothesis A'
      },
      {
        name: 'marginal',
        type: 'float',
        shape: 'Scalar float in (0.0, 1.0]',
        description: 'Total marginal evidence probability P(B)'
      }
    ],
    assumptions: [
      'All probabilities must satisfy Kolmogorov probability axioms: 0.0 <= P <= 1.0.',
      'Marginal evidence P(B) must be strictly non-zero: P(B) > 0.0.',
      'Posterior probability P(A|B) must evaluate to a valid probability in [0.0, 1.0].'
    ],
    complexity: 'O(1) scalar evaluation',
    stabilityNotes: [
      'Division by extremely small marginal likelihood P(B) can cause floating point instability.',
      'In high-dimensional Bayesian models, log-space computation log P(A|B) = log P(B|A) + log P(A) - log P(B) is preferred.'
    ]
  };
}

export function generateBayesTheoremCode(): string {
  return `def bayes_posterior(prior: float, likelihood: float, marginal: float) -> float:
    """Compute posterior probability P(A|B) using Bayes' Theorem.
    
    Formula:
        P(A|B) = (P(B|A) * P(A)) / P(B)
        
    Parameters:
        prior: P(A), prior probability of hypothesis A [0.0, 1.0]
        likelihood: P(B|A), likelihood of evidence B given A [0.0, 1.0]
        marginal: P(B), marginal evidence probability (0.0, 1.0]
    """
    # 1. Type and value validations
    for name, val in [("prior P(A)", prior), ("likelihood P(B|A)", likelihood), ("marginal P(B)", marginal)]:
        if not isinstance(val, (int, float)):
            raise TypeError(f"{name} must be a numeric float, got {type(val).__name__}.")
        if not (0.0 <= val <= 1.0):
            raise ValueError(f"{name} must be in range [0.0, 1.0], got {val}.")

    # 2. Strict non-zero denominator guard
    if marginal <= 0.0:
        raise ValueError("Marginal likelihood P(B) must be strictly positive (> 0.0) to condition on evidence.")

    # 3. Bayes formula evaluation
    posterior = (likelihood * prior) / marginal

    # 4. Consistency verification
    if posterior > 1.0 + 1e-9:
        raise ValueError(
            f"Inconsistent probabilities: computed posterior {posterior:.4f} > 1.0. "
            "Likelihood * prior cannot exceed marginal evidence."
        )

    return min(1.0, float(posterior))

# Example verification harness
if __name__ == "__main__":
    # Example: Medical test screening
    prior_disease = 0.01          # 1% base rate
    sensitivity = 0.95            # 95% true positive rate
    marginal_positive = 0.05      # 5% total positive test rate
    
    posterior_result = bayes_posterior(prior_disease, sensitivity, marginal_positive)
    print(f"Prior P(Disease):          {prior_disease:.4f}")
    print(f"Likelihood P(Test+|Disease): {sensitivity:.4f}")
    print(f"Marginal P(Test+):          {marginal_positive:.4f}")
    print(f"Posterior P(Disease|Test+): {posterior_result:.4f}")
    assert 0.0 <= posterior_result <= 1.0, "Posterior must be valid probability!"
`;
}

export function explainBayesTheorem(): EquationExplanation {
  return {
    title: "Bayes' Theorem (Inverse Conditional Probability)",
    category: 'Probability & Statistics',
    formalDefinition: 'P(A\\mid B) = \\frac{P(B\\mid A) P(A)}{P(B)}. Updates belief in hypothesis A upon observing evidence B.',
    domainAndConstraints: [
      'P(A), P(B), P(B\\mid A) \\in [0, 1]',
      'Strict condition: P(B) > 0',
      'Law of Total Probability expands marginal: P(B) = P(B\\mid A)P(A) + P(B\\mid \\neg A)P(\\neg A)'
    ],
    variableRoles: [
      { symbol: 'P(A)', role: 'Prior belief before observing evidence', shape: 'scalar [0, 1]' },
      { symbol: 'P(B\\mid A)', role: 'Likelihood of evidence under hypothesis', shape: 'scalar [0, 1]' },
      { symbol: 'P(B)', role: 'Marginal probability of evidence', shape: 'scalar (0, 1]' },
      { symbol: 'P(A\\mid B)', role: 'Posterior updated belief', shape: 'scalar [0, 1]' }
    ],
    operationMapping: [
      { mathSymbol: 'P(B\\mid A) P(A)', pythonEquivalent: 'likelihood * prior', explanation: 'Joint probability P(A \\cap B)' },
      { mathSymbol: '/ P(B)', pythonEquivalent: '/ marginal', explanation: 'Normalization by marginal evidence' }
    ],
    computationalComplexity: {
      time: 'O(1) scalar multiplication and division',
      space: 'O(1) scalar storage',
      flops: '2 floating-point operations'
    },
    numericalSafeguards: [
      'Strict verification that marginal P(B) > 0 prevents division by zero.',
      'Validates that posterior does not exceed 1.0 due to inconsistent input parameters.'
    ]
  };
}
