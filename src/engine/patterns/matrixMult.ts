import type { EquationMetadata, EquationExplanation } from '../types';

export function matchMatrixMultiplication(normalized: string, raw: string): boolean {
  // If the expression contains addition or bias (+ b), it is not a pure matrix multiplication
  if (/\+\s*[a-zA-Z0-9_]/.test(normalized)) {
    return false;
  }

  // Check for C = AB or C = A @ B or C = A * B
  const simpleAssign = /^[a-zA-Z_]\w*\s*=\s*[a-zA-Z_]\w*\s*[@*]?\s*[a-zA-Z_]\w*$/i.test(normalized);
  const elementwiseIndex = /C_\{?ij\}?\s*=\s*(sum|\\sum).*A_\{?ik\}?.*B_\{?kj\}?/i.test(normalized) ||
    /C_\{?ij\}?\s*=\s*(sum|\\sum).*A_\{?ik\}?.*B_\{?kj\}?/i.test(raw);
  const explicitAt = /^[a-zA-Z_]\w*\s*=\s*[a-zA-Z_]\w*\s*@\s*[a-zA-Z_]\w*$/i.test(normalized);
  const matrixProductPhrase = /^C\s*=\s*AB$/i.test(normalized) || /^C\s*=\s*A\s*B$/i.test(normalized);

  return simpleAssign || elementwiseIndex || explicitAt || matrixProductPhrase;
}

export function getMatrixMultiplicationMetadata(): EquationMetadata {
  return {
    pattern: 'matrix_multiplication',
    displayName: 'Matrix Multiplication (Contractive Tensor Contraction)',
    category: 'Linear Algebra',
    standardLatex: 'C = AB \\quad \\Longleftrightarrow \\quad C_{ij} = \\sum_{k=1}^p A_{ik} B_{kj}',
    variables: [
      {
        name: 'A',
        type: 'np.ndarray',
        shape: '(M, K)',
        description: 'Left input matrix with M rows and K columns'
      },
      {
        name: 'B',
        type: 'np.ndarray',
        shape: '(K, N)',
        description: 'Right input matrix with K rows and N columns'
      },
      {
        name: 'C',
        type: 'np.ndarray',
        shape: '(M, N)',
        description: 'Resulting product matrix contracting shared dimension K'
      }
    ],
    assumptions: [
      'Both operands A and B must strictly have ndim == 2.',
      'Inner contracting dimensions must match exactly: A.shape[1] == B.shape[0].',
      'Matrices contain real or complex floating-point values.'
    ],
    complexity: 'O(M * K * N) FLOPs time, O(M * N) space',
    stabilityNotes: [
      'Standard BLAS level-3 gemm implementation provides cache-blocked numerical stability.',
      'For ill-conditioned matrices, condition number kappa(A) impacts forward error bounds.'
    ]
  };
}

export function generateMatrixMultiplicationCode(): string {
  return `import numpy as np

def matrix_multiply(A: np.ndarray, B: np.ndarray) -> np.ndarray:
    """Compute matrix multiplication C = A @ B.
    
    Mathematical specification:
        C_{ij} = sum_{k=1}^K A_{ik} * B_{kj}
        
    Dimensions:
        A: (M, K)
        B: (K, N)
        C: (M, N)
    """
    A = np.asarray(A, dtype=float)
    B = np.asarray(B, dtype=float)

    # 1. Dimensionality validation
    if A.ndim != 2 or B.ndim != 2:
        raise ValueError(f"Both operands must be 2D matrices. Got A.ndim={A.ndim}, B.ndim={B.ndim}.")

    # 2. Inner contraction dimension matching
    M, K_a = A.shape
    K_b, N = B.shape
    if K_a != K_b:
        raise ValueError(
            f"Incompatible matrix inner dimensions: A has {K_a} columns, but B has {K_b} rows."
        )

    # 3. BLAS-accelerated matrix multiplication
    C = A @ B
    return C

# Example verification harness
if __name__ == "__main__":
    A_sample = np.array([[1.0, 2.0], [3.0, 4.0]], dtype=float)
    B_sample = np.array([[5.0, 6.0], [7.0, 8.0]], dtype=float)
    
    C_result = matrix_multiply(A_sample, B_sample)
    print("Matrix A:\\n", A_sample)
    print("Matrix B:\\n", B_sample)
    print("Result C = A @ B:\\n", C_result)
`;
}

export function explainMatrixMultiplication(): EquationExplanation {
  return {
    title: 'Matrix Multiplication (Linear Operator Composition)',
    category: 'Linear Algebra',
    formalDefinition: 'C = AB where entry (i, j) is the inner product of row i of A and column j of B: C_{ij} = \\sum_{k=1}^K A_{ik} B_{kj}.',
    domainAndConstraints: [
      'A \\in \\mathbb{R}^{M \\times K}, B \\in \\mathbb{R}^{K \\times N}',
      'The number of columns in A must equal the number of rows in B.',
      'Matrix multiplication is associative ((AB)C = A(BC)) and distributive, but generally non-commutative (AB \\neq BA).'
    ],
    variableRoles: [
      { symbol: 'A', role: 'First matrix operand / linear transformation', shape: '(M, K)' },
      { symbol: 'B', role: 'Second matrix operand / vector basis representation', shape: '(K, N)' },
      { symbol: 'C', role: 'Composed transformation product matrix', shape: '(M, N)' }
    ],
    operationMapping: [
      { mathSymbol: 'AB or A @ B', pythonEquivalent: 'A @ B', explanation: 'Python 3.5+ matrix multiplication operator invoking LAPACK/BLAS dgemm' },
      { mathSymbol: '\\sum_{k=1}^K', pythonEquivalent: 'vectorized reduction', explanation: 'Eliminated explicit nested loops in favor of cache-tiled vector dot products' }
    ],
    computationalComplexity: {
      time: 'O(M * K * N)',
      space: 'O(M * N)',
      flops: '2 * M * K * N floating-point operations'
    },
    numericalSafeguards: [
      'Enforces explicit ndim == 2 assertion to reject silent vector broadcast bugs.',
      'Explicit shape comparison A.shape[1] == B.shape[0] raises clear diagnostic ValueError.'
    ]
  };
}
