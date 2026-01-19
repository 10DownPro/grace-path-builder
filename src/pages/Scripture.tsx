import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Bookmark, BookmarkCheck, Search, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Scripture } from '@/types/faith';
import { useScripture, BibleTranslation, translationNames } from '@/hooks/useScripture';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ScripturePage() {
  const [savedVerses, setSavedVerses] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [translation, setTranslation] = useState<BibleTranslation>('kjv');
  const [verses, setVerses] = useState<Scripture[]>([]);
  const [searchResult, setSearchResult] = useState<Scripture | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const { fetchVerse, fetchMultipleVerses, loading, error } = useScripture();

  useEffect(() => {
    loadVerses();
  }, [translation]);

  const loadVerses = async () => {
    const fetchedVerses = await fetchMultipleVerses('random', translation);
    setVerses(fetchedVerses);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResult(null);
    
    const result = await fetchVerse(searchQuery, translation);
    setSearchResult(result);
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleSave = (reference: string) => {
    setSavedVerses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reference)) {
        newSet.delete(reference);
      } else {
        newSet.add(reference);
      }
      return newSet;
    });
  };

  const displayVerses = searchResult ? [searchResult] : verses;

  return (
    <PageLayout>
      <div className="px-4 pt-12 pb-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Scripture Library</h1>
            <p className="text-muted-foreground">Read, search, and save verses</p>
          </div>
          <Select value={translation} onValueChange={(v) => setTranslation(v as BibleTranslation)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(translationNames) as BibleTranslation[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {t.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by reference (e.g., John 3:16)"
              className="pl-10 bg-card border-border/50"
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
        </div>

        {/* Translation info */}
        <div className="text-sm text-muted-foreground">
          Reading: <span className="font-medium text-foreground">{translationNames[translation]}</span>
        </div>

        {/* Reading Plans */}
        <div className="spiritual-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-golden flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">30-Day Psalms Journey</p>
                <p className="text-sm text-muted-foreground">Day 7 of 30</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full gradient-golden rounded-full" style={{ width: '23%' }} />
          </div>
        </div>

        {/* Saved Verses */}
        {savedVerses.size > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4 text-primary" />
              Saved Verses ({savedVerses.size})
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Array.from(savedVerses).map(ref => (
                <button
                  key={ref}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium whitespace-nowrap"
                >
                  {ref}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Result Banner */}
        {searchResult && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-sm text-primary font-medium">
              Showing result for "{searchQuery}"
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchResult(null);
                setSearchQuery('');
              }}
            >
              Clear
            </Button>
          </div>
        )}

        {/* Verses List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">
              {searchResult ? 'Search Result' : 'Daily Verses'}
            </h2>
            {!searchResult && (
              <Button variant="ghost" size="sm" onClick={loadVerses} disabled={loading}>
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                Refresh
              </Button>
            )}
          </div>

          {loading && !searchResult ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error && !searchResult ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Failed to load verses</p>
              <Button variant="outline" onClick={loadVerses}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : displayVerses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No verses found</p>
            </div>
          ) : (
            displayVerses.map((verse) => (
              <VerseCard
                key={verse.reference}
                verse={verse}
                isSaved={savedVerses.has(verse.reference)}
                onToggleSave={() => toggleSave(verse.reference)}
              />
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}

function VerseCard({ 
  verse, 
  isSaved, 
  onToggleSave 
}: { 
  verse: Scripture; 
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <div className="spiritual-card p-5 space-y-3">
      <div className="flex items-start justify-between">
        <span className="font-medium text-primary">{verse.reference}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleSave}
          className={cn(isSaved && "text-primary")}
        >
          <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
        </Button>
      </div>
      <blockquote className="font-scripture text-lg leading-relaxed text-foreground/90 italic">
        "{verse.text}"
      </blockquote>
      <p className="text-sm text-muted-foreground">{verse.translation}</p>
    </div>
  );
}
