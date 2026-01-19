import { useState, useEffect } from 'react';
import { Shield, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useScripture, BibleTranslation, translationNames } from '@/hooks/useScripture';
import { Scripture } from '@/types/faith';

export function BattleVerse() {
  const [translation, setTranslation] = useState<BibleTranslation>('kjv');
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const { fetchDailyVerse, loading, error } = useScripture();

  useEffect(() => {
    loadVerse();
  }, [translation]);

  const loadVerse = async () => {
    const verse = await fetchDailyVerse(translation);
    if (verse) {
      setScripture(verse);
    }
  };

  return (
    <div className="gym-card overflow-hidden">
      {/* Header */}
      <div className="bg-primary/10 px-5 py-4 border-b-2 border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <h3 className="font-display text-xl text-primary uppercase tracking-wide">
            Battle Verse
          </h3>
        </div>
        <Select value={translation} onValueChange={(v) => setTranslation(v as BibleTranslation)}>
          <SelectTrigger className="w-20 h-8 text-xs bg-muted border-border">
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

      {/* Content */}
      <div className="p-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-display text-sm text-muted-foreground uppercase">
              Loading ammo...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-6 space-y-3">
            <p className="text-sm text-muted-foreground">Failed to load verse</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadVerse}
              className="border-2 border-border hover:border-primary"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : scripture ? (
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute -left-1 -top-2 text-6xl text-primary/20 font-display">
                "
              </span>
              <p className="text-lg font-bold text-foreground leading-relaxed pl-6 pr-4">
                {scripture.text}
              </p>
              <span className="absolute -right-1 bottom-0 text-6xl text-primary/20 font-display rotate-180">
                "
              </span>
            </div>
            <p className="font-display text-base text-primary uppercase tracking-wider pl-6">
              — {scripture.reference}
            </p>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-6">No verse available</p>
        )}
      </div>
    </div>
  );
}
