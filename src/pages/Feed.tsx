import { useEffect, useRef, useCallback } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useCommunityFeed } from '@/hooks/useCommunityFeed';
import { FeedPost } from '@/components/feed/FeedPost';
import { LiveActivityTicker } from '@/components/squad/LiveActivityTicker';
import { WhosTrainingNow } from '@/components/squad/WhosTrainingNow';
import { RefreshCw, Rss, Users, Globe } from 'lucide-react';

export default function Feed() {
  const {
    posts,
    loading,
    hasMore,
    filter,
    setFilter,
    loadMore,
    addReaction,
    addComment,
    getComments,
    refetch,
  } = useCommunityFeed();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Rss className="h-6 w-6 text-primary" />
              Community Feed
            </h1>
            <p className="text-muted-foreground text-sm">
              See what your training squad is up to
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={refetch}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Live Activity Ticker */}
        <LiveActivityTicker />

        {/* Who's Training Now */}
        <WhosTrainingNow />

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'squad' | 'friends')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="gap-1">
              <Globe className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="squad" className="gap-1">
              <Users className="h-4 w-4" />
              Squad
            </TabsTrigger>
            <TabsTrigger value="friends" className="gap-1">
              <Users className="h-4 w-4" />
              Friends
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Posts */}
        <div className="space-y-4">
          {posts.length === 0 && !loading ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Rss className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-1">No Posts Yet</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Complete training sessions, earn milestones, and share your journey to see posts here!
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <FeedPost
                key={post.id}
                post={post}
                onReaction={addReaction}
                onComment={addComment}
                onGetComments={getComments}
              />
            ))
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="h-4" />

          {!hasMore && posts.length > 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              You've reached the end! 🎉
            </p>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
