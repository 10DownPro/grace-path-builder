import { useState, useEffect } from 'react';
import { Shield, Flame, ChevronRight, X, Play, Pause, Volume2, VolumeX, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useVerseImage } from '@/hooks/useVerseImage';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Fallback battle mode verses - powerful, encouraging verses for tough times
const fallbackBattleVerses = [
  {
    reference: "Isaiah 41:10",
    text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness."
  },
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ which strengtheneth me."
  },
  {
    reference: "Romans 8:31",
    text: "What shall we then say to these things? If God be for us, who can be against us?"
  },
  {
    reference: "Psalm 46:1",
    text: "God is our refuge and strength, a very present help in trouble."
  },
  {
    reference: "2 Timothy 1:7",
    text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind."
  },
];

// Simple battle worship video
const battleWorshipVideo = {
  videoId: 'Fo4RlXs-mGI',
  title: 'Goodness of God',
  artist: 'Bethel Music'
};

interface BattleVerse {
  reference: string;
  text: string;
}

interface BattleModeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type BattlePhase = 'verse' | 'worship' | 'prayer' | 'complete';

export function BattleMode({ isOpen, onClose, onComplete }: BattleModeProps) {
  const { user } = useAuth();
  const [phase, setPhase] = useState<BattlePhase>('verse');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [battleVerses, setBattleVerses] = useState<BattleVerse[]>(fallbackBattleVerses);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { getFallbackGradient } = useVerseImage();

  // Fetch user's saved verses for battle mode
  useEffect(() => {
    if (isOpen && user) {
      fetchSavedVerses();
    }
  }, [isOpen, user]);

  const fetchSavedVerses = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Get user's saved verses with the verse text
      const { data: savedVerses, error } = await supabase
        .from('user_saved_verses')
        .select(`
          id,
          verse_id,
          feeling_verses (
            reference,
            text_kjv
          )
        `)
        .eq('user_id', user.id)
        .limit(10);

      if (error) {
        console.error('Error fetching saved verses:', error);
        setLoading(false);
        return;
      }

      if (savedVerses && savedVerses.length > 0) {
        const formattedVerses: BattleVerse[] = savedVerses
          .filter(sv => sv.feeling_verses)
          .map(sv => ({
            reference: (sv.feeling_verses as any)?.reference || 'Unknown',
            text: (sv.feeling_verses as any)?.text_kjv || ''
          }))
          .filter(v => v.text);

        if (formattedVerses.length > 0) {
          setBattleVerses(formattedVerses);
        }
      }
    } catch (err) {
      console.error('Error fetching battle verses:', err);
    }
    setLoading(false);
  };

  // Get today's battle verse - rotate through saved verses
  const todayVerse = battleVerses[currentVerseIndex % battleVerses.length];

  const handleNextVerse = () => {
    setCurrentVerseIndex(prev => (prev + 1) % battleVerses.length);
  };

  const handleNextPhase = () => {
    switch (phase) {
      case 'verse':
        setPhase('worship');
        setIsPlaying(true);
        break;
      case 'worship':
        setPhase('prayer');
        setIsPlaying(false);
        break;
      case 'prayer':
        setPhase('complete');
        break;
      case 'complete':
        onComplete();
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      {/* Content */}
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/50 mb-2">
            <Shield className="h-5 w-5 text-destructive" />
            <span className="font-display text-sm text-destructive uppercase tracking-wider">Battle Mode</span>
          </div>
          <p className="text-white/60 text-sm">
            {phase === 'verse' && 'Anchor yourself in God\'s Word'}
            {phase === 'worship' && 'Let worship lift your spirit'}
            {phase === 'prayer' && 'Bring it all to Him'}
            {phase === 'complete' && 'You showed up. That\'s warrior strength.'}
          </p>
        </div>

        {/* Phase Content */}
        <div className="flex-1 px-4 overflow-y-auto">
          {phase === 'verse' && (
            <div 
              className="h-full flex flex-col items-center justify-center p-6 rounded-xl"
              style={{ background: getFallbackGradient('warfare') }}
            >
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-white/60">Loading your battle verses...</p>
                </div>
              ) : (
                <>
                  <div className="relative max-w-md text-center">
                    <span className="absolute -left-4 -top-6 text-8xl text-primary/30 font-display select-none">"</span>
                    <p className="text-2xl font-bold text-white leading-relaxed drop-shadow-lg">
                      {todayVerse.text}
                    </p>
                    <span className="absolute -right-4 bottom-0 text-8xl text-primary/30 font-display rotate-180 select-none">"</span>
                  </div>
                  <p className="font-display text-xl text-primary uppercase tracking-widest mt-6 drop-shadow-md">
                    — {todayVerse.reference}
                  </p>
                  
                  {/* Verse navigation */}
                  {battleVerses.length > 1 && (
                    <div className="mt-6 flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNextVerse}
                        className="text-white/60 hover:text-white hover:bg-white/10"
                      >
                        Next Verse ({currentVerseIndex + 1}/{battleVerses.length})
                      </Button>
                    </div>
                  )}
                  
                  {battleVerses === fallbackBattleVerses && (
                    <p className="text-white/40 text-xs mt-4 text-center">
                      Save verses from Battles to use your personal arsenal here
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {phase === 'worship' && (
            <div className="space-y-6">
              <div className="aspect-video rounded-xl overflow-hidden bg-black border-2 border-primary/30 relative">
                <iframe
                  src={`https://www.youtube.com/embed/${battleWorshipVideo.videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&rel=0`}
                  title={battleWorshipVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="text-center">
                <p className="font-display text-xl text-white uppercase tracking-wide">{battleWorshipVideo.title}</p>
                <p className="text-white/60">{battleWorshipVideo.artist}</p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/80"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8 text-background" />
                  ) : (
                    <Play className="h-8 w-8 text-background ml-1" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-white/10 hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="h-6 w-6 text-white" />
                  ) : (
                    <Volume2 className="h-6 w-6 text-white" />
                  )}
                </Button>
              </div>

              <p className="text-center text-white/40 text-sm">
                5 minutes of focused worship. Let it lift your spirit.
              </p>
            </div>
          )}

          {phase === 'prayer' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30">
                <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-display text-xl text-white uppercase tracking-wide text-center mb-4">
                  Guided Prayer
                </h3>
                <div className="space-y-4 text-white/80">
                  <p className="text-center italic">
                    "Lord, I come to you in my weakness..."
                  </p>
                  <p className="text-center italic">
                    "I surrender my fears, my doubts, my struggles..."
                  </p>
                  <p className="text-center italic">
                    "Fill me with your strength and peace..."
                  </p>
                  <p className="text-center italic">
                    "Help me remember that you are with me always."
                  </p>
                </div>
              </div>

              <p className="text-center text-white/40 text-sm">
                Take 3 minutes to pray. Speak aloud or in your heart.
              </p>
            </div>
          )}

          {phase === 'complete' && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-warning flex items-center justify-center mb-6 glow-accent animate-pulse-glow">
                <Shield className="h-12 w-12 text-background" />
              </div>
              <h2 className="font-display text-3xl text-white uppercase tracking-wide mb-2">
                Battle Mode Complete
              </h2>
              <p className="text-white/60 max-w-xs mb-6">
                You showed up when it was hard. That's warrior strength. This still counts for your streak.
              </p>
              <div className="flex items-center gap-2 text-primary">
                <Flame className="h-5 w-5" />
                <span className="font-display uppercase tracking-wide">Victory Earned</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6">
          <Button
            onClick={handleNextPhase}
            className="w-full btn-gym text-lg py-6"
          >
            {phase === 'verse' && (
              <>
                Start Worship
                <ChevronRight className="h-5 w-5 ml-2" />
              </>
            )}
            {phase === 'worship' && (
              <>
                Continue to Prayer
                <ChevronRight className="h-5 w-5 ml-2" />
              </>
            )}
            {phase === 'prayer' && (
              <>
                Finish Battle Mode
                <ChevronRight className="h-5 w-5 ml-2" />
              </>
            )}
            {phase === 'complete' && 'Return Home'}
          </Button>
        </div>
      </div>
    </div>
  );
}
