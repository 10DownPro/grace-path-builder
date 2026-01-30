import { useState } from 'react';
import { Send, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface CommentComposerProps {
  onSubmit: (text: string) => Promise<boolean>;
  placeholder?: string;
}

export function CommentComposer({ onSubmit, placeholder = "Share your thoughts..." }: CommentComposerProps) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const hasScripture = /\d+:\d+|Matthew|Mark|Luke|John|Romans|Psalm|Proverbs|Genesis|Isaiah|Revelation|Corinthians|Ephesians|Philippians|Colossians|Timothy|Hebrews|James|Peter/i.test(text);
  
  // Bonus indicators
  const qualifiesForBonus = wordCount >= 50 && hasScripture;

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    
    setSubmitting(true);
    const success = await onSubmit(text);
    if (success) {
      setText('');
    }
    setSubmitting(false);
  };

  if (!user) {
    return (
      <div className="p-4 text-center border-2 border-dashed border-border rounded-lg">
        <p className="text-muted-foreground">Sign in to join the discussion</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Textarea
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[100px] resize-none"
        maxLength={2000}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{wordCount} words</span>
          <span>{text.length}/2000</span>
          
          {/* Bonus indicators */}
          {wordCount >= 50 && (
            <span className="text-green-500">✓ 50+ words</span>
          )}
          {hasScripture && (
            <span className="text-primary flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Scripture detected
            </span>
          )}
          {qualifiesForBonus && (
            <span className="text-amber-500 font-medium">
              +10 bonus points!
            </span>
          )}
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!text.trim() || submitting}
          className="font-bold"
        >
          <Send className="h-4 w-4 mr-1" />
          Post
        </Button>
      </div>
    </div>
  );
}
