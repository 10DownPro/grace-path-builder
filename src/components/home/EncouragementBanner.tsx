import { Sparkles } from 'lucide-react';

const encouragements = [
  { text: "You're growing stronger in faith each day!", verse: "2 Corinthians 5:7" },
  { text: "God's mercies are new every morning.", verse: "Lamentations 3:23" },
  { text: "Keep pressing on toward the goal!", verse: "Philippians 3:14" },
  { text: "The Lord is your strength and shield.", verse: "Psalm 28:7" },
];

export function EncouragementBanner() {
  const today = new Date().getDay();
  const encouragement = encouragements[today % encouragements.length];

  return (
    <div className="relative overflow-hidden rounded-xl gradient-golden p-5">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="80" cy="20" r="40" fill="white" />
        </svg>
      </div>
      
      <div className="relative space-y-2">
        <div className="flex items-center gap-2 text-primary-foreground/90">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Daily Encouragement</span>
        </div>
        <p className="text-lg font-medium text-primary-foreground">
          {encouragement.text}
        </p>
        <p className="text-sm text-primary-foreground/80">
          — {encouragement.verse}
        </p>
      </div>
    </div>
  );
}
