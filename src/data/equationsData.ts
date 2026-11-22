import type { EquationItem, StatItem, ActivityItem, EquationCategory } from '../types';
import { EQUATION_CATALOGUE } from './equationCatalogue';

export * from './equationCatalogue';

export const SAMPLE_EQUATIONS: EquationItem[] = EQUATION_CATALOGUE.map((eq) => ({
  id: eq.id,
  title: eq.title,
  category: eq.category as unknown as EquationCategory,
  formula: eq.formula,
  latex: eq.latex,
  description: eq.description,
  pythonEquivalent: eq.pythonEquivalent,
  complexity: eq.complexity,
  domain: `${eq.subcategory} • ${eq.category}`,
  isExample: true
}));

export const SAMPLE_STATS: StatItem[] = [
  {
    label: 'Standard Equations',
    value: `${EQUATION_CATALOGUE.length} Models`,
    change: 'Catalogue Active',
    description: 'Verified mathematical representations across 6 major scientific disciplines',
    isSampleData: false
  },
  {
    label: 'Scientific Disciplines',
    value: '6 Disciplines',
    change: 'Fully Covered',
    description: 'Math, Probability & Stats, Machine Learning, Deep Learning, Optimization, Bio',
    isSampleData: false
  },
  {
    label: 'Engine Tests',
    value: '132+ Scenarios',
    change: 'Automated Vitest',
    description: 'Mathematical invariants, AST compilation, and boundary integrity checks',
    isSampleData: false
  }
];

export const SAMPLE_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Loaded Gene Expression Log2 Fold Change with Pseudocount',
    type: 'library_search',
    category: 'Bioinformatics',
    timestamp: 'Just now',
    status: 'Prototype Ready'
  },
  {
    id: 'act-2',
    title: 'Inspected Logistic Sigmoid Activation Function with plot integration',
    type: 'equation_to_code',
    category: 'Machine Learning',
    timestamp: '15 minutes ago',
    status: 'Prototype Ready'
  },
  {
    id: 'act-3',
    title: 'Calculated Gaussian Normal Distribution PDF probability density',
    type: 'plot',
    category: 'Probability & Statistics',
    timestamp: '1 hour ago',
    status: 'Prototype Ready'
  },
  {
    id: 'act-4',
    title: 'Compiled Vector L2 Norm Euclidean length formulation',
    type: 'code_to_equation',
    category: 'Mathematics & Linear Algebra',
    timestamp: '2 hours ago',
    status: 'Prototype Ready'
  }
];
