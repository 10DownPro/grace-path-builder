import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Check, Heart, X, Sparkles, Filter } from 'lucide-react';
import { samplePrayers } from '@/lib/sampleData';
import { PrayerEntry } from '@/types/faith';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const prayerTypes = [
  { id: 'adoration', label: 'Adoration', emoji: '🙌', color: 'text-primary' },
  { id: 'confession', label: 'Confession', emoji: '💭', color: 'text-accent' },
  { id: 'thanksgiving', label: 'Thanksgiving', emoji: '🙏', color: 'text-sage' },
  { id: 'supplication', label: 'Supplication', emoji: '🙋', color: 'text-navy' },
] as const;

export default function Prayer() {
  const [prayers, setPrayers] = useState<PrayerEntry[]>(samplePrayers);
  const [filter, setFilter] = useState<'all' | 'active' | 'answered'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newPrayerType, setNewPrayerType] = useState<PrayerEntry['type']>('thanksgiving');
  const [newPrayerContent, setNewPrayerContent] = useState('');

  const filteredPrayers = prayers.filter(p => {
    if (filter === 'answered') return p.answered;
    if (filter === 'active') return !p.answered;
    return true;
  });

  const answeredCount = prayers.filter(p => p.answered).length;

  const addPrayer = () => {
    if (!newPrayerContent.trim()) return;
    
    const newPrayer: PrayerEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: newPrayerType,
      content: newPrayerContent,
      answered: false
    };
    
    setPrayers([newPrayer, ...prayers]);
    setNewPrayerContent('');
    setIsAddOpen(false);
  };

  const markAnswered = (id: string) => {
    setPrayers(prayers.map(p => 
      p.id === id 
        ? { ...p, answered: true, answeredDate: new Date().toISOString().split('T')[0] }
        : p
    ));
  };

  return (
    <PageLayout>
      <div className="px-4 pt-12 pb-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Prayer Journal</h1>
            <p className="text-muted-foreground">Your conversations with God</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="golden" size="icon" className="rounded-full">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>New Prayer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="flex flex-wrap gap-2">
                  {prayerTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setNewPrayerType(type.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                        newPrayerType === type.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {type.emoji} {type.label}
                    </button>
                  ))}
                </div>
                <Textarea
                  value={newPrayerContent}
                  onChange={(e) => setNewPrayerContent(e.target.value)}
                  placeholder="Write your prayer here..."
                  className="min-h-[150px]"
                />
                <Button onClick={addPrayer} className="w-full" variant="golden">
                  Save Prayer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="spiritual-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{prayers.length}</p>
            <p className="text-sm text-muted-foreground">Total Prayers</p>
          </div>
          <div className="spiritual-card p-4 text-center">
            <p className="text-2xl font-bold text-sage">{answeredCount}</p>
            <p className="text-sm text-muted-foreground">Answered</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(['all', 'active', 'answered'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Prayer List */}
        <div className="space-y-4">
          {filteredPrayers.map(prayer => (
            <PrayerCard 
              key={prayer.id} 
              prayer={prayer}
              onMarkAnswered={() => markAnswered(prayer.id)}
            />
          ))}
          
          {filteredPrayers.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No prayers yet. Start your conversation with God!</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

function PrayerCard({ prayer, onMarkAnswered }: { prayer: PrayerEntry; onMarkAnswered: () => void }) {
  const type = prayerTypes.find(t => t.id === prayer.type);

  return (
    <div className={cn(
      "spiritual-card p-4 space-y-3",
      prayer.answered && "border-sage/30 bg-sage/5"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span>{type?.emoji}</span>
          <span className={cn("text-sm font-medium", type?.color)}>{type?.label}</span>
          <span className="text-xs text-muted-foreground">• {prayer.date}</span>
        </div>
        {!prayer.answered && (
          <Button variant="ghost" size="sm" onClick={onMarkAnswered} className="text-sage">
            <Check className="h-4 w-4 mr-1" />
            Answered
          </Button>
        )}
      </div>
      
      <p className="text-foreground/90">{prayer.content}</p>
      
      {prayer.answered && (
        <div className="flex items-center gap-2 text-sm text-sage">
          <Heart className="h-4 w-4 fill-current" />
          <span>Answered on {prayer.answeredDate}</span>
        </div>
      )}
    </div>
  );
}
