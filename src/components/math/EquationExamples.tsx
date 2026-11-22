// oxlint-disable react/only-export-components
import React, { useState, useMemo } from 'react';
import { BookMarked, Layers, Search } from 'lucide-react';

export interface EquationExampleItem {
  id: string;
  name: string;
  latex: string;
  category: string;
  description: string;
}

export const STANDARD_EQUATION_EXAMPLES: EquationExampleItem[] = [
  // 1. Linear Algebra
  {
    id: 'ex-matrix-mult',
    name: 'Matrix Multiplication',
    latex: 'C = AB \\quad \\Longleftrightarrow \\quad C_{ij} = \\sum_{k=1}^{p} A_{ik} B_{kj}',
    category: 'Linear Algebra',
    description: 'Matrix product formulation where row i of A contracts with column j of B.'
  },
  {
    id: 'ex-vector-norm',
    name: 'Vector L2 Euclidean Norm',
    latex: '\\|x\\|_2 = \\sqrt{\\sum_{i=1}^{n} x_i^2}',
    category: 'Linear Algebra',
    description: 'Euclidean geometric length of an n-dimensional real vector.'
  },
  {
    id: 'ex-dot-product',
    name: 'Vector Dot Product (Inner Product)',
    latex: '\\mathbf{x} \\cdot \\mathbf{w} = \\sum_{i=1}^{n} x_i w_i',
    category: 'Linear Algebra',
    description: 'Bilinear inner product mapping two equal-length coordinate vectors to a real scalar.'
  },
  {
    id: 'ex-euclidean-distance',
    name: 'Euclidean Distance Metric',
    latex: 'd(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_{i=1}^{n} (x_i - y_i)^2}',
    category: 'Linear Algebra',
    description: 'Geometric distance between two observation coordinate vectors in R^n.'
  },

  // 2. Optimization
  {
    id: 'ex-gradient-descent',
    name: 'Gradient Descent Parameter Update',
    latex: '\\theta_{t+1} = \\theta_t - \\alpha \\nabla J(\\theta_t)',
    category: 'Optimization',
    description: 'First-order iterative optimization updating parameters in the steepest descent direction.'
  },

  // 3. Statistics
  {
    id: 'ex-linear-regression',
    name: 'Multivariate Linear Regression',
    latex: '\\hat{y} = Xw + b',
    category: 'Statistics',
    description: 'Affine prediction model mapping feature matrix X to target response vector y.'
  },
  {
    id: 'ex-variance',
    name: 'Sample Variance (Bessel-Corrected)',
    latex: 's^2 = \\frac{1}{n - 1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2',
    category: 'Statistics',
    description: 'Unbiased estimate of the second central moment measuring data spread.'
  },
  {
    id: 'ex-covariance',
    name: 'Sample Covariance',
    latex: '\\operatorname{cov}(X, Y) = \\frac{1}{n - 1} \\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})',
    category: 'Statistics',
    description: 'Joint variability measure indicating directional co-movement between two variables.'
  },
  {
    id: 'ex-pearson-correlation',
    name: 'Pearson Correlation Coefficient',
    latex: 'r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}',
    category: 'Statistics',
    description: 'Normalized linear dependence index bounded strictly in [-1, 1].'
  },
  {
    id: 'ex-z-score',
    name: 'Z-Score Standardization',
    latex: 'z = \\frac{x - \\mu}{\\sigma}',
    category: 'Statistics',
    description: 'Standard affine normalization producing zero mean and unit variance.'
  },

  // 4. Machine Learning
  {
    id: 'ex-sigmoid',
    name: 'Sigmoidal Logistic Function',
    latex: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
    category: 'Machine Learning',
    description: 'Smooth S-shaped activation function mapping the real line to probability range (0, 1).'
  },
  {
    id: 'ex-mse',
    name: 'Mean Squared Error (MSE Loss)',
    latex: '\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2',
    category: 'Machine Learning',
    description: 'Standard quadratic regression loss penalizing large residual deviations.'
  },
  {
    id: 'ex-mae',
    name: 'Mean Absolute Error (MAE Loss)',
    latex: '\\text{MAE} = \\frac{1}{n} \\sum_{i=1}^{n} |y_i - \\hat{y}_i|',
    category: 'Machine Learning',
    description: 'L1 robust regression error measuring median-centric absolute deviations.'
  },
  {
    id: 'ex-precision',
    name: 'Classification Precision',
    latex: '\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}',
    category: 'Machine Learning',
    description: 'Proportion of true positive predictions among all declared positive instances.'
  },
  {
    id: 'ex-recall',
    name: 'Classification Recall (Sensitivity)',
    latex: '\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}',
    category: 'Machine Learning',
    description: 'Proportion of true positive predictions among all actual ground-truth condition positives.'
  },
  {
    id: 'ex-f1-score',
    name: 'F1-Score Harmonic Mean',
    latex: 'F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}',
    category: 'Machine Learning',
    description: 'Harmonic mean balancing precision and recall under class imbalance.'
  },
  {
    id: 'ex-l1-regularization',
    name: 'L1 Lasso Regularization Penalty',
    latex: 'R_{L1}(\\mathbf{w}) = \\lambda \\sum_{j=1}^{d} |w_j|',
    category: 'Machine Learning',
    description: 'Sparsity-inducing absolute norm constraint promoting exact zero parameter weights.'
  },
  {
    id: 'ex-l2-regularization',
    name: 'L2 Ridge Regularization Penalty',
    latex: 'R_{L2}(\\mathbf{w}) = \\frac{\\lambda}{2} \\sum_{j=1}^{d} w_j^2',
    category: 'Machine Learning',
    description: 'Quadratic shrinkage penalty shrinking parameter weights to mitigate overfitting.'
  },

  // 5. Deep Learning
  {
    id: 'ex-relu',
    name: 'Rectified Linear Unit (ReLU)',
    latex: 'f(x) = \\max(0, x)',
    category: 'Deep Learning',
    description: 'Non-saturating piece-wise linear activation mitigating vanishing gradients in deep networks.'
  },
  {
    id: 'ex-softmax',
    name: 'Softmax Probability Distribution',
    latex: '\\sigma(\\mathbf{z})_i = \\frac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}',
    category: 'Deep Learning',
    description: 'Normalized exponential transforming real-valued logits into a categorical probability distribution.'
  },
  {
    id: 'ex-binary-cross-entropy',
    name: 'Binary Cross-Entropy Loss (Log Loss)',
    latex: '\\mathcal{L}_{BCE} = -\\frac{1}{n} \\sum_{i=1}^n \\left[ y_i \\log(p_i) + (1 - y_i) \\log(1 - p_i) \\right]',
    category: 'Deep Learning',
    description: 'Negative log-likelihood loss for binary classification with Bernoulli likelihood.'
  },

  // 6. Probability
  {
    id: 'ex-bayes',
    name: "Bayes' Theorem",
    latex: 'P(A\\mid B) = \\frac{P(B\\mid A) P(A)}{P(B)}',
    category: 'Probability',
    description: 'Fundamental theorem of inverse probability conditioning on observed evidence B.'
  },
  {
    id: 'ex-gaussian',
    name: 'Gaussian Normal PDF',
    latex: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{(x - \\mu)^2}{2\\sigma^2} \\right)',
    category: 'Probability',
    description: 'Univariate Gaussian probability density function with mean mu and variance sigma squared.'
  },

  // 7. Information Theory
  {
    id: 'ex-entropy',
    name: 'Shannon Information Entropy',
    latex: 'H(X) = -\\sum_{i=1}^{n} P(x_i) \\log_2 P(x_i)',
    category: 'Information Theory',
    description: 'Expected information content measuring uncertainty or surprise in bits.'
  },
  {
    id: 'ex-kl-divergence',
    name: 'Kullback-Leibler (KL) Divergence',
    latex: 'D_{\\text{KL}}(P \\parallel Q) = \\sum_{i=1}^{n} P(x_i) \\log \\left( \\frac{P(x_i)}{Q(x_i)} \\right)',
    category: 'Information Theory',
    description: 'Asymmetric divergence measuring extra information required to encode P with distribution Q.'
  },
  {
    id: 'ex-chain-rule',
    name: 'Multivariate Chain Rule',
    latex: '\\frac{dz}{dx} = \\frac{\\partial z}{\\partial u} \\frac{du}{dx} + \\frac{\\partial z}{\\partial v} \\frac{dv}{dx}',
    category: 'Information Theory',
    description: 'Calculus derivative of composite functions fundamental to reverse-mode backpropagation.'
  },

  // 8. Bioinformatics
  {
    id: 'ex-lotka-volterra',
    name: 'Lotka-Volterra Predator-Prey System',
    latex: '\\begin{aligned} \\frac{dx}{dt} &= \\alpha x - \\beta x y \\\\ \\frac{dy}{dt} &= \\delta x y - \\gamma y \\end{aligned}',
    category: 'Bioinformatics',
    description: 'Coupled non-linear differential equations modeling population dynamics between prey x and predator y.'
  }
];

export interface EquationExamplesProps {
  onSelect: (latex: string) => void;
  selectedLatex?: string;
  className?: string;
}

export const EquationExamples: React.FC<EquationExamplesProps> = ({
  onSelect,
  selectedLatex,
  className = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const set = new Set<string>();
    STANDARD_EQUATION_EXAMPLES.forEach((ex) => set.add(ex.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredExamples = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return STANDARD_EQUATION_EXAMPLES.filter((ex) => {
      const matchesCategory = activeCategory === 'All' || ex.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        ex.name.toLowerCase().includes(q) ||
        ex.latex.toLowerCase().includes(q) ||
        ex.category.toLowerCase().includes(q) ||
        ex.description.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
          <BookMarked className="w-3.5 h-3.5 text-teal-500" />
          <span>
            Verified Academic Presets ({filteredExamples.length} of {STANDARD_EQUATION_EXAMPLES.length}):
          </span>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search presets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-0.5" />
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Presets Grid (6 Columns on lg screens, matching Derivation page) */}
      {filteredExamples.length === 0 ? (
        <div className="p-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No presets matching &quot;{searchQuery}&quot;
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
            }}
            className="mt-1 text-xs text-teal-600 dark:text-teal-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-72 overflow-y-auto pr-1">
          {filteredExamples.map((ex) => {
            const isSelected = selectedLatex === ex.latex;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => onSelect(ex.latex)}
                title={`${ex.name} (${ex.category})\n${ex.latex}`}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 dark:border-teal-600 ring-2 ring-teal-500/30 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400/60 dark:hover:border-teal-600/60 hover:bg-teal-50/20 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    {ex.name}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono shrink-0"
                    title={ex.category}
                  >
                    {ex.category.split(' ')[0]}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-mono">
                  {ex.latex}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
