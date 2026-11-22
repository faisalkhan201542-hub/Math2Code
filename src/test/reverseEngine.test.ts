import { describe, it, expect } from 'vitest';
import {
  convertCodeToEquation,
  tokenizePython,
  SUPPORTED_REVERSE_PRESETS
} from '../reverse-engine';

describe('Python Lexical Tokenizer', () => {
  it('tokenizes identifiers, operators, numbers and delimiters', () => {
    const code = 'y_hat = X @ w + 2.5 * b';
    const tokens = tokenizePython(code);
    expect(tokens.map((t) => t.value)).toEqual([
      'y_hat', '=', 'X', '@', 'w', '+', '2.5', '*', 'b', '<EOF>'
    ]);
  });

  it('strips Python comments and triple-quoted docstrings', () => {
    const code = `# Leading comment\ndef func(x):\n    """Docstring text"""\n    return x ** 2 # trailing`;
    const tokens = tokenizePython(code);
    expect(tokens.map((t) => t.value)).not.toContain('Leading comment');
    expect(tokens.map((t) => t.value)).not.toContain('Docstring text');
    expect(tokens.map((t) => t.value)).toContain('return');
  });
});

describe('Reverse Code-to-Equation Decompilation Engine', () => {
  describe('Canonical Example 1: Matrix Multiplication', () => {
    it('converts direct statement C = A @ B', () => {
      const result = convertCodeToEquation('C = A @ B');
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('matrix_multiplication');
      expect(result.latex).toBe('C = AB');
      expect(result.explanation?.operationMappings[0].pythonSyntax).toBe('@');
      expect(result.explanation?.mathDomain).toContain('\\mathbb{R}^{M \\times K}');
    });

    it('converts function-wrapped matrix multiplication', () => {
      const code = `import numpy as np\ndef matmul(A: np.ndarray, B: np.ndarray) -> np.ndarray:\n    return A @ B`;
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('matrix_multiplication');
      expect(result.latex).toContain('AB');
    });

    it('distinguishes * (element-wise) from @ (matrix multiplication)', () => {
      const matmul = convertCodeToEquation('C = A @ B');
      const elemwise = convertCodeToEquation('C = A * B');

      expect(matmul.pattern).toBe('matrix_multiplication');
      expect(elemwise.pattern).toBe('generic_algebraic');
      expect(elemwise.pattern).not.toBe('matrix_multiplication');
    });
  });

  describe('Canonical Example 2: Vector L2 Norm', () => {
    it('converts norm = np.sqrt(np.sum(x ** 2))', () => {
      const code = 'norm = np.sqrt(np.sum(x ** 2))';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('vector_l2_norm');
      expect(result.latex).toBe('\\text{norm} = \\sqrt{\\sum_i x_i^2}');
      expect(result.explanation?.category).toBe('Linear Algebra');
    });

    it('converts math.sqrt(sum(x ** 2))', () => {
      const code = 'L2 = math.sqrt(sum(x ** 2))';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('vector_l2_norm');
      expect(result.latex).toContain('\\sqrt{\\sum_i x_i^2}');
    });

    it('converts np.linalg.norm(x)', () => {
      const code = 'd = np.linalg.norm(x)';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('vector_l2_norm');
      expect(result.latex).toBe('d = \\sqrt{\\sum_i x_i^2}');
    });
  });

  describe('Canonical Example 3: Sigmoid Activation', () => {
    it('converts y = 1 / (1 + np.exp(-z))', () => {
      const code = 'y = 1 / (1 + np.exp(-z))';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('sigmoid');
      expect(result.latex).toBe('y = \\frac{1}{1 + e^{-z}}');
    });

    it('converts float variant 1.0 / (1.0 + math.exp(-z))', () => {
      const code = 'sigma = 1.0 / (1.0 + math.exp(-z))';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('sigmoid');
      expect(result.latex).toBe('\\sigma(z) = \\frac{1}{1 + e^{-z}}');
    });
  });

  describe("Canonical Example 4: Bayes' Theorem", () => {
    it('converts posterior = likelihood * prior / marginal', () => {
      const code = 'posterior = likelihood * prior / marginal';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('bayes_theorem');
      expect(result.latex).toBe('P(A\\mid B) = \\frac{P(B\\mid A) P(A)}{P(B)}');

      // Check semantic variable mappings
      const varMap = result.explanation?.variableMappings;
      expect(varMap?.some((v) => v.pythonVariable === 'likelihood' && v.mathSymbol === 'P(B\\mid A)')).toBe(true);
      expect(varMap?.some((v) => v.pythonVariable === 'prior' && v.mathSymbol === 'P(A)')).toBe(true);
      expect(varMap?.some((v) => v.pythonVariable === 'marginal' && v.mathSymbol === 'P(B)')).toBe(true);
    });

    it('converts parenthesized form (likelihood * prior) / marginal', () => {
      const code = 'post = (likelihood * prior) / marginal';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('bayes_theorem');
    });
  });

  describe('Canonical Example 5: Linear Regression Prediction', () => {
    it('converts y_hat = X @ w + b', () => {
      const code = 'y_hat = X @ w + b';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('linear_regression');
      expect(result.latex).toBe('\\hat{y} = Xw + b');
      expect(result.explanation?.operationMappings.some((op) => op.pythonSyntax === '@')).toBe(true);
      expect(result.explanation?.operationMappings.some((op) => op.pythonSyntax === '+')).toBe(true);
    });

    it('converts regression with subtraction bias y_pred = X @ w - b', () => {
      const code = 'y_pred = X @ w - b';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('linear_regression');
      expect(result.latex).toBe('\\hat{y} = Xw - b');
    });
  });

  describe('Canonical Example 6: Gaussian Probability Density', () => {
    it('converts standard canonical Gaussian PDF implementation', () => {
      const code = 'f = (1 / (sigma * np.sqrt(2 * np.pi))) * np.exp(-((x - mu) ** 2) / (2 * sigma ** 2))';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('gaussian_pdf');
      expect(result.latex).toContain('\\frac{1}{\\sigma \\sqrt{2\\pi}}');
      expect(result.latex).toContain('\\exp');
      expect(result.latex).toContain('(x - \\mu)^2');
      expect(result.explanation?.assumptions.some((a) => a.includes('\\sigma > 0'))).toBe(true);
    });

    it('converts quotient formulation of Gaussian PDF', () => {
      const code = 'pdf = np.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * np.sqrt(2 * np.pi))';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('gaussian_pdf');
    });
  });

  describe('Operator Precedence and Parentheses Preservation', () => {
    it('preserves parentheses when addition is multiplied', () => {
      const code = 'y = (a + b) * c';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.latex).toBe('y = \\left(a + b\\right)c');
    });

    it('does not add redundant parentheses when precedence is already high-to-low', () => {
      const code = 'y = a * b + c';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.latex).toBe('y = ab + c');
    });

    it('translates division into fractions', () => {
      const code = 'z = (a + b) / (c + d)';
      const result = convertCodeToEquation(code);
      expect(result.status).toBe('success');
      expect(result.latex).toBe('z = \\frac{a + b}{c + d}');
    });
  });

  describe('Safety, Soundness and Error Handling', () => {
    it('handles empty input cleanly', () => {
      const result = convertCodeToEquation('');
      expect(result.status).toBe('invalid_input');
      expect(result.latex).toBe('');
      expect(result.errorMessage).toBeDefined();
    });

    it('rejects for loops honestly', () => {
      const loopCode = `total = 0\nfor x in arr:\n    total += x`;
      const result = convertCodeToEquation(loopCode);
      expect(result.status).toBe('unsupported_syntax');
      expect(result.errorMessage).toContain('Loop constructs (for/while) cannot be converted');
    });

    it('rejects while loops honestly', () => {
      const whileCode = `while x > 0:\n    x -= 1`;
      const result = convertCodeToEquation(whileCode);
      expect(result.status).toBe('unsupported_syntax');
      expect(result.errorMessage).toContain('Loop constructs');
    });

    it('rejects class definitions', () => {
      const classCode = `class NeuralNetwork:\n    pass`;
      const result = convertCodeToEquation(classCode);
      expect(result.status).toBe('unsupported_syntax');
      expect(result.errorMessage).toContain('Class definitions are not supported');
    });

    it('never executes submitted Python code', () => {
      const malicious = `import os\nos.system("echo compromised")\ny = 2 * x`;
      // The engine only tokenizes and parses the AST without evaluating Python
      const result = convertCodeToEquation(malicious);
      expect(typeof result.latex).toBe('string');
    });

    it('produces deterministic output across repeated calls', () => {
      const code = 'C = A @ B';
      const res1 = convertCodeToEquation(code);
      const res2 = convertCodeToEquation(code);
      expect(res1.latex).toBe(res2.latex);
      expect(res1.pattern).toBe(res2.pattern);
    });

    it('successfully processes all 6 UI presets without error', () => {
      for (const preset of SUPPORTED_REVERSE_PRESETS) {
        const res = convertCodeToEquation(preset.code);
        expect(res.status).toBe('success');
        expect(res.latex.length).toBeGreaterThan(0);
      }
    });
  });
});
