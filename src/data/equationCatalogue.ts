import type { CatalogueEquation } from '../types/catalogue';

export const EQUATION_CATALOGUE: CatalogueEquation[] = [
  // ==========================================
  // 1. MATHEMATICS AND LINEAR ALGEBRA
  // ==========================================
  {
    id: 'linear-function',
    title: 'Linear Algebraic Form (Slope-Intercept)',
    category: 'Mathematics & Linear Algebra',
    subcategory: 'Algebra & Geometry',
    formula: 'y = m*x + b',
    latex: 'y = mx + b',
    description: 'First-degree polynomial equation describing a straight line with constant rate of change and y-axis intercept.',
    mathematicalMeaning: 'Defines an affine relationship between an independent scalar variable x and dependent variable y, where m represents the derivative dy/dx (gradient) and b is the value of y when x = 0.',
    variables: [
      { symbol: 'y', name: 'Dependent Variable', description: 'Output value along the vertical coordinate axis' },
      { symbol: 'm', name: 'Slope (Gradient)', description: 'Rate of change Δy / Δx' },
      { symbol: 'x', name: 'Independent Variable', description: 'Input value along the horizontal coordinate axis' },
      { symbol: 'b', name: 'Y-Intercept', description: 'Constant offset where the line crosses the y-axis' }
    ],
    assumptionsAndLimitations: [
      'Assumes a strictly linear, non-saturating relationship across the entire domain.',
      'A vertical line (undefined slope) cannot be expressed in standard slope-intercept form.'
    ],
    pythonEquivalent: `def linear_function(x: float, m: float = 2.0, b: float = 1.0) -> float:
    """Evaluate first-degree polynomial y = m*x + b."""
    return m * x + b`,
    isEngineSupported: false,
    plottableExpr: '2 * x + 1',
    relatedEquationIds: ['linear-regression', 'z-score'],
    tags: ['algebra', 'polynomial', 'affine', 'slope', 'intercept'],
    difficulty: 'Foundational',
    complexity: 'O(1) scalar evaluation'
  },
  {
    id: 'vector-l2-norm',
    title: 'Vector L2 Norm (Euclidean Length)',
    category: 'Mathematics & Linear Algebra',
    subcategory: 'Vector Spaces & Norms',
    formula: '||v||_2 = sqrt(sum(v_i^2))',
    latex: '\\|\\mathbf{v}\\|_2 = \\sqrt{\\sum_{i=1}^n v_i^2}',
    description: 'Computes the standard geometric length of a real vector in n-dimensional Euclidean coordinate space.',
    mathematicalMeaning: 'Measures the shortest distance from the coordinate origin to the point represented by vector v, derived directly from the generalized Pythagorean theorem.',
    variables: [
      { symbol: '\\mathbf{v}', name: 'Real Vector', description: 'Vector in R^n containing n real components', domainOrShape: '(n,)' },
      { symbol: 'v_i', name: 'Vector Component', description: 'The i-th scalar component of vector v' },
      { symbol: 'n', name: 'Vector Dimension', description: 'Total number of spatial or feature dimensions' }
    ],
    assumptionsAndLimitations: [
      'Vector must contain finite real-valued elements (non-empty vector n >= 1).',
      'Extremely large components can cause numerical intermediate overflow during squaring without scaling (use hypot/stable reduction).'
    ],
    pythonEquivalent: `import numpy as np

def vector_l2_norm(v: np.ndarray) -> float:
    """Compute Euclidean L2 norm of 1D vector."""
    arr = np.asarray(v, dtype=float)
    if arr.ndim != 1 or arr.size == 0:
        raise ValueError("Input must be a non-empty 1D vector.")
    return float(np.linalg.norm(arr, ord=2))`,
    isEngineSupported: true,
    supportedEnginePattern: 'vector_l2_norm',
    derivationPatternId: 'vector_l2_norm',
    relatedEquationIds: ['euclidean-distance', 'dot-product', 'l2-regularization'],
    tags: ['linear algebra', 'norm', 'euclidean', 'distance', 'length'],
    difficulty: 'Foundational',
    complexity: 'O(n) FLOPs'
  },
  {
    id: 'matrix-multiplication',
    title: 'Matrix-Matrix Multiplication',
    category: 'Mathematics & Linear Algebra',
    subcategory: 'Linear Operators',
    formula: 'C = A * B ; C_{ij} = sum_k (A_{ik} * B_{kj})',
    latex: '\\mathbf{C} = \\mathbf{A} \\mathbf{B}, \\quad C_{ij} = \\sum_{k=1}^m A_{ik} B_{kj}',
    description: 'Combines two linear transformations by computing the inner product of each row of A with each column of B.',
    mathematicalMeaning: 'Represents function composition of two linear maps. Element C_{ij} represents the projection of the i-th row basis of A onto the j-th column coordinate of B.',
    variables: [
      { symbol: '\\mathbf{A}', name: 'Left Matrix', description: 'Transformation matrix of dimensions n x m', domainOrShape: '(n, m)' },
      { symbol: '\\mathbf{B}', name: 'Right Matrix', description: 'Transformation matrix of dimensions m x p', domainOrShape: '(m, p)' },
      { symbol: '\\mathbf{C}', name: 'Result Matrix', description: 'Product matrix of dimensions n x p', domainOrShape: '(n, p)' }
    ],
    assumptionsAndLimitations: [
      'Inner dimension must match exactly: columns of A (m) must equal rows of B (m).',
      'Matrix multiplication is associative but generally non-commutative (A @ B != B @ A).'
    ],
    pythonEquivalent: `import numpy as np

def matrix_multiply(A: np.ndarray, B: np.ndarray) -> np.ndarray:
    """Compute matrix product C = A @ B with dimension verification."""
    arr_a = np.asarray(A, dtype=float)
    arr_b = np.asarray(B, dtype=float)
    if arr_a.ndim != 2 or arr_b.ndim != 2:
        raise ValueError("Both inputs must be 2D matrices.")
    if arr_a.shape[1] != arr_b.shape[0]:
        raise ValueError(f"Incompatible dimensions: {arr_a.shape} and {arr_b.shape}")
    return np.matmul(arr_a, arr_b)`,
    isEngineSupported: true,
    supportedEnginePattern: 'matrix_multiplication',
    derivationPatternId: 'matrix_multiplication',
    relatedEquationIds: ['dot-product', 'linear-regression', 'deep-forward-pass'],
    tags: ['linear algebra', 'matmul', 'composition', 'tensors'],
    difficulty: 'Foundational',
    complexity: 'O(n * m * p) FLOPs'
  },
  {
    id: 'dot-product',
    title: 'Vector Dot Product (Inner Product)',
    category: 'Mathematics & Linear Algebra',
    subcategory: 'Vector Spaces & Norms',
    formula: 'u . v = sum(u_i * v_i) = ||u|| * ||v|| * cos(theta)',
    latex: '\\mathbf{u} \\cdot \\mathbf{v} = \\sum_{i=1}^n u_i v_i = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos(\\theta)',
    description: 'Algebraic operation that takes two equal-length sequences of numbers and returns a single real scalar value.',
    mathematicalMeaning: 'Measures directional alignment: positive if angle θ < 90°, zero if vectors are orthogonal (perpendicular), and negative if angle θ > 90°.',
    variables: [
      { symbol: '\\mathbf{u}', name: 'First Vector', description: 'Vector in R^n', domainOrShape: '(n,)' },
      { symbol: '\\mathbf{v}', name: 'Second Vector', description: 'Vector in R^n', domainOrShape: '(n,)' },
      { symbol: '\\theta', name: 'Angle', description: 'Geometric angle between vectors u and v' }
    ],
    assumptionsAndLimitations: [
      'Both vectors must share identical spatial dimension n.',
      'Dot product does not preserve spatial units; units square.'
    ],
    pythonEquivalent: `import numpy as np

def dot_product(u: np.ndarray, v: np.ndarray) -> float:
    """Compute standard algebraic dot product of two 1D vectors."""
    arr_u = np.asarray(u, dtype=float)
    arr_v = np.asarray(v, dtype=float)
    if arr_u.shape != arr_v.shape or arr_u.ndim != 1:
        raise ValueError("Vectors must be 1D arrays of equal length.")
    return float(np.dot(arr_u, arr_v))`,
    isEngineSupported: false,
    derivationPatternId: 'dot_product',
    relatedEquationIds: ['vector-l2-norm', 'matrix-multiplication', 'neuron-weighted-sum'],
    tags: ['inner product', 'cosine', 'orthogonality', 'projection'],
    difficulty: 'Foundational',
    complexity: 'O(n) FLOPs'
  },
  {
    id: 'euclidean-distance',
    title: 'Euclidean Distance Metric',
    category: 'Mathematics & Linear Algebra',
    subcategory: 'Metric Spaces',
    formula: 'd(p, q) = sqrt(sum((p_i - q_i)^2))',
    latex: 'd(\\mathbf{p}, \\mathbf{q}) = \\sqrt{\\sum_{i=1}^n (p_i - q_i)^2}',
    description: 'Straight-line distance between two points p and q in n-dimensional Euclidean space.',
    mathematicalMeaning: 'The canonical metric satisfying non-negativity, identity of indiscernibles, symmetry, and triangle inequality.',
    variables: [
      { symbol: '\\mathbf{p}', name: 'First Point', description: 'Coordinate vector in R^n', domainOrShape: '(n,)' },
      { symbol: '\\mathbf{q}', name: 'Second Point', description: 'Coordinate vector in R^n', domainOrShape: '(n,)' }
    ],
    assumptionsAndLimitations: [
      'Assumes isotropic, flat Euclidean metric space; distance is distorted in non-Euclidean manifolds.',
      'Sensitive to differences in feature scaling (features with larger variance dominate).'
    ],
    pythonEquivalent: `import numpy as np

def euclidean_distance(p: np.ndarray, q: np.ndarray) -> float:
    """Compute straight-line Euclidean distance between two coordinate vectors."""
    diff = np.asarray(p, dtype=float) - np.asarray(q, dtype=float)
    return float(np.sqrt(np.sum(diff ** 2)))`,
    isEngineSupported: false,
    derivationPatternId: 'euclidean_distance',
    relatedEquationIds: ['vector-l2-norm', 'knn-distance'],
    tags: ['metric', 'distance', 'geometry', 'clustering'],
    difficulty: 'Foundational',
    complexity: 'O(n) FLOPs'
  },
  {
    id: 'arithmetic-mean-weighted',
    title: 'Arithmetic Mean and Weighted Average',
    category: 'Mathematics & Linear Algebra',
    subcategory: 'Descriptive Statistics',
    formula: 'x_bar = (1/n) * sum(x_i) ; x_w = sum(w_i * x_i) / sum(w_i)',
    latex: '\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i, \\quad \\bar{x}_w = \\frac{\\sum_{i=1}^n w_i x_i}{\\sum_{i=1}^n w_i}',
    description: 'Central tendency measure balancing values by sample size or importance weights.',
    mathematicalMeaning: 'The point that minimizes sum of squared deviations. Weighted average allocates influence proportional to reliability or importance weight w_i.',
    variables: [
      { symbol: 'x_i', name: 'Sample Observation', description: 'The i-th numeric observation' },
      { symbol: 'w_i', name: 'Weight Factor', description: 'Non-negative relative weight of observation i' },
      { symbol: 'n', name: 'Sample Size', description: 'Total number of sample observations' }
    ],
    assumptionsAndLimitations: [
      'Sum of weights must be strictly positive (sum(w_i) > 0).',
      'Highly sensitive to asymmetric outliers (heavy-tailed distributions).'
    ],
    pythonEquivalent: `import numpy as np

def weighted_mean(data: np.ndarray, weights: np.ndarray | None = None) -> float:
    """Compute unweighted or weighted arithmetic mean."""
    x = np.asarray(data, dtype=float)
    if weights is None:
        return float(np.mean(x))
    w = np.asarray(weights, dtype=float)
    sum_w = np.sum(w)
    if sum_w <= 0:
        raise ValueError("Sum of weights must be positive.")
    return float(np.sum(w * x) / sum_w)`,
    isEngineSupported: false,
    relatedEquationIds: ['expected-value', 'variance-std', 'z-score'],
    tags: ['mean', 'average', 'statistics', 'central tendency'],
    difficulty: 'Foundational',
    complexity: 'O(n) FLOPs'
  },

  // ==========================================
  // 2. PROBABILITY AND STATISTICS
  // ==========================================
  {
    id: 'probability-complement',
    title: 'Probability Axioms & Complement Rule',
    category: 'Probability & Statistics',
    subcategory: 'Axiomatic Probability',
    formula: 'P(A^c) = 1 - P(A) ; 0 <= P(A) <= 1',
    latex: 'P(A^c) = 1 - P(A), \\quad 0 \\le P(A) \\le 1',
    description: 'Fundamental law stating that the probability of an event not occurring equals 1 minus the probability that it occurs.',
    mathematicalMeaning: 'Follows from Kolmogorov axioms where the sample space S has probability 1, and A and A^c are mutually exclusive with A ∪ A^c = S.',
    variables: [
      { symbol: 'P(A)', name: 'Event Probability', description: 'Probability measure of event A, bounded in [0, 1]' },
      { symbol: 'P(A^c)', name: 'Complement Probability', description: 'Probability that event A does not occur' }
    ],
    assumptionsAndLimitations: [
      'Requires a well-defined probability space (Ω, F, P).',
      'Event A must be measurable with respect to σ-algebra F.'
    ],
    pythonEquivalent: `def complement_probability(p_a: float) -> float:
    """Calculate complement probability 1 - P(A)."""
    if not 0.0 <= p_a <= 1.0:
        raise ValueError("Probability must satisfy 0 <= P(A) <= 1.")
    return 1.0 - p_a`,
    isEngineSupported: false,
    relatedEquationIds: ['conditional-probability', 'bayes-theorem'],
    tags: ['probability', 'kolmogorov', 'axioms', 'complement'],
    difficulty: 'Foundational',
    complexity: 'O(1) scalar evaluation'
  },
  {
    id: 'conditional-probability',
    title: 'Conditional Probability Definition',
    category: 'Probability & Statistics',
    subcategory: 'Conditional Probability',
    formula: 'P(A|B) = P(A ∩ B) / P(B)',
    latex: 'P(A|B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0',
    description: 'The probability of event A occurring given that event B is already known to have occurred.',
    mathematicalMeaning: 'Restricts the effective sample space from Ω down to event subspace B, re-normalizing joint occurrences by the total probability mass of B.',
    variables: [
      { symbol: 'P(A|B)', name: 'Conditional Probability', description: 'Probability of A given event B' },
      { symbol: 'P(A \\cap B)', name: 'Joint Probability', description: 'Probability that both events A and B occur' },
      { symbol: 'P(B)', name: 'Conditioning Marginal', description: 'Probability of conditioning event B (must be > 0)' }
    ],
    assumptionsAndLimitations: [
      'Conditioning probability P(B) must be strictly positive (undefined when P(B) = 0).',
      'Conditional probability does not imply physical causality.'
    ],
    pythonEquivalent: `def conditional_probability(p_joint: float, p_b: float) -> float:
    """Compute P(A|B) = P(A and B) / P(B)."""
    if p_b <= 0.0 or p_b > 1.0:
        raise ValueError("Conditioning probability P(B) must be in (0, 1].")
    if p_joint < 0.0 or p_joint > p_b:
        raise ValueError("Joint probability P(A and B) must satisfy 0 <= P(A and B) <= P(B).")
    return p_joint / p_b`,
    isEngineSupported: false,
    relatedEquationIds: ['probability-complement', 'bayes-theorem'],
    tags: ['conditional', 'joint', 'probability', 'conditioning'],
    difficulty: 'Foundational',
    complexity: 'O(1) scalar evaluation'
  },
  {
    id: 'bayes-theorem',
    title: "Bayes' Theorem",
    category: 'Probability & Statistics',
    subcategory: 'Bayesian Inference',
    formula: 'P(A|B) = [P(B|A) * P(A)] / P(B)',
    latex: 'P(A|B) = \\frac{P(B|A) P(A)}{P(B)}',
    description: 'Calculates the posterior probability of hypothesis A given observed evidence B, prior probability P(A), and likelihood P(B|A).',
    mathematicalMeaning: 'Provides the formal mechanism for statistical belief revision upon observing data, balancing prior beliefs with empirical evidence.',
    variables: [
      { symbol: 'P(A|B)', name: 'Posterior Probability', description: 'Updated probability of hypothesis A after observing evidence B' },
      { symbol: 'P(B|A)', name: 'Likelihood', description: 'Probability of observing evidence B if hypothesis A is true' },
      { symbol: 'P(A)', name: 'Prior Probability', description: 'Initial belief in hypothesis A before observing evidence' },
      { symbol: 'P(B)', name: 'Marginal Evidence', description: 'Total probability of evidence B across all possible hypotheses' }
    ],
    assumptionsAndLimitations: [
      'Marginal evidence P(B) must be strictly positive.',
      'Prior P(A) must be selected with justification; uninformative priors can still influence posteriors in small sample regimes.'
    ],
    pythonEquivalent: `def bayes_posterior(prior: float, likelihood: float, marginal_likelihood: float) -> float:
    """Calculate posterior probability using Bayes' Theorem."""
    if not (0.0 <= prior <= 1.0):
        raise ValueError("Prior P(A) must be in [0, 1].")
    if not (0.0 <= likelihood <= 1.0):
        raise ValueError("Likelihood P(B|A) must be in [0, 1].")
    if marginal_likelihood <= 0.0 or marginal_likelihood > 1.0:
        raise ValueError("Marginal likelihood P(B) must be in (0, 1].")
    if likelihood * prior > marginal_likelihood:
        raise ValueError("Inconsistent probabilities: P(B|A)*P(A) cannot exceed P(B).")
    return (likelihood * prior) / marginal_likelihood`,
    isEngineSupported: true,
    supportedEnginePattern: 'bayes_theorem',
    derivationPatternId: 'bayes_theorem',
    relatedEquationIds: ['conditional-probability', 'gaussian-pdf'],
    tags: ['bayes', 'posterior', 'prior', 'likelihood', 'inference'],
    difficulty: 'Intermediate',
    complexity: 'O(1) scalar evaluation'
  },
  {
    id: 'expected-value',
    title: 'Mathematical Expectation (Expected Value)',
    category: 'Probability & Statistics',
    subcategory: 'Random Variables',
    formula: 'E[X] = sum(x * P(X=x))',
    latex: '\\mathbb{E}[X] = \\sum_{x} x P(X = x) \\quad \\text{or} \\quad \\int_{-\\infty}^{\\infty} x f(x) dx',
    description: 'The probability-weighted average of all possible values a random variable can take.',
    mathematicalMeaning: 'Represents the center of mass of the probability density or mass function, acting as the long-run theoretical average under repeated sampling.',
    variables: [
      { symbol: '\\mathbb{E}[X]', name: 'Expected Value', description: 'Theoretical mean or expected value of random variable X' },
      { symbol: 'x', name: 'Outcome Value', description: 'A possible numeric realization of X' },
      { symbol: 'P(X = x)', name: 'Probability Mass', description: 'Probability assigned to realization x' }
    ],
    assumptionsAndLimitations: [
      'Expectation exists only if the integral or sum of absolute values |x| P(x) converges (e.g. Cauchy distribution has no mean).',
      'Linear operator: E[aX + bY] = aE[X] + bE[Y].'
    ],
    pythonEquivalent: `import numpy as np

def discrete_expectation(values: np.ndarray, probabilities: np.ndarray) -> float:
    """Compute mathematical expectation E[X] for discrete probability mass."""
    x = np.asarray(values, dtype=float)
    p = np.asarray(probabilities, dtype=float)
    if not np.isclose(np.sum(p), 1.0, atol=1e-5):
        raise ValueError("Probabilities must sum to 1.0.")
    return float(np.sum(x * p))`,
    isEngineSupported: false,
    relatedEquationIds: ['arithmetic-mean-weighted', 'variance-std'],
    tags: ['expectation', 'mean', 'random variable', 'moments'],
    difficulty: 'Intermediate',
    complexity: 'O(n) discrete sum'
  },
  {
    id: 'variance-std',
    title: 'Sample Variance and Standard Deviation',
    category: 'Probability & Statistics',
    subcategory: 'Dispersion & Spread',
    formula: 's^2 = (1 / (n - 1)) * sum((x_i - x_bar)^2) ; s = sqrt(s^2)',
    latex: 's^2 = \\frac{1}{n - 1} \\sum_{i=1}^n (x_i - \\bar{x})^2, \\quad s = \\sqrt{s^2}',
    description: 'Measures the spread of numerical data points around their sample mean with Bessel correction for unbiased estimation.',
    mathematicalMeaning: 'Quantifies expected squared deviation from the center. Using n - 1 degrees of freedom removes the negative bias caused by estimating the population mean from the same sample.',
    variables: [
      { symbol: 's^2', name: 'Sample Variance', description: 'Unbiased estimator of population variance' },
      { symbol: 's', name: 'Sample Standard Deviation', description: 'Square root of variance, sharing the same physical units as data' },
      { symbol: 'x_i', name: 'Sample Point', description: 'Individual observation i' },
      { symbol: '\\bar{x}', name: 'Sample Mean', description: 'Arithmetic mean of the sample' }
    ],
    assumptionsAndLimitations: [
      'Requires at least n >= 2 observations for sample variance (degrees of freedom n - 1 >= 1).',
      'Squaring deviations gives extreme weights to far outliers.'
    ],
    pythonEquivalent: `import numpy as np

def sample_variance(data: np.ndarray) -> tuple[float, float]:
    """Compute sample variance s^2 and standard deviation s."""
    x = np.asarray(data, dtype=float)
    n = len(x)
    if n < 2:
        raise ValueError("Sample variance requires at least 2 observations.")
    var = float(np.sum((x - np.mean(x)) ** 2) / (n - 1))
    return var, float(np.sqrt(var))`,
    isEngineSupported: false,
    derivationPatternId: 'variance',
    relatedEquationIds: ['arithmetic-mean-weighted', 'gaussian-pdf', 'z-score'],
    tags: ['variance', 'standard deviation', 'dispersion', 'bessel'],
    difficulty: 'Foundational',
    complexity: 'O(n) FLOPs'
  },
  {
    id: 'gaussian-pdf',
    title: 'Gaussian Normal Probability Density Function (PDF)',
    category: 'Probability & Statistics',
    subcategory: 'Continuous Distributions',
    formula: 'f(x) = (1 / (sigma * sqrt(2*pi))) * exp(-0.5 * ((x - mu)/sigma)^2)',
    latex: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x - \\mu}{\\sigma}\\right)^2}',
    description: 'Bell-shaped probability density function completely parameterized by mean μ and standard deviation σ.',
    mathematicalMeaning: 'Central distribution in natural sciences arising from the Central Limit Theorem. Symmetric around mean μ with inflection points located exactly at μ ± σ.',
    variables: [
      { symbol: 'f(x)', name: 'Probability Density', description: 'Likelihood density value at coordinate point x' },
      { symbol: 'x', name: 'Independent Variable', description: 'Evaluation coordinate along the real line R' },
      { symbol: '\\mu', name: 'Distribution Mean', description: 'Center of symmetry and location parameter' },
      { symbol: '\\sigma', name: 'Scale (Std Dev)', description: 'Distribution spread parameter (must satisfy σ > 0)' }
    ],
    assumptionsAndLimitations: [
      'Scale parameter σ must be strictly positive (σ > 0).',
      'The function f(x) represents a density, not a probability; values can exceed 1 for very small σ.'
    ],
    pythonEquivalent: `import numpy as np

def gaussian_pdf(x: np.ndarray | float, mu: float = 0.0, sigma: float = 1.0) -> np.ndarray:
    """Compute Gaussian normal probability density function."""
    if sigma <= 0.0:
        raise ValueError("Standard deviation sigma must be strictly positive.")
    x_arr = np.asarray(x, dtype=float)
    coeff = 1.0 / (sigma * np.sqrt(2.0 * np.pi))
    exponent = -0.5 * ((x_arr - mu) / sigma) ** 2
    return coeff * np.exp(exponent)`,
    isEngineSupported: true,
    supportedEnginePattern: 'gaussian_pdf',
    derivationPatternId: 'gaussian_pdf',
    plottableExpr: '(1 / sqrt(2 * pi)) * exp(-0.5 * x^2)',
    relatedEquationIds: ['variance-std', 'z-score'],
    tags: ['gaussian', 'normal', 'distribution', 'pdf', 'bell curve'],
    difficulty: 'Intermediate',
    complexity: 'O(1) scalar or O(n) array vectorized'
  },
  {
    id: 'covariance-correlation',
    title: 'Covariance and Pearson Correlation Coefficient',
    category: 'Probability & Statistics',
    subcategory: 'Bivariate Statistics',
    formula: 'Cov(X, Y) = (1 / (n-1)) * sum((X_i - X_bar)*(Y_i - Y_bar)) ; r = Cov / (s_X * s_Y)',
    latex: '\\text{Cov}(X, Y) = \\frac{1}{n-1} \\sum_{i=1}^n (X_i - \\bar{X})(Y_i - \\bar{Y}), \\quad r_{XY} = \\frac{\\text{Cov}(X, Y)}{s_X s_Y}',
    description: 'Quantifies the degree to which two numerical variables change together linearly, standardized into correlation coefficient r in [-1, +1].',
    mathematicalMeaning: 'Covariance indicates direction of joint change. Dividing by product of standard deviations yields scale-free Pearson r, measuring pure linear relationship tightness.',
    variables: [
      { symbol: '\\text{Cov}(X, Y)', name: 'Sample Covariance', description: 'Joint variability between X and Y' },
      { symbol: 'r_{XY}', name: 'Pearson Correlation', description: 'Standardized linear correlation in range [-1, +1]' },
      { symbol: 's_X, s_Y', name: 'Standard Deviations', description: 'Sample standard deviations of variables X and Y' }
    ],
    assumptionsAndLimitations: [
      'Both variables must have non-zero variance (s_X > 0, s_Y > 0); correlation is undefined if either is constant.',
      'Measures only linear dependency; non-linear dependencies (e.g. y = x^2) can yield r ≈ 0.'
    ],
    pythonEquivalent: `import numpy as np

def pearson_correlation(x: np.ndarray, y: np.ndarray) -> tuple[float, float]:
    """Calculate sample covariance and Pearson correlation coefficient."""
    x_arr = np.asarray(x, dtype=float)
    y_arr = np.asarray(y, dtype=float)
    n = len(x_arr)
    if n < 2 or len(y_arr) != n:
        raise ValueError("Inputs must be arrays of equal length >= 2.")
    cov = float(np.sum((x_arr - np.mean(x_arr)) * (y_arr - np.mean(y_arr))) / (n - 1))
    std_x = np.std(x_arr, ddof=1)
    std_y = np.std(y_arr, ddof=1)
    if std_x == 0 or std_y == 0:
        raise ValueError("Standard deviation of both variables must be positive.")
    r = cov / (std_x * std_y)
    return cov, float(r)`,
    isEngineSupported: false,
    derivationPatternId: 'covariance',
    relatedEquationIds: ['variance-std', 'linear-regression'],
    tags: ['covariance', 'correlation', 'pearson', 'bivariate'],
    difficulty: 'Intermediate',
    complexity: 'O(n) FLOPs'
  },
  {
    id: 'z-score',
    title: 'Z-Score Standardization (Standard Score)',
    category: 'Probability & Statistics',
    subcategory: 'Data Normalization',
    formula: 'z = (x - mu) / sigma',
    latex: 'z = \\frac{x - \\mu}{\\sigma}',
    description: 'Expresses an individual raw score x in terms of its signed distance from the mean in standard deviation units.',
    mathematicalMeaning: 'Transforms arbitrary dimensional distributions to zero mean (μ_z = 0) and unit variance (σ_z = 1), facilitating cross-feature comparisons.',
    variables: [
      { symbol: 'z', name: 'Standard Score', description: 'Standardized coordinate (number of standard deviations from mean)' },
      { symbol: 'x', name: 'Raw Value', description: 'Original unscaled measurement' },
      { symbol: '\\mu', name: 'Population / Sample Mean', description: 'Center reference location' },
      { symbol: '\\sigma', name: 'Standard Deviation', description: 'Distribution scale factor (σ > 0)' }
    ],
    assumptionsAndLimitations: [
      'Standard deviation σ must be strictly non-zero.',
      'Standardization centers and scales the distribution, but does not convert skewed data into a normal distribution.'
    ],
    pythonEquivalent: `import numpy as np

def standard_z_score(x: np.ndarray, mu: float | None = None, sigma: float | None = None) -> np.ndarray:
    """Standardize data to zero mean and unit variance."""
    arr = np.asarray(x, dtype=float)
    mean = np.mean(arr) if mu is None else mu
    std = np.std(arr) if sigma is None else sigma
    if std <= 0:
        raise ValueError("Standard deviation must be strictly positive.")
    return (arr - mean) / std`,
    isEngineSupported: false,
    derivationPatternId: 'z_score',
    plottableExpr: 'x',
    relatedEquationIds: ['gaussian-pdf', 'variance-std'],
    tags: ['normalization', 'standardization', 'z-score', 'scaling'],
    difficulty: 'Foundational',
    complexity: 'O(n) elementwise'
  },

  // ==========================================
  // 3. MACHINE LEARNING
  // ==========================================
  {
    id: 'linear-regression',
    title: 'Linear Regression Prediction Model',
    category: 'Machine Learning',
    subcategory: 'Supervised Learning',
    formula: 'y_hat = w^T * x + b',
    latex: '\\hat{y} = \\mathbf{w}^T \\mathbf{x} + b',
    description: 'Standard parametric regression predictor modeling target output as a linear combination of input features plus bias.',
    mathematicalMeaning: 'Computes the projection of feature vector x onto hyperplane defined by normal weights w, shifted by intercept bias b.',
    variables: [
      { symbol: '\\hat{y}', name: 'Predicted Target', description: 'Continuous scalar model prediction' },
      { symbol: '\\mathbf{w}', name: 'Weight Vector', description: 'Coefficients mapping feature influence to target', domainOrShape: '(d,)' },
      { symbol: '\\mathbf{x}', name: 'Feature Vector', description: 'Observed input features', domainOrShape: '(d,)' },
      { symbol: 'b', name: 'Bias Intercept', description: 'Scalar offset' }
    ],
    assumptionsAndLimitations: [
      'Assumes a linear additive relationship between features and target.',
      'Collinear features cause ill-conditioned matrix inversion in Ordinary Least Squares analytical solutions.'
    ],
    pythonEquivalent: `import numpy as np

def linear_regression_predict(X: np.ndarray, w: np.ndarray, b: float = 0.0) -> np.ndarray:
    """Compute linear regression prediction y_hat = X @ w + b."""
    X_mat = np.asarray(X, dtype=float)
    w_vec = np.asarray(w, dtype=float)
    if X_mat.ndim != 2 or w_vec.ndim != 1 or X_mat.shape[1] != w_vec.shape[0]:
        raise ValueError("Dimension mismatch between features and weights.")
    return X_mat @ w_vec + b`,
    isEngineSupported: true,
    supportedEnginePattern: 'linear_regression',
    derivationPatternId: 'linear_regression',
    relatedEquationIds: ['mean-squared-error', 'logistic-sigmoid', 'neuron-weighted-sum'],
    tags: ['regression', 'ols', 'prediction', 'supervised'],
    difficulty: 'Foundational',
    complexity: 'O(N * d) FLOPs'
  },
  {
    id: 'mean-squared-error',
    title: 'Mean Squared Error Loss (MSE)',
    category: 'Machine Learning',
    subcategory: 'Loss Functions',
    formula: 'MSE = (1 / n) * sum((y_i - y_hat_i)^2)',
    latex: '\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2',
    description: 'Quadratic loss metric measuring the average squared difference between true targets and predicted values.',
    mathematicalMeaning: 'Corresponds to the negative log-likelihood of Gaussian-distributed errors. Penalizes larger residuals significantly harder than smaller ones.',
    variables: [
      { symbol: 'y_i', name: 'Ground Truth', description: 'Actual observed target value for sample i' },
      { symbol: '\\hat{y}_i', name: 'Model Prediction', description: 'Estimated target output for sample i' },
      { symbol: 'n', name: 'Batch / Sample Count', description: 'Total number of evaluated samples' }
    ],
    assumptionsAndLimitations: [
      'Highly sensitive to gross outliers due to quadratic squaring.',
      'Output is in squared units of the target variable (often root-mean-squared RMSE is reported instead).'
    ],
    pythonEquivalent: `import numpy as np

def mean_squared_error(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Compute mean squared error between ground truth and predictions."""
    y = np.asarray(y_true, dtype=float)
    y_hat = np.asarray(y_pred, dtype=float)
    if y.shape != y_hat.shape or y.size == 0:
        raise ValueError("True and predicted arrays must be non-empty and have matching shapes.")
    return float(np.mean((y - y_hat) ** 2))`,
    isEngineSupported: false,
    derivationPatternId: 'mean_squared_error',
    relatedEquationIds: ['mean-absolute-error', 'linear-regression'],
    tags: ['loss', 'mse', 'regression', 'optimization'],
    difficulty: 'Foundational',
    complexity: 'O(n) elementwise'
  },
  {
    id: 'mean-absolute-error',
    title: 'Mean Absolute Error Loss (MAE)',
    category: 'Machine Learning',
    subcategory: 'Loss Functions',
    formula: 'MAE = (1 / n) * sum(|y_i - y_hat_i|)',
    latex: '\\text{MAE} = \\frac{1}{n} \\sum_{i=1}^n |y_i - \\hat{y}_i|',
    description: 'Robust linear loss measuring the average absolute magnitude of prediction errors.',
    mathematicalMeaning: 'Corresponds to the negative log-likelihood under Laplace error distribution, providing robust estimation resilient against anomalous outliers.',
    variables: [
      { symbol: 'y_i', name: 'Ground Truth', description: 'Observed target' },
      { symbol: '\\hat{y}_i', name: 'Prediction', description: 'Predicted target' },
      { symbol: 'n', name: 'Sample Size', description: 'Number of observations' }
    ],
    assumptionsAndLimitations: [
      'Derivative is discontinuous at y_i = y_hat_i, requiring subgradient methods in gradient-based optimization.',
      'Treats all errors with linear constant penalty regardless of scale.'
    ],
    pythonEquivalent: `import numpy as np

def mean_absolute_error(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Compute mean absolute error (L1 loss)."""
    y = np.asarray(y_true, dtype=float)
    y_hat = np.asarray(y_pred, dtype=float)
    return float(np.mean(np.abs(y - y_hat)))`,
    isEngineSupported: false,
    derivationPatternId: 'mean_absolute_error',
    relatedEquationIds: ['mean-squared-error', 'l1-regularization'],
    tags: ['loss', 'mae', 'l1', 'robust'],
    difficulty: 'Foundational',
    complexity: 'O(n) elementwise'
  },
  {
    id: 'logistic-sigmoid',
    title: 'Logistic Sigmoid Activation Function',
    category: 'Machine Learning',
    subcategory: 'Activation & Probability',
    formula: 'sigma(z) = 1 / (1 + exp(-z))',
    latex: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
    description: 'S-shaped smooth mathematical activation mapping any real-valued number into the open probability interval (0, 1).',
    mathematicalMeaning: 'Represents the inverse logit function logit(p) = ln(p / (1-p)). Crucial in logistic regression for converting log-odds into probabilities.',
    variables: [
      { symbol: '\\sigma(z)', name: 'Activated Probability', description: 'Bounded probability in (0, 1)' },
      { symbol: 'z', name: 'Logit Score', description: 'Linear pre-activation log-odds score in (-inf, +inf)' }
    ],
    assumptionsAndLimitations: [
      'Susceptible to gradient vanishing for extreme values (|z| > 5, where σ\'(z) approaches zero).',
      'Requires stable implementation for large positive and negative z to prevent floating-point overflow.'
    ],
    pythonEquivalent: `import numpy as np

def sigmoid(z: np.ndarray | float) -> np.ndarray:
    """Compute numerically stable logistic sigmoid."""
    z_arr = np.asarray(z, dtype=float)
    pos_mask = (z_arr >= 0)
    result = np.empty_like(z_arr)
    result[pos_mask] = 1.0 / (1.0 + np.exp(-z_arr[pos_mask]))
    exp_z = np.exp(z_arr[~pos_mask])
    result[~pos_mask] = exp_z / (1.0 + exp_z)
    return result`,
    isEngineSupported: true,
    supportedEnginePattern: 'sigmoid',
    derivationPatternId: 'sigmoid',
    plottableExpr: '1 / (1 + exp(-x))',
    relatedEquationIds: ['binary-cross-entropy', 'softmax-activation'],
    tags: ['sigmoid', 'activation', 'logistic', 'probability'],
    difficulty: 'Foundational',
    complexity: 'O(n) elementwise'
  },
  {
    id: 'binary-cross-entropy',
    title: 'Binary Cross-Entropy Loss (Log Loss)',
    category: 'Machine Learning',
    subcategory: 'Loss Functions',
    formula: 'L = - (1/n) * sum(y*log(p) + (1-y)*log(1-p))',
    latex: '\\mathcal{L}_{\\text{BCE}} = -\\frac{1}{n} \\sum_{i=1}^n \\left[ y_i \\log(\\hat{y}_i) + (1 - y_i) \\log(1 - \\hat{y}_i) \\right]',
    description: 'Standard loss function for binary classification quantifying divergence between true binary labels y in {0, 1} and predicted probabilities.',
    mathematicalMeaning: 'Negative log-likelihood derived from Bernoulli likelihood. Heavily penalizes confident predictions that turn out to be incorrect.',
    variables: [
      { symbol: 'y_i', name: 'Binary Ground Truth', description: 'Label indicator in {0, 1}' },
      { symbol: '\\hat{y}_i', name: 'Predicted Probability', description: 'Model predicted probability P(Y=1) in (0, 1)' },
      { symbol: 'n', name: 'Batch Size', description: 'Total number of observations' }
    ],
    assumptionsAndLimitations: [
      'Probabilities must be clipped strictly away from 0 and 1 (e.g. ε = 1e-15) to prevent log(0) domain errors.',
      'Assumes mutually exclusive binary outcomes.'
    ],
    pythonEquivalent: `import numpy as np

def binary_cross_entropy(y_true: np.ndarray, y_pred: np.ndarray, eps: float = 1e-15) -> float:
    """Compute binary cross-entropy with numerical clipping protection."""
    y = np.asarray(y_true, dtype=float)
    p = np.clip(np.asarray(y_pred, dtype=float), eps, 1.0 - eps)
    bce = - (y * np.log(p) + (1.0 - y) * np.log(1.0 - p))
    return float(np.mean(bce))`,
    isEngineSupported: false,
    derivationPatternId: 'binary_cross_entropy',
    relatedEquationIds: ['logistic-sigmoid', 'categorical-cross-entropy'],
    tags: ['loss', 'bce', 'cross entropy', 'classification'],
    difficulty: 'Intermediate',
    complexity: 'O(n) elementwise'
  },
  {
    id: 'knn-distance',
    title: 'K-Nearest Neighbours Minkowski Distance Metric',
    category: 'Machine Learning',
    subcategory: 'Instance-Based Learning',
    formula: 'D_p(x, x\') = (sum(|x_j - x\'_j|^p))^(1/p)',
    latex: 'D_p(\\mathbf{x}, \\mathbf{x}\') = \\left( \\sum_{j=1}^d |x_j - x\'_j|^p \\right)^{\\frac{1}{p}}',
    description: 'Generalized Minkowski distance metric parameterizing L1 Manhattan (p=1), L2 Euclidean (p=2), and Chebyshev distance (p->inf).',
    mathematicalMeaning: 'Defines the neighborhood topology in instance-based non-parametric classification and regression algorithms like KNN.',
    variables: [
      { symbol: '\\mathbf{x}, \\mathbf{x}\'', name: 'Sample Vectors', description: 'Feature points in R^d', domainOrShape: '(d,)' },
      { symbol: 'p', name: 'Minkowski Order', description: 'Order parameter (p >= 1 ensures metric properties)' },
      { symbol: 'd', name: 'Feature Dimension', description: 'Number of input features' }
    ],
    assumptionsAndLimitations: [
      'Subject to curse of dimensionality in high dimensions: distance contrast between nearest and farthest neighbor vanishes.',
      'Features must be standardized or normalized beforehand.'
    ],
    pythonEquivalent: `import numpy as np

def minkowski_distance(x: np.ndarray, x_prime: np.ndarray, p: float = 2.0) -> float:
    """Compute generalized Minkowski distance (p=2 for Euclidean, p=1 for Manhattan)."""
    if p < 1.0:
        raise ValueError("Minkowski order p must be >= 1.0.")
    diff = np.abs(np.asarray(x, dtype=float) - np.asarray(x_prime, dtype=float))
    return float(np.sum(diff ** p) ** (1.0 / p))`,
    isEngineSupported: false,
    relatedEquationIds: ['euclidean-distance', 'vector-l2-norm'],
    tags: ['knn', 'minkowski', 'metric', 'neighbors'],
    difficulty: 'Foundational',
    complexity: 'O(d) per pair'
  },
  {
    id: 'gradient-descent-update',
    title: 'Gradient Descent First-Order Parameter Update',
    category: 'Machine Learning',
    subcategory: 'Optimization Algorithms',
    formula: 'theta_{t+1} = theta_t - eta * grad_L(theta_t)',
    latex: '\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta \\mathcal{L}(\\theta_t)',
    description: 'Iterative optimization step adjusting parameter vector theta opposite to the objective gradient vector to minimize loss.',
    mathematicalMeaning: 'Locally follows the steepest descent trajectory along the negative gradient vector direction at rate defined by step size eta.',
    variables: [
      { symbol: '\\theta_t', name: 'Current Parameters', description: 'Parameter weights at iteration step t', domainOrShape: '(d,)' },
      { symbol: '\\eta', name: 'Learning Rate', description: 'Positive step size hyperparameter (η > 0)' },
      { symbol: '\\nabla_\\theta \\mathcal{L}', name: 'Objective Gradient', description: 'Vector of partial derivatives of loss with respect to parameters', domainOrShape: '(d,)' }
    ],
    assumptionsAndLimitations: [
      'Requires objective function to be differentiable (or sub-differentiable).',
      'Learning rate η must be tuned: too large causes divergence, too small causes slow convergence or getting trapped in saddle points.'
    ],
    pythonEquivalent: `import numpy as np

def gradient_descent_step(theta: np.ndarray, grad: np.ndarray, lr: float = 0.01) -> np.ndarray:
    """Execute single standard gradient descent parameter update."""
    if lr <= 0:
        raise ValueError("Learning rate must be strictly positive.")
    return theta - lr * grad`,
    isEngineSupported: false,
    derivationPatternId: 'gradient_descent',
    relatedEquationIds: ['linear-regression', 'shannon-entropy'],
    tags: ['gradient descent', 'optimizer', 'backprop', 'first order'],
    difficulty: 'Intermediate',
    complexity: 'O(d) elementwise'
  },
  {
    id: 'precision-recall-f1',
    title: 'Precision, Recall, and Harmonic F1-Score',
    category: 'Machine Learning',
    subcategory: 'Evaluation Metrics',
    formula: 'P = TP/(TP+FP) ; R = TP/(TP+FN) ; F1 = 2 * (P * R) / (P + R)',
    latex: '\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}, \\quad \\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}, \\quad F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}',
    description: 'Information retrieval and classification metrics quantifying positive predictive value, sensitivity, and their harmonic mean.',
    mathematicalMeaning: 'Precision measures exactness; Recall measures completeness. Harmonic mean F1 penalizes extreme imbalance between precision and recall.',
    variables: [
      { symbol: '\\text{TP}', name: 'True Positives', description: 'Correctly predicted positive instances' },
      { symbol: '\\text{FP}', name: 'False Positives', description: 'Negative instances incorrectly flagged positive' },
      { symbol: '\\text{FN}', name: 'False Negatives', description: 'Positive instances incorrectly flagged negative' },
      { symbol: 'F_1', name: 'F1-Score', description: 'Harmonic mean of precision and recall in [0, 1]' }
    ],
    assumptionsAndLimitations: [
      'Denominator cannot be zero (if TP + FP = 0 or TP + FN = 0, precision or recall is undefined or conventionally 0).',
      'Does not incorporate True Negatives (TN); Matthews Correlation Coefficient is preferred for severe class imbalances.'
    ],
    pythonEquivalent: `def classification_metrics(tp: int, fp: int, fn: int) -> dict[str, float]:
    """Calculate precision, recall, and harmonic F1-score."""
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2.0 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    return {"precision": precision, "recall": recall, "f1": f1}`,
    isEngineSupported: false,
    derivationPatternId: 'precision',
    relatedEquationIds: ['binary-cross-entropy'],
    tags: ['metrics', 'precision', 'recall', 'f1', 'evaluation'],
    difficulty: 'Foundational',
    complexity: 'O(1) scalar evaluation'
  },

  // ==========================================
  // 4. DEEP LEARNING
  // ==========================================
  {
    id: 'neuron-weighted-sum',
    title: 'Artificial Neuron Pre-Activation (Affine Sum)',
    category: 'Deep Learning',
    subcategory: 'Neural Architectures',
    formula: 'z = sum(w_j * x_j) + b = w^T * x + b',
    latex: 'z = \\sum_{j=1}^m w_j x_j + b = \\mathbf{w}^T \\mathbf{x} + b',
    description: 'Fundamental linear aggregation operation in an artificial neuron combining weighted inputs with a scalar bias.',
    mathematicalMeaning: 'Projects input space onto a 1D scalar line representing the distance to the separating decision hyperplane.',
    variables: [
      { symbol: 'z', name: 'Pre-Activation Logit', description: 'Scalar sum passed into non-linear activation function' },
      { symbol: 'w_j', name: 'Synaptic Weight', description: 'Connection weight scaling input j' },
      { symbol: 'x_j', name: 'Neuron Input', description: 'Incoming signal from previous layer or raw feature' },
      { symbol: 'b', name: 'Neuron Bias', description: 'Threshold bias parameter adjusting activation baseline' }
    ],
    assumptionsAndLimitations: [
      'Purely linear operation; incapable of solving XOR or non-linear separation without activation functions.',
      'Susceptible to covariate shift across deep stacked layers.'
    ],
    pythonEquivalent: `import numpy as np

def neuron_preactivation(x: np.ndarray, w: np.ndarray, b: float = 0.0) -> float:
    """Compute single artificial neuron affine sum z = w^T x + b."""
    return float(np.dot(w, x) + b)`,
    isEngineSupported: false,
    relatedEquationIds: ['dot-product', 'relu-activation', 'deep-forward-pass'],
    tags: ['neuron', 'affine', 'weights', 'bias', 'perceptron'],
    difficulty: 'Foundational',
    complexity: 'O(m) FLOPs'
  },
  {
    id: 'relu-activation',
    title: 'Rectified Linear Unit (ReLU) Activation',
    category: 'Deep Learning',
    subcategory: 'Activation Functions',
    formula: 'f(x) = max(0, x)',
    latex: 'f(x) = \\max(0, x) = \\begin{cases} x & \\text{if } x > 0 \\\\ 0 & \\text{if } x \\le 0 \\end{cases}',
    description: 'Piecewise linear activation function that outputs input directly if positive, and zero otherwise.',
    mathematicalMeaning: 'Introduces non-linearity while preserving constant unit gradient (f\'(x)=1) for positive inputs, significantly alleviating vanishing gradients.',
    variables: [
      { symbol: 'f(x)', name: 'Activated Output', description: 'Non-negative activation value in [0, inf)' },
      { symbol: 'x', name: 'Neuron Pre-Activation', description: 'Real-valued input signal' }
    ],
    assumptionsAndLimitations: [
      'Non-differentiable at exactly x = 0 (subgradient convention assigns 0 or 1).',
      'Can suffer from "Dying ReLU" problem where neurons get stuck in inactive negative regime with zero gradient.'
    ],
    pythonEquivalent: `import numpy as np

def relu(x: np.ndarray) -> np.ndarray:
    """Compute elementwise Rectified Linear Unit max(0, x)."""
    return np.maximum(0.0, np.asarray(x, dtype=float))`,
    isEngineSupported: false,
    derivationPatternId: 'relu',
    plottableExpr: '0.5 * (x + abs(x))',
    relatedEquationIds: ['logistic-sigmoid', 'neuron-weighted-sum'],
    tags: ['relu', 'activation', 'deep learning', 'non-linear'],
    difficulty: 'Foundational',
    complexity: 'O(n) elementwise'
  },
  {
    id: 'softmax-activation',
    title: 'Softmax Probability Vector Normalization',
    category: 'Deep Learning',
    subcategory: 'Activation Functions',
    formula: 'sigma(z)_i = exp(z_i) / sum_j(exp(z_j))',
    latex: '\\sigma(\\mathbf{z})_i = \\frac{e^{z_i}}{\\sum_{j=1}^K e^{z_j}}',
    description: 'Generalizes the logistic function to multiclass classification, transforming K unconstrained logits into a valid categorical probability distribution.',
    mathematicalMeaning: 'Exponentiation emphasizes larger logits, while division by partition sum guarantees all values fall in (0, 1) and sum to exactly 1.0.',
    variables: [
      { symbol: '\\mathbf{z}', name: 'Logit Vector', description: 'Unconstrained model output vector in R^K', domainOrShape: '(K,)' },
      { symbol: '\\sigma(\\mathbf{z})_i', name: 'Class Probability', description: 'Normalized posterior probability of class i' },
      { symbol: 'K', name: 'Number of Classes', description: 'Total number of mutually exclusive categorical classes' }
    ],
    assumptionsAndLimitations: [
      'Direct computation of exp(z_i) can easily overflow double-precision floats for z_i > 700 (subtract max logit for stability).',
      'Enforces competition: increasing probability of one class necessarily reduces probabilities of other classes.'
    ],
    pythonEquivalent: `import numpy as np

def softmax(z: np.ndarray, axis: int = -1) -> np.ndarray:
    """Compute numerically stabilized softmax along specified axis."""
    arr = np.asarray(z, dtype=float)
    # Numerical stabilization: subtract max to prevent exponential overflow
    shifted = arr - np.max(arr, axis=axis, keepdims=True)
    exp_vals = np.exp(shifted)
    return exp_vals / np.sum(exp_vals, axis=axis, keepdims=True)`,
    isEngineSupported: false,
    derivationPatternId: 'softmax',
    relatedEquationIds: ['logistic-sigmoid', 'categorical-cross-entropy'],
    tags: ['softmax', 'activation', 'multiclass', 'probability'],
    difficulty: 'Intermediate',
    complexity: 'O(K) FLOPs'
  },
  {
    id: 'deep-forward-pass',
    title: 'Deep Neural Network Forward Layer Propagation',
    category: 'Deep Learning',
    subcategory: 'Neural Architectures',
    formula: 'a^(l) = g(W^(l) * a^(l-1) + b^(l))',
    latex: '\\mathbf{a}^{(l)} = g\\left( \\mathbf{W}^{(l)} \\mathbf{a}^{(l-1)} + \\mathbf{b}^{(l)} \\right)',
    description: 'Recursive matrix equation for computing activations of hidden or output layer l from the previous layer activations a^(l-1).',
    mathematicalMeaning: 'Repeated composition of learned linear projections interleaved with non-linear activation operators g, enabling universal functional approximation.',
    variables: [
      { symbol: '\\mathbf{a}^{(l)}', name: 'Layer Activation Vector', description: 'Output representations of layer l', domainOrShape: '(n_l,)' },
      { symbol: '\\mathbf{W}^{(l)}', name: 'Layer Weight Matrix', description: 'Affine weight parameters connecting layer l-1 to layer l', domainOrShape: '(n_l, n_{l-1})' },
      { symbol: '\\mathbf{b}^{(l)}', name: 'Layer Bias Vector', description: 'Bias parameter vector', domainOrShape: '(n_l,)' },
      { symbol: 'g(\\cdot)', name: 'Activation Operator', description: 'Elementwise non-linear activation function' }
    ],
    assumptionsAndLimitations: [
      'Layer dimensions must align properly: W columns must equal dimension of a^(l-1).',
      'Requires non-linear g; linear activations collapse the entire deep network into a single shallow linear transformation.'
    ],
    pythonEquivalent: `import numpy as np
from typing import Callable

def forward_layer(a_prev: np.ndarray, W: np.ndarray, b: np.ndarray, activation: Callable[[np.ndarray], np.ndarray]) -> np.ndarray:
    """Compute single forward layer transformation a^(l) = g(W a^(l-1) + b)."""
    z = np.matmul(W, a_prev) + b
    return activation(z)`,
    isEngineSupported: false,
    relatedEquationIds: ['matrix-multiplication', 'relu-activation', 'backpropagation-chain-rule'],
    tags: ['deep learning', 'forward pass', 'mlp', 'layers'],
    difficulty: 'Intermediate',
    complexity: 'O(n_l * n_{l-1}) FLOPs'
  },
  {
    id: 'categorical-cross-entropy',
    title: 'Categorical Cross-Entropy Multiclass Loss',
    category: 'Deep Learning',
    subcategory: 'Loss Functions',
    formula: 'L = - sum_k (y_k * log(y_hat_k))',
    latex: '\\mathcal{L}_{\\text{CE}} = -\\sum_{k=1}^K y_k \\log(\\hat{y}_k)',
    description: 'Loss function quantifying discrepancy between one-hot ground truth label vector y and softmax predicted distribution y_hat.',
    mathematicalMeaning: 'Computes the KL divergence plus constant entropy of true distribution. For one-hot vectors, simplifies to the negative log-probability assigned to the correct class.',
    variables: [
      { symbol: 'y_k', name: 'One-Hot Indicator', description: '1 if true class is k, 0 otherwise' },
      { symbol: '\\hat{y}_k', name: 'Predicted Probability', description: 'Softmax probability assigned to class k in (0, 1)' },
      { symbol: 'K', name: 'Number of Classes', description: 'Total number of target classes' }
    ],
    assumptionsAndLimitations: [
      'Predicted probabilities must sum to 1 and be bounded away from zero to avoid log(0).',
      'Assumes mutually exclusive classes (use binary cross-entropy for multi-label problems).'
    ],
    pythonEquivalent: `import numpy as np

def categorical_cross_entropy(y_true: np.ndarray, y_pred: np.ndarray, eps: float = 1e-15) -> float:
    """Compute categorical cross-entropy loss."""
    y = np.asarray(y_true, dtype=float)
    p = np.clip(np.asarray(y_pred, dtype=float), eps, 1.0)
    return -float(np.sum(y * np.log(p)))`,
    isEngineSupported: false,
    relatedEquationIds: ['softmax-activation', 'binary-cross-entropy', 'shannon-entropy'],
    tags: ['loss', 'cross entropy', 'multiclass', 'classification'],
    difficulty: 'Intermediate',
    complexity: 'O(K) FLOPs'
  },
  {
    id: 'backpropagation-chain-rule',
    title: 'Backpropagation Gradient Chain Rule',
    category: 'Deep Learning',
    subcategory: 'Gradients & Backprop',
    formula: 'dL/dw_{ij} = (dL/dz_i) * (dz_i/dw_{ij}) = delta_i * a_j',
    latex: '\\frac{\\partial \\mathcal{L}}{\\partial w_{ij}^{(l)}} = \\frac{\\partial \\mathcal{L}}{\\partial z_i^{(l)}} \\cdot \\frac{\\partial z_i^{(l)}}{\\partial w_{ij}^{(l)}} = \\delta_i^{(l)} a_j^{(l-1)}',
    description: 'Calculates the exact analytical gradient of loss with respect to network weights via reverse-mode automatic differentiation.',
    mathematicalMeaning: 'Applies multivariate calculus chain rule from the final loss backward through network layers, multiplying error sensitivity delta with incoming activations.',
    variables: [
      { symbol: '\\frac{\\partial \\mathcal{L}}{\\partial w_{ij}}', name: 'Weight Gradient', description: 'Sensitivity of loss with respect to weight parameter w_{ij}' },
      { symbol: '\\delta_i^{(l)}', name: 'Layer Error Delta', description: 'Backpropagated error term dL / dz_i at layer l' },
      { symbol: 'a_j^{(l-1)}', name: 'Incoming Activation', description: 'Activation from transmitting neuron j in layer l-1' }
    ],
    assumptionsAndLimitations: [
      'Requires every layer operator and activation function along the forward path to be continuously differentiable.',
      'Susceptible to vanishing/exploding gradients in very deep or recurrent architectures.'
    ],
    pythonEquivalent: `import numpy as np

def compute_weight_gradient(delta_l: np.ndarray, a_prev: np.ndarray) -> np.ndarray:
    """Compute outer-product weight gradient dL/dW = delta^(l) (a^(l-1))^T."""
    return np.outer(delta_l, a_prev)`,
    isEngineSupported: false,
    derivationPatternId: 'chain_rule',
    relatedEquationIds: ['deep-forward-pass', 'gradient-descent-update'],
    tags: ['backpropagation', 'chain rule', 'gradients', 'autodiff'],
    difficulty: 'Advanced',
    complexity: 'O(n_l * n_{l-1}) outer product'
  },

  // ==========================================
  // 5. OPTIMIZATION AND INFORMATION THEORY
  // ==========================================
  {
    id: 'shannon-entropy',
    title: 'Shannon Information Entropy',
    category: 'Optimization & Information Theory',
    subcategory: 'Information Measures',
    formula: 'H(X) = - sum(P(x_i) * log2(P(x_i)))',
    latex: 'H(X) = -\\sum_{i=1}^n P(x_i) \\log_2 P(x_i)',
    description: 'Fundamental measure of average uncertainty, surprise, or information content inherent in the possible outcomes of random variable X.',
    mathematicalMeaning: 'Represents the theoretical minimum expected code length in bits needed to encode outcomes produced by probability distribution P.',
    variables: [
      { symbol: 'H(X)', name: 'Shannon Entropy', description: 'Expected information in units of bits (base 2) or nats (base e)' },
      { symbol: 'P(x_i)', name: 'Outcome Probability', description: 'Probability of outcome x_i' }
    ],
    assumptionsAndLimitations: [
      'Convention 0 * log(0) = 0 is adopted by continuity limit lim_{p->0} p log(p) = 0.',
      'Entropy is maximized for uniform distributions and equals zero for deterministic outcomes.'
    ],
    pythonEquivalent: `import numpy as np

def shannon_entropy(probabilities: np.ndarray, base: float = 2.0) -> float:
    """Compute Shannon information entropy in specified base (default bits)."""
    p = np.asarray(probabilities, dtype=float)
    if not np.isclose(np.sum(p), 1.0, atol=1e-5):
        raise ValueError("Probabilities must sum to 1.0.")
    # Filter strictly positive probabilities to handle p*log(p) = 0
    p_pos = p[p > 0]
    return float(-np.sum(p_pos * (np.log(p_pos) / np.log(base))))`,
    isEngineSupported: false,
    derivationPatternId: 'entropy',
    relatedEquationIds: ['kl-divergence', 'categorical-cross-entropy'],
    tags: ['entropy', 'shannon', 'information theory', 'uncertainty'],
    difficulty: 'Intermediate',
    complexity: 'O(n) FLOPs'
  },
  {
    id: 'kl-divergence',
    title: 'Kullback–Leibler Relative Entropy Divergence',
    category: 'Optimization & Information Theory',
    subcategory: 'Information Measures',
    formula: 'D_KL(P || Q) = sum(P(x) * log(P(x) / Q(x)))',
    latex: 'D_{\\text{KL}}(P \\parallel Q) = \\sum_{x \\in \\mathcal{X}} P(x) \\log\\left(\\frac{P(x)}{Q(x)}\\right)',
    description: 'Non-symmetric measure of the relative information lost when probability distribution Q is used to approximate true distribution P.',
    mathematicalMeaning: 'Always non-negative (Gibbs inequality, D_KL >= 0) and zero if and only if P = Q. Represents the inefficiency of coding data from P using optimal code for Q.',
    variables: [
      { symbol: 'D_{\\text{KL}}(P \\parallel Q)', name: 'Relative Entropy', description: 'Divergence from Q to P' },
      { symbol: 'P(x)', name: 'True Distribution', description: 'Target probability mass' },
      { symbol: 'Q(x)', name: 'Approximating Distribution', description: 'Model approximation probability mass' }
    ],
    assumptionsAndLimitations: [
      'Asymmetric: D_KL(P || Q) != D_KL(Q || P), meaning it is not a formal distance metric.',
      'Requires absolute continuity: if P(x) > 0, then Q(x) must also be > 0 (otherwise divergence is infinite).'
    ],
    pythonEquivalent: `import numpy as np

def kl_divergence(p: np.ndarray, q: np.ndarray, eps: float = 1e-12) -> float:
    """Compute discrete Kullback-Leibler divergence D_KL(P || Q)."""
    p_arr = np.asarray(p, dtype=float)
    q_arr = np.asarray(q, dtype=float)
    mask = p_arr > 0
    q_safe = np.maximum(q_arr[mask], eps)
    return float(np.sum(p_arr[mask] * np.log(p_arr[mask] / q_safe)))`,
    isEngineSupported: false,
    derivationPatternId: 'kl_divergence',
    relatedEquationIds: ['shannon-entropy', 'categorical-cross-entropy'],
    tags: ['kl divergence', 'relative entropy', 'information theory'],
    difficulty: 'Advanced',
    complexity: 'O(n) FLOPs'
  },
  {
    id: 'l1-regularization',
    title: 'L1 Regularization Norm (Lasso Penalty)',
    category: 'Optimization & Information Theory',
    subcategory: 'Regularization',
    formula: 'L_reg = L_0 + lambda * sum(|w_j|)',
    latex: '\\mathcal{L}_{\\text{reg}} = \\mathcal{L}_0 + \\lambda \\sum_{j=1}^p |w_j|',
    description: 'Regularization technique that penalizes the sum of absolute weight coefficients to prevent overfitting and encourage sparsity.',
    mathematicalMeaning: 'The diamond-shaped geometry of the L1 ball frequently intersects loss contour ellipses at sharp coordinate axes, forcing non-essential weights to exactly zero (feature selection).',
    variables: [
      { symbol: '\\mathcal{L}_{\\text{reg}}', name: 'Regularized Loss', description: 'Total objective function to minimize' },
      { symbol: '\\mathcal{L}_0', name: 'Base Empirical Loss', description: 'Unregularized loss (e.g. MSE or cross-entropy)' },
      { symbol: '\\lambda', name: 'Regularization Penalty', description: 'Non-negative shrinkage hyperparameter (λ >= 0)' },
      { symbol: 'w_j', name: 'Model Weight', description: 'Individual model coefficient parameter' }
    ],
    assumptionsAndLimitations: [
      'Penalty coefficient λ must be non-negative.',
      'L1 absolute value is non-differentiable at w_j = 0, requiring coordinate descent or proximal gradient solvers.'
    ],
    pythonEquivalent: `import numpy as np

def l1_penalty(weights: np.ndarray, lmbda: float = 0.01) -> float:
    """Compute L1 Lasso shrinkage penalty."""
    if lmbda < 0:
        raise ValueError("Regularization coefficient lambda must be >= 0.")
    return float(lmbda * np.sum(np.abs(weights)))`,
    isEngineSupported: false,
    derivationPatternId: 'l1_regularization',
    relatedEquationIds: ['l2-regularization', 'mean-squared-error'],
    tags: ['regularization', 'lasso', 'l1', 'sparsity'],
    difficulty: 'Intermediate',
    complexity: 'O(p) elementwise'
  },
  {
    id: 'l2-regularization',
    title: 'L2 Regularization (Ridge Regression / Weight Decay)',
    category: 'Optimization & Information Theory',
    subcategory: 'Regularization',
    formula: 'L_reg = L_0 + (lambda / 2) * sum(w_j^2)',
    latex: '\\mathcal{L}_{\\text{reg}} = \\mathcal{L}_0 + \\frac{\\lambda}{2} \\sum_{j=1}^p w_j^2',
    description: 'Regularization method penalizing squared Euclidean norm of parameter weights to shrink coefficients smoothly toward zero.',
    mathematicalMeaning: 'Equivalent to placing a zero-mean Gaussian prior over weights in Bayesian regression. Prevents individual weights from growing uncontrollably on multicollinear data.',
    variables: [
      { symbol: '\\mathcal{L}_{\\text{reg}}', name: 'Regularized Loss', description: 'Total penalized objective' },
      { symbol: '\\mathcal{L}_0', name: 'Base Loss', description: 'Unpenalized empirical error' },
      { symbol: '\\lambda', name: 'Weight Decay Coefficient', description: 'Regularization hyperparameter (λ >= 0)' },
      { symbol: 'w_j', name: 'Model Weight', description: 'Coefficient parameter' }
    ],
    assumptionsAndLimitations: [
      'Shrinks weights smoothly toward zero, but does not set them exactly to zero (unlike L1 Lasso).',
      'Requires standardizing input features so all weights are penalized on equal footing.'
    ],
    pythonEquivalent: `import numpy as np

def l2_penalty(weights: np.ndarray, lmbda: float = 0.01) -> float:
    """Compute L2 Ridge penalty (half-squared Euclidean norm)."""
    if lmbda < 0:
        raise ValueError("Regularization coefficient lambda must be >= 0.")
    return float(0.5 * lmbda * np.sum(weights ** 2))`,
    isEngineSupported: false,
    derivationPatternId: 'l2_regularization',
    relatedEquationIds: ['l1-regularization', 'vector-l2-norm'],
    tags: ['regularization', 'ridge', 'weight decay', 'l2'],
    difficulty: 'Intermediate',
    complexity: 'O(p) elementwise'
  },

  // ==========================================
  // 6. BIOINFORMATICS
  // ==========================================
  {
    id: 'dna-gc-content',
    title: 'DNA Sequence GC Content Percentage',
    category: 'Bioinformatics',
    subcategory: 'Sequence Analysis',
    formula: 'GC% = [(N_G + N_C) / (N_A + N_T + N_G + N_C)] * 100%',
    latex: '\\text{GC\\%} = \\frac{N_G + N_C}{N_A + N_T + N_G + N_C} \\times 100\\%',
    description: 'Calculates the fraction of nitrogenous bases in a DNA molecule or genome that are either Guanine (G) or Cytosine (C).',
    mathematicalMeaning: 'G-C pairs share three hydrogen bonds compared to two in A-T pairs, directly determining thermal denaturation melting temperatures (Tm) and structural stability.',
    variables: [
      { symbol: 'N_G', name: 'Guanine Count', description: 'Number of Guanine bases in the nucleotide sequence' },
      { symbol: 'N_C', name: 'Cytosine Count', description: 'Number of Cytosine bases in the nucleotide sequence' },
      { symbol: 'N_A', name: 'Adenine Count', description: 'Number of Adenine bases in the nucleotide sequence' },
      { symbol: 'N_T', name: 'Thymine Count', description: 'Number of Thymine bases in the nucleotide sequence' }
    ],
    assumptionsAndLimitations: [
      'Assumes sequence contains canonical standard DNA nucleotides {A, C, G, T}. Ambiguous IUPAC codes (N, R, Y) require explicit filtering.',
      'Total valid nucleotide count must be strictly positive.'
    ],
    pythonEquivalent: `def calculate_gc_content(sequence: str) -> float:
    """Calculate GC content percentage from standard DNA sequence string."""
    clean_seq = sequence.upper().strip()
    g_count = clean_seq.count('G')
    c_count = clean_seq.count('C')
    total_valid = g_count + c_count + clean_seq.count('A') + clean_seq.count('T')
    if total_valid == 0:
        raise ValueError("Sequence contains zero valid DNA bases (A, C, G, T).")
    return float((g_count + c_count) / total_valid * 100.0)`,
    isEngineSupported: false,
    relatedEquationIds: ['sequence-hamming-distance', 'sequence-identity-score'],
    tags: ['bioinformatics', 'dna', 'genomics', 'gc content'],
    difficulty: 'Foundational',
    complexity: 'O(L) linear sequence scan'
  },
  {
    id: 'sequence-hamming-distance',
    title: 'Hamming Distance for Equal-Length Sequences',
    category: 'Bioinformatics',
    subcategory: 'Sequence Analysis',
    formula: 'D_H(s_1, s_2) = sum(I(s_{1,i} != s_{2,i}))',
    latex: 'D_H(\\mathbf{s}_1, \\mathbf{s}_2) = \\sum_{i=1}^L \\mathbb{I}(s_{1,i} \\neq s_{2,i})',
    description: 'Counts the number of positional substitutions required to transform one equal-length biological sequence into another.',
    mathematicalMeaning: 'Measures point mutations (single nucleotide polymorphisms / amino acid replacements) without insertions or deletions.',
    variables: [
      { symbol: '\\mathbf{s}_1, \\mathbf{s}_2', name: 'Biological Sequences', description: 'Aligned nucleotide or protein strings of identical length L' },
      { symbol: 'L', name: 'Sequence Length', description: 'Number of aligned positions' },
      { symbol: '\\mathbb{I}(\\cdot)', name: 'Indicator Function', description: '1 if characters differ, 0 if identical' }
    ],
    assumptionsAndLimitations: [
      'Both sequences must have strictly identical length L.',
      'Does not account for indel gaps or varying evolutionary transition/transversion mutation rates.'
    ],
    pythonEquivalent: `def sequence_hamming_distance(seq1: str, seq2: str) -> int:
    """Compute Hamming substitution distance between two equal-length sequences."""
    if len(seq1) != len(seq2):
        raise ValueError(f"Sequences must have equal length: {len(seq1)} != {len(seq2)}")
    return sum(ch1 != ch2 for ch1, ch2 in zip(seq1.upper(), seq2.upper()))`,
    isEngineSupported: false,
    relatedEquationIds: ['dna-gc-content', 'sequence-identity-score'],
    tags: ['bioinformatics', 'hamming', 'mutations', 'snps'],
    difficulty: 'Foundational',
    complexity: 'O(L) comparison'
  },
  {
    id: 'sequence-identity-score',
    title: 'Pairwise Sequence Identity Score',
    category: 'Bioinformatics',
    subcategory: 'Sequence Alignment',
    formula: 'PID = (N_identical / L_alignment) * 100%',
    latex: '\\text{PID} = \\frac{N_{\\text{identical}}}{L_{\\text{alignment}}} \\times 100\\%',
    description: 'Percentage of identical residues aligned between two biological sequences over the alignment length.',
    mathematicalMeaning: 'Quantifies evolutionary conservation and homologous relatedness across proteins or nucleic acid alignments.',
    variables: [
      { symbol: 'N_{\\text{identical}}', name: 'Identical Residues', description: 'Count of positions where residues match exactly' },
      { symbol: 'L_{\\text{alignment}}', name: 'Alignment Length', description: 'Total length of the pairwise alignment including gap columns' }
    ],
    assumptionsAndLimitations: [
      'Depends directly on alignment algorithm (e.g. Needleman-Wunsch global vs Smith-Waterman local).',
      'Treats all mismatches equally regardless of amino acid biochemical substitution similarity (BLOSUM).'
    ],
    pythonEquivalent: `def pairwise_sequence_identity(aligned_seq1: str, aligned_seq2: str) -> float:
    """Compute percentage of identical aligned positions."""
    if len(aligned_seq1) != len(aligned_seq2) or len(aligned_seq1) == 0:
        raise ValueError("Aligned sequences must be non-empty and of identical length.")
    identical = sum(a == b and a != '-' for a, b in zip(aligned_seq1, aligned_seq2))
    return float(identical / len(aligned_seq1) * 100.0)`,
    isEngineSupported: false,
    relatedEquationIds: ['sequence-hamming-distance', 'dna-gc-content'],
    tags: ['bioinformatics', 'alignment', 'homology', 'conservation'],
    difficulty: 'Foundational',
    complexity: 'O(L) scan'
  },
  {
    id: 'gene-expression-log-fold-change',
    title: 'Gene Expression Log2 Fold Change with Pseudocount',
    category: 'Bioinformatics',
    subcategory: 'Transcriptomics & RNA-seq',
    formula: 'log2FC = log2((T + c) / (C + c))',
    latex: '\\log_2\\text{FC} = \\log_2\\left(\\frac{T + c}{C + c}\\right) = \\log_2(T + c) - \\log_2(C + c)',
    description: 'Differential gene expression metric quantifying relative abundance change between treatment T and control C conditions.',
    mathematicalMeaning: 'Log2 transformation produces symmetric scale: +1 means doubled expression (2x), -1 means halved expression (0.5x). Adding a pseudocount c prevents division by zero and stabilizes high variance for low-count genes.',
    variables: [
      { symbol: 'T', name: 'Treatment Expression', description: 'Normalized read count in treatment condition (T >= 0)' },
      { symbol: 'C', name: 'Control Expression', description: 'Normalized read count in control baseline (C >= 0)' },
      { symbol: 'c', name: 'Pseudocount', description: 'Small positive constant (typically c = 1.0) preventing log(0)' }
    ],
    assumptionsAndLimitations: [
      'Read counts must be normalized across sequencing depth (e.g., TPM, RPKM, or DESeq2 size factors).',
      'The choice of pseudocount c dampens log-fold changes for lowly expressed genes; choice of c must be reported.'
    ],
    pythonEquivalent: `import numpy as np

def log2_fold_change(treatment: np.ndarray | float, control: np.ndarray | float, pseudocount: float = 1.0) -> np.ndarray:
    """Calculate stabilized log2 fold change with pseudocount."""
    if pseudocount <= 0:
        raise ValueError("Pseudocount must be strictly positive.")
    t = np.asarray(treatment, dtype=float)
    c = np.asarray(control, dtype=float)
    if np.any(t < 0) or np.any(c < 0):
        raise ValueError("Expression read counts cannot be negative.")
    return np.log2((t + pseudocount) / (c + pseudocount))`,
    isEngineSupported: false,
    plottableExpr: 'log((x + 1) / (1 + 1)) / log(2)',
    relatedEquationIds: ['shannon-entropy'],
    tags: ['transcriptomics', 'rna-seq', 'fold change', 'differential expression'],
    difficulty: 'Intermediate',
    complexity: 'O(n) elementwise'
  }
];
