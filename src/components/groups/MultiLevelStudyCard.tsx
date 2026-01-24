import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { BookOpen, CheckCircle2, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useBiblePassages, READING_LEVEL_INFO, PassageLevel, BiblePassage } from '@/hooks/useBiblePassages';

interface MultiLevelStudyCardProps {
  passage: BiblePassage;
  userReadingLevel: string;
  isCompleted?: boolean;
  onComplete?: (
    passageId: string,
    readingLevel: string,
    reflection?: string,
    questionsForGroup?: string
  ) => Promise<{ error: Error | null }>;
}

export function MultiLevelStudyCard({
  passage,
  userReadingLevel,
  isCompleted = false,
  onComplete
}: MultiLevelStudyCardProps) {
  const { getPassageContent, getAvailableLevelsForPassage } = useBiblePassages();
  
  const [expanded, setExpanded] = useState(!isCompleted);
  const [selectedLevel, setSelectedLevel] = useState(userReadingLevel);
  const [content, setContent] = useState<PassageLevel | null>(null);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [reflection, setReflection] = useState('');
  const [questions, setQuestions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadContent();
    loadAvailableLevels();
  }, [passage.id, selectedLevel]);

  const loadContent = async () => {
    setLoading(true);
    const data = await getPassageContent(passage.id, selectedLevel);
    setContent(data);
    setLoading(false);
  };

  const loadAvailableLevels = async () => {
    const levels = await getAvailableLevelsForPassage(passage.id);
    setAvailableLevels(levels);
  };

  const handleComplete = async () => {
    if (!onComplete) return;
    
    setSubmitting(true);
    const { error } = await onComplete(
      passage.id,
      selectedLevel,
      reflection.trim() || undefined,
      questions.trim() || undefined
    );

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Study completed! 🎉');
      setExpanded(false);
    }
    setSubmitting(false);
  };

  const levelInfo = READING_LEVEL_INFO.find(l => l.value === selectedLevel);

  return (
    <Card className={`border-2 ${isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-primary/30'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {passage.passage_name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">
                {passage.book} {passage.chapter}:{passage.verse_start}
                {passage.verse_end && passage.verse_end !== passage.verse_start && `-${passage.verse_end}`}
              </Badge>
              {passage.passage_theme && (
                <Badge variant="secondary" className="text-xs">
                  {passage.passage_theme}
                </Badge>
              )}
            </div>
          </div>
          {isCompleted && (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          )}
        </div>

        {/* Level Selector */}
        <div className="mt-3">
          <Label className="text-xs text-muted-foreground">Reading Level</Label>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {READING_LEVEL_INFO.filter(l => 
                availableLevels.length === 0 || availableLevels.includes(l.value)
              ).map(level => (
                <SelectItem key={level.value} value={level.value}>
                  <span className="flex items-center gap-2">
                    <span>{level.emoji}</span>
                    <span>{level.label}</span>
                    <span className="text-xs text-muted-foreground">({level.ageRange})</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <button
          className="flex items-center gap-2 text-sm text-primary w-full justify-center py-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide Content
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              {isCompleted ? 'Review Study' : 'Start Study'}
            </>
          )}
        </button>

        {expanded && (
          <div className="space-y-4 mt-4 pt-4 border-t">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : content ? (
              <>
                {/* Level Badge */}
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {levelInfo?.emoji} {levelInfo?.label} Version
                  </span>
                </div>

                {/* Summary Content */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="whitespace-pre-line text-sm leading-relaxed">{content.summary}</p>
                </div>

                {/* Key Verse */}
                {content.key_verse && (
                  <div className="bg-primary/5 rounded-lg p-3 border-l-4 border-primary">
                    <div className="text-xs font-medium text-primary mb-1">Key Verse</div>
                    <p className="text-sm italic">"{content.key_verse}"</p>
                  </div>
                )}

                {/* Discussion Questions */}
                {content.discussion_questions && content.discussion_questions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Discussion Questions:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      {content.discussion_questions.map((q, i) => (
                        <li key={i} className="leading-relaxed">{q}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Activity Suggestion */}
                {content.activity_suggestion && (
                  <div className="bg-yellow-500/10 rounded-lg p-3">
                    <div className="text-xs font-medium text-yellow-600 mb-1">📝 Activity</div>
                    <p className="text-sm">{content.activity_suggestion}</p>
                  </div>
                )}

                {/* Prayer Prompt */}
                {content.prayer_prompt && (
                  <div className="bg-purple-500/10 rounded-lg p-3">
                    <div className="text-xs font-medium text-purple-600 mb-1">🙏 Prayer</div>
                    <p className="text-sm italic">{content.prayer_prompt}</p>
                  </div>
                )}

                {!isCompleted && onComplete && (
                  <>
                    {/* Reflection */}
                    <div className="space-y-2">
                      <Label htmlFor="reflection">Your Reflection (Optional)</Label>
                      <Textarea
                        id="reflection"
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder="What stood out to you? What did you learn?"
                        rows={3}
                      />
                    </div>

                    {/* Questions */}
                    <div className="space-y-2">
                      <Label htmlFor="questions">Questions for the Group (Optional)</Label>
                      <Textarea
                        id="questions"
                        value={questions}
                        onChange={(e) => setQuestions(e.target.value)}
                        placeholder="Any questions you'd like to discuss?"
                        rows={2}
                      />
                    </div>

                    <Button
                      onClick={handleComplete}
                      disabled={submitting}
                      className="w-full"
                      size="lg"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Complete Study
                        </>
                      )}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Content not available for this reading level.</p>
                <p className="text-sm">Try selecting a different level.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
