import { ArrowLeft, BookOpen, HandHeart, MessageCircleQuestion, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import type { GuidanceTopic } from '@/lib/scriptureGuidance';
import { cn } from '@/lib/utils';

interface TopicViewProps {
  topic: GuidanceTopic;
  onBack: () => void;
  onOpenCommunity: (intent: 'request_prayer' | 'share_reflection' | 'ask_guidance') => void;
}

export function TopicView({ topic, onBack, onOpenCommunity }: TopicViewProps) {
  return (
    <div className="space-y-8 pb-8">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors -mt-1"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">All topics</span>
      </button>

      {/* Topic header */}
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-card border-2 border-border flex items-center justify-center text-3xl">
            {topic.emoji}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              You're facing
            </p>
            <h1 className="font-display text-3xl text-foreground leading-tight">{topic.name}</h1>
          </div>
        </div>
        <p className="text-base text-foreground/90 leading-relaxed italic">{topic.intro}</p>
      </header>

      {/* Scriptures */}
      <section className="space-y-4">
        <SectionLabel icon={BookOpen} label="Scriptures for this" />
        <div className="space-y-3">
          {topic.scriptures.map((s) => (
            <div
              key={s.reference}
              className="rounded-2xl border border-border bg-card p-5 space-y-2"
            >
              <p className="text-base text-foreground leading-relaxed italic">"{s.text}"</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                {s.reference}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Context */}
      <section className="space-y-4">
        <SectionLabel label="Scripture in context" />
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <ContextBlock title="What's happening" body={topic.context.whatsHappening} />
          <ContextBlock title="Why it matters" body={topic.context.whyItMatters} />
          <ContextBlock title="What Jesus says about this" body={topic.context.whatItTeaches} />
        </div>
      </section>

      {/* Reflection */}
      <section className="space-y-4">
        <SectionLabel label="Reflect" />
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <ol className="space-y-3">
            {topic.reflection.map((q, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="font-display text-primary text-lg leading-none mt-0.5">
                  {idx + 1}.
                </span>
                <p className="text-base text-foreground leading-relaxed">{q}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Prayer */}
      <section className="space-y-4">
        <SectionLabel label="A guided prayer" />
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 space-y-3">
          <p className="text-base text-foreground leading-relaxed">{topic.prayer}</p>
        </div>
      </section>

      {/* Community CTA */}
      <section className="space-y-4">
        <SectionLabel label="Walk with the community" />
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <p className="text-base text-foreground leading-relaxed">
            Would you like prayer or support from the community? Share what you're carrying — others
            have walked this path too.
          </p>
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() => onOpenCommunity('request_prayer')}
              className="w-full justify-start h-12"
              variant="default"
            >
              <HandHeart className="h-4 w-4 mr-2" />
              Request prayer
            </Button>
            <Button
              onClick={() => onOpenCommunity('share_reflection')}
              className="w-full justify-start h-12"
              variant="outline"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share reflection
            </Button>
            <Button
              onClick={() => onOpenCommunity('ask_guidance')}
              className="w-full justify-start h-12"
              variant="outline"
            >
              <MessageCircleQuestion className="h-4 w-4 mr-2" />
              Ask for guidance
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Community members can pray 🙏🏽, encourage ❤️, and share Scripture 📖 with you.
          </p>
        </div>
      </section>

      {/* Suggested next step */}
      <section className="space-y-4">
        <SectionLabel label="A suggested next step" />
        <div className="grid grid-cols-1 gap-2">
          {topic.nextSteps.map((step, idx) => {
            if (step.to === 'community') {
              return (
                <Button
                  key={idx}
                  asChild
                  variant="outline"
                  className="w-full justify-between h-12"
                >
                  <Link to="/community">
                    <span>{step.label}</span>
                    <Heart className="h-4 w-4" />
                  </Link>
                </Button>
              );
            }
            return (
              <Button key={idx} asChild variant="outline" className="w-full justify-between h-12">
                <Link to={step.to}>
                  <span>{step.label}</span>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </Button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SectionLabel({
  icon: Icon,
  label,
  className,
}: {
  icon?: typeof BookOpen;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Icon && <Icon className="h-4 w-4 text-primary" />}
      <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">{label}</p>
    </div>
  );
}

function ContextBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
        {title}
      </p>
      <p className="text-base text-foreground leading-relaxed">{body}</p>
    </div>
  );
}
