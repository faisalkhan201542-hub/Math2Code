import React, { useState } from 'react';

export interface SymbolItem {
  label: string;
  snippet: string;
  tooltip: string;
  category: 'templates' | 'greek' | 'operators' | 'scripts';
}

export interface EquationSymbolToolbarProps {
  onInsert: (snippet: string) => void;
  className?: string;
}

export const EquationSymbolToolbar: React.FC<EquationSymbolToolbarProps> = ({
  onInsert,
  className = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'templates' | 'greek' | 'operators' | 'scripts'>('all');

  const symbols: SymbolItem[] = [
    // Templates & Structures
    { label: 'a/b', snippet: '\\frac{a}{b}', tooltip: 'Fraction: \\frac{a}{b}', category: 'templates' },
    { label: '√x', snippet: '\\sqrt{x}', tooltip: 'Square Root: \\sqrt{x}', category: 'templates' },
    { label: '∑', snippet: '\\sum_{i=1}^{n}', tooltip: 'Summation: \\sum_{i=1}^{n}', category: 'templates' },
    { label: '∏', snippet: '\\prod_{i=1}^{n}', tooltip: 'Product: \\prod_{i=1}^{n}', category: 'templates' },
    { label: '∫', snippet: '\\int_{a}^{b}', tooltip: 'Definite Integral: \\int_{a}^{b}', category: 'templates' },
    { label: '[M]', snippet: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}', tooltip: '2x2 Matrix: \\begin{bmatrix}...\\end{bmatrix}', category: 'templates' },
    { label: '{sys}', snippet: '\\begin{aligned}\n  y &= ax + b \\\\\n  z &= cx + d\n\\end{aligned}', tooltip: 'Aligned Multiline Equation', category: 'templates' },

    // Greek Letters
    { label: 'α', snippet: '\\alpha', tooltip: 'Alpha: \\alpha', category: 'greek' },
    { label: 'β', snippet: '\\beta', tooltip: 'Beta: \\beta', category: 'greek' },
    { label: 'θ', snippet: '\\theta', tooltip: 'Theta: \\theta', category: 'greek' },
    { label: 'λ', snippet: '\\lambda', tooltip: 'Lambda: \\lambda', category: 'greek' },
    { label: 'σ', snippet: '\\sigma', tooltip: 'Sigma: \\sigma', category: 'greek' },
    { label: 'μ', snippet: '\\mu', tooltip: 'Mu: \\mu', category: 'greek' },
    { label: 'π', snippet: '\\pi', tooltip: 'Pi: \\pi', category: 'greek' },
    { label: 'γ', snippet: '\\gamma', tooltip: 'Gamma: \\gamma', category: 'greek' },
    { label: 'δ', snippet: '\\delta', tooltip: 'Delta: \\delta', category: 'greek' },
    { label: 'ε', snippet: '\\epsilon', tooltip: 'Epsilon: \\epsilon', category: 'greek' },
    { label: 'ω', snippet: '\\omega', tooltip: 'Omega: \\omega', category: 'greek' },
    { label: 'ϕ', snippet: '\\phi', tooltip: 'Phi: \\phi', category: 'greek' },

    // Operators & Relations
    { label: '∇', snippet: '\\nabla', tooltip: 'Nabla / Gradient: \\nabla', category: 'operators' },
    { label: '∂', snippet: '\\partial', tooltip: 'Partial Derivative: \\partial', category: 'operators' },
    { label: '·', snippet: '\\cdot', tooltip: 'Dot Product: \\cdot', category: 'operators' },
    { label: '×', snippet: '\\times', tooltip: 'Cross / Multiply: \\times', category: 'operators' },
    { label: '±', snippet: '\\pm', tooltip: 'Plus-Minus: \\pm', category: 'operators' },
    { label: '≤', snippet: '\\leq', tooltip: 'Less than or equal: \\leq', category: 'operators' },
    { label: '≥', snippet: '\\geq', tooltip: 'Greater than or equal: \\geq', category: 'operators' },
    { label: '≠', snippet: '\\neq', tooltip: 'Not equal: \\neq', category: 'operators' },
    { label: '≈', snippet: '\\approx', tooltip: 'Approximately: \\approx', category: 'operators' },
    { label: '∈', snippet: '\\in', tooltip: 'Element of: \\in', category: 'operators' },
    { label: '→', snippet: '\\to', tooltip: 'Arrow / maps to: \\to', category: 'operators' },

    // Scripts & Modifiers
    { label: 'x²', snippet: '^{2}', tooltip: 'Superscript exponent: ^{2}', category: 'scripts' },
    { label: 'xᵢ', snippet: '_{i}', tooltip: 'Subscript index: _{i}', category: 'scripts' },
    { label: '||x||₂', snippet: '\\|x\\|_2', tooltip: 'Vector L2 Norm: \\|x\\|_2', category: 'scripts' },
    { label: 'ŷ', snippet: '\\hat{y}', tooltip: 'Hat accent: \\hat{y}', category: 'scripts' },
    { label: 'x̄', snippet: '\\bar{x}', tooltip: 'Bar average: \\bar{x}', category: 'scripts' },
    { label: 'X', snippet: '\\mathbf{X}', tooltip: 'Bold Matrix / Vector: \\mathbf{X}', category: 'scripts' }
  ];

  const filteredSymbols = activeCategory === 'all'
    ? symbols
    : symbols.filter(s => s.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Symbols' },
    { id: 'templates', label: 'Templates' },
    { id: 'greek', label: 'Greek' },
    { id: 'operators', label: 'Operators' },
    { id: 'scripts', label: 'Scripts/Norms' }
  ] as const;

  return (
    <div className={`space-y-2 p-3 rounded-xl glass-panel border border-white/80 dark:border-white/10 ${className}`}>
      {/* Category Filter Pills */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
        <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">
          Insert Symbols:
        </span>
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
        {filteredSymbols.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onInsert(item.snippet)}
            title={item.tooltip}
            aria-label={item.tooltip}
            className="px-2.5 py-1 rounded-lg glass-panel glass-interactive border border-white/60 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md hover:border-teal-400/80 dark:hover:border-teal-500/80 hover:text-teal-600 dark:hover:text-teal-300 text-slate-800 dark:text-slate-200 font-mono text-xs transition-all shadow-xs active:scale-95 flex items-center justify-center min-w-[34px] h-[30px] cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
