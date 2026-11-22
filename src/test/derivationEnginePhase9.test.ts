import { describe, it, expect } from 'vitest';
import {
  ALL_DERIVATIONS,
  getDerivationByPattern,
  getDerivationById
} from '../explanation-engine';
import { EQUATION_CATALOGUE } from '../data/equationCatalogue';

describe('Phase 9 — Expanded 20 Mathematical Derivations Engine Test Suite', () => {
  const NEW_20_PATTERNS = [
    'dot_product',
    'euclidean_distance',
    'mean_squared_error',
    'mean_absolute_error',
    'variance',
    'covariance',
    'pearson_correlation',
    'gradient_descent',
    'precision',
    'recall',
    'f1_score',
    'chain_rule',
    'l1_regularization',
    'l2_regularization',
    'z_score',
    'entropy',
    'kl_divergence',
    'softmax',
    'relu',
    'binary_cross_entropy'
  ] as const;

  const CANONICAL_6_PATTERNS = [
    'matrix_multiplication',
    'vector_l2_norm',
    'sigmoid',
    'bayes_theorem',
    'linear_regression',
    'gaussian_pdf'
  ] as const;

  it('verifies all 26 derivations are loaded into the global registry', () => {
    expect(ALL_DERIVATIONS).toHaveLength(26);
  });

  describe('Existing 6 Canonical Derivations Remain Intact', () => {
    it.each(CANONICAL_6_PATTERNS)('ensures canonical pattern %s resolves and is compiler-supported', (pattern) => {
      const res = getDerivationByPattern(pattern);
      expect(res.status).toBe('success');
      expect(res.derivation).toBeDefined();
      expect(res.derivation?.isEngineSupported).toBe(true);
      expect(res.derivation?.steps.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('All 20 New Derivation Patterns Resolve Correctly', () => {
    it.each(NEW_20_PATTERNS)('resolves pattern %s in both snake_case and kebab-case', (pattern) => {
      const snakeRes = getDerivationByPattern(pattern);
      expect(snakeRes.status).toBe('success');
      expect(snakeRes.derivation).toBeDefined();

      const kebabPattern = pattern.replace(/_/g, '-');
      const kebabRes = getDerivationByPattern(kebabPattern);
      expect(kebabRes.status).toBe('success');
      expect(kebabRes.derivation?.id).toBe(snakeRes.derivation?.id);
    });
  });

  describe('Formula Rendering Data, Assumptions, Variables, and Steps Validation', () => {
    it.each(NEW_20_PATTERNS)('validates complete structural content for %s', (pattern) => {
      const d = getDerivationByPattern(pattern).derivation!;

      // 1. Title, category, and canonical LaTeX formula exist
      expect(d.title.trim().length).toBeGreaterThan(0);
      expect(d.category.trim().length).toBeGreaterThan(0);
      expect(d.canonicalFormulaLatex.trim().length).toBeGreaterThan(0);
      expect(d.targetWhatItCalculates.trim().length).toBeGreaterThan(0);
      expect(d.summary.trim().length).toBeGreaterThan(0);

      // 2. Variable definitions are present and non-empty
      expect(d.symbols.length).toBeGreaterThanOrEqual(2);
      d.symbols.forEach((sym) => {
        expect(sym.symbol.trim()).toBeTruthy();
        expect(sym.name.trim()).toBeTruthy();
        expect(sym.mathDomain.trim()).toBeTruthy();
        expect(sym.role.trim()).toBeTruthy();
      });

      // 3. Assumptions and domain constraints
      expect(d.assumptions.length).toBeGreaterThanOrEqual(2);

      // 4. Strictly ordered steps
      expect(d.steps.length).toBeGreaterThanOrEqual(3);
      d.steps.forEach((step, idx) => {
        expect(step.stepNumber).toBe(idx + 1);
        expect(step.id.trim()).toBeTruthy();
        expect(step.title.trim()).toBeTruthy();
        expect(step.latex.trim()).toBeTruthy();
        expect(step.explanation.trim()).toBeTruthy();
      });

      // 5. Verified worked numerical example
      expect(d.workedExample).toBeDefined();
      expect(d.workedExample.title.trim()).toBeTruthy();
      expect(d.workedExample.inputs.length).toBeGreaterThan(0);
      expect(d.workedExample.stepByStepComputation.length).toBeGreaterThan(0);
      expect(d.workedExample.finalOutput.value.trim()).toBeTruthy();
      expect(d.workedExample.verifiedNote.toLowerCase()).toContain('verified');

      // 6. Common mistakes and numerical stability notes
      expect(d.commonMistakes.length).toBeGreaterThanOrEqual(2);
      expect(d.numericalStabilityNotes.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Catalogue Linkage & Compiler Separation Invariants', () => {
    it.each(NEW_20_PATTERNS)('links to a valid equation catalogue entry without claiming compiler support', (pattern) => {
      const d = getDerivationByPattern(pattern).derivation!;
      expect(d.catalogueId).toBeDefined();

      const catalogueItem = EQUATION_CATALOGUE.find((eq) => eq.id === d.catalogueId);
      expect(catalogueItem).toBeDefined();

      if (pattern === 'pearson_correlation') {
        expect(catalogueItem?.id).toBe('covariance-correlation');
      } else if (pattern === 'recall' || pattern === 'f1_score') {
        expect(catalogueItem?.id).toBe('precision-recall-f1');
      } else {
        expect(catalogueItem?.derivationPatternId).toBe(pattern);
      }

      // CRITICAL REQUIREMENT: Do not claim automatic compiler support for new derivations unless genuinely supported
      expect(d.isEngineSupported).toBe(false);
      expect(catalogueItem?.isEngineSupported).toBe(false);
    });

    it('confirms compiler-supported badge is strictly limited to the canonical 6 patterns', () => {
      const compilerSupported = ALL_DERIVATIONS.filter((d) => d.isEngineSupported);
      expect(compilerSupported).toHaveLength(6);
      const supportedPatterns = compilerSupported.map((d) => d.pattern);
      CANONICAL_6_PATTERNS.forEach((p) => {
        expect(supportedPatterns).toContain(p);
      });
    });

    it('verifies plottableExpr is present only for valid 1D scalar plottable functions', () => {
      const plottableDerivations = ALL_DERIVATIONS.filter((d) => !!d.plottableExpr);
      expect(plottableDerivations.length).toBeGreaterThan(0);
      // ReLU is a plottable 1D function
      const reluDeriv = getDerivationByPattern('relu').derivation!;
      expect(reluDeriv.plottableExpr).toBe('0.5 * (x + abs(x))');

      // Vector/matrix ops must NOT have a 1D plottable expression
      const dotDeriv = getDerivationByPattern('dot_product').derivation!;
      expect(dotDeriv.plottableExpr).toBeUndefined();

      const matmulDeriv = getDerivationByPattern('matrix_multiplication').derivation!;
      expect(matmulDeriv.plottableExpr).toBeUndefined();
    });
  });

  describe('Graceful Handling of Unsupported and Unknown IDs', () => {
    it('returns status "unsupported" with descriptive message for nonexistent pattern', () => {
      const res = getDerivationByPattern('quantum_fourier_transform_xyz');
      expect(res.status).toBe('unsupported');
      expect(res.derivation).toBeUndefined();
      expect(res.errorMessage).toContain("does not have a verified derivation template");
      expect(res.errorMessage).toContain('26 verified derivations');
    });

    it('returns undefined for getDerivationById with invalid ID', () => {
      expect(getDerivationById('non_existent_12345')).toBeUndefined();
    });
  });
});
