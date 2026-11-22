import type {
  ASTNode,
  BinaryOpNode,
  CallNode,
  ReversePatternType,
  ReverseEquationExplanation,
  PythonMathOperationMapping,
  VariableSemanticMapping
} from './types';
import { astToLatex, getCalleeString } from './astToLatex';
import { checkExpandedPatterns } from './expandedRecognizer';

export interface RecognitionResult {
  pattern: ReversePatternType;
  equationName: string;
  latex: string;
  explanation: ReverseEquationExplanation;
}

export function recognizePattern(
  ast: ASTNode,
  targetVariable?: string,
  functionName?: string,
  _parameters: string[] = []
): RecognitionResult {
  // 1. Matrix multiplication: C = A @ B
  const matmul = checkMatrixMultiplication(ast, targetVariable);
  if (matmul) return matmul;

  // 2. Linear regression: y_hat = X @ w + b
  const linreg = checkLinearRegression(ast, targetVariable);
  if (linreg) return linreg;

  // 3. Vector L2 norm: norm = sqrt(sum(x ** 2))
  const norm = checkVectorNorm(ast, targetVariable);
  if (norm) return norm;

  // 4. Sigmoid: y = 1 / (1 + exp(-z))
  const sigmoid = checkSigmoid(ast, targetVariable, functionName);
  if (sigmoid) return sigmoid;

  // 5. Bayes' theorem: posterior = likelihood * prior / marginal
  const bayes = checkBayesTheorem(ast, targetVariable);
  if (bayes) return bayes;

  // 6. Gaussian normal PDF
  const gaussian = checkGaussianPdf(ast, targetVariable);
  if (gaussian) return gaussian;

  // 7-26. Expanded 20 patterns
  const expanded = checkExpandedPatterns(ast, targetVariable, functionName);
  if (expanded) return expanded;

  // 27. Generic safe algebraic expression
  const genericLatex = astToLatex(ast);
  const targetPrefix = targetVariable ? `${astToLatex({ type: 'Name', id: targetVariable })} = ` : '';

  return {
    pattern: 'generic_algebraic',
    equationName: 'Algebraic Mathematical Formulation',
    latex: `${targetPrefix}${genericLatex}`,
    explanation: {
      title: 'Symbolic Algebraic Expression',
      category: 'General Mathematics',
      summary: 'Decompiled from verified Python arithmetic operations using standard algebraic notation.',
      mathDomain: 'Real-valued or tensor algebraic domain',
      detectedPattern: 'generic_algebraic',
      assumptions: [
        'Operations follow standard Python left-to-right precedence rules',
        'Variables are assumed to have compatible shapes or scalar broadcastability'
      ],
      operationMappings: collectOperationMappings(ast),
      variableMappings: collectVariables(ast, targetVariable),
      limitations: [
        'No domain-specific semantic template was matched; translated using direct syntactic AST rules'
      ]
    }
  };
}

// --- Pattern Matchers ---

function checkMatrixMultiplication(
  ast: ASTNode,
  target?: string
): RecognitionResult | null {
  if (ast.type === 'BinaryOp' && ast.op === '@') {
    const leftLatex = astToLatex(ast.left);
    const rightLatex = astToLatex(ast.right);
    const targetSymbol = target ? astToLatex({ type: 'Name', id: target }) : 'C';

    const opMappings: PythonMathOperationMapping[] = [
      {
        pythonSyntax: '@',
        mathSymbol: 'AB (juxtaposition)',
        latexEquivalent: `${leftLatex}${rightLatex}`,
        explanation: 'NumPy @ operator performs 2D matrix inner contraction C_ij = \\sum_k A_ik B_kj'
      }
    ];

    const varMappings: VariableSemanticMapping[] = [
      {
        pythonVariable: extractVarName(ast.left),
        mathSymbol: leftLatex,
        role: 'Left input matrix (M x K)',
        isInferred: true
      },
      {
        pythonVariable: extractVarName(ast.right),
        mathSymbol: rightLatex,
        role: 'Right input matrix (K x N)',
        isInferred: true
      }
    ];
    if (target) {
      varMappings.unshift({
        pythonVariable: target,
        mathSymbol: targetSymbol,
        role: 'Resulting product matrix (M x N)',
        isInferred: false
      });
    }

    return {
      pattern: 'matrix_multiplication',
      equationName: 'Matrix Multiplication',
      latex: `${targetSymbol} = ${leftLatex}${rightLatex}`,
      explanation: {
        title: 'Matrix Product Formulation',
        category: 'Linear Algebra',
        summary: 'Multiplication of two matrices using NumPy @ operator, contracting corresponding inner dimensions.',
        mathDomain: 'Matrices over real field: A \\in \\mathbb{R}^{M \\times K}, B \\in \\mathbb{R}^{K \\times N} \\implies C \\in \\mathbb{R}^{M \\times N}',
        detectedPattern: 'matrix_multiplication',
        assumptions: [
          'A and B must be 2D matrices',
          'Inner dimension of A (columns) must strictly equal inner dimension of B (rows)',
          '@ operator signifies matrix multiplication, distinguishing it from element-wise multiplication (*)'
        ],
        operationMappings: opMappings,
        variableMappings: varMappings,
        limitations: [
          'Assumes 2D matrices; batched higher-order tensor contractions (>2D) follow generalized Einstein summation'
        ]
      }
    };
  }
  return null;
}

function checkLinearRegression(
  ast: ASTNode,
  target?: string
): RecognitionResult | null {
  // Pattern: (X @ w) + b or b + (X @ w)
  if (ast.type === 'BinaryOp' && (ast.op === '+' || ast.op === '-')) {
    let matmulPart: BinaryOpNode | null = null;
    let biasPart: ASTNode | null = null;
    let isSub = ast.op === '-';

    if (ast.left.type === 'BinaryOp' && ast.left.op === '@') {
      matmulPart = ast.left;
      biasPart = ast.right;
    } else if (ast.right.type === 'BinaryOp' && ast.right.op === '@') {
      matmulPart = ast.right;
      biasPart = ast.left;
    }

    if (matmulPart && biasPart) {
      const xLatex = astToLatex(matmulPart.left);
      const wLatex = astToLatex(matmulPart.right);
      const bLatex = astToLatex(biasPart);
      const targetSymbol = target ? (target === 'y_hat' || target === 'y_pred' ? '\\hat{y}' : astToLatex({ type: 'Name', id: target })) : '\\hat{y}';
      const sign = isSub ? '-' : '+';

      const opMappings: PythonMathOperationMapping[] = [
        {
          pythonSyntax: '@',
          mathSymbol: 'Xw',
          latexEquivalent: `${xLatex}${wLatex}`,
          explanation: 'Matrix-vector dot product contracting feature dimension D'
        },
        {
          pythonSyntax: sign,
          mathSymbol: sign,
          latexEquivalent: `${sign} ${bLatex}`,
          explanation: 'Affine intercept / bias term addition'
        }
      ];

      const varMappings: VariableSemanticMapping[] = [
        {
          pythonVariable: extractVarName(matmulPart.left),
          mathSymbol: xLatex,
          role: 'Design matrix of observation features (N x D)',
          isInferred: true
        },
        {
          pythonVariable: extractVarName(matmulPart.right),
          mathSymbol: wLatex,
          role: 'Model parameter weights vector (D x 1)',
          isInferred: true
        },
        {
          pythonVariable: extractVarName(biasPart),
          mathSymbol: bLatex,
          role: 'Scalar or broadcastable intercept bias',
          isInferred: true
        }
      ];
      if (target) {
        varMappings.unshift({
          pythonVariable: target,
          mathSymbol: targetSymbol,
          role: 'Predicted response target vector',
          isInferred: false
        });
      }

      return {
        pattern: 'linear_regression',
        equationName: 'Multivariate Linear Regression Prediction',
        latex: `${targetSymbol} = ${xLatex}${wLatex} ${sign} ${bLatex}`,
        explanation: {
          title: 'Linear Model Prediction',
          category: 'Machine Learning / Statistics',
          summary: 'Computes continuous target predictions via affine transformation of feature matrix X with weights w and bias b.',
          mathDomain: 'X \\in \\mathbb{R}^{N \\times D}, w \\in \\mathbb{R}^{D}, b \\in \\mathbb{R} \\implies \\hat{y} \\in \\mathbb{R}^{N}',
          detectedPattern: 'linear_regression',
          assumptions: [
            'Number of columns in feature matrix X must match weight vector length D',
            'Bias b is broadcast across all N sample observations',
            '@ operator represents linear projection, not element-wise multiplication'
          ],
          operationMappings: opMappings,
          variableMappings: varMappings,
          limitations: [
            'Closed-form prediction assumes weights and bias have already been estimated'
          ]
        }
      };
    }
  }
  return null;
}

function checkVectorNorm(
  ast: ASTNode,
  target?: string
): RecognitionResult | null {
  // Pattern 1: np.sqrt(np.sum(x ** 2)) or math.sqrt(sum(x ** 2))
  // Pattern 2: np.linalg.norm(x)
  let vectorArg: ASTNode | null = null;

  if (ast.type === 'Call') {
    const callee = getCalleeString(ast.callee);

    // np.linalg.norm(x)
    if (callee === 'np.linalg.norm' || callee === 'linalg.norm' || callee === 'norm') {
      vectorArg = ast.args[0] || null;
    } else if (callee === 'sqrt' || callee === 'np.sqrt' || callee === 'math.sqrt') {
      const inner = ast.args[0];
      if (inner && inner.type === 'Call') {
        const innerCallee = getCalleeString(inner.callee);
        if (innerCallee === 'sum' || innerCallee === 'np.sum') {
          const sumArg = inner.args[0];
          if (sumArg && sumArg.type === 'BinaryOp') {
            if (sumArg.op === '**' && isTwo(sumArg.right)) {
              vectorArg = sumArg.left;
            } else if (sumArg.op === '*' && extractVarName(sumArg.left) === extractVarName(sumArg.right)) {
              vectorArg = sumArg.left;
            }
          }
        }
      } else if (inner && inner.type === 'BinaryOp' && inner.op === '@') {
        // sqrt(x @ x)
        if (extractVarName(inner.left) === extractVarName(inner.right)) {
          vectorArg = inner.left;
        }
      }
    }
  }

  if (vectorArg) {
    if (vectorArg.type === 'BinaryOp' && vectorArg.op === '-') {
      return null;
    }
    const varLatex = astToLatex(vectorArg);
    const targetSymbol = target ? astToLatex({ type: 'Name', id: target }) : `\\|${varLatex}\\|_{2}`;

    const opMappings: PythonMathOperationMapping[] = [
      {
        pythonSyntax: '** 2',
        mathSymbol: 'x_i^2',
        latexEquivalent: `{${varLatex}_i}^2`,
        explanation: 'Element-wise squaring of vector components'
      },
      {
        pythonSyntax: 'np.sum(...)',
        mathSymbol: '\\sum_i',
        latexEquivalent: '\\sum_i',
        explanation: 'Summation of squared values across vector elements'
      },
      {
        pythonSyntax: 'np.sqrt(...)',
        mathSymbol: '\\sqrt{\\cdot}',
        latexEquivalent: '\\sqrt{\\cdot}',
        explanation: 'Square root of sum producing Euclidean scalar length'
      }
    ];

    const varMappings: VariableSemanticMapping[] = [
      {
        pythonVariable: extractVarName(vectorArg),
        mathSymbol: varLatex,
        role: 'Input real coordinate vector (1D array)',
        isInferred: true
      }
    ];
    if (target) {
      varMappings.unshift({
        pythonVariable: target,
        mathSymbol: targetSymbol,
        role: 'Computed scalar Euclidean length (non-negative)',
        isInferred: false
      });
    }

    return {
      pattern: 'vector_l2_norm',
      equationName: 'Vector L2 Euclidean Norm',
      latex: `${targetSymbol} = \\sqrt{\\sum_i ${varLatex}_i^2}`,
      explanation: {
        title: 'Euclidean Geometric Vector Norm',
        category: 'Linear Algebra',
        summary: 'Calculates the L2 norm (Euclidean distance from origin) for a real vector x.',
        mathDomain: 'x \\in \\mathbb{R}^{n} \\implies \\|x\\|_2 \\in [0, \\infty)',
        detectedPattern: 'vector_l2_norm',
        assumptions: [
          'Vector x is a one-dimensional array',
          'Output is guaranteed non-negative by definition of the positive square root',
          'Empty vectors are undefined'
        ],
        operationMappings: opMappings,
        variableMappings: varMappings,
        limitations: [
          'Applies to standard Euclidean L2 norm; not generalized to arbitrary Lp p-norms'
        ]
      }
    };
  }

  return null;
}

function checkSigmoid(
  ast: ASTNode,
  target?: string,
  funcName?: string
): RecognitionResult | null {
  // Pattern: 1 / (1 + exp(-z)) or 1.0 / (1.0 + np.exp(-z))
  if (ast.type === 'BinaryOp' && (ast.op === '/' || ast.op === '//')) {
    if (isOne(ast.left)) {
      const den = ast.right;
      if (den.type === 'BinaryOp' && den.op === '+') {
        let oneNode: ASTNode | null = null;
        let expNode: CallNode | null = null;

        if (isOne(den.left) && den.right.type === 'Call') {
          oneNode = den.left;
          expNode = den.right as CallNode;
        } else if (isOne(den.right) && den.left.type === 'Call') {
          oneNode = den.right;
          expNode = den.left as CallNode;
        }

        if (oneNode && expNode) {
          const callee = getCalleeString(expNode.callee);
          if (callee === 'exp' || callee === 'np.exp' || callee === 'math.exp') {
            const expArg = expNode.args[0];
            let zNode: ASTNode | null = null;

            if (expArg && expArg.type === 'UnaryOp' && expArg.op === '-') {
              zNode = expArg.operand;
            } else if (expArg && expArg.type === 'BinaryOp' && expArg.op === '*' && isNegativeOne(expArg.left)) {
              zNode = expArg.right;
            }

            if (zNode) {
              const zLatex = astToLatex(zNode);
              const targetSymbol = (funcName === 'sigmoid' || target === 'sigma' || !target)
                ? `\\sigma(${zLatex})`
                : astToLatex({ type: 'Name', id: target });

              const opMappings: PythonMathOperationMapping[] = [
                {
                  pythonSyntax: 'np.exp(-z)',
                  mathSymbol: 'e^{-z}',
                  latexEquivalent: `e^{-${zLatex}}`,
                  explanation: 'Base-e exponential of negated input'
                },
                {
                  pythonSyntax: '1 + ...',
                  mathSymbol: '1 + e^{-z}',
                  latexEquivalent: `1 + e^{-${zLatex}}`,
                  explanation: 'Shift denominator by 1 to bound range'
                },
                {
                  pythonSyntax: '1 / (...)',
                  mathSymbol: '\\frac{1}{\\dots}',
                  latexEquivalent: `\\frac{1}{1 + e^{-${zLatex}}}`,
                  explanation: 'Reciprocal normalizes outputs into (0, 1)'
                }
              ];

              const varMappings: VariableSemanticMapping[] = [
                {
                  pythonVariable: extractVarName(zNode),
                  mathSymbol: zLatex,
                  role: 'Input real scalar or activation logit',
                  isInferred: true
                }
              ];
              if (target) {
                varMappings.unshift({
                  pythonVariable: target,
                  mathSymbol: targetSymbol,
                  role: 'Computed probability / activation score',
                  isInferred: false
                });
              }

              return {
                pattern: 'sigmoid',
                equationName: 'Sigmoidal Logistic Activation',
                latex: `${targetSymbol} = \\frac{1}{1 + e^{-${zLatex}}}`,
                explanation: {
                  title: 'Logistic Sigmoid Activation Function',
                  category: 'Machine Learning',
                  summary: 'Monotonically increasing S-curve mapping any real number into the interval (0, 1).',
                  mathDomain: 'z \\in \\mathbb{R} \\implies \\sigma(z) \\in (0, 1)',
                  detectedPattern: 'sigmoid',
                  assumptions: [
                    'Symmetric around origin: \\sigma(0) = 0.5',
                    'Numerically stable implementations guard against exp(-z) overflow when z is a large negative value'
                  ],
                  operationMappings: opMappings,
                  variableMappings: varMappings,
                  limitations: [
                    'Standard closed-form expression; does not represent piecewise dual-branch implementations directly'
                  ]
                }
              };
            }
          }
        }
      }
    }
  }
  return null;
}

function checkBayesTheorem(
  ast: ASTNode,
  target?: string
): RecognitionResult | null {
  // Pattern: likelihood * prior / marginal or (likelihood * prior) / marginal
  if (ast.type === 'BinaryOp' && (ast.op === '/' || ast.op === '//')) {
    const num = ast.left;
    const den = ast.right;

    let numMult: BinaryOpNode | null = null;
    if (num.type === 'BinaryOp' && num.op === '*') {
      numMult = num;
    }

    if (numMult) {
      const leftVar = extractVarName(numMult.left).toLowerCase();
      const rightVar = extractVarName(numMult.right).toLowerCase();
      const denVar = extractVarName(den).toLowerCase();

      const isBayesVars = (
        (leftVar.includes('like') || rightVar.includes('like') || leftVar.includes('b_given_a') || rightVar.includes('b_given_a')) &&
        (leftVar.includes('prior') || rightVar.includes('prior') || leftVar === 'p_a' || rightVar === 'p_a') &&
        (denVar.includes('marg') || denVar.includes('evidence') || denVar === 'p_b')
      );

      const targetStr = (target || '').toLowerCase();
      const isBayesTarget = targetStr.includes('post') || targetStr.includes('a_given_b') || targetStr.includes('bayes');

      if (isBayesVars || (isBayesTarget && den.type === 'Name')) {
        const likelihoodLatex = 'P(B\\mid A)';
        const priorLatex = 'P(A)';
        const marginalLatex = 'P(B)';
        const posteriorLatex = 'P(A\\mid B)';

        const opMappings: PythonMathOperationMapping[] = [
          {
            pythonSyntax: 'likelihood * prior',
            mathSymbol: 'P(B\\mid A)P(A)',
            latexEquivalent: 'P(B\\mid A) P(A)',
            explanation: 'Joint probability P(A \\cap B) formed by conditioning on hypothesis A'
          },
          {
            pythonSyntax: '/ marginal',
            mathSymbol: '\\frac{\\dots}{P(B)}',
            latexEquivalent: '\\frac{P(B\\mid A)P(A)}{P(B)}',
            explanation: 'Normalization by marginal evidence probability P(B)'
          }
        ];

        const varMappings: VariableSemanticMapping[] = [
          {
            pythonVariable: extractVarName(numMult.left),
            mathSymbol: leftVar.includes('prior') ? priorLatex : likelihoodLatex,
            role: leftVar.includes('prior') ? 'Prior probability of hypothesis A' : 'Likelihood of evidence B given A',
            isInferred: true
          },
          {
            pythonVariable: extractVarName(numMult.right),
            mathSymbol: rightVar.includes('prior') ? priorLatex : likelihoodLatex,
            role: rightVar.includes('prior') ? 'Prior probability of hypothesis A' : 'Likelihood of evidence B given A',
            isInferred: true
          },
          {
            pythonVariable: extractVarName(den),
            mathSymbol: marginalLatex,
            role: 'Marginal probability of evidence B',
            isInferred: true
          }
        ];
        if (target) {
          varMappings.unshift({
            pythonVariable: target,
            mathSymbol: posteriorLatex,
            role: 'Posterior probability of hypothesis A given evidence B',
            isInferred: true
          });
        }

        return {
          pattern: 'bayes_theorem',
          equationName: "Bayes' Theorem",
          latex: `P(A\\mid B) = \\frac{P(B\\mid A) P(A)}{P(B)}`,
          explanation: {
            title: "Bayes' Law of Conditional Probability",
            category: 'Probability & Statistics',
            summary: 'Calculates the conditional posterior probability of hypothesis A given observed evidence B.',
            mathDomain: 'P(A), P(B), P(B\\mid A) \\in [0, 1], P(B) > 0',
            detectedPattern: 'bayes_theorem',
            assumptions: [
              'Marginal probability P(B) must be strictly non-zero',
              'All probabilities must satisfy Kolmogorov axioms within [0, 1]',
              'Joint numerator P(B\\mid A)P(A) cannot exceed marginal P(B)'
            ],
            operationMappings: opMappings,
            variableMappings: varMappings,
            limitations: [
              'Discrete formulation; continuous random variables utilize probability density ratio integration'
            ]
          }
        };
      }
    }
  }
  return null;
}

function checkGaussianPdf(
  ast: ASTNode,
  target?: string
): RecognitionResult | null {
  // Pattern: (1 / (sigma * sqrt(2 * pi))) * exp(-((x - mu)**2) / (2 * sigma**2))
  // or exp(-0.5 * ((x - mu) / sigma)**2) / (sigma * sqrt(2 * pi))
  const codeStr = JSON.stringify(ast);

  const hasExp = codeStr.includes('"exp"') || codeStr.includes('"np.exp"');
  const hasSqrt = codeStr.includes('"sqrt"') || codeStr.includes('"np.sqrt"');
  const hasPi = codeStr.includes('"pi"');
  const hasSigma = codeStr.includes('"sigma"') || codeStr.includes('"std"');
  const hasMu = codeStr.includes('"mu"') || codeStr.includes('"mean"');

  if (hasExp && hasSqrt && (hasPi || hasSigma || hasMu)) {
    const targetSymbol = target ? (target === 'f' || target === 'pdf' || target === 'y' ? 'f(x)' : astToLatex({ type: 'Name', id: target })) : 'f(x)';

    const opMappings: PythonMathOperationMapping[] = [
      {
        pythonSyntax: 'np.sqrt(2 * np.pi)',
        mathSymbol: '\\sqrt{2\\pi}',
        latexEquivalent: '\\sqrt{2\\pi}',
        explanation: 'Normalization geometric constant of standard normal distribution'
      },
      {
        pythonSyntax: '(x - mu) ** 2',
        mathSymbol: '(x - \\mu)^2',
        latexEquivalent: '(x - \\mu)^2',
        explanation: 'Squared deviation of sample point x from distribution mean \\mu'
      },
      {
        pythonSyntax: '2 * sigma ** 2',
        mathSymbol: '2\\sigma^2',
        latexEquivalent: '2\\sigma^2',
        explanation: 'Twice distribution variance scaling exponential decay'
      },
      {
        pythonSyntax: 'np.exp(-...)',
        mathSymbol: '\\exp(\\dots)',
        latexEquivalent: '\\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)',
        explanation: 'Gaussian bell curve exponential kernel'
      }
    ];

    const varMappings: VariableSemanticMapping[] = [
      {
        pythonVariable: 'x',
        mathSymbol: 'x',
        role: 'Evaluation point on real axis',
        isInferred: true
      },
      {
        pythonVariable: 'mu',
        mathSymbol: '\\mu',
        role: 'Distribution expected value / mean',
        isInferred: true
      },
      {
        pythonVariable: 'sigma',
        mathSymbol: '\\sigma',
        role: 'Standard deviation (scale parameter, \\sigma > 0)',
        isInferred: true
      }
    ];
    if (target) {
      varMappings.unshift({
        pythonVariable: target,
        mathSymbol: targetSymbol,
        role: 'Continuous probability density evaluated at point x',
        isInferred: false
      });
    }

    return {
      pattern: 'gaussian_pdf',
      equationName: 'Gaussian Normal Probability Density',
      latex: `${targetSymbol} = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)`,
      explanation: {
        title: 'Univariate Gaussian Probability Density Function (PDF)',
        category: 'Probability & Distributions',
        summary: 'Continuous probability distribution characterized by symmetric bell curve centered at mean mu with dispersion sigma.',
        mathDomain: 'x \\in \\mathbb{R}, \\mu \\in \\mathbb{R}, \\sigma \\in (0, \\infty) \\implies f(x) > 0',
        detectedPattern: 'gaussian_pdf',
        assumptions: [
          'Standard deviation \\sigma must be strictly positive (\\sigma > 0)',
          'Total integral over entire real line equals unity: \\int_{-\\infty}^\\infty f(x) dx = 1',
          'Symmetric around central mean \\mu'
        ],
        operationMappings: opMappings,
        variableMappings: varMappings,
        limitations: [
          'Univariate formulation; multivariate Gaussian requires covariance matrix determinant and inverse'
        ]
      }
    };
  }

  return null;
}

// --- Helpers ---

function extractVarName(node: ASTNode): string {
  if (node.type === 'Name') return node.id;
  if (node.type === 'Attribute') return `${extractVarName(node.value)}.${node.attr}`;
  if (node.type === 'Subscript') return `${extractVarName(node.value)}[${extractVarName(node.slice)}]`;
  return 'expr';
}

function isOne(node: ASTNode): boolean {
  return node.type === 'Number' && (node.value === 1 || node.value === 1.0);
}

function isTwo(node: ASTNode): boolean {
  return node.type === 'Number' && (node.value === 2 || node.value === 2.0);
}

function isNegativeOne(node: ASTNode): boolean {
  if (node.type === 'UnaryOp' && node.op === '-' && isOne(node.operand)) return true;
  if (node.type === 'Number' && node.value === -1) return true;
  return false;
}

function collectOperationMappings(ast: ASTNode): PythonMathOperationMapping[] {
  const mappings: PythonMathOperationMapping[] = [];

  function walk(node: ASTNode) {
    if (node.type === 'BinaryOp') {
      if (node.op === '@') {
        mappings.push({
          pythonSyntax: '@',
          mathSymbol: 'AB',
          latexEquivalent: 'AB',
          explanation: 'Matrix multiplication inner contraction'
        });
      } else if (node.op === '**') {
        mappings.push({
          pythonSyntax: '**',
          mathSymbol: 'x^p',
          latexEquivalent: '{x}^{p}',
          explanation: 'Exponentiation / power operation'
        });
      } else if (node.op === '/') {
        mappings.push({
          pythonSyntax: '/',
          mathSymbol: '\\frac{a}{b}',
          latexEquivalent: '\\frac{a}{b}',
          explanation: 'Fractional division'
        });
      }
      walk(node.left);
      walk(node.right);
    } else if (node.type === 'UnaryOp') {
      walk(node.operand);
    } else if (node.type === 'Call') {
      const callee = getCalleeString(node.callee);
      mappings.push({
        pythonSyntax: `${callee}(...)`,
        mathSymbol: `\\text{${callee}}(\\dots)`,
        latexEquivalent: `\\text{${callee}}(\\dots)`,
        explanation: `Function evaluation of ${callee}`
      });
      node.args.forEach(walk);
    }
  }

  walk(ast);
  return mappings;
}

function collectVariables(ast: ASTNode, target?: string): VariableSemanticMapping[] {
  const vars = new Set<string>();

  function walk(node: ASTNode) {
    if (node.type === 'Name') {
      vars.add(node.id);
    } else if (node.type === 'BinaryOp') {
      walk(node.left);
      walk(node.right);
    } else if (node.type === 'UnaryOp') {
      walk(node.operand);
    } else if (node.type === 'Call') {
      node.args.forEach(walk);
    } else if (node.type === 'Subscript') {
      walk(node.value);
    }
  }

  walk(ast);

  const mappings: VariableSemanticMapping[] = [];
  if (target) {
    mappings.push({
      pythonVariable: target,
      mathSymbol: astToLatex({ type: 'Name', id: target }),
      role: 'Result variable assignment target',
      isInferred: false
    });
  }

  for (const v of vars) {
    if (v !== target) {
      mappings.push({
        pythonVariable: v,
        mathSymbol: astToLatex({ type: 'Name', id: v }),
        role: 'Input operand in expression',
        isInferred: false
      });
    }
  }

  return mappings;
}
