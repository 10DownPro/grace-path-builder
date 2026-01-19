import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { CategoryGrid } from '@/components/feelings/CategoryGrid';
import { CategoryDetail } from '@/components/feelings/CategoryDetail';
import { useFeelings } from '@/hooks/useFeelings';
import type { FeelingCategory } from '@/hooks/useFeelings';
import { Shield, Swords } from 'lucide-react';

export default function Battles() {
  const { fetchCategories, loading } = useFeelings();
  const [categories, setCategories] = useState<FeelingCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FeelingCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  const handleSelectCategory = (category: FeelingCategory) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  // Show category detail view
  if (selectedCategory) {
    return (
      <PageLayout showNav={false}>
        <CategoryDetail 
          category={selectedCategory} 
          onBack={handleBack}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen pb-24">
        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-background" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative px-4 pt-6 pb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl text-foreground uppercase tracking-wide">
                  Battle Verses
                </h1>
                <p className="text-xs text-muted-foreground font-display uppercase tracking-widest">
                  Find Strength for Your Struggle
                </p>
              </div>
            </div>

            <p className="text-muted-foreground font-body text-sm mt-4">
              God's Word speaks to every battle. Select what you're facing right now to find Scripture that fights for you.
            </p>
          </div>

          {/* Bottom accent line */}
          <div className="h-1 bg-gradient-to-r from-primary via-warning to-primary" />
        </div>

        {/* Category Grid */}
        <div className="px-4 pt-6">
          <CategoryGrid
            categories={categories}
            onSelect={handleSelectCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            loading={loading}
          />
        </div>

        {/* Motivational Footer */}
        <div className="text-center px-4 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
            <Swords className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-display">
              Fight Back with Scripture
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
