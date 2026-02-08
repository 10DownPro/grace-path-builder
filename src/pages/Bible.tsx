import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { BookSelector } from '@/components/bible/BookSelector';
import { ChapterSelector } from '@/components/bible/ChapterSelector';
import { ChapterReader } from '@/components/bible/ChapterReader';
import { useGroupScripture } from '@/hooks/useGroupScripture';
import { BIBLE_BOOKS, type BibleBook } from '@/lib/bibleBooks';
import { BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

type ViewMode = 'book' | 'chapter' | 'reading';

export default function Bible() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('book');
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [verses, setVerses] = useState<Array<{
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>>([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const { fetchChapter, loading, error } = useGroupScripture();

  // Handle URL parameters for deep linking (e.g., /bible?book=Psalm&chapter=23)
  useEffect(() => {
    if (initialLoadDone) return;
    
    const bookParam = searchParams.get('book');
    const chapterParam = searchParams.get('chapter');
    
    if (bookParam && chapterParam) {
      // Find the book by name (case-insensitive, handle variations)
      const normalizedBookName = bookParam.toLowerCase().trim();
      const foundBook = BIBLE_BOOKS.find(b => 
        b.name.toLowerCase() === normalizedBookName ||
        b.name.toLowerCase().startsWith(normalizedBookName) ||
        // Handle "Psalms" vs "Psalm" variation
        (normalizedBookName === 'psalm' && b.name.toLowerCase() === 'psalms') ||
        (normalizedBookName === 'psalms' && b.name.toLowerCase() === 'psalms')
      );
      
      if (foundBook) {
        const chapter = parseInt(chapterParam, 10);
        if (!isNaN(chapter) && chapter >= 1 && chapter <= foundBook.chapters) {
          setSelectedBook(foundBook);
          setSelectedChapter(chapter);
          setViewMode('reading');
          
          // Fetch the chapter
          fetchChapter(foundBook.name, chapter, 'kjv').then(result => {
            if (result?.verses) {
              setVerses(result.verses);
            }
          });
        }
      }
    }
    
    setInitialLoadDone(true);
  }, [searchParams, initialLoadDone, fetchChapter]);

  const handleSelectBook = (book: BibleBook) => {
    setSelectedBook(book);
    setViewMode('chapter');
  };

  const handleSelectChapter = async (chapter: number) => {
    if (!selectedBook) return;
    setSelectedChapter(chapter);
    setViewMode('reading');
    
    const result = await fetchChapter(selectedBook.name, chapter, 'kjv');
    if (result?.verses) {
      setVerses(result.verses);
    }
  };

  const handlePrevChapter = async () => {
    if (selectedChapter > 1) {
      await handleSelectChapter(selectedChapter - 1);
    }
  };

  const handleNextChapter = async () => {
    if (selectedBook && selectedChapter < selectedBook.chapters) {
      await handleSelectChapter(selectedChapter + 1);
    }
  };

  const handleBackFromChapter = () => {
    setViewMode('book');
    setSelectedBook(null);
  };

  const handleBackFromReading = () => {
    setViewMode('chapter');
  };

  return (
    <PageLayout>
      <div className="px-4 pt-8 pb-6 space-y-6 min-h-screen">
        {/* Hero Header */}
        {viewMode === 'book' && (
          <div className="relative overflow-hidden rounded-xl gym-card p-6">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
            
            <div className="relative space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-display text-2xl uppercase tracking-wider text-foreground">
                    The Bible
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    66 Books • Full Scripture Access
                  </p>
                </div>
              </div>
              
              {/* Group Study CTA */}
              <div className="pt-4 mt-4 border-t border-border">
                <Link to="/friends?tab=squads">
                  <Button variant="outline" size="sm" className="w-full gap-2 border-primary/30 hover:bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-display text-xs uppercase">Study with Squad</span>
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Join or create a squad to study the Bible together
                </p>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
          </div>
        )}

        {/* Content */}
        <div className="gym-card p-4 min-h-[500px]">
          {viewMode === 'book' && (
            <BookSelector
              onSelectBook={handleSelectBook}
              selectedBookId={selectedBook?.id}
            />
          )}

          {viewMode === 'chapter' && selectedBook && (
            <ChapterSelector
              book={selectedBook}
              selectedChapter={selectedChapter}
              onSelectChapter={handleSelectChapter}
              onBack={handleBackFromChapter}
            />
          )}

          {viewMode === 'reading' && selectedBook && (
            <ChapterReader
              book={selectedBook}
              chapter={selectedChapter}
              verses={verses}
              loading={loading}
              onBack={handleBackFromReading}
              onPrevChapter={handlePrevChapter}
              onNextChapter={handleNextChapter}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
