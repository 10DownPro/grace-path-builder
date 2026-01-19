import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Bookmark, BookmarkCheck, Search, ChevronRight, Loader2, RefreshCw, Shield, Flame, Mountain, Sparkles, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Scripture } from '@/types/faith';
import { useScripture, BibleTranslation, translationNames } from '@/hooks/useScripture';
import { useVerseImage } from '@/hooks/useVerseImage';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Thematic icons for verse decoration
const verseIcons = [Shield, Flame, Mountain, BookOpen];

export default function ScripturePage() {
  const [savedVerses, setSavedVerses] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [translation, setTranslation] = useState<BibleTranslation>('kjv');
  const [verses, setVerses] = useState<Scripture[]>([]);
  const [searchResult, setSearchResult] = useState<Scripture | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [dailyVerse, setDailyVerse] = useState<Scripture | null>(null);
  const [dailyVerseImage, setDailyVerseImage] = useState<string | null>(null);
  
  const { fetchVerse, fetchMultipleVerses, fetchDailyVerse, loading, error } = useScripture();
  const { generateImage, getFallbackGradient, selectThemeFromVerse, loading: imageLoading } = useVerseImage();

  useEffect(() => {
    loadVerses();
    loadDailyVerse();
  }, [translation]);

  const loadDailyVerse = async () => {
    const verse = await fetchDailyVerse(translation);
    if (verse) {
      setDailyVerse(verse);
    }
  };

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

  const handleGenerateDailyImage = async () => {
    if (!dailyVerse) return;
    toast.info('Generating battle background...');
    const result = await generateImage(dailyVerse.text, dailyVerse.reference);
    if (result?.imageUrl) {
      setDailyVerseImage(result.imageUrl);
      toast.success('Background generated! 💪');
    }
  };

  const handleShareDailyVerse = async () => {
    if (!dailyVerse) return;
    const shareText = `"${dailyVerse.text}" — ${dailyVerse.reference}\n\n#FaithTraining #BattleVerse`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Battle Verse', text: shareText });
      } catch {
        navigator.clipboard.writeText(shareText);
        toast.success('Verse copied!');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Verse copied!');
    }
  };

  const displayVerses = searchResult ? [searchResult] : verses;
  const dailyTheme = dailyVerse ? selectThemeFromVerse(dailyVerse.text) : 'iron';
  const dailyBackground = dailyVerseImage 
    ? { backgroundImage: `url(${dailyVerseImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: getFallbackGradient(dailyTheme) };

  return (
    <PageLayout>
      <div className="px-4 pt-12 pb-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="font-display text-3xl text-primary uppercase tracking-wide">Armory</h1>
            <p className="text-muted-foreground text-sm uppercase tracking-wider">Load your ammo</p>
          </div>
          <Select value={translation} onValueChange={(v) => setTranslation(v as BibleTranslation)}>
            <SelectTrigger className="w-24 bg-muted border-border">
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

        {/* Visual Verse of the Day */}
        {dailyVerse && (
          <div className="gym-card overflow-hidden">
            <div 
              className="relative min-h-[200px] transition-all duration-500"
              style={dailyBackground}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
              
              {/* Content */}
              <div className="relative z-10 p-5 flex flex-col justify-between min-h-[200px]">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-md bg-primary/80 text-xs font-display text-primary-foreground uppercase tracking-wider">
                    Verse of the Day
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleGenerateDailyImage}
                      disabled={imageLoading}
                      className="bg-black/30 hover:bg-black/50 text-white"
                    >
                      {imageLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShareDailyVerse}
                      className="bg-black/30 hover:bg-black/50 text-white"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3 mt-auto">
                  <p className="text-lg font-bold text-white leading-relaxed drop-shadow-lg">
                    "{dailyVerse.text}"
                  </p>
                  <p className="font-display text-primary uppercase tracking-widest text-sm drop-shadow-md">
                    — {dailyVerse.reference}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by reference (e.g., John 3:16)"
              className="pl-10 bg-card border-2 border-border"
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching} className="btn-gym px-4">
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
        </div>

        {/* Reading Plans */}
        <div className="gym-card-accent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-display text-sm text-primary uppercase tracking-wide">30-Day Psalms Journey</p>
                <p className="text-xs text-muted-foreground">Day 7 of 30 • Keep grinding</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          {/* Visual Progress Bar with Milestones */}
          <div className="mt-3 relative">
            <div className="h-3 rounded-full bg-muted overflow-hidden progress-gym">
              <div className="progress-gym-fill" style={{ width: '23%' }} />
            </div>
            {/* Milestone markers */}
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">Day 1</span>
              <span className="text-xs text-primary font-bold">Day 7</span>
              <span className="text-xs text-muted-foreground">Day 30</span>
            </div>
          </div>
        </div>

        {/* Saved Verses */}
        {savedVerses.size > 0 && (
          <div className="space-y-3">
            <h2 className="font-display text-sm text-primary uppercase tracking-wide flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4" />
              Saved Ammo ({savedVerses.size})
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Array.from(savedVerses).map(ref => (
                <button
                  key={ref}
                  className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30 text-primary text-xs font-bold whitespace-nowrap uppercase tracking-wide"
                >
                  {ref}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Result Banner */}
        {searchResult && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border-2 border-success/30">
            <span className="text-sm text-success font-bold uppercase tracking-wide">
              Target acquired: "{searchQuery}"
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchResult(null);
                setSearchQuery('');
              }}
              className="text-success hover:text-success/80"
            >
              Clear
            </Button>
          </div>
        )}

        {/* Verses List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-foreground uppercase tracking-wide">
              {searchResult ? 'Target Found' : 'Battle Verses'}
            </h2>
            {!searchResult && (
              <Button variant="ghost" size="sm" onClick={loadVerses} disabled={loading}>
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                Reload
              </Button>
            )}
          </div>

          {loading && !searchResult ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="font-display text-sm text-muted-foreground uppercase">Loading ammo...</p>
            </div>
          ) : error && !searchResult ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-muted-foreground">Failed to load verses</p>
              <Button variant="outline" onClick={loadVerses} className="border-2 border-primary">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : displayVerses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-display text-lg text-muted-foreground uppercase">No ammo found</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search</p>
            </div>
          ) : (
            displayVerses.map((verse, index) => (
              <VerseCard
                key={verse.reference}
                verse={verse}
                isSaved={savedVerses.has(verse.reference)}
                onToggleSave={() => toggleSave(verse.reference)}
                icon={verseIcons[index % verseIcons.length]}
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
  onToggleSave,
  icon: Icon
}: { 
  verse: Scripture; 
  isSaved: boolean;
  onToggleSave: () => void;
  icon: typeof Shield;
}) {
  return (
    <div className="gym-card p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary/60" />
          <span className="font-display text-sm text-primary uppercase tracking-wide">{verse.reference}</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleSave}
          className={cn("hover:bg-primary/10", isSaved && "text-primary")}
        >
          <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
        </Button>
      </div>
      <blockquote className="text-lg leading-relaxed text-foreground font-medium">
        "{verse.text}"
      </blockquote>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{verse.translation}</p>
    </div>
  );
}
