import { tokenizePython, TokenizerError } from './tokenizer';
import { RestrictedPythonParser, ParserError } from './parser';
import { recognizePattern } from './recognizer';
import type { ReverseConversionResult } from './types';

export * from './types';
export * from './tokenizer';
export * from './parser';
export * from './astToLatex';
export * from './recognizer';

export interface ReverseCodePreset {
  id: string;
  name: string;
  category: string;
  code: string;
  expectedEquation: string;
  description: string;
}

export const SUPPORTED_REVERSE_PRESETS: ReverseCodePreset[] = [
  // Linear Algebra
  {
    id: 'rev-matrix-mult',
    name: 'Matrix Multiplication',
    category: 'Linear Algebra',
    code: 'C = A @ B',
    expectedEquation: 'C = AB',
    description: 'NumPy @ matrix product operator contracting inner dimension K.'
  },
  {
    id: 'rev-vector-norm',
    name: 'Vector L2 Euclidean Norm',
    category: 'Linear Algebra',
    code: 'norm = np.sqrt(np.sum(x ** 2))',
    expectedEquation: '\\text{norm} = \\sqrt{\\sum_i x_i^2}',
    description: 'Euclidean geometric length of a 1D real coordinate vector.'
  },
  {
    id: 'rev-dot-product',
    name: 'Vector Dot Product',
    category: 'Linear Algebra',
    code: 'dot = np.dot(x, w)',
    expectedEquation: '\\mathbf{x} \\cdot \\mathbf{w} = \\sum_{i=1}^n x_i w_i',
    description: 'Inner product summation mapping two equal-length coordinate vectors to a scalar.'
  },
  {
    id: 'rev-euclidean-dist',
    name: 'Euclidean Distance Metric',
    category: 'Linear Algebra',
    code: 'dist = np.sqrt(np.sum((x - y) ** 2))',
    expectedEquation: 'd(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_{i=1}^{n} (x_i - y_i)^2}',
    description: 'L2 norm of the difference vector between two observation coordinates.'
  },

  // Optimization
  {
    id: 'rev-gradient-descent',
    name: 'Gradient Descent Step',
    category: 'Optimization',
    code: 'theta = theta - alpha * grad',
    expectedEquation: '\\theta_{t+1} = \\theta_t - \\alpha \\nabla J(\\theta_t)',
    description: 'First-order iterative parameter shift in the direction of steepest descent.'
  },

  // Statistics
  {
    id: 'rev-linear-regression',
    name: 'Linear Regression Prediction',
    category: 'Statistics',
    code: 'y_hat = X @ w + b',
    expectedEquation: '\\hat{y} = Xw + b',
    description: 'Continuous model prediction combining feature matrix projection with bias offset.'
  },
  {
    id: 'rev-variance',
    name: 'Sample Variance',
    category: 'Statistics',
    code: 'var = np.sum((x - mu) ** 2) / (n - 1)',
    expectedEquation: 's^2 = \\frac{1}{n - 1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2',
    description: 'Unbiased sample second central moment measuring statistical dispersion.'
  },
  {
    id: 'rev-covariance',
    name: 'Sample Covariance',
    category: 'Statistics',
    code: 'cov = np.sum((x - x_bar) * (y - y_bar)) / (n - 1)',
    expectedEquation: '\\operatorname{cov}(X, Y) = \\frac{1}{n - 1} \\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})',
    description: 'Sample directional covariance between paired numeric variables.'
  },
  {
    id: 'rev-pearson-corr',
    name: 'Pearson Correlation',
    category: 'Statistics',
    code: 'r = cov_xy / (std_x * std_y)',
    expectedEquation: 'r = \\frac{\\operatorname{cov}(X, Y)}{s_X s_Y}',
    description: 'Normalized linear correlation index bounded strictly within [-1, 1].'
  },
  {
    id: 'rev-z-score',
    name: 'Z-Score Standardization',
    category: 'Statistics',
    code: 'z = (x - mu) / sigma',
    expectedEquation: 'z = \\frac{x - \\mu}{\\sigma}',
    description: 'Standard affine normalization producing zero mean and unit variance.'
  },

  // Machine Learning
  {
    id: 'rev-sigmoid',
    name: 'Sigmoidal Logistic Function',
    category: 'Machine Learning',
    code: 'y = 1 / (1 + np.exp(-z))',
    expectedEquation: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
    description: 'Non-linear S-curve activation function mapping the real line into (0, 1).'
  },
  {
    id: 'rev-mse',
    name: 'Mean Squared Error (MSE)',
    category: 'Machine Learning',
    code: 'mse = np.mean((y - y_hat) ** 2)',
    expectedEquation: '\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2',
    description: 'Quadratic residual loss measuring average squared prediction discrepancy.'
  },
  {
    id: 'rev-mae',
    name: 'Mean Absolute Error (MAE)',
    category: 'Machine Learning',
    code: 'mae = np.mean(np.abs(y - y_hat))',
    expectedEquation: '\\text{MAE} = \\frac{1}{n} \\sum_{i=1}^{n} |y_i - \\hat{y}_i|',
    description: 'Robust L1 regression error measuring average absolute deviation.'
  },
  {
    id: 'rev-precision',
    name: 'Classification Precision',
    category: 'Machine Learning',
    code: 'precision = tp / (tp + fp)',
    expectedEquation: '\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}',
    description: 'Fraction of positive detections that are true ground-truth condition positives.'
  },
  {
    id: 'rev-recall',
    name: 'Classification Recall',
    category: 'Machine Learning',
    code: 'recall = tp / (tp + fn)',
    expectedEquation: '\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}',
    description: 'Fraction of actual positive cases detected (true positive rate).'
  },
  {
    id: 'rev-f1-score',
    name: 'F1-Score Harmonic Mean',
    category: 'Machine Learning',
    code: 'f1 = 2 * (precision * recall) / (precision + recall)',
    expectedEquation: 'F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}',
    description: 'Harmonic mean balancing precision and sensitivity under imbalanced priors.'
  },
  {
    id: 'rev-l1-reg',
    name: 'L1 Lasso Regularization',
    category: 'Machine Learning',
    code: 'l1 = lambda_val * np.sum(np.abs(w))',
    expectedEquation: 'R_{L1}(\\mathbf{w}) = \\lambda \\sum_{j=1}^{d} |w_j|',
    description: 'Sparsity-inducing absolute parameter norm penalty.'
  },
  {
    id: 'rev-l2-reg',
    name: 'L2 Ridge Regularization',
    category: 'Machine Learning',
    code: 'l2 = 0.5 * lambda_val * np.sum(w ** 2)',
    expectedEquation: 'R_{L2}(\\mathbf{w}) = \\frac{\\lambda}{2} \\sum_{j=1}^{d} w_j^2',
    description: 'Quadratic shrinkage regularizer penalizing large parameter magnitudes.'
  },

  // Deep Learning
  {
    id: 'rev-relu',
    name: 'Rectified Linear Unit (ReLU)',
    category: 'Deep Learning',
    code: 'y = np.maximum(0, x)',
    expectedEquation: 'f(x) = \\max(0, x)',
    description: 'Piece-wise linear activation thresholded strictly at 0.'
  },
  {
    id: 'rev-softmax',
    name: 'Softmax Distribution',
    category: 'Deep Learning',
    code: 'probs = np.exp(z) / np.sum(np.exp(z))',
    expectedEquation: '\\sigma(\\mathbf{z})_i = \\frac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}',
    description: 'Normalized exponential transforming real logits into valid probabilities.'
  },
  {
    id: 'rev-bce',
    name: 'Binary Cross-Entropy Loss',
    category: 'Deep Learning',
    code: 'loss = -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))',
    expectedEquation: '\\mathcal{L}_{BCE} = -\\frac{1}{n} \\sum_{i=1}^n [y_i \\log(p_i) + (1 - y_i) \\log(1 - p_i)]',
    description: 'Negative log-likelihood loss for binary classification with Bernoulli labels.'
  },

  // Probability
  {
    id: 'rev-bayes',
    name: "Bayes' Theorem",
    category: 'Probability',
    code: 'posterior = likelihood * prior / marginal',
    expectedEquation: 'P(A\\mid B) = \\frac{P(B\\mid A) P(A)}{P(B)}',
    description: 'Conditional inverse probability theorem with explicit prior and likelihood.'
  },
  {
    id: 'rev-gaussian',
    name: 'Gaussian Normal PDF',
    category: 'Probability',
    code: 'f = (1 / (sigma * np.sqrt(2 * np.pi))) * np.exp(-((x - mu) ** 2) / (2 * sigma ** 2))',
    expectedEquation: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)',
    description: 'Univariate Gaussian probability density function with mean mu and dispersion sigma.'
  },

  // Information Theory
  {
    id: 'rev-entropy',
    name: 'Shannon Information Entropy',
    category: 'Information Theory',
    code: 'entropy = -np.sum(p * np.log2(p))',
    expectedEquation: 'H(X) = -\\sum_{i=1}^{n} P(x_i) \\log_2 P(x_i)',
    description: 'Expected information uncertainty measured in logarithmic bits.'
  },
  {
    id: 'rev-kl-div',
    name: 'KL Divergence',
    category: 'Information Theory',
    code: 'kl = np.sum(p * np.log(p / q))',
    expectedEquation: 'D_{\\text{KL}}(P \\parallel Q) = \\sum_{i=1}^{n} P(x_i) \\log(P(x_i) / Q(x_i))',
    description: 'Relative entropy measuring divergence between reference P and candidate Q.'
  },
  {
    id: 'rev-chain-rule',
    name: 'Multivariate Chain Rule',
    category: 'Information Theory',
    code: 'dz_dx = df_du * du_dx',
    expectedEquation: '\\frac{dz}{dx} = \\frac{\\partial z}{\\partial u} \\frac{du}{dx}',
    description: 'Total derivative of composite differentiable function.'
  }
];

export function convertCodeToEquation(pythonCode: string): ReverseConversionResult {
  const trimmed = pythonCode ? pythonCode.trim() : '';

  if (!trimmed) {
    return {
      status: 'invalid_input',
      pattern: 'unsupported',
      equationName: 'Invalid Input',
      latex: '',
      errorMessage: 'No Python code provided. Please enter a mathematical Python routine or pick a preset.',
      suggestedExamples: SUPPORTED_REVERSE_PRESETS.map((p) => ({ name: p.name, code: p.code }))
    };
  }

  try {
    // 1. Tokenize restricted Python
    const tokens = tokenizePython(trimmed);

    // 2. Parse into restricted AST
    const parser = new RestrictedPythonParser(tokens);
    const parsed = parser.parse();

    // 3. Recognize pattern and generate LaTeX + explanation
    const recognized = recognizePattern(
      parsed.ast,
      parsed.targetVariable,
      parsed.functionName,
      parsed.parameters
    );

    return {
      status: 'success',
      pattern: recognized.pattern,
      equationName: recognized.equationName,
      latex: recognized.latex,
      targetVariable: parsed.targetVariable,
      explanation: recognized.explanation,
      suggestedExamples: SUPPORTED_REVERSE_PRESETS.map((p) => ({ name: p.name, code: p.code }))
    };
  } catch (err) {
    let errorMessage = 'Unsupported or unparseable Python syntax.';
    let diagnosticLocation: string | undefined;

    if (err instanceof TokenizerError) {
      errorMessage = err.message;
      diagnosticLocation = `Line ${err.line}, Col ${err.col}`;
    } else if (err instanceof ParserError) {
      errorMessage = err.message;
      diagnosticLocation = `Line ${err.line}, Col ${err.col}`;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    return {
      status: 'unsupported_syntax',
      pattern: 'unsupported',
      equationName: 'Unsupported Python Syntax',
      latex: '',
      errorMessage,
      diagnosticLocation,
      suggestedExamples: SUPPORTED_REVERSE_PRESETS.map((p) => ({ name: p.name, code: p.code }))
    };
  }
}
