import { Menu, Search, Sun, Moon, HelpCircle, Code } from 'lucide-react';
import { useTheme } from '../../context/useTheme';
import { Button } from '../ui/Button';

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
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left: Hamburger (mobile) + Page/App Context */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 lg:hidden"
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

        {/* Center: Global Search */}
        <div className="flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs sm:text-sm group"
            title="Search equations and commands (Ctrl+K)"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 transition-colors" />
              <span className="truncate">Search equations, modules, syntax...</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded shadow-2xs">
                Ctrl K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right: Actions, Theme Toggle, About Modal Trigger */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Target Python indicator */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">
            <Code className="w-3.5 h-3.5 text-teal-500" />
            <span>Python 3.11</span>
          </div>

          {/* About / Info */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenAbout}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            title="About Math2Code"
            aria-label="About Math2Code"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
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
