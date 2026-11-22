import { describe, it, expect } from 'vitest';
import {
  ALL_DERIVATIONS,
  getDerivationByPattern,
  getDerivationById,
  type PatternDerivation
} from '../explanation-engine';

describe('Step-by-Step Mathematical Derivation Engine', () => {
  it('contains all 26 mathematical derivation templates (6 canonical + 20 Phase 9 expanded)', () => {
    expect(ALL_DERIVATIONS).toHaveLength(26);
    const patterns = ALL_DERIVATIONS.map((d) => d.pattern);
    expect(patterns).toContain('matrix_multiplication');
    expect(patterns).toContain('vector_l2_norm');
    expect(patterns).toContain('sigmoid');
    expect(patterns).toContain('bayes_theorem');
    expect(patterns).toContain('linear_regression');
    expect(patterns).toContain('gaussian_pdf');
    expect(patterns).toContain('dot_product');
    expect(patterns).toContain('euclidean_distance');
    expect(patterns).toContain('mean_squared_error');
    expect(patterns).toContain('mean_absolute_error');
    expect(patterns).toContain('variance');
    expect(patterns).toContain('covariance');
    expect(patterns).toContain('pearson_correlation');
    expect(patterns).toContain('gradient_descent');
    expect(patterns).toContain('precision');
    expect(patterns).toContain('recall');
    expect(patterns).toContain('f1_score');
    expect(patterns).toContain('chain_rule');
    expect(patterns).toContain('l1_regularization');
    expect(patterns).toContain('l2_regularization');
    expect(patterns).toContain('z_score');
    expect(patterns).toContain('entropy');
    expect(patterns).toContain('kl_divergence');
    expect(patterns).toContain('softmax');
    expect(patterns).toContain('relu');
    expect(patterns).toContain('binary_cross_entropy');
  });

  describe('Step Sequence & Structural Invariants', () => {
    it.each(ALL_DERIVATIONS)('verifies strictly ordered steps and valid content for $title', (d: PatternDerivation) => {
      expect(d.steps.length).toBeGreaterThanOrEqual(3);

      d.steps.forEach((step, idx) => {
        // Steps must be strictly ordered starting at 1
        expect(step.stepNumber).toBe(idx + 1);
        expect(step.title.trim().length).toBeGreaterThan(0);
        expect(step.latex.trim().length).toBeGreaterThan(0);
        expect(step.explanation.trim().length).toBeGreaterThan(0);
        expect(step.id.trim().length).toBeGreaterThan(0);
      });

      // Symbol definitions must have symbol, name, domain, and role
      expect(d.symbols.length).toBeGreaterThan(0);
      d.symbols.forEach((sym) => {
        expect(sym.symbol.length).toBeGreaterThan(0);
        expect(sym.name.length).toBeGreaterThan(0);
        expect(sym.mathDomain.length).toBeGreaterThan(0);
        expect(sym.role.length).toBeGreaterThan(0);
      });

      // Assumptions must be clearly articulated
      expect(d.assumptions.length).toBeGreaterThanOrEqual(2);

      // Must have verified worked example
      expect(d.workedExample.inputs.length).toBeGreaterThan(0);
      expect(d.workedExample.stepByStepComputation.length).toBeGreaterThan(0);
      expect(d.workedExample.finalOutput.value.length).toBeGreaterThan(0);
      expect(d.workedExample.verifiedNote.toLowerCase()).toContain('verified');
    });
  });

  describe('Template 1: Matrix Multiplication Derivation', () => {
    const d = getDerivationByPattern('matrix_multiplication').derivation!;

    it('defines inner dimension compatibility in Step 2', () => {
      const step2 = d.steps[1];
      expect(step2.title).toContain('Inner Dimension');
      expect(step2.latex).toContain('\\text{columns}(A) = k = \\text{rows}(B)');
      expect(step2.pythonSnippet).toContain('A.shape[1] != B.shape[0]');
    });

    it('derives entry-wise dot product in Step 3', () => {
      const step3 = d.steps[2];
      expect(step3.latex).toContain('\\sum_{r=1}^{k} A_{ir} B_{rj}');
    });

    it('contains an independently computed 2x2 worked example yielding [19, 22], [43, 50]', () => {
      const ex = d.workedExample;
      expect(ex.inputs[0].value).toBe('[[1, 2], [3, 4]]');
      expect(ex.inputs[1].value).toBe('[[5, 6], [7, 8]]');
      expect(ex.finalOutput.value).toBe('[[19, 22], [43, 50]]');
      expect(ex.stepByStepComputation.some((s) => s.result === '19')).toBe(true);
      expect(ex.stepByStepComputation.some((s) => s.result === '22')).toBe(true);
      expect(ex.stepByStepComputation.some((s) => s.result === '43')).toBe(true);
      expect(ex.stepByStepComputation.some((s) => s.result === '50')).toBe(true);
    });
  });

  describe('Template 2: Vector L2 Norm Derivation', () => {
    const d = getDerivationByPattern('vector_l2_norm').derivation!;

    it('follows the squaring -> summation -> square root sequence', () => {
      expect(d.steps[0].title).toContain('Square');
      expect(d.steps[1].title).toContain('Sum');
      expect(d.steps[2].title).toContain('Square Root');
    });

    it('contains verified Pythagorean (3, 4) -> 5.0 worked example', () => {
      const ex = d.workedExample;
      expect(ex.inputs[0].value).toBe('[3.0, 4.0]');
      expect(ex.finalOutput.value).toBe('5.0');
    });
  });

  describe('Template 3: Sigmoid Activation Derivation', () => {
    const d = getDerivationByPattern('sigmoid').derivation!;

    it('covers reciprocal bounded formulation and dual-branch stabilization', () => {
      expect(d.canonicalFormulaLatex).toContain('\\frac{1}{1 + e^{-z}}');
      const stabilityStep = d.steps.find((s) => s.title.includes('Stabilization'));
      expect(stabilityStep).toBeDefined();
      expect(stabilityStep?.latex).toContain('\\frac{e^z}{1 + e^z}');
    });

    it('verifies sigmoid(0) = 0.5 and sigmoid(2) ≈ 0.8808 in worked example', () => {
      const ex = d.workedExample;
      expect(ex.stepByStepComputation.some((s) => s.result === '0.5')).toBe(true);
      expect(ex.stepByStepComputation.some((s) => s.result === '0.880797')).toBe(true);
    });
  });

  describe("Template 4: Bayes' Theorem Derivation", () => {
    const d = getDerivationByPattern('bayes_theorem').derivation!;

    it('defines prior, likelihood, and non-zero marginal evidence', () => {
      const symNames = d.symbols.map((s) => s.name);
      expect(symNames).toContain('Prior Probability');
      expect(symNames).toContain('Likelihood');
      expect(symNames).toContain('Marginal Evidence Probability');
      expect(symNames).toContain('Posterior Probability');

      expect(d.assumptions.some((a) => a.includes('P(B) > 0'))).toBe(true);
    });

    it('verifies medical test screening worked example producing posterior = 0.19', () => {
      const ex = d.workedExample;
      expect(ex.inputs.some((i) => i.value === '0.01')).toBe(true);
      expect(ex.inputs.some((i) => i.value === '0.95')).toBe(true);
      expect(ex.inputs.some((i) => i.value === '0.05')).toBe(true);
      expect(ex.finalOutput.value).toBe('0.19');
    });
  });

  describe('Template 5: Linear Regression Prediction Derivation', () => {
    const d = getDerivationByPattern('linear_regression').derivation!;

    it('distinguishes matrix-vector product projection from bias shift', () => {
      expect(d.canonicalFormulaLatex).toContain('\\hat{y} = Xw + b');
      expect(d.steps.some((s) => s.title.includes('Projection'))).toBe(true);
      expect(d.steps.some((s) => s.title.includes('Bias'))).toBe(true);
    });

    it('verifies 2-sample 2-feature worked example producing [4.5, 8.5]', () => {
      const ex = d.workedExample;
      expect(ex.finalOutput.value).toBe('[4.5, 8.5]');
      expect(ex.stepByStepComputation.some((s) => s.result === '4.5')).toBe(true);
      expect(ex.stepByStepComputation.some((s) => s.result === '8.5')).toBe(true);
    });
  });

  describe('Template 6: Gaussian Probability Density Function Derivation', () => {
    const d = getDerivationByPattern('gaussian_pdf').derivation!;

    it('enforces sigma > 0 scale constraint', () => {
      expect(d.assumptions.some((a) => a.includes('\\sigma > 0'))).toBe(true);
      const sigmaStep = d.steps.find((s) => s.title.includes('Positivity'));
      expect(sigmaStep).toBeDefined();
      expect(sigmaStep?.latex).toContain('\\sigma > 0');
    });

    it('verifies standard normal peak f(0) ≈ 0.398942 and 1-sigma f(1) ≈ 0.241971 in worked example', () => {
      const ex = d.workedExample;
      expect(ex.stepByStepComputation.some((s) => s.result === '0.398942')).toBe(true);
      expect(ex.stepByStepComputation.some((s) => s.result === '0.241971')).toBe(true);
    });
  });

  describe('Lookup & Error Handling', () => {
    it('returns success for valid pattern names and kebab-case IDs', () => {
      expect(getDerivationByPattern('matrix_multiplication').status).toBe('success');
      expect(getDerivationByPattern('matrix-multiplication').status).toBe('success');
      expect(getDerivationByPattern('sigmoid').status).toBe('success');
      expect(getDerivationById('bayes-theorem')).toBeDefined();
    });

    it('returns honest unsupported status for unindexed patterns', () => {
      const res = getDerivationByPattern('quantum_fourier_transform');
      expect(res.status).toBe('unsupported');
      expect(res.derivation).toBeUndefined();
      expect(res.errorMessage).toContain('does not have a verified derivation template currently');
    });
  });
});
