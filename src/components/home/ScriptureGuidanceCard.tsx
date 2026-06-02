import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export function ScriptureGuidanceCard() {
  return (
    <Link
      to="/scripture-for"
      className="block rounded-2xl border border-border bg-card p-5 hover:border-primary/50 hover:bg-primary/5 transition-all group"
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
          Scripture for what you're facing
        </p>
      </div>
      <h3 className="font-display text-2xl text-foreground mb-2 leading-tight">
        What are you facing today?
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        Anxiety, doubt, grief, temptation — find Scripture, prayer, and community for the real
        thing on your heart.
      </p>
      <div className="flex items-center gap-1.5 text-sm text-primary font-semibold group-hover:gap-2.5 transition-all">
        <span>Find guidance</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
