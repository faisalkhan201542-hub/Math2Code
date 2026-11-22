import { normalizeEquation } from './normalizer';
import type { ConversionResult } from './types';
import {
  matchMatrixMultiplication,
  generateMatrixMultiplicationCode,
  getMatrixMultiplicationMetadata,
  explainMatrixMultiplication
} from './patterns/matrixMult';
import {
  matchVectorNorm,
  generateVectorNormCode,
  getVectorNormMetadata,
  explainVectorNorm
} from './patterns/vectorNorm';
import {
  matchSigmoid,
  generateSigmoidCode,
  getSigmoidMetadata,
  explainSigmoid
} from './patterns/sigmoid';
import {
  matchBayesTheorem,
  generateBayesTheoremCode,
  getBayesTheoremMetadata,
  explainBayesTheorem
} from './patterns/bayesTheorem';
import {
  matchLinearRegression,
  generateLinearRegressionCode,
  getLinearRegressionMetadata,
  explainLinearRegression
} from './patterns/linearRegression';
import {
  matchGaussianPdf,
  generateGaussianPdfCode,
  getGaussianPdfMetadata,
  explainGaussianPdf
} from './patterns/gaussianPdf';
import { EXPANDED_PATTERNS } from './patterns/expandedPatterns';

export const SUPPORTED_CANONICAL_TEMPLATES = [
  {
    name: 'Matrix Multiplication',
    latex: 'C = AB \\quad \\Longleftrightarrow \\quad C_{ij} = \\sum_{k=1}^p A_{ik} B_{kj}',
    simple: 'C = AB'
  },
  {
    name: 'Vector L2 Euclidean Norm',
    latex: '\\|x\\|_2 = \\sqrt{\\sum_{i=1}^{n} x_i^2}',
    simple: '||x||_2 = sqrt(sum(x_i^2))'
  },
  {
    name: 'Sigmoidal Logistic Function',
    latex: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
    simple: 'sigma(z) = 1 / (1 + exp(-z))'
  },
  {
    name: "Bayes' Theorem",
    latex: 'P(A\\mid B) = \\frac{P(B\\mid A) P(A)}{P(B)}',
    simple: 'P(A|B) = P(B|A) * P(A) / P(B)'
  },
  {
    name: 'Linear Regression Prediction',
    latex: '\\hat{y} = Xw + b',
    simple: 'y_hat = X @ w + b'
  },
  {
    name: 'Gaussian Normal PDF',
    latex: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{(x - \\mu)^2}{2\\sigma^2} \\right)',
    simple: 'f(x) = exp(-((x-mu)^2)/(2*sigma^2)) / (sigma*sqrt(2*pi))'
  }
];

export const ALL_SUPPORTED_TEMPLATES = [
  ...SUPPORTED_CANONICAL_TEMPLATES,
  ...EXPANDED_PATTERNS.map((p) => ({
    name: p.name,
    latex: p.latex,
    simple: p.simple,
    category: p.category
  }))
];

export function convertEquationToPython(rawEquation: string): ConversionResult {
  if (!rawEquation || !rawEquation.trim()) {
    return {
      status: 'invalid_input',
      pattern: 'unsupported',
      equationName: 'Empty Equation',
      code: '# Error: No equation input provided.\n# Please enter a mathematical expression or pick a verified preset above.',
      errorMessage: 'Equation input is empty. Please enter LaTeX or select a supported template.',
      suggestedTemplates: SUPPORTED_CANONICAL_TEMPLATES.map(t => t.latex)
    };
  }

  const normalized = normalizeEquation(rawEquation);

  // 1. Matrix Multiplication
  if (matchMatrixMultiplication(normalized, rawEquation)) {
    return {
      status: 'success',
      pattern: 'matrix_multiplication',
      equationName: 'Matrix Multiplication',
      code: generateMatrixMultiplicationCode(),
      metadata: getMatrixMultiplicationMetadata(),
      explanation: explainMatrixMultiplication()
    };
  }

  // 2. Vector L2 Norm
  if (matchVectorNorm(normalized, rawEquation)) {
    return {
      status: 'success',
      pattern: 'vector_l2_norm',
      equationName: 'Vector L2 Euclidean Norm',
      code: generateVectorNormCode(),
      metadata: getVectorNormMetadata(),
      explanation: explainVectorNorm()
    };
  }

  // 3. Sigmoid Function
  if (matchSigmoid(normalized, rawEquation)) {
    return {
      status: 'success',
      pattern: 'sigmoid',
      equationName: 'Sigmoidal Logistic Function',
      code: generateSigmoidCode(),
      metadata: getSigmoidMetadata(),
      explanation: explainSigmoid()
    };
  }

  // 4. Bayes' Theorem
  if (matchBayesTheorem(normalized, rawEquation)) {
    return {
      status: 'success',
      pattern: 'bayes_theorem',
      equationName: "Bayes' Theorem",
      code: generateBayesTheoremCode(),
      metadata: getBayesTheoremMetadata(),
      explanation: explainBayesTheorem()
    };
  }

  // 5. Linear Regression
  if (matchLinearRegression(normalized, rawEquation)) {
    return {
      status: 'success',
      pattern: 'linear_regression',
      equationName: 'Linear Regression Prediction',
      code: generateLinearRegressionCode(),
      metadata: getLinearRegressionMetadata(),
      explanation: explainLinearRegression()
    };
  }

  // 6. Gaussian Normal PDF
  if (matchGaussianPdf(normalized, rawEquation)) {
    return {
      status: 'success',
      pattern: 'gaussian_pdf',
      equationName: 'Gaussian Probability Density Function',
      code: generateGaussianPdfCode(),
      metadata: getGaussianPdfMetadata(),
      explanation: explainGaussianPdf()
    };
  }

  // 7-26. Expanded Equations (Phase 9 Suite)
  for (const exp of EXPANDED_PATTERNS) {
    if (exp.match(normalized, rawEquation)) {
      return {
        status: 'success',
        pattern: exp.pattern,
        equationName: exp.name,
        code: exp.generateCode(),
        metadata: exp.getMetadata(),
        explanation: exp.explain()
      };
    }
  }

  // Unsupported Expression
  return {
    status: 'unsupported_syntax',
    pattern: 'unsupported',
    equationName: 'Unsupported Equation Expression',
    code: `# Unsupported Syntax Notice:
# The expression:
#   "${rawEquation.trim()}"
# is not in the set of 6 initial supported mathematical patterns.
#
# Supported Patterns:
# 1. Matrix Multiplication:       C = AB or C_{ij} = sum(A_{ik} * B_{kj})
# 2. Vector L2 Norm:              ||x||_2 = sqrt(sum(x_i^2))
# 3. Sigmoid Activation:          sigma(z) = 1 / (1 + exp(-z))
# 4. Bayes' Theorem:              P(A|B) = P(B|A) * P(A) / P(B)
# 5. Linear Regression:           y_hat = Xw + b
# 6. Gaussian Normal Density:     f(x) = (1 / (sigma * sqrt(2*pi))) * exp(-((x-mu)^2)/(2*sigma^2))
#
# Click any verified template above to load its validated specification.`,
    errorMessage: `The syntax "${rawEquation.trim()}" does not match the 6 initial supported equation patterns. Please select or adapt one of the documented templates.`,
    suggestedTemplates: SUPPORTED_CANONICAL_TEMPLATES.map(t => t.latex)
  };
}

export * from './types';
export * from './normalizer';
export * from './patterns/expandedPatterns';

