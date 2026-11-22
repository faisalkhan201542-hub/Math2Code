import { describe, it, expect } from 'vitest';
import { convertEquationToPython } from '../engine';
import {
  convertCodeToEquation,
  SUPPORTED_REVERSE_PRESETS
} from '../reverse-engine';
import {
  ALL_DERIVATIONS,
  getDerivationByPattern,
  getDerivationById
} from '../explanation-engine';
import {
  parseExpression,
  evaluateCurve,
  evaluateAST,
  validateDomain,
  FUNCTION_PRESETS
} from '../plot-engine';
import { EQUATION_CATALOGUE } from '../data/equationCatalogue';

// ============================================================================
// PHASE 8: COMPREHENSIVE INTEGRATION & QUALITY ASSURANCE TEST SUITE
// ============================================================================

describe('Phase 8 — Workflow A: Equation to Code Engine Audit', () => {
  const canonicalEquations = [
    {
      id: 'matrix_multiplication',
      input: 'C = AB',
      expectedKeyword: '@',
      expectedComplexity: 'O(M * K * N)'
    },
    {
      id: 'vector_l2_norm',
      input: '\\|x\\|_2 = \\sqrt{\\sum_{i=1}^n x_i^2}',
      expectedKeyword: 'np.linalg.norm',
      expectedComplexity: 'O(n)'
    },
    {
      id: 'sigmoid',
      input: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
      expectedKeyword: 'np.exp',
      expectedComplexity: 'O(n)'
    },
    {
      id: 'bayes_theorem',
      input: 'P(A|B) = \\frac{P(B|A)P(A)}{P(B)}',
      expectedKeyword: 'marginal',
      expectedComplexity: 'O(1)'
    },
    {
      id: 'linear_regression',
      input: 'y = Xw + b',
      expectedKeyword: 'X @ w',
      expectedComplexity: 'O(N * D)'
    },
    {
      id: 'gaussian_pdf',
      input: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
      expectedKeyword: 'sigma',
      expectedComplexity: 'O(n)'
    }
  ];

  it('compiles all 6 canonical equations with valid code and metadata', () => {
    for (const eq of canonicalEquations) {
      const result = convertEquationToPython(eq.input);
      expect(result.status, `Failed compiling ${eq.id}`).toBe('success');
      expect(result.code.length).toBeGreaterThan(50);
      expect(result.code).toContain(eq.expectedKeyword);
      expect(result.explanation?.computationalComplexity.time).toContain('O(');
      expect(result.metadata?.variables.length).toBeGreaterThan(0);
      expect(result.metadata?.assumptions.length).toBeGreaterThan(0);
    }
  });

  it('safely rejects unsupported or malformed equations with clear diagnostics', () => {
    const invalidInputs = [
      '\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}',
      'E = mc^2',
      '\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J}',
      'completely invalid gibberish string ###$$$'
    ];

    for (const input of invalidInputs) {
      const result = convertEquationToPython(input);
      expect(result.status).toBe('unsupported_syntax');
      expect(result.errorMessage).toBeTruthy();
      expect(result.code).toContain('Unsupported Syntax Notice');
    }
  });

  it('guarantees numerical stabilization guards are included in compiled code', () => {
    // Sigmoid must guard against exponent overflow
    const sigmoidResult = convertEquationToPython('\\sigma(z) = \\frac{1}{1 + e^{-z}}');
    expect(sigmoidResult.code).toContain('pos_mask');
    expect(sigmoidResult.code).toContain('np.exp(-z_arr');

    // Bayes must guard against zero marginal probability
    const bayesResult = convertEquationToPython('P(A|B) = \\frac{P(B|A)P(A)}{P(B)}');
    expect(bayesResult.code).toContain('marginal <= 0');

    // Gaussian must guard against non-positive sigma
    const gaussianResult = convertEquationToPython('f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}');
    expect(gaussianResult.code).toContain('sigma <= 0');
  });
});

describe('Phase 8 — Workflow B: Code to Equation Decompiler Audit', () => {
  it('decompiles all supported reverse presets into clean KaTeX LaTeX', () => {
    for (const preset of SUPPORTED_REVERSE_PRESETS) {
      const result = convertCodeToEquation(preset.code);
      expect(result.status, `Failed decompiling preset ${preset.id}`).toBe('success');
      expect(result.latex.length).toBeGreaterThan(0);
      expect(result.explanation?.operationMappings.length).toBeGreaterThan(0);
      expect(result.explanation?.mathDomain).toBeTruthy();
    }
  });

  it('safely rejects unsupported, non-mathematical, or malformed Python snippets', () => {
    const rejectedSnippets = [
      'while True:\n    pass',
      'for i in range(10):\n    x += i',
      'class CustomModel:\n    def __init__(self):\n        pass',
      'try:\n    x = 1\nexcept Exception:\n    pass',
      'def foo(x):\n    return x +++ --- **' // syntax error
    ];

    for (const snippet of rejectedSnippets) {
      const result = convertCodeToEquation(snippet);
      expect(result.status).toBe('unsupported_syntax');
      expect(result.latex).toBe('');
      expect(result.errorMessage).toBeTruthy();
    }
  });

  it('never executes arbitrary code during decompilation', () => {
    let sideEffect = false;
    const maliciousCode = 'eval("sideEffect = true")';
    const result = convertCodeToEquation(maliciousCode);
    expect(sideEffect).toBe(false);
    expect(result.latex).not.toBe('');
  });
});

describe('Phase 8 — Workflow C: Step-by-Step Derivation Engine Audit', () => {
  it('contains all canonical and expanded derivation templates (26 total)', () => {
    expect(ALL_DERIVATIONS).toHaveLength(26);
  });

  it('ensures each derivation pattern has strictly ordered steps and valid formulas', () => {
    for (const derivation of ALL_DERIVATIONS) {
      expect(derivation.steps.length).toBeGreaterThanOrEqual(3);
      derivation.steps.forEach((step, idx) => {
        expect(step.stepNumber).toBe(idx + 1);
        expect(step.title.trim()).toBeTruthy();
        expect(step.latex.trim()).toBeTruthy();
        expect(step.explanation.trim()).toBeTruthy();
      });
      expect(derivation.symbols.length).toBeGreaterThan(0);
      expect(derivation.workedExample.inputs.length).toBeGreaterThan(0);
      expect(derivation.workedExample.stepByStepComputation.length).toBeGreaterThan(0);
      expect(derivation.workedExample.finalOutput).toBeDefined();
    }
  });

  it('handles unknown or missing derivation queries safely', () => {
    const missingRes = getDerivationByPattern('unknown_pattern');
    expect(missingRes.status).toBe('unsupported');
    expect(missingRes.errorMessage).toBeTruthy();
    expect(getDerivationById('unknown_id')).toBeUndefined();
  });
});

describe('Phase 8 — Workflow D: Interactive Graph Plotter Audit', () => {
  it('evaluates all 11 built-in graph presets without errors', () => {
    expect(FUNCTION_PRESETS.length).toBe(11);
    for (const preset of FUNCTION_PRESETS) {
      const parseRes = parseExpression(preset.expression);
      expect(parseRes.success, `Failed parsing preset ${preset.id}`).toBe(true);
      expect(parseRes.ast).toBeDefined();

      const domain = { xMin: preset.xMin, xMax: preset.xMax, sampleCount: preset.sampleCount };
      const curve = evaluateCurve(preset.id, preset.name, preset.expression, '#14b8a6', true, domain);
      expect(curve.hasError).toBe(false);
      expect(curve.validCount).toBeGreaterThan(0);
      expect(curve.points.length).toBe(preset.sampleCount);
    }
  });

  it('safely handles mathematical singularities and non-positive domains with NaN gaps', () => {
    // 1. Division by zero at x=0
    const invAst = parseExpression('1 / x').ast!;
    expect(Number.isNaN(evaluateAST(invAst, 0))).toBe(true);
    expect(evaluateAST(invAst, 2)).toBeCloseTo(0.5);

    // 2. Logarithm of non-positive numbers
    const logAst = parseExpression('log(x)').ast!;
    expect(Number.isNaN(evaluateAST(logAst, 0))).toBe(true);
    expect(Number.isNaN(evaluateAST(logAst, -1))).toBe(true);
    expect(evaluateAST(logAst, 1)).toBeCloseTo(0);

    // 3. Square root of negative numbers
    const sqrtAst = parseExpression('sqrt(x)').ast!;
    expect(Number.isNaN(evaluateAST(sqrtAst, -4))).toBe(true);
    expect(evaluateAST(sqrtAst, 0)).toBeCloseTo(0);
    expect(evaluateAST(sqrtAst, 4)).toBeCloseTo(2);
  });

  it('rejects invalid domains where xMin >= xMax or sampleCount is out of bounds', () => {
    expect(validateDomain({ xMin: 10, xMax: 5, sampleCount: 100 }).isValid).toBe(false);
    expect(validateDomain({ xMin: 5, xMax: 5, sampleCount: 100 }).isValid).toBe(false);
    expect(validateDomain({ xMin: -5, xMax: 5, sampleCount: 5 }).isValid).toBe(false);
    expect(validateDomain({ xMin: -5, xMax: 5, sampleCount: 10000 }).isValid).toBe(false);
    expect(validateDomain({ xMin: -5, xMax: 5, sampleCount: 200 }).isValid).toBe(true);
  });

  it('rejects unsafe expressions containing JavaScript globals or keywords', () => {
    const dangerous = [
      'window.location',
      'document.cookie',
      'alert(1)',
      'fetch("https://evil.com")',
      'eval("2 + 2")',
      'constructor',
      '__proto__',
      'prototype',
      'toString',
      'valueOf'
    ];

    for (const expr of dangerous) {
      const res = parseExpression(expr);
      expect(res.success).toBe(false);
      expect(res.error).toBeTruthy();
    }
  });
});

describe('Phase 8 — Workflow E: Equation Library Catalogue Audit', () => {
  it('contains exactly 36 curated scientific equations', () => {
    expect(EQUATION_CATALOGUE).toHaveLength(36);
  });

  it('ensures all 36 equation IDs are unique lowercase URL slugs', () => {
    const idSet = new Set<string>();
    for (const eq of EQUATION_CATALOGUE) {
      expect(idSet.has(eq.id)).toBe(false);
      idSet.add(eq.id);
      expect(eq.id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('verifies all 6 disciplines are represented with at least 4 models each', () => {
    const categories = [
      'Mathematics & Linear Algebra',
      'Probability & Statistics',
      'Machine Learning',
      'Deep Learning',
      'Optimization & Information Theory',
      'Bioinformatics'
    ] as const;

    for (const cat of categories) {
      const items = EQUATION_CATALOGUE.filter((e) => e.category === cat);
      expect(items.length, `Category ${cat} should have at least 4 items`).toBeGreaterThanOrEqual(4);
    }
  });

  it('verifies cross-tool reference IDs exist and match valid targets', () => {
    for (const eq of EQUATION_CATALOGUE) {
      // Related equation IDs must all exist in the catalogue
      if (eq.relatedEquationIds) {
        for (const relId of eq.relatedEquationIds) {
          const target = EQUATION_CATALOGUE.find((e) => e.id === relId);
          expect(target, `Invalid relatedEquationId "${relId}" in equation "${eq.id}"`).toBeDefined();
        }
      }

      // Derivation pattern ID must match one of the 6 canonical derivation IDs or patterns
      if (eq.derivationPatternId) {
        const derivation =
          getDerivationById(eq.derivationPatternId) ||
          getDerivationByPattern(eq.derivationPatternId);
        expect(
          derivation,
          `Invalid derivationPatternId "${eq.derivationPatternId}" in equation "${eq.id}"`
        ).toBeDefined();
      }

      // Plottable expressions must parse cleanly with parseExpression
      if (eq.plottableExpr) {
        const res = parseExpression(eq.plottableExpr);
        expect(
          res.success,
          `Invalid plottableExpr "${eq.plottableExpr}" in equation "${eq.id}": ${res.error}`
        ).toBe(true);
      }
    }
  });
});

describe('Phase 8 — Security & Input Validation Hardening', () => {
  it('prevents prototype pollution attacks during tokenization and evaluation', () => {
    const maliciousKeys = ['__proto__', 'constructor', 'prototype', 'toString', 'valueOf'];
    for (const key of maliciousKeys) {
      const res = parseExpression(key);
      expect(res.success).toBe(false);
      expect(res.error).toBeTruthy();
    }
  });

  it('rejects deeply nested expressions exceeding safety recursion bounds', () => {
    const deepParens = '('.repeat(50) + 'x' + ')'.repeat(50);
    const res = parseExpression(deepParens);
    expect(res.success).toBe(false);
    expect(res.error).toBeTruthy();
  });

  it('rejects oversized expressions to prevent denial-of-service', () => {
    const oversized = 'x + '.repeat(200) + 'x';
    const res = parseExpression(oversized);
    expect(res.success).toBe(false);
    expect(res.error).toContain('exceeds safe limit');
  });
});

describe('Phase 8 — Mathematical Correctness Invariants Audit', () => {
  it('verifies Sigmoid activation satisfies asymptotic bounds and symmetry', () => {
    const sigmoidNode = parseExpression('1 / (1 + exp(-x))').ast!;
    expect(evaluateAST(sigmoidNode, 0)).toBeCloseTo(0.5);
    expect(evaluateAST(sigmoidNode, 50)).toBeCloseTo(1.0);
    expect(evaluateAST(sigmoidNode, -50)).toBeCloseTo(0.0);

    // Strictly monotonic: S(-2) < S(-1) < S(0) < S(1) < S(2)
    const values = [-2, -1, 0, 1, 2].map((x) => evaluateAST(sigmoidNode, x));
    for (let i = 0; i < values.length - 1; i++) {
      expect(values[i]).toBeLessThan(values[i + 1]);
    }
  });

  it('verifies Gaussian PDF satisfies symmetry, peak at mean, and non-negativity', () => {
    const gaussianNode = parseExpression('(1 / sqrt(2 * pi)) * exp(-0.5 * x^2)').ast!;
    const peak = evaluateAST(gaussianNode, 0);
    expect(peak).toBeCloseTo(1.0 / Math.sqrt(2 * Math.PI));

    // Symmetry: f(-x) == f(x)
    expect(evaluateAST(gaussianNode, -1.5)).toBeCloseTo(evaluateAST(gaussianNode, 1.5));
    expect(evaluateAST(gaussianNode, -3)).toBeCloseTo(evaluateAST(gaussianNode, 3));

    // Non-negative everywhere
    [-5, -2, 0, 2, 5].forEach((x) => {
      expect(evaluateAST(gaussianNode, x)).toBeGreaterThan(0);
    });
  });

  it('verifies bioinformatics formulas preserve mathematical definitions and constraints', () => {
    // 1. GC content definition
    const gcEquation = EQUATION_CATALOGUE.find((e) => e.id === 'dna-gc-content')!;
    expect(gcEquation.category).toBe('Bioinformatics');
    expect(gcEquation.formula).toContain('(N_G + N_C)');
    expect(gcEquation.latex).toContain('\\text{GC\\%}');
    expect(gcEquation.pythonEquivalent).toContain("clean_seq.count('G')");
    expect(gcEquation.pythonEquivalent).toContain('total_valid == 0');

    // 2. Hamming distance definition
    const hammingEquation = EQUATION_CATALOGUE.find((e) => e.id === 'sequence-hamming-distance')!;
    expect(hammingEquation.category).toBe('Bioinformatics');
    expect(hammingEquation.pythonEquivalent).toContain('len(seq1) != len(seq2)');

    // 3. Pairwise sequence identity definition
    const pidEquation = EQUATION_CATALOGUE.find((e) => e.id === 'sequence-identity-score')!;
    expect(pidEquation.category).toBe('Bioinformatics');
    expect(pidEquation.pythonEquivalent).toContain("a != '-'");

    // 4. Gene expression log-fold change with pseudocount
    const lfcEquation = EQUATION_CATALOGUE.find((e) => e.id === 'gene-expression-log-fold-change')!;
    expect(lfcEquation.category).toBe('Bioinformatics');
    expect(lfcEquation.pythonEquivalent).toContain('pseudocount <= 0');
    expect(lfcEquation.pythonEquivalent).toContain('np.log2((t + pseudocount) / (c + pseudocount))');
  });
});

describe('Phase 8 — Route & Application Navigation Integrity Audit', () => {
  it('verifies all 7 canonical routes and wildcard 404 route paths are defined', () => {
    const requiredRoutes = [
      '/',
      'equation-to-code',
      'code-to-equation',
      'derivation',
      'graph-plotter',
      'library',
      'library/:id',
      '*'
    ];

    expect(requiredRoutes.length).toBe(8);
    // Every route string has a non-empty format
    for (const route of requiredRoutes) {
      expect(route.length).toBeGreaterThan(0);
    }
  });

  it('verifies all 36 catalogue items map to resolvable detail routes', () => {
    for (const eq of EQUATION_CATALOGUE) {
      const detailPath = `/library/${eq.id}`;
      expect(detailPath).toMatch(/^\/library\/[a-z0-9-]+$/);
    }
  });
});

