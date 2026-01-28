import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, BookOpen, PenLine, Swords, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CrisisBanner } from './CrisisBanner';
import { VerseDisplay } from './VerseDisplay';
import { useFeelings } from '@/hooks/useFeelings';
import type { FeelingCategory, FeelingVerse, SupportMessage, CrisisResource } from '@/hooks/useFeelings';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { usePremium } from '@/hooks/usePremium';

interface CategoryDetailProps {
  category: FeelingCategory;
  onBack: () => void;
}

export function CategoryDetail({ category, onBack }: CategoryDetailProps) {
  const { fetchCategoryVerses, saveVerse, unsaveVerse, getSavedVerses, loading } = useFeelings();
  const { isPremium } = usePremium();
  
  const FREE_VERSE_LIMIT = 50;
  
  const [verses, setVerses] = useState<FeelingVerse[]>([]);
  const [supportMessage, setSupportMessage] = useState<SupportMessage | null>(null);
  const [crisisResources, setCrisisResources] = useState<CrisisResource[]>([]);
  const [savedVerseIds, setSavedVerseIds] = useState<Set<string>>(new Set());
  const [savedVerseCount, setSavedVerseCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const loadVerses = useCallback(async (refresh: boolean = false) => {
    setIsRefreshing(true);
    const response = await fetchCategoryVerses(category.id, 7);
    
    if (refresh) {
      setVerses(response.verses);
    } else {
      setVerses(response.verses);
    }
    
    setSupportMessage(response.supportMessage);
    setCrisisResources(response.crisisResources);
    setHasMore(response.verses.length >= 7);
    setIsRefreshing(false);
  }, [category.id, fetchCategoryVerses]);

  const loadSavedVerses = useCallback(async () => {
    const saved = await getSavedVerses();
    setSavedVerseIds(new Set(saved.map(s => s.verse.id)));
    setSavedVerseCount(saved.length);
  }, [getSavedVerses]);

  useEffect(() => {
    loadVerses();
    loadSavedVerses();
  }, [loadVerses, loadSavedVerses]);

  const handleSaveVerse = async (verseId: string) => {
    // Check free tier limit
    if (!isPremium && savedVerseCount >= FREE_VERSE_LIMIT) {
      setShowUpgradePrompt(true);
      toast.error(`Free limit reached (${FREE_VERSE_LIMIT} verses)`, {
        description: 'Upgrade to Premium for unlimited saved verses'
      });
      return;
    }
    
    const success = await saveVerse(verseId, category.id);
    if (success) {
      setSavedVerseIds(prev => new Set([...prev, verseId]));
      setSavedVerseCount(prev => prev + 1);
    }
  };

  const handleUnsaveVerse = async (verseId: string) => {
    const success = await unsaveVerse(verseId);
    if (success) {
      setSavedVerseIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(verseId);
        return newSet;
      });
      setSavedVerseCount(prev => prev - 1);
    }
  };

  const handleLoadMore = async () => {
    const response = await fetchCategoryVerses(category.id, 5);
    setVerses(prev => [...prev, ...response.verses.filter(v => !prev.find(pv => pv.id === v.id))]);
    setHasMore(response.verses.length >= 5);
  };

  const handleSaveAll = async () => {
    const unsavedVerses = verses.filter(v => !savedVerseIds.has(v.id));
    
    // Check free tier limit
    if (!isPremium && (savedVerseCount + unsavedVerses.length) > FREE_VERSE_LIMIT) {
      const remaining = FREE_VERSE_LIMIT - savedVerseCount;
      if (remaining <= 0) {
        setShowUpgradePrompt(true);
        toast.error(`Free limit reached (${FREE_VERSE_LIMIT} verses)`, {
          description: 'Upgrade to Premium for unlimited saved verses'
        });
        return;
      }
      toast.warning(`Only saving ${remaining} verses (free limit)`);
      for (let i = 0; i < remaining; i++) {
        await saveVerse(unsavedVerses[i].id, category.id);
      }
      setSavedVerseCount(FREE_VERSE_LIMIT);
      await loadSavedVerses();
      return;
    }
    
    for (const verse of unsavedVerses) {
      await saveVerse(verse.id, category.id);
    }
    setSavedVerseIds(new Set(verses.map(v => v.id)));
    setSavedVerseCount(prev => prev + unsavedVerses.length);
    toast.success(`Added ${unsavedVerses.length} verses to Battle Verses`);
  };

  // Get category-specific gradient
  const getCategoryGradient = (id: string): string => {
    const gradients: Record<string, string> = {
      anxiety: 'from-amber-900/20 to-background',
      depression: 'from-blue-900/20 to-background',
      lust: 'from-red-900/20 to-background',
      suicidal: 'from-destructive/20 to-background',
      angry: 'from-red-800/20 to-background',
      fearful: 'from-amber-800/20 to-background',
      lonely: 'from-purple-900/20 to-background',
      grief: 'from-slate-700/20 to-background'
    };
    return gradients[id] || 'from-primary/10 to-background';
  };

  return (
    <div className="min-h-screen">
      {/* Crisis Banner - Always visible for crisis categories */}
      {category.is_crisis && crisisResources.length > 0 && (
        <CrisisBanner resources={crisisResources} categoryName={category.name} />
      )}

      {/* Header */}
      <div className={`relative bg-gradient-to-b ${getCategoryGradient(category.id)}`}>
        <div className="px-4 pt-4 pb-6">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-display text-sm uppercase tracking-wide">Back</span>
          </button>

          {/* Category Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-card border-2 border-border flex items-center justify-center text-4xl">
              {category.emoji || '📖'}
            </div>
            <div>
              <h1 className="font-display text-3xl text-foreground uppercase tracking-wide">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-sm text-muted-foreground font-body mt-1">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Verse Display */}
        <VerseDisplay
          verses={verses}
          supportMessage={supportMessage}
          savedVerseIds={savedVerseIds}
          onSaveVerse={handleSaveVerse}
          onUnsaveVerse={handleUnsaveVerse}
          onRefresh={() => loadVerses(true)}
          onLoadMore={handleLoadMore}
          loading={loading || isRefreshing}
          hasMore={hasMore}
        />

        {/* Quick Actions */}
        <div className="space-y-3 pb-8">
          <p className="font-display text-xs text-muted-foreground uppercase tracking-wider">
            Quick Actions
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <Link to="/prayer" className="block">
              <Button
                variant="outline"
                className="w-full h-14 border-2 border-border hover:border-primary/50 flex-col gap-1"
              >
                <PenLine className="h-5 w-5 text-primary" />
                <span className="font-display text-xs uppercase">Pray About This</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={handleSaveAll}
              className="h-14 border-2 border-border hover:border-primary/50 flex-col gap-1"
            >
              <Swords className="h-5 w-5 text-primary" />
              <span className="font-display text-xs uppercase">Save All Verses</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
