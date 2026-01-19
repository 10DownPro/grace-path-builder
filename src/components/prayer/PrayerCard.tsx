import { useState } from 'react';
import { PrayerEntry } from '@/types/faith';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, Heart, MessageCircle, Flame, PartyPopper, X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const prayerTypeConfig = {
  adoration: {
    label: 'Adoration',
    icon: Flame,
    gradient: 'from-orange-500/20 to-red-600/20',
    borderColor: 'border-l-orange-500',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    description: 'Praising God for who He is',
  },
  confession: {
    label: 'Confession',
    icon: MessageCircle,
    gradient: 'from-purple-500/20 to-indigo-600/20',
    borderColor: 'border-l-purple-500',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    description: 'Acknowledging our sins',
  },
  thanksgiving: {
    label: 'Thanksgiving',
    icon: Heart,
    gradient: 'from-emerald-500/20 to-teal-600/20',
    borderColor: 'border-l-emerald-500',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    description: 'Gratitude for blessings',
  },
  supplication: {
    label: 'Supplication',
    icon: PartyPopper,
    gradient: 'from-blue-500/20 to-cyan-600/20',
    borderColor: 'border-l-blue-500',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    description: 'Requests and petitions',
  },
};

interface PrayerCardProps {
  prayer: PrayerEntry;
  onMarkAnswered: (note: string) => void;
}

export function PrayerCard({ prayer, onMarkAnswered }: PrayerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [answerNote, setAnswerNote] = useState('');
  
  const config = prayerTypeConfig[prayer.type];
  const Icon = config.icon;
  const isLongContent = prayer.content.length > 150;
  const displayContent = isExpanded || !isLongContent 
    ? prayer.content 
    : prayer.content.slice(0, 150) + '...';

  const handleMarkAnswered = () => {
    onMarkAnswered(answerNote);
    setIsAnswerDialogOpen(false);
    setAnswerNote('');
  };

  return (
    <>
      <div className={cn(
        "relative overflow-hidden rounded-lg border-2 border-l-4 transition-all duration-300",
        config.borderColor,
        prayer.answered 
          ? "border-success/40 bg-success/5" 
          : "border-border bg-card"
      )}>
        {/* Gradient background */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50",
          config.gradient
        )} />
        
        {/* Content */}
        <div className="relative p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                config.iconBg
              )}>
                <Icon className={cn("h-5 w-5", config.iconColor)} />
              </div>
              <div>
                <p className={cn("font-display text-sm uppercase tracking-wider", config.iconColor)}>
                  {config.label}
                </p>
                <p className="text-xs text-muted-foreground">{prayer.date}</p>
              </div>
            </div>
            
            {!prayer.answered && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAnswerDialogOpen(true)}
                className="text-success hover:text-success hover:bg-success/10"
              >
                <Check className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Answered!</span>
              </Button>
            )}
          </div>
          
          {/* Prayer content */}
          <div className="space-y-2">
            <p className="text-foreground/90 leading-relaxed">{displayContent}</p>
            
            {isLongContent && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Read more
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* Answered badge */}
          {prayer.answered && (
            <div className="pt-2 border-t border-success/20">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="h-3 w-3 text-success fill-current" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-success font-medium">
                    God answered on {prayer.answeredDate}
                  </p>
                  {prayer.answeredNote && (
                    <p className="text-sm text-muted-foreground italic">
                      "{prayer.answeredNote}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Rivets decoration */}
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-border/50" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-border/50" />
      </div>

      {/* Answer Dialog */}
      <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PartyPopper className="h-5 w-5 text-warning" />
              Prayer Answered!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground line-clamp-3">{prayer.content}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                How did God answer? (optional)
              </label>
              <Textarea
                value={answerNote}
                onChange={(e) => setAnswerNote(e.target.value)}
                placeholder="Describe how God moved in this situation..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAnswerDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleMarkAnswered}
                className="flex-1 bg-success hover:bg-success/90"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark Answered
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { prayerTypeConfig };
