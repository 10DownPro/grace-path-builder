import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Search, 
  Loader2, 
  Plus,
  ChevronDown,
  ChevronUp,
  Library
} from 'lucide-react';
import { useBiblePassages, BiblePassage, READING_LEVEL_INFO } from '@/hooks/useBiblePassages';
import { MultiLevelStudyCard } from './MultiLevelStudyCard';

interface PassageLibraryProps {
  groupId: string;
  userReadingLevel: string;
  isLeader: boolean;
  onCreateSession?: (
    groupId: string,
    book: string,
    chapter: number,
    title?: string
  ) => Promise<{ error: Error | null }>;
  onCompletePassage?: (
    passageId: string,
    readingLevel: string,
    reflection?: string,
    questionsForGroup?: string
  ) => Promise<{ error: Error | null }>;
  completedPassageIds?: string[];
}

export function PassageLibrary({
  groupId,
  userReadingLevel,
  isLeader,
  onCreateSession,
  onCompletePassage,
  completedPassageIds = []
}: PassageLibraryProps) {
  const { passages, loading } = useBiblePassages();
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // Get unique themes from passages
  const themes = [...new Set(passages.map(p => p.passage_theme).filter(Boolean))] as string[];

  // Filter passages based on search and theme
  const filteredPassages = passages.filter(p => {
    const matchesSearch = searchTerm === '' || 
      p.passage_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.passage_theme?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTheme = selectedTheme === null || p.passage_theme === selectedTheme;
    
    return matchesSearch && matchesTheme;
  });

  const handleStartSession = async (passage: BiblePassage) => {
    if (!onCreateSession) return;
    
    const { error } = await onCreateSession(
      groupId,
      passage.book,
      passage.chapter,
      passage.passage_name
    );
    
    if (!error) {
      // Session created successfully
    }
  };

  const levelInfo = READING_LEVEL_INFO.find(l => l.value === userReadingLevel);

  if (loading) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Library className="h-5 w-5 text-primary" />
            Passage Library
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Pre-loaded Bible passages with age-appropriate content for the whole family.
            Each passage adapts to your reading level.
          </p>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {levelInfo?.emoji} Your Level: {levelInfo?.label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {passages.length} Passages Available
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search passages..."
            className="pl-9"
          />
        </div>

        {/* Theme Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedTheme === null ? 'default' : 'outline'}
            onClick={() => setSelectedTheme(null)}
            className="text-xs"
          >
            All Themes
          </Button>
          {themes.map(theme => (
            <Button
              key={theme}
              size="sm"
              variant={selectedTheme === theme ? 'default' : 'outline'}
              onClick={() => setSelectedTheme(theme)}
              className="text-xs"
            >
              {theme}
            </Button>
          ))}
        </div>
      </div>

      {/* Toggle View */}
      <button
        className="flex items-center gap-2 text-sm text-primary w-full justify-center py-2"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <>
            <ChevronUp className="h-4 w-4" />
            Collapse Library
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            Show {filteredPassages.length} Passages
          </>
        )}
      </button>

      {/* Passages Grid */}
      {expanded && (
        <div className="space-y-4">
          {filteredPassages.length === 0 ? (
            <Card className="border-2 border-dashed border-muted-foreground/20">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No passages found matching your search.</p>
              </CardContent>
            </Card>
          ) : (
            filteredPassages.map(passage => (
              <div key={passage.id} className="space-y-2">
                {isLeader && onCreateSession && (
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartSession(passage)}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Start Group Session
                    </Button>
                  </div>
                )}
                <MultiLevelStudyCard
                  passage={passage}
                  userReadingLevel={userReadingLevel}
                  isCompleted={completedPassageIds.includes(passage.id)}
                  onComplete={onCompletePassage}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
