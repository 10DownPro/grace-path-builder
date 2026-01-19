import { Sparkles } from 'lucide-react';

const encouragements = [
  { text: "Be still, and know that I am God.", reference: "Psalm 46:10" },
  { text: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7" },
  { text: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" },
  { text: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
  { text: "Trust in the Lord with all your heart.", reference: "Proverbs 3:5" },
];

export function EncouragementBanner() {
  // Get a consistent daily encouragement
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const encouragement = encouragements[dayOfYear % encouragements.length];

  return (
    <div className="encouragement-card p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-muted-foreground">Daily Encouragement</p>
          <p className="font-scripture text-lg text-foreground leading-relaxed italic">
            "{encouragement.text}"
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            — {encouragement.reference}
          </p>
        </div>
      </div>
    </div>
  );
}
