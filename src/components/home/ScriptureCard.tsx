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
    <div className="spiritual-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <BookOpen className="h-5 w-5" />
          <span className="font-medium">Today's Verse</span>
        </div>
        <div className="flex items-center gap-2">
          <Select value={translation} onValueChange={(v) => setTranslation(v as BibleTranslation)}>
            <SelectTrigger className="w-20 h-8 text-xs">
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
            onClick={() => setSaved(!saved)}
            className={cn(saved && "text-primary")}
          >
            <Bookmark className={cn("h-5 w-5", saved && "fill-current")} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground text-sm mb-3">Failed to load verse</p>
          <Button variant="outline" size="sm" onClick={loadDailyVerse}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      ) : scripture ? (
        <>
          <blockquote className="font-scripture text-xl leading-relaxed text-foreground/90 italic">
            "{scripture.text}"
          </blockquote>

          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-primary">{scripture.reference}</span>
            <span className="text-muted-foreground">{scripture.translation}</span>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground text-center py-4">No verse available</p>
      )}
    </div>
  );
}
