import type { PatternDerivation } from '../types';

export const recallDerivation: PatternDerivation = {
  id: 'recall',
  pattern: 'recall',
  title: 'Recall (Sensitivity / True Positive Rate)',
  subtitle: 'Coverage & Detection Rate of Ground-Truth Positives',
  category: 'Machine Learning & Optimization',
  summary:
    'Recall measures the proportion of actual positives that were correctly identified by the model. It is critical in high-stakes diagnostic domains such as disease detection where false negatives carry severe consequences.',
  canonicalFormulaLatex: '\\operatorname{Recall} = \\frac{TP}{TP + FN}',
  targetWhatItCalculates:
    'Computes the probability that a truly positive condition will be detected by the classifier.',
  symbols: [
    {
      symbol: 'TP',
      name: 'True Positives',
      mathDomain: 'TP \\in \\mathbb{N}_0',
      role: 'Correctly detected positive conditions.'
    },
    {
      symbol: 'FN',
      name: 'False Negatives',
      mathDomain: 'FN \\in \\mathbb{N}_0',
      role: 'Actual positive instances that were missed by the classifier (Type II error).'
    },
    {
      symbol: 'TP + FN',
      name: 'Total Actual Positives',
      mathDomain: '(TP + FN) \\in \\mathbb{N}_0',
      role: 'All true cases present in the evaluation cohort.'
    },
    {
      symbol: '\\operatorname{Recall}',
      name: 'Recall / Sensitivity',
      mathDomain: '\\operatorname{Recall} \\in [0.0, 1.0]',
      role: 'Proportion of true positive cases captured.'
    }
  ],
  assumptions: [
    'Counts TP and FN must be non-negative integers.',
    'If total ground-truth positives TP + FN = 0, recall is conventionally defined as 0.0 (or undefined).',
    'Recall does not penalize False Positives; a model that blindly classifies all samples as positive will achieve a perfect recall of 1.0.'
  ],
  steps: [
    {
      id: 'step-1-actual-positives',
      stepNumber: 1,
      title: 'Identify Total Actual Positive Cohort',
      latex: '\\text{Actual Positives} = \\{ y = 1 \\} = TP + FN',
      explanation:
        'Count all instances in the dataset that truly possess the positive condition. This includes both those correctly caught (TP) and those mistakenly missed as negative (FN).',
      pythonSnippet: 'total_actual_positive = tp + fn',
      pythonExplanation: 'Sums all ground-truth positive cases.',
      keyTakeaway: 'The total real-world pool of positive instances to be discovered.'
    },
    {
      id: 'step-2-zero-guard',
      stepNumber: 2,
      title: 'Zero Denominator Guard',
      latex: '\\text{If } TP + FN = 0 \\implies \\operatorname{Recall} \\equiv 0.0',
      explanation:
        'If the dataset contains zero actual positive instances, the denominator is zero. To prevent division by zero in automated evaluation, recall is defined as 0.0.',
      pythonSnippet: 'if total_actual_positive == 0:\n    return 0.0',
      pythonExplanation: 'Numerical guard preventing runtime division by zero.',
      keyTakeaway: 'Explicitly specifies behavior when no positive cases exist in the cohort.'
    },
    {
      id: 'step-3-sensitivity-ratio',
      stepNumber: 3,
      title: 'Compute Recall Detection Ratio',
      latex: '\\operatorname{Recall} = \\frac{TP}{TP + FN}',
      explanation:
        'Divide True Positives by the sum of True Positives and False Negatives. In medical diagnostics, a recall of 0.95 means 95% of patients with the condition were caught, and 5% were missed.',
      pythonSnippet: 'recall = tp / (tp + fn)',
      pythonExplanation: 'Computes sensitivity fraction bounded in [0.0, 1.0].',
      keyTakeaway: 'Measures completeness / coverage of true positive discovery.'
    }
  ],
  workedExample: {
    title: 'Numerical Demonstration: Medical Disease Screening Cohort',
    description: 'Calculate recall for a diagnostic screening test on a patient cohort with 100 sick individuals.',
    inputs: [
      {
        name: 'TP',
        value: '95',
        representation: 'TP = 95 \\text{ (sick patients correctly identified by test)}'
      },
      {
        name: 'FN',
        value: '5',
        representation: 'FN = 5 \\text{ (sick patients missed / false negative)}'
      }
    ],
    stepByStepComputation: [
      {
        step: 'Total Actual Sick Patients',
        computation: 'TP + FN = 95 + 5',
        result: '100'
      },
      {
        step: 'Recall Ratio',
        computation: '\\frac{TP}{TP + FN} = \\frac{95}{100}',
        result: '0.95'
      }
    ],
    finalOutput: {
      name: 'Recall',
      value: '0.95 (95%)',
      interpretation: 'The diagnostic screening detects 95% of actual sick patients, missing only 5%.'
    },
    verifiedNote: 'Verified analytically: 95 / (95 + 5) = 95 / 100 = 0.95.'
  },
  commonMistakes: [
    'Confusing False Negatives with False Positives.',
    'Maximizing recall by trivially predicting positive for every sample (which causes precision to crater).',
    'Failing to handle cohorts where actual positive count is zero.'
  ],
  numericalStabilityNotes: [
    'Ensure float conversion in integer division environments.',
    'Include explicit zero_division fallback parameter.'
  ],
  limitations: [
    'Completely blind to False Positives; must be paired with Precision or Specificity to assess overall model quality.',
    'In heavily imbalanced datasets, high recall can accompany unacceptable false alarm rates.'
  ],
  catalogueId: 'precision-recall-f1',
  isEngineSupported: false,
  difficulty: 'Foundational',
  tags: ['classification', 'evaluation', 'metrics', 'recall', 'sensitivity', 'medical']
};
