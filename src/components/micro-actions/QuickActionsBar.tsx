import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useMicroActions } from '@/hooks/useMicroActions';
import { QuickPrayerDialog } from './QuickPrayerDialog';
import { VerseSnackDialog } from './VerseSnackDialog';
import { GratitudeNoteDialog } from './GratitudeNoteDialog';
import { BreathPrayerDialog } from './BreathPrayerDialog';
import { EncourageFriendDialog } from './EncourageFriendDialog';
import { Sparkles, CheckCircle, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QuickActionsBar() {
  const { microActions, getActionStats, checkAllGoalsComplete, claimDailyBonus, dailyGoals } = useMicroActions();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const stats = getActionStats();
  const allComplete = checkAllGoalsComplete();
  const bonusClaimed = dailyGoals?.bonus_claimed || false;

  const actionButtons = [
    { type: 'quick_prayer', icon: '🙏', label: 'Quick Prayer', stat: stats.prayers },
    { type: 'verse_snack', icon: '📖', label: 'Verse Snack', stat: stats.verses },
    { type: 'encourage_friend', icon: '💪', label: 'Encourage', stat: stats.encouragements },
    { type: 'gratitude_note', icon: '✨', label: 'Gratitude', stat: stats.gratitude },
    { type: 'breath_prayer', icon: '🌬️', label: 'Breathe', stat: stats.breathPrayers }
  ];

  const totalProgress = Math.min(100, (
    (stats.prayers.completed / stats.prayers.goal) +
    (stats.verses.completed / stats.verses.goal) +
    (stats.encouragements.completed / stats.encouragements.goal)
  ) / 3 * 100);

  return (
    <Card className="border-2 border-border bg-card" data-tour="quick-actions">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-bold uppercase tracking-wide">Quick Wins</h3>
          </div>
          {allComplete && !bonusClaimed && (
            <Button
              size="sm"
              variant="golden"
              onClick={claimDailyBonus}
              className="animate-pulse"
            >
              <Gift className="h-4 w-4 mr-1" />
              Claim +50
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Daily Progress</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {actionButtons.map((action) => {
            const isComplete = action.stat.completed >= action.stat.goal;
            
            return (
              <button
                key={action.type}
                onClick={() => setActiveDialog(action.type)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all",
                  "hover:bg-accent hover:scale-105 active:scale-95",
                  isComplete
                    ? "border-success bg-success/10"
                    : "border-border bg-background"
                )}
              >
                <span className="text-xl">{action.icon}</span>
                <span className="text-[10px] font-medium text-muted-foreground truncate w-full text-center">
                  {action.label}
                </span>
                <div className="flex items-center gap-0.5">
                  {isComplete ? (
                    <CheckCircle className="h-3 w-3 text-success" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      {action.stat.completed}/{action.stat.goal}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Goal Summary */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={cn(
            "px-2 py-1 rounded-full border",
            stats.prayers.completed >= stats.prayers.goal ? "bg-success/20 border-success text-success" : "border-border"
          )}>
            Prayers: {stats.prayers.completed}/{stats.prayers.goal} {stats.prayers.completed >= stats.prayers.goal && '✅'}
          </span>
          <span className={cn(
            "px-2 py-1 rounded-full border",
            stats.verses.completed >= stats.verses.goal ? "bg-success/20 border-success text-success" : "border-border"
          )}>
            Verses: {stats.verses.completed}/{stats.verses.goal} {stats.verses.completed >= stats.verses.goal && '✅'}
          </span>
          <span className={cn(
            "px-2 py-1 rounded-full border",
            stats.encouragements.completed >= stats.encouragements.goal ? "bg-success/20 border-success text-success" : "border-border"
          )}>
            Encourage: {stats.encouragements.completed}/{stats.encouragements.goal} {stats.encouragements.completed >= stats.encouragements.goal && '✅'}
          </span>
        </div>
      </CardContent>

      {/* Dialogs */}
      <QuickPrayerDialog 
        open={activeDialog === 'quick_prayer'} 
        onOpenChange={(open) => !open && setActiveDialog(null)} 
      />
      <VerseSnackDialog 
        open={activeDialog === 'verse_snack'} 
        onOpenChange={(open) => !open && setActiveDialog(null)} 
      />
      <GratitudeNoteDialog 
        open={activeDialog === 'gratitude_note'} 
        onOpenChange={(open) => !open && setActiveDialog(null)} 
      />
      <BreathPrayerDialog 
        open={activeDialog === 'breath_prayer'} 
        onOpenChange={(open) => !open && setActiveDialog(null)} 
      />
      <EncourageFriendDialog 
        open={activeDialog === 'encourage_friend'} 
        onOpenChange={(open) => !open && setActiveDialog(null)} 
      />
    </Card>
  );
}
