import { Shield, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CommunityGuidelines() {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('community-guidelines-dismissed') === 'true';
  });

  const handleDismiss = () => {
    localStorage.setItem('community-guidelines-dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className={cn(
      "relative rounded-lg border-2 border-primary/30 bg-primary/5 p-4",
      "mb-4"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Shield className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-foreground mb-2">Community Guidelines</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>❤️ <span className="font-medium text-foreground">Speak with kindness.</span> Disagree about ideas, never people.</li>
            <li>📖 <span className="font-medium text-foreground">Anchor in Scripture</span> whenever you can.</li>
            <li>🙏 <span className="font-medium text-foreground">Grace {'>'} being right.</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
