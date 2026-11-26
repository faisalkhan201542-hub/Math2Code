import { Menu, Search, Sun, Moon, HelpCircle, Code } from 'lucide-react';
import { useTheme } from '../../context/useTheme';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  onOpenAbout: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenSearch,
  onOpenAbout,
  title = 'Math2Code'
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/70 dark:bg-[#080d1a]/65 backdrop-blur-2xl border-b border-white/70 dark:border-white/10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.4)] transition-colors">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left: Hamburger (mobile) + Page/App Context */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60 border border-transparent hover:border-white/60 dark:hover:border-white/10 lg:hidden transition-all backdrop-blur-md"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight sm:text-base hidden sm:block">
              {title}
            </h1>
          </div>
        </div>

        {/* Center: Global Search (Glass Lens) */}
        <div className="flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-white/80 dark:border-white/10 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md text-slate-500 dark:text-slate-400 hover:border-teal-400/50 dark:hover:border-teal-500/40 hover:bg-white/80 dark:hover:bg-slate-800/60 hover:shadow-[0_4px_16px_rgba(13,148,136,0.1)] transition-all text-xs sm:text-sm group shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]"
            title="Search equations and commands (Ctrl+K)"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 transition-colors" />
              <span className="truncate">Search equations, modules, syntax...</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-white/10 rounded shadow-2xs backdrop-blur-xs">
                Ctrl K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right: Actions, Theme Toggle, About Modal Trigger */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Target Python indicator */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono px-2.5 py-1 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-white/60 dark:border-white/10 backdrop-blur-md shadow-2xs">
            <Code className="w-3.5 h-3.5 text-teal-500" />
            <span>Python 3.11</span>
          </div>

          {/* About / Info */}
          <button
            onClick={onOpenAbout}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-800/80 border border-white/60 dark:border-white/10 backdrop-blur-md transition-all shadow-2xs"
            title="About Math2Code"
            aria-label="About Math2Code"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-800/80 border border-white/60 dark:border-white/10 backdrop-blur-md transition-all shadow-2xs"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
