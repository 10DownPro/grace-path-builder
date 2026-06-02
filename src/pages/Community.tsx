import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { EnhancedFeedPost } from '@/components/community/EnhancedFeedPost';
import { CreateCommunityPostDialog } from '@/components/community/CreateCommunityPostDialog';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Plus, HandHeart, Users, Sparkles, MessageCircle, ChevronRight, Check } from 'lucide-react';
import { toast } from 'sonner';

type Section = 'walking' | 'prayer' | 'circles' | 'partners';

interface CircleOption {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

const CIRCLES: CircleOption[] = [
  { id: 'starting-faith', title: 'Starting Faith', emoji: '🌱', description: 'For people taking their first steps with God.' },
  { id: 'coming-back', title: 'Coming Back', emoji: '🏠', description: 'No catching up. No condemnation. Just home.' },
  { id: 'consistency', title: 'Consistency', emoji: '🌿', description: 'Small, sustainable rhythms with God.' },
  { id: 'healing', title: 'Healing', emoji: '🤍', description: 'Space for wounds, weariness, and weight.' },
  { id: 'prayer', title: 'Prayer', emoji: '🙏', description: 'Learning to talk and listen to God together.' },
];

export default function Community() {
  const {
    posts,
    loading,
    filter,
    setFilter,
    addReaction,
    prayForPost,
    votePoll,
    markPrayerAnswered,
    loadMore,
    hasMore,
  } = useCommunityPosts();

  const [section, setSection] = useState<Section>('walking');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleComment = async (_id: string, _t: string) => ({ error: null });

  const openPrayerComposer = () => setShowCreatePost(true);
  const openGeneralComposer = () => setShowCreatePost(true);

  // Switch feed filter when prayer tab is selected
  const visiblePosts = useMemo(() => posts, [posts]);
  const noPostsAtAll = !loading && posts.length === 0;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto pb-12">
        {/* Header */}
        <header className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-2">Community</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-3">
            You're not walking alone.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Share prayer requests, encourage others, and connect with people who are starting or restarting their walk with God.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button size="lg" onClick={openPrayerComposer} className="gap-2">
              <HandHeart className="h-5 w-5" /> Share a Prayer Request
            </Button>
            <Button size="lg" variant="outline" onClick={() => setSection('circles')} className="gap-2">
              <Users className="h-5 w-5" /> Join a Faith Circle
            </Button>
          </div>
        </header>

        {/* Section Tabs */}
        <Tabs value={section} onValueChange={(v) => setSection(v as Section)} className="mb-6">
          <TabsList className="grid grid-cols-4 w-full h-auto gap-1 p-1">
            <TabsTrigger value="walking" className="py-2 px-1 text-xs sm:text-sm whitespace-normal leading-tight">Walking<br className="sm:hidden" /> Together</TabsTrigger>
            <TabsTrigger value="prayer" className="py-2 px-1 text-xs sm:text-sm whitespace-normal leading-tight">Prayer<br className="sm:hidden" /> Requests</TabsTrigger>
            <TabsTrigger value="circles" className="py-2 px-1 text-xs sm:text-sm whitespace-normal leading-tight">Faith<br className="sm:hidden" /> Circles</TabsTrigger>
            <TabsTrigger value="partners" className="py-2 px-1 text-xs sm:text-sm whitespace-normal leading-tight">Prayer<br className="sm:hidden" /> Partners</TabsTrigger>
          </TabsList>

          {/* Walking Together */}
          <TabsContent value="walking" className="mt-6 space-y-4">
            <SectionHeader
              icon={<Sparkles className="h-5 w-5 text-primary" />}
              title="Walking Together"
              subtitle="Recent encouragement, prayers, and reflections from the community."
              action={
                <Button size="sm" onClick={openGeneralComposer} className="gap-1.5">
                  <Plus className="h-4 w-4" /> Share
                </Button>
              }
            />
            <FeedList
              loading={loading}
              empty={noPostsAtAll}
              posts={visiblePosts}
              filter={filter}
              setFilter={(t) => setFilter({ ...filter, type: t as any })}
              addReaction={addReaction}
              prayForPost={prayForPost}
              votePoll={votePoll}
              markPrayerAnswered={markPrayerAnswered}
              loadMore={loadMore}
              hasMore={hasMore}
              handleComment={handleComment}
              emptyCta={
                <EmptyState
                  title="No posts yet."
                  body="Be the first to share an encouragement, reflection, or prayer with the community."
                  primary={{ label: 'Share a Prayer Request', onClick: openPrayerComposer }}
                  secondary={{ label: 'Post an Encouragement', onClick: openGeneralComposer }}
                />
              }
              presetFilter="all"
            />
          </TabsContent>

          {/* Prayer Requests */}
          <TabsContent value="prayer" className="mt-6 space-y-4">
            <SectionHeader
              icon={<HandHeart className="h-5 w-5 text-primary" />}
              title="Prayer Requests"
              subtitle="View what others are walking through. Pray for someone today."
              action={
                <Button size="sm" onClick={openPrayerComposer} className="gap-1.5">
                  <Plus className="h-4 w-4" /> Share Request
                </Button>
              }
            />
            <FeedList
              loading={loading}
              empty={noPostsAtAll}
              posts={visiblePosts.filter((p) => p.post_type === 'prayer_request' || (p as any).content_data?.is_prayer_request)}
              filter={filter}
              setFilter={() => {}}
              addReaction={addReaction}
              prayForPost={prayForPost}
              votePoll={votePoll}
              markPrayerAnswered={markPrayerAnswered}
              loadMore={loadMore}
              hasMore={hasMore}
              handleComment={handleComment}
              emptyCta={
                <EmptyState
                  title="No prayer requests yet."
                  body="When someone shares a request, you'll be able to lift them up in prayer right here."
                  primary={{ label: 'Share a Prayer Request', onClick: openPrayerComposer }}
                />
              }
              presetFilter="prayer_requests"
            />
          </TabsContent>

          {/* Faith Circles */}
          <TabsContent value="circles" className="mt-6 space-y-4">
            <SectionHeader
              icon={<Users className="h-5 w-5 text-primary" />}
              title="Faith Circles"
              subtitle="Small, themed groups where you can walk with others on the same path."
            />
            <div className="grid gap-3">
              {CIRCLES.map((c) => (
                <button
                  key={c.id}
                  onClick={openGeneralComposer}
                  className="w-full p-5 rounded-2xl border border-border bg-card text-left flex items-center gap-4 hover:border-primary/40 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                    {c.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl text-foreground leading-tight">{c.title}</h3>
                    <p className="text-base text-muted-foreground mt-0.5">{c.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </TabsContent>

          {/* Prayer Partners */}
          <TabsContent value="partners" className="mt-6">
            <SectionHeader
              icon={<MessageCircle className="h-5 w-5 text-primary" />}
              title="Prayer Partners"
              subtitle="One-on-one encouragement. Optional — opt in when you're ready."
            />
            <div className="rounded-2xl border border-border bg-card p-6 mt-4">
              <h3 className="font-display text-2xl text-foreground mb-2">Walk with someone, one-on-one.</h3>
              <p className="text-base text-muted-foreground mb-5">
                Get paired with one other person who's also walking with God. Check in weekly. Pray for each other.
                No pressure, no performance — just a quiet partnership.
              </p>
              <Button size="lg" className="w-full sm:w-auto">
                Opt in to Prayer Partners
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Pairing will open soon. We'll let you know when your partner is ready.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <CreateCommunityPostDialog
          open={showCreatePost}
          onOpenChange={setShowCreatePost}
        />
      </div>
    </DashboardLayout>
  );
}

function SectionHeader({
  icon, title, subtitle, action,
}: { icon: React.ReactNode; title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          {icon}
          <h2 className="font-display text-2xl text-foreground">{title}</h2>
        </div>
        <p className="text-base text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function EmptyState({
  title, body, primary, secondary,
}: {
  title: string;
  body: string;
  primary: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <h3 className="font-display text-2xl text-foreground mb-2">{title}</h3>
      <p className="text-base text-muted-foreground max-w-md mx-auto mb-6">{body}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" onClick={primary.onClick}>{primary.label}</Button>
        {secondary && (
          <Button size="lg" variant="outline" onClick={secondary.onClick}>{secondary.label}</Button>
        )}
      </div>
    </div>
  );
}

function FeedList({
  loading, empty, posts, addReaction, prayForPost, votePoll, markPrayerAnswered, loadMore, hasMore, handleComment, emptyCta,
}: any) {
  if (loading && posts.length === 0) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (empty || posts.length === 0) return emptyCta;
  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
        <EnhancedFeedPost
          key={post.id}
          post={post}
          onReaction={addReaction}
          onPray={prayForPost}
          onVotePoll={votePoll}
          onComment={handleComment}
          onMarkAnswered={markPrayerAnswered}
        />
      ))}
      {hasMore && (
        <Button variant="outline" className="w-full" onClick={loadMore} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load more'}
        </Button>
      )}
    </div>
  );
}
