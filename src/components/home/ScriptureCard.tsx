import { BookOpen, Bookmark, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Scripture } from '@/types/faith';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useScripture, BibleTranslation, translationNames } from '@/hooks/useScripture';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScriptureCardProps {
  scripture?: Scripture;
}

export function ScriptureCard({ scripture: initialScripture }: ScriptureCardProps) {
  const [saved, setSaved] = useState(false);
  const [translation, setTranslation] = useState<BibleTranslation>('kjv');
  const [scripture, setScripture] = useState<Scripture | null>(initialScripture || null);
  const { fetchDailyVerse, loading, error } = useScripture();

  useEffect(() => {
    loadDailyVerse();
  }, [translation]);

  const loadDailyVerse = async () => {
    const verse = await fetchDailyVerse(translation);
    if (verse) {
      setScripture(verse);
    }
  };

  return (
    <div className="spiritual-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Today's Verse</h3>
        </div>
        <div className="flex items-center gap-2">
          <Select value={translation} onValueChange={(v) => setTranslation(v as BibleTranslation)}>
            <SelectTrigger className="w-[80px] h-9 text-xs border-border/50 bg-muted/30">
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
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 transition-colors",
              saved && "text-accent"
            )}
            onClick={() => setSaved(!saved)}
          >
            <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-6 space-y-3">
          <p className="text-sm text-muted-foreground">Failed to load verse</p>
          <Button variant="outline" size="sm" onClick={loadDailyVerse} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      ) : scripture ? (
        <div className="space-y-4 py-2">
          <div className="relative">
            <span className="absolute -left-2 -top-2 text-4xl text-accent/30 font-scripture">"</span>
            <p className="font-scripture text-xl leading-relaxed text-foreground pl-4 pr-2 italic">
              {scripture.text}
            </p>
            <span className="absolute -right-1 bottom-0 text-4xl text-accent/30 font-scripture rotate-180">"</span>
          </div>
          <div className="flex items-center justify-between pl-4">
            <p className="text-sm font-medium text-primary">
              — {scripture.reference}
            </p>
            <span className="text-xs text-muted-foreground">{scripture.translation}</span>
          </div>
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-6">No verse available</p>
      )}
    </div>
  );
}
