import { useState } from 'react';
import { useSquads, Squad, SquadMember, SquadActivity } from '@/hooks/useSquads';
import { useFriends } from '@/hooks/useFriends';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CreateSquadDialog } from './CreateSquadDialog';
import { 
  Users, 
  Plus, 
  Flame, 
  Trophy, 
  ChevronRight, 
  UserPlus,
  LogOut,
  Trash2,
  Crown
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export function SquadsList() {
  const { 
    squads, 
    currentSquad, 
    members, 
    activities,
    loading,
    createSquad,
    selectSquad,
    inviteMember,
    leaveSquad,
    deleteSquad
  } = useSquads();
  
  const { friends } = useFriends();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCreateSquad = async (name: string, description?: string, emoji?: string) => {
    const { error } = await createSquad(name, description, emoji);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to create squad",
        variant: "destructive"
      });
      return { error };
    }
    toast({
      title: "Squad Created! ⚔️",
      description: `${name} is ready to train together`
    });
    return { error: null };
  };

  const handleInvite = async (friendUserId: string) => {
    if (!currentSquad) return;
    const { error } = await inviteMember(currentSquad.id, friendUserId);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to invite member",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Invited!",
        description: "Your friend has been added to the squad"
      });
      setShowInviteDialog(false);
    }
  };

  const handleLeave = async () => {
    if (!currentSquad) return;
    const { error } = await leaveSquad(currentSquad.id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to leave squad",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Left Squad",
        description: "You've left the squad"
      });
    }
    setShowLeaveConfirm(false);
  };

  const handleDelete = async () => {
    if (!currentSquad) return;
    const { error } = await deleteSquad(currentSquad.id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete squad",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Squad Deleted",
        description: "The squad has been deleted"
      });
    }
    setShowDeleteConfirm(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'session_complete': return '✅';
      case 'streak_milestone': return '🔥';
      case 'prayer': return '🙏';
      case 'worship': return '🎵';
      default: return '⚡';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show squad detail view
  if (currentSquad) {
    const availableFriends = friends.filter(
      f => !members.some(m => m.user_id === f.user_id)
    );

    return (
      <>
        <div className="space-y-4">
          {/* Squad Header */}
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentSquad.icon_emoji}</span>
                  <div>
                    <CardTitle className="text-lg">{currentSquad.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {members.length} members
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => selectSquad('')}
                >
                  Back
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {currentSquad.is_creator && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowInviteDialog(true)}
                    disabled={availableFriends.length === 0}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Invite
                  </Button>
                )}
                {currentSquad.is_creator ? (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowLeaveConfirm(true)}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Leave
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Members */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {members.map((member, i) => (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                        {i === 0 ? '👑' : member.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-sm flex items-center gap-1">
                          {member.name}
                          {member.role === 'admin' && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.total_sessions} sessions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500">
                      <Flame className="h-4 w-4" />
                      <span className="font-bold">{member.current_streak}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No activity yet. Start training!
                </p>
              ) : (
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {activities.map((activity) => (
                      <div 
                        key={activity.id}
                        className="flex items-start gap-2 p-2 text-sm"
                      >
                        <span>{getActivityIcon(activity.activity_type)}</span>
                        <div>
                          <p>
                            <span className="font-medium">{activity.user_name}</span>
                            {' '}
                            {activity.activity_type === 'session_complete' && 'completed a session'}
                            {activity.activity_type === 'streak_milestone' && 'hit a streak milestone'}
                            {activity.activity_type === 'prayer' && 'logged a prayer'}
                            {activity.activity_type === 'worship' && 'completed worship'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite to Squad</DialogTitle>
              <DialogDescription>
                Add a friend to {currentSquad.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {availableFriends.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  All your friends are already in this squad!
                </p>
              ) : (
                availableFriends.map((friend) => (
                  <Button
                    key={friend.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleInvite(friend.user_id)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {friend.name}
                  </Button>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Leave Confirm */}
        <AlertDialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Squad?</AlertDialogTitle>
              <AlertDialogDescription>
                You'll no longer see this squad's activity or participate in group challenges.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLeave}>Leave</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirm */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Squad?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the squad and remove all members.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Show squad list view
  return (
    <>
      <div className="space-y-4">
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="w-full"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Squad
        </Button>

        {squads.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No squads yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create a squad and invite your training partners!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {squads.map((squad) => (
              <Card 
                key={squad.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => selectSquad(squad.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{squad.icon_emoji}</span>
                      <div>
                        <h4 className="font-bold">{squad.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {squad.member_count} members
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {squad.is_creator && (
                        <Badge variant="secondary" className="text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          Creator
                        </Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateSquadDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateSquad}
      />
    </>
  );
}
