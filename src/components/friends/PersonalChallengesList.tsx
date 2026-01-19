import { usePersonalChallenges, CHALLENGE_TEMPLATES } from '@/hooks/usePersonalChallenges';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flame, Target, Clock, Trophy, Swords, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow, differenceInDays } from 'date-fns';

export function PersonalChallengesList() {
  const { 
    getActiveChallenges, 
    getCompletedChallenges,
    startChallenge, 
    abandonChallenge,
    getDifficultyColor,
    loading 
  } = usePersonalChallenges();

  const [showTemplates, setShowTemplates] = useState(false);
  const [starting, setStarting] = useState(false);

  const activeChallenges = getActiveChallenges();
  const completedChallenges = getCompletedChallenges();

  const handleStartChallenge = async (template: typeof CHALLENGE_TEMPLATES[0]) => {
    setStarting(true);
    const { error } = await startChallenge(template);
    setStarting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to start challenge",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Challenge Started! 🔥",
        description: `${template.name} - Let's go!`
      });
      setShowTemplates(false);
    }
  };

  const handleAbandon = async (challengeId: string) => {
    const { error } = await abandonChallenge(challengeId);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to abandon challenge",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Challenge Abandoned",
        description: "You can always start again."
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Start New Challenge Button */}
        <Button 
          onClick={() => setShowTemplates(true)}
          className="w-full"
          variant="outline"
        >
          <Target className="h-4 w-4 mr-2" />
          Start Personal Challenge
        </Button>

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeChallenges.map((challenge) => {
                const progress = (challenge.current_value / challenge.target_value) * 100;
                const daysLeft = differenceInDays(new Date(challenge.ends_at), new Date());
                
                return (
                  <div 
                    key={challenge.id} 
                    className="p-4 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{challenge.icon_emoji}</span>
                        <div>
                          <h4 className="font-bold text-sm">{challenge.challenge_name}</h4>
                          <p className="text-xs text-muted-foreground">{challenge.description}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => handleAbandon(challenge.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>{challenge.current_value} / {challenge.target_value}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Last day!'}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Completed Challenges */}
        {completedChallenges.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {completedChallenges.slice(0, 6).map((challenge) => (
                  <Badge 
                    key={challenge.id} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <span>{challenge.icon_emoji}</span>
                    {challenge.challenge_name}
                  </Badge>
                ))}
                {completedChallenges.length > 6 && (
                  <Badge variant="outline">
                    +{completedChallenges.length - 6} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeChallenges.length === 0 && completedChallenges.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <Swords className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No challenges yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start a personal challenge to push your faith further!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Challenge Templates Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose Your Challenge</DialogTitle>
            <DialogDescription>
              Pick a challenge that fits your goals
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {CHALLENGE_TEMPLATES.map((template, i) => (
                <div 
                  key={i}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => !starting && handleStartChallenge(template)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{template.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold">{template.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={getDifficultyColor(template.difficulty)}
                        >
                          {template.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                      <p className="text-xs italic text-muted-foreground mt-2">
                        "{template.scripture}"
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {template.duration} days
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Target: {template.target}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
