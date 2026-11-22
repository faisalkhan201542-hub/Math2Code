export * from './catalogue';

export type Theme = 'light' | 'dark';

export type EquationCategory = 
  | 'Linear Algebra'
  | 'Probability'
  | 'Statistics'
  | 'Optimisation'
  | 'Machine Learning'
  | 'Bioinformatics';

export interface EquationItem {
  id: string;
  title: string;
  category: EquationCategory;
  formula: string;
  latex: string;
  description: string;
  pythonEquivalent: string;
  complexity: string;
  domain: string;
  isExample: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  type: 'equation_to_code' | 'code_to_equation' | 'plot' | 'library_search';
  category: string;
  timestamp: string;
  status: 'Prototype Ready' | 'Sample Data' | 'Draft';
}

export interface StatItem {
  label: string;
  value: string | number;
  change: string;
  description: string;
  isSampleData: boolean;
}
