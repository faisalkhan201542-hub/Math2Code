import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowRightLeft,
  Code2,
  GraduationCap,
  LineChart,
  Library,
  Terminal,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Overview',
      iconBgActive: 'bg-indigo-100 dark:bg-indigo-500/25 border-indigo-300 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300 shadow-xs dark:shadow-md dark:shadow-indigo-500/30 ring-1 ring-indigo-400/20',
      iconBgInactive: 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-200/80 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 group-hover:border-indigo-300 dark:group-hover:border-indigo-400/50 group-hover:text-indigo-800 dark:group-hover:text-indigo-300',
      activeLink: 'bg-indigo-50/90 dark:bg-gradient-to-r dark:from-indigo-500/20 dark:via-indigo-500/10 dark:to-transparent text-indigo-900 dark:text-indigo-200 border-l-2 border-indigo-600 dark:border-indigo-400 font-semibold shadow-xs',
      hoverLink: 'hover:bg-slate-100/80 dark:hover:bg-indigo-500/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-indigo-100',
      badgeClass: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/40'
    },
    {
      to: '/equation-to-code',
      label: 'Equation → Code',
      icon: ArrowRightLeft,
      badge: 'Compiler',
      iconBgActive: 'bg-teal-100 dark:bg-teal-500/25 border-teal-300 dark:border-teal-400 text-teal-700 dark:text-teal-300 shadow-xs dark:shadow-md dark:shadow-teal-500/30 ring-1 ring-teal-400/20',
      iconBgInactive: 'bg-teal-50/80 dark:bg-teal-950/50 border-teal-200/80 dark:border-teal-500/30 text-teal-600 dark:text-teal-400 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/60 group-hover:border-teal-300 dark:group-hover:border-teal-400/50 group-hover:text-teal-800 dark:group-hover:text-teal-300',
      activeLink: 'bg-teal-50/90 dark:bg-gradient-to-r dark:from-teal-500/20 dark:via-teal-500/10 dark:to-transparent text-teal-900 dark:text-teal-200 border-l-2 border-teal-600 dark:border-teal-400 font-semibold shadow-xs',
      hoverLink: 'hover:bg-slate-100/80 dark:hover:bg-teal-500/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-teal-100',
      badgeClass: 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-500/40'
    },
    {
      to: '/code-to-equation',
      label: 'Code → Equation',
      icon: Code2,
      badge: 'AST',
      iconBgActive: 'bg-sky-100 dark:bg-sky-500/25 border-sky-300 dark:border-sky-400 text-sky-700 dark:text-sky-300 shadow-xs dark:shadow-md dark:shadow-sky-500/30 ring-1 ring-sky-400/20',
      iconBgInactive: 'bg-sky-50/80 dark:bg-sky-950/50 border-sky-200/80 dark:border-sky-500/30 text-sky-600 dark:text-sky-400 group-hover:bg-sky-100 dark:group-hover:bg-sky-900/60 group-hover:border-sky-300 dark:group-hover:border-sky-400/50 group-hover:text-sky-800 dark:group-hover:text-sky-300',
      activeLink: 'bg-sky-50/90 dark:bg-gradient-to-r dark:from-sky-500/20 dark:via-sky-500/10 dark:to-transparent text-sky-900 dark:text-sky-200 border-l-2 border-sky-600 dark:border-sky-400 font-semibold shadow-xs',
      hoverLink: 'hover:bg-slate-100/80 dark:hover:bg-sky-500/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-sky-100',
      badgeClass: 'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/40'
    },
    {
      to: '/playground',
      label: 'Python Playground',
      icon: Terminal,
      badge: 'WASM Run',
      iconBgActive: 'bg-cyan-100 dark:bg-cyan-500/25 border-cyan-300 dark:border-cyan-400 text-cyan-700 dark:text-cyan-300 shadow-xs dark:shadow-md dark:shadow-cyan-500/30 ring-1 ring-cyan-400/20',
      iconBgInactive: 'bg-cyan-50/80 dark:bg-cyan-950/50 border-cyan-200/80 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/60 group-hover:border-cyan-300 dark:group-hover:border-cyan-400/50 group-hover:text-cyan-800 dark:group-hover:text-cyan-300',
      activeLink: 'bg-cyan-50/90 dark:bg-gradient-to-r dark:from-cyan-500/20 dark:via-cyan-500/10 dark:to-transparent text-cyan-900 dark:text-cyan-200 border-l-2 border-cyan-600 dark:border-cyan-400 font-semibold shadow-xs',
      hoverLink: 'hover:bg-slate-100/80 dark:hover:bg-cyan-500/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-cyan-100',
      badgeClass: 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/40'
    },
    {
      to: '/derivation',
      label: 'Derivation Engine',
      icon: GraduationCap,
      badge: 'Proofs',
      iconBgActive: 'bg-amber-100 dark:bg-amber-500/25 border-amber-300 dark:border-amber-400 text-amber-700 dark:text-amber-300 shadow-xs dark:shadow-md dark:shadow-amber-500/30 ring-1 ring-amber-400/20',
      iconBgInactive: 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-200/80 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/60 group-hover:border-amber-300 dark:group-hover:border-amber-400/50 group-hover:text-amber-800 dark:group-hover:text-amber-300',
      activeLink: 'bg-amber-50/90 dark:bg-gradient-to-r dark:from-amber-500/20 dark:via-amber-500/10 dark:to-transparent text-amber-900 dark:text-amber-200 border-l-2 border-amber-600 dark:border-amber-400 font-semibold shadow-xs',
      hoverLink: 'hover:bg-slate-100/80 dark:hover:bg-amber-500/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-100',
      badgeClass: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/40'
    },
    {
      to: '/graph-plotter',
      label: 'Graph Plotter',
      icon: LineChart,
      badge: '2D/3D',
      iconBgActive: 'bg-rose-100 dark:bg-rose-500/25 border-rose-300 dark:border-rose-400 text-rose-700 dark:text-rose-300 shadow-xs dark:shadow-md dark:shadow-rose-500/30 ring-1 ring-rose-400/20',
      iconBgInactive: 'bg-rose-50/80 dark:bg-rose-950/50 border-rose-200/80 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/60 group-hover:border-rose-300 dark:group-hover:border-rose-400/50 group-hover:text-rose-800 dark:group-hover:text-rose-300',
      activeLink: 'bg-rose-50/90 dark:bg-gradient-to-r dark:from-rose-500/20 dark:via-rose-500/10 dark:to-transparent text-rose-900 dark:text-rose-200 border-l-2 border-rose-600 dark:border-rose-400 font-semibold shadow-xs',
      hoverLink: 'hover:bg-slate-100/80 dark:hover:bg-rose-500/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-rose-100',
      badgeClass: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/40'
    },
    {
      to: '/library',
      label: 'Equation Library',
      icon: Library,
      badge: '26+ Lib',
      iconBgActive: 'bg-purple-100 dark:bg-purple-500/25 border-purple-300 dark:border-purple-400 text-purple-700 dark:text-purple-300 shadow-xs dark:shadow-md dark:shadow-purple-500/30 ring-1 ring-purple-400/20',
      iconBgInactive: 'bg-purple-50/80 dark:bg-purple-950/50 border-purple-200/80 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/60 group-hover:border-purple-300 dark:group-hover:border-purple-400/50 group-hover:text-purple-800 dark:group-hover:text-purple-300',
      activeLink: 'bg-purple-50/90 dark:bg-gradient-to-r dark:from-purple-500/20 dark:via-purple-500/10 dark:to-transparent text-purple-900 dark:text-purple-200 border-l-2 border-purple-600 dark:border-purple-400 font-semibold shadow-xs',
      hoverLink: 'hover:bg-slate-100/80 dark:hover:bg-purple-500/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-purple-100',
      badgeClass: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/40'
    }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white/75 dark:bg-[#080d1a]/75 backdrop-blur-2xl text-slate-800 dark:text-slate-200 border-r border-white/70 dark:border-white/10 shadow-[4px_0_30px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_35px_rgba(0,0,0,0.4)] transition-all duration-200 ease-in-out overflow-hidden
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Subtle decorative glowing background orbs */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-teal-500/15 dark:bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-12 w-40 h-40 bg-indigo-500/15 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-44 h-44 bg-purple-500/15 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand / Logo Header */}
        <div className="relative z-10 flex items-center justify-between h-16 px-4 border-b border-white/60 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-indigo-600 text-white shrink-0 font-mono font-black text-lg shadow-md shadow-teal-500/25 ring-1 ring-white/40 dark:ring-white/20">
              ∑
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold tracking-tight text-sm bg-gradient-to-r from-slate-900 via-teal-700 to-indigo-700 dark:from-white dark:via-slate-100 dark:to-teal-300 bg-clip-text text-transparent">
                  Math2Code
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-teal-700 dark:text-teal-300 font-mono tracking-wider font-bold">
                    EQUATION ↔ CODE
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="relative z-10 flex-1 px-3 py-4 space-y-1.5 overflow-y-auto" aria-label="Main Navigation">
          <div className={`px-2 mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${isCollapsed ? 'text-center' : ''}`}>
            {!isCollapsed ? (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400" />
                  <span>Scientific Tools</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30">
                  v1.2
                </span>
              </>
            ) : (
              '•••'
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? `${item.activeLink}`
                      : `${item.hoverLink} hover:translate-x-0.5 border-l-2 border-transparent`
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 ${
                        isActive
                          ? item.iconBgActive
                          : item.iconBgInactive
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                    </div>

                    {!isCollapsed && (
                      <span className="flex-1 truncate tracking-tight">
                        {item.label}
                      </span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md border font-mono font-medium shrink-0 ${
                          isActive
                            ? item.badgeClass
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/60 group-hover:border-slate-300 dark:group-hover:border-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Engine Status Card (when expanded) */}
        {!isCollapsed && (
          <div className="relative z-10 p-2.5 mx-3 mb-2 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 backdrop-blur-md shadow-2xs">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-xs shadow-emerald-400/50 animate-pulse" />
                <span>Compiler Status</span>
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                Ready
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
              Python 3.11 • NumPy • SymPy
            </p>
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <div className="relative z-10 p-3 border-t border-white/60 dark:border-white/10 bg-white/30 dark:bg-slate-950/30 backdrop-blur-md hidden lg:block">
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center w-full py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60 rounded-xl border border-transparent hover:border-white/60 dark:hover:border-white/10 transition-all gap-1.5 cursor-pointer shadow-2xs"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
