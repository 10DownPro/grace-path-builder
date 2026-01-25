import { useState, useEffect, useRef, useCallback } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useCommunityFeed } from '@/hooks/useCommunityFeed';
import { useTestimonies } from '@/hooks/useTestimonies';
import { FeedPost } from '@/components/feed/FeedPost';
import { CreatePostDialog } from '@/components/feed/CreatePostDialog';
import { CreateTestimonyDialog } from '@/components/testimony/CreateTestimonyDialog';
import { TestimonyCard } from '@/components/testimony/TestimonyCard';
import { LiveActivityTicker } from '@/components/squad/LiveActivityTicker';
import { WhosTrainingNow } from '@/components/squad/WhosTrainingNow';
import { RefreshCw, Rss, Users, Globe, Plus, UserCheck, BookOpen } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

type FeedFilter = 'all' | 'squad' | 'friends' | 'following' | 'testimonies';

export default function Feed() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'testimonies' ? 'testimonies' : 'all';
  
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [createTestimonyOpen, setCreateTestimonyOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FeedFilter>(initialTab);
  
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

  const {
    testimonies,
    loading: testimoniesLoading,
    addReaction: addTestimonyReaction,
    addComment: addTestimonyComment,
    getComments: getTestimonyComments,
    shareTestimony,
    refetch: refetchTestimonies
  } = useTestimonies();

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

  const handleFilterChange = (newFilter: string) => {
    setActiveFilter(newFilter as FeedFilter);
    if (newFilter !== 'testimonies') {
      setFilter(newFilter as 'all' | 'squad' | 'friends' | 'following');
    }
  };

  const handleRefresh = () => {
    if (activeFilter === 'testimonies') {
      refetchTestimonies();
    } else {
      refetch();
    }
  };

  const handleFabClick = () => {
    if (activeFilter === 'testimonies') {
      setCreateTestimonyOpen(true);
    } else {
      setCreatePostOpen(true);
    }
  };

  const isLoading = activeFilter === 'testimonies' ? testimoniesLoading : loading;

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
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Live Activity Ticker */}
        <LiveActivityTicker />

        {/* Who's Training Now */}
        <WhosTrainingNow />

        {/* Filter Tabs */}
        <Tabs value={activeFilter} onValueChange={handleFilterChange}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="gap-1 text-xs px-1">
              <Globe className="h-3 w-3" />
              All
            </TabsTrigger>
            <TabsTrigger value="squad" className="gap-1 text-xs px-1">
              <Users className="h-3 w-3" />
              Squad
            </TabsTrigger>
            <TabsTrigger value="friends" className="gap-1 text-xs px-1">
              <Users className="h-3 w-3" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="following" className="gap-1 text-xs px-1">
              <UserCheck className="h-3 w-3" />
              Following
            </TabsTrigger>
            <TabsTrigger value="testimonies" className="gap-1 text-xs px-1">
              <BookOpen className="h-3 w-3" />
              Stories
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Posts or Testimonies */}
        <div className="space-y-4">
          {activeFilter === 'testimonies' ? (
            // Testimonies View
            <>
              {testimonies.length === 0 && !testimoniesLoading ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="font-semibold text-lg mb-1">No Testimonies Yet</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Share how God is working in your life!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                testimonies.map((testimony) => (
                  <TestimonyCard
                    key={testimony.id}
                    testimony={testimony}
                    onReact={addTestimonyReaction}
                    onComment={addTestimonyComment}
                    onGetComments={getTestimonyComments}
                    onShare={shareTestimony}
                  />
                ))
              )}
            </>
          ) : (
            // Regular Posts View
            <>
              {posts.length === 0 && !loading ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    {activeFilter === 'following' ? (
                      <>
                        <UserCheck className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="font-semibold text-lg mb-1">No Posts From Followed Users</h3>
                        <p className="text-muted-foreground text-sm max-w-xs">
                          Follow training partners to see their posts here!
                        </p>
                      </>
                    ) : (
                      <>
                        <Rss className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="font-semibold text-lg mb-1">No Posts Yet</h3>
                        <p className="text-muted-foreground text-sm max-w-xs">
                          Complete training sessions, earn milestones, and share your journey!
                        </p>
                      </>
                    )}
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
            </>
          )}

          {/* Loading skeletons */}
          {isLoading && (
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
          {activeFilter !== 'testimonies' && (
            <>
              <div ref={loadMoreRef} className="h-4" />
              {!hasMore && posts.length > 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  You've reached the end! 🎉
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        size="lg"
        className={`fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full shadow-lg ${
          activeFilter === 'testimonies' 
            ? 'bg-success hover:bg-success/90' 
            : 'bg-primary hover:bg-primary/90'
        }`}
        onClick={handleFabClick}
      >
        {activeFilter === 'testimonies' ? (
          <BookOpen className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </Button>

      {/* Create Post Dialog */}
      <CreatePostDialog 
        open={createPostOpen} 
        onOpenChange={setCreatePostOpen} 
      />

      {/* Create Testimony Dialog */}
      <CreateTestimonyDialog
        open={createTestimonyOpen}
        onOpenChange={setCreateTestimonyOpen}
      />
    </PageLayout>
  );
}
