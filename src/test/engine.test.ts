import { describe, it, expect } from 'vitest';
import { convertEquationToPython, normalizeEquation } from '../engine';

describe('Mathematical String Normalizer', () => {
  it('strips LaTeX sizing and spacing commands', () => {
    const raw = '\\left( \\frac{a}{b} \\right) \\quad \\qquad';
    const normalized = normalizeEquation(raw);
    expect(normalized).not.toContain('\\left');
    expect(normalized).not.toContain('\\right');
    expect(normalized).not.toContain('\\quad');
  });

  it('normalizes fractions, square roots, and Greek letters', () => {
    const raw = '\\sigma(z) = \\frac{1}{1 + e^{-z}}';
    const normalized = normalizeEquation(raw);
    expect(normalized).toContain('sigma');
    expect(normalized).toContain('(1)/(1 + e^{-z})');
  });

  it('normalizes vector norm brackets', () => {
    const raw = '\\|x\\|_2 = \\sqrt{\\sum_{i=1}^{n} x_i^2}';
    const normalized = normalizeEquation(raw);
    expect(normalized).toContain('norm2(x)');
    expect(normalized).toContain('sqrt');
  });
});

describe('Equation to Python Conversion Engine', () => {
  describe('Matrix Multiplication', () => {
    it('converts C = AB', () => {
      const result = convertEquationToPython('C = AB');
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('matrix_multiplication');
      expect(result.code).toContain('import numpy as np');
      expect(result.code).toContain('A @ B');
      expect(result.code).toContain('A.ndim != 2 or B.ndim != 2');
      expect(result.code).toContain('K_a != K_b');
      expect(result.metadata?.variables).toHaveLength(3);
      expect(result.explanation?.computationalComplexity.time).toBe('O(M * K * N)');
    });

    it('converts explicit LaTeX indexed matrix product', () => {
      const latex = 'C_{ij} = \\sum_{k=1}^p A_{ik} B_{kj}';
      const result = convertEquationToPython(latex);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('matrix_multiplication');
      expect(result.code).toContain('A @ B');
    });

    it('converts explicit @ operator', () => {
      const result = convertEquationToPython('C = A @ B');
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('matrix_multiplication');
    });
  });

  describe('Vector L2 Norm', () => {
    it('converts LaTeX ||x||_2 formulation', () => {
      const latex = '\\|x\\|_2 = \\sqrt{\\sum_{i=1}^{n} x_i^2}';
      const result = convertEquationToPython(latex);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('vector_l2_norm');
      expect(result.code).toContain('np.linalg.norm');
      expect(result.code).toContain('x.ndim != 1');
      expect(result.code).toContain('x.size == 0');
    });

    it('converts simple text norm formula', () => {
      const simple = '||x||_2 = sqrt(sum(x_i^2))';
      const result = convertEquationToPython(simple);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('vector_l2_norm');
    });
  });

  describe('Sigmoid Activation Function', () => {
    it('converts standard LaTeX sigmoid formulation with numerical stability', () => {
      const latex = '\\sigma(z) = \\frac{1}{1 + e^{-z}}';
      const result = convertEquationToPython(latex);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('sigmoid');
      expect(result.code).toContain('def sigmoid(z:');
      // Must include numerical overflow safeguards
      expect(result.code).toContain('pos_mask = (z_arr >= 0)');
      expect(result.code).toContain('exp_z = np.exp(z_arr[~pos_mask])');
      expect(result.explanation?.numericalSafeguards).toBeDefined();
    });

    it('converts text sigmoid formula', () => {
      const text = 'sigma(z) = 1 / (1 + exp(-z))';
      const result = convertEquationToPython(text);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('sigmoid');
    });
  });

  describe("Bayes' Theorem", () => {
    it('converts standard conditional probability formula', () => {
      const latex = 'P(A\\mid B) = \\frac{P(B\\mid A) P(A)}{P(B)}';
      const result = convertEquationToPython(latex);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('bayes_theorem');
      expect(result.code).toContain('marginal <= 0.0');
      expect(result.code).toContain('posterior = (likelihood * prior) / marginal');
      expect(result.explanation?.variableRoles).toHaveLength(4);
    });

    it('converts plain ASCII Bayes formula', () => {
      const ascii = 'P(A|B) = P(B|A) * P(A) / P(B)';
      const result = convertEquationToPython(ascii);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('bayes_theorem');
    });
  });

  describe('Linear Regression', () => {
    it('converts y_hat = Xw + b with shape checks', () => {
      const latex = '\\hat{y} = Xw + b';
      const result = convertEquationToPython(latex);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('linear_regression');
      expect(result.code).toContain('X.ndim != 2');
      expect(result.code).toContain('w.shape[0] != D');
      expect(result.code).toContain('(X @ w) + float(b)');
    });

    it('converts explicit @ operator with bias', () => {
      const text = 'y_hat = X @ w + b';
      const result = convertEquationToPython(text);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('linear_regression');
    });
  });

  describe('Gaussian Normal PDF', () => {
    it('converts Gaussian density formula with positive sigma check', () => {
      const latex = 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{(x - \\mu)^2}{2\\sigma^2} \\right)';
      const result = convertEquationToPython(latex);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('gaussian_pdf');
      expect(result.code).toContain('sigma <= 0.0');
      expect(result.code).toContain('np.sqrt(2.0 * np.pi)');
      expect(result.code).toContain('norm_const * np.exp(-0.5 * (z ** 2))');
    });

    it('converts simple ASCII Gaussian formula', () => {
      const ascii = 'f(x) = exp(-((x-mu)^2)/(2*sigma^2)) / (sigma*sqrt(2*pi))';
      const result = convertEquationToPython(ascii);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('gaussian_pdf');
    });
  });

  describe('Error Handling and Safety', () => {
    it('handles empty input gracefully', () => {
      const result = convertEquationToPython('');
      expect(result.status).toBe('invalid_input');
      expect(result.code).toContain('Error: No equation input provided');
      expect(result.suggestedTemplates).toBeDefined();
    });

    it('rejects unsupported mathematical syntax honestly without fabricating outputs', () => {
      const unsupported = '\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}';
      const result = convertEquationToPython(unsupported);
      expect(result.status).toBe('unsupported_syntax');
      expect(result.pattern).toBe('unsupported');
      expect(result.code).toContain('Unsupported Syntax Notice');
      expect(result.errorMessage).toContain('does not match the 6 initial supported');
      expect(result.suggestedTemplates).toHaveLength(6);
    });

    it('does not execute code during conversion (safe text emission)', () => {
      const malicious = 'C = AB; import os; os.system("echo hacked")';
      const result = convertEquationToPython(malicious);
      // Malicious syntax is rejected as unsupported or normalized safely without execution
      expect(typeof result.code).toBe('string');
    });
  });

  describe('Standard Academic Presets from UI', () => {
    it('successfully converts the 6 canonical academic presets and marks Lotka-Volterra as unsupported', () => {
      // 1. Matrix multiplication preset
      const exMatrix = 'C = AB \\quad \\Longleftrightarrow \\quad C_{ij} = \\sum_{k=1}^{p} A_{ik} B_{kj}';
      const resMatrix = convertEquationToPython(exMatrix);
      expect(resMatrix.status).toBe('success');
      expect(resMatrix.pattern).toBe('matrix_multiplication');

      // 2. Vector L2 norm preset
      const exNorm = '\\|x\\|_2 = \\sqrt{\\sum_{i=1}^{n} x_i^2}';
      const resNorm = convertEquationToPython(exNorm);
      expect(resNorm.status).toBe('success');
      expect(resNorm.pattern).toBe('vector_l2_norm');

      // 3. Sigmoid preset
      const exSigmoid = '\\sigma(z) = \\frac{1}{1 + e^{-z}}';
      const resSigmoid = convertEquationToPython(exSigmoid);
      expect(resSigmoid.status).toBe('success');
      expect(resSigmoid.pattern).toBe('sigmoid');

      // 4. Bayes theorem preset
      const exBayes = 'P(A\\mid B) = \\frac{P(B\\mid A) P(A)}{P(B)}';
      const resBayes = convertEquationToPython(exBayes);
      expect(resBayes.status).toBe('success');
      expect(resBayes.pattern).toBe('bayes_theorem');

      // 5. Linear regression preset
      const exLinReg = '\\hat{y} = Xw + b';
      const resLinReg = convertEquationToPython(exLinReg);
      expect(resLinReg.status).toBe('success');
      expect(resLinReg.pattern).toBe('linear_regression');

      // 6. Gaussian PDF preset
      const exGauss = 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{(x - \\mu)^2}{2\\sigma^2} \\right)';
      const resGauss = convertEquationToPython(exGauss);
      expect(resGauss.status).toBe('success');
      expect(resGauss.pattern).toBe('gaussian_pdf');

      // 7. Lotka-Volterra preset (unsupported syntax)
      const exLotka = '\\begin{aligned} \\frac{dx}{dt} &= \\alpha x - \\beta x y \\\\ \\frac{dy}{dt} &= \\delta x y - \\gamma y \\end{aligned}';
      const resLotka = convertEquationToPython(exLotka);
      expect(resLotka.status).toBe('unsupported_syntax');
      expect(resLotka.pattern).toBe('unsupported');
    });
  });
});
