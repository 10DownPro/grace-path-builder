import { BookOpen, HandHeart } from 'lucide-react';

interface ThisWeekCardProps {
  prayersLogged: number;
  versesRead: number;
}

export function ThisWeekCard({ prayersLogged, versesRead }: ThisWeekCardProps) {
  return (
    <div className="spiritual-card p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">This Week</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <HandHeart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground">{prayersLogged}</p>
            <p className="text-xs text-muted-foreground">Prayers Logged</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground">{versesRead}</p>
            <p className="text-xs text-muted-foreground">Verses Read</p>
          </div>
        </div>
      </div>
    </div>
  );
}
