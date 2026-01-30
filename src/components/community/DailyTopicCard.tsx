import { MessageSquare, BookOpen, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CommunityTopic } from '@/hooks/useCommunityTrenches';
import { cn } from '@/lib/utils';

interface DailyTopicCardProps {
  topic: CommunityTopic | null;
  loading: boolean;
  getCategoryLabel: (category: string) => string;
  onJoinDiscussion: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  theology: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  practical_faith: 'bg-green-500/20 text-green-400 border-green-500/30',
  cultural_issues: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  personal_struggles: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  hot_takes: 'bg-red-500/20 text-red-400 border-red-500/30',
  scripture_application: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  rest: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
};

const SENSITIVE_CATEGORIES = ['personal_struggles'];

export function DailyTopicCard({ topic, loading, getCategoryLabel, onJoinDiscussion }: DailyTopicCardProps) {
  if (loading) {
    return (
      <Card className="bg-card border-2 border-border">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!topic) {
    return (
      <Card className="bg-card border-2 border-border">
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No topic posted for today yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Check back at 5:00 AM</p>
        </CardContent>
      </Card>
    );
  }

  const isSensitive = SENSITIVE_CATEGORIES.includes(topic.topic_category);
  const categoryColor = CATEGORY_COLORS[topic.topic_category] || CATEGORY_COLORS.theology;
  const formattedDate = new Date(topic.topic_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className={cn(
      "relative overflow-hidden border-2",
      "bg-gradient-to-br from-card via-card to-muted/20",
      "border-border hover:border-primary/30 transition-all duration-300"
    )}>
      {/* Sensitive topic warning */}
      {isSensitive && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span className="text-xs text-amber-500 font-medium">
            Sensitive topic - Please engage with grace and compassion
          </span>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Today's Topic
            </p>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
          <Badge 
            variant="outline" 
            className={cn("font-bold text-xs uppercase", categoryColor)}
          >
            {getCategoryLabel(topic.topic_category)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Topic Question */}
        <blockquote className="mb-4">
          <p className="text-lg md:text-xl font-display leading-relaxed text-foreground">
            "{topic.topic_text}"
          </p>
        </blockquote>

        {/* Related Scripture */}
        {topic.related_scripture_reference && (
          <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-2">
              <BookOpen className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-primary">
                  📖 {topic.related_scripture_reference}
                </p>
                {topic.related_scripture_text && (
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    "{topic.related_scripture_text}"
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comment count and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">{topic.comment_count} comments</span>
          </div>

          <Button onClick={onJoinDiscussion} className="font-bold">
            JOIN DISCUSSION
          </Button>
        </div>
      </CardContent>

      {/* Bottom accent based on category */}
      <div className={cn(
        "h-1",
        topic.topic_category === 'theology' && "bg-gradient-to-r from-blue-500 to-blue-600",
        topic.topic_category === 'practical_faith' && "bg-gradient-to-r from-green-500 to-green-600",
        topic.topic_category === 'cultural_issues' && "bg-gradient-to-r from-purple-500 to-purple-600",
        topic.topic_category === 'personal_struggles' && "bg-gradient-to-r from-orange-500 to-orange-600",
        topic.topic_category === 'hot_takes' && "bg-gradient-to-r from-red-500 to-red-600",
        topic.topic_category === 'scripture_application' && "bg-gradient-to-r from-amber-500 to-amber-600",
        topic.topic_category === 'rest' && "bg-gradient-to-r from-cyan-500 to-cyan-600",
        !CATEGORY_COLORS[topic.topic_category] && "bg-gradient-to-r from-primary to-primary"
      )} />
    </Card>
  );
}
