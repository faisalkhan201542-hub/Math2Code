import type {
  DerivationPatternType,
  PatternDerivation,
  ExplanationResult
} from './types';
import { matrixMultDerivation } from './templates/matrixMult';
import { vectorNormDerivation } from './templates/vectorNorm';
import { sigmoidDerivation } from './templates/sigmoid';
import { bayesTheoremDerivation } from './templates/bayesTheorem';
import { linearRegressionDerivation } from './templates/linearRegression';
import { gaussianPdfDerivation } from './templates/gaussianPdf';
import { dotProductDerivation } from './templates/dotProduct';
import { euclideanDistanceDerivation } from './templates/euclideanDistance';
import { meanSquaredErrorDerivation } from './templates/meanSquaredError';
import { meanAbsoluteErrorDerivation } from './templates/meanAbsoluteError';
import { varianceDerivation } from './templates/variance';
import { covarianceDerivation } from './templates/covariance';
import { pearsonCorrelationDerivation } from './templates/pearsonCorrelation';
import { gradientDescentDerivation } from './templates/gradientDescent';
import { precisionDerivation } from './templates/precision';
import { recallDerivation } from './templates/recall';
import { f1ScoreDerivation } from './templates/f1Score';
import { chainRuleDerivation } from './templates/chainRule';
import { l1RegularizationDerivation } from './templates/l1Regularization';
import { l2RegularizationDerivation } from './templates/l2Regularization';
import { zScoreDerivation } from './templates/zScore';
import { entropyDerivation } from './templates/entropy';
import { klDivergenceDerivation } from './templates/klDivergence';
import { softmaxDerivation } from './templates/softmax';
import { reluDerivation } from './templates/relu';
import { binaryCrossEntropyDerivation } from './templates/binaryCrossEntropy';

export * from './types';
export { matrixMultDerivation } from './templates/matrixMult';
export { vectorNormDerivation } from './templates/vectorNorm';
export { sigmoidDerivation } from './templates/sigmoid';
export { bayesTheoremDerivation } from './templates/bayesTheorem';
export { linearRegressionDerivation } from './templates/linearRegression';
export { gaussianPdfDerivation } from './templates/gaussianPdf';
export { dotProductDerivation } from './templates/dotProduct';
export { euclideanDistanceDerivation } from './templates/euclideanDistance';
export { meanSquaredErrorDerivation } from './templates/meanSquaredError';
export { meanAbsoluteErrorDerivation } from './templates/meanAbsoluteError';
export { varianceDerivation } from './templates/variance';
export { covarianceDerivation } from './templates/covariance';
export { pearsonCorrelationDerivation } from './templates/pearsonCorrelation';
export { gradientDescentDerivation } from './templates/gradientDescent';
export { precisionDerivation } from './templates/precision';
export { recallDerivation } from './templates/recall';
export { f1ScoreDerivation } from './templates/f1Score';
export { chainRuleDerivation } from './templates/chainRule';
export { l1RegularizationDerivation } from './templates/l1Regularization';
export { l2RegularizationDerivation } from './templates/l2Regularization';
export { zScoreDerivation } from './templates/zScore';
export { entropyDerivation } from './templates/entropy';
export { klDivergenceDerivation } from './templates/klDivergence';
export { softmaxDerivation } from './templates/softmax';
export { reluDerivation } from './templates/relu';
export { binaryCrossEntropyDerivation } from './templates/binaryCrossEntropy';

export const ALL_DERIVATIONS: PatternDerivation[] = [
  matrixMultDerivation,
  vectorNormDerivation,
  sigmoidDerivation,
  bayesTheoremDerivation,
  linearRegressionDerivation,
  gaussianPdfDerivation,
  dotProductDerivation,
  euclideanDistanceDerivation,
  meanSquaredErrorDerivation,
  meanAbsoluteErrorDerivation,
  varianceDerivation,
  covarianceDerivation,
  pearsonCorrelationDerivation,
  gradientDescentDerivation,
  precisionDerivation,
  recallDerivation,
  f1ScoreDerivation,
  chainRuleDerivation,
  l1RegularizationDerivation,
  l2RegularizationDerivation,
  zScoreDerivation,
  entropyDerivation,
  klDivergenceDerivation,
  softmaxDerivation,
  reluDerivation,
  binaryCrossEntropyDerivation
];

const DERIVATION_MAP: Record<string, PatternDerivation> = {
  // Canonical 6
  matrix_multiplication: matrixMultDerivation,
  'matrix-multiplication': matrixMultDerivation,
  vector_l2_norm: vectorNormDerivation,
  'vector-l2-norm': vectorNormDerivation,
  sigmoid: sigmoidDerivation,
  bayes_theorem: bayesTheoremDerivation,
  'bayes-theorem': bayesTheoremDerivation,
  linear_regression: linearRegressionDerivation,
  'linear-regression': linearRegressionDerivation,
  gaussian_pdf: gaussianPdfDerivation,
  'gaussian-pdf': gaussianPdfDerivation,

  // New 20 topics
  dot_product: dotProductDerivation,
  'dot-product': dotProductDerivation,
  euclidean_distance: euclideanDistanceDerivation,
  'euclidean-distance': euclideanDistanceDerivation,
  mean_squared_error: meanSquaredErrorDerivation,
  'mean-squared-error': meanSquaredErrorDerivation,
  mean_absolute_error: meanAbsoluteErrorDerivation,
  'mean-absolute-error': meanAbsoluteErrorDerivation,
  variance: varianceDerivation,
  covariance: covarianceDerivation,
  pearson_correlation: pearsonCorrelationDerivation,
  'pearson-correlation': pearsonCorrelationDerivation,
  gradient_descent: gradientDescentDerivation,
  'gradient-descent': gradientDescentDerivation,
  precision: precisionDerivation,
  recall: recallDerivation,
  f1_score: f1ScoreDerivation,
  'f1-score': f1ScoreDerivation,
  chain_rule: chainRuleDerivation,
  'chain-rule': chainRuleDerivation,
  l1_regularization: l1RegularizationDerivation,
  'l1-regularization': l1RegularizationDerivation,
  l2_regularization: l2RegularizationDerivation,
  'l2-regularization': l2RegularizationDerivation,
  z_score: zScoreDerivation,
  'z-score': zScoreDerivation,
  entropy: entropyDerivation,
  shannon_entropy: entropyDerivation,
  'shannon-entropy': entropyDerivation,
  kl_divergence: klDivergenceDerivation,
  'kl-divergence': klDivergenceDerivation,
  softmax: softmaxDerivation,
  relu: reluDerivation,
  binary_cross_entropy: binaryCrossEntropyDerivation,
  'binary-cross-entropy': binaryCrossEntropyDerivation
};

export function getDerivationByPattern(pattern: DerivationPatternType | string): ExplanationResult {
  const normKey = pattern.toLowerCase().trim().replace(/\s+/g, '_');
  const derivation = DERIVATION_MAP[normKey] || DERIVATION_MAP[pattern];

  if (derivation) {
    return {
      status: 'success',
      derivation
    };
  }

  return {
    status: 'unsupported',
    errorMessage: `Mathematical pattern '${pattern}' does not have a verified derivation template currently. Supported patterns include 26 verified derivations across Linear Algebra, Statistics, Machine Learning, Information Theory, and Deep Learning.`
  };
}

export function getDerivationById(id: string): PatternDerivation | undefined {
  const norm = id.toLowerCase().trim();
  return ALL_DERIVATIONS.find(
    (d) =>
      d.id === norm ||
      d.pattern === norm ||
      d.id.replace(/_/g, '-') === norm ||
      d.catalogueId === norm
  );
}
