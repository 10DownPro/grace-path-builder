import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { TopicGrid } from '@/components/scripture-guidance/TopicGrid';
import { TopicView } from '@/components/scripture-guidance/TopicView';
import { CreateCommunityPostDialog } from '@/components/community/CreateCommunityPostDialog';
import { guidanceTopics, getTopicById, type GuidanceTopic } from '@/lib/scriptureGuidance';

type CommunityIntent = 'request_prayer' | 'share_reflection' | 'ask_guidance';

const intentPresets: Record<CommunityIntent, { tab: 'text' | 'prayer'; lead: (topic: GuidanceTopic) => string }> = {
  request_prayer: {
    tab: 'prayer',
    lead: (topic) => `I'm struggling with ${topic.name.toLowerCase()} and would appreciate prayer.\n\n`,
  },
  share_reflection: {
    tab: 'text',
    lead: (topic) =>
      `Reflecting on Scripture about ${topic.name.toLowerCase()} today. Here's what God is showing me:\n\n`,
  },
  ask_guidance: {
    tab: 'text',
    lead: (topic) =>
      `Looking for guidance on ${topic.name.toLowerCase()}. If you've walked through this, I'd love your wisdom.\n\n`,
  },
};

export default function ScriptureGuidancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const topicId = searchParams.get('topic');
  const selectedTopic = useMemo(() => (topicId ? getTopicById(topicId) : undefined), [topicId]);

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerInitial, setComposerInitial] = useState<{
    text: string;
    tab: 'text' | 'prayer';
    tags: string[];
  }>({ text: '', tab: 'text', tags: [] });

  const handleSelectTopic = (id: string) => {
    setSearchParams({ topic: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSearchParams({});
  };

  const handleOpenCommunity = (intent: CommunityIntent) => {
    if (!selectedTopic) return;
    const preset = intentPresets[intent];
    setComposerInitial({
      text: preset.lead(selectedTopic),
      tab: preset.tab,
      tags: [selectedTopic.id.replace(/_/g, '')],
    });
    setComposerOpen(true);
  };

  return (
    <PageLayout>
      {selectedTopic ? (
        <TopicView
          topic={selectedTopic}
          onBack={handleBack}
          onOpenCommunity={handleOpenCommunity}
        />
      ) : (
        <TopicGrid topics={guidanceTopics} onSelect={handleSelectTopic} />
      )}

      <CreateCommunityPostDialog
        open={composerOpen}
        onOpenChange={setComposerOpen}
        initialText={composerInitial.text}
        initialTab={composerInitial.tab}
        initialTags={composerInitial.tags}
      />
    </PageLayout>
  );
}
