import { useState, useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { GuidanceTopic } from '@/lib/scriptureGuidance';
import { cn } from '@/lib/utils';

interface TopicGridProps {
  topics: GuidanceTopic[];
  onSelect: (id: string) => void;
}

export function TopicGrid({ topics, onSelect }: TopicGridProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortLabel.toLowerCase().includes(q) ||
        t.intro.toLowerCase().includes(q),
    );
  }, [topics, query]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Scripture for what you're facing
          </p>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight">
          What are you facing today?
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Choose what's weighing on you. We'll meet you there with Scripture, reflection, prayer,
          and a community ready to walk with you.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a feeling or struggle..."
          className="pl-9 h-12 bg-card border-border"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filtered.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic.id)}
            className={cn(
              'group text-left rounded-2xl border-2 border-border bg-card p-4',
              'hover:border-primary/50 hover:bg-primary/5 transition-all',
              'flex flex-col gap-2 min-h-[120px]',
            )}
          >
            <span className="text-3xl leading-none">{topic.emoji}</span>
            <span className="font-display text-base text-foreground leading-tight">
              {topic.name}
            </span>
            <span className="text-xs text-muted-foreground leading-snug line-clamp-2 mt-auto">
              {topic.intro}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No topics match "{query}". Try another word, or browse the full list.
          </p>
        </div>
      )}
    </div>
  );
}
