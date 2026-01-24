import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookOpen, CheckCircle2, Users, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { StudySession, READING_LEVELS } from '@/hooks/useStudyGroups';

interface StudySessionCardProps {
  session: StudySession;
  groupId: string;
  readingLevel: string;
  completedCount: number;
  totalMembers: number;
  isCompleted: boolean;
  onComplete: (
    sessionId: string,
    groupId: string,
    readingLevel: string,
    reflectionText?: string,
    questionsForGroup?: string,
    timeSpentMinutes?: number
  ) => Promise<{ error: Error | null }>;
}

// Sample multi-level content (in real app, this would come from an API/database)
const getContentForLevel = (book: string, chapter: number, level: string) => {
  const baseContent: Record<string, { summary: string; questions: string[] }> = {
    picture: {
      summary: `📖 ${book} ${chapter}\n\nGod loves you very much! He wants to help you every day. When you're happy or sad, God is always there with you.`,
      questions: [
        'What is one thing God does for us?',
        'How does it feel to know God loves you?'
      ]
    },
    early_reader: {
      summary: `📖 ${book} Chapter ${chapter}\n\nIn this chapter, we learn about God's amazing love and how He guides us. God has a special plan for each of us, and He wants us to follow Him. When we trust God, He helps us make good choices.`,
      questions: [
        'What does it mean to trust God?',
        'How can you follow God today?',
        'What is one good choice you can make?'
      ]
    },
    intermediate: {
      summary: `📖 ${book} Chapter ${chapter}\n\nThis passage teaches us about faith and how it applies to our daily lives. The writer wants us to understand that following God isn't always easy, but it's always worth it. We learn that God is faithful even when things are hard.`,
      questions: [
        'What challenges might come from following God?',
        'How does this passage encourage you?',
        'What can you apply to your life this week?'
      ]
    },
    advanced: {
      summary: `📖 ${book} Chapter ${chapter}\n\nThis chapter dives deep into theological concepts about God's relationship with humanity. The author presents arguments about faith, grace, and the calling of believers. We see how the early church understood these truths and applied them to their communities.`,
      questions: [
        'What theological themes do you see in this passage?',
        'How would you explain this to someone younger?',
        'What questions does this raise for you?'
      ]
    },
    adult: {
      summary: `📖 ${book} Chapter ${chapter}\n\nThis text presents rich theological content worthy of deep study. Consider the historical context, the original audience, and how these truths have been understood throughout church history. Cross-reference with related passages and commentaries for fuller understanding.`,
      questions: [
        'What is the author\'s main argument or point?',
        'How does this connect to the broader biblical narrative?',
        'What practical implications does this have for your faith community?',
        'How might you teach this to others?'
      ]
    }
  };

  return baseContent[level] || baseContent.adult;
};

export function StudySessionCard({
  session,
  groupId,
  readingLevel,
  completedCount,
  totalMembers,
  isCompleted,
  onComplete
}: StudySessionCardProps) {
  const [expanded, setExpanded] = useState(!isCompleted);
  const [reflection, setReflection] = useState('');
  const [questions, setQuestions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const content = getContentForLevel(session.book, session.chapter, readingLevel);
  const levelInfo = READING_LEVELS.find(l => l.value === readingLevel);
  const completionPercent = totalMembers > 0 ? (completedCount / totalMembers) * 100 : 0;

  const handleComplete = async () => {
    setSubmitting(true);
    const { error } = await onComplete(
      session.id,
      groupId,
      readingLevel,
      reflection.trim() || undefined,
      questions.trim() || undefined,
      5 // Estimated time
    );

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Study completed! Great work! 🎉');
      setExpanded(false);
    }
    setSubmitting(false);
  };

  return (
    <Card className={`border-2 ${isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-primary/30'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {session.session_title || `${session.book} ${session.chapter}`}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isCompleted ? 'default' : 'outline'}>
                {levelInfo?.label.split(' ')[0] || readingLevel}
              </Badge>
              <span className="text-sm text-muted-foreground">{session.session_date}</span>
            </div>
          </div>
          {isCompleted && (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          )}
        </div>

        {/* Group Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Users className="h-4 w-4" />
              Group Progress
            </span>
            <span className="font-medium">{completedCount}/{totalMembers} completed</span>
          </div>
          <Progress value={completionPercent} className="h-2" />
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
              Hide Study Content
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
            {/* Content at user's level */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="whitespace-pre-line text-sm">{content.summary}</p>
            </div>

            {/* Discussion Questions */}
            <div>
              <h4 className="font-medium mb-2">Discussion Questions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                {content.questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>

            {!isCompleted && (
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

                {/* Questions for Group */}
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

                {/* Complete Button */}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
