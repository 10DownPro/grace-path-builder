import { BookOpen, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Scripture } from '@/types/faith';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ScriptureCardProps {
  scripture: Scripture;
}

export function ScriptureCard({ scripture }: ScriptureCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="spiritual-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <BookOpen className="h-5 w-5" />
          <span className="font-medium">Today's Verse</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSaved(!saved)}
          className={cn(saved && "text-primary")}
        >
          <Bookmark className={cn("h-5 w-5", saved && "fill-current")} />
        </Button>
      </div>

      <blockquote className="font-scripture text-xl leading-relaxed text-foreground/90 italic">
        "{scripture.text}"
      </blockquote>

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-primary">{scripture.reference}</span>
        <span className="text-muted-foreground">{scripture.translation}</span>
      </div>
    </div>
  );
}
