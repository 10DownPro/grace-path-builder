import { useState } from 'react';
import { BIBLE_BOOKS, OLD_TESTAMENT, NEW_TESTAMENT, type BibleBook } from '@/lib/bibleBooks';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronRight } from 'lucide-react';

interface BookSelectorProps {
  onSelectBook: (book: BibleBook) => void;
  selectedBookId?: string;
}

export function BookSelector({ onSelectBook, selectedBookId }: BookSelectorProps) {
  const [testament, setTestament] = useState<'old' | 'new'>('old');

  const books = testament === 'old' ? OLD_TESTAMENT : NEW_TESTAMENT;

  return (
    <div className="space-y-4">
      {/* Testament Toggle */}
      <div className="flex gap-2">
        <Button
          variant={testament === 'old' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTestament('old')}
          className="flex-1"
        >
          Old Testament
        </Button>
        <Button
          variant={testament === 'new' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTestament('new')}
          className="flex-1"
        >
          New Testament
        </Button>
      </div>

      {/* Book Grid */}
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-2 gap-2 pr-4">
          {books.map((book) => (
            <button
              key={book.id}
              onClick={() => onSelectBook(book)}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg text-left transition-all",
                "border-2",
                selectedBookId === book.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium truncate">{book.name}</span>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
