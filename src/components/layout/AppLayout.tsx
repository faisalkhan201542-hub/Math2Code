import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GlobalSearchModal } from './GlobalSearchModal';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { CheckCircle2 } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const location = useLocation();

  // Keyboard shortcut Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine current page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Overview Dashboard';
      case '/equation-to-code':
        return 'Equation → Code Synthesis';
      case '/code-to-equation':
        return 'Code → Equation Decompiler';
      case '/playground':
        return 'Python Playground & Pyodide WASM';
      case '/derivation':
        return 'Step-by-Step Mathematical Derivations';
      case '/graph-plotter':
        return 'Mathematical Graph Plotter';
      case '/library':
        return 'Equation Reference Library';
      default:
        return 'Math2Code';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/90 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200 relative selection:bg-teal-500/20 selection:text-teal-900 dark:selection:text-teal-200">
      {/* Ambient background lighting effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-radial from-teal-500/10 via-emerald-500/5 to-transparent blur-3xl opacity-70 dark:opacity-30" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-radial from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl opacity-60 dark:opacity-20" />
      </div>

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          title={getPageTitle()}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
        />

        {/* Page Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="mt-auto py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Math2Code
              </span>
              <span>—</span>
              <span>Equation ↔ Code Academic Computing Environment</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="teal" size="sm">
                Verified Engine
              </Badge>
              <span>Target: Python 3.11+ / NumPy / SciPy</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Search Dialog */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* About Math2Code Modal */}
      <Modal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        title="About Math2Code"
        description="Scientific Computing & Mathematical Conversion Environment"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-teal-800 dark:text-teal-200 text-xs leading-relaxed">
            <strong>Production Mathematical Computation Engine</strong>
            <p className="mt-1">
              Math2Code bridges formal analytical mathematics and high-performance Python code with verified numerical stability, automated derivations, and interactive visualization.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Integrated Capabilities
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Equation → Python Code Vectorized Synthesis
                </span>
                <Badge variant="emerald" size="sm">Verified</Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Python Code → LaTeX Equation Decompiler
                </span>
                <Badge variant="emerald" size="sm">Verified</Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Step-by-Step Mathematical Derivations & Worked Examples
                </span>
                <Badge variant="emerald" size="sm">Verified</Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Interactive Multi-Curve Mathematical Graph Plotter
                </span>
                <Badge variant="emerald" size="sm">Verified</Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  36-Model Equation Library Across 6 Disciplines
                </span>
                <Badge variant="emerald" size="sm">Verified</Badge>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
