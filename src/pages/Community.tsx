import { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DailyTopicCard } from '@/components/community/DailyTopicCard';
import { CommunityGuidelines } from '@/components/community/CommunityGuidelines';
import { CommentThread } from '@/components/community/CommentThread';
import { CommentComposer } from '@/components/community/CommentComposer';
import { useCommunityTrenches, SortOption } from '@/hooks/useCommunityTrenches';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, TrendingUp, Clock, Zap, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Community() {
  const {
    topic,
    comments,
    loading,
    commentsLoading,
    sortBy,
    setSortBy,
    addComment,
    voteComment,
    addReaction,
    reportComment,
    editComment,
    getCategoryLabel
  } = useCommunityTrenches();

  const discussionRef = useRef<HTMLDivElement>(null);
  const [showComments, setShowComments] = useState(false);

  const scrollToDiscussion = () => {
    setShowComments(true);
    setTimeout(() => {
      discussionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wider text-foreground">
            THE TRENCHES
          </h1>
          <p className="text-muted-foreground mt-2">
            Daily discussions. Real faith. No fluff.
          </p>
        </div>

        {/* Guidelines */}
        <CommunityGuidelines />

        {/* Today's Topic */}
        <DailyTopicCard
          topic={topic}
          loading={loading}
          getCategoryLabel={getCategoryLabel}
          onJoinDiscussion={scrollToDiscussion}
        />

        {/* Discussion Section */}
        {showComments && topic && (
          <div ref={discussionRef} className="space-y-4 pt-4">
            {/* Comment Composer */}
            <div className="bg-card border-2 border-border rounded-lg p-4">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Add Your Voice
              </h3>
              <CommentComposer
                onSubmit={(text) => addComment(text)}
                placeholder="Share your thoughts on today's topic..."
              />
            </div>

            {/* Sort Options */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">
                {topic.comment_count} Comments
              </h3>
              <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <TabsList className="h-8">
                  <TabsTrigger value="top" className="text-xs h-7 px-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Top
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="text-xs h-7 px-2">
                    <Clock className="h-3 w-3 mr-1" />
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="controversial" className="text-xs h-7 px-2">
                    <Zap className="h-3 w-3 mr-1" />
                    Hot
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Comments */}
            <div className="bg-card border-2 border-border rounded-lg divide-y divide-border">
              {commentsLoading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : comments.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No comments yet. Be the first!</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {comments.map((comment) => (
                    <div key={comment.id} className="px-4">
                      <CommentThread
                        comment={comment}
                        onVote={voteComment}
                        onReply={addComment}
                        onReact={addReaction}
                        onReport={reportComment}
                        onEdit={editComment}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Initial CTA if not showing comments */}
        {!showComments && topic && (
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={scrollToDiscussion}
              className="font-bold"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              VIEW DISCUSSION ({topic.comment_count})
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
