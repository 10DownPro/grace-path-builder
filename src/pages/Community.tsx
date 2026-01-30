import { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DailyTopicCard } from '@/components/community/DailyTopicCard';
import { CommunityGuidelines } from '@/components/community/CommunityGuidelines';
import { CommentThread } from '@/components/community/CommentThread';
import { CommentComposer } from '@/components/community/CommentComposer';
import { EnhancedFeedPost } from '@/components/community/EnhancedFeedPost';
import { CreateCommunityPostDialog } from '@/components/community/CreateCommunityPostDialog';
import { useCommunityTrenches, SortOption } from '@/hooks/useCommunityTrenches';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, TrendingUp, Clock, Zap, MessageSquare, Plus, Filter } from 'lucide-react';

export default function Community() {
  const {
    topic,
    comments,
    loading: topicLoading,
    commentsLoading,
    sortBy,
    setSortBy,
    addComment,
    voteComment,
    addReaction: addTopicReaction,
    reportComment,
    editComment,
    getCategoryLabel
  } = useCommunityTrenches();

  const {
    posts,
    loading: postsLoading,
    filter,
    setFilter,
    addReaction,
    prayForPost,
    votePoll,
    markPrayerAnswered,
    loadMore,
    hasMore
  } = useCommunityPosts();

  const discussionRef = useRef<HTMLDivElement>(null);
  const [showComments, setShowComments] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeView, setActiveView] = useState<'feed' | 'topic'>('feed');

  const scrollToDiscussion = () => {
    setShowComments(true);
    setActiveView('topic');
    setTimeout(() => {
      discussionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleComment = async (_postId: string, _text: string) => {
    return { error: null };
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wider text-foreground">
              THE TRENCHES
            </h1>
            <p className="text-muted-foreground mt-1">Daily discussions. Real faith. No fluff.</p>
          </div>
          <Button onClick={() => setShowCreatePost(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>

        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'feed' | 'topic')}>
          <TabsList>
            <TabsTrigger value="feed">Community Feed</TabsTrigger>
            <TabsTrigger value="topic">Daily Topic</TabsTrigger>
          </TabsList>
        </Tabs>

        <CommunityGuidelines />

        {activeView === 'feed' ? (
          <>
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={filter.type} onValueChange={(v) => setFilter({ ...filter, type: v as typeof filter.type })}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="prayer_requests">Prayer Requests</SelectItem>
                  <SelectItem value="testimonies">Testimonies</SelectItem>
                  <SelectItem value="polls">Polls</SelectItem>
                  <SelectItem value="music">Worship/Music</SelectItem>
                  <SelectItem value="following">Following</SelectItem>
                  <SelectItem value="my_posts">My Posts</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filter.sort} onValueChange={(v) => setFilter({ ...filter, sort: v as typeof filter.sort })}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="unanswered_prayers">Needs Prayer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {topic && (
              <div className="border-l-4 border-primary pl-2">
                <DailyTopicCard topic={topic} loading={topicLoading} getCategoryLabel={getCategoryLabel} onJoinDiscussion={scrollToDiscussion} />
              </div>
            )}

            <div className="space-y-4">
              {postsLoading && posts.length === 0 ? (
                <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : posts.length === 0 ? (
                <div className="p-8 text-center bg-card border-2 border-border rounded-lg">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No posts yet. Be the first!</p>
                  <Button className="mt-4" onClick={() => setShowCreatePost(true)}>Create Post</Button>
                </div>
              ) : (
                <>
                  {posts.map((post) => (
                    <EnhancedFeedPost key={post.id} post={post} onReaction={addReaction} onPray={prayForPost} onVotePoll={votePoll} onComment={handleComment} onMarkAnswered={markPrayerAnswered} />
                  ))}
                  {hasMore && <Button variant="outline" className="w-full" onClick={loadMore} disabled={postsLoading}>{postsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load More'}</Button>}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <DailyTopicCard topic={topic} loading={topicLoading} getCategoryLabel={getCategoryLabel} onJoinDiscussion={() => setShowComments(true)} />
            {showComments && topic && (
              <div ref={discussionRef} className="space-y-4 pt-4">
                <div className="bg-card border-2 border-border rounded-lg p-4">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><MessageSquare className="h-5 w-5" />Add Your Voice</h3>
                  <CommentComposer onSubmit={(text) => addComment(text)} placeholder="Share your thoughts..." />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{topic.comment_count} Comments</h3>
                  <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <TabsList className="h-8">
                      <TabsTrigger value="top" className="text-xs h-7 px-2"><TrendingUp className="h-3 w-3 mr-1" />Top</TabsTrigger>
                      <TabsTrigger value="recent" className="text-xs h-7 px-2"><Clock className="h-3 w-3 mr-1" />Recent</TabsTrigger>
                      <TabsTrigger value="controversial" className="text-xs h-7 px-2"><Zap className="h-3 w-3 mr-1" />Hot</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="bg-card border-2 border-border rounded-lg divide-y divide-border">
                  {commentsLoading ? (
                    <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : comments.length === 0 ? (
                    <div className="p-8 text-center"><MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No comments yet.</p></div>
                  ) : (
                    <div className="divide-y divide-border">
                      {comments.map((comment) => (
                        <div key={comment.id} className="px-4">
                          <CommentThread comment={comment} onVote={voteComment} onReply={addComment} onReact={addTopicReaction} onReport={reportComment} onEdit={editComment} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <CreateCommunityPostDialog open={showCreatePost} onOpenChange={setShowCreatePost} />
      </div>
    </DashboardLayout>
  );
}
