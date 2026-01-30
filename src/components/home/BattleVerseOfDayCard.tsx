import { useState } from 'react';
import { Sword, Bookmark, Share2, Loader2, BookmarkCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBattleVerseOfDay } from '@/hooks/useBattleVerseOfDay';
import { ShareDialog } from '@/components/ui/ShareDialog';
import { cn } from '@/lib/utils';

export function BattleVerseOfDayCard() {
  const { verse, loading, isSaved, saveVerse, getVerseText } = useBattleVerseOfDay();
  const [showShare, setShowShare] = useState(false);

  if (loading) {
    return (
      <Card className="bg-card border-2 border-border">
        <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!verse) {
    return null;
  }

  const verseText = getVerseText('kjv');

  return (
    <>
      <Card className={cn(
        "relative overflow-hidden border-2",
        "bg-gradient-to-br from-card via-card to-primary/5",
        "border-primary/30 hover:border-primary/50 transition-all duration-300"
      )}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, hsl(var(--primary)) 10px, hsl(var(--primary)) 11px)',
          }} />
        </div>

        <CardContent className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sword className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  Today's Battle Verse
                </p>
                <Badge 
                  variant="outline" 
                  className="mt-1 bg-destructive/10 border-destructive/30 text-destructive font-bold text-xs"
                >
                  {verse.theme}
                </Badge>
              </div>
            </div>
          </div>

          {/* Verse Text */}
          <blockquote className="mb-4">
            <p className="text-lg md:text-xl font-display leading-relaxed text-foreground">
              "{verseText}"
            </p>
          </blockquote>

          {/* Reference */}
          <p className="text-sm font-medium text-primary mb-6">
            — {verse.verse_reference}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant={isSaved ? "secondary" : "outline"}
              size="sm"
              onClick={saveVerse}
              disabled={isSaved}
              className="flex-1 sm:flex-none"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-1" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-1" />
                  Save to Collection
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShare(true)}
              className="flex-1 sm:flex-none"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </CardContent>

        {/* Bottom accent */}
        <div className="h-1 bg-gradient-to-r from-primary via-destructive to-primary" />
      </Card>

      <ShareDialog
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        title="Share Battle Verse"
        text={`"${verseText}"\n\n— ${verse.verse_reference}`}
        hashtags={['FaithFit', 'BattleVerse']}
      />
    </>
  );
}
