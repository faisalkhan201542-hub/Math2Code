export type PatternType =
  // Canonical 6 patterns
  | 'matrix_multiplication'
  | 'vector_l2_norm'
  | 'sigmoid'
  | 'bayes_theorem'
  | 'linear_regression'
  | 'gaussian_pdf'
  // 20 Expanded patterns
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

export type ConversionStatus = 'success' | 'unsupported_syntax' | 'invalid_input';

export interface VariableRequirement {
  name: string;
  type: string;
  shape: string;
  description: string;
  constraints?: string;
}

export interface EquationMetadata {
  pattern: PatternType;
  displayName: string;
  category: string;
  standardLatex: string;
  variables: VariableRequirement[];
  assumptions: string[];
  complexity: string;
  stabilityNotes: string[];
}

export interface ConversionResult {
  status: ConversionStatus;
  pattern: PatternType;
  equationName: string;
  code: string;
  metadata?: EquationMetadata;
  errorMessage?: string;
  suggestedTemplates?: string[];
  explanation?: EquationExplanation;
}

export interface EquationExplanation {
  title: string;
  category: string;
  formalDefinition: string;
  domainAndConstraints: string[];
  variableRoles: { symbol: string; role: string; shape: string }[];
  operationMapping: { mathSymbol: string; pythonEquivalent: string; explanation: string }[];
  computationalComplexity: { time: string; space: string; flops: string };
  numericalSafeguards: string[];
}

export interface Token {
  type: 'IDENT' | 'NUMBER' | 'OPERATOR' | 'DELIMITER' | 'KEYWORD' | 'COMMAND';
  value: string;
  raw: string;
}
