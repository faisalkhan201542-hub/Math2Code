import type { ASTNode, CurveData, DomainConfig, Point } from './types';
import { parseExpression } from './parser';

/**
 * Recursively evaluate an ASTNode at a given x value.
 * Returns NaN for any mathematical singularity, undefined operation, or invalid domain.
 */
export function evaluateAST(node: ASTNode, x: number): number {
  switch (node.type) {
    case 'Number':
      return node.value;

    case 'Constant':
      return node.value;

    case 'Variable':
      if (node.name === 'x') {
        return x;
      }
      return NaN;

    case 'UnaryOp': {
      const val = evaluateAST(node.argument, x);
      if (Number.isNaN(val) || !Number.isFinite(val)) return NaN;
      return node.op === '-' ? -val : val;
    }

    case 'BinaryOp': {
      const left = evaluateAST(node.left, x);
      const right = evaluateAST(node.right, x);

      if (Number.isNaN(left) || Number.isNaN(right) || !Number.isFinite(left) || !Number.isFinite(right)) {
        return NaN;
      }

      switch (node.op) {
        case '+':
          return left + right;

        case '-':
          return left - right;

        case '*':
          return left * right;

        case '/':
          // Division by zero or extreme near-zero singularity
          if (Math.abs(right) === 0 || Math.abs(right) < 1e-15) {
            return NaN;
          }
          return left / right;

        case '^': {
          // Division by zero if base is 0 and exp < 0
          if (left === 0 && right < 0) {
            return NaN;
          }
          // Negative base with non-integer exponent produces complex number
          if (left < 0 && !Number.isInteger(right)) {
            return NaN;
          }
          const powVal = Math.pow(left, right);
          if (!Number.isFinite(powVal)) return NaN;
          return powVal;
        }

        default:
          return NaN;
      }
    }

    case 'FunctionCall': {
      const evaluatedArgs = node.args.map((arg) => evaluateAST(arg, x));
      // If any argument is NaN, result is NaN
      if (evaluatedArgs.some((v) => Number.isNaN(v) || !Number.isFinite(v))) {
        return NaN;
      }

      const fn = node.name.toLowerCase();
      const a0 = evaluatedArgs[0];

      switch (fn) {
        case 'sin':
          return Math.sin(a0);

        case 'cos':
          return Math.cos(a0);

        case 'tan': {
          // Singularity near pi/2 + k*pi where cos(x) ~ 0
          const cosVal = Math.cos(a0);
          if (Math.abs(cosVal) < 1e-14) return NaN;
          const res = Math.tan(a0);
          if (Math.abs(res) > 1e12) return NaN;
          return res;
        }

        case 'exp': {
          if (a0 > 700) return NaN; // Prevent positive overflow to infinity
          return Math.exp(a0);
        }

        case 'log':
        case 'ln': {
          // Logarithm of non-positive numbers is undefined in real numbers
          if (a0 <= 0) return NaN;
          return Math.log(a0);
        }

        case 'sqrt': {
          // Square root of negative numbers is undefined in real numbers
          if (a0 < 0) return NaN;
          return Math.sqrt(a0);
        }

        case 'abs':
          return Math.abs(a0);

        case 'sigmoid': {
          // Numerically stable sigmoid 1 / (1 + exp(-x))
          if (a0 >= 40) return 1.0;
          if (a0 <= -40) return 0.0;
          return 1.0 / (1.0 + Math.exp(-a0));
        }

        case 'gaussian': {
          // gaussian(x) or gaussian(x, mu, sigma)
          let mu = 0;
          let sigma = 1;
          if (evaluatedArgs.length >= 2) mu = evaluatedArgs[1];
          if (evaluatedArgs.length >= 3) sigma = evaluatedArgs[2];

          if (sigma <= 0) return NaN; // Scale must be strictly positive
          const z = (a0 - mu) / sigma;
          return (1.0 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
        }

        default:
          return NaN;
      }
    }

    default:
      return NaN;
  }
}

/**
 * Validate domain settings.
 */
export function validateDomain(domain: DomainConfig): { isValid: boolean; error?: string } {
  const { xMin, xMax, sampleCount } = domain;

  if (!Number.isFinite(xMin) || !Number.isFinite(xMax)) {
    return { isValid: false, error: 'Domain limits xMin and xMax must be finite numbers.' };
  }

  if (xMin >= xMax) {
    return { isValid: false, error: `Invalid domain: xMin (${xMin}) must be strictly less than xMax (${xMax}).` };
  }

  if (!Number.isInteger(sampleCount) || sampleCount < 10 || sampleCount > 5000) {
    return {
      isValid: false,
      error: `Sampling resolution (${sampleCount}) must be an integer between 10 and 5000 points.`
    };
  }

  return { isValid: true };
}

/**
 * Evaluates an expression across a given domain.
 * Generates sampled points, segments split across discontinuities, valid/invalid counts,
 * and handles any math singularities cleanly.
 */
export function evaluateCurve(
  id: string,
  name: string,
  expression: string,
  color: string,
  visible: boolean,
  domain: DomainConfig
): CurveData {
  const parseRes = parseExpression(expression);

  if (!parseRes.success || !parseRes.ast) {
    return {
      id,
      name,
      expression,
      color,
      visible,
      points: [],
      segments: [],
      validCount: 0,
      invalidCount: 0,
      minY: null,
      maxY: null,
      hasError: true,
      errorMessage: parseRes.error || 'Syntax error'
    };
  }

  const { xMin, xMax, sampleCount } = domain;
  const points: Point[] = [];
  const segments: Point[][] = [];
  let currentSegment: Point[] = [];

  let validCount = 0;
  let invalidCount = 0;
  let minY: number | null = null;
  let maxY: number | null = null;

  const step = (xMax - xMin) / (sampleCount - 1);

  for (let i = 0; i < sampleCount; i++) {
    // Avoid floating point drift at right boundary
    const x = i === sampleCount - 1 ? xMax : xMin + i * step;
    let yVal = evaluateAST(parseRes.ast, x);

    // Filter out NaN, non-finite, and unreasonable extreme values (e.g. asymptotes > 1e10)
    if (Number.isNaN(yVal) || !Number.isFinite(yVal) || Math.abs(yVal) > 1e10) {
      points.push({ x, y: null });
      invalidCount++;

      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }
    } else {
      // Clamp near-zero floating noise
      if (Math.abs(yVal) < 1e-15) yVal = 0;

      const pt: Point = { x, y: yVal };
      points.push(pt);
      currentSegment.push(pt);
      validCount++;

      if (minY === null || yVal < minY) minY = yVal;
      if (maxY === null || yVal > maxY) maxY = yVal;
    }
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  let warningMessage: string | undefined;
  if (invalidCount > 0) {
    if (validCount === 0) {
      warningMessage = `All ${invalidCount} sample points are undefined in this domain (e.g., negative square root or non-positive logarithm).`;
    } else {
      warningMessage = `${invalidCount} of ${sampleCount} points are undefined or non-finite in [${xMin}, ${xMax}] (represented as disconnected curve gaps).`;
    }
  }

  return {
    id,
    name,
    expression,
    color,
    visible,
    points,
    segments,
    validCount,
    invalidCount,
    minY,
    maxY,
    hasError: false,
    warningMessage
  };
}
