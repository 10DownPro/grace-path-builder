import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ChevronRight, X, Dumbbell, Target, Users, Trophy, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  link: string;
  icon: typeof Dumbbell;
}

interface GettingStartedChecklistProps {
  items: ChecklistItem[];
  onDismiss?: () => void;
}

export function GettingStartedChecklist({ items, onDismiss }: GettingStartedChecklistProps) {
  const completedCount = items.filter((item) => item.completed).length;
  const progress = (completedCount / items.length) * 100;
  const allCompleted = completedCount === items.length;

  if (allCompleted && onDismiss) {
    return null;
  }

  return (
    <Card className="gym-card border-l-4 border-l-primary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-display uppercase tracking-wide">
          Getting Started
        </CardTitle>
        {onDismiss && (
          <Button variant="ghost" size="icon" onClick={onDismiss} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Your progress</span>
            <span className="font-medium">{completedCount}/{items.length} completed</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                item.completed
                  ? 'bg-success/10 border border-success/20'
                  : 'bg-muted/50 hover:bg-muted border border-transparent hover:border-primary/30'
              )}
            >
              <div className={cn(
                'p-2 rounded-full',
                item.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
              )}>
                {item.completed ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <item.icon className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'font-medium text-sm',
                  item.completed && 'line-through text-muted-foreground'
                )}>
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>
              {!item.completed && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Default checklist items
export const defaultChecklistItems: ChecklistItem[] = [
  {
    id: 'first-session',
    title: 'Complete your first training',
    description: 'Start with a 15-minute session',
    completed: false,
    link: '/session',
    icon: Dumbbell,
  },
  {
    id: 'first-prayer',
    title: 'Add your first prayer',
    description: 'Create a prayer request',
    completed: false,
    link: '/prayer',
    icon: Target,
  },
  {
    id: 'join-squad',
    title: 'Join or create a squad',
    description: 'Train with friends',
    completed: false,
    link: '/friends',
    icon: Users,
  },
  {
    id: 'explore-rewards',
    title: 'Check out the rewards',
    description: 'See what you can unlock',
    completed: false,
    link: '/rewards',
    icon: Trophy,
  },
  {
    id: 'read-scripture',
    title: 'Read your first passage',
    description: 'Dive into the Word',
    completed: false,
    link: '/scripture',
    icon: BookOpen,
  },
];
