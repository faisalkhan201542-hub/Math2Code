import { describe, it, expect } from 'vitest';
import { convertEquationToPython, EXPANDED_PATTERNS } from '../engine';
import { convertCodeToEquation, SUPPORTED_REVERSE_PRESETS } from '../reverse-engine';

describe('Expanded Bidirectional Engines Suite (20 Phase 9 Equations)', () => {
  describe('Equation-to-Code: All 20 Expanded Equations', () => {
    it('successfully compiles every expanded equation from its LaTeX definition into verified Python code', () => {
      for (const patternDef of EXPANDED_PATTERNS) {
        const result = convertEquationToPython(patternDef.latex);
        expect(result.status, `Failed for ${patternDef.name}`).toBe('success');
        expect(result.pattern).toBe(patternDef.pattern);
        expect(result.code).toContain('def ');
        expect(result.metadata).toBeDefined();
        expect(result.explanation).toBeDefined();
        expect(result.explanation?.category).toBe(patternDef.category);
      }
    });

    it('successfully compiles simplified plain-text expressions for expanded equations', () => {
      // Dot product
      const resDot = convertEquationToPython('x . w = sum(x_i * w_i)');
      expect(resDot.status).toBe('success');
      expect(resDot.pattern).toBe('dot_product');

      // ReLU
      const resRelu = convertEquationToPython('f(x) = max(0, x)');
      expect(resRelu.status).toBe('success');
      expect(resRelu.pattern).toBe('relu');

      // Softmax
      const resSoftmax = convertEquationToPython('sigma(z)_i = exp(z_i) / sum(exp(z_j))');
      expect(resSoftmax.status).toBe('success');
      expect(resSoftmax.pattern).toBe('softmax');

      // Gradient descent
      const resGd = convertEquationToPython('theta_{t+1} = theta_t - alpha * grad');
      expect(resGd.status).toBe('success');
      expect(resGd.pattern).toBe('gradient_descent');

      // Z-Score
      const resZ = convertEquationToPython('z = (x - mu) / sigma');
      expect(resZ.status).toBe('success');
      expect(resZ.pattern).toBe('z_score');

      // MSE
      const resMse = convertEquationToPython('MSE = (1/n) * sum((y_i - y_hat_i)^2)');
      expect(resMse.status).toBe('success');
      expect(resMse.pattern).toBe('mean_squared_error');

      // Entropy
      const resEntropy = convertEquationToPython('H(X) = -sum(P(x_i) * log2(P(x_i)))');
      expect(resEntropy.status).toBe('success');
      expect(resEntropy.pattern).toBe('entropy');
    });
  });

  describe('Code-to-Equation: All 26 Presets and Expanded Mathematical Routines', () => {
    it('verifies all 26 reverse presets produce success status and non-empty LaTeX', () => {
      expect(SUPPORTED_REVERSE_PRESETS).toHaveLength(26);

      for (const preset of SUPPORTED_REVERSE_PRESETS) {
        const result = convertCodeToEquation(preset.code);
        expect(result.status, `Decompilation failed for preset: ${preset.id}`).toBe('success');
        expect(result.latex.length, `Empty LaTeX for preset: ${preset.id}`).toBeGreaterThan(0);
        expect(result.explanation?.operationMappings.length, `Missing op mappings for: ${preset.id}`).toBeGreaterThan(0);
        expect(result.explanation?.mathDomain, `Missing math domain for: ${preset.id}`).toBeTruthy();
      }
    });

    it('correctly decompiles ReLU routine into max(0, x)', () => {
      const result = convertCodeToEquation('y = np.maximum(0, x)');
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('relu');
      expect(result.latex).toContain('\\max(0');
    });

    it('correctly decompiles Softmax routine into normalized exponential fraction', () => {
      const result = convertCodeToEquation('probs = np.exp(z) / np.sum(np.exp(z))');
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('softmax');
      expect(result.latex).toContain('e^{z');
    });

    it('correctly decompiles Dot Product routine', () => {
      const result = convertCodeToEquation('dot = np.dot(x, w)');
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('dot_product');
      expect(result.latex).toContain('\\cdot');
    });

    it('correctly decompiles Euclidean Distance routine', () => {
      const result = convertCodeToEquation('dist = np.sqrt(np.sum((x - y) ** 2))');
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('euclidean_distance');
      expect(result.latex).toContain('d(');
    });

    it('correctly decompiles MSE routine', () => {
      const result = convertCodeToEquation('mse = np.mean((y - y_hat) ** 2)');
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('mean_squared_error');
      expect(result.latex).toContain('\\text{MSE}');
    });

    it('correctly decompiles MAE routine', () => {
      const result = convertCodeToEquation('mae = np.mean(np.abs(y - y_hat))');
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('mean_absolute_error');
      expect(result.latex).toContain('\\text{MAE}');
    });

    it('correctly decompiles Gradient Descent parameter step', () => {
      const result = convertCodeToEquation('theta = theta - alpha * grad');
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('gradient_descent');
      expect(result.latex).toContain('\\theta');
    });

    it('correctly decompiles Precision, Recall, and F1-score', () => {
      const p = convertCodeToEquation('precision = tp / (tp + fp)');
      expect(p.pattern).toBe('precision');

      const r = convertCodeToEquation('recall = tp / (tp + fn)');
      expect(r.pattern).toBe('recall');

      const f1 = convertCodeToEquation('f1 = 2 * (precision * recall) / (precision + recall)');
      expect(f1.pattern).toBe('f1_score');
    });

    it('correctly decompiles L1 and L2 regularizations', () => {
      const l1 = convertCodeToEquation('l1 = lambda_val * np.sum(np.abs(w))');
      expect(l1.pattern).toBe('l1_regularization');

      const l2 = convertCodeToEquation('l2 = 0.5 * lambda_val * np.sum(w ** 2)');
      expect(l2.pattern).toBe('l2_regularization');
    });

    it('correctly decompiles Shannon Entropy and KL Divergence', () => {
      const h = convertCodeToEquation('entropy = -np.sum(p * np.log2(p))');
      expect(h.pattern).toBe('entropy');

      const kl = convertCodeToEquation('kl = np.sum(p * np.log(p / q))');
      expect(kl.pattern).toBe('kl_divergence');
    });

    it('correctly decompiles Z-Score standardization', () => {
      const z = convertCodeToEquation('z = (x - mu) / sigma');
      expect(z.pattern).toBe('z_score');
      expect(z.latex).toContain('\\mu');
      expect(z.latex).toContain('\\sigma');
    });

    it('falls back to generic algebraic for unmatched mathematical expressions safely without errors', () => {
      const custom = 'res = a * x ** 3 + b * x ** 2 + c * x + d';
      const result = convertCodeToEquation(custom);
      expect(result.status).toBe('success');
      expect(result.pattern).toBe('generic_algebraic');
      expect(result.latex).toContain('res');
    });
  });
});
