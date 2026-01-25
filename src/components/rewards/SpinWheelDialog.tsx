import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMysteryRewards, MysteryReward } from '@/hooks/useMysteryRewards';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, Star } from 'lucide-react';

interface SpinWheelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const WHEEL_SEGMENTS = 8;
const SEGMENT_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--muted))',
  'hsl(28 100% 50%)',
  'hsl(var(--muted))',
  'hsl(var(--success))',
  'hsl(var(--muted))',
  'hsl(45 100% 50%)',
  'hsl(var(--muted))',
];

const RARITY_COLORS: Record<string, string> = {
  common: 'text-muted-foreground',
  uncommon: 'text-green-500',
  rare: 'text-blue-500',
  epic: 'text-purple-500',
  legendary: 'text-yellow-500',
};

const RARITY_GLOW: Record<string, string> = {
  common: '',
  uncommon: 'shadow-green-500/30',
  rare: 'shadow-blue-500/50',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-yellow-500/70 animate-pulse',
};

export function SpinWheelDialog({ open, onOpenChange, onComplete }: SpinWheelDialogProps) {
  const { rewards, spinWheel, claimReward, isSpinning, lastWonReward, canSpinToday } = useMysteryRewards();
  const [rotation, setRotation] = useState(0);
  const [phase, setPhase] = useState<'ready' | 'spinning' | 'result'>('ready');
  const [wonReward, setWonReward] = useState<MysteryReward | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get 8 sample rewards for wheel display
  const wheelRewards = rewards.slice(0, WHEEL_SEGMENTS);
  while (wheelRewards.length < WHEEL_SEGMENTS) {
    wheelRewards.push({
      id: `placeholder-${wheelRewards.length}`,
      reward_type: 'points',
      reward_name: '???',
      reward_value: 0,
      rarity: 'common',
      drop_rate_percentage: 0,
      icon_emoji: '🎁',
      description: null,
    });
  }

  // Draw the wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const segmentAngle = (2 * Math.PI) / WHEEL_SEGMENTS;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    wheelRewards.forEach((reward, i) => {
      const startAngle = i * segmentAngle + (rotation * Math.PI) / 180;
      const endAngle = startAngle + segmentAngle;

      // Segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = 'hsl(var(--border))';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Emoji
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '24px sans-serif';
      ctx.fillText(reward.icon_emoji || '🎁', radius * 0.65, 0);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, 2 * Math.PI);
    ctx.fillStyle = 'hsl(var(--card))';
    ctx.fill();
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Center text
    ctx.fillStyle = 'hsl(var(--primary))';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', centerX, centerY);
  }, [rotation, wheelRewards]);

  const handleSpin = async () => {
    if (!canSpinToday || isSpinning) return;

    setPhase('spinning');
    
    // Start spinning animation
    const spinDuration = 4000;
    const totalRotation = 360 * 5 + Math.random() * 360; // 5 full rotations + random
    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Easing function (ease out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + totalRotation * easeOut;
      
      setRotation(currentRotation % 360);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    // Get actual result
    const result = await spinWheel();

    // Wait for animation to complete
    setTimeout(() => {
      if (result) {
        setWonReward(result);
        setPhase('result');
        
        // Trigger confetti based on rarity
        if (result.rarity === 'legendary') {
          confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF4500'],
          });
        } else if (result.rarity === 'epic') {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#9333EA', '#A855F7', '#C084FC'],
          });
        } else if (result.rarity === 'rare') {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        }
      }
    }, spinDuration);
  };

  const handleClaim = async () => {
    if (wonReward) {
      await claimReward(wonReward.id);
    }
    setPhase('ready');
    setWonReward(null);
    onOpenChange(false);
    onComplete?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-card to-background border-2 border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-display uppercase tracking-wide">Mystery Reward</span>
            <Sparkles className="h-5 w-5 text-primary" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {phase === 'result' && wonReward ? (
            // Result screen
            <div className="text-center space-y-6 animate-fade-in">
              <div className="text-6xl animate-bounce">
                {wonReward.icon_emoji || '🎁'}
              </div>
              
              <div className={cn(
                "p-6 rounded-xl bg-card border-2 shadow-lg",
                RARITY_GLOW[wonReward.rarity]
              )}>
                <p className={cn(
                  "text-xs uppercase tracking-widest mb-2 font-display",
                  RARITY_COLORS[wonReward.rarity]
                )}>
                  {wonReward.rarity}
                </p>
                <h3 className="text-xl font-bold mb-2">{wonReward.reward_name}</h3>
                {wonReward.description && (
                  <p className="text-sm text-muted-foreground">{wonReward.description}</p>
                )}
                {wonReward.reward_type === 'points' && (
                  <p className="text-2xl font-display text-primary mt-3">
                    +{wonReward.reward_value} Points
                  </p>
                )}
              </div>

              <Button onClick={handleClaim} size="lg" className="w-full btn-gym">
                <Gift className="h-5 w-5 mr-2" />
                Claim Reward
              </Button>
            </div>
          ) : (
            // Spin wheel
            <>
              <div className="relative flex justify-center">
                {/* Pointer */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                  <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
                </div>
                
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={280}
                  className={cn(
                    "transition-transform",
                    phase === 'spinning' && "drop-shadow-2xl"
                  )}
                />
              </div>

              <Button
                onClick={handleSpin}
                disabled={!canSpinToday || isSpinning || phase === 'spinning'}
                size="lg"
                className="w-full btn-gym text-lg"
              >
                {phase === 'spinning' ? (
                  <span className="animate-pulse">Spinning...</span>
                ) : canSpinToday ? (
                  <>
                    <Star className="h-5 w-5 mr-2" />
                    SPIN THE WHEEL
                  </>
                ) : (
                  'Come back tomorrow!'
                )}
              </Button>

              {!canSpinToday && (
                <p className="text-center text-sm text-muted-foreground">
                  Complete a training session to earn another spin!
                </p>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
