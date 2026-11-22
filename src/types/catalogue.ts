import type { PatternType } from '../engine/types';

export type CatalogueCategory =
  | 'Mathematics & Linear Algebra'
  | 'Probability & Statistics'
  | 'Machine Learning'
  | 'Deep Learning'
  | 'Optimization & Information Theory'
  | 'Bioinformatics';

export type EquationDifficulty = 'Foundational' | 'Intermediate' | 'Advanced';

export interface EquationVariable {
  symbol: string;
  name: string;
  description: string;
  domainOrShape?: string;
}

export interface CatalogueEquation {
  id: string;
  title: string;
  category: CatalogueCategory;
  subcategory: string;
  formula: string;
  latex: string;
  description: string;
  mathematicalMeaning: string;
  variables: EquationVariable[];
  assumptionsAndLimitations: string[];
  pythonEquivalent: string;
  isEngineSupported: boolean;
  supportedEnginePattern?: PatternType;
  derivationPatternId?:
    | 'matrix_multiplication'
    | 'vector_l2_norm'
    | 'vector-l2-norm'
    | 'sigmoid'
    | 'bayes_theorem'
    | 'linear_regression'
    | 'gaussian_pdf'
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
    | string;
  plottableExpr?: string;
  relatedEquationIds: string[];
  tags: string[];
  difficulty: EquationDifficulty;
  complexity: string;
}

export interface CatalogueFilterState {
  searchQuery: string;
  category: string;
  subcategory: string;
  difficulty: string;
  sortBy: 'title-asc' | 'title-desc' | 'category' | 'difficulty-asc' | 'difficulty-desc';
  viewMode: 'grid' | 'list';
}
