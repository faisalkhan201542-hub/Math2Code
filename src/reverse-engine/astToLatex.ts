import type { ASTNode } from './types';

const GREEK_MAP: Record<string, string> = {
  alpha: '\\alpha',
  beta: '\\beta',
  gamma: '\\gamma',
  delta: '\\delta',
  epsilon: '\\epsilon',
  eps: '\\epsilon',
  zeta: '\\zeta',
  eta: '\\eta',
  theta: '\\theta',
  iota: '\\iota',
  kappa: '\\kappa',
  lambda: '\\lambda',
  mu: '\\mu',
  nu: '\\nu',
  xi: '\\xi',
  pi: '\\pi',
  rho: '\\rho',
  sigma: '\\sigma',
  tau: '\\tau',
  upsilon: '\\upsilon',
  phi: '\\phi',
  chi: '\\chi',
  psi: '\\psi',
  omega: '\\omega',
  Gamma: '\\Gamma',
  Delta: '\\Delta',
  Theta: '\\Theta',
  Lambda: '\\Lambda',
  Xi: '\\Xi',
  Pi: '\\Pi',
  Sigma: '\\Sigma',
  Upsilon: '\\Upsilon',
  Phi: '\\Phi',
  Psi: '\\Psi',
  Omega: '\\Omega'
};

const OP_PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '//': 2,
  '%': 2,
  '@': 2,
  '**': 3
};

export function astToLatex(node: ASTNode, parentPrecedence = 0): string {
  switch (node.type) {
    case 'Number': {
      // If float like 3.14159 or integer
      return node.raw;
    }

    case 'Name': {
      const id = node.id;
      // Hat notation: y_hat, y_pred, x_hat
      if (id === 'y_hat' || id === 'y_pred') {
        return '\\hat{y}';
      }
      if (id === 'x_hat') {
        return '\\hat{x}';
      }
      if (id === 'theta_hat') {
        return '\\hat{\\theta}';
      }

      // Greek letters
      if (GREEK_MAP[id]) {
        return GREEK_MAP[id];
      }

      // Handle underscores: x_1 -> x_1, state_0 -> \text{state}_0
      if (id.includes('_')) {
        const parts = id.split('_');
        const base = GREEK_MAP[parts[0]] || (parts[0].length === 1 ? parts[0] : `\\text{${parts[0]}}`);
        const sub = parts.slice(1).join('_');
        return `${base}_{${sub}}`;
      }

      // Single character variable: x, y, A, B, C
      if (id.length === 1) {
        return id;
      }

      // Multi-character word: e.g. likelihood, prior, norm
      return `\\text{${id}}`;
    }

    case 'UnaryOp': {
      const operandLatex = astToLatex(node.operand, 2.5);
      return `${node.op}${operandLatex}`;
    }

    case 'BinaryOp': {
      const currentPrec = OP_PRECEDENCE[node.op] || 0;

      // 1. Division -> LaTeX fraction \frac{numerator}{denominator}
      if (node.op === '/' || node.op === '//') {
        const num = astToLatex(node.left, 0);
        const den = astToLatex(node.right, 0);
        return `\\frac{${num}}{${den}}`;
      }

      // 2. Power -> LaTeX exponent base^{exponent}
      if (node.op === '**') {
        let base = astToLatex(node.left, currentPrec);
        // If left is an operation with lower precedence, wrap in parentheses
        if (node.left.type === 'BinaryOp' && OP_PRECEDENCE[(node.left as any).op] < currentPrec) {
          base = `\\left(${base}\\right)`;
        }
        const exp = astToLatex(node.right, 0);
        return `{${base}}^{${exp}}`;
      }

      // 3. Matrix multiplication (@)
      if (node.op === '@') {
        const left = astToLatex(node.left, currentPrec);
        const right = astToLatex(node.right, currentPrec);
        // Juxtaposition for matrix multiplication: AB
        const needsSpace = left.endsWith('}') || right.startsWith('\\');
        const res = needsSpace ? `${left} ${right}` : `${left}${right}`;
        return currentPrec < parentPrecedence ? `\\left(${res}\\right)` : res;
      }

      // 4. Scalar / Element-wise multiplication (*)
      if (node.op === '*') {
        const left = astToLatex(node.left, currentPrec);
        const right = astToLatex(node.right, currentPrec);

        // If both are simple names/numbers, juxtaposition: 2\sigma, AB, xy
        const needsSymbol = (
          node.left.type === 'Number' && node.right.type === 'Number'
        );
        const joiner = needsSymbol ? ' \\cdot ' : (left.endsWith('}') || right.startsWith('\\') ? ' ' : '');
        const res = `${left}${joiner}${right}`;
        return currentPrec < parentPrecedence ? `\\left(${res}\\right)` : res;
      }

      // 5. Addition and Subtraction (+, -)
      if (node.op === '+' || node.op === '-') {
        const left = astToLatex(node.left, currentPrec);
        const right = astToLatex(node.right, currentPrec + (node.op === '-' ? 0.1 : 0));
        const res = `${left} ${node.op} ${right}`;
        return currentPrec < parentPrecedence ? `\\left(${res}\\right)` : res;
      }

      // Fallback binary op
      const left = astToLatex(node.left, currentPrec);
      const right = astToLatex(node.right, currentPrec);
      return `${left} ${node.op} ${right}`;
    }

    case 'Attribute': {
      // Handle transpose: X.T -> X^T
      if (node.attr === 'T') {
        const val = astToLatex(node.value, 3);
        return `{${val}}^{T}`;
      }
      // Common library constants: np.pi -> \pi, math.pi -> \pi, np.e -> e
      if (node.attr === 'pi') {
        return '\\pi';
      }
      if (node.attr === 'e') {
        return 'e';
      }

      // If it's a module attribute like np.sqrt, the Call node will handle it, but fallback:
      return astToLatex(node.value, 0) + '.' + node.attr;
    }

    case 'Subscript': {
      const val = astToLatex(node.value, 3);
      const slice = astToLatex(node.slice, 0);
      return `${val}_{${slice}}`;
    }

    case 'Call': {
      const calleeStr = getCalleeString(node.callee);

      // Square root: np.sqrt(x), math.sqrt(x)
      if (calleeStr === 'sqrt' || calleeStr === 'np.sqrt' || calleeStr === 'math.sqrt') {
        const arg = node.args[0] ? astToLatex(node.args[0], 0) : '';
        return `\\sqrt{${arg}}`;
      }

      // Exponential: np.exp(x), math.exp(x)
      if (calleeStr === 'exp' || calleeStr === 'np.exp' || calleeStr === 'math.exp') {
        const arg = node.args[0] ? astToLatex(node.args[0], 0) : '';
        // If argument is simple, write e^{arg}, else \exp\left(arg\right)
        if (arg.length <= 4 && !arg.includes('\\frac')) {
          return `e^{${arg}}`;
        }
        return `\\exp\\left(${arg}\\right)`;
      }

      // Summation: np.sum(x), sum(x)
      if (calleeStr === 'sum' || calleeStr === 'np.sum') {
        const arg = node.args[0] ? astToLatex(node.args[0], 0) : '';
        return `\\sum_i ${arg}`;
      }

      // L2 Norm: np.linalg.norm(x)
      if (calleeStr === 'np.linalg.norm' || calleeStr === 'linalg.norm' || calleeStr === 'norm') {
        const arg = node.args[0] ? astToLatex(node.args[0], 0) : '';
        return `\\|${arg}\\|_{2}`;
      }

      // Standard trig and logarithms
      if (calleeStr === 'np.sin' || calleeStr === 'math.sin' || calleeStr === 'sin') {
        return `\\sin\\left(${node.args[0] ? astToLatex(node.args[0], 0) : ''}\\right)`;
      }
      if (calleeStr === 'np.cos' || calleeStr === 'math.cos' || calleeStr === 'cos') {
        return `\\cos\\left(${node.args[0] ? astToLatex(node.args[0], 0) : ''}\\right)`;
      }
      if (calleeStr === 'np.log' || calleeStr === 'math.log' || calleeStr === 'log') {
        return `\\ln\\left(${node.args[0] ? astToLatex(node.args[0], 0) : ''}\\right)`;
      }
      if (calleeStr === 'np.log2' || calleeStr === 'math.log2' || calleeStr === 'log2') {
        return `\\log_2\\left(${node.args[0] ? astToLatex(node.args[0], 0) : ''}\\right)`;
      }

      // Absolute value: abs(x), np.abs(x), math.fabs(x)
      if (calleeStr === 'abs' || calleeStr === 'np.abs' || calleeStr === 'math.fabs') {
        const arg = node.args[0] ? astToLatex(node.args[0], 0) : '';
        return `|${arg}|`;
      }

      // Mean: np.mean(x), mean(x)
      if (calleeStr === 'mean' || calleeStr === 'np.mean') {
        const arg = node.args[0] ? astToLatex(node.args[0], 0) : '';
        return `\\operatorname{mean}\\left(${arg}\\right)`;
      }

      // Max: max(a, b), np.maximum(a, b)
      if (calleeStr === 'max' || calleeStr === 'np.maximum') {
        const argsLatex = node.args.map((a) => astToLatex(a, 0)).join(', ');
        return `\\max\\left(${argsLatex}\\right)`;
      }

      // Dot product: np.dot(x, w), dot(x, w)
      if (calleeStr === 'dot' || calleeStr === 'np.dot') {
        const a = node.args[0] ? astToLatex(node.args[0], 0) : 'x';
        const b = node.args[1] ? astToLatex(node.args[1], 0) : 'w';
        return `${a} \\cdot ${b}`;
      }

      // Fallback call: func(arg1, arg2)
      const argsLatex = node.args.map((a) => astToLatex(a, 0)).join(', ');
      return `\\text{${calleeStr}}\\left(${argsLatex}\\right)`;
    }

    default:
      return '';
  }
}

export function getCalleeString(node: ASTNode): string {
  if (node.type === 'Name') {
    return node.id;
  }
  if (node.type === 'Attribute') {
    const parent = getCalleeString(node.value);
    return parent ? `${parent}.${node.attr}` : node.attr;
  }
  return '';
}
