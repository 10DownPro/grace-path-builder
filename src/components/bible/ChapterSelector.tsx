import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import type { BibleBook } from '@/lib/bibleBooks';

interface ChapterSelectorProps {
  book: BibleBook;
  selectedChapter?: number;
  onSelectChapter: (chapter: number) => void;
  onBack: () => void;
}

export function ChapterSelector({ book, selectedChapter, onSelectChapter, onBack }: ChapterSelectorProps) {
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-display text-lg uppercase tracking-wider text-foreground">
          {book.name}
        </h3>
      </div>

      {/* Chapter Grid */}
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-5 gap-2 pr-4">
          {chapters.map((chapter) => (
            <button
              key={chapter}
              onClick={() => onSelectChapter(chapter)}
              className={cn(
                "aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all",
                "border-2",
                selectedChapter === chapter
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50 text-foreground"
              )}
            >
              {chapter}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
