import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Bookmark, BookmarkCheck, Search, ChevronRight } from 'lucide-react';
import { dailyVerses, todayScripture } from '@/lib/sampleData';
import { cn } from '@/lib/utils';
import { Scripture } from '@/types/faith';

export default function ScripturePage() {
  const [savedVerses, setSavedVerses] = useState<Set<string>>(new Set(['Psalm 23:1-3']));
  const [searchQuery, setSearchQuery] = useState('');

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

  const allVerses = [todayScripture, ...dailyVerses];
  const filteredVerses = searchQuery
    ? allVerses.filter(v => 
        v.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allVerses;

  return (
    <PageLayout>
      <div className="px-4 pt-12 pb-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Scripture Library</h1>
          <p className="text-muted-foreground">Read, search, and save verses</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Scripture..."
            className="pl-10 bg-card border-border/50"
          />
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

        {/* Verses List */}
        <div className="space-y-4">
          <h2 className="font-semibold text-foreground">Daily Verses</h2>
          {filteredVerses.map((verse) => (
            <VerseCard
              key={verse.reference}
              verse={verse}
              isSaved={savedVerses.has(verse.reference)}
              onToggleSave={() => toggleSave(verse.reference)}
            />
          ))}
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
