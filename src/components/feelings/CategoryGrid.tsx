import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { FeelingCategory } from '@/hooks/useFeelings';

interface CategoryGridProps {
  categories: FeelingCategory[];
  onSelect: (category: FeelingCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading?: boolean;
}

const CATEGORY_FILTERS = [
  { id: 'all', label: 'ALL' },
  { id: 'emotional', label: 'EMOTIONAL' },
  { id: 'spiritual', label: 'SPIRITUAL' },
  { id: 'crisis', label: 'CRISIS' },
  { id: 'direction', label: 'DIRECTION' }
];

// Category color mapping
const getCategoryColor = (categoryId: string): string => {
  const colors: Record<string, string> = {
    anxiety: 'border-warning/60 hover:border-warning',
    worried: 'border-warning/60 hover:border-warning',
    stressed: 'border-warning/60 hover:border-warning',
    overwhelmed: 'border-warning/60 hover:border-warning',
    depression: 'border-blue-500/60 hover:border-blue-500',
    hopeless: 'border-blue-500/60 hover:border-blue-500',
    sad: 'border-blue-500/60 hover:border-blue-500',
    lust: 'border-primary/60 hover:border-primary',
    tempted: 'border-primary/60 hover:border-primary',
    suicidal: 'border-destructive/80 hover:border-destructive',
    angry: 'border-red-700/60 hover:border-red-700',
    bitter: 'border-red-700/60 hover:border-red-700',
    fearful: 'border-amber-600/60 hover:border-amber-600',
    lonely: 'border-purple-500/60 hover:border-purple-500',
    grief: 'border-slate-500/60 hover:border-slate-500',
    lost: 'border-cyan-500/60 hover:border-cyan-500',
    confused: 'border-cyan-500/60 hover:border-cyan-500'
  };
  return colors[categoryId] || 'border-border hover:border-primary/50';
};

export function CategoryGrid({ 
  categories, 
  onSelect, 
  searchQuery, 
  onSearchChange,
  loading 
}: CategoryGridProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredCategories, setFilteredCategories] = useState<FeelingCategory[]>(categories);

  useEffect(() => {
    let filtered = categories;

    // Apply type filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'crisis') {
        filtered = categories.filter(c => c.is_crisis);
      } else {
        filtered = categories.filter(c => c.category_type === activeFilter);
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
      );
    }

    setFilteredCategories(filtered);
  }, [categories, activeFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search feelings or topics..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 bg-card border-2 border-border font-body text-base placeholder:text-muted-foreground/60"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORY_FILTERS.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "font-display text-xs tracking-wider whitespace-nowrap",
              activeFilter === filter.id 
                ? "bg-primary text-background" 
                : "border-border hover:border-primary/50"
            )}
          >
            {filter.id === 'crisis' && <span className="mr-1">⚠️</span>}
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="gym-card p-4 animate-pulse">
              <div className="w-10 h-10 mx-auto rounded-lg bg-muted mb-2" />
              <div className="h-3 bg-muted rounded mx-auto w-16" />
            </div>
          ))}
        </div>
      )}

      {/* Category Grid */}
      {!loading && (
        <>
          {filteredCategories.length === 0 ? (
            <div className="gym-card p-8 text-center">
              <p className="text-muted-foreground font-body">
                {searchQuery ? 'No feelings match your search' : 'No categories found'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 stagger-children">
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onSelect(category)}
                  className={cn(
                    "gym-card p-3 sm:p-4 text-center transition-all duration-200 border-2",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
                    getCategoryColor(category.id),
                    category.is_crisis && "ring-1 ring-destructive/30"
                  )}
                >
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{category.emoji || '📖'}</div>
                  <p className="font-display text-[10px] sm:text-xs uppercase tracking-wide text-foreground leading-tight line-clamp-2">
                    {category.name}
                  </p>
                  {category.is_crisis && (
                    <span className="inline-block mt-1 text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded bg-destructive/20 text-destructive font-medium">
                      CRISIS
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
