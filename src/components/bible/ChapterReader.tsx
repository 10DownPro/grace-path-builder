import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ArrowLeft, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Share2, Users, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ShareVerseToFeedDialog } from '@/components/feed/ShareVerseToFeedDialog';
import type { BibleBook } from '@/lib/bibleBooks';

interface Verse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

interface ChapterReaderProps {
  book: BibleBook;
  chapter: number;
  verses: Verse[];
  loading: boolean;
  onBack: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onSaveVerse?: (verseNumber: number) => void;
  savedVerses?: Set<number>;
}

export function ChapterReader({
  book,
  chapter,
  verses,
  loading,
  onBack,
  onPrevChapter,
  onNextChapter,
  onSaveVerse,
  savedVerses = new Set()
}: ChapterReaderProps) {
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [verseToShare, setVerseToShare] = useState<{ reference: string; text: string; book: string; chapter: number } | null>(null);

  const hasPrev = chapter > 1;
  const hasNext = chapter < book.chapters;

  const handleVerseAction = (verse: Verse, action: 'copy' | 'share' | 'save') => {
    if (action === 'copy') {
      const text = `"${verse.text}"\n\n— ${book.name} ${chapter}:${verse.verse} (KJV)`;
      navigator.clipboard.writeText(text);
      toast.success('Verse copied!');
    } else if (action === 'share') {
      setVerseToShare({
        reference: `${book.name} ${chapter}:${verse.verse}`,
        text: verse.text,
        book: book.name,
        chapter: chapter,
      });
      setShareDialogOpen(true);
    } else if (action === 'save' && onSaveVerse) {
      onSaveVerse(verse.verse);
    }
    setSelectedVerse(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-display text-lg uppercase tracking-wider text-foreground">
            {book.name} {chapter}
          </h3>
        </div>

        {/* Chapter Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevChapter}
            disabled={!hasPrev}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[60px] text-center">
            {chapter} / {book.chapters}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNextChapter}
            disabled={!hasNext}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : (
        <ScrollArea className="flex-1 pt-4">
          <div className="space-y-3 pr-4 pb-4">
            {verses.map((verse) => {
              const isSelected = selectedVerse?.verse === verse.verse;
              const isSaved = savedVerses.has(verse.verse);

              return (
                <div key={verse.verse} className="relative group">
                  <button
                    onClick={() => setSelectedVerse(isSelected ? null : verse)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-all",
                      isSelected
                        ? "bg-primary/10 ring-1 ring-primary"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <span className="text-primary font-bold text-xs mr-2">
                      {verse.verse}
                    </span>
                    <span className="text-foreground leading-relaxed">
                      {verse.text}
                    </span>
                  </button>

                  {/* Action Buttons */}
                  {isSelected && (
                    <div className="flex items-center gap-1 mt-2 ml-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerseAction(verse, 'copy')}
                        className="h-8 px-3 text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        <span className="text-xs">Copy</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerseAction(verse, 'share')}
                        className="h-8 px-3 text-muted-foreground hover:text-primary"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        <span className="text-xs">Feed</span>
                      </Button>
                      {onSaveVerse && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerseAction(verse, 'save')}
                          className={cn(
                            "h-8 px-3",
                            isSaved ? "text-primary" : "text-muted-foreground hover:text-primary"
                          )}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="h-3 w-3 mr-1" />
                          ) : (
                            <Bookmark className="h-3 w-3 mr-1" />
                          )}
                          <span className="text-xs">{isSaved ? 'Saved' : 'Save'}</span>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}

      {/* Share Dialog */}
      {verseToShare && (
        <ShareVerseToFeedDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          verse={verseToShare}
        />
      )}
    </div>
  );
}
