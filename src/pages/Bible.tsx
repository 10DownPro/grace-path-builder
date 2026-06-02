import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { BookSelector } from '@/components/bible/BookSelector';
import { ChapterSelector } from '@/components/bible/ChapterSelector';
import { ChapterReader } from '@/components/bible/ChapterReader';
import { useGroupScripture } from '@/hooks/useGroupScripture';
import { useScripture, BibleTranslation, translationNames } from '@/hooks/useScripture';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BibleBook } from '@/lib/bibleBooks';
import { BookOpen } from 'lucide-react';

type Step = 'book' | 'chapter' | 'reader';

interface Verse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export default function Bible() {
  const [step, setStep] = useState<Step>('book');
  const [book, setBook] = useState<BibleBook | null>(null);
  const [chapter, setChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [savedVerses, setSavedVerses] = useState<Set<number>>(new Set());
  const [translation, setTranslation] = useState<BibleTranslation>('kjv');

  const { fetchChapter, loading } = useGroupScripture();

  const loadChapter = async (b: BibleBook, c: number) => {
    const result = await fetchChapter(b.name, c, translation);
    if (result?.verses) setVerses(result.verses as Verse[]);
    else setVerses([]);
  };

  useEffect(() => {
    if (step === 'reader' && book && chapter) {
      loadChapter(book, chapter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, book, chapter, translation]);

  const handleSelectBook = (b: BibleBook) => {
    setBook(b);
    setStep('chapter');
  };

  const handleSelectChapter = (c: number) => {
    setChapter(c);
    setSavedVerses(new Set());
    setStep('reader');
  };

  const handlePrevChapter = () => {
    if (chapter && chapter > 1) setChapter(chapter - 1);
  };
  const handleNextChapter = () => {
    if (book && chapter && chapter < book.chapters) setChapter(chapter + 1);
  };

  const toggleSaveVerse = (v: number) => {
    setSavedVerses(prev => {
      const next = new Set(prev);
      next.has(v) ? next.delete(v) : next.add(v);
      return next;
    });
  };

  return (
    <PageLayout>
      <div className="px-4 pt-12 pb-8 space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <header className="space-y-2">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-display text-foreground">Bible</h1>
              <p className="text-muted-foreground">Read God's Word at your pace.</p>
            </div>
            <Select value={translation} onValueChange={(v) => setTranslation(v as BibleTranslation)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(translationNames) as BibleTranslation[]).map((t) => (
                  <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Body */}
        <section className="rounded-2xl border border-border bg-card/60 p-4 min-h-[480px]">
          {step === 'book' && (
            <BookSelector onSelectBook={handleSelectBook} selectedBookId={book?.id} />
          )}

          {step === 'chapter' && book && (
            <ChapterSelector
              book={book}
              selectedChapter={chapter ?? undefined}
              onSelectChapter={handleSelectChapter}
              onBack={() => setStep('book')}
            />
          )}

          {step === 'reader' && book && chapter && (
            <ChapterReader
              book={book}
              chapter={chapter}
              verses={verses}
              loading={loading}
              onBack={() => setStep('chapter')}
              onPrevChapter={handlePrevChapter}
              onNextChapter={handleNextChapter}
              onSaveVerse={toggleSaveVerse}
              savedVerses={savedVerses}
            />
          )}

          {step === 'book' && (
            <p className="mt-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <BookOpen className="h-4 w-4" />
              Choose a book and chapter to begin reading.
            </p>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
