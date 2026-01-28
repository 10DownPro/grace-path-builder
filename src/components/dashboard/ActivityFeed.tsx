import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Target, Trophy, Users, BookOpen, Flame } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'session' | 'prayer' | 'milestone' | 'squad' | 'scripture' | 'streak';
  title: string;
  description: string;
  timestamp: Date;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const activityIcons = {
  session: Dumbbell,
  prayer: Target,
  milestone: Trophy,
  squad: Users,
  scripture: BookOpen,
  streak: Flame,
};

const activityColors = {
  session: 'bg-primary/10 text-primary',
  prayer: 'bg-success/10 text-success',
  milestone: 'bg-warning/10 text-warning',
  squad: 'bg-secondary/20 text-secondary-foreground',
  scripture: 'bg-primary/10 text-primary',
  streak: 'bg-warning/10 text-warning',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <Card className="gym-card">
        <CardHeader>
          <CardTitle className="font-display uppercase tracking-wide">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Dumbbell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg uppercase mb-2">No Activity Yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Start your first training session to see your activity here!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gym-card">
      <CardHeader>
        <CardTitle className="font-display uppercase tracking-wide">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
