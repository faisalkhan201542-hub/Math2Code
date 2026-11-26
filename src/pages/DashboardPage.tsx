import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRightLeft,
  Code2,
  LineChart,
  Library,
  ArrowRight,
  Layers,
  Sigma,
  Sparkles,
  CheckCircle2,
  Cpu,
  Compass,
  Terminal
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SAMPLE_STATS } from '../data/equationsData';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Equation → Code',
      description: 'Convert mathematical equations into vectorized, numerically sound Python code with AST validation.',
      icon: ArrowRightLeft,
      path: '/equation-to-code',
      badge: 'Code Synthesis',
      badgeVariant: 'teal' as const,
      hoverClass: 'hover:border-teal-500/60 dark:hover:border-teal-400/50 hover:shadow-lg hover:shadow-teal-500/10 dark:hover:shadow-teal-500/5',
      iconClass: 'bg-gradient-to-br from-teal-500/20 to-emerald-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 group-hover:scale-105 group-hover:bg-teal-500 group-hover:text-white',
      accentText: 'text-teal-600 dark:text-teal-400',
      tag: 'NumPy Vectorized'
    },
    {
      title: 'Code → Equation',
      description: 'Decompile computational Python routines back into formal mathematical LaTeX representations.',
      icon: Code2,
      path: '/code-to-equation',
      badge: 'Decompiler',
      badgeVariant: 'blue' as const,
      hoverClass: 'hover:border-blue-500/60 dark:hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5',
      iconClass: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white',
      accentText: 'text-blue-600 dark:text-blue-400',
      tag: 'AST Reverse Parser'
    },
    {
      title: 'Python Playground (Pyodide WASM)',
      description: 'Execute live CPython 3.12 and NumPy calculations directly inside the browser with zero backend server.',
      icon: Terminal,
      path: '/playground',
      badge: 'Live Execution',
      badgeVariant: 'teal' as const,
      hoverClass: 'hover:border-cyan-500/60 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/5',
      iconClass: 'bg-gradient-to-br from-cyan-500/20 to-teal-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 group-hover:scale-105 group-hover:bg-cyan-600 group-hover:text-white',
      accentText: 'text-cyan-600 dark:text-cyan-400',
      tag: 'WebAssembly Pyodide'
    },
    {
      title: 'Step-by-Step Derivation',
      description: 'Explore pedagogical mathematical breakdowns connected step-by-step to verified Python implementations.',
      icon: Layers,
      path: '/derivation',
      badge: 'Derivations',
      badgeVariant: 'amber' as const,
      hoverClass: 'hover:border-amber-500/60 dark:hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/10 dark:hover:shadow-amber-500/5',
      iconClass: 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white',
      accentText: 'text-amber-600 dark:text-amber-400',
      tag: 'Worked Derivations'
    },
    {
      title: 'Graph Plotter',
      description: 'Visualize mathematical functions, multi-curve plots, and numeric singularities in real-time.',
      icon: LineChart,
      path: '/graph-plotter',
      badge: 'Visualizer',
      badgeVariant: 'purple' as const,
      hoverClass: 'hover:border-purple-500/60 dark:hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5',
      iconClass: 'bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white',
      accentText: 'text-purple-600 dark:text-purple-400',
      tag: 'Multi-Curve Plotting'
    },
    {
      title: 'Equation Library',
      description: 'Explore 36 curated models across Mathematics, Statistics, ML, Deep Learning, and Bioinformatics.',
      icon: Library,
      path: '/library',
      badge: '36 Models',
      badgeVariant: 'emerald' as const,
      hoverClass: 'hover:border-emerald-500/60 dark:hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5',
      iconClass: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white',
      accentText: 'text-emerald-600 dark:text-emerald-400',
      tag: 'Scientific Reference'
    }
  ];

  // Specific visual styles for each of the 3 stat metrics
  const statThemes = [
    {
      borderTop: 'border-t-2 border-teal-500',
      valueColor: 'text-teal-600 dark:text-teal-400',
      badgeClass: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60',
      iconBg: 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30',
      icon: Sigma
    },
    {
      borderTop: 'border-t-2 border-indigo-500',
      valueColor: 'text-indigo-600 dark:text-indigo-400',
      badgeClass: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60',
      iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30',
      icon: Sparkles
    },
    {
      borderTop: 'border-t-2 border-rose-500',
      valueColor: 'text-rose-600 dark:text-rose-400',
      badgeClass: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60',
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Modern Scientific Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/80 dark:border-white/10 bg-gradient-to-br from-white/70 via-white/40 to-teal-50/30 dark:from-slate-900/70 dark:via-slate-900/50 dark:to-teal-950/20 backdrop-blur-2xl p-6 sm:p-9 shadow-[0_8px_32px_0_rgba(13,148,136,0.08)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
        {/* Subtle Ambient Glow Elements */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-teal-500/15 dark:bg-teal-500/20 blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/15 dark:bg-indigo-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-white/60 dark:bg-teal-950/60 border border-white/80 dark:border-teal-500/30 font-mono backdrop-blur-md shadow-2xs">
                <Cpu className="w-3.5 h-3.5 text-teal-500" />
                Scientific Computing Environment
              </span>
              <Badge variant="teal" size="sm">v1.0 Verified</Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 dark:from-teal-400 dark:via-emerald-300 dark:to-cyan-400 bg-clip-text text-transparent">
                Math2Code
              </span>
              <span className="text-slate-400 dark:text-slate-500 mx-2 font-normal">—</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Equation ↔ Code
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              High-performance scientific environment bridging formal analytical mathematics and vectorized Python algorithms with automated AST decompilation, step-by-step derivations, and interactive plotting.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/library')}
              leftIcon={<Library className="w-4 h-4 text-teal-500" />}
              className="rounded-xl shadow-xs"
            >
              Equation Library
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/equation-to-code')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="rounded-xl shadow-md shadow-teal-500/20"
            >
              Start Synthesis
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-500" />
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              System Metrics Overview
            </h2>
          </div>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-mono">
            * 100% verified test coverage
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {SAMPLE_STATS.map((stat, idx) => {
            const theme = statThemes[idx] || statThemes[0];
            const StatIcon = theme.icon;
            return (
              <Card
                key={idx}
                className={`relative overflow-hidden glass-panel glass-interactive rounded-2xl ${theme.borderTop} transition-all duration-200`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      {stat.label}
                    </span>
                    <div className={`p-2.5 rounded-xl backdrop-blur-md shadow-2xs ${theme.iconBg}`}>
                      <StatIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className={`text-2xl sm:text-3xl font-bold tracking-tight font-mono ${theme.valueColor}`}>
                    {stat.value}
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-lg backdrop-blur-md shadow-2xs ${theme.badgeClass}`}>
                      {stat.change}
                    </span>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Primary Capabilities & Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Primary Capabilities & Quick Actions
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            6 Core Engines
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Card
                key={idx}
                className={`group cursor-pointer glass-panel glass-interactive rounded-2xl transition-all duration-200 hover:-translate-y-1.5 ${action.hoverClass}`}
                onClick={() => navigate(action.path)}
              >
                <CardContent className="p-5 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className={`p-3 rounded-xl transition-all duration-200 shrink-0 backdrop-blur-md shadow-2xs ${action.iconClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant={action.badgeVariant} size="sm">
                        {action.badge}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-1.5">
                      {action.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                      {action.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                      {action.tag}
                    </span>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${action.accentText} group-hover:translate-x-1.5 transition-transform`}>
                      <span>Open Engine</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
