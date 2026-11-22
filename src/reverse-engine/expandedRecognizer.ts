import type {
  ASTNode,
  CallNode
} from './types';
import type { RecognitionResult } from './recognizer';
import { astToLatex, getCalleeString } from './astToLatex';

export function checkExpandedPatterns(
  ast: ASTNode,
  target?: string,
  functionName?: string
): RecognitionResult | null {
  const t = target?.toLowerCase();
  const fn = functionName?.toLowerCase();

  // 1. ReLU: np.maximum(0, x) or max(0, x)
  const relu = checkRelu(ast, t, fn);
  if (relu) return relu;

  // 2. Softmax: np.exp(z) / np.sum(np.exp(z))
  const softmax = checkSoftmax(ast, t, fn);
  if (softmax) return softmax;

  // 3. Dot Product: np.dot(x, w) or np.sum(x * w)
  const dot = checkDotProduct(ast, t, fn);
  if (dot) return dot;

  // 4. Euclidean Distance: np.sqrt(np.sum((x - y)**2)) or norm(x - y)
  const dist = checkEuclideanDistance(ast, t, fn);
  if (dist) return dist;

  // 5. Binary Cross-Entropy: -(y * log(p) + (1 - y) * log(1 - p))
  const bce = checkBinaryCrossEntropy(ast, t, fn);
  if (bce) return bce;

  // 6. Mean Squared Error: np.mean((y - y_hat)**2)
  const mse = checkMse(ast, t, fn);
  if (mse) return mse;

  // 7. Mean Absolute Error: np.mean(np.abs(y - y_hat))
  const mae = checkMae(ast, t, fn);
  if (mae) return mae;

  // 8. Variance: np.sum((x - mu)**2) / (n - 1)
  const variance = checkVariance(ast, t, fn);
  if (variance) return variance;

  // 9. Covariance: np.sum((x - x_bar) * (y - y_bar)) / (n - 1)
  const cov = checkCovariance(ast, t, fn);
  if (cov) return cov;

  // 10. Pearson Correlation: cov / (std_x * std_y)
  const pearson = checkPearsonCorrelation(ast, t, fn);
  if (pearson) return pearson;

  // 11. Z-Score: (x - mu) / sigma
  const zscore = checkZScore(ast, t, fn);
  if (zscore) return zscore;

  // 12. Gradient Descent: theta - alpha * grad
  const gd = checkGradientDescent(ast, t, fn);
  if (gd) return gd;

  // 13. Precision: tp / (tp + fp)
  const prec = checkPrecision(ast, t, fn);
  if (prec) return prec;

  // 14. Recall: tp / (tp + fn)
  const rec = checkRecall(ast, t, fn);
  if (rec) return rec;

  // 15. F1-Score: 2 * (p * r) / (p + r)
  const f1 = checkF1Score(ast, t, fn);
  if (f1) return f1;

  // 16. Chain Rule: df_du * du_dx
  const chain = checkChainRule(ast, t, fn);
  if (chain) return chain;

  // 17. L1 Regularization: lambda * sum(abs(w))
  const l1 = checkL1Regularization(ast, t, fn);
  if (l1) return l1;

  // 18. L2 Regularization: (lambda / 2) * sum(w**2)
  const l2 = checkL2Regularization(ast, t, fn);
  if (l2) return l2;

  // 19. Shannon Entropy: -sum(p * log2(p))
  const entropy = checkEntropy(ast, t, fn);
  if (entropy) return entropy;

  // 20. KL Divergence: sum(p * log(p / q))
  const kl = checkKlDivergence(ast, t, fn);
  if (kl) return kl;

  return null;
}

// ==========================================
// 1. RECTIFIED LINEAR UNIT (ReLU)
// ==========================================
function checkRelu(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  if (ast.type === 'Call') {
    const callee = getCalleeString(ast.callee);
    if ((callee === 'max' || callee === 'np.maximum') && ast.args.length === 2) {
      const a = ast.args[0];
      const b = ast.args[1];
      const isA0 = isZero(a);
      const isB0 = isZero(b);
      if (isA0 || isB0) {
        const xNode = isA0 ? b : a;
        const xName = extractVarName(xNode);
        const targetStr = t ? astToLatex({ type: 'Name', id: t }) : 'f(x)';
        return {
          pattern: 'relu',
          equationName: 'Rectified Linear Unit (ReLU)',
          latex: `${targetStr} = \\max(0, ${astToLatex(xNode)})`,
          explanation: {
            title: 'Rectified Linear Unit Activation',
            category: 'Deep Learning',
            summary: 'Computes piece-wise linear activation thresholded at 0: f(x) = max(0, x).',
            mathDomain: 'x \\in \\mathbb{R} \\implies f(x) \\ge 0',
            detectedPattern: 'relu',
            assumptions: ['Non-saturating for x > 0', 'Derivative is 1 for x > 0 and 0 for x < 0'],
            operationMappings: [
              { pythonSyntax: `${callee}(0, ${xName})`, mathSymbol: '\\max(0, x)', latexEquivalent: `\\max(0, ${astToLatex(xNode)})`, explanation: 'Zero-clipping activation threshold' }
            ],
            variableMappings: [
              { pythonVariable: xName, mathSymbol: astToLatex(xNode), role: 'Pre-activation input scalar or tensor', isInferred: true }
            ],
            limitations: ['Dying ReLU problem if pre-activations remain permanently negative']
          }
        };
      }
    }
  }
  if (t === 'relu' || fn === 'relu') {
    return {
      pattern: 'relu',
      equationName: 'Rectified Linear Unit (ReLU)',
      latex: 'f(x) = \\max(0, x)',
      explanation: {
        title: 'Rectified Linear Unit Activation',
        category: 'Deep Learning',
        summary: 'Identified from semantic function or target identifier naming.',
        mathDomain: 'x \\in \\mathbb{R} \\implies f(x) \\in [0, \\infty)',
        detectedPattern: 'relu',
        assumptions: ['Sub-gradient defined at 0'],
        operationMappings: [
          { pythonSyntax: 'max(0, x)', mathSymbol: '\\max(0, x)', latexEquivalent: '\\max(0, x)', explanation: 'Thresholding at 0' }
        ],
        variableMappings: [],
        limitations: ['Non-differentiable at exact origin x = 0']
      }
    };
  }
  return null;
}

// ==========================================
// 2. SOFTMAX
// ==========================================
function checkSoftmax(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  if (ast.type === 'BinaryOp' && ast.op === '/') {
    const isNumExp = isExpCall(ast.left) || (ast.left.type === 'Name' && ast.left.id.includes('exp'));
    const isDenomSumExp = isSumCall(ast.right) || (ast.right.type === 'Call' && isExpCall(ast.right.args[0]));
    if (isNumExp && isDenomSumExp) {
      return {
        pattern: 'softmax',
        equationName: 'Softmax Probability Distribution',
        latex: '\\sigma(\\mathbf{z})_i = \\frac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}',
        explanation: {
          title: 'Softmax Normalization Function',
          category: 'Deep Learning',
          summary: 'Exponentiates logit vector and normalizes across components to sum to 1.',
          mathDomain: '\\mathbf{z} \\in \\mathbb{R}^K \\implies \\sigma(\\mathbf{z}) \\in \\Delta^{K-1}',
          detectedPattern: 'softmax',
          assumptions: ['Outputs are strictly positive probabilities summing to 1'],
          operationMappings: [
            { pythonSyntax: 'np.exp(z) / np.sum(...)', mathSymbol: '\\frac{e^{z_i}}{\\sum e^{z_j}}', latexEquivalent: '\\frac{e^{z_i}}{\\sum_j e^{z_j}}', explanation: 'Normalized exponential operator' }
          ],
          variableMappings: [
            { pythonVariable: 'z', mathSymbol: '\\mathbf{z}', role: 'Unnormalized logit vector (K-dimensional)', isInferred: true }
          ],
          limitations: ['Requires subtraction of max(z) in practice to prevent float overflow']
        }
      };
    }
  }
  if (t === 'softmax' || fn === 'softmax' || t === 'probs') {
    return {
      pattern: 'softmax',
      equationName: 'Softmax Probability Distribution',
      latex: '\\sigma(\\mathbf{z})_i = \\frac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}',
      explanation: {
        title: 'Softmax Distribution',
        category: 'Deep Learning',
        summary: 'Inferred from variable/function naming semantic.',
        mathDomain: '\\mathbf{z} \\in \\mathbb{R}^K',
        detectedPattern: 'softmax',
        assumptions: ['Partitions total probability mass across K mutually exclusive classes'],
        operationMappings: [
          { pythonSyntax: 'np.exp(z) / np.sum(np.exp(z))', mathSymbol: '\\sigma(\\mathbf{z})_i', latexEquivalent: '\\frac{e^{z_i}}{\\sum e^{z_j}}', explanation: 'Exponential logit normalization' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }
  return null;
}

// ==========================================
// 3. DOT PRODUCT
// ==========================================
function checkDotProduct(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  if (ast.type === 'Call') {
    const callee = getCalleeString(ast.callee);
    if ((callee === 'dot' || callee === 'np.dot') && ast.args.length === 2) {
      const a = ast.args[0];
      const b = ast.args[1];
      const targetStr = t ? `${astToLatex({ type: 'Name', id: t })} = ` : '';
      return {
        pattern: 'dot_product',
        equationName: 'Vector Dot Product (Inner Product)',
        latex: `${targetStr}\\mathbf{${extractVarName(a)}} \\cdot \\mathbf{${extractVarName(b)}} = \\sum_{i=1}^{n} ${extractVarName(a)}_i ${extractVarName(b)}_i`,
        explanation: {
          title: 'Vector Dot Product',
          category: 'Linear Algebra',
          summary: 'Evaluates standard Euclidean inner product mapping two 1D coordinate vectors to a scalar.',
          mathDomain: '\\mathbf{x}, \\mathbf{w} \\in \\mathbb{R}^n \\implies \\mathbf{x} \\cdot \\mathbf{w} \\in \\mathbb{R}',
          detectedPattern: 'dot_product',
          assumptions: ['Both vector inputs must share identical dimension n'],
          operationMappings: [
            { pythonSyntax: 'np.dot(x, w)', mathSymbol: '\\mathbf{x} \\cdot \\mathbf{w}', latexEquivalent: '\\mathbf{x} \\cdot \\mathbf{w}', explanation: 'Inner product summation over common index' }
          ],
          variableMappings: [
            { pythonVariable: extractVarName(a), mathSymbol: '\\mathbf{x}', role: 'First input vector', isInferred: true },
            { pythonVariable: extractVarName(b), mathSymbol: '\\mathbf{w}', role: 'Second input vector', isInferred: true }
          ],
          limitations: ['Undefined for inputs of differing dimensions']
        }
      };
    }
    if ((callee === 'sum' || callee === 'np.sum') && ast.args.length === 1) {
      const inner = ast.args[0];
      if (inner.type === 'BinaryOp' && inner.op === '*') {
        // Guard: ignore if either operand involves log (which belongs to Entropy / KL Divergence)
        const hasLog = (node: ASTNode): boolean => {
          if (node.type === 'Call') {
            const c = getCalleeString(node.callee);
            if (c.includes('log')) return true;
          }
          if (node.type === 'BinaryOp') {
            return hasLog(node.left) || hasLog(node.right);
          }
          return false;
        };
        if (hasLog(inner.left) || hasLog(inner.right)) {
          return null;
        }
        const left = inner.left;
        const right = inner.right;
        const targetStr = t ? `${astToLatex({ type: 'Name', id: t })} = ` : '';
        return {
          pattern: 'dot_product',
          equationName: 'Vector Dot Product (Inner Product)',
          latex: `${targetStr}\\sum_{i=1}^n ${astToLatex(left)}_i ${astToLatex(right)}_i`,
          explanation: {
            title: 'Vector Dot Product',
            category: 'Linear Algebra',
            summary: 'Element-wise multiplication followed by full sum contraction.',
            mathDomain: '\\mathbb{R}^n',
            detectedPattern: 'dot_product',
            assumptions: ['Vectors of equal length'],
            operationMappings: [
              { pythonSyntax: 'np.sum(x * w)', mathSymbol: '\\sum x_i w_i', latexEquivalent: '\\sum x_i w_i', explanation: 'Inner contraction' }
            ],
            variableMappings: [],
            limitations: []
          }
        };
      }
    }
  }
  if (t === 'dot' || t === 'dot_product' || fn === 'dot_product') {
    return {
      pattern: 'dot_product',
      equationName: 'Vector Dot Product (Inner Product)',
      latex: '\\mathbf{x} \\cdot \\mathbf{w} = \\sum_{i=1}^{n} x_i w_i',
      explanation: {
        title: 'Vector Dot Product',
        category: 'Linear Algebra',
        summary: 'Inferred from target variable or function name.',
        mathDomain: '\\mathbb{R}^n',
        detectedPattern: 'dot_product',
        assumptions: ['Vectors must share same 1D length'],
        operationMappings: [
          { pythonSyntax: 'np.dot(x, w)', mathSymbol: '\\mathbf{x} \\cdot \\mathbf{w}', latexEquivalent: '\\sum x_i w_i', explanation: 'Vector dot product' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }
  return null;
}

// ==========================================
// 4. EUCLIDEAN DISTANCE
// ==========================================
function checkEuclideanDistance(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  if (ast.type === 'Call') {
    const callee = getCalleeString(ast.callee);
    if (callee === 'sqrt' || callee === 'np.sqrt' || callee === 'math.sqrt') {
      const inner = ast.args[0];
      if (inner && (isSumCall(inner) || (inner.type === 'Call' && getCalleeString(inner.callee).includes('sum')))) {
        const sumArg = (inner as CallNode).args[0];
        if (sumArg && sumArg.type === 'BinaryOp' && sumArg.op === '**' && isTwo(sumArg.right)) {
          const base = sumArg.left;
          if (base.type === 'BinaryOp' && base.op === '-') {
            const xVar = extractVarName(base.left);
            const yVar = extractVarName(base.right);
            const targetStr = t ? `${astToLatex({ type: 'Name', id: t })} = ` : '';
            return {
              pattern: 'euclidean_distance',
              equationName: 'Euclidean Distance Metric',
              latex: `${targetStr}d(\\mathbf{${xVar}}, \\mathbf{${yVar}}) = \\sqrt{\\sum_{i=1}^{n} (${xVar}_i - ${yVar}_i)^2}`,
              explanation: {
                title: 'Euclidean Distance Metric',
                category: 'Linear Algebra',
                summary: 'L2 norm of the difference vector between two spatial coordinate points.',
                mathDomain: '\\mathbf{x}, \\mathbf{y} \\in \\mathbb{R}^n \\implies d(\\mathbf{x}, \\mathbf{y}) \\ge 0',
                detectedPattern: 'euclidean_distance',
                assumptions: ['Satisfies metric axioms: non-negativity, identity of indiscernibles, symmetry, triangle inequality'],
                operationMappings: [
                  { pythonSyntax: 'np.sqrt(np.sum((x - y)**2))', mathSymbol: '\\|x - y\\|_2', latexEquivalent: '\\sqrt{\\sum (x_i - y_i)^2}', explanation: 'Pythagorean geometric distance' }
                ],
                variableMappings: [
                  { pythonVariable: xVar, mathSymbol: '\\mathbf{x}', role: 'First observation vector', isInferred: true },
                  { pythonVariable: yVar, mathSymbol: '\\mathbf{y}', role: 'Second observation vector', isInferred: true }
                ],
                limitations: ['Sensitive to feature scale disparities across dimensions']
              }
            };
          }
        }
      }
    }
    if ((callee === 'norm' || callee === 'np.linalg.norm') && ast.args.length >= 1) {
      const arg = ast.args[0];
      if (arg.type === 'BinaryOp' && arg.op === '-') {
        const xVar = extractVarName(arg.left);
        const yVar = extractVarName(arg.right);
        return {
          pattern: 'euclidean_distance',
          equationName: 'Euclidean Distance Metric',
          latex: `d(\\mathbf{${xVar}}, \\mathbf{${yVar}}) = \\|\\mathbf{${xVar}} - \\mathbf{${yVar}}\\|_2 = \\sqrt{\\sum_{i=1}^n (${xVar}_i - ${yVar}_i)^2}`,
          explanation: {
            title: 'Euclidean Distance Metric',
            category: 'Linear Algebra',
            summary: 'Evaluates vector norm of subtraction difference.',
            mathDomain: '\\mathbb{R}^n',
            detectedPattern: 'euclidean_distance',
            assumptions: ['Finite real coordinates'],
            operationMappings: [
              { pythonSyntax: 'np.linalg.norm(x - y)', mathSymbol: '\\|x - y\\|_2', latexEquivalent: '\\|\\mathbf{x} - \\mathbf{y}\\|_2', explanation: 'Vector difference norm' }
            ],
            variableMappings: [],
            limitations: []
          }
        };
      }
    }
  }
  if (t === 'dist' || t === 'distance' || fn === 'euclidean_distance') {
    return {
      pattern: 'euclidean_distance',
      equationName: 'Euclidean Distance Metric',
      latex: 'd(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_{i=1}^{n} (x_i - y_i)^2}',
      explanation: {
        title: 'Euclidean Distance',
        category: 'Linear Algebra',
        summary: 'Inferred from target distance naming.',
        mathDomain: '\\mathbb{R}^n',
        detectedPattern: 'euclidean_distance',
        assumptions: [],
        operationMappings: [
          { pythonSyntax: 'np.sqrt(np.sum((x - y)**2))', mathSymbol: 'd(x, y)', latexEquivalent: '\\sqrt{\\sum (x_i - y_i)^2}', explanation: 'Geometric Euclidean distance' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }
  return null;
}

// ==========================================
// 5. BINARY CROSS-ENTROPY
// ==========================================
function checkBinaryCrossEntropy(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  if (t === 'entropy' || t === 'h' || fn === 'entropy') {
    return null;
  }

  const isBceName = t === 'bce' || t === 'cross_entropy' || t === 'log_loss' || fn === 'binary_cross_entropy';
  const hasLog = hasCalleePattern(ast, (c) => c.includes('log'));
  const hasOneMinus = hasOneMinusPattern(ast);

  if (hasLog && (hasOneMinus || isBceName)) {
    return {
      pattern: 'binary_cross_entropy',
      equationName: 'Binary Cross-Entropy Loss (Log Loss)',
      latex: '\\mathcal{L}_{BCE} = -\\frac{1}{n} \\sum_{i=1}^{n} \\left[ y_i \\log(p_i) + (1 - y_i) \\log(1 - p_i) \\right]',
      explanation: {
        title: 'Binary Cross-Entropy Loss',
        category: 'Deep Learning',
        summary: 'Measures divergence between ground-truth binary targets and predicted probabilities.',
        mathDomain: 'y \\in \\{0, 1\\}, p \\in (0, 1)',
        detectedPattern: 'binary_cross_entropy',
        assumptions: ['Bernoulli likelihood model', 'Probabilities strictly bounded within (0, 1)'],
        operationMappings: [
          { pythonSyntax: '-(y * np.log(p) + (1 - y) * np.log(1 - p))', mathSymbol: '\\mathcal{L}', latexEquivalent: '-[y \\ln(p) + (1-y)\\ln(1-p)]', explanation: 'Negative log-likelihood of Bernoulli distribution' }
        ],
        variableMappings: [
          { pythonVariable: 'y', mathSymbol: 'y_i', role: 'Binary ground truth target label (0 or 1)', isInferred: true },
          { pythonVariable: 'p', mathSymbol: 'p_i', role: 'Predicted probability of positive class', isInferred: true }
        ],
        limitations: ['Approaches infinity as p approaches 0 or 1 incorrectly; requires epsilon clipping']
      }
    };
  }
  return null;
}

function hasOneMinusPattern(node: ASTNode): boolean {
  let found = false;
  function walk(n: ASTNode) {
    if (found) return;
    if (n.type === 'BinaryOp') {
      if (n.op === '-' && isOne(n.left)) {
        found = true;
        return;
      }
      walk(n.left);
      walk(n.right);
    } else if (n.type === 'UnaryOp') {
      walk(n.operand);
    } else if (n.type === 'Call') {
      n.args.forEach(walk);
    }
  }
  walk(node);
  return found;
}

// ==========================================
// 6. MEAN SQUARED ERROR (MSE)
// ==========================================
function checkMse(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isMseName = t === 'mse' || t === 'mean_squared_error' || fn === 'mse' || fn === 'mean_squared_error';

  if (ast.type === 'Call') {
    const callee = getCalleeString(ast.callee);
    if (callee === 'mean' || callee === 'np.mean') {
      const inner = ast.args[0];
      if (inner && inner.type === 'BinaryOp' && inner.op === '**' && isTwo(inner.right)) {
        return createMseResult(inner.left);
      }
    }
  }

  if (ast.type === 'BinaryOp' && ast.op === '/') {
    if (isSumCall(ast.left)) {
      const inner = (ast.left as CallNode).args[0];
      if (inner && inner.type === 'BinaryOp' && inner.op === '**' && isTwo(inner.right)) {
        return createMseResult(inner.left);
      }
    }
  }

  if (isMseName) {
    return {
      pattern: 'mean_squared_error',
      equationName: 'Mean Squared Error (MSE Loss)',
      latex: '\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2',
      explanation: {
        title: 'Mean Squared Error Loss',
        category: 'Machine Learning',
        summary: 'Inferred from variable or function naming.',
        mathDomain: 'y, \\hat{y} \\in \\mathbb{R}^n',
        detectedPattern: 'mean_squared_error',
        assumptions: ['Quadratic loss function'],
        operationMappings: [
          { pythonSyntax: 'np.mean((y - y_hat)**2)', mathSymbol: '\\text{MSE}', latexEquivalent: '\\frac{1}{n}\\sum (y_i - \\hat{y}_i)^2', explanation: 'Mean squared prediction residual' }
        ],
        variableMappings: [],
        limitations: ['Sensitive to heavy outliers']
      }
    };
  }

  return null;
}

function createMseResult(diffNode: ASTNode): RecognitionResult {
  let yVar = 'y';
  let yHatVar = '\\hat{y}';
  if (diffNode.type === 'BinaryOp' && diffNode.op === '-') {
    yVar = extractVarName(diffNode.left);
    yHatVar = extractVarName(diffNode.right);
  }
  return {
    pattern: 'mean_squared_error',
    equationName: 'Mean Squared Error (MSE Loss)',
    latex: `\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^{n} (${yVar}_i - ${yHatVar}_i)^2`,
    explanation: {
      title: 'Mean Squared Error Loss',
      category: 'Machine Learning',
      summary: 'Averages the squared residuals between actual and predicted responses.',
      mathDomain: 'y, \\hat{y} \\in \\mathbb{R}^n \\implies \\text{MSE} \\ge 0',
      detectedPattern: 'mean_squared_error',
      assumptions: ['Residuals assumed to follow zero-mean Gaussian distribution under maximum likelihood'],
      operationMappings: [
        { pythonSyntax: 'np.mean((y - y_hat) ** 2)', mathSymbol: '\\frac{1}{n}\\sum (y_i - \\hat{y}_i)^2', latexEquivalent: '\\frac{1}{n}\\sum (y_i - \\hat{y}_i)^2', explanation: 'Mean squared residual penalty' }
      ],
      variableMappings: [
        { pythonVariable: yVar, mathSymbol: yVar, role: 'Observed response target vector', isInferred: true },
        { pythonVariable: yHatVar, mathSymbol: yHatVar, role: 'Model prediction response vector', isInferred: true }
      ],
      limitations: ['Magnifies large residual outliers quad-fold due to squaring']
    }
  };
}

// ==========================================
// 7. MEAN ABSOLUTE ERROR (MAE)
// ==========================================
function checkMae(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isMaeName = t === 'mae' || t === 'mean_absolute_error' || fn === 'mae';

  if (ast.type === 'Call') {
    const callee = getCalleeString(ast.callee);
    if (callee === 'mean' || callee === 'np.mean') {
      const inner = ast.args[0];
      if (inner && isAbsCall(inner)) {
        return createMaeResult(inner);
      }
    }
  }

  if (ast.type === 'BinaryOp' && ast.op === '/') {
    if (isSumCall(ast.left)) {
      const inner = (ast.left as CallNode).args[0];
      if (inner && isAbsCall(inner)) {
        return createMaeResult(inner);
      }
    }
  }

  if (isMaeName) {
    return {
      pattern: 'mean_absolute_error',
      equationName: 'Mean Absolute Error (MAE Loss)',
      latex: '\\text{MAE} = \\frac{1}{n} \\sum_{i=1}^{n} |y_i - \\hat{y}_i|',
      explanation: {
        title: 'Mean Absolute Error Loss',
        category: 'Machine Learning',
        summary: 'Inferred from identifier naming.',
        mathDomain: '\\mathbb{R}^n',
        detectedPattern: 'mean_absolute_error',
        assumptions: ['Robust L1 metric'],
        operationMappings: [
          { pythonSyntax: 'np.mean(np.abs(y - y_hat))', mathSymbol: '\\text{MAE}', latexEquivalent: '\\frac{1}{n}\\sum |y_i - \\hat{y}_i|', explanation: 'Mean absolute prediction error' }
        ],
        variableMappings: [],
        limitations: ['Non-differentiable at origin']
      }
    };
  }
  return null;
}

function createMaeResult(absNode: ASTNode): RecognitionResult {
  let innerVar = 'y_i - \\hat{y}_i';
  if (absNode.type === 'Call' && absNode.args[0]) {
    innerVar = astToLatex(absNode.args[0]);
  }
  return {
    pattern: 'mean_absolute_error',
    equationName: 'Mean Absolute Error (MAE Loss)',
    latex: `\\text{MAE} = \\frac{1}{n} \\sum_{i=1}^{n} |${innerVar}|`,
    explanation: {
      title: 'Mean Absolute Error Loss',
      category: 'Machine Learning',
      summary: 'Averages the absolute deviations between actual and predicted responses.',
      mathDomain: 'y, \\hat{y} \\in \\mathbb{R}^n \\implies \\text{MAE} \\ge 0',
      detectedPattern: 'mean_absolute_error',
      assumptions: ['Laplace distributed errors'],
      operationMappings: [
        { pythonSyntax: 'np.mean(np.abs(y - y_hat))', mathSymbol: '\\frac{1}{n}\\sum |y_i - \\hat{y}_i|', latexEquivalent: '\\frac{1}{n}\\sum |y_i - \\hat{y}_i|', explanation: 'Absolute residual reduction' }
      ],
      variableMappings: [],
      limitations: ['Constant gradient magnitude regardless of error scale']
    }
  };
}

// ==========================================
// 8. SAMPLE VARIANCE
// ==========================================
function checkVariance(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isVarName = t === 'variance' || t === 'var' || t === 's2' || t === 'sigma2' || fn === 'variance';

  if (ast.type === 'Call' && (getCalleeString(ast.callee) === 'np.var' || getCalleeString(ast.callee) === 'var')) {
    return {
      pattern: 'variance',
      equationName: 'Sample Variance (Bessel-Corrected)',
      latex: 's^2 = \\frac{1}{n - 1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2',
      explanation: {
        title: 'Sample Variance',
        category: 'Statistics',
        summary: 'Quantifies dispersion about the sample arithmetic mean with Bessel unbiased correction.',
        mathDomain: 'x \\in \\mathbb{R}^n \\implies s^2 \\ge 0',
        detectedPattern: 'variance',
        assumptions: ['Sample observations are independent and identically distributed'],
        operationMappings: [
          { pythonSyntax: 'np.var(x)', mathSymbol: 's^2', latexEquivalent: '\\frac{1}{n-1}\\sum (x_i - \\bar{x})^2', explanation: 'Sample variance' }
        ],
        variableMappings: [],
        limitations: ['Units are in squared coordinate measurements']
      }
    };
  }

  if (ast.type === 'BinaryOp' && ast.op === '/') {
    if (isSumCall(ast.left)) {
      const sumArg = (ast.left as CallNode).args[0];
      if (sumArg && sumArg.type === 'BinaryOp' && sumArg.op === '**' && isTwo(sumArg.right)) {
        if (!t?.includes('mse') && !t?.includes('loss')) {
          return {
            pattern: 'variance',
            equationName: 'Sample Variance (Bessel-Corrected)',
            latex: 's^2 = \\frac{1}{n - 1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2',
            explanation: {
              title: 'Sample Variance',
              category: 'Statistics',
              summary: 'Sum of squared deviations divided by degrees of freedom.',
              mathDomain: '\\mathbb{R}^n',
              detectedPattern: 'variance',
              assumptions: ['Unbiased estimator for population variance'],
              operationMappings: [
                { pythonSyntax: 'np.sum((x - mu)**2) / (n - 1)', mathSymbol: 's^2', latexEquivalent: '\\frac{1}{n-1}\\sum (x_i - \\bar{x})^2', explanation: 'Bessel-corrected sample variance' }
              ],
              variableMappings: [],
              limitations: []
            }
          };
        }
      }
    }
  }

  if (isVarName) {
    return {
      pattern: 'variance',
      equationName: 'Sample Variance (Bessel-Corrected)',
      latex: 's^2 = \\frac{1}{n - 1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2',
      explanation: {
        title: 'Sample Variance',
        category: 'Statistics',
        summary: 'Inferred from target identifier naming.',
        mathDomain: '\\mathbb{R}^n',
        detectedPattern: 'variance',
        assumptions: [],
        operationMappings: [
          { pythonSyntax: 'np.sum((x - mu)**2) / (n - 1)', mathSymbol: 's^2', latexEquivalent: '\\frac{1}{n-1}\\sum (x_i - \\bar{x})^2', explanation: 'Bessel-corrected sample variance' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }

  return null;
}

// ==========================================
// 9. COVARIANCE
// ==========================================
function checkCovariance(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isCovName = t === 'cov' || t === 'covariance' || fn === 'covariance';

  if (ast.type === 'BinaryOp' && ast.op === '/') {
    if (isSumCall(ast.left)) {
      const sumArg = (ast.left as CallNode).args[0];
      if (sumArg && sumArg.type === 'BinaryOp' && sumArg.op === '*') {
        if (isCovName || t?.includes('cov')) {
          return {
            pattern: 'covariance',
            equationName: 'Sample Covariance',
            latex: '\\operatorname{cov}(X, Y) = \\frac{1}{n - 1} \\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})',
            explanation: {
              title: 'Sample Covariance',
              category: 'Statistics',
              summary: 'Quantifies joint directional variability between two quantitative random variables.',
              mathDomain: 'X, Y \\in \\mathbb{R}^n',
              detectedPattern: 'covariance',
              assumptions: ['Paired sample observations (x_i, y_i)'],
              operationMappings: [
                { pythonSyntax: 'np.sum((x - x_bar)*(y - y_bar)) / (n - 1)', mathSymbol: '\\operatorname{cov}', latexEquivalent: '\\frac{1}{n-1}\\sum (x_i - \\bar{x})(y_i - \\bar{y})', explanation: 'Sample covariance sum' }
              ],
              variableMappings: [],
              limitations: ['Scale-dependent; does not reflect absolute strength of association']
            }
          };
        }
      }
    }
  }

  if (isCovName) {
    return {
      pattern: 'covariance',
      equationName: 'Sample Covariance',
      latex: '\\operatorname{cov}(X, Y) = \\frac{1}{n - 1} \\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})',
      explanation: {
        title: 'Sample Covariance',
        category: 'Statistics',
        summary: 'Inferred from covariance naming semantic.',
        mathDomain: '\\mathbb{R}^n',
        detectedPattern: 'covariance',
        assumptions: [],
        operationMappings: [
          { pythonSyntax: 'np.sum((x - x_bar)*(y - y_bar)) / (n - 1)', mathSymbol: '\\operatorname{cov}', latexEquivalent: '\\frac{1}{n-1}\\sum (x_i - \\bar{x})(y_i - \\bar{y})', explanation: 'Sample covariance sum' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }

  return null;
}

// ==========================================
// 10. PEARSON CORRELATION
// ==========================================
function checkPearsonCorrelation(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isCorrName = t === 'r' || t === 'corr' || t === 'correlation' || t === 'pearson' || fn === 'pearson_correlation';

  if (ast.type === 'BinaryOp' && ast.op === '/') {
    const leftName = extractVarName(ast.left).toLowerCase();
    const rightName = extractVarName(ast.right).toLowerCase();
    if (leftName.includes('cov') || rightName.includes('std') || isCorrName) {
      return {
        pattern: 'pearson_correlation',
        equationName: 'Pearson Correlation Coefficient',
        latex: 'r = \\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}} = \\frac{\\operatorname{cov}(X, Y)}{s_X s_Y}',
        explanation: {
          title: 'Pearson Product-Moment Correlation',
          category: 'Statistics',
          summary: 'Normalized measure of linear dependence strictly bounded in [-1, 1].',
          mathDomain: 'X, Y \\in \\mathbb{R}^n \\implies r \\in [-1, 1]',
          detectedPattern: 'pearson_correlation',
          assumptions: ['Linear relationship between variables', 'Both variables quantitative with non-zero variance'],
          operationMappings: [
            { pythonSyntax: 'cov / (std_x * std_y)', mathSymbol: 'r', latexEquivalent: '\\frac{\\operatorname{cov}(X, Y)}{s_X s_Y}', explanation: 'Normalized covariance quotient' }
          ],
          variableMappings: [],
          limitations: ['Only detects linear association; blind to nonlinear dependencies']
        }
      };
    }
  }

  if (isCorrName) {
    return {
      pattern: 'pearson_correlation',
      equationName: 'Pearson Correlation Coefficient',
      latex: 'r = \\frac{\\operatorname{cov}(X, Y)}{s_X s_Y}',
      explanation: {
        title: 'Pearson Correlation',
        category: 'Statistics',
        summary: 'Inferred from correlation naming.',
        mathDomain: '[-1, 1]',
        detectedPattern: 'pearson_correlation',
        assumptions: [],
        operationMappings: [
          { pythonSyntax: 'cov / (std_x * std_y)', mathSymbol: 'r', latexEquivalent: '\\frac{\\operatorname{cov}(X, Y)}{s_X s_Y}', explanation: 'Normalized correlation coefficient' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }
  return null;
}

// ==========================================
// 11. Z-SCORE STANDARDIZATION
// ==========================================
function checkZScore(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isZName = t === 'z' || t === 'z_score' || t === 'standardized' || fn === 'z_score';

  if (ast.type === 'BinaryOp' && ast.op === '/') {
    if (ast.left.type === 'BinaryOp' && ast.left.op === '-') {
      const xVar = extractVarName(ast.left.left);
      const muVar = extractVarName(ast.left.right).toLowerCase();
      const sigmaVar = extractVarName(ast.right).toLowerCase();
      if (
        isZName ||
        muVar.includes('mean') ||
        muVar.includes('mu') ||
        sigmaVar.includes('std') ||
        sigmaVar.includes('sigma')
      ) {
        return {
          pattern: 'z_score',
          equationName: 'Z-Score Standardization',
          latex: `z = \\frac{${xVar} - \\mu}{\\sigma}`,
          explanation: {
            title: 'Z-Score Standardization',
            category: 'Statistics',
            summary: 'Affine coordinate transformation scaling a distribution to mean 0 and unit variance.',
            mathDomain: 'x \\in \\mathbb{R}, \\sigma > 0 \\implies z \\in \\mathbb{R}',
            detectedPattern: 'z_score',
            assumptions: ['Standard deviation sigma must be strictly positive'],
            operationMappings: [
              { pythonSyntax: '(x - mu) / sigma', mathSymbol: 'z', latexEquivalent: '\\frac{x - \\mu}{\\sigma}', explanation: 'Mean subtraction followed by dispersion scaling' }
            ],
            variableMappings: [
              { pythonVariable: xVar, mathSymbol: 'x', role: 'Raw feature observation value', isInferred: true },
              { pythonVariable: muVar, mathSymbol: '\\mu', role: 'Arithmetic mean center of distribution', isInferred: true },
              { pythonVariable: sigmaVar, mathSymbol: '\\sigma', role: 'Standard deviation spread of distribution', isInferred: true }
            ],
            limitations: ['Undefined if sample variance is zero (constant feature)']
          }
        };
      }
    }
  }

  return null;
}

// ==========================================
// 12. GRADIENT DESCENT
// ==========================================
function checkGradientDescent(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isGdName = t === 'theta' || t === 'w' || t === 'params' || fn === 'gradient_descent' || fn === 'update_weights';

  if (ast.type === 'BinaryOp' && (ast.op === '-' || ast.op === '+')) {
    const right = ast.right;
    if (right.type === 'BinaryOp' && right.op === '*') {
      const lrName = extractVarName(right.left).toLowerCase();
      const gradName = extractVarName(right.right).toLowerCase();
      if (
        lrName.includes('lr') ||
        lrName.includes('alpha') ||
        lrName.includes('eta') ||
        gradName.includes('grad') ||
        gradName.includes('dw') ||
        isGdName
      ) {
        const thetaVar = extractVarName(ast.left);
        return {
          pattern: 'gradient_descent',
          equationName: 'Gradient Descent Parameter Update',
          latex: `\\theta_{t+1} = \\theta_t - \\alpha \\nabla J(\\theta_t)`,
          explanation: {
            title: 'First-Order Gradient Descent Step',
            category: 'Optimization',
            summary: 'Iteratively shifts parameter vector in the negative direction of the loss gradient.',
            mathDomain: '\\theta \\in \\mathbb{R}^d, \\alpha > 0',
            detectedPattern: 'gradient_descent',
            assumptions: ['Objective function J is locally differentiable', 'Learning rate alpha selected to satisfy Armijo conditions'],
            operationMappings: [
              { pythonSyntax: `${thetaVar} - lr * grad`, mathSymbol: '\\theta - \\alpha \\nabla J', latexEquivalent: '\\theta_t - \\alpha \\nabla J', explanation: 'Steepest descent parameter increment' }
            ],
            variableMappings: [
              { pythonVariable: thetaVar, mathSymbol: '\\theta_t', role: 'Current parameter weight state', isInferred: true },
              { pythonVariable: extractVarName(right.left), mathSymbol: '\\alpha', role: 'Learning rate step multiplier', isInferred: true },
              { pythonVariable: extractVarName(right.right), mathSymbol: '\\nabla J', role: 'Loss gradient vector w.r.t parameters', isInferred: true }
            ],
            limitations: ['May oscillate or diverge if learning rate is excessively large']
          }
        };
      }
    }
  }

  if (fn === 'gradient_descent' || t === 'gradient_descent') {
    return {
      pattern: 'gradient_descent',
      equationName: 'Gradient Descent Parameter Update',
      latex: '\\theta_{t+1} = \\theta_t - \\alpha \\nabla J(\\theta_t)',
      explanation: {
        title: 'Gradient Descent',
        category: 'Optimization',
        summary: 'Inferred from function identifier.',
        mathDomain: '\\mathbb{R}^d',
        detectedPattern: 'gradient_descent',
        assumptions: [],
        operationMappings: [
          { pythonSyntax: 'theta - alpha * grad', mathSymbol: '\\theta_{t+1}', latexEquivalent: '\\theta_t - \\alpha \\nabla J(\\theta_t)', explanation: 'Negative gradient step update' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }

  return null;
}

// ==========================================
// 13. CLASSIFICATION PRECISION
// ==========================================
function checkPrecision(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isPrecName = t === 'precision' || t === 'prec' || fn === 'precision';

  if (ast.type === 'BinaryOp' && ast.op === '/') {
    const numName = extractVarName(ast.left).toLowerCase();
    if (ast.right.type === 'BinaryOp' && ast.right.op === '+') {
      const denomLeft = extractVarName(ast.right.left).toLowerCase();
      const denomRight = extractVarName(ast.right.right).toLowerCase();
      if (
        (numName === 'tp' && denomLeft === 'tp' && denomRight === 'fp') ||
        isPrecName
      ) {
        return {
          pattern: 'precision',
          equationName: 'Binary Classification Precision',
          latex: '\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}',
          explanation: {
            title: 'Positive Predictive Value (Precision)',
            category: 'Machine Learning',
            summary: 'Fraction of declared positive predictions that are truly positive.',
            mathDomain: '\\text{TP}, \\text{FP} \\ge 0 \\implies \\text{Precision} \\in [0, 1]',
            detectedPattern: 'precision',
            assumptions: ['Requires TP + FP > 0'],
            operationMappings: [
              { pythonSyntax: 'tp / (tp + fp)', mathSymbol: '\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}', latexEquivalent: '\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}', explanation: 'Positive predictive value ratio' }
            ],
            variableMappings: [
              { pythonVariable: 'tp', mathSymbol: '\\text{TP}', role: 'True Positives count', isInferred: true },
              { pythonVariable: 'fp', mathSymbol: '\\text{FP}', role: 'False Positives count', isInferred: true }
            ],
            limitations: ['Ignores false negatives entirely']
          }
        };
      }
    }
  }

  if (isPrecName) {
    return {
      pattern: 'precision',
      equationName: 'Binary Classification Precision',
      latex: '\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}',
      explanation: {
        title: 'Classification Precision',
        category: 'Machine Learning',
        summary: 'Inferred from identifier naming.',
        mathDomain: '[0, 1]',
        detectedPattern: 'precision',
        assumptions: [],
        operationMappings: [
          { pythonSyntax: 'tp / (tp + fp)', mathSymbol: '\\text{Precision}', latexEquivalent: '\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}', explanation: 'Positive predictive value' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }
  return null;
}

// ==========================================
// 14. CLASSIFICATION RECALL
// ==========================================
function checkRecall(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isRecName = t === 'recall' || t === 'tpr' || t === 'sensitivity' || fn === 'recall';

  if (ast.type === 'BinaryOp' && ast.op === '/') {
    const numName = extractVarName(ast.left).toLowerCase();
    if (ast.right.type === 'BinaryOp' && ast.right.op === '+') {
      const denomLeft = extractVarName(ast.right.left).toLowerCase();
      const denomRight = extractVarName(ast.right.right).toLowerCase();
      if (
        (numName === 'tp' && denomLeft === 'tp' && denomRight === 'fn') ||
        isRecName
      ) {
        return {
          pattern: 'recall',
          equationName: 'Binary Classification Recall (Sensitivity)',
          latex: '\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}',
          explanation: {
            title: 'True Positive Rate (Recall)',
            category: 'Machine Learning',
            summary: 'Fraction of actual ground truth condition positives correctly identified.',
            mathDomain: '\\text{Recall} \\in [0, 1]',
            detectedPattern: 'recall',
            assumptions: ['Requires TP + FN > 0'],
            operationMappings: [
              { pythonSyntax: 'tp / (tp + fn)', mathSymbol: '\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}', latexEquivalent: '\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}', explanation: 'Sensitivity detection ratio' }
            ],
            variableMappings: [
              { pythonVariable: 'tp', mathSymbol: '\\text{TP}', role: 'True Positives count', isInferred: true },
              { pythonVariable: 'fn', mathSymbol: '\\text{FN}', role: 'False Negatives count', isInferred: true }
            ],
            limitations: ['Can be trivially maximized to 1 by predicting all instances as positive']
          }
        };
      }
    }
  }

  if (isRecName) {
    return {
      pattern: 'recall',
      equationName: 'Binary Classification Recall (Sensitivity)',
      latex: '\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}',
      explanation: {
        title: 'Classification Recall',
        category: 'Machine Learning',
        summary: 'Inferred from identifier naming.',
        mathDomain: '[0, 1]',
        detectedPattern: 'recall',
        assumptions: [],
        operationMappings: [
          { pythonSyntax: 'tp / (tp + fn)', mathSymbol: '\\text{Recall}', latexEquivalent: '\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}', explanation: 'Sensitivity rate' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }
  return null;
}

// ==========================================
// 15. F1-SCORE
// ==========================================
function checkF1Score(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isF1Name = t === 'f1' || t === 'f1_score' || fn === 'f1_score';

  if (ast.type === 'BinaryOp' && ast.op === '/') {
    if (isF1Name || extractVarName(ast.left).includes('prec') || extractVarName(ast.right).includes('prec')) {
      return {
        pattern: 'f1_score',
        equationName: 'F1-Score Harmonic Mean',
        latex: 'F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}',
        explanation: {
          title: 'F1-Score Harmonic Mean',
          category: 'Machine Learning',
          summary: 'Harmonic mean balancing precision and recall, penalized by extreme values.',
          mathDomain: 'F_1 \\in [0, 1]',
          detectedPattern: 'f1_score',
          assumptions: ['Equal weight assigned to precision and recall'],
          operationMappings: [
            { pythonSyntax: '2 * (p * r) / (p + r)', mathSymbol: 'F_1', latexEquivalent: '2 \\cdot \\frac{PR}{P+R}', explanation: 'Harmonic mean of two positive rates' }
          ],
          variableMappings: [],
          limitations: ['Equal weighting may not match asymmetric cost matrices']
        }
      };
    }
  }

  if (isF1Name) {
    return {
      pattern: 'f1_score',
      equationName: 'F1-Score Harmonic Mean',
      latex: 'F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}',
      explanation: {
        title: 'F1-Score',
        category: 'Machine Learning',
        summary: 'Inferred from F1 naming.',
        mathDomain: '[0, 1]',
        detectedPattern: 'f1_score',
        assumptions: [],
        operationMappings: [
          { pythonSyntax: '2 * (p * r) / (p + r)', mathSymbol: 'F_1', latexEquivalent: '2 \\cdot \\frac{PR}{P+R}', explanation: 'Harmonic mean of precision and recall' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }
  return null;
}

// ==========================================
// 16. CHAIN RULE
// ==========================================
function checkChainRule(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isChainName = t === 'dz_dx' || t === 'dy_dx' || fn === 'chain_rule';

  if (ast.type === 'BinaryOp' && ast.op === '*') {
    const leftName = extractVarName(ast.left).toLowerCase();
    const rightName = extractVarName(ast.right).toLowerCase();
    if ((leftName.startsWith('d') && rightName.startsWith('d')) || isChainName) {
      return {
        pattern: 'chain_rule',
        equationName: 'Multivariate Chain Rule',
        latex: '\\frac{dz}{dx} = \\frac{\\partial z}{\\partial u} \\frac{du}{dx}',
        explanation: {
          title: 'Calculus Derivative Chain Rule',
          category: 'Information Theory / Calculus',
          summary: 'Evaluates the total derivative of composite functions via intermediate variable contraction.',
          mathDomain: 'z = f(u(x)) \\implies \\frac{dz}{dx} = f\'(u) u\'(x)',
          detectedPattern: 'chain_rule',
          assumptions: ['All constituent functions are locally differentiable'],
          operationMappings: [
            { pythonSyntax: 'df_du * du_dx', mathSymbol: '\\frac{dz}{du}\\frac{du}{dx}', latexEquivalent: '\\frac{\\partial z}{\\partial u} \\frac{du}{dx}', explanation: 'Composition of local rate changes' }
          ],
          variableMappings: [],
          limitations: ['Requires tracking intermediate variables across computation graph']
        }
      };
    }
  }

  if (isChainName) {
    return {
      pattern: 'chain_rule',
      equationName: 'Multivariate Chain Rule',
      latex: '\\frac{dz}{dx} = \\frac{\\partial z}{\\partial u} \\frac{du}{dx}',
      explanation: {
        title: 'Chain Rule',
        category: 'Information Theory / Calculus',
        summary: 'Inferred from composite derivative naming.',
        mathDomain: '\\mathbb{R}',
        detectedPattern: 'chain_rule',
        assumptions: [],
        operationMappings: [
          { pythonSyntax: 'df_du * du_dx', mathSymbol: '\\frac{dz}{dx}', latexEquivalent: '\\frac{\\partial z}{\\partial u}\\frac{du}{dx}', explanation: 'Intermediate variable rate composition' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }
  return null;
}

// ==========================================
// 17. L1 LASSO REGULARIZATION
// ==========================================
function checkL1Regularization(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isL1Name = t === 'l1' || t === 'l1_penalty' || t === 'lasso' || fn === 'l1_regularization';

  if (ast.type === 'BinaryOp' && ast.op === '*') {
    if (hasAbsSumCall(ast.right) || hasAbsSumCall(ast.left) || isL1Name) {
      return {
        pattern: 'l1_regularization',
        equationName: 'L1 Lasso Regularization Penalty',
        latex: 'R_{L1}(\\mathbf{w}) = \\lambda \\sum_{j=1}^{d} |w_j|',
        explanation: {
          title: 'L1 Lasso Regularization Penalty',
          category: 'Machine Learning',
          summary: 'Adds sum of absolute weight values scaled by regularization coefficient lambda.',
          mathDomain: '\\mathbf{w} \\in \\mathbb{R}^d, \\lambda \\ge 0 \\implies R_{L1}(\\mathbf{w}) \\ge 0',
          detectedPattern: 'l1_regularization',
          assumptions: ['Drives non-informative feature weights strictly to zero (sparse solutions)'],
          operationMappings: [
            { pythonSyntax: 'lambda_val * np.sum(np.abs(w))', mathSymbol: '\\lambda \\sum |w_j|', latexEquivalent: '\\lambda \\|\\mathbf{w}\\|_1', explanation: 'L1 norm regularization factor' }
          ],
          variableMappings: [
            { pythonVariable: 'w', mathSymbol: '\\mathbf{w}', role: 'Model parameter weights vector', isInferred: true },
            { pythonVariable: 'lambda_val', mathSymbol: '\\lambda', role: 'Regularization penalty strength coefficient', isInferred: true }
          ],
          limitations: ['Non-differentiable at w_j = 0; requires subgradient optimization']
        }
      };
    }
  }

  if (isL1Name) {
    return {
      pattern: 'l1_regularization',
      equationName: 'L1 Lasso Regularization Penalty',
      latex: 'R_{L1}(\\mathbf{w}) = \\lambda \\sum_{j=1}^{d} |w_j|',
      explanation: {
        title: 'L1 Regularization',
        category: 'Machine Learning',
        summary: 'Inferred from L1 naming.',
        mathDomain: '\\mathbb{R}^d',
        detectedPattern: 'l1_regularization',
        assumptions: [],
        operationMappings: [
          { pythonSyntax: 'lambda_val * np.sum(np.abs(w))', mathSymbol: 'R_{L1}', latexEquivalent: '\\lambda \\sum |w_j|', explanation: 'L1 norm sparsity regularizer' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }
  return null;
}

// ==========================================
// 18. L2 RIDGE REGULARIZATION
// ==========================================
function checkL2Regularization(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isL2Name = t === 'l2' || t === 'l2_penalty' || t === 'ridge' || fn === 'l2_regularization';

  if (ast.type === 'BinaryOp' && ast.op === '*') {
    if (hasSumSquareCall(ast.right) || hasSumSquareCall(ast.left) || isL2Name) {
      return {
        pattern: 'l2_regularization',
        equationName: 'L2 Ridge Regularization Penalty',
        latex: 'R_{L2}(\\mathbf{w}) = \\frac{\\lambda}{2} \\sum_{j=1}^{d} w_j^2',
        explanation: {
          title: 'L2 Ridge Regularization Penalty',
          category: 'Machine Learning',
          summary: 'Penalizes large weights via quadratic norm shrinkage scaled by lambda / 2.',
          mathDomain: '\\mathbf{w} \\in \\mathbb{R}^d \\implies R_{L2}(\\mathbf{w}) \\ge 0',
          detectedPattern: 'l2_regularization',
          assumptions: ['Smoothly differentiable everywhere w.r.t parameters'],
          operationMappings: [
            { pythonSyntax: '0.5 * lambda_val * np.sum(w ** 2)', mathSymbol: '\\frac{\\lambda}{2}\\|w\\|_2^2', latexEquivalent: '\\frac{\\lambda}{2} \\sum w_j^2', explanation: 'Quadratic shrinkage regularizer' }
          ],
          variableMappings: [
            { pythonVariable: 'w', mathSymbol: '\\mathbf{w}', role: 'Model parameter weights vector', isInferred: true }
          ],
          limitations: ['Shrinks weights continuously toward zero without producing exact sparsity']
        }
      };
    }
  }

  if (isL2Name) {
    return {
      pattern: 'l2_regularization',
      equationName: 'L2 Ridge Regularization Penalty',
      latex: 'R_{L2}(\\mathbf{w}) = \\frac{\\lambda}{2} \\sum_{j=1}^{d} w_j^2',
      explanation: {
        title: 'L2 Regularization',
        category: 'Machine Learning',
        summary: 'Inferred from L2 naming.',
        mathDomain: '\\mathbb{R}^d',
        detectedPattern: 'l2_regularization',
        assumptions: [],
        operationMappings: [
          { pythonSyntax: '0.5 * lambda_val * np.sum(w**2)', mathSymbol: 'R_{L2}', latexEquivalent: '\\frac{\\lambda}{2}\\sum w_j^2', explanation: 'L2 norm quadratic regularizer' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }
  return null;
}

// ==========================================
// 19. SHANNON ENTROPY
// ==========================================
function checkEntropy(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isEntropyName = t === 'h' || t === 'entropy' || fn === 'entropy';

  if (ast.type === 'UnaryOp' && ast.op === '-') {
    if (hasCalleePattern(ast.operand, (c) => c.includes('log') || c.includes('sum'))) {
      if (isEntropyName || !t?.includes('bce')) {
        return {
          pattern: 'entropy',
          equationName: 'Shannon Information Entropy',
          latex: 'H(X) = -\\sum_{i=1}^{n} P(x_i) \\log_2 P(x_i)',
          explanation: {
            title: 'Shannon Information Entropy',
            category: 'Information Theory',
            summary: 'Quantifies expected information surprise or uncertainty in bits.',
            mathDomain: 'P(x_i) \\in [0, 1], \\sum P(x_i) = 1 \\implies H(X) \\ge 0',
            detectedPattern: 'entropy',
            assumptions: ['0 log(0) = 0 by convention'],
            operationMappings: [
              { pythonSyntax: '-np.sum(p * np.log2(p))', mathSymbol: 'H(X)', latexEquivalent: '-\\sum P(x_i) \\log_2 P(x_i)', explanation: 'Negative expected log probability' }
            ],
            variableMappings: [
              { pythonVariable: 'p', mathSymbol: 'P(x_i)', role: 'Discrete probability mass distribution', isInferred: true }
            ],
            limitations: ['Requires probabilities to be normalized and strictly non-negative']
          }
        };
      }
    }
  }

  if (isEntropyName) {
    return {
      pattern: 'entropy',
      equationName: 'Shannon Information Entropy',
      latex: 'H(X) = -\\sum_{i=1}^{n} P(x_i) \\log_2 P(x_i)',
      explanation: {
        title: 'Shannon Entropy',
        category: 'Information Theory',
        summary: 'Inferred from entropy naming.',
        mathDomain: '[0, \\log_2(n)]',
        detectedPattern: 'entropy',
        assumptions: [],
        operationMappings: [
          { pythonSyntax: '-np.sum(p * np.log2(p))', mathSymbol: 'H(X)', latexEquivalent: '-\\sum P(x_i) \\log_2 P(x_i)', explanation: 'Shannon entropy expectation' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }
  return null;
}

// ==========================================
// 20. KL DIVERGENCE
// ==========================================
function checkKlDivergence(ast: ASTNode, t?: string, fn?: string): RecognitionResult | null {
  const isKlName = t === 'kl' || t === 'kl_div' || t === 'kl_divergence' || fn === 'kl_divergence';

  if (isSumCall(ast) || hasCalleePattern(ast, (c) => c.includes('sum'))) {
    if (hasCalleePattern(ast, (c) => c.includes('log')) && (isKlName || t?.includes('kl'))) {
      return {
        pattern: 'kl_divergence',
        equationName: 'Kullback-Leibler (KL) Divergence',
        latex: 'D_{\\text{KL}}(P \\parallel Q) = \\sum_{i=1}^{n} P(x_i) \\log \\left( \\frac{P(x_i)}{Q(x_i)} \\right)',
        explanation: {
          title: 'Kullback-Leibler Relative Entropy',
          category: 'Information Theory',
          summary: 'Quantifies information loss when approximating true distribution P with model Q.',
          mathDomain: 'D_{\\text{KL}}(P \\parallel Q) \\ge 0 \\text{ (Gibbs inequality)}',
          detectedPattern: 'kl_divergence',
          assumptions: ['P must be absolutely continuous w.r.t Q (Q(x) = 0 implies P(x) = 0)'],
          operationMappings: [
            { pythonSyntax: 'np.sum(p * np.log(p / q))', mathSymbol: 'D_{KL}', latexEquivalent: '\\sum P \\ln(P/Q)', explanation: 'Log-likelihood ratio expectation' }
          ],
          variableMappings: [
            { pythonVariable: 'p', mathSymbol: 'P(x_i)', role: 'True reference probability distribution', isInferred: true },
            { pythonVariable: 'q', mathSymbol: 'Q(x_i)', role: 'Approximating candidate distribution', isInferred: true }
          ],
          limitations: ['Asymmetric: D_KL(P || Q) != D_KL(Q || P); not a formal distance metric']
        }
      };
    }
  }

  if (isKlName) {
    return {
      pattern: 'kl_divergence',
      equationName: 'Kullback-Leibler (KL) Divergence',
      latex: 'D_{\\text{KL}}(P \\parallel Q) = \\sum_{i=1}^{n} P(x_i) \\log \\left( \\frac{P(x_i)}{Q(x_i)} \\right)',
      explanation: {
        title: 'KL Divergence',
        category: 'Information Theory',
        summary: 'Inferred from KL naming.',
        mathDomain: '[0, \\infty)',
        detectedPattern: 'kl_divergence',
        assumptions: [],
        operationMappings: [
          { pythonSyntax: 'np.sum(p * np.log(p / q))', mathSymbol: 'D_{KL}', latexEquivalent: '\\sum P \\log(P/Q)', explanation: 'Kullback-Leibler relative divergence' }
        ],
        variableMappings: [],
        limitations: []
      }
    };
  }
  return null;
}

// ==========================================
// PREDICATES & AST UTILITIES
// ==========================================
function isZero(node: ASTNode): boolean {
  return node.type === 'Number' && (node.value === 0 || node.value === 0.0);
}

function isTwo(node: ASTNode): boolean {
  return node.type === 'Number' && (node.value === 2 || node.value === 2.0);
}

function isOne(node: ASTNode): boolean {
  if (node.type === 'Number' && (node.value === 1 || node.value === 1.0)) {
    return true;
  }
  if (node.type === 'UnaryOp' && node.op === '+' && isOne(node.operand)) return true;
  return false;
}

function isExpCall(node: ASTNode): boolean {
  if (node.type !== 'Call') return false;
  const callee = getCalleeString(node.callee);
  return callee === 'exp' || callee === 'np.exp' || callee === 'math.exp';
}

function isSumCall(node: ASTNode): boolean {
  if (node.type !== 'Call') return false;
  const callee = getCalleeString(node.callee);
  return callee === 'sum' || callee === 'np.sum';
}

function isAbsCall(node: ASTNode): boolean {
  if (node.type !== 'Call') return false;
  const callee = getCalleeString(node.callee);
  return callee === 'abs' || callee === 'np.abs' || callee === 'math.fabs';
}

function hasAbsSumCall(node: ASTNode): boolean {
  if (isSumCall(node)) {
    const arg = (node as CallNode).args[0];
    return arg ? isAbsCall(arg) : false;
  }
  if (node.type === 'BinaryOp') {
    return hasAbsSumCall(node.left) || hasAbsSumCall(node.right);
  }
  return false;
}

function hasSumSquareCall(node: ASTNode): boolean {
  if (isSumCall(node)) {
    const arg = (node as CallNode).args[0];
    return arg ? arg.type === 'BinaryOp' && arg.op === '**' && isTwo(arg.right) : false;
  }
  if (node.type === 'BinaryOp') {
    return hasSumSquareCall(node.left) || hasSumSquareCall(node.right);
  }
  return false;
}

function hasCalleePattern(node: ASTNode, test: (callee: string) => boolean): boolean {
  let matched = false;
  function walk(n: ASTNode) {
    if (matched) return;
    if (n.type === 'Call') {
      const callee = getCalleeString(n.callee);
      if (test(callee)) {
        matched = true;
        return;
      }
      n.args.forEach(walk);
    } else if (n.type === 'BinaryOp') {
      walk(n.left);
      walk(n.right);
    } else if (n.type === 'UnaryOp') {
      walk(n.operand);
    }
  }
  walk(node);
  return matched;
}

function extractVarName(node: ASTNode): string {
  if (node.type === 'Name') return node.id;
  if (node.type === 'Attribute') return `${extractVarName(node.value)}.${node.attr}`;
  if (node.type === 'Subscript') return `${extractVarName(node.value)}[${extractVarName(node.slice)}]`;
  return 'x';
}
