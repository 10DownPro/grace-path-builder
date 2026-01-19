import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Check, Heart, BookOpen, PenLine, Lightbulb, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { worshipResources, dailyPrompts } from '@/lib/sampleData';
import { Link } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { useScripture, BibleTranslation, translationNames } from '@/hooks/useScripture';
import { Scripture } from '@/types/faith';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SessionPhase = 'worship' | 'scripture' | 'prayer' | 'reflection';

const phases: { id: SessionPhase; label: string; icon: React.ElementType; duration: string }[] = [
  { id: 'worship', label: 'Worship', icon: Heart, duration: '5 min' },
  { id: 'scripture', label: 'Scripture', icon: BookOpen, duration: '10 min' },
  { id: 'prayer', label: 'Prayer', icon: PenLine, duration: '10 min' },
  { id: 'reflection', label: 'Reflection', icon: Lightbulb, duration: '5 min' },
];

export default function Session() {
  const [currentPhase, setCurrentPhase] = useState<SessionPhase>('worship');
  const [completedPhases, setCompletedPhases] = useState<Set<SessionPhase>>(new Set());
  const [prayerText, setPrayerText] = useState('');
  const [reflectionText, setReflectionText] = useState('');

  const currentIndex = phases.findIndex(p => p.id === currentPhase);
  const phase = phases[currentIndex];

  const markComplete = () => {
    setCompletedPhases(prev => new Set([...prev, currentPhase]));
    if (currentIndex < phases.length - 1) {
      setCurrentPhase(phases[currentIndex + 1].id);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentPhase(phases[currentIndex - 1].id);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {phases.length}
            </span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {phases.map((p) => (
              <button
                key={p.id}
                onClick={() => setCurrentPhase(p.id)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200",
                  p.id === currentPhase
                    ? "bg-primary w-8"
                    : completedPhases.has(p.id)
                    ? "bg-sage"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Phase content */}
        <div className="flex-1 px-4 pb-32">
          <div className="spiritual-card p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-golden flex items-center justify-center">
                <phase.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{phase.label}</h1>
                <p className="text-sm text-muted-foreground">{phase.duration}</p>
              </div>
            </div>

            {currentPhase === 'worship' && <WorshipContent />}
            {currentPhase === 'scripture' && <ScriptureContent />}
            {currentPhase === 'prayer' && (
              <PrayerContent value={prayerText} onChange={setPrayerText} />
            )}
            {currentPhase === 'reflection' && (
              <ReflectionContent value={reflectionText} onChange={setReflectionText} />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="fixed bottom-20 left-0 right-0 px-4">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            {currentIndex > 0 && (
              <Button variant="outline" size="lg" onClick={goBack} className="flex-1">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            <Button 
              variant="golden" 
              size="lg" 
              onClick={markComplete}
              className="flex-1"
            >
              {completedPhases.has(currentPhase) ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Completed
                </>
              ) : currentIndex === phases.length - 1 ? (
                'Finish Session'
              ) : (
                <>
                  Complete & Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function WorshipContent() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Begin your session with worship. Let your heart be still and focused on God's presence.
      </p>

      <div className="space-y-3">
        <h3 className="font-medium text-foreground">Suggested Songs</h3>
        {worshipResources.slice(0, 3).map(song => (
          <a
            key={song.id}
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Play className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{song.title}</p>
              <p className="text-sm text-muted-foreground">{song.artist}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Close your eyes, take three deep breaths, and let the music draw your heart toward God.
        </p>
      </div>
    </div>
  );
}

function ScriptureContent() {
  const [translation, setTranslation] = useState<BibleTranslation>('kjv');
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const { fetchDailyVerse, loading, error } = useScripture();

  useEffect(() => {
    loadScripture();
  }, [translation]);

  const loadScripture = async () => {
    const verse = await fetchDailyVerse(translation);
    if (verse) {
      setScripture(verse);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Read today's Scripture slowly and let the words sink deep into your heart.
        </p>
        <Select value={translation} onValueChange={(v) => setTranslation(v as BibleTranslation)}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(translationNames) as BibleTranslation[]).map((t) => (
              <SelectItem key={t} value={t}>
                {t.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
          <p className="text-destructive mb-3">Failed to load scripture</p>
          <Button variant="outline" size="sm" onClick={loadScripture}>
            Try Again
          </Button>
        </div>
      ) : scripture ? (
        <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
          <p className="text-sm font-medium text-primary mb-3">{scripture.reference}</p>
          <blockquote className="font-scripture text-xl leading-relaxed text-foreground italic">
            "{scripture.text}"
          </blockquote>
          <p className="text-sm text-muted-foreground mt-3">{scripture.translation}</p>
        </div>
      ) : null}

      <div className="space-y-2">
        <h3 className="font-medium text-foreground">Reflection Questions</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• What word or phrase stands out to you?</li>
          <li>• What is God revealing about Himself?</li>
          <li>• How does this apply to your life today?</li>
        </ul>
      </div>
    </div>
  );
}

function PrayerContent({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState<'adoration' | 'confession' | 'thanksgiving' | 'supplication'>('adoration');

  const prompts = {
    adoration: "Praise God for who He is - His character, attributes, and nature...",
    confession: "Confess any sins or shortcomings, asking for forgiveness...",
    thanksgiving: "Thank God for His blessings, provision, and faithfulness...",
    supplication: "Bring your requests, needs, and intercessions before God..."
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Use the ACTS prayer method to guide your conversation with God.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['adoration', 'confession', 'thanksgiving', 'supplication'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={prompts[activeTab]}
        className="min-h-[200px] resize-none bg-muted/30 border-border/50"
      />
    </div>
  );
}

function ReflectionContent({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const todayPrompt = dailyPrompts[new Date().getDay() % dailyPrompts.length];

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Take a moment to reflect on what God is teaching you today.
      </p>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground mb-1">Today's Prompt</p>
        <p className="font-medium text-foreground">{todayPrompt}</p>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your reflection here..."
        className="min-h-[200px] resize-none bg-muted/30 border-border/50"
      />
    </div>
  );
}
