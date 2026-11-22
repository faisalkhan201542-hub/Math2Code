import type { EquationMetadata, EquationExplanation } from '../types';

export function matchVectorNorm(normalized: string, raw: string): boolean {
  if (
    /d\s*\([a-zA-Z\\,\s]+\)/i.test(raw) ||
    /d\s*\([a-zA-Z,\s]+\)/i.test(normalized) ||
    /\([a-zA-Z]_?i?\s*-\s*[a-zA-Z]_?i?\)/i.test(normalized) ||
    /-\s*y/i.test(normalized)
  ) {
    return false;
  }

  const normPattern = /norm2?\s*\([a-zA-Z_]\w*\)\s*=\s*sqrt/i.test(normalized);
  const rawNorm = /(\\\|.*\\\||\|\|.*\|\|)/i.test(raw) && /(sqrt|\\sqrt)/i.test(raw);
  const sumOfSquares = /sqrt\s*\(\s*sum.*(\^2|\*\*\s*2|x_i\^2)/i.test(normalized);

  return normPattern || rawNorm || sumOfSquares;
}

export function getVectorNormMetadata(): EquationMetadata {
  return {
    pattern: 'vector_l2_norm',
    displayName: 'Euclidean L2 Vector Norm',
    category: 'Linear Algebra',
    standardLatex: '\\|x\\|_2 = \\sqrt{\\sum_{i=1}^{n} x_i^2}',
    variables: [
      {
        name: 'x',
        type: 'np.ndarray',
        shape: '(N,)',
        description: '1D input coordinate vector of length N'
      }
    ],
    assumptions: [
      'Input x must be a 1D vector or flattens safely.',
      'Norm result is strictly non-negative: ||x||_2 >= 0.',
      '||x||_2 == 0 if and only if x is the zero vector.'
    ],
    complexity: 'O(N) time, O(1) auxiliary space',
    stabilityNotes: [
      'For extremely large or small numbers, intermediate sum of squares x_i^2 can overflow or underflow.',
      'Implementation uses scaling (max(|x|)) or np.linalg.norm (which uses LAPACK dnrm2 with Blue’s scaling).'
    ]
  };
}

export function generateVectorNormCode(): string {
  return `import numpy as np

def vector_l2_norm(x: np.ndarray) -> float:
    """Compute Euclidean L2 norm ||x||_2 = sqrt(sum(x_i^2)).
    
    Mathematical specification:
        ||x||_2 = sqrt(sum_{i=1}^N x_i^2)
        
    Dimensions:
        x: (N,) 1-dimensional array
    """
    x = np.asarray(x, dtype=float)

    # 1. Dimensionality validation
    if x.ndim != 1:
        raise ValueError(f"Input vector x must be 1-dimensional. Got ndim={x.ndim} with shape {x.shape}.")

    # 2. Edge case: empty vector
    if x.size == 0:
        raise ValueError("Cannot compute L2 norm of an empty vector.")

    # 3. Numerically stable Euclidean norm via LAPACK dnrm2
    # Prevents intermediate overflow when squaring large numbers
    norm_val = float(np.linalg.norm(x, ord=2))
    return norm_val

# Example verification harness
if __name__ == "__main__":
    x_sample = np.array([3.0, 4.0], dtype=float)
    result = vector_l2_norm(x_sample)
    print("Vector x:", x_sample)
    print("L2 Norm ||x||_2:", result)
    assert np.isclose(result, 5.0), "Sanity test failed: norm of [3, 4] should be 5.0"
`;
}

export function explainVectorNorm(): EquationExplanation {
  return {
    title: 'Vector L2 Euclidean Norm (Metric Length)',
    category: 'Linear Algebra',
    formalDefinition: '\\|x\\|_2 = \\sqrt{\\sum_{i=1}^n x_i^2} = \\sqrt{x^T x}. Maps an n-dimensional vector to its non-negative scalar Euclidean distance from the origin.',
    domainAndConstraints: [
      'x \\in \\mathbb{R}^n',
      'Positive definiteness: \\|x\\|_2 \\ge 0 with equality if and only if x = 0.',
      'Absolute homogeneity: \\|\\alpha x\\|_2 = |\\alpha| \\|x\\|_2.',
      'Triangle inequality: \\|x + y\\|_2 \\le \\|x\\|_2 + \\|y\\|_2.'
    ],
    variableRoles: [
      { symbol: 'x', role: 'Input real coordinate vector', shape: '(N,)' },
      { symbol: 'n', role: 'Dimension / number of coordinate entries', shape: 'scalar integer' }
    ],
    operationMapping: [
      { mathSymbol: 'x_i^2', pythonEquivalent: 'x ** 2', explanation: 'Element-wise coordinate squaring' },
      { mathSymbol: '\\sum_{i=1}^n', pythonEquivalent: 'np.sum(...)', explanation: 'Vectorized accumulation over all coordinates' },
      { mathSymbol: '\\sqrt{\\cdot}', pythonEquivalent: 'np.sqrt(...) or np.linalg.norm', explanation: 'Square root of total accumulated energy' }
    ],
    computationalComplexity: {
      time: 'O(N) linear time',
      space: 'O(1) auxiliary space',
      flops: '2N FLOPs (N multiplications, N-1 additions, 1 square root)'
    },
    numericalSafeguards: [
      'Avoids naive squaring of extreme numbers via np.linalg.norm (which scales by max(|x|)).',
      'Explicitly asserts 1D dimensionality to prevent dimension broadcasting accidents.'
    ]
  };
}
