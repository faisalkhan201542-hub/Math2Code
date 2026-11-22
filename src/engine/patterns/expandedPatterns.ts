import type { EquationMetadata, EquationExplanation, PatternType } from '../types';

export interface ExpandedPatternDefinition {
  pattern: PatternType;
  name: string;
  category: string;
  latex: string;
  simple: string;
  match: (normalized: string, raw: string) => boolean;
  generateCode: () => string;
  getMetadata: () => EquationMetadata;
  explain: () => EquationExplanation;
}

export const EXPANDED_PATTERNS: ExpandedPatternDefinition[] = [
  // 1. Dot Product
  {
    pattern: 'dot_product',
    name: 'Vector Dot Product (Inner Product)',
    category: 'Linear Algebra',
    latex: '\\mathbf{x} \\cdot \\mathbf{w} = \\sum_{i=1}^{n} x_i w_i',
    simple: 'x . w = sum(x_i * w_i)',
    match: (norm, raw) => {
      if (/f1|precision|recall|chain|dy\/dx/i.test(norm) || /precision/i.test(raw)) return false;
      return (
        /dot.*product/i.test(norm) ||
        /inner.*product/i.test(norm) ||
        (/\\mathbf\{[xw]\}\s*\\cdot\s*\\mathbf\{[xw]\}/i.test(raw)) ||
        (/\bx\s*\\cdot\s*w\b/i.test(raw)) ||
        (/\bx\s*\.\s*w\b/i.test(norm)) ||
        (/sum\s*\(.*x.*w.*\)/i.test(norm)) ||
        (/\\sum.*x_i.*w_i/i.test(raw))
      ) && !/norm/i.test(norm);
    },
    getMetadata: () => ({
      pattern: 'dot_product',
      displayName: 'Vector Dot Product',
      category: 'Linear Algebra',
      standardLatex: '\\mathbf{x} \\cdot \\mathbf{w} = \\sum_{i=1}^{n} x_i w_i',
      variables: [
        { name: 'x', type: 'np.ndarray', shape: '(n,)', description: 'First 1D real coordinate vector' },
        { name: 'w', type: 'np.ndarray', shape: '(n,)', description: 'Second 1D real coordinate vector' }
      ],
      assumptions: ['Vectors must share identical 1D length n.', 'Result is an invariant scalar value.'],
      complexity: 'O(n) time, O(1) space',
      stabilityNotes: ['For long vectors with large disparities, compensated summation mitigates cancellation error.']
    }),
    generateCode: () => `import numpy as np

def dot_product(x: np.ndarray, w: np.ndarray) -> float:
    """Compute vector dot product x · w = sum(x_i * w_i)."""
    x_arr = np.asarray(x, dtype=float)
    w_arr = np.asarray(w, dtype=float)
    if x_arr.ndim != 1 or w_arr.ndim != 1:
        raise ValueError("Both inputs must be 1D vectors.")
    if x_arr.shape != w_arr.shape:
        raise ValueError(f"Shape mismatch: {x_arr.shape} vs {w_arr.shape}")
    return float(np.dot(x_arr, w_arr))

# Example verification
x = np.array([1.0, 2.0, 3.0])
w = np.array([4.0, -1.0, 2.0])
print("Dot product:", dot_product(x, w))
`,
    explain: () => ({
      title: 'Vector Dot Product (Inner Product)',
      category: 'Linear Algebra',
      formalDefinition: '\\mathbf{x} \\cdot \\mathbf{w} = \\sum_{i=1}^n x_i w_i = \\|x\\| \\|w\\| \\cos(\\theta). Maps two equal-length sequences to a scalar.',
      domainAndConstraints: ['x, w \\in \\mathbb{R}^n', 'Bilinear and symmetric: x · w = w · x.'],
      variableRoles: [
        { symbol: 'x', role: 'Input feature vector', shape: '(n,)' },
        { symbol: 'w', role: 'Weight / direction vector', shape: '(n,)' }
      ],
      operationMapping: [
        { mathSymbol: 'x_i w_i', pythonEquivalent: 'x * w', explanation: 'Component-wise multiplication' },
        { mathSymbol: '\\sum', pythonEquivalent: 'np.dot(x, w)', explanation: 'Inner contraction accumulation' }
      ],
      computationalComplexity: { time: 'O(n)', space: 'O(1)', flops: '2n FLOPs' },
      numericalSafeguards: ['Shape verification enforces dimension agreement.']
    })
  },

  // 2. Euclidean Distance
  {
    pattern: 'euclidean_distance',
    name: 'Euclidean Distance Metric',
    category: 'Linear Algebra',
    latex: 'd(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_{i=1}^{n} (x_i - y_i)^2}',
    simple: 'd(x, y) = sqrt(sum((x_i - y_i)^2))',
    match: (norm, raw) =>
      (/d\s*\(.*[xy].*\)/i.test(raw) || /euclidean/i.test(norm)) &&
      (/sqrt/i.test(norm) || /\\sqrt/i.test(raw)) &&
      (/\(x.*-.*y\)/i.test(norm) || /\(x_i.*-.*y_i\)/i.test(norm)),
    getMetadata: () => ({
      pattern: 'euclidean_distance',
      displayName: 'Euclidean Distance',
      category: 'Linear Algebra',
      standardLatex: 'd(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_{i=1}^{n} (x_i - y_i)^2}',
      variables: [
        { name: 'x', type: 'np.ndarray', shape: '(n,)', description: 'First point coordinate vector' },
        { name: 'y', type: 'np.ndarray', shape: '(n,)', description: 'Second point coordinate vector' }
      ],
      assumptions: ['x and y are points in flat Euclidean R^n space.', 'Non-negative: d(x, y) >= 0 with d(x, y) = 0 iff x = y.'],
      complexity: 'O(n) time, O(1) space',
      stabilityNotes: ['np.linalg.norm(x - y) avoids intermediate overflow in difference squaring.']
    }),
    generateCode: () => `import numpy as np

def euclidean_distance(x: np.ndarray, y: np.ndarray) -> float:
    """Compute Euclidean metric distance d(x, y) = ||x - y||_2."""
    x_arr = np.asarray(x, dtype=float)
    y_arr = np.asarray(y, dtype=float)
    if x_arr.shape != y_arr.shape or x_arr.ndim != 1:
        raise ValueError("Inputs must be 1D vectors of equal length.")
    return float(np.linalg.norm(x_arr - y_arr, ord=2))

# Example verification
p = np.array([0.0, 0.0])
q = np.array([3.0, 4.0])
print("Distance:", euclidean_distance(p, q))
`,
    explain: () => ({
      title: 'Euclidean Distance Metric',
      category: 'Linear Algebra',
      formalDefinition: 'd(x, y) = \\|x - y\\|_2 = \\sqrt{\\sum_{i=1}^n (x_i - y_i)^2}. Metric distance satisfying identity of indiscernibles, symmetry, and triangle inequality.',
      domainAndConstraints: ['x, y \\in \\mathbb{R}^n', 'd(x, y) \\ge 0'],
      variableRoles: [
        { symbol: 'x', role: 'Point 1 coordinates', shape: '(n,)' },
        { symbol: 'y', role: 'Point 2 coordinates', shape: '(n,)' }
      ],
      operationMapping: [
        { mathSymbol: 'x_i - y_i', pythonEquivalent: 'x - y', explanation: 'Coordinate displacement' },
        { mathSymbol: '\\sqrt{\\sum \\dots^2}', pythonEquivalent: 'np.linalg.norm(x - y)', explanation: 'L2 norm reduction' }
      ],
      computationalComplexity: { time: 'O(n)', space: 'O(1)', flops: '3n FLOPs' },
      numericalSafeguards: ['LAPACK-backed norm prevents floating point underflow/overflow.']
    })
  },

  // 3. Mean Squared Error (MSE)
  {
    pattern: 'mean_squared_error',
    name: 'Mean Squared Error (MSE)',
    category: 'Statistics & Regression',
    latex: '\\operatorname{MSE} = \\frac{1}{n}\\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2',
    simple: 'MSE = (1/n) * sum((y_i - y_hat_i)^2)',
    match: (norm, raw) => {
      if (/mae|absolute/i.test(norm) || /\|.*y.*-.*\\hat.*\|/.test(raw) || /abs\s*\(/i.test(norm)) return false;
      return (
        /mse/i.test(norm) ||
        /mean.*squared.*error/i.test(norm) ||
        (/\\frac\{1\}\{n\}/i.test(raw) && /y.*-.*\\hat/i.test(raw) && /\^2/.test(raw)) ||
        (/sum.*\(.*y.*-.*y_hat.*\)\s*\^\s*2/i.test(norm))
      );
    },
    getMetadata: () => ({
      pattern: 'mean_squared_error',
      displayName: 'Mean Squared Error (MSE)',
      category: 'Statistics & Regression',
      standardLatex: '\\operatorname{MSE} = \\frac{1}{n}\\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2',
      variables: [
        { name: 'y_true', type: 'np.ndarray', shape: '(n,)', description: 'Observed ground truth targets' },
        { name: 'y_pred', type: 'np.ndarray', shape: '(n,)', description: 'Model predicted response values' }
      ],
      assumptions: ['Array inputs must be non-empty and have matching dimensions.', 'Penalizes large errors quadratically.'],
      complexity: 'O(n) time, O(1) space',
      stabilityNotes: ['Squared residuals are strictly positive; large deviations scale rapidly.']
    }),
    generateCode: () => `import numpy as np

def mean_squared_error(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Compute Mean Squared Error (MSE)."""
    yt = np.asarray(y_true, dtype=float)
    yp = np.asarray(y_pred, dtype=float)
    if yt.shape != yp.shape or yt.size == 0:
        raise ValueError("Inputs must be non-empty arrays with matching shapes.")
    return float(np.mean((yt - yp) ** 2))

# Example verification
y_true = np.array([3.0, -0.5, 2.0, 7.0])
y_pred = np.array([2.5, 0.0, 2.0, 8.0])
print("MSE:", mean_squared_error(y_true, y_pred))
`,
    explain: () => ({
      title: 'Mean Squared Error (MSE)',
      category: 'Statistics & Regression',
      formalDefinition: '\\operatorname{MSE} = \\frac{1}{n}\\sum_{i=1}^n (y_i - \\hat{y}_i)^2. Expected squared distance between estimator predictions and true values.',
      domainAndConstraints: ['y, \\hat{y} \\in \\mathbb{R}^n', '\\operatorname{MSE} \\ge 0'],
      variableRoles: [
        { symbol: 'y_i', role: 'Actual target', shape: 'scalar' },
        { symbol: '\\hat{y}_i', role: 'Predicted target', shape: 'scalar' },
        { symbol: 'n', role: 'Sample count', shape: 'scalar integer' }
      ],
      operationMapping: [
        { mathSymbol: 'y_i - \\hat{y}_i', pythonEquivalent: 'y_true - y_pred', explanation: 'Residual calculation' },
        { mathSymbol: '\\frac{1}{n}\\sum \\dots^2', pythonEquivalent: 'np.mean(residuals ** 2)', explanation: 'Mean squared reduction' }
      ],
      computationalComplexity: { time: 'O(n)', space: 'O(1)', flops: '2n FLOPs' },
      numericalSafeguards: ['Input shape check guarantees valid pairwise residuals.']
    })
  },

  // 4. Mean Absolute Error (MAE)
  {
    pattern: 'mean_absolute_error',
    name: 'Mean Absolute Error (MAE)',
    category: 'Statistics & Regression',
    latex: '\\operatorname{MAE} = \\frac{1}{n}\\sum_{i=1}^{n} |y_i - \\hat{y}_i|',
    simple: 'MAE = (1/n) * sum(abs(y_i - y_hat_i))',
    match: (norm, raw) =>
      /mae/i.test(norm) ||
      (/mean.*absolute.*error/i.test(norm) || (/\\frac\{1\}\{n\}/i.test(raw) && /\|y.*-.*\\hat.*\|/i.test(raw))),
    getMetadata: () => ({
      pattern: 'mean_absolute_error',
      displayName: 'Mean Absolute Error (MAE)',
      category: 'Statistics & Regression',
      standardLatex: '\\operatorname{MAE} = \\frac{1}{n}\\sum_{i=1}^{n} |y_i - \\hat{y}_i|',
      variables: [
        { name: 'y_true', type: 'np.ndarray', shape: '(n,)', description: 'Observed ground truth targets' },
        { name: 'y_pred', type: 'np.ndarray', shape: '(n,)', description: 'Model predicted response values' }
      ],
      assumptions: ['Robust to outliers compared to MSE because residuals are linear rather than quadratic.'],
      complexity: 'O(n) time, O(1) space',
      stabilityNotes: ['Derivative is discontinuous at y_i = y_pred (subgradient is in [-1, 1]).']
    }),
    generateCode: () => `import numpy as np

def mean_absolute_error(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Compute Mean Absolute Error (MAE)."""
    yt = np.asarray(y_true, dtype=float)
    yp = np.asarray(y_pred, dtype=float)
    if yt.shape != yp.shape or yt.size == 0:
        raise ValueError("Inputs must be non-empty arrays with matching shapes.")
    return float(np.mean(np.abs(yt - yp)))

# Example verification
y_true = np.array([3.0, -0.5, 2.0, 7.0])
y_pred = np.array([2.5, 0.0, 2.0, 8.0])
print("MAE:", mean_absolute_error(y_true, y_pred))
`,
    explain: () => ({
      title: 'Mean Absolute Error (MAE)',
      category: 'Statistics & Regression',
      formalDefinition: '\\operatorname{MAE} = \\frac{1}{n}\\sum_{i=1}^n |y_i - \\hat{y}_i|. Linear L1 residual loss measuring average error magnitude.',
      domainAndConstraints: ['y, \\hat{y} \\in \\mathbb{R}^n', '\\operatorname{MAE} \\ge 0'],
      variableRoles: [
        { symbol: 'y_i', role: 'Actual target', shape: 'scalar' },
        { symbol: '\\hat{y}_i', role: 'Predicted target', shape: 'scalar' }
      ],
      operationMapping: [
        { mathSymbol: '|y_i - \\hat{y}_i|', pythonEquivalent: 'np.abs(y_true - y_pred)', explanation: 'Absolute residual magnitude' },
        { mathSymbol: '\\frac{1}{n}\\sum', pythonEquivalent: 'np.mean(...)', explanation: 'Average reduction' }
      ],
      computationalComplexity: { time: 'O(n)', space: 'O(1)', flops: '2n FLOPs' },
      numericalSafeguards: ['Non-empty shape validation.']
    })
  },

  // 5. Variance
  {
    pattern: 'variance',
    name: 'Statistical Variance (Population & Sample)',
    category: 'Probability & Statistics',
    latex: '\\sigma^2 = \\frac{1}{N}\\sum_{i=1}^{N} (x_i - \\mu)^2, \\quad s^2 = \\frac{1}{n-1}\\sum_{i=1}^{n} (x_i - \\bar{x})^2',
    simple: 'Var(X) = (1/n) * sum((x_i - mean)^2)',
    match: (norm, raw) =>
      (/\\sigma\^2/i.test(raw) || /s\^2/i.test(raw) || /variance/i.test(norm)) &&
      (/\\mu/i.test(raw) || /\\bar\{x\}/i.test(raw) || /x_i.*-.*mean/i.test(norm)),
    getMetadata: () => ({
      pattern: 'variance',
      displayName: 'Variance',
      category: 'Probability & Statistics',
      standardLatex: '\\sigma^2 = \\frac{1}{N}\\sum_{i=1}^{N} (x_i - \\mu)^2',
      variables: [
        { name: 'x', type: 'np.ndarray', shape: '(n,)', description: 'Sample or population data array' }
      ],
      assumptions: ['Population variance uses ddof=0; sample variance uses ddof=1 (Bessel\'s correction).'],
      complexity: 'O(n) time, O(1) space',
      stabilityNotes: ['Two-pass algorithm (subtracting mean first) avoids catastrophic cancellation in sum(x^2) - (sum(x))^2/n.']
    }),
    generateCode: () => `import numpy as np

def variance(x: np.ndarray, ddof: int = 0) -> float:
    """Compute population (ddof=0) or sample (ddof=1) variance."""
    arr = np.asarray(x, dtype=float)
    if arr.size <= ddof:
        raise ValueError(f"Array size {arr.size} must exceed ddof {ddof}.")
    return float(np.var(arr, ddof=ddof))

# Example verification
data = np.array([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])
print("Population variance:", variance(data, ddof=0))
print("Sample variance:", variance(data, ddof=1))
`,
    explain: () => ({
      title: 'Statistical Variance',
      category: 'Probability & Statistics',
      formalDefinition: '\\operatorname{Var}(X) = \\mathbb{E}[(X - \\mathbb{E}[X])^2]. Second central moment measuring data spread.',
      domainAndConstraints: ['x \\in \\mathbb{R}^n', '\\operatorname{Var}(X) \\ge 0'],
      variableRoles: [{ symbol: 'x_i', role: 'Data points', shape: '(n,)' }],
      operationMapping: [
        { mathSymbol: 'x_i - \\mu', pythonEquivalent: 'x - np.mean(x)', explanation: 'Mean-centering' },
        { mathSymbol: '\\frac{1}{N}\\sum \\dots^2', pythonEquivalent: 'np.var(x, ddof=ddof)', explanation: 'Variance computation' }
      ],
      computationalComplexity: { time: 'O(n)', space: 'O(1)', flops: '3n FLOPs' },
      numericalSafeguards: ['Bessel correction degree-of-freedom guard.']
    })
  },

  // 6. Covariance
  {
    pattern: 'covariance',
    name: 'Covariance Measure',
    category: 'Probability & Statistics',
    latex: '\\operatorname{Cov}(X, Y) = \\frac{1}{n - \\text{ddof}}\\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})',
    simple: 'Cov(X, Y) = (1/n) * sum((x - mean_x) * (y - mean_y))',
    match: (norm, raw) =>
      /cov/i.test(norm) && !/corr/i.test(norm) && (/x.*y/i.test(norm) || /x_i.*y_i/i.test(raw)),
    getMetadata: () => ({
      pattern: 'covariance',
      displayName: 'Covariance',
      category: 'Probability & Statistics',
      standardLatex: '\\operatorname{Cov}(X, Y) = \\frac{1}{n - \\text{ddof}}\\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})',
      variables: [
        { name: 'x', type: 'np.ndarray', shape: '(n,)', description: 'First variable vector' },
        { name: 'y', type: 'np.ndarray', shape: '(n,)', description: 'Second variable vector' }
      ],
      assumptions: ['Sign indicates direction of linear association; magnitude depends on scale of variables.'],
      complexity: 'O(n) time, O(1) space',
      stabilityNotes: ['Center both variables by their respective sample means.']
    }),
    generateCode: () => `import numpy as np

def covariance(x: np.ndarray, y: np.ndarray, ddof: int = 0) -> float:
    """Compute population (ddof=0) or sample (ddof=1) covariance."""
    x_arr = np.asarray(x, dtype=float)
    y_arr = np.asarray(y, dtype=float)
    if x_arr.shape != y_arr.shape or x_arr.size <= ddof:
        raise ValueError("Inputs must have matching lengths exceeding ddof.")
    x_dev = x_arr - np.mean(x_arr)
    y_dev = y_arr - np.mean(y_arr)
    return float(np.sum(x_dev * y_dev) / (x_arr.size - ddof))

# Example verification
x = np.array([1.0, 2.0, 3.0])
y = np.array([2.0, 4.0, 6.0])
print("Covariance:", covariance(x, y, ddof=0))
`,
    explain: () => ({
      title: 'Covariance',
      category: 'Probability & Statistics',
      formalDefinition: '\\operatorname{Cov}(X, Y) = \\mathbb{E}[(X - \\mu_X)(Y - \\mu_Y)]. Joint variability of two random variables.',
      domainAndConstraints: ['x, y \\in \\mathbb{R}^n'],
      variableRoles: [
        { symbol: 'x', role: 'Variable 1', shape: '(n,)' },
        { symbol: 'y', role: 'Variable 2', shape: '(n,)' }
      ],
      operationMapping: [
        { mathSymbol: '(x_i - \\bar{x})(y_i - \\bar{y})', pythonEquivalent: '(x - mx) * (y - my)', explanation: 'Co-deviation product' }
      ],
      computationalComplexity: { time: 'O(n)', space: 'O(1)', flops: '4n FLOPs' },
      numericalSafeguards: ['Length equality check.']
    })
  },

  // 7. Pearson Correlation
  {
    pattern: 'pearson_correlation',
    name: 'Pearson Correlation Coefficient',
    category: 'Probability & Statistics',
    latex: 'r = \\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum_{i=1}^{n} (x_i - \\bar{x})^2 \\sum_{i=1}^{n} (y_i - \\bar{y})^2}}',
    simple: 'r = sum((x-mx)*(y-my)) / sqrt(sum((x-mx)^2) * sum((y-my)^2))',
    match: (norm, raw) =>
      /pearson/i.test(norm) ||
      (/correlation/i.test(norm) && /\\sqrt/i.test(raw)) ||
      (/\br\s*=/i.test(raw) && /\\sqrt/i.test(raw) && /x_i.*y_i/i.test(raw)),
    getMetadata: () => ({
      pattern: 'pearson_correlation',
      displayName: 'Pearson Correlation Coefficient',
      category: 'Probability & Statistics',
      standardLatex: 'r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}',
      variables: [
        { name: 'x', type: 'np.ndarray', shape: '(n,)', description: 'First continuous variable' },
        { name: 'y', type: 'np.ndarray', shape: '(n,)', description: 'Second continuous variable' }
      ],
      assumptions: ['Bounded in [-1.0, 1.0]. Undefined for constant vectors with zero variance.'],
      complexity: 'O(n) time, O(1) space',
      stabilityNotes: ['Explicit zero standard deviation guard prevents division by zero.']
    }),
    generateCode: () => `import numpy as np

def pearson_correlation(x: np.ndarray, y: np.ndarray) -> float:
    """Compute Pearson correlation coefficient r in [-1, 1]."""
    x_arr = np.asarray(x, dtype=float)
    y_arr = np.asarray(y, dtype=float)
    if x_arr.shape != y_arr.shape or x_arr.size < 2:
        raise ValueError("Inputs must be 1D arrays of equal length >= 2.")
    xd = x_arr - np.mean(x_arr)
    yd = y_arr - np.mean(y_arr)
    ss_x = np.sum(xd ** 2)
    ss_y = np.sum(yd ** 2)
    if ss_x == 0.0 or ss_y == 0.0:
        raise ValueError("Pearson correlation is undefined for constant vectors.")
    r = np.sum(xd * yd) / np.sqrt(ss_x * ss_y)
    return float(np.clip(r, -1.0, 1.0))

# Example verification
x = np.array([1.0, 2.0, 3.0, 4.0])
y = np.array([2.0, 4.0, 6.0, 8.0])
print("Pearson r:", pearson_correlation(x, y))
`,
    explain: () => ({
      title: 'Pearson Correlation Coefficient',
      category: 'Probability & Statistics',
      formalDefinition: 'r = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X \\sigma_Y}. Normalized measure of linear relationship strength.',
      domainAndConstraints: ['r \\in [-1.0, 1.0]'],
      variableRoles: [
        { symbol: 'x', role: 'Input series 1', shape: '(n,)' },
        { symbol: 'y', role: 'Input series 2', shape: '(n,)' }
      ],
      operationMapping: [
        { mathSymbol: 'r', pythonEquivalent: 'pearson_correlation(x, y)', explanation: 'Normalized covariance' }
      ],
      computationalComplexity: { time: 'O(n)', space: 'O(1)', flops: '5n FLOPs' },
      numericalSafeguards: ['Zero-variance detection.']
    })
  },

  // 8. Gradient Descent
  {
    pattern: 'gradient_descent',
    name: 'Gradient Descent Parameter Update Rule',
    category: 'Optimization & Machine Learning',
    latex: '\\theta_{t+1} = \\theta_t - \\eta \\nabla J(\\theta_t)',
    simple: 'theta_next = theta - eta * grad',
    match: (norm, raw) =>
      (/theta/i.test(norm) || /\\theta/i.test(raw)) &&
      (/grad/i.test(norm) || /nabla/i.test(norm) || /\\nabla/i.test(raw) || /eta/i.test(norm) || /alpha/i.test(norm) || /\\eta/i.test(raw) || /learning_rate/i.test(norm)),
    getMetadata: () => ({
      pattern: 'gradient_descent',
      displayName: 'Gradient Descent Update',
      category: 'Optimization & Machine Learning',
      standardLatex: '\\theta_{t+1} = \\theta_t - \\eta \\nabla J(\\theta_t)',
      variables: [
        { name: 'theta', type: 'np.ndarray', shape: '(D,)', description: 'Model parameters' },
        { name: 'grad', type: 'np.ndarray', shape: '(D,)', description: 'Objective function gradient' },
        { name: 'lr', type: 'float', shape: 'scalar', description: 'Step size learning rate eta' }
      ],
      assumptions: ['Learning rate lr > 0. Steps in direction of steepest descent.'],
      complexity: 'O(D) time per step',
      stabilityNotes: ['Too large learning rate causes divergence; too small causes slow convergence.']
    }),
    generateCode: () => `import numpy as np

def gradient_descent_step(theta: np.ndarray, grad: np.ndarray, lr: float) -> np.ndarray:
    """Perform one gradient descent update step: theta - lr * grad."""
    t_arr = np.asarray(theta, dtype=float)
    g_arr = np.asarray(grad, dtype=float)
    if t_arr.shape != g_arr.shape:
        raise ValueError("theta and grad shapes must match.")
    if lr <= 0:
        raise ValueError("Learning rate must be > 0.")
    return t_arr - float(lr) * g_arr

# Example verification
theta = np.array([5.0])
grad = np.array([2.0])
print("Updated theta:", gradient_descent_step(theta, grad, lr=0.1))
`,
    explain: () => ({
      title: 'Gradient Descent Update Rule',
      category: 'Optimization & Machine Learning',
      formalDefinition: '\\theta_{t+1} = \\theta_t - \\eta \\nabla J(\\theta_t). Iterative first-order optimization algorithm.',
      domainAndConstraints: ['\\eta > 0'],
      variableRoles: [
        { symbol: '\\theta', role: 'Parameters', shape: '(D,)' },
        { symbol: '\\nabla J', role: 'Gradient vector', shape: '(D,)' }
      ],
      operationMapping: [
        { mathSymbol: '-\\eta \\nabla J', pythonEquivalent: '-lr * grad', explanation: 'Descent step displacement' }
      ],
      computationalComplexity: { time: 'O(D)', space: 'O(D)', flops: '2D FLOPs' },
      numericalSafeguards: ['Positive learning rate verification.']
    })
  },

  // 9. Precision
  {
    pattern: 'precision',
    name: 'Precision Classification Metric',
    category: 'Classification Metrics',
    latex: '\\operatorname{Precision} = \\frac{TP}{TP + FP}',
    simple: 'Precision = TP / (TP + FP)',
    match: (norm, raw) => {
      if (/f1|f_1/i.test(norm) || /f_1/i.test(raw) || /recall/i.test(norm)) return false;
      return (
        /precision/i.test(norm) ||
        (/tp\s*\/\s*\(tp\s*\+\s*fp\)/i.test(norm) || (/TP/i.test(raw) && /FP/i.test(raw) && !/FN/i.test(raw)))
      );
    },
    getMetadata: () => ({
      pattern: 'precision',
      displayName: 'Precision',
      category: 'Classification Metrics',
      standardLatex: '\\operatorname{Precision} = \\frac{TP}{TP + FP}',
      variables: [
        { name: 'tp', type: 'float', shape: 'scalar', description: 'True positive count' },
        { name: 'fp', type: 'float', shape: 'scalar', description: 'False positive count' }
      ],
      assumptions: ['Returns zero_division value if TP + FP == 0.'],
      complexity: 'O(1) time',
      stabilityNotes: ['Explicit denominator zero check.']
    }),
    generateCode: () => `def precision_score(tp: float, fp: float, zero_division: float = 0.0) -> float:
    """Compute precision TP / (TP + FP)."""
    denom = float(tp + fp)
    if denom == 0.0:
        return float(zero_division)
    return float(tp / denom)

print("Precision:", precision_score(tp=80, fp=20))
`,
    explain: () => ({
      title: 'Precision Score',
      category: 'Classification Metrics',
      formalDefinition: '\\operatorname{Precision} = \\frac{TP}{TP + FP}. Proportion of positive identifications that were actually correct.',
      domainAndConstraints: ['TP, FP \\ge 0', 'Precision \\in [0, 1]'],
      variableRoles: [{ symbol: 'TP', role: 'True Positives', shape: 'scalar' }, { symbol: 'FP', role: 'False Positives', shape: 'scalar' }],
      operationMapping: [{ mathSymbol: 'TP/(TP+FP)', pythonEquivalent: 'tp / (tp + fp)', explanation: 'Positive predictive value' }],
      computationalComplexity: { time: 'O(1)', space: 'O(1)', flops: '2 FLOPs' },
      numericalSafeguards: ['Zero-division safeguard.']
    })
  },

  // 10. Recall
  {
    pattern: 'recall',
    name: 'Recall (Sensitivity) Classification Metric',
    category: 'Classification Metrics',
    latex: '\\operatorname{Recall} = \\frac{TP}{TP + FN}',
    simple: 'Recall = TP / (TP + FN)',
    match: (norm, raw) => {
      if (/f1|f_1/i.test(norm) || /f_1/i.test(raw) || /precision/i.test(norm)) return false;
      return (
        (/recall/i.test(norm) || /sensitivity/i.test(norm)) ||
        (/tp\s*\/\s*\(tp\s*\+\s*fn\)/i.test(norm) || (/TP/i.test(raw) && /FN/i.test(raw) && !/FP/i.test(raw)))
      );
    },
    getMetadata: () => ({
      pattern: 'recall',
      displayName: 'Recall / Sensitivity',
      category: 'Classification Metrics',
      standardLatex: '\\operatorname{Recall} = \\frac{TP}{TP + FN}',
      variables: [
        { name: 'tp', type: 'float', shape: 'scalar', description: 'True positive count' },
        { name: 'fn', type: 'float', shape: 'scalar', description: 'False negative count' }
      ],
      assumptions: ['Returns zero_division value if TP + FN == 0.'],
      complexity: 'O(1) time',
      stabilityNotes: ['Explicit denominator zero check.']
    }),
    generateCode: () => `def recall_score(tp: float, fn: float, zero_division: float = 0.0) -> float:
    """Compute recall (sensitivity) TP / (TP + FN)."""
    denom = float(tp + fn)
    if denom == 0.0:
        return float(zero_division)
    return float(tp / denom)

print("Recall:", recall_score(tp=80, fn=20))
`,
    explain: () => ({
      title: 'Recall / Sensitivity',
      category: 'Classification Metrics',
      formalDefinition: '\\operatorname{Recall} = \\frac{TP}{TP + FN}. Proportion of actual positives identified correctly.',
      domainAndConstraints: ['TP, FN \\ge 0', 'Recall \\in [0, 1]'],
      variableRoles: [{ symbol: 'TP', role: 'True Positives', shape: 'scalar' }, { symbol: 'FN', role: 'False Negatives', shape: 'scalar' }],
      operationMapping: [{ mathSymbol: 'TP/(TP+FN)', pythonEquivalent: 'tp / (tp + fn)', explanation: 'True positive rate' }],
      computationalComplexity: { time: 'O(1)', space: 'O(1)', flops: '2 FLOPs' },
      numericalSafeguards: ['Zero-division safeguard.']
    })
  },

  // 11. F1-score
  {
    pattern: 'f1_score',
    name: 'F1-score Harmonic Metric',
    category: 'Classification Metrics',
    latex: 'F_1 = 2\\frac{\\operatorname{Precision} \\cdot \\operatorname{Recall}}{\\operatorname{Precision} + \\operatorname{Recall}} = \\frac{2TP}{2TP + FP + FN}',
    simple: 'F1 = 2 * (P * R) / (P + R)',
    match: (norm, raw) =>
      /f1/i.test(norm) ||
      /f_1/i.test(raw) ||
      (/2.*precision.*recall/i.test(norm) || /2.*tp.*\(2tp/i.test(norm)),
    getMetadata: () => ({
      pattern: 'f1_score',
      displayName: 'F1-score',
      category: 'Classification Metrics',
      standardLatex: 'F_1 = 2\\frac{\\operatorname{Precision} \\cdot \\operatorname{Recall}}{\\operatorname{Precision} + \\operatorname{Recall}}',
      variables: [
        { name: 'precision', type: 'float', shape: 'scalar', description: 'Precision score' },
        { name: 'recall', type: 'float', shape: 'scalar', description: 'Recall score' }
      ],
      assumptions: ['Harmonic mean balances precision and recall.'],
      complexity: 'O(1) time',
      stabilityNotes: ['Handles zero denominator when precision + recall == 0.']
    }),
    generateCode: () => `def f1_score(precision: float, recall: float, zero_division: float = 0.0) -> float:
    """Compute harmonic mean F1-score."""
    denom = precision + recall
    if denom == 0.0:
        return float(zero_division)
    return float(2.0 * (precision * recall) / denom)

print("F1-score:", f1_score(0.8, 0.8))
`,
    explain: () => ({
      title: 'F1-score',
      category: 'Classification Metrics',
      formalDefinition: 'F_1 = 2\\frac{P \\cdot R}{P + R}. Harmonic mean of precision and recall.',
      domainAndConstraints: ['F_1 \\in [0, 1]'],
      variableRoles: [{ symbol: 'P', role: 'Precision', shape: 'scalar' }, { symbol: 'R', role: 'Recall', shape: 'scalar' }],
      operationMapping: [{ mathSymbol: '2PR/(P+R)', pythonEquivalent: '2 * p * r / (p + r)', explanation: 'Harmonic mean' }],
      computationalComplexity: { time: 'O(1)', space: 'O(1)', flops: '4 FLOPs' },
      numericalSafeguards: ['Zero-division check.']
    })
  },

  // 12. Chain Rule
  {
    pattern: 'chain_rule',
    name: 'Chain Rule of Differentiation',
    category: 'Calculus & Optimization',
    latex: '\\frac{dy}{dx} = f\'(g(x)) \\cdot g\'(x)',
    simple: 'dy/dx = f_prime(g(x)) * g_prime(x)',
    match: (norm, raw) =>
      /chain.*rule/i.test(norm) ||
      (/dy\/dx/i.test(norm) && /f'.*g'/i.test(norm)) ||
      (/\\frac\{dy\}\{dx\}/i.test(raw) && /f'/i.test(raw)),
    getMetadata: () => ({
      pattern: 'chain_rule',
      displayName: 'Chain Rule',
      category: 'Calculus & Optimization',
      standardLatex: '\\frac{dy}{dx} = f\'(g(x)) \\cdot g\'(x)',
      variables: [
        { name: 'x', type: 'float or np.ndarray', shape: 'arbitrary', description: 'Input variable' }
      ],
      assumptions: ['Inner function g is differentiable at x, outer function f is differentiable at g(x).'],
      complexity: 'O(1) per point',
      stabilityNotes: ['Foundational principle of backpropagation in deep neural networks.']
    }),
    generateCode: () => `import numpy as np

def chain_rule_power_example(x: float, a: float = 3.0, b: float = 1.0, n: int = 2):
    """Evaluate y = (a*x + b)^n and analytical dy/dx = n*(a*x + b)^(n-1) * a."""
    u = a * x + b
    y = u ** n
    dy_dx = n * (u ** (n - 1)) * a
    return y, dy_dx

val, grad = chain_rule_power_example(x=1.0)
print(f"y(1.0) = {val}, dy/dx(1.0) = {grad}")
`,
    explain: () => ({
      title: 'Chain Rule of Differentiation',
      category: 'Calculus & Optimization',
      formalDefinition: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) g\'(x). Differentiation rule for composite functions.',
      domainAndConstraints: ['f, g differentiable'],
      variableRoles: [{ symbol: 'u = g(x)', role: 'Inner function', shape: 'intermediate' }],
      operationMapping: [{ mathSymbol: 'dy/dx', pythonEquivalent: 'dy_du * du_dx', explanation: 'Product of gradients' }],
      computationalComplexity: { time: 'O(1)', space: 'O(1)', flops: '5 FLOPs' },
      numericalSafeguards: ['Exact analytical calculation.']
    })
  },

  // 13. L1 Regularization
  {
    pattern: 'l1_regularization',
    name: 'L1 Regularization (Lasso Penalty)',
    category: 'Optimization & Machine Learning',
    latex: 'J(\\mathbf{w}) = L(\\mathbf{w}) + \\lambda \\sum_{i=1}^{D} |w_i|',
    simple: 'J = Loss + lambda * sum(abs(w_i))',
    match: (norm, raw) =>
      /l1/i.test(norm) ||
      (/lasso/i.test(norm) || (/\\lambda/i.test(raw) && /\|w_i\|/i.test(raw))),
    getMetadata: () => ({
      pattern: 'l1_regularization',
      displayName: 'L1 Regularization (Lasso)',
      category: 'Optimization & Machine Learning',
      standardLatex: 'J(\\mathbf{w}) = L(\\mathbf{w}) + \\lambda \\sum_{i=1}^{D} |w_i|',
      variables: [
        { name: 'w', type: 'np.ndarray', shape: '(D,)', description: 'Model weight vector' },
        { name: 'lambda_param', type: 'float', shape: 'scalar', description: 'Regularization coefficient' }
      ],
      assumptions: ['lambda_param >= 0. Induces parameter sparsity by driving weights exactly to zero.'],
      complexity: 'O(D) time',
      stabilityNotes: ['Non-differentiable at zero; subgradient in [-1, 1] used in optimization.']
    }),
    generateCode: () => `import numpy as np

def l1_regularization_penalty(w: np.ndarray, lambda_param: float) -> float:
    """Compute L1 penalty lambda * sum(|w_i|)."""
    if lambda_param < 0:
        raise ValueError("lambda_param must be >= 0.")
    return float(lambda_param * np.sum(np.abs(w)))

w = np.array([1.5, -2.0, 0.0])
print("L1 penalty:", l1_regularization_penalty(w, lambda_param=0.5))
`,
    explain: () => ({
      title: 'L1 Regularization (Lasso)',
      category: 'Optimization & Machine Learning',
      formalDefinition: '\\Omega(\\mathbf{w}) = \\lambda \\sum |w_i|. Induces diamond-shaped constraint promoting sparsity.',
      domainAndConstraints: ['\\lambda \\ge 0'],
      variableRoles: [{ symbol: 'w', role: 'Weights', shape: '(D,)' }],
      operationMapping: [{ mathSymbol: '|w_i|', pythonEquivalent: 'np.abs(w)', explanation: 'L1 norm' }],
      computationalComplexity: { time: 'O(D)', space: 'O(1)', flops: '2D FLOPs' },
      numericalSafeguards: ['Non-negative lambda validation.']
    })
  },

  // 14. L2 Regularization
  {
    pattern: 'l2_regularization',
    name: 'L2 Regularization (Ridge / Weight Decay)',
    category: 'Optimization & Machine Learning',
    latex: 'J(\\mathbf{w}) = L(\\mathbf{w}) + \\lambda \\sum_{i=1}^{D} w_i^2',
    simple: 'J = Loss + lambda * sum(w_i^2)',
    match: (norm, raw) =>
      /l2/i.test(norm) ||
      (/ridge/i.test(norm) || (/\\lambda/i.test(raw) && /w_i\^2/i.test(raw))),
    getMetadata: () => ({
      pattern: 'l2_regularization',
      displayName: 'L2 Regularization (Ridge)',
      category: 'Optimization & Machine Learning',
      standardLatex: 'J(\\mathbf{w}) = L(\\mathbf{w}) + \\lambda \\sum_{i=1}^{D} w_i^2',
      variables: [
        { name: 'w', type: 'np.ndarray', shape: '(D,)', description: 'Model weight vector' },
        { name: 'lambda_param', type: 'float', shape: 'scalar', description: 'Regularization coefficient' }
      ],
      assumptions: ['lambda_param >= 0. Smooth and differentiable everywhere with gradient 2*lambda*w.'],
      complexity: 'O(D) time',
      stabilityNotes: ['Shrinks weights proportionally towards zero without setting them strictly to zero.']
    }),
    generateCode: () => `import numpy as np

def l2_regularization_penalty(w: np.ndarray, lambda_param: float, factor_half: bool = False) -> float:
    """Compute L2 penalty lambda * sum(w_i^2)."""
    if lambda_param < 0:
        raise ValueError("lambda_param must be >= 0.")
    coeff = 0.5 * lambda_param if factor_half else lambda_param
    return float(coeff * np.sum(np.asarray(w, dtype=float) ** 2))

w = np.array([1.0, 2.0])
print("L2 penalty:", l2_regularization_penalty(w, lambda_param=0.5))
`,
    explain: () => ({
      title: 'L2 Regularization (Ridge)',
      category: 'Optimization & Machine Learning',
      formalDefinition: '\\Omega(\\mathbf{w}) = \\lambda \\sum w_i^2. Spherical constraint penalizing large weight amplitudes.',
      domainAndConstraints: ['\\lambda \\ge 0'],
      variableRoles: [{ symbol: 'w', role: 'Weights', shape: '(D,)' }],
      operationMapping: [{ mathSymbol: 'w_i^2', pythonEquivalent: 'w ** 2', explanation: 'Squared L2 norm' }],
      computationalComplexity: { time: 'O(D)', space: 'O(1)', flops: '2D FLOPs' },
      numericalSafeguards: ['Non-negative lambda check.']
    })
  },

  // 15. Z-Score Standardization
  {
    pattern: 'z_score',
    name: 'Z-Score Standardization (Standard Normal Score)',
    category: 'Probability & Statistics',
    latex: 'z = \\frac{x - \\mu}{\\sigma}',
    simple: 'z = (x - mu) / sigma',
    match: (norm, raw) =>
      /z_?score/i.test(norm) ||
      /standardize/i.test(norm) ||
      (/\\frac\{x\s*-\s*\\mu\}\{\\sigma\}/i.test(raw)) ||
      (/z\s*=\s*\\frac\{.*\\mu\}\{\\sigma\}/i.test(raw)) ||
      (/z\s*=\s*\(x.*-.*mu\)\s*\/\s*sigma/i.test(norm)) ||
      (/\(x\s*-\s*\\?mu\)\s*\/\s*\\?sigma/i.test(norm)),
    getMetadata: () => ({
      pattern: 'z_score',
      displayName: 'Z-Score Standardization',
      category: 'Probability & Statistics',
      standardLatex: 'z = \\frac{x - \\mu}{\\sigma}',
      variables: [
        { name: 'x', type: 'float or np.ndarray', shape: 'arbitrary', description: 'Observed value(s)' },
        { name: 'mu', type: 'float', shape: 'scalar', description: 'Mean center' },
        { name: 'sigma', type: 'float', shape: 'scalar', description: 'Standard deviation (sigma > 0)' }
      ],
      assumptions: ['sigma must be strictly positive > 0.'],
      complexity: 'O(n) time',
      stabilityNotes: ['Validates that standard deviation is non-zero before dividing.']
    }),
    generateCode: () => `import numpy as np

def z_score(x: np.ndarray, mu: float = None, sigma: float = None) -> np.ndarray:
    """Compute z-score standardization z = (x - mu) / sigma."""
    arr = np.asarray(x, dtype=float)
    m = float(mu) if mu is not None else float(np.mean(arr))
    s = float(sigma) if sigma is not None else float(np.std(arr))
    if s <= 0:
        raise ValueError("Standard deviation must be strictly positive.")
    return (arr - m) / s

data = np.array([10.0, 20.0, 30.0])
print("Z-scores:", z_score(data))
`,
    explain: () => ({
      title: 'Z-Score Standardization',
      category: 'Probability & Statistics',
      formalDefinition: 'z = \\frac{x - \\mu}{\\sigma}. Transforms data to have mean 0 and standard deviation 1.',
      domainAndConstraints: ['\\sigma > 0'],
      variableRoles: [{ symbol: 'x', role: 'Raw feature', shape: 'arbitrary' }],
      operationMapping: [{ mathSymbol: '(x-\\mu)/\\sigma', pythonEquivalent: '(x - m) / s', explanation: 'Center and scale' }],
      computationalComplexity: { time: 'O(n)', space: 'O(n)', flops: '2n FLOPs' },
      numericalSafeguards: ['Zero-standard deviation guard.']
    })
  },

  // 16. Shannon Entropy
  {
    pattern: 'entropy',
    name: 'Shannon Entropy',
    category: 'Information Theory',
    latex: 'H(X) = -\\sum_{i=1}^{K} p_i \\log_2(p_i)',
    simple: 'H(X) = -sum(p_i * log2(p_i))',
    match: (norm, raw) => {
      if (/kl|divergence|parallel|q_i|p_i\s*\/\s*q_i/i.test(norm) || /\\parallel/i.test(raw) || /D_\{?\\mathrm\{KL/i.test(raw)) return false;
      return (
        /shannon.*entropy/i.test(norm) ||
        /entropy/i.test(norm) ||
        (/H\s*\(/i.test(raw) && /log/i.test(raw)) ||
        (/-?\s*sum.*p.*log/i.test(norm))
      );
    },
    getMetadata: () => ({
      pattern: 'entropy',
      displayName: 'Shannon Entropy',
      category: 'Information Theory',
      standardLatex: 'H(X) = -\\sum_{i=1}^{K} p_i \\log_2(p_i)',
      variables: [
        { name: 'p', type: 'np.ndarray', shape: '(K,)', description: 'Discrete probability distribution vector' }
      ],
      assumptions: ['sum(p_i) == 1.0, p_i >= 0. Convention: 0 * log(0) = 0 by continuity.'],
      complexity: 'O(K) time',
      stabilityNotes: ['Only strictly positive probabilities are passed to logarithm.']
    }),
    generateCode: () => `import numpy as np

def shannon_entropy(p: np.ndarray, base: float = 2.0) -> float:
    """Compute Shannon Entropy H(X) in bits (base=2)."""
    p_arr = np.asarray(p, dtype=float)
    if np.any(p_arr < 0) or not np.isclose(np.sum(p_arr), 1.0, atol=1e-4):
        raise ValueError("p must be a valid probability distribution summing to 1.")
    pos = p_arr > 0.0
    return float(-np.sum(p_arr[pos] * (np.log(p_arr[pos]) / np.log(base))))

probs = np.array([0.5, 0.5])
print("Fair coin entropy:", shannon_entropy(probs), "bits")
`,
    explain: () => ({
      title: 'Shannon Entropy',
      category: 'Information Theory',
      formalDefinition: 'H(X) = -\\sum p_i \\log_2(p_i). Expected information content / uncertainty.',
      domainAndConstraints: ['p_i \\in [0, 1]', '\\sum p_i = 1'],
      variableRoles: [{ symbol: 'p_i', role: 'Outcome probability', shape: 'scalar' }],
      operationMapping: [{ mathSymbol: '-p \\log p', pythonEquivalent: '-p * log2(p)', explanation: 'Surprisal weighting' }],
      computationalComplexity: { time: 'O(K)', space: 'O(1)', flops: '3K FLOPs' },
      numericalSafeguards: ['0*log(0) continuity convention.']
    })
  },

  // 17. KL Divergence
  {
    pattern: 'kl_divergence',
    name: 'Kullback-Leibler (KL) Divergence',
    category: 'Information Theory',
    latex: 'D_{\\mathrm{KL}}(P \\parallel Q) = \\sum_{i} p_i \\log\\frac{p_i}{q_i}',
    simple: 'D_KL(P || Q) = sum(p_i * log(p_i / q_i))',
    match: (norm, raw) =>
      /kl_?divergence/i.test(norm) ||
      /kullback/i.test(norm) ||
      (/d_?kl/i.test(norm) || /D_\\{?\\mathrm\{KL\}\\}?/i.test(raw)) ||
      (/p.*log.*p\s*\/\s*q/i.test(norm)) ||
      (/\\parallel/i.test(raw)),
    getMetadata: () => ({
      pattern: 'kl_divergence',
      displayName: 'KL Divergence',
      category: 'Information Theory',
      standardLatex: 'D_{\\mathrm{KL}}(P \\parallel Q) = \\sum_{i} p_i \\log\\frac{p_i}{q_i}',
      variables: [
        { name: 'p', type: 'np.ndarray', shape: '(K,)', description: 'True probability distribution P' },
        { name: 'q', type: 'np.ndarray', shape: '(K,)', description: 'Model probability distribution Q' }
      ],
      assumptions: ['Not symmetric. If p_i > 0 and q_i == 0, divergence is infinite.'],
      complexity: 'O(K) time',
      stabilityNotes: ['Support condition verified: returns float("inf") if p_i > 0 and q_i == 0.']
    }),
    generateCode: () => `import numpy as np

def kl_divergence(p: np.ndarray, q: np.ndarray) -> float:
    """Compute KL Divergence D_KL(P || Q) in nats."""
    p_arr = np.asarray(p, dtype=float)
    q_arr = np.asarray(q, dtype=float)
    if np.any((p_arr > 0) & (q_arr == 0)):
        return float('inf')
    pos = p_arr > 0
    return float(np.sum(p_arr[pos] * np.log(p_arr[pos] / q_arr[pos])))

p = np.array([0.6, 0.4])
q = np.array([0.4, 0.6])
print("KL Divergence:", kl_divergence(p, q))
`,
    explain: () => ({
      title: 'Kullback-Leibler (KL) Divergence',
      category: 'Information Theory',
      formalDefinition: 'D_{\\mathrm{KL}}(P \\parallel Q) = \\sum p_i \\ln(p_i / q_i). Relative entropy measuring information lost when approximating P with Q.',
      domainAndConstraints: ['P, Q valid distributions'],
      variableRoles: [{ symbol: 'P', role: 'Reference distribution', shape: '(K,)' }, { symbol: 'Q', role: 'Model distribution', shape: '(K,)' }],
      operationMapping: [{ mathSymbol: 'p \\log(p/q)', pythonEquivalent: 'p * np.log(p / q)', explanation: 'Log-likelihood ratio' }],
      computationalComplexity: { time: 'O(K)', space: 'O(1)', flops: '4K FLOPs' },
      numericalSafeguards: ['Support condition infinite divergence handling.']
    })
  },

  // 18. Softmax
  {
    pattern: 'softmax',
    name: 'Softmax Probability Normalization',
    category: 'Deep Learning',
    latex: 'p_i = \\frac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}',
    simple: 'softmax(z)_i = exp(z_i) / sum(exp(z_j))',
    match: (norm, raw) =>
      /softmax/i.test(norm) ||
      (/e\^\{?z_i\}?/i.test(raw) && /\\sum.*e\^\{?z_j\}?/i.test(raw)) ||
      (/exp\(z_i\)\s*\/\s*sum\(exp/i.test(norm)),
    getMetadata: () => ({
      pattern: 'softmax',
      displayName: 'Softmax',
      category: 'Deep Learning',
      standardLatex: 'p_i = \\frac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}',
      variables: [
        { name: 'z', type: 'np.ndarray', shape: '(K,)', description: 'Unnormalized logit vector' }
      ],
      assumptions: ['Output probabilities lie in (0, 1) and sum to 1.0.'],
      complexity: 'O(K) time',
      stabilityNotes: ['Subtracts max(z) prior to exp to prevent float64 overflow.']
    }),
    generateCode: () => `import numpy as np

def softmax(z: np.ndarray, axis: int = -1) -> np.ndarray:
    """Compute numerically stable Softmax: exp(z - max(z)) / sum(...)."""
    arr = np.asarray(z, dtype=float)
    shifted = arr - np.max(arr, axis=axis, keepdims=True)
    exp_z = np.exp(shifted)
    return exp_z / np.sum(exp_z, axis=axis, keepdims=True)

logits = np.array([2.0, 1.0, 0.1])
print("Softmax probabilities:", softmax(logits))
`,
    explain: () => ({
      title: 'Softmax Activation',
      category: 'Deep Learning',
      formalDefinition: 'p_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}}. Normalizes logits into categorical posterior probabilities.',
      domainAndConstraints: ['p_i \\in (0, 1)', '\\sum p_i = 1'],
      variableRoles: [{ symbol: 'z', role: 'Logits', shape: '(K,)' }],
      operationMapping: [{ mathSymbol: 'e^z / \\sum', pythonEquivalent: 'softmax(z)', explanation: 'Normalized exponential' }],
      computationalComplexity: { time: 'O(K)', space: 'O(K)', flops: '3K FLOPs' },
      numericalSafeguards: ['Max subtraction for float overflow immunity.']
    })
  },

  // 19. ReLU Activation
  {
    pattern: 'relu',
    name: 'Rectified Linear Unit (ReLU) Activation',
    category: 'Deep Learning',
    latex: '\\operatorname{ReLU}(x) = \\max(0, x)',
    simple: 'ReLU(x) = max(0, x)',
    match: (norm, raw) =>
      /relu/i.test(norm) ||
      /\\max\s*\(0,\s*x\)/i.test(raw) ||
      /max\s*\(\s*0\s*,\s*x\s*\)/i.test(norm),
    getMetadata: () => ({
      pattern: 'relu',
      displayName: 'ReLU Activation',
      category: 'Deep Learning',
      standardLatex: '\\operatorname{ReLU}(x) = \\max(0, x)',
      variables: [
        { name: 'x', type: 'float or np.ndarray', shape: 'arbitrary', description: 'Pre-activation signal' }
      ],
      assumptions: ['Zeroes negative values, identity for positive values. Subgradient at 0 is 0.0.'],
      complexity: 'O(n) time',
      stabilityNotes: ['Non-saturating gradient of 1 for positive inputs mitigates vanishing gradients.']
    }),
    generateCode: () => `import numpy as np

def relu(x: np.ndarray) -> np.ndarray:
    """Compute Rectified Linear Unit: max(0, x)."""
    return np.maximum(0.0, np.asarray(x, dtype=float))

x = np.array([-3.5, 0.0, 2.8])
print("ReLU output:", relu(x))
`,
    explain: () => ({
      title: 'Rectified Linear Unit (ReLU)',
      category: 'Deep Learning',
      formalDefinition: '\\operatorname{ReLU}(x) = \\max(0, x). Piecewise linear threshold activation.',
      domainAndConstraints: ['x \\in \\mathbb{R}', '\\operatorname{ReLU}(x) \\ge 0'],
      variableRoles: [{ symbol: 'x', role: 'Input activation', shape: 'arbitrary' }],
      operationMapping: [{ mathSymbol: '\\max(0, x)', pythonEquivalent: 'np.maximum(0, x)', explanation: 'Ramp threshold' }],
      computationalComplexity: { time: 'O(n)', space: 'O(n)', flops: 'n comparisons' },
      numericalSafeguards: ['Zero-overhead vectorized comparison.']
    })
  },

  // 20. Binary Cross-Entropy
  {
    pattern: 'binary_cross_entropy',
    name: 'Binary Cross-Entropy Loss (Log Loss)',
    category: 'Deep Learning',
    latex: 'J = -\\frac{1}{n}\\sum_{i=1}^{n}\\left[ y_i \\ln(p_i) + (1 - y_i)\\ln(1 - p_i) \\right]',
    simple: 'J = -(1/n) * sum(y * log(p) + (1 - y) * log(1 - p))',
    match: (norm, raw) =>
      /binary_?cross_?entropy/i.test(norm) ||
      /bce/i.test(norm) ||
      (/y.*\\ln.*p/i.test(raw) || /y.*\\log.*p/i.test(raw)),
    getMetadata: () => ({
      pattern: 'binary_cross_entropy',
      displayName: 'Binary Cross-Entropy (BCE)',
      category: 'Deep Learning',
      standardLatex: 'J = -\\frac{1}{n}\\sum_{i=1}^{n}\\left[ y_i \\ln(p_i) + (1 - y_i)\\ln(1 - p_i) \\right]',
      variables: [
        { name: 'y_true', type: 'np.ndarray', shape: '(n,)', description: 'Binary targets in {0, 1}' },
        { name: 'y_pred', type: 'np.ndarray', shape: '(n,)', description: 'Predicted probabilities in [0, 1]' }
      ],
      assumptions: ['y_true in {0, 1}. Probabilities clipped to [eps, 1-eps] to prevent log(0).'],
      complexity: 'O(n) time',
      stabilityNotes: ['Probability clipping prevents numerical blowup to -inf.']
    }),
    generateCode: () => `import numpy as np

def binary_cross_entropy(y_true: np.ndarray, y_pred: np.ndarray, eps: float = 1e-15) -> float:
    """Compute Binary Cross-Entropy loss with probability clipping."""
    yt = np.asarray(y_true, dtype=float)
    yp = np.asarray(y_pred, dtype=float)
    p_clip = np.clip(yp, eps, 1.0 - eps)
    return float(-np.mean(yt * np.log(p_clip) + (1.0 - yt) * np.log(1.0 - p_clip)))

y_true = np.array([1, 0, 1])
y_pred = np.array([0.9, 0.2, 0.4])
print("BCE Loss:", binary_cross_entropy(y_true, y_pred))
`,
    explain: () => ({
      title: 'Binary Cross-Entropy Loss',
      category: 'Deep Learning',
      formalDefinition: 'J = -\\frac{1}{n}\\sum [y_i \\ln(p_i) + (1-y_i)\\ln(1-p_i)]. Negative log-likelihood under Bernoulli model.',
      domainAndConstraints: ['y_i \\in \\{0, 1\\}', 'p_i \\in [0, 1]'],
      variableRoles: [{ symbol: 'y', role: 'Binary label', shape: '(n,)' }, { symbol: 'p', role: 'Predicted probability', shape: '(n,)' }],
      operationMapping: [{ mathSymbol: '-\\ln(p)', pythonEquivalent: '-np.log(p)', explanation: 'Surrogate log penalty' }],
      computationalComplexity: { time: 'O(n)', space: 'O(1)', flops: '5n FLOPs' },
      numericalSafeguards: ['Epsilon probability clipping.']
    })
  }
];
