import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PrayerCard } from '@/components/prayer/PrayerCard';
import { PrayerStats } from '@/components/prayer/PrayerStats';
import { AddPrayerDialog } from '@/components/prayer/AddPrayerDialog';
import { samplePrayers } from '@/lib/sampleData';
import { PrayerEntry } from '@/types/faith';
import { cn } from '@/lib/utils';
import { Filter, Sparkles, Target, BookOpen } from 'lucide-react';

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'answered', label: 'Answered' },
] as const;

const typeFilters = [
  { id: 'all', label: 'All Types' },
  { id: 'adoration', label: 'A', full: 'Adoration' },
  { id: 'confession', label: 'C', full: 'Confession' },
  { id: 'thanksgiving', label: 'T', full: 'Thanksgiving' },
  { id: 'supplication', label: 'S', full: 'Supplication' },
] as const;

export default function Prayer() {
  const [prayers, setPrayers] = useState<PrayerEntry[]>(samplePrayers);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'answered'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | PrayerEntry['type']>('all');

  const filteredPrayers = prayers.filter(p => {
    const matchesStatus = statusFilter === 'all' 
      || (statusFilter === 'answered' && p.answered)
      || (statusFilter === 'active' && !p.answered);
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const addPrayer = (newPrayer: Omit<PrayerEntry, 'id'>) => {
    const prayer: PrayerEntry = {
      ...newPrayer,
      id: Date.now().toString(),
    };
    setPrayers([prayer, ...prayers]);
  };

  const markAnswered = (id: string, note: string) => {
    setPrayers(prayers.map(p => 
      p.id === id 
        ? { 
            ...p, 
            answered: true, 
            answeredDate: new Date().toISOString().split('T')[0],
            answeredNote: note || undefined,
          }
        : p
    ));
  };

  return (
    <PageLayout>
      <div className="px-4 pt-8 pb-6 space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-xl gym-card p-6">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          {/* Content */}
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl uppercase tracking-wider text-foreground">
                  Prayer Armory
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your spiritual warfare headquarters
                </p>
              </div>
            </div>
            
            {/* ACTS Explainer */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border">
              <BookOpen className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">ACTS Method:</span>{' '}
                <span className="text-orange-400">A</span>doration • {' '}
                <span className="text-purple-400">C</span>onfession • {' '}
                <span className="text-emerald-400">T</span>hanksgiving • {' '}
                <span className="text-blue-400">S</span>upplication
              </div>
            </div>
            
            <AddPrayerDialog onAddPrayer={addPrayer} />
          </div>
          
          {/* Corner decoration */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
        </div>

        {/* Stats */}
        <PrayerStats prayers={prayers} />

        {/* Filters */}
        <div className="space-y-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {filterOptions.map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    "border-2",
                    statusFilter === f.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-muted-foreground/50"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-4">ACTS</span>
            <div className="flex gap-1">
              {typeFilters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setTypeFilter(f.id)}
                  title={f.id === 'all' ? 'All Types' : f.full}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-sm font-bold transition-all",
                    "border-2 min-w-[32px]",
                    typeFilter === f.id
                      ? f.id === 'adoration' ? "bg-orange-500/20 text-orange-400 border-orange-500/50"
                      : f.id === 'confession' ? "bg-purple-500/20 text-purple-400 border-purple-500/50"
                      : f.id === 'thanksgiving' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                      : f.id === 'supplication' ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                      : "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-muted-foreground/50"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prayer List */}
        <div className="space-y-4 stagger-children">
          {filteredPrayers.map(prayer => (
            <PrayerCard 
              key={prayer.id} 
              prayer={prayer}
              onMarkAnswered={(note) => markAnswered(prayer.id, note)}
            />
          ))}
          
          {filteredPrayers.length === 0 && (
            <div className="gym-card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-display uppercase tracking-wider text-muted-foreground mb-2">
                No Prayers Found
              </p>
              <p className="text-sm text-muted-foreground">
                {statusFilter === 'answered' 
                  ? "Keep praying — God is always listening!"
                  : "Start your conversation with the Almighty"}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
