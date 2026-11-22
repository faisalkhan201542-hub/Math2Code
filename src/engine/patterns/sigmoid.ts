import type { EquationMetadata, EquationExplanation } from '../types';

export function matchSigmoid(normalized: string, raw: string): boolean {
  const normalizedMatch = /sigma\s*\([a-zA-Z_]\w*\)\s*=\s*\(?1\)?\s*\/\s*\(?1\s*\+\s*exp\s*\(-[a-zA-Z_]\w*\)\)?/i.test(normalized) ||
    /1\s*\/\s*\(?1\s*\+\s*e\^\{-?[a-zA-Z_]\w*\}\)?/i.test(normalized) ||
    /1\s*\/\s*\(?1\s*\+\s*exp\(-[a-zA-Z_]\w*\)\)/i.test(normalized);

  const rawMatch = /\\sigma\s*\([a-zA-Z_]\w*\)\s*=\s*\\frac\{1\}\{1\s*\+\s*e\^\{-[a-zA-Z_]\w*\}\}/i.test(raw) ||
    /\\sigma\s*\(z\)\s*=\s*\\frac\{1\}\{1\s*\+\s*\\exp\(-z\)\}/i.test(raw);

  return normalizedMatch || rawMatch;
}

export function getSigmoidMetadata(): EquationMetadata {
  return {
    pattern: 'sigmoid',
    displayName: 'Sigmoidal Logistic Activation Function',
    category: 'Machine Learning',
    standardLatex: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
    variables: [
      {
        name: 'z',
        type: 'np.ndarray | float',
        shape: 'Any shape (broadcasted element-wise)',
        description: 'Input logit / real-valued scalar or tensor'
      }
    ],
    assumptions: [
      'Input can be scalar, vector, or multi-dimensional array.',
      'Output strictly bounded in open interval (0, 1).',
      'At z = 0, sigma(0) = 0.5 exactly.'
    ],
    complexity: 'O(N) element-wise evaluation',
    stabilityNotes: [
      'Naive evaluation of exp(-z) overflows IEEE-754 double precision when z < -709.',
      'Dual-branch formulation (np.where) guarantees numerical stability for both large positive and large negative values.'
    ]
  };
}

export function generateSigmoidCode(): string {
  return `import numpy as np

def sigmoid(z: np.ndarray | float) -> np.ndarray:
    """Compute numerically stable logistic sigmoid activation function.
    
    Mathematical specification:
        sigma(z) = 1 / (1 + exp(-z))
        
    Numerical stabilization:
        Protects against floating-point overflow for large negative numbers.
        For z >= 0: 1.0 / (1.0 + exp(-z))
        For z < 0:  exp(z) / (1.0 + exp(z))
    """
    z_arr = np.asarray(z, dtype=float)

    # Numerically stable piecewise evaluation
    pos_mask = (z_arr >= 0)
    
    result = np.empty_like(z_arr, dtype=float)
    
    # Branch 1: z >= 0 (prevents overflow in exp(-z))
    result[pos_mask] = 1.0 / (1.0 + np.exp(-z_arr[pos_mask]))
    
    # Branch 2: z < 0 (prevents overflow by multiplying numerator & denominator by exp(z))
    exp_z = np.exp(z_arr[~pos_mask])
    result[~pos_mask] = exp_z / (1.0 + exp_z)

    # Return float if input was a scalar
    if np.isscalar(z):
        return float(result.item())
    return result

# Example verification harness
if __name__ == "__main__":
    test_inputs = np.array([-1000.0, -10.0, 0.0, 10.0, 1000.0])
    activations = sigmoid(test_inputs)
    print("Inputs:     ", test_inputs)
    print("Sigmoid:    ", activations)
    assert np.all(np.isfinite(activations)), "Numerical stability check failed: found NaN or Inf!"
    assert np.isclose(sigmoid(0.0), 0.5), "Symmetry check failed: sigmoid(0) should equal 0.5"
`;
}

export function explainSigmoid(): EquationExplanation {
  return {
    title: 'Sigmoidal Logistic Activation Function',
    category: 'Machine Learning / Statistics',
    formalDefinition: '\\sigma(z) = \\frac{1}{1 + e^{-z}} = \\frac{e^z}{1 + e^z}. Maps real-valued logits to the probabilistic interval (0, 1).',
    domainAndConstraints: [
      'Domain: z \\in \\mathbb{R}',
      'Codomain: \\sigma(z) \\in (0, 1)',
      'Symmetry: \\sigma(-z) = 1 - \\sigma(z)',
      'Derivative: \\sigma\'(z) = \\sigma(z)(1 - \\sigma(z))'
    ],
    variableRoles: [
      { symbol: 'z', role: 'Input scalar, logit, or multi-dimensional array', shape: 'Any' },
      { symbol: '\\sigma(z)', role: 'Probability or squashed non-linear activation', shape: 'Matches input' }
    ],
    operationMapping: [
      { mathSymbol: 'e^{-z}', pythonEquivalent: 'np.exp(-z)', explanation: 'Exponential function' },
      { mathSymbol: '1 / (1 + \\cdot)', pythonEquivalent: '1.0 / (1.0 + ...)', explanation: 'Inversion and denominator normalization' },
      { mathSymbol: 'piecewise', pythonEquivalent: 'np.where or boolean masking', explanation: 'Branching on sign(z) to avoid IEEE-754 overflow' }
    ],
    computationalComplexity: {
      time: 'O(N) where N is number of elements',
      space: 'O(N) for output array',
      flops: '3 FLOPs + 1 exp per element'
    },
    numericalSafeguards: [
      'Dual-branch reformulation avoids calculating exp(1000) which would yield Inf or NaN.',
      'Output values are strictly clamped in floating-point bounds [0.0, 1.0].'
    ]
  };
}
