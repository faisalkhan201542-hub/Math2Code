export type DerivationPatternType =
  // Original Phase 5 canonical derivations (Compiler supported)
  | 'matrix_multiplication'
  | 'vector_l2_norm'
  | 'sigmoid'
  | 'bayes_theorem'
  | 'linear_regression'
  | 'gaussian_pdf'
  // Phase 9 expanded derivations (20 new topics)
  | 'dot_product'
  | 'euclidean_distance'
  | 'mean_squared_error'
  | 'mean_absolute_error'
  | 'variance'
  | 'covariance'
  | 'pearson_correlation'
  | 'gradient_descent'
  | 'precision'
  | 'recall'
  | 'f1_score'
  | 'chain_rule'
  | 'l1_regularization'
  | 'l2_regularization'
  | 'z_score'
  | 'entropy'
  | 'kl_divergence'
  | 'softmax'
  | 'relu'
  | 'binary_cross_entropy'
  | 'unsupported';

export interface DerivationStep {
  id: string;
  stepNumber: number;
  title: string;
  latex: string;
  explanation: string;
  pythonSnippet?: string;
  pythonExplanation?: string;
  keyTakeaway?: string;
}

export interface SymbolDefinition {
  symbol: string;
  name: string;
  mathDomain: string;
  role: string;
}

export interface WorkedExampleInput {
  name: string;
  value: string;
  representation: string;
}

export interface WorkedExampleStep {
  step: string;
  computation: string;
  result: string;
}

export interface WorkedExample {
  title: string;
  description: string;
  inputs: WorkedExampleInput[];
  stepByStepComputation: WorkedExampleStep[];
  finalOutput: {
    name: string;
    value: string;
    interpretation: string;
  };
  verifiedNote: string;
}

export interface PatternDerivation {
  id: string;
  pattern: DerivationPatternType;
  title: string;
  subtitle: string;
  category: string;
  summary: string;
  canonicalFormulaLatex: string;
  targetWhatItCalculates: string;
  symbols: SymbolDefinition[];
  assumptions: string[];
  steps: DerivationStep[];
  workedExample: WorkedExample;
  commonMistakes: string[];
  numericalStabilityNotes: string[];
  limitations: string[];
  applications?: string[];
  catalogueId?: string;
  plottableExpr?: string;
  isEngineSupported?: boolean;
  difficulty?: 'Foundational' | 'Intermediate' | 'Advanced';
  tags?: string[];
}

export interface ExplanationResult {
  status: 'success' | 'unsupported';
  derivation?: PatternDerivation;
  errorMessage?: string;
}
