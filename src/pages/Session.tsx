import { useState, useEffect, useRef } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Check, Heart, BookOpen, PenLine, Lightbulb, Loader2, Flame, Clock, Plus, Minus, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dailyPrompts } from '@/lib/sampleData';
import { Link, useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { useScripture, BibleTranslation, translationNames } from '@/hooks/useScripture';
import { Scripture } from '@/types/faith';
import { YouTubeWorshipPlayer } from '@/components/session/YouTubeWorshipPlayer';
import { toast } from 'sonner';
import { useSessions } from '@/hooks/useSessions';
import { useMilestoneChecker } from '@/hooks/useMilestoneChecker';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SessionPhase = 'worship' | 'scripture' | 'prayer' | 'reflection';

const phases: { id: SessionPhase; label: string; icon: React.ElementType; duration: number; emoji: string }[] = [
  { id: 'worship', label: 'Worship', icon: Music, duration: 15, emoji: '🎵' },
  { id: 'scripture', label: 'Scripture', icon: BookOpen, duration: 10, emoji: '📖' },
  { id: 'prayer', label: 'Prayer', icon: Heart, duration: 10, emoji: '🙏' },
  { id: 'reflection', label: 'Reflect', icon: PenLine, duration: 5, emoji: '✍️' },
];

export default function Session() {
  const navigate = useNavigate();
  const { todaySession, updateTodaySession, getOrCreateTodaySession, loading: sessionsLoading } = useSessions();
  const { checkAndAwardMilestones } = useMilestoneChecker();
  const { lightTap, successPattern, celebrationPattern } = useHapticFeedback();
  const [currentPhase, setCurrentPhase] = useState<SessionPhase>('worship');
  const [prayerText, setPrayerText] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const [worshipElapsed, setWorshipElapsed] = useState(0);
  const [worshipRating, setWorshipRating] = useState<'powerful' | 'peaceful' | 'struggled' | null>(null);
  const [saving, setSaving] = useState(false);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Initialize session on mount
  useEffect(() => {
    getOrCreateTodaySession();
  }, []);

  // Build completed phases from todaySession
  const completedPhases = new Set<SessionPhase>();
  if (todaySession?.worship_completed) completedPhases.add('worship');
  if (todaySession?.scripture_completed) completedPhases.add('scripture');
  if (todaySession?.prayer_completed) completedPhases.add('prayer');
  if (todaySession?.reflection_completed) completedPhases.add('reflection');

  const currentIndex = phases.findIndex(p => p.id === currentPhase);
  const phase = phases[currentIndex];
  const totalSessionTime = phases.reduce((acc, p) => acc + p.duration, 0);
  const completedTime = phases.slice(0, currentIndex).reduce((acc, p) => acc + p.duration, 0);
  const remainingTime = totalSessionTime - completedTime;

  // Swipe navigation
  const goToNextPhase = () => {
    if (currentIndex < phases.length - 1) {
      lightTap();
      setSwipeDirection('left');
      setTimeout(() => {
        setCurrentPhase(phases[currentIndex + 1].id);
        setSwipeDirection(null);
      }, 150);
    }
  };

  const goToPrevPhase = () => {
    if (currentIndex > 0) {
      lightTap();
      setSwipeDirection('right');
      setTimeout(() => {
        setCurrentPhase(phases[currentIndex - 1].id);
        setSwipeDirection(null);
      }, 150);
    }
  };

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: goToNextPhase,
    onSwipeRight: goToPrevPhase,
    threshold: 75,
  });

  const markComplete = async () => {
    setSaving(true);
    
    // Map phase to database field
    const updateField: Record<SessionPhase, string> = {
      worship: 'worship_completed',
      scripture: 'scripture_completed',
      prayer: 'prayer_completed',
      reflection: 'reflection_completed',
    };

    const updates: Record<string, boolean | number> = {
      [updateField[currentPhase]]: true,
    };

    // Add duration for this phase
    const currentDuration = todaySession?.duration_minutes || 0;
    updates.duration_minutes = currentDuration + phase.duration;

    // Track verses read when completing scripture phase (1 verse per scripture session)
    if (currentPhase === 'scripture') {
      const currentVerses = todaySession?.verses_read || 0;
      updates.verses_read = currentVerses + 1;
    }

    const result = await updateTodaySession(updates as any);
    setSaving(false);

    if (result.error) {
      toast.error('Failed to save progress');
      return;
    }

    // Trigger haptic feedback and animation
    setShowCompletionAnimation(true);
    
    if (currentIndex < phases.length - 1) {
      successPattern();
      setTimeout(() => {
        setShowCompletionAnimation(false);
        setCurrentPhase(phases[currentIndex + 1].id);
      }, 600);
      toast.success('Set complete! 💪 Keep pushing!');
    } else {
      celebrationPattern();
      toast.success('Training session complete! 🏆 You showed up today!');
      // Check and award any earned milestones
      setTimeout(async () => {
        setShowCompletionAnimation(false);
        await checkAndAwardMilestones();
        navigate('/');
      }, 1500);
    }
  };

  const goBack = () => {
    lightTap();
    if (currentIndex > 0) {
      setCurrentPhase(phases[currentIndex - 1].id);
    }
  };

  const allComplete = completedPhases.size === phases.length;

  return (
    <PageLayout>
      <div className="min-h-screen flex flex-col">
        {/* Header - Gritty Gym Style */}
        <div className="px-4 pt-6 pb-4 bg-gradient-to-b from-card to-background border-b-2 border-border">
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 font-display uppercase text-sm">
                <ChevronLeft className="h-4 w-4" />
                Exit
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-display text-primary">~{remainingTime} MIN LEFT</span>
            </div>
          </div>

          {/* Phase Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider">
              <span className="font-display">Set {currentIndex + 1} of {phases.length}</span>
              <span className="font-display text-primary">
                {completedPhases.size}/{phases.length} Complete
              </span>
            </div>
            <div className="progress-gym">
              <div 
                className="progress-gym-fill"
                style={{ width: `${(completedPhases.size / phases.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Phase Indicators */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {phases.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  lightTap();
                  setCurrentPhase(p.id);
                }}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                  p.id === currentPhase
                    ? "bg-primary/20 scale-110"
                    : completedPhases.has(p.id)
                    ? "opacity-60"
                    : "opacity-40 hover:opacity-60"
                )}
              >
                <span className="text-lg">{p.emoji}</span>
                {completedPhases.has(p.id) && (
                  <Check className="h-3 w-3 text-success" />
                )}
              </button>
            ))}
          </div>
          
          {/* Swipe hint */}
          <p className="text-center text-xs text-muted-foreground mt-3 opacity-60">
            ← Swipe to navigate →
          </p>
        </div>

        {/* Phase content - swipeable area */}
        <div 
          className="flex-1 px-4 pb-32 pt-4 touch-pan-y"
          {...swipeHandlers}
        >
          <div 
            className={cn(
              "gym-card p-5 transition-all duration-200 relative overflow-hidden",
              swipeDirection === 'left' && "translate-x-[-20px] opacity-80",
              swipeDirection === 'right' && "translate-x-[20px] opacity-80",
              showCompletionAnimation && "scale-[1.02]"
            )}
          >
            {/* Completion animation overlay */}
            {showCompletionAnimation && (
              <div className="absolute inset-0 bg-success/20 flex items-center justify-center z-10 animate-fade-in rounded-xl">
                <div className="w-20 h-20 rounded-full bg-success/30 flex items-center justify-center animate-scale-in">
                  <Check className="h-10 w-10 text-success" />
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-border">
              <div className={cn(
                "w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center glow-accent transition-transform",
                showCompletionAnimation && "scale-110"
              )}>
                <phase.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl text-foreground uppercase tracking-wide">{phase.label}</h1>
                <p className="text-sm text-muted-foreground">{phase.duration} min • Set {currentIndex + 1}</p>
              </div>
            </div>

            {currentPhase === 'worship' && (
              <WorshipContent 
                onTimeUpdate={setWorshipElapsed} 
                rating={worshipRating}
                onRating={setWorshipRating}
              />
            )}
            {currentPhase === 'scripture' && <ScriptureContent />}
            {currentPhase === 'prayer' && (
              <PrayerContent value={prayerText} onChange={setPrayerText} />
            )}
            {currentPhase === 'reflection' && (
              <ReflectionContent value={reflectionText} onChange={setReflectionText} />
            )}
          </div>
        </div>

        {/* Navigation - Heavy Gym Button */}
        <div className="fixed bottom-20 left-0 right-0 px-4">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            {currentIndex > 0 && (
              <Button 
                variant="outline" 
                size="lg" 
                onClick={goBack} 
                className="flex-1 border-2 border-border hover:border-primary font-display uppercase"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <Button 
              size="lg" 
              onClick={markComplete}
              disabled={saving || completedPhases.has(currentPhase)}
              className={cn(
                "flex-1 btn-gym text-lg",
                completedPhases.has(currentPhase) && "bg-success border-success/60"
              )}
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : completedPhases.has(currentPhase) ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Set Done
                </>
              ) : currentIndex === phases.length - 1 ? (
                <>
                  <Flame className="h-5 w-5 mr-2" />
                  Finish Training
                </>
              ) : (
                <>
                  Complete Set
                  <ChevronRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function WorshipContent({ 
  onTimeUpdate, 
  rating, 
  onRating 
}: { 
  onTimeUpdate: (time: number) => void;
  rating: 'powerful' | 'peaceful' | 'struggled' | null;
  onRating: (rating: 'powerful' | 'peaceful' | 'struggled') => void;
}) {
  const [extraTime, setExtraTime] = useState(0);

  const addTime = () => setExtraTime(prev => prev + 5);
  const subtractTime = () => setExtraTime(prev => Math.max(0, prev - 5));

  return (
    <div className="space-y-5">
      <p className="text-muted-foreground">
        Begin your training with worship. Let your heart be still and focused on God's presence.
      </p>

      {/* Embedded YouTube Player */}
      <YouTubeWorshipPlayer onTimeUpdate={onTimeUpdate} />

      {/* Time Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-lg bg-muted/30 border-2 border-border">
        <span className="text-sm text-muted-foreground font-medium">Feeling it? Add time:</span>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={subtractTime}
            disabled={extraTime === 0}
            className="h-10 w-10 border-border shrink-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-display text-xl w-24 text-center">
            {extraTime > 0 ? `+${extraTime}` : '0'} min
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={addTime}
            className="h-10 w-10 border-border shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Worship Rating */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground font-display uppercase tracking-wide">How was worship?</p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { id: 'powerful', emoji: '🔥', label: 'Powerful' },
            { id: 'peaceful', emoji: '😌', label: 'Peaceful' },
            { id: 'struggled', emoji: '😔', label: 'Struggled' },
          ].map(option => (
            <button
              key={option.id}
              onClick={() => onRating(option.id as 'powerful' | 'peaceful' | 'struggled')}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl border-2 transition-all bg-card shadow-sm",
                rating === option.id
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border hover:border-primary/50"
              )}
            >
              <span className="text-2xl sm:text-3xl">{option.emoji}</span>
              <span className="text-[10px] sm:text-xs font-display uppercase text-foreground font-semibold tracking-wide">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-primary/5 border-2 border-primary/20">
        <p className="text-sm text-muted-foreground">
          💡 <strong className="text-foreground">Tip:</strong> Close your eyes, take three deep breaths, and let the music draw your heart toward God.
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Read today's Scripture slowly. Let the words sink deep.
        </p>
        <Select value={translation} onValueChange={(v) => setTranslation(v as BibleTranslation)}>
          <SelectTrigger className="w-20 bg-muted border-border">
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
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="font-display text-sm text-muted-foreground uppercase">Loading ammo...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-lg bg-destructive/10 border-2 border-destructive/30 text-center">
          <p className="text-destructive font-display uppercase mb-3">Failed to load</p>
          <Button variant="outline" size="sm" onClick={loadScripture} className="border-destructive">
            Try Again
          </Button>
        </div>
      ) : scripture ? (
        <div className="p-5 rounded-lg bg-muted/30 border-2 border-border">
          <p className="font-display text-sm text-primary uppercase tracking-wide mb-3">{scripture.reference}</p>
          <blockquote className="text-xl leading-relaxed text-foreground font-bold">
            "{scripture.text}"
          </blockquote>
          <p className="text-xs text-muted-foreground uppercase mt-3">{scripture.translation}</p>
        </div>
      ) : null}

      <div className="space-y-2">
        <h3 className="font-display text-sm text-primary uppercase tracking-wide">Reflection Questions</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>What word or phrase stands out to you?</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>What is God revealing about Himself?</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>How does this apply to your training today?</span>
          </li>
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

  const tabConfig = {
    adoration: { emoji: '🙌', label: 'Adoration' },
    confession: { emoji: '💭', label: 'Confession' },
    thanksgiving: { emoji: '🙏', label: 'Thanks' },
    supplication: { emoji: '🎯', label: 'Requests' },
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Use the ACTS method to structure your conversation with God.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['adoration', 'confession', 'thanksgiving', 'supplication'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-display uppercase tracking-wide whitespace-nowrap transition-all border-2",
              activeTab === tab
                ? "bg-primary/20 border-primary text-primary"
                : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50"
            )}
          >
            <span>{tabConfig[tab].emoji}</span>
            <span>{tabConfig[tab].label}</span>
          </button>
        ))}
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={prompts[activeTab]}
        className="min-h-[180px] resize-none bg-muted/30 border-2 border-border focus:border-primary"
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

      <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary/30">
        <p className="text-xs text-primary font-display uppercase tracking-wide mb-1">Today's Prompt</p>
        <p className="font-bold text-foreground">{todayPrompt}</p>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your reflection here..."
        className="min-h-[180px] resize-none bg-muted/30 border-2 border-border focus:border-primary"
      />
    </div>
  );
}
