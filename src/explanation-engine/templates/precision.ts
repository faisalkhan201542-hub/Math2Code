import type { PatternDerivation } from '../types';

export const precisionDerivation: PatternDerivation = {
  id: 'precision',
  pattern: 'precision',
  title: 'Precision (Positive Predictive Value)',
  subtitle: 'Fidelity of Positive Classifications',
  category: 'Machine Learning & Optimization',
  summary:
    'Precision calculates the proportion of positive identifications that were actually correct, measuring the exactness and low false-alarm rate of a classification model.',
  canonicalFormulaLatex: '\\operatorname{Precision} = \\frac{TP}{TP + FP}',
  targetWhatItCalculates:
    'Computes the probability that an observation predicted as positive is a true positive.',
  symbols: [
    {
      symbol: 'TP',
      name: 'True Positives',
      mathDomain: 'TP \\in \\mathbb{N}_0',
      role: 'Count of correctly predicted positive instances.'
    },
    {
      symbol: 'FP',
      name: 'False Positives',
      mathDomain: 'FP \\in \\mathbb{N}_0',
      role: 'Count of negative instances mistakenly classified as positive (Type I error).'
    },
    {
      symbol: 'TP + FP',
      name: 'Total Positive Predictions',
      mathDomain: '(TP + FP) \\in \\mathbb{N}_0',
      role: 'Denominator representing all model positive classifications.'
    },
    {
      symbol: '\\operatorname{Precision}',
      name: 'Precision Metric',
      mathDomain: '\\operatorname{Precision} \\in [0.0, 1.0]',
      role: 'Ratio measuring purity of positive predictions.'
    }
  ],
  assumptions: [
    'Counts TP and FP must be non-negative integers.',
    'If total positive predictions TP + FP = 0, the denominator is zero; precision is conventionally defined as 0.0 (or undefined).',
    'Precision ignores False Negatives (FN); a model can achieve 1.0 precision by making only a single, highly conservative correct prediction.'
  ],
  steps: [
    {
      id: 'step-1-confusion-matrix',
      stepNumber: 1,
      title: 'Isolate Positive Model Predictions',
      latex: '\\text{Predictions} = \\{ \\hat{y} = 1 \\} = TP + FP',
      explanation:
        'Group all instances where the classifier output was positive. This set consists of instances that were actually positive (TP) and instances that were actually negative (FP).',
      pythonSnippet: 'total_predicted_positive = tp + fp',
      pythonExplanation: 'Sums true positives and false positives from confusion matrix.',
      keyTakeaway: 'The total number of times the model claimed a positive condition.'
    },
    {
      id: 'step-2-zero-division-guard',
      stepNumber: 2,
      title: 'Validate Denominator for Zero Division',
      latex: '\\text{If } TP + FP = 0 \\implies \\operatorname{Precision} \\equiv 0.0',
      explanation:
        'If the classifier made zero positive predictions, the denominator is 0. In scikit-learn and numerical evaluation, this edge case is handled by setting precision to 0.0 (zero_division parameter).',
      pythonSnippet: 'if total_predicted_positive == 0:\n    return 0.0',
      pythonExplanation: 'Defensive numerical guard prevents ZeroDivisionError.',
      keyTakeaway: 'Explicitly handles the zero positive prediction boundary condition.'
    },
    {
      id: 'step-3-ratio-calculation',
      stepNumber: 3,
      title: 'Calculate Ratio of True Positives to All Positive Predictions',
      latex: '\\operatorname{Precision} = \\frac{TP}{TP + FP}',
      explanation:
        'Divide True Positives by total positive predictions. A precision of 1.0 means every instance flagged as positive was indeed positive (zero false alarms).',
      pythonSnippet: 'precision = tp / (tp + fp)',
      pythonExplanation: 'Computes floating-point quotient bounded in [0.0, 1.0].',
      keyTakeaway: 'Quantifies prediction purity / confidence in positive flags.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Spam Classification Filter',
    description: 'Evaluate precision for an email spam filter on a validation test batch.',
    inputs: [
      {
        name: 'TP',
        value: '80',
        representation: 'TP = 80 \\text{ (actual spam emails correctly filtered)}'
      },
      {
        name: 'FP',
        value: '20',
        representation: 'FP = 20 \\text{ (legitimate emails mistakenly moved to spam)}'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Total Positive Flags',
        computation: 'TP + FP = 80 + 20',
        result: '100'
      },
      {
        step: 'Precision Ratio',
        computation: '\\frac{TP}{TP + FP} = \\frac{80}{100}',
        result: '0.80'
      }
    ],
    finalOutput: {
      name: 'Precision',
      value: '0.80 (80%)',
      interpretation: '80% of emails routed to the spam folder are actual spam; 20% are false alarms.'
    },
    verifiedNote: 'Verified analytically: 80 / (80 + 20) = 80 / 100 = 0.80.'
  },
  commonMistakes: [
    'Confusing Precision with Recall: Precision answers "Of all flagged positive, how many were right?", while Recall answers "Of all actual positive, how many did we catch?".',
    'Optimizing solely for Precision by raising decision threshold, which drives Recall toward zero.',
    'Crashing on zero division when evaluating rare class models.'
  ],
  numericalStabilityNotes: [
    'Always use float casting in division to avoid integer truncation.',
    'Always implement a zero_division fallback guard.'
  ],
  limitations: [
    'Ignores False Negatives completely.',
    'Heavily affected by class imbalance when evaluated in isolation.'
  ],
  catalogueId: 'precision-recall-f1',
  isEngineSupported: false,
  difficulty: 'Foundational',
  tags: ['classification', 'evaluation', 'metrics', 'precision', 'machine learning']
};
