import type { EquationMetadata, EquationExplanation } from '../types';

export function matchLinearRegression(normalized: string, raw: string): boolean {
  const normMatch = /y_hat\s*=\s*X\s*[@*]?\s*w\s*\+\s*b/i.test(normalized) ||
    /y\s*=\s*X\s*[@*]?\s*w\s*\+\s*b/i.test(normalized);

  const rawMatch = /\\hat\{?y\}?\s*=\s*X\s*w\s*\+\s*b/i.test(raw) ||
    /\\hat\{?y\}?\s*=\s*\\mathbf\{?X\}?\\mathbf\{?w\}?\s*\+\s*b/i.test(raw);

  return normMatch || rawMatch;
}

export function getLinearRegressionMetadata(): EquationMetadata {
  return {
    pattern: 'linear_regression',
    displayName: 'Multivariate Linear Regression Model',
    category: 'Statistics / Machine Learning',
    standardLatex: '\\hat{y} = Xw + b',
    variables: [
      {
        name: 'X',
        type: 'np.ndarray',
        shape: '(N, D)',
        description: 'Design matrix of N observations with D predictor features'
      },
      {
        name: 'w',
        type: 'np.ndarray',
        shape: '(D,)',
        description: 'Parameter weight vector of length D'
      },
      {
        name: 'b',
        type: 'float | np.ndarray',
        shape: 'Scalar float or (N,) broadcastable bias',
        description: 'Scalar intercept or bias term'
      }
    ],
    assumptions: [
      'X must be a 2-dimensional feature matrix with shape (N, D).',
      'Weight vector w must have length matching the feature count: len(w) == D.',
      'Output y_hat will have length N matching the sample count.'
    ],
    complexity: 'O(N * D) matrix-vector multiplication',
    stabilityNotes: [
      'Standard matrix-vector dot product X @ w is numerically stable.',
      'Bias b can be either a scalar or an array broadcastable across sample dimension.'
    ]
  };
}

export function generateLinearRegressionCode(): string {
  return `import numpy as np

def predict_linear_regression(X: np.ndarray, w: np.ndarray, b: float = 0.0) -> np.ndarray:
    """Compute linear regression predictions y_hat = X @ w + b.
    
    Mathematical specification:
        y_hat_i = sum_{j=1}^D X_{ij} * w_j + b
        
    Dimensions:
        X: (N, D) design matrix of N samples, D features
        w: (D,) weight coefficient vector
        b: scalar float intercept
        y_hat: (N,) predicted response values
    """
    X = np.asarray(X, dtype=float)
    w = np.asarray(w, dtype=float)

    # 1. Dimensionality validation
    if X.ndim != 2:
        raise ValueError(f"Feature matrix X must be 2D with shape (N, D). Got ndim={X.ndim} with shape {X.shape}.")
    
    if w.ndim == 2 and w.shape[1] == 1:
        w = w.ravel()  # Flatten column vector to 1D
    elif w.ndim != 1:
        raise ValueError(f"Weights w must be a 1D vector of length D. Got ndim={w.ndim} with shape {w.shape}.")

    # 2. Feature dimension compatibility check
    N, D = X.shape
    if w.shape[0] != D:
        raise ValueError(
            f"Dimension mismatch: X has {D} features per sample, but w has length {w.shape[0]}."
        )

    # 3. Vectorized matrix-vector product with broadcast bias
    y_hat = (X @ w) + float(b)
    return y_hat

# Example verification harness
if __name__ == "__main__":
    # N=3 samples, D=2 features
    X_samples = np.array([
        [1.0, 2.0],
        [2.0, 3.0],
        [3.0, 4.0]
    ], dtype=float)
    
    w_weights = np.array([0.5, -1.0], dtype=float)
    b_intercept = 2.0

    predictions = predict_linear_regression(X_samples, w_weights, b_intercept)
    print("Design matrix X:\\n", X_samples)
    print("Weights w:      ", w_weights)
    print("Intercept b:    ", b_intercept)
    print("Predictions ŷ:  ", predictions)
    assert predictions.shape == (3,), "Output shape must equal sample count N=3!"
`;
}

export function explainLinearRegression(): EquationExplanation {
  return {
    title: 'Multivariate Linear Regression Model',
    category: 'Supervised Machine Learning / Statistics',
    formalDefinition: '\\hat{y} = Xw + b. Affine mapping projecting an N \\times D feature representation into a continuous 1D target prediction vector.',
    domainAndConstraints: [
      'X \\in \\mathbb{R}^{N \\times D}, w \\in \\mathbb{R}^D, b \\in \\mathbb{R}',
      'Homoscedasticity and linearity assumptions in classical Ordinary Least Squares (OLS)',
      'Feature dimension D must be strictly non-zero'
    ],
    variableRoles: [
      { symbol: 'X', role: 'Feature / design matrix', shape: '(N, D)' },
      { symbol: 'w', role: 'Learnable regression weights / coefficients', shape: '(D,)' },
      { symbol: 'b', role: 'Scalar intercept (bias)', shape: 'scalar' },
      { symbol: '\\hat{y}', role: 'Model predictions', shape: '(N,)' }
    ],
    operationMapping: [
      { mathSymbol: 'Xw or X @ w', pythonEquivalent: 'X @ w', explanation: 'BLAS level-2 dgemv matrix-vector contraction' },
      { mathSymbol: '+ b', pythonEquivalent: '+ b', explanation: 'NumPy broadcasting adding scalar bias to all N row projections' }
    ],
    computationalComplexity: {
      time: 'O(N * D)',
      space: 'O(N) for prediction vector',
      flops: '2 * N * D operations'
    },
    numericalSafeguards: [
      'Enforces X.shape[1] == w.shape[0] feature dimension match to catch broadcast errors.',
      'Safely flattens column-vector weights (D, 1) to standard 1D array to avoid unexpected (N, D) broadcast products.'
    ]
  };
}
