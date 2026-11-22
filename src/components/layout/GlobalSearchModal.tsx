import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sigma, Code2, LineChart, Library, Terminal } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { SAMPLE_EQUATIONS } from '../../data/equationsData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const quickNav = [
    { title: 'Equation → Code Converter', path: '/equation-to-code', icon: Sigma, category: 'Tool' },
    { title: 'Code → Equation Decompiler', path: '/code-to-equation', icon: Code2, category: 'Tool' },
    { title: 'Python Playground (Pyodide WASM)', path: '/playground', icon: Terminal, category: 'WASM Runner' },
    { title: 'Step-by-Step Derivations', path: '/derivation', icon: Sigma, category: 'Tool' },
    { title: 'Scientific Graph Plotter', path: '/graph-plotter', icon: LineChart, category: 'Tool' },
    { title: 'Equation Reference Library', path: '/library', icon: Library, category: 'Catalogue' },
  ];

  const filteredNav = quickNav.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEquations = SAMPLE_EQUATIONS.filter(eq =>
    eq.title.toLowerCase().includes(query.toLowerCase()) ||
    eq.category.toLowerCase().includes(query.toLowerCase()) ||
    eq.formula.toLowerCase().includes(query.toLowerCase()) ||
    eq.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectRoute = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleSelectEquation = (equationId: string) => {
    navigate(`/library?equation=${equationId}`);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Global Command & Search"
      description="Search tools, reference equations, and documentation"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search equations (e.g. Softmax, Bayes, Covariance) or features..."
            autoFocus
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Search Index</span>
          <Badge variant="sample" size="sm">Indexed: 5 Modules, 36 Equations</Badge>
        </div>

        {/* Navigation Quick Results */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
            Application Modules
          </h4>
          <div className="space-y-1">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleSelectRoute(item.path)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-teal-50 group-hover:text-teal-600 dark:group-hover:bg-teal-950/60 dark:group-hover:text-teal-300 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Equations Results */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
            Catalogue Equations ({filteredEquations.length})
          </h4>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {filteredEquations.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-2">
                No matching equations found for "{query}".
              </p>
            ) : (
              filteredEquations.map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => handleSelectEquation(eq.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {eq.title}
                      </span>
                      <Badge variant="teal" size="sm">{eq.category}</Badge>
                    </div>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-md">
                      {eq.formula}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
