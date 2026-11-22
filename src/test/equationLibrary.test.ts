import { describe, it, expect } from 'vitest';
import { EQUATION_CATALOGUE } from '../data/equationCatalogue';
import { parseExpression } from '../plot-engine';
import { getDerivationByPattern, ALL_DERIVATIONS } from '../explanation-engine';
import type { CatalogueCategory, EquationDifficulty } from '../types/catalogue';

describe('Equation Library Catalogue - Schema & Consistency', () => {
  it('contains a valid catalogue with at least 30 mathematical models', () => {
    expect(EQUATION_CATALOGUE.length).toBeGreaterThanOrEqual(30);
  });

  it('guarantees unique IDs across every equation entry', () => {
    const idSet = new Set<string>();
    for (const eq of EQUATION_CATALOGUE) {
      expect(idSet.has(eq.id), `Duplicate equation ID found: "${eq.id}"`).toBe(false);
      idSet.add(eq.id);
      // Slug format check
      expect(eq.id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('covers all six required scientific categories with multiple models each', () => {
    const requiredCategories: CatalogueCategory[] = [
      'Mathematics & Linear Algebra',
      'Probability & Statistics',
      'Machine Learning',
      'Deep Learning',
      'Optimization & Information Theory',
      'Bioinformatics'
    ];

    for (const cat of requiredCategories) {
      const entries = EQUATION_CATALOGUE.filter((e) => e.category === cat);
      expect(
        entries.length,
        `Category "${cat}" must have at least 4 equations in catalogue`
      ).toBeGreaterThanOrEqual(4);
    }
  });

  it('ensures every equation possesses complete required metadata fields', () => {
    for (const eq of EQUATION_CATALOGUE) {
      expect(eq.title.length, `Empty title for ${eq.id}`).toBeGreaterThan(0);
      expect(eq.formula.length, `Empty formula for ${eq.id}`).toBeGreaterThan(0);
      expect(eq.latex.length, `Empty LaTeX for ${eq.id}`).toBeGreaterThan(0);
      expect(eq.description.length, `Empty description for ${eq.id}`).toBeGreaterThan(15);
      expect(eq.mathematicalMeaning.length, `Empty intuition for ${eq.id}`).toBeGreaterThan(20);
      expect(eq.pythonEquivalent.length, `Empty Python code for ${eq.id}`).toBeGreaterThan(20);
      expect(eq.variables.length, `Equation ${eq.id} must define at least one variable`).toBeGreaterThan(0);
      expect(
        eq.assumptionsAndLimitations.length,
        `Equation ${eq.id} must define assumptions`
      ).toBeGreaterThan(0);
      expect(eq.tags.length, `Equation ${eq.id} must define tags`).toBeGreaterThan(0);

      const validDifficulties: EquationDifficulty[] = ['Foundational', 'Intermediate', 'Advanced'];
      expect(validDifficulties).toContain(eq.difficulty);
    }
  });

  it('verifies that all plottable expressions are valid and parseable by the plot engine', () => {
    const plottableEquations = EQUATION_CATALOGUE.filter((e) => e.plottableExpr);
    expect(plottableEquations.length).toBeGreaterThanOrEqual(5);

    for (const eq of plottableEquations) {
      const parseResult = parseExpression(eq.plottableExpr!);
      expect(
        parseResult.success,
        `Plottable expression for ${eq.id} ("${eq.plottableExpr}") failed to parse: ${parseResult.error}`
      ).toBe(true);
    }
  });

  it('verifies derivation pattern IDs connect with genuine derivation templates', () => {
    const withDerivations = EQUATION_CATALOGUE.filter((e) => e.derivationPatternId);
    expect(withDerivations.length).toBeGreaterThanOrEqual(5);

    const validDerivationPatternIds = new Set([
      ...ALL_DERIVATIONS.map((d) => d.id),
      ...ALL_DERIVATIONS.map((d) => d.pattern)
    ]);

    for (const eq of withDerivations) {
      expect(
        validDerivationPatternIds.has(eq.derivationPatternId!),
        `Equation ${eq.id} references non-existent derivation pattern "${eq.derivationPatternId}"`
      ).toBe(true);

      const resolved = getDerivationByPattern(eq.derivationPatternId!);
      expect(resolved.derivation).toBeDefined();
    }
  });

  it('ensures engine-supported equations honestly map to verified canonical patterns', () => {
    const supportedEquations = EQUATION_CATALOGUE.filter((e) => e.isEngineSupported);
    expect(supportedEquations.length).toBeGreaterThanOrEqual(5);

    const canonicalPatterns = new Set([
      'matrix_multiplication',
      'vector_l2_norm',
      'sigmoid',
      'bayes_theorem',
      'linear_regression',
      'gaussian_pdf'
    ]);

    for (const eq of supportedEquations) {
      expect(eq.supportedEnginePattern).toBeDefined();
      expect(
        canonicalPatterns.has(eq.supportedEnginePattern!),
        `Supported engine pattern "${eq.supportedEnginePattern}" for ${eq.id} is not a valid canonical pattern`
      ).toBe(true);
    }
  });
});

describe('Equation Library - Filtering & Search Query Logic', () => {
  it('searches by equation title', () => {
    const query = 'bayes';
    const matches = EQUATION_CATALOGUE.filter((e) =>
      e.title.toLowerCase().includes(query)
    );
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches.some((e) => e.id === 'bayes-theorem')).toBe(true);
  });

  it('searches by keyword tag', () => {
    const query = 'genomics';
    const matches = EQUATION_CATALOGUE.filter((e) =>
      e.tags.some((t) => t.toLowerCase().includes(query))
    );
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches.some((e) => e.id === 'dna-gc-content')).toBe(true);
  });

  it('searches by variable name or symbol', () => {
    const query = 'sigma';
    const matches = EQUATION_CATALOGUE.filter((e) =>
      e.variables.some(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.symbol.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query)
      )
    );
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches.some((e) => e.id === 'gaussian-pdf')).toBe(true);
  });

  it('filters by category and difficulty simultaneously without conflict', () => {
    const cat: CatalogueCategory = 'Machine Learning';
    const diff: EquationDifficulty = 'Foundational';

    const matches = EQUATION_CATALOGUE.filter(
      (e) => e.category === cat && e.difficulty === diff
    );

    expect(matches.length).toBeGreaterThanOrEqual(2);
    for (const m of matches) {
      expect(m.category).toBe(cat);
      expect(m.difficulty).toBe(diff);
    }
  });

  it('supports sorting by title alphabetically ascending and descending', () => {
    const asc = [...EQUATION_CATALOGUE].sort((a, b) => a.title.localeCompare(b.title));
    const desc = [...EQUATION_CATALOGUE].sort((a, b) => b.title.localeCompare(a.title));

    expect(asc[0].title.localeCompare(asc[asc.length - 1].title)).toBeLessThan(0);
    expect(desc[0].title.localeCompare(desc[desc.length - 1].title)).toBeGreaterThan(0);
  });

  it('returns empty array cleanly when no equations match query', () => {
    const nonExistent = 'xyzNonExistentTerm123456789';
    const matches = EQUATION_CATALOGUE.filter(
      (e) =>
        e.title.toLowerCase().includes(nonExistent) ||
        e.description.toLowerCase().includes(nonExistent) ||
        e.tags.some((t) => t.includes(nonExistent))
    );
    expect(matches.length).toBe(0);
  });

  it('verifies that related equation IDs reference existing equations', () => {
    const allIds = new Set(EQUATION_CATALOGUE.map((e) => e.id));

    for (const eq of EQUATION_CATALOGUE) {
      for (const relId of eq.relatedEquationIds) {
        expect(
          allIds.has(relId),
          `Equation "${eq.id}" references non-existent related equation ID "${relId}"`
        ).toBe(true);
      }
    }
  });
});
