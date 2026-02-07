import { useState } from 'react';
import { PrayerEntry } from '@/types/faith';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { prayerTypeConfig } from './PrayerCard';
import { Plus, Sparkles, Lightbulb } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const prayerPrompts: Record<PrayerEntry['type'], string[]> = {
  adoration: [
    "Lord, I praise You for Your...",
    "You are worthy because...",
    "I worship You for who You are: ...",
  ],
  confession: [
    "Father, I confess that I have...",
    "I repent of my tendency to...",
    "Forgive me for...",
  ],
  thanksgiving: [
    "Thank You Lord for...",
    "I'm grateful for the way You...",
    "I give thanks for Your blessing of...",
  ],
  supplication: [
    "Lord, I ask that You would...",
    "Please guide me in...",
    "I need Your help with...",
  ],
};

interface AddPrayerDialogProps {
  onAddPrayer: (prayer: Omit<PrayerEntry, 'id'>) => void;
}

export function AddPrayerDialog({ onAddPrayer }: AddPrayerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<PrayerEntry['type']>('thanksgiving');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) {
      // Show visual feedback for empty content
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
        textarea.classList.add('border-destructive');
        setTimeout(() => textarea.classList.remove('border-destructive'), 2000);
      }
      return;
    }
    
    onAddPrayer({
      date: new Date().toISOString().split('T')[0],
      type: selectedType,
      content: content.trim(),
      answered: false,
    });
    
    setContent('');
    setIsOpen(false);
  };

  const insertPrompt = (prompt: string) => {
    setContent(prompt + ' ');
  };

  const currentConfig = prayerTypeConfig[selectedType];
  const CurrentIcon = currentConfig.icon;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="btn-gym flex items-center gap-2"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          <span className="font-display uppercase tracking-wider">New Prayer</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl uppercase tracking-wider">
            <Sparkles className="h-5 w-5 text-primary" />
            Lift Up Your Prayer
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* ACTS Type Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Prayer Type (ACTS Method)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(prayerTypeConfig) as PrayerEntry['type'][]).map((type) => {
                const config = prayerTypeConfig[type];
                const Icon = config.icon;
                const isSelected = selectedType === type;
                
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "relative p-3 rounded-lg border-2 transition-all duration-200 text-left",
                      isSelected
                        ? `${config.borderColor} border-l-4 bg-gradient-to-br ${config.gradient}`
                        : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        isSelected ? config.iconBg : "bg-muted"
                      )}>
                        <Icon className={cn(
                          "h-4 w-4",
                          isSelected ? config.iconColor : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <p className={cn(
                          "font-display text-sm uppercase tracking-wider",
                          isSelected ? config.iconColor : "text-foreground"
                        )}>
                          {config.label}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {config.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompts */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lightbulb className="h-4 w-4" />
              <span>Need inspiration? Try a prompt:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {prayerPrompts[selectedType].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => insertPrompt(prompt)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    "border border-border hover:border-primary/50 hover:bg-primary/10",
                    "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {prompt.slice(0, 25)}...
                </button>
              ))}
            </div>
          </div>

          {/* Prayer Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Your Prayer
            </label>
            <div className={cn(
              "relative rounded-lg overflow-hidden",
              `bg-gradient-to-br ${currentConfig.gradient}`
            )}>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Pour out your heart to God..."
                className="min-h-[150px] bg-transparent border-2 border-border focus:border-primary/50 resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <Button 
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="w-full btn-gym"
          >
            <CurrentIcon className="h-5 w-5 mr-2" />
            <span className="font-display uppercase tracking-wider">Submit Prayer</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
