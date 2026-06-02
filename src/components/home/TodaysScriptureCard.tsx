import { useState } from 'react';
import { useDailyMood } from '@/hooks/useDailyMood';
import { moodContent } from '@/lib/moodContent';
import { Button } from '@/components/ui/button';
import { Bookmark, Share2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const defaultVerse = {
  reference: 'Lamentations 3:22-23',
  text: 'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning.',
};

export function TodaysScriptureCard() {
  const { mood } = useDailyMood();
  const verse = mood ? moodContent[mood].scripture : defaultVerse;
  const reflection = mood ? moodContent[mood].reflection : 'What does this verse stir in you today?';
  const prayer = mood ? moodContent[mood].prayerPrompt : 'Speak one honest sentence to God.';
  const [saved, setSaved] = useState(false);

  const handleShare = async () => {
    const text = `"${verse.text}" — ${verse.reference}`;
    if (navigator.share) {
      try { await navigator.share({ text }); } catch {}
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    }
  };

  const handleSave = () => {
    setSaved(true);
    try {
      const saved = JSON.parse(localStorage.getItem('faithfit-saved-verses') || '[]');
      saved.push({ ...verse, savedAt: new Date().toISOString() });
      localStorage.setItem('faithfit-saved-verses', JSON.stringify(saved));
    } catch {}
    toast.success('Saved to your verses');
  };

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-4 w-4 text-primary" />
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Today's Scripture</p>
      </div>

      <p className="font-display text-xl sm:text-2xl text-foreground leading-relaxed mb-2">
        "{verse.text}"
      </p>
      <p className="text-sm text-muted-foreground mb-5">— {verse.reference}</p>

      <div className="space-y-3 pt-4 border-t border-border">
        <div>
          <p className="text-xs uppercase tracking-wider text-secondary font-semibold mb-1">Reflect</p>
          <p className="text-base text-foreground leading-relaxed">{reflection}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-secondary font-semibold mb-1">Pray</p>
          <p className="text-base text-foreground leading-relaxed">{prayer}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-5">
        <Button variant="outline" size="sm" onClick={handleSave} disabled={saved} className="flex-1">
          <Bookmark className="h-4 w-4 mr-2" />
          {saved ? 'Saved' : 'Save'}
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} className="flex-1">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
