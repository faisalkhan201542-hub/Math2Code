import type { PatternDerivation } from '../types';

export const f1ScoreDerivation: PatternDerivation = {
  id: 'f1-score',
  pattern: 'f1_score',
  title: 'F1-Score (Harmonic Mean of Precision and Recall)',
  subtitle: 'Balanced Performance Metric for Imbalanced Classification',
  category: 'Machine Learning & Optimization',
  summary:
    'The F1-score is the harmonic mean of precision and recall. Because the harmonic mean gives disproportionate weight to lower values, a model can only achieve a high F1-score if both precision and recall are simultaneously high.',
  canonicalFormulaLatex: 'F_1 = 2 \\cdot \\frac{\\operatorname{Precision} \\cdot \\operatorname{Recall}}{\\operatorname{Precision} + \\operatorname{Recall}} = \\frac{2TP}{2TP + FP + FN}',
  targetWhatItCalculates:
    'Provides a unified, balanced metric combining precision and recall into a single scalar value between 0.0 and 1.0.',
  symbols: [
    {
      symbol: 'P',
      name: 'Precision',
      mathDomain: 'P \\in [0.0, 1.0]',
      role: 'Fraction of positive predictions that are correct (TP / (TP + FP)).'
    },
    {
      symbol: 'R',
      name: 'Recall',
      mathDomain: 'R \\in [0.0, 1.0]',
      role: 'Fraction of actual positive cases captured (TP / (TP + FN)).'
    },
    {
      symbol: 'TP, FP, FN',
      name: 'Confusion Matrix Elements',
      mathDomain: 'TP, FP, FN \\in \\mathbb{N}_0',
      role: 'True Positives, False Positives, False Negatives.'
    },
    {
      symbol: 'F_1',
      name: 'F1 Score',
      mathDomain: 'F_1 \\in [0.0, 1.0]',
      role: 'Harmonic mean score.'
    }
  ],
  assumptions: [
    'Precision P and Recall R must be in [0.0, 1.0].',
    'If P + R = 0 (or 2TP + FP + FN = 0), F1 is strictly defined as 0.0 to prevent division by zero.',
    'Weights precision and recall equally (beta = 1.0).'
  ],
  steps: [
    {
      id: 'step-1-why-harmonic-mean',
      stepNumber: 1,
      title: 'Why the Harmonic Mean Rather than Arithmetic Mean?',
      latex: 'H(P, R) = \\frac{2}{\\frac{1}{P} + \\frac{1}{R}} = 2 \\cdot \\frac{P \\cdot R}{P + R}',
      explanation:
        'If we used the simple arithmetic mean (P + R) / 2, a trivial model with P = 1.0 and R = 0.0 would receive an unearned score of 0.50. In contrast, the harmonic mean penalizes extreme disparities: if either P or R approaches 0, the harmonic mean drops sharply to 0.',
      pythonSnippet: 'harmonic_mean = 2 * (p * r) / (p + r) if (p + r) > 0 else 0.0',
      pythonExplanation: 'Computes reciprocal average of precision and recall.',
      keyTakeaway: 'The harmonic mean ensures a high score requires BOTH precision and recall to be strong.'
    },
    {
      id: 'step-2-confusion-matrix-expansion',
      stepNumber: 2,
      title: 'Derive Confusion Matrix Equivalence',
      latex: 'F_1 = 2 \\cdot \\frac{\\left(\\frac{TP}{TP + FP}\\right) \\left(\\frac{TP}{TP + FN}\\right)}{\\frac{TP}{TP + FP} + \\frac{TP}{TP + FN}} = \\frac{2TP}{2TP + FP + FN}',
      explanation:
        'Substituting P = TP / (TP + FP) and R = TP / (TP + FN) into the harmonic mean formula. Finding a common denominator in the divisor and simplifying fractions leads directly to 2TP / (2TP + FP + FN).',
      pythonSnippet: 'f1 = (2 * tp) / (2 * tp + fp + fn) if (2 * tp + fp + fn) > 0 else 0.0',
      pythonExplanation: 'Direct formula avoids computing intermediate floating-point P and R.',
      keyTakeaway: 'Proves the exact mathematical equivalence between the two standard formulations.'
    },
    {
      id: 'step-3-zero-denominator-guard',
      stepNumber: 3,
      title: 'Handle Zero Denominator Boundary Condition',
      latex: '\\text{If } 2TP + FP + FN = 0 \\implies F_1 \\equiv 0.0',
      explanation:
        'When there are zero true positives, zero false positives, and zero false negatives, the denominator is zero. In all standard machine learning implementations, F1 is defined as 0.0.',
      pythonSnippet: 'if (2 * tp + fp + fn) == 0:\n    return 0.0',
      pythonExplanation: 'Guarantees safe numerical evaluation across all confusion matrix states.',
      keyTakeaway: 'Explicitly handles the zero-positive prediction and detection edge case.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Balanced Evaluation',
    description: 'Calculate F1 score from Precision = 0.80 and Recall = 0.95 (derived from TP=80, FP=20, FN=5).',
    inputs: [
      {
        name: 'Precision',
        value: '0.80',
        representation: 'P = 0.80 \\; (TP=80, FP=20)'
      },
      {
        name: 'Recall',
        value: '0.95',
        representation: 'R = 0.95 \\; (TP=80, FN=5)'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Numerator: 2 * P * R',
        computation: '2 \\times 0.80 \\times 0.95 = 2 \\times 0.76',
        result: '1.52'
      },
      {
        step: 'Denominator: P + R',
        computation: '0.80 + 0.95',
        result: '1.75'
      },
      {
        step: 'Harmonic Ratio',
        computation: '\\frac{1.52}{1.75}',
        result: '0.8686'
      },
      {
        step: 'Verification via Confusion Matrix',
        computation: '\\frac{2(80)}{2(80) + 20 + 5} = \\frac{160}{160 + 25} = \\frac{160}{185}',
        result: '0.8686'
      }
    ],
    finalOutput: {
      name: 'F1 Score',
      value: '0.8686 (86.86%)',
      interpretation: 'Both formulations yield identically 0.8686, reflecting balanced, robust classifier performance.'
    },
    verifiedNote: 'Verified analytically: 2 * (0.8 * 0.95) / (0.8 + 0.95) = 1.52 / 1.75 = 0.868571... matches 160 / 185 = 0.868571...'
  },
  commonMistakes: [
    'Averaging precision and recall arithmetically instead of harmonically.',
    'Assuming F1 accounts for True Negatives (TN); F1 completely ignores TN (use Matthews Correlation Coefficient MCC if true negatives matter).',
    'Failing to implement zero-division protection when P = 0 and R = 0.'
  ],
  numericalStabilityNotes: [
    'Direct confusion matrix formula 2TP / (2TP + FP + FN) is numerically preferable to 2PR/(P+R) because it avoids intermediate division roundoff.',
    'Outputs are guaranteed bounded in [0.0, 1.0].'
  ],
  limitations: [
    'Treats Precision and Recall with equal importance; for asymmetric costs, F_beta score with beta != 1 should be preferred.',
    'Insensitive to True Negatives.'
  ],
  catalogueId: 'precision-recall-f1',
  isEngineSupported: false,
  difficulty: 'Foundational',
  tags: ['classification', 'evaluation', 'metrics', 'f1 score', 'harmonic mean']
};
