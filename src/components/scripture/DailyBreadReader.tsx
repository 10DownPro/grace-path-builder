import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Heart, HandHeart, Sparkles, ArrowRight, Clock, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  rhythms,
  type DailyBreadReading,
  type ReadingRhythm,
} from '@/lib/dailyBread';

interface Props {
  reading: DailyBreadReading;
  /** Optional default rhythm. */
  initialRhythm?: ReadingRhythm;
}

export function DailyBreadReader({ reading, initialRhythm = 'daily' }: Props) {
  const [rhythm, setRhythm] = useState<ReadingRhythm>(initialRhythm);

  // Each rhythm shows progressively more sections — same data, different depth.
  const show = useMemo(
    () => ({
      passage: true,
      quickTakeaway: rhythm === 'quick',
      whatsHappening: rhythm !== 'quick',
      aboutGod: rhythm !== 'quick',
      aboutJesus: true,
      reflection: rhythm !== 'quick',
      prayer: true,
      actionStep: rhythm !== 'quick',
      background: rhythm === 'deep',
      characters: rhythm === 'deep',
    }),
    [rhythm],
  );

  return (
    <section className="space-y-6">
      {/* Theme header */}
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
          Daily Bread · {reading.passageTitle}
        </p>
        <h2 className="font-display text-3xl text-foreground leading-tight">
          {reading.theme}
        </h2>
        <p className="text-base text-foreground/80 italic">{reading.oneLine}</p>
      </header>

      {/* Rhythm selector */}
      <div className="grid grid-cols-3 gap-2">
        {rhythms.map((r) => {
          const active = rhythm === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setRhythm(r.id)}
              className={cn(
                'rounded-xl border-2 p-3 text-left transition-colors',
                active
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/40',
              )}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className={cn('h-3.5 w-3.5', active ? 'text-primary' : 'text-muted-foreground')} />
                <span className={cn('text-xs uppercase tracking-wide font-semibold', active ? 'text-primary' : 'text-muted-foreground')}>
                  {r.minutes}
                </span>
              </div>
              <p className="font-display text-base text-foreground leading-tight">{r.label}</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{r.blurb}</p>
            </button>
          );
        })}
      </div>

      {/* Passage reading */}
      {show.passage && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <SectionLabel icon={BookOpen} label="Scripture reading" />
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {reading.passageRef} · KJV
          </p>
          <div className="space-y-2 pt-1">
            {reading.verses.map((v) => (
              <p key={v.v} className="text-base text-foreground leading-relaxed">
                <sup className="text-primary font-semibold mr-1">{v.v}</sup>
                {v.text}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Quick takeaway (Quick Bread only) */}
      {show.quickTakeaway && (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5">
          <SectionLabel label="Today's takeaway" />
          <p className="text-base text-foreground leading-relaxed mt-2">
            {reading.quickTakeaway}
          </p>
        </div>
      )}

      {/* Deep Dive — Background */}
      {show.background && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <SectionLabel label="Understanding the Bible" />
          <BgRow label="Who wrote this" body={reading.background.author} />
          <BgRow label="When" body={reading.background.when} />
          <BgRow label="Original audience" body={reading.background.audience} />
          <BgRow label="Why it was written" body={reading.background.whyWritten} />
        </div>
      )}

      {/* Deep Dive — characters */}
      {show.characters && reading.characters.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <SectionLabel icon={Users} label="People in this passage" />
          <p className="text-base text-foreground leading-relaxed">
            {reading.characters.join(' · ')}
          </p>
        </div>
      )}

      {/* What's happening */}
      {show.whatsHappening && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <SectionLabel label="What's happening" />
          <p className="text-base text-foreground leading-relaxed">{reading.whatsHappening}</p>
        </div>
      )}

      {/* About God */}
      {show.aboutGod && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <SectionLabel label="What this teaches about God" />
          <p className="text-base text-foreground leading-relaxed">{reading.aboutGod}</p>
        </div>
      )}

      {/* About Jesus */}
      {show.aboutJesus && (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 space-y-2">
          <SectionLabel icon={Sparkles} label="What this teaches about Jesus" />
          <p className="text-base text-foreground leading-relaxed">{reading.aboutJesus}</p>
        </div>
      )}

      {/* Reflection */}
      {show.reflection && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <SectionLabel icon={Heart} label="Reflect" />
          <ol className="space-y-3">
            {reading.reflection.map((q, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="font-display text-primary text-lg leading-none mt-0.5">
                  {idx + 1}.
                </span>
                <p className="text-base text-foreground leading-relaxed">{q}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Prayer */}
      {show.prayer && (
        <div className="rounded-2xl border-2 border-secondary/40 bg-secondary/5 p-5 space-y-2">
          <SectionLabel icon={HandHeart} label="Pray" />
          <p className="text-base text-foreground leading-relaxed">{reading.prayer}</p>
        </div>
      )}

      {/* Action step */}
      {show.actionStep && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <SectionLabel icon={ArrowRight} label="One step today" />
          <p className="text-base text-foreground leading-relaxed">{reading.actionStep}</p>
        </div>
      )}

      {/* Next steps */}
      <div className="grid grid-cols-1 gap-2 pt-2">
        <Button asChild variant="outline" className="w-full justify-between h-12">
          <Link to="/scripture-for">
            <span>Find Scripture for what you're facing</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-between h-12">
          <Link to="/tracks">
            <span>Continue your Journey</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function SectionLabel({
  icon: Icon,
  label,
}: {
  icon?: typeof BookOpen;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4 text-primary" />}
      <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">{label}</p>
    </div>
  );
}

function BgRow({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-0.5">
        {label}
      </p>
      <p className="text-base text-foreground leading-relaxed">{body}</p>
    </div>
  );
}
