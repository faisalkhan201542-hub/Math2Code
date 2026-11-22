import { describe, it, expect } from 'vitest';
import {
  parseExpression,
  normalizeExpression,
  evaluateAST,
  evaluateCurve,
  validateDomain,
  generateCSV,
  FUNCTION_PRESETS
} from '../plot-engine';

describe('Plot Engine - Expression Normalizer & Parser', () => {
  it('normalizes f(x) and y= prefixes', () => {
    expect(normalizeExpression('f(x) = x^2')).toBe('x^2');
    expect(normalizeExpression('y = sin(x)')).toBe('sin(x)');
    expect(normalizeExpression('g(x) = exp(x)')).toBe('exp(x)');
  });

  it('normalizes LaTeX syntax into mathematical functions', () => {
    expect(normalizeExpression('\\sin(x) \\cdot \\cos(x)')).toBe('sin(x) * cos(x)');
    expect(normalizeExpression('\\frac{1}{1 + e^{-x}}')).toBe('((1)/(1 + e^(-x)))');
    expect(normalizeExpression('\\sqrt{x}')).toBe('sqrt(x)');
    expect(normalizeExpression('\\ln(x)')).toBe('ln(x)');
    expect(normalizeExpression('\\pi')).toBe('pi');
  });

  it('correctly parses polynomials and arithmetic', () => {
    const res = parseExpression('x^3 - 3*x + 2');
    expect(res.success).toBe(true);
    expect(res.ast).toBeDefined();
  });

  it('supports implicit multiplication such as 2x and 3(x+1)', () => {
    const res1 = parseExpression('2x');
    expect(res1.success).toBe(true);
    if (res1.ast) {
      expect(evaluateAST(res1.ast, 5)).toBe(10);
    }

    const res2 = parseExpression('3(x + 2)');
    expect(res2.success).toBe(true);
    if (res2.ast) {
      expect(evaluateAST(res2.ast, 4)).toBe(18);
    }
  });

  it('supports power syntax with both ^ and **', () => {
    const resCarat = parseExpression('x^2');
    const resStars = parseExpression('x**2');
    expect(resCarat.success).toBe(true);
    expect(resStars.success).toBe(true);
    if (resCarat.ast && resStars.ast) {
      expect(evaluateAST(resCarat.ast, 4)).toBe(16);
      expect(evaluateAST(resStars.ast, 4)).toBe(16);
    }
  });

  it('rejects empty expressions', () => {
    const res = parseExpression('');
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/cannot be empty/i);
  });

  it('rejects unsupported functions and variables', () => {
    const resVar = parseExpression('y + z');
    expect(resVar.success).toBe(false);
    expect(resVar.error).toMatch(/unsupported identifier/i);

    const resFn = parseExpression('unknownFunc(x)');
    expect(resFn.success).toBe(false);
    expect(resFn.error).toMatch(/unsupported identifier/i);
  });

  it('strictly rejects malicious code-like constructs without arbitrary execution', () => {
    const maliciousCases = [
      'alert(1)',
      'window.location',
      'document.cookie',
      'import("fs")',
      'process.exit(1)',
      'eval("2+2")',
      '__proto__',
      'constructor'
    ];

    for (const testCase of maliciousCases) {
      const res = parseExpression(testCase);
      expect(res.success).toBe(false);
      expect(res.ast).toBeUndefined();
    }
  });

  it('rejects syntax with mismatched parentheses', () => {
    const res = parseExpression('(x + 1');
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/parenthesis/i);
  });
});

describe('Plot Engine - Numerical Evaluation', () => {
  it('evaluates polynomial expressions accurately', () => {
    const parsed = parseExpression('2*x^3 - 4*x + 5');
    expect(parsed.success).toBe(true);
    const ast = parsed.ast!;

    expect(evaluateAST(ast, 0)).toBe(5);
    expect(evaluateAST(ast, 1)).toBe(3);
    expect(evaluateAST(ast, 2)).toBe(13);
    expect(evaluateAST(ast, -1)).toBe(7);
  });

  it('evaluates trigonometric functions sin, cos, tan', () => {
    const sinParsed = parseExpression('sin(x)');
    const cosParsed = parseExpression('cos(x)');
    expect(sinParsed.success).toBe(true);
    expect(cosParsed.success).toBe(true);

    expect(evaluateAST(sinParsed.ast!, 0)).toBeCloseTo(0, 5);
    expect(evaluateAST(sinParsed.ast!, Math.PI / 2)).toBeCloseTo(1, 5);
    expect(evaluateAST(cosParsed.ast!, 0)).toBeCloseTo(1, 5);
    expect(evaluateAST(cosParsed.ast!, Math.PI)).toBeCloseTo(-1, 5);
  });

  it('evaluates exponential and logarithm functions', () => {
    const expParsed = parseExpression('exp(x)');
    const logParsed = parseExpression('log(x)');
    expect(expParsed.success).toBe(true);
    expect(logParsed.success).toBe(true);

    expect(evaluateAST(expParsed.ast!, 0)).toBe(1);
    expect(evaluateAST(expParsed.ast!, 1)).toBeCloseTo(Math.E, 5);

    expect(evaluateAST(logParsed.ast!, 1)).toBe(0);
    expect(evaluateAST(logParsed.ast!, Math.E)).toBeCloseTo(1, 5);
  });

  it('evaluates square root accurately', () => {
    const sqrtParsed = parseExpression('sqrt(x)');
    expect(sqrtParsed.success).toBe(true);
    expect(evaluateAST(sqrtParsed.ast!, 0)).toBe(0);
    expect(evaluateAST(sqrtParsed.ast!, 16)).toBe(4);
    expect(evaluateAST(sqrtParsed.ast!, 2)).toBeCloseTo(Math.SQRT2, 5);
  });

  it('evaluates sigmoid function accurately with asymptotic stability', () => {
    const sigParsed = parseExpression('sigmoid(x)');
    expect(sigParsed.success).toBe(true);

    expect(evaluateAST(sigParsed.ast!, 0)).toBeCloseTo(0.5, 5);
    expect(evaluateAST(sigParsed.ast!, 100)).toBe(1.0);
    expect(evaluateAST(sigParsed.ast!, -100)).toBe(0.0);

    // Also compare with direct definition 1 / (1 + exp(-x))
    const defParsed = parseExpression('1 / (1 + exp(-x))');
    expect(evaluateAST(defParsed.ast!, 2)).toBeCloseTo(evaluateAST(sigParsed.ast!, 2), 6);
  });

  it('evaluates standard normal Gaussian density', () => {
    const gParsed = parseExpression('(1 / sqrt(2 * pi)) * exp(-0.5 * x^2)');
    expect(gParsed.success).toBe(true);

    const peak = evaluateAST(gParsed.ast!, 0);
    expect(peak).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 5); // ~0.398942

    const helperParsed = parseExpression('gaussian(x)');
    expect(evaluateAST(helperParsed.ast!, 0)).toBeCloseTo(peak, 5);
  });
});

describe('Plot Engine - Singularity and Domain Boundary Safety', () => {
  it('returns NaN on division by zero without crashing', () => {
    const divZero = parseExpression('1 / x');
    expect(divZero.success).toBe(true);
    const val = evaluateAST(divZero.ast!, 0);
    expect(Number.isNaN(val)).toBe(true);
  });

  it('returns NaN for logarithm of non-positive numbers', () => {
    const logParsed = parseExpression('log(x)');
    expect(logParsed.success).toBe(true);

    expect(Number.isNaN(evaluateAST(logParsed.ast!, 0))).toBe(true);
    expect(Number.isNaN(evaluateAST(logParsed.ast!, -1))).toBe(true);
    expect(Number.isNaN(evaluateAST(logParsed.ast!, -100))).toBe(true);
  });

  it('returns NaN for square root of negative numbers', () => {
    const sqrtParsed = parseExpression('sqrt(x)');
    expect(sqrtParsed.success).toBe(true);

    expect(Number.isNaN(evaluateAST(sqrtParsed.ast!, -0.001))).toBe(true);
    expect(Number.isNaN(evaluateAST(sqrtParsed.ast!, -25))).toBe(true);
  });

  it('returns NaN for complex powers with negative base and fractional exponent', () => {
    const powParsed = parseExpression('x^0.5');
    expect(powParsed.success).toBe(true);
    expect(Number.isNaN(evaluateAST(powParsed.ast!, -4))).toBe(true);
  });

  it('handles tangent singularity gracefully', () => {
    const tanParsed = parseExpression('tan(x)');
    expect(tanParsed.success).toBe(true);
    const val = evaluateAST(tanParsed.ast!, Math.PI / 2);
    expect(Number.isNaN(val)).toBe(true);
  });
});

describe('Plot Engine - Curve Sampling & Domain Validation', () => {
  it('validates domain bounds correctly', () => {
    expect(validateDomain({ xMin: -5, xMax: 5, sampleCount: 200 }).isValid).toBe(true);

    // xMin >= xMax
    const invalidOrder = validateDomain({ xMin: 5, xMax: -5, sampleCount: 200 });
    expect(invalidOrder.isValid).toBe(false);
    expect(invalidOrder.error).toMatch(/must be strictly less than/i);

    const equalOrder = validateDomain({ xMin: 2, xMax: 2, sampleCount: 200 });
    expect(equalOrder.isValid).toBe(false);

    // Unreasonable sample counts
    const tooFew = validateDomain({ xMin: -5, xMax: 5, sampleCount: 5 });
    expect(tooFew.isValid).toBe(false);
    expect(tooFew.error).toMatch(/between 10 and 5000/i);

    const tooMany = validateDomain({ xMin: -5, xMax: 5, sampleCount: 10000 });
    expect(tooMany.isValid).toBe(false);
  });

  it('splits discontinuous curves into segments across asymptotes', () => {
    const curve = evaluateCurve(
      'c1',
      'Inverse X',
      '1 / x',
      '#0d9488',
      true,
      { xMin: -2, xMax: 2, sampleCount: 401 }
    );

    expect(curve.hasError).toBe(false);
    expect(curve.invalidCount).toBeGreaterThan(0);
    expect(curve.validCount).toBeGreaterThan(0);
    // At x=0, 1/x is undefined; so there must be at least 2 distinct segments!
    expect(curve.segments.length).toBeGreaterThanOrEqual(2);
    expect(curve.warningMessage).toBeDefined();
  });

  it('evaluates completely undefined domains without crashing and reports warning', () => {
    const curve = evaluateCurve(
      'c2',
      'Negative Sqrt',
      'sqrt(x)',
      '#0d9488',
      true,
      { xMin: -10, xMax: -1, sampleCount: 50 }
    );

    expect(curve.hasError).toBe(false);
    expect(curve.validCount).toBe(0);
    expect(curve.invalidCount).toBe(50);
    expect(curve.segments.length).toBe(0);
    expect(curve.warningMessage).toMatch(/all 50 sample points are undefined/i);
  });
});

describe('Plot Engine - CSV Generation & Presets', () => {
  it('generates well-formed CSV data with NaN representations for invalid points', () => {
    const c1 = evaluateCurve('c1', 'Quadratic', 'x^2', '#3b82f6', true, { xMin: -1, xMax: 1, sampleCount: 3 });
    const c2 = evaluateCurve('c2', 'Sqrt', 'sqrt(x)', '#10b981', true, { xMin: -1, xMax: 1, sampleCount: 3 });

    const csv = generateCSV([c1, c2]);
    expect(csv).toContain('"x"');
    expect(csv).toContain('Quadratic');
    expect(csv).toContain('Sqrt');

    const lines = csv.trim().split('\n');
    expect(lines.length).toBe(4); // 1 header + 3 data rows

    // At x = -1, sqrt(x) is NaN
    expect(lines[1]).toContain('NaN');
  });

  it('contains valid and parseable expressions for all predefined presets', () => {
    for (const preset of FUNCTION_PRESETS) {
      const parsed = parseExpression(preset.expression);
      expect(parsed.success, `Preset ${preset.name} failed: ${parsed.error}`).toBe(true);

      const curve = evaluateCurve(
        preset.id,
        preset.name,
        preset.expression,
        '#0d9488',
        true,
        { xMin: preset.xMin, xMax: preset.xMax, sampleCount: 50 }
      );

      expect(curve.hasError).toBe(false);
      expect(curve.validCount).toBeGreaterThan(0);
    }
  });
});
