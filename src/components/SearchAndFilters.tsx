import React, { useState } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
} from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  sortBy: 'name-asc' | 'name-desc' | 'part-asc' | 'srp-asc' | 'srp-desc' | 'shop-asc' | 'shop-desc';
}

interface SearchAndFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  brands: string[];
  brandCounts: Record<string, number>;
  totalFiltered: number;
  totalAll: number;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  brands,
  brandCounts,
  totalFiltered,
  totalAll,
  viewMode,
  onViewModeChange,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveAdvancedFilters =
    filters.brand !== 'ALL' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '';

  const hasAnyFilters =
    filters.searchQuery.trim() !== '' ||
    hasActiveAdvancedFilters;

  const update = (patch: Partial<FilterState>) => {
    onFilterChange({ ...filters, ...patch });
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 py-3 sm:py-4 px-3 sm:px-6 lg:px-8 space-y-3 sm:space-y-3.5">
      {/* Search Input Row & Controls */}
      <div className="flex flex-col gap-2.5">
        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => update({ searchQuery: e.target.value })}
            placeholder="Search by Part #, Item Name, or Brand..."
            className="w-full pl-9 pr-9 py-2.5 bg-slate-950/80 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-base sm:text-sm transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => update({ searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Row 2: Sort dropdown + Brand quick select + Filters + View mode */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Sort Dropdown */}
          <div className="flex-1 min-w-[140px] max-w-[240px]">
            <select
              value={filters.sortBy}
              onChange={(e) => update({ sortBy: e.target.value as any })}
              className="w-full bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-2.5 py-2 sm:py-2.5 outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="name-asc">Item Name (A-Z)</option>
              <option value="name-desc">Item Name (Z-A)</option>
              <option value="part-asc">Part # (A-Z)</option>
              <option value="srp-asc">SRP: Low to High</option>
              <option value="srp-desc">SRP: High to Low</option>
              <option value="shop-asc">Shop: Low to High</option>
              <option value="shop-desc">Shop: High to Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center space-x-1.5 px-3 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition ${
                hasActiveAdvancedFilters || showAdvanced
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                  : 'bg-slate-950/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Filters</span>
              {hasActiveAdvancedFilters && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-950/80 border border-slate-700 rounded-xl p-0.5 sm:p-1">
              <button
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Pricelist Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Cards Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Horizontal Scroll Chips */}
      <div className="-mx-3 sm:mx-0 px-3 sm:px-0 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
        <button
          onClick={() => update({ brand: 'ALL' })}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filters.brand === 'ALL'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
          }`}
        >
          All Brands ({totalAll})
        </button>
        {brands.map((b) => {
          const count = brandCounts[b] || 0;
          const isSelected = filters.brand === b;
          return (
            <button
              key={b}
              onClick={() => update({ brand: b })}
              className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              <span>{b}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Collapsible Advanced Filters */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-950/60 p-3 sm:p-4 rounded-xl border border-slate-800 animate-in fade-in">
          {/* Brand Filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Filter by Brand
            </label>
            <select
              value={filters.brand}
              onChange={(e) => update({ brand: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm sm:text-xs rounded-lg px-2.5 py-2.5 sm:py-2 outline-none focus:border-amber-500"
            >
              <option value="ALL">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* SRP Price Range in PHP ₱ */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              SRP Price Range (₱)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(e) => update({ minPrice: e.target.value })}
                placeholder="Min ₱"
                className="w-1/2 bg-slate-900 border border-slate-700 text-slate-200 text-sm sm:text-xs rounded-lg px-2.5 py-2.5 sm:py-2 outline-none focus:border-amber-500 placeholder-slate-600"
              />
              <span className="text-slate-500 text-xs">-</span>
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(e) => update({ maxPrice: e.target.value })}
                placeholder="Max ₱"
                className="w-1/2 bg-slate-900 border border-slate-700 text-slate-200 text-sm sm:text-xs rounded-lg px-2.5 py-2.5 sm:py-2 outline-none focus:border-amber-500 placeholder-slate-600"
              />
            </div>
          </div>

          {/* Reset button inside drawer */}
          <div className="sm:col-span-2 lg:col-span-1 flex items-end">
            {hasActiveAdvancedFilters && (
              <button
                onClick={() =>
                  update({
                    brand: 'ALL',
                    minPrice: '',
                    maxPrice: '',
                  })
                }
                className="w-full py-2 px-3 rounded-lg border border-slate-700 text-xs text-amber-400 hover:text-amber-300 hover:bg-slate-900 flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results Count & Clear Button */}
      <div className="flex items-center justify-between gap-2 text-xs text-slate-400 pt-0.5">
        <div className="flex items-center space-x-1.5 truncate">
          <span>
            Showing <strong className="text-slate-100 font-semibold">{totalFiltered}</strong> of{' '}
            <strong className="text-slate-100 font-semibold">{totalAll}</strong> items
          </span>
          {hasAnyFilters && (
            <span className="text-amber-400 text-[11px] font-medium hidden xs:inline">
              (Filtered)
            </span>
          )}
        </div>

        {hasAnyFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-amber-400 transition shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
