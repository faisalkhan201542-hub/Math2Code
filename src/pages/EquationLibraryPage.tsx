import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Library,
  Search,
  GraduationCap,
  LineChart,
  LayoutGrid,
  List,
  RotateCcw,
  BookMarked,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MathRenderer } from '../components/math/MathRenderer';
import { EQUATION_CATALOGUE } from '../data/equationCatalogue';
import type { CatalogueCategory, EquationDifficulty } from '../types/catalogue';
import { EquationDetailView } from '../components/library/EquationDetailView';

const ALL_CATEGORIES: (CatalogueCategory | 'All')[] = [
  'All',
  'Mathematics & Linear Algebra',
  'Probability & Statistics',
  'Machine Learning',
  'Deep Learning',
  'Optimization & Information Theory',
  'Bioinformatics'
];

const DIFFICULTY_LEVELS: (EquationDifficulty | 'All')[] = [
  'All',
  'Foundational',
  'Intermediate',
  'Advanced'
];

export const EquationLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: urlParamId } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc' | 'category' | 'difficulty-asc' | 'difficulty-desc'>('title-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Currently inspected equation from URL param or query parameter
  const activeEquationId = urlParamId || searchParams.get('equation');
  const selectedEquation = useMemo(() => {
    if (!activeEquationId) return null;
    return EQUATION_CATALOGUE.find((eq) => eq.id === activeEquationId) || null;
  }, [activeEquationId]);

  // Handle open equation detail
  const handleOpenDetail = (id: string) => {
    navigate(`/library/${id}`);
  };

  // Handle back to catalogue
  const handleBackToCatalogue = () => {
    navigate('/library');
  };

  // Clear all active filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSelectedDifficulty('All');
    setSortBy('title-asc');
  };

  // Available subcategories given the active category
  const availableSubcategories = useMemo(() => {
    const list = new Set<string>();
    for (const eq of EQUATION_CATALOGUE) {
      if (selectedCategory === 'All' || eq.category === selectedCategory) {
        list.add(eq.subcategory);
      }
    }
    return ['All', ...Array.from(list).sort()];
  }, [selectedCategory]);

  // Filter and sort equations
  const filteredEquations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = EQUATION_CATALOGUE.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategory !== 'All' && item.subcategory !== selectedSubcategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && item.difficulty !== selectedDifficulty) {
        return false;
      }

      // Search query filter across title, formula, description, variables, and tags
      if (q) {
        const titleMatch = item.title.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);
        const mathMatch = item.mathematicalMeaning.toLowerCase().includes(q);
        const formulaMatch = item.formula.toLowerCase().includes(q);
        const latexMatch = item.latex.toLowerCase().includes(q);
        const tagMatch = item.tags.some((t) => t.toLowerCase().includes(q));
        const varMatch = item.variables.some(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            v.symbol.toLowerCase().includes(q) ||
            v.description.toLowerCase().includes(q)
        );

        if (!titleMatch && !descMatch && !mathMatch && !formulaMatch && !latexMatch && !tagMatch && !varMatch) {
          return false;
        }
      }

      return true;
    });

    // Sort matching equations
    return matches.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'category':
          return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
        case 'difficulty-asc': {
          const rank = { Foundational: 1, Intermediate: 2, Advanced: 3 };
          return rank[a.difficulty] - rank[b.difficulty] || a.title.localeCompare(b.title);
        }
        case 'difficulty-desc': {
          const rank = { Foundational: 1, Intermediate: 2, Advanced: 3 };
          return rank[b.difficulty] - rank[a.difficulty] || a.title.localeCompare(b.title);
        }
        default:
          return 0;
      }
    });
  }, [searchQuery, selectedCategory, selectedSubcategory, selectedDifficulty, sortBy]);

  const getDifficultyBadgeVariant = (diff: string) => {
    switch (diff) {
      case 'Foundational':
        return 'emerald';
      case 'Intermediate':
        return 'blue';
      case 'Advanced':
        return 'purple';
      default:
        return 'slate';
    }
  };

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'Mathematics & Linear Algebra':
        return 'amber';
      case 'Probability & Statistics':
        return 'blue';
      case 'Machine Learning':
        return 'teal';
      case 'Deep Learning':
        return 'purple';
      case 'Optimization & Information Theory':
        return 'rose';
      case 'Bioinformatics':
        return 'emerald';
      default:
        return 'teal';
    }
  };

  const getCategoryColorStyles = (cat: string, isSelected: boolean) => {
    switch (cat) {
      case 'Mathematics & Linear Algebra':
        return isSelected
          ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-950 dark:text-amber-200 ring-2 ring-amber-500/30 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400/60 dark:hover:border-amber-600/60 hover:bg-amber-50/30 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300';
      case 'Probability & Statistics':
        return isSelected
          ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-950 dark:text-blue-200 ring-2 ring-blue-500/30 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400/60 dark:hover:border-blue-600/60 hover:bg-blue-50/30 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300';
      case 'Machine Learning':
        return isSelected
          ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 text-teal-950 dark:text-teal-200 ring-2 ring-teal-500/30 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400/60 dark:hover:border-teal-600/60 hover:bg-teal-50/30 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300';
      case 'Deep Learning':
        return isSelected
          ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-500 text-purple-950 dark:text-purple-200 ring-2 ring-purple-500/30 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400/60 dark:hover:border-purple-600/60 hover:bg-purple-50/30 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300';
      case 'Optimization & Information Theory':
        return isSelected
          ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-950 dark:text-rose-200 ring-2 ring-rose-500/30 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-400/60 dark:hover:border-rose-600/60 hover:bg-rose-50/30 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300';
      case 'Bioinformatics':
        return isSelected
          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/30 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400/60 dark:hover:border-emerald-600/60 hover:bg-emerald-50/30 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300';
      default:
        return isSelected
          ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 text-teal-950 dark:text-teal-200 ring-2 ring-teal-500/30 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  // If a specific equation detail view is active
  if (activeEquationId) {
    if (!selectedEquation) {
      return (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookMarked className="w-8 h-8 text-rose-500 mx-auto" />
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Equation Not Found
          </h2>
          <p className="text-xs text-slate-500">
            No equation with identifier "{activeEquationId}" exists in the catalogue.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToCatalogue}
            className="text-xs font-mono"
          >
            Back to All Equations
          </Button>
        </div>
      );
    }

    return (
      <EquationDetailView
        equation={selectedEquation}
        onBack={handleBackToCatalogue}
        onSelectEquation={handleOpenDetail}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500/10 via-sky-500/5 to-teal-500/10 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-teal-950/30 border border-indigo-500/20 dark:border-indigo-500/30 p-5 sm:p-6 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-indigo-500/15 via-transparent to-transparent blur-2xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 shrink-0">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                  Scientific Reference Library
                </span>
                <Badge variant="indigo" size="sm">
                  {EQUATION_CATALOGUE.length} Verified Equations
                </Badge>
                <Badge variant="emerald" size="sm">
                  6 Research Domains
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Mathematical Equation Library
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                Comprehensive, searchable mathematical catalogue connecting equations with code generation, step-by-step derivations, and interactive plots.
              </p>
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <div className="flex items-center p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden md:inline font-mono">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
                <span className="hidden md:inline font-mono">List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {ALL_CATEGORIES.filter((c) => c !== 'All').map((cat) => {
          const count = EQUATION_CATALOGUE.filter((e) => e.category === cat).length;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(isSelected ? 'All' : cat);
                setSelectedSubcategory('All');
              }}
              className={`p-3 rounded-xl border text-left transition-all text-xs flex flex-col justify-between h-22 cursor-pointer ${getCategoryColorStyles(cat, isSelected)}`}
            >
              <span className="font-semibold line-clamp-2">{cat}</span>
              <div className="flex items-center justify-between text-[11px] font-mono mt-1 opacity-80">
                <span>{count} equations</span>
                {isSelected && <span className="font-bold">✓</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, formula, variable, tag, or intuition..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>

          {/* Quick Clear Button */}
          {(searchQuery || selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedSubcategory !== 'All') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
              className="text-xs h-9 shrink-0"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Filter Dropdowns & Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] uppercase font-mono">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('All');
              }}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Dropdown */}
          {availableSubcategories.length > 2 && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px] uppercase font-mono">Topic:</span>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {availableSubcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] uppercase font-mono">Level:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              {DIFFICULTY_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 ml-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <option value="title-asc">Title (A → Z)</option>
              <option value="title-desc">Title (Z → A)</option>
              <option value="category">Category</option>
              <option value="difficulty-asc">Difficulty (Low → High)</option>
              <option value="difficulty-desc">Difficulty (High → Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Summary & Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono px-1">
        <span>
          Showing <strong className="text-slate-800 dark:text-slate-200">{filteredEquations.length}</strong> of{' '}
          {EQUATION_CATALOGUE.length} catalogued equations
        </span>
        {selectedCategory !== 'All' && (
          <span className="text-teal-600 dark:text-teal-400">
            Filtering by: {selectedCategory}
          </span>
        )}
      </div>

      {/* Equations Presentation: Grid or List */}
      {filteredEquations.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookMarked className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No Equations Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No mathematical equations matched your query and filter criteria.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs"
          >
            Reset All Filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEquations.map((eq) => (
            <Card
              key={eq.id}
              className="flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-md group"
            >
              <CardHeader className="pb-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant={getCategoryBadgeVariant(eq.category)} size="sm">
                        {eq.category}
                      </Badge>
                      <Badge variant={getDifficultyBadgeVariant(eq.difficulty)} size="sm">
                        {eq.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm sm:text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {eq.title}
                    </CardTitle>
                  </div>
                  {eq.isEngineSupported && (
                    <Badge variant="emerald" size="sm" className="shrink-0">
                      Engine
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
                {/* Mathematical Formula Preview via KaTeX */}
                <div className="p-3 rounded-lg bg-gradient-to-b from-slate-50 to-white dark:from-slate-950/80 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800 overflow-x-auto min-h-[64px] flex items-center justify-center">
                  <MathRenderer math={eq.latex} displayMode={true} />
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {eq.description}
                </p>

                {/* Tags & Subcategory */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="truncate">{eq.subcategory}</span>
                  <div className="flex items-center gap-1.5">
                    {eq.derivationPatternId && (
                      <span title="Step-by-step derivation available">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                      </span>
                    )}
                    {eq.plottableExpr && (
                      <span title="Plottable on interactive graph">
                        <LineChart className="w-3.5 h-3.5 text-purple-500" />
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2.5 pb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDetail(eq.id)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="w-full text-xs"
                >
                  View Details & Implementation
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-2.5">
          {filteredEquations.map((eq) => (
            <div
              key={eq.id}
              onClick={() => handleOpenDetail(eq.id)}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/60 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={getCategoryBadgeVariant(eq.category)} size="sm">
                    {eq.category}
                  </Badge>
                  <Badge variant={getDifficultyBadgeVariant(eq.difficulty)} size="sm">
                    {eq.difficulty}
                  </Badge>
                  {eq.isEngineSupported && (
                    <Badge variant="emerald" size="sm">
                      Engine Supported
                    </Badge>
                  )}
                  <span className="text-xs font-mono text-slate-400">
                    {eq.subcategory}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {eq.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                  {eq.description}
                </p>
              </div>

              {/* KaTeX formula preview in list row */}
              <div className="sm:max-w-xs shrink-0 p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-x-auto">
                <MathRenderer math={eq.latex} displayMode={false} />
              </div>

              {/* Quick action buttons in list row */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetail(eq.id);
                  }}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Explore
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
