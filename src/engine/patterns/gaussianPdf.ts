import type { EquationMetadata, EquationExplanation } from '../types';

export function matchGaussianPdf(normalized: string, raw: string): boolean {
  const normMatch = /exp\s*\(\s*-.*\(x\s*-\s*mu\)\^2\s*\/\s*\(?2\s*\*?\s*sigma\^2\)?\s*\)/i.test(normalized) ||
    /sigma\s*\*?\s*sqrt\s*\(2\s*\*?\s*pi\)/i.test(normalized) ||
    /exp\s*\(-?\s*\(?x\s*-\s*mu\)?\^2\s*\/\s*\(?2\s*\*?\s*sigma\^2\)?\)/i.test(normalized);

  const rawMatch = /\\sigma\s*\\sqrt\{2\\pi\}/i.test(raw) ||
    /\\frac\{1\}\{\\sigma\s*\\sqrt\{2\\pi\}\}/i.test(raw) ||
    /-\\frac\{\(x\s*-\s*\\mu\)\^2\}\{2\\sigma\^2\}/i.test(raw);

  return normMatch || rawMatch;
}

export function getGaussianPdfMetadata(): EquationMetadata {
  return {
    pattern: 'gaussian_pdf',
    displayName: 'Gaussian Normal Probability Density Function',
    category: 'Probability & Statistics',
    standardLatex: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{(x - \\mu)^2}{2\\sigma^2} \\right)',
    variables: [
      {
        name: 'x',
        type: 'float | np.ndarray',
        shape: 'Scalar or arbitrary array shape',
        description: 'Evaluation point(s) along the real number line'
      },
      {
        name: 'mu',
        type: 'float',
        shape: 'Scalar real float',
        description: 'Mean (location parameter) determining the center of the bell curve'
      },
      {
        name: 'sigma',
        type: 'float',
        shape: 'Scalar strictly positive float (> 0.0)',
        description: 'Standard deviation (scale parameter) controlling bell curve spread',
        constraints: 'sigma > 0.0'
      }
    ],
    assumptions: [
      'Standard deviation sigma must be strictly positive: sigma > 0.0.',
      'Variance is sigma^2.',
      'Total integral over (-inf, +inf) equals 1.0.'
    ],
    complexity: 'O(N) element-wise evaluation',
    stabilityNotes: [
      'sigma <= 0 raises ValueError.',
      'For extreme values of (x - mu)^2 / (2 * sigma^2), exp underflows safely to 0.0.'
    ]
  };
}

export function generateGaussianPdfCode(): string {
  return `import numpy as np

def gaussian_pdf(x: np.ndarray | float, mu: float = 0.0, sigma: float = 1.0) -> np.ndarray:
    """Compute Gaussian (Normal) probability density function.
    
    Formula:
        f(x) = (1 / (sigma * sqrt(2 * pi))) * exp(-0.5 * ((x - mu) / sigma)^2)
        
    Parameters:
        x: evaluation point(s), scalar float or numpy array
        mu: mean (center parameter)
        sigma: standard deviation (scale parameter, strictly positive > 0)
    """
    if sigma <= 0.0:
        raise ValueError(f"Standard deviation sigma must be strictly positive (> 0.0), got {sigma}.")

    x_arr = np.asarray(x, dtype=float)

    # 1. Standardized z-score
    z = (x_arr - float(mu)) / float(sigma)

    # 2. Normalization constant 1 / (sigma * sqrt(2 * pi))
    norm_const = 1.0 / (float(sigma) * np.sqrt(2.0 * np.pi))

    # 3. Exponential density core
    pdf = norm_const * np.exp(-0.5 * (z ** 2))

    if np.isscalar(x):
        return float(pdf.item())
    return pdf

# Example verification harness
if __name__ == "__main__":
    # Test standard normal at mean x=0, mu=0, sigma=1
    # 1 / sqrt(2*pi) ~= 0.39894228
    val_at_mean = gaussian_pdf(0.0, mu=0.0, sigma=1.0)
    expected_peak = 1.0 / np.sqrt(2.0 * np.pi)
    print("Value at mean x=0:", val_at_mean)
    print("Expected peak:    ", expected_peak)
    assert np.isclose(val_at_mean, expected_peak), "Gaussian peak evaluation failed!"
    
    # Test array evaluation
    points = np.linspace(-3.0, 3.0, 5)
    densities = gaussian_pdf(points, mu=0.0, sigma=1.0)
    print("Points:   ", points)
    print("Densities:", densities)
    assert np.all(densities >= 0.0), "Probabilities must be non-negative!"
`;
}

export function explainGaussianPdf(): EquationExplanation {
  return {
    title: 'Gaussian (Normal) Probability Density Function',
    category: 'Probability & Continuous Distributions',
    formalDefinition: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{(x - \\mu)^2}{2\\sigma^2} \\right). Continuous probability density on \\mathbb{R} completely specified by its first two central moments (mean \\mu and variance \\sigma^2).',
    domainAndConstraints: [
      'x \\in \\mathbb{R}',
      'Mean \\mu \\in \\mathbb{R}',
      'Standard deviation \\sigma \\in (0, \\infty)',
      'Total probability area \\int_{-\\infty}^{\\infty} f(x) \\, dx = 1.0'
    ],
    variableRoles: [
      { symbol: 'x', role: 'Input continuous evaluation point(s)', shape: 'Scalar or array' },
      { symbol: '\\mu', role: 'Location parameter / expectation', shape: 'Scalar' },
      { symbol: '\\sigma', role: 'Scale parameter / standard deviation', shape: 'Scalar > 0' }
    ],
    operationMapping: [
      { mathSymbol: '\\frac{x - \\mu}{\\sigma}', pythonEquivalent: '(x - mu) / sigma', explanation: 'Standard score normalization (z-score)' },
      { mathSymbol: '\\exp(-0.5 z^2)', pythonEquivalent: 'np.exp(-0.5 * (z**2))', explanation: 'Exponential quadratic attenuation' },
      { mathSymbol: '\\frac{1}{\\sigma \\sqrt{2\\pi}}', pythonEquivalent: '1.0 / (sigma * np.sqrt(2*pi))', explanation: 'Normalizing constant ensuring unit total integral' }
    ],
    computationalComplexity: {
      time: 'O(N) element-wise operations',
      space: 'O(N) for output densities',
      flops: '5 FLOPs + 1 exp per element'
    },
    numericalSafeguards: [
      'Strict parameter validation rejects non-positive standard deviation (sigma <= 0.0).',
      'For extreme z-scores (|z| > 38), exp smoothly underflows to exact 0.0 without generating NaNs.'
    ]
  };
}
