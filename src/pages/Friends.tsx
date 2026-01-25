import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFriends } from '@/hooks/useFriends';
import { useEncouragements } from '@/hooks/useEncouragements';
import { useStudyGroups } from '@/hooks/useStudyGroups';
import { FriendsList } from '@/components/friends/FriendsList';
import { ChallengesList } from '@/components/friends/ChallengesList';
import { CreateChallengeDialog } from '@/components/friends/CreateChallengeDialog';
import { Leaderboard } from '@/components/friends/Leaderboard';
import { MyStatsCard } from '@/components/friends/MyStatsCard';
import { GroupsList } from '@/components/groups/GroupsList';
import { GroupDetail } from '@/components/groups/GroupDetail';
import { CreateGroupDialog } from '@/components/groups/CreateGroupDialog';
import { JoinGroupDialog } from '@/components/groups/JoinGroupDialog';
import { Users, Trophy, Swords, Copy, UserPlus, Crown, BookOpen, Info, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const INSTRUCTIONS_DISMISSED_KEY = 'squad-instructions-dismissed';

export default function Friends() {
  const { 
    friends, 
    pendingRequests, 
    challenges, 
    myFriendCode, 
    loading,
    sendFriendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
    createChallenge,
    acceptChallenge,
    declineChallenge
  } = useFriends();

  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<{ id: string; name: string } | null>(null);
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [joinGroupDialogOpen, setJoinGroupDialogOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(() => {
    return localStorage.getItem(INSTRUCTIONS_DISMISSED_KEY) !== 'true';
  });
  const { unreadCount } = useEncouragements();

  const dismissInstructions = () => {
    setShowInstructions(false);
    localStorage.setItem(INSTRUCTIONS_DISMISSED_KEY, 'true');
  };
  
  const {
    groups,
    currentGroup,
    members,
    studyPlans,
    currentSession,
    sessions,
    discussions,
    loading: groupsLoading,
    createGroup,
    joinGroupByCode,
    selectGroup,
    createStudyPlan,
    createSession,
    completeSession,
    postDiscussion,
    fetchDiscussions,
    updateMemberSettings,
    leaveGroup,
    deleteGroup,
  } = useStudyGroups();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(myFriendCode);
    toast({
      title: "Copied!",
      description: "Your friend code has been copied to clipboard"
    });
  };

  const handleAddFriend = async () => {
    if (!friendCodeInput.trim()) return;
    
    setIsAddingFriend(true);
    const { data, error } = await sendFriendRequest(friendCodeInput.trim());
    setIsAddingFriend(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Request Sent!",
        description: `Friend request sent to ${data?.name || 'user'}`
      });
      setFriendCodeInput('');
    }
  };

  const handleStartChallenge = (friendId: string) => {
    const friend = friends.find(f => f.user_id === friendId);
    setSelectedFriend({ id: friendId, name: friend?.name || 'Friend' });
    setChallengeDialogOpen(true);
  };

  const handleCreateChallenge = async (
    challengeType: string,
    challengeName: string,
    targetValue: number,
    durationDays: number,
    description?: string
  ) => {
    if (!selectedFriend) return;
    
    const { error } = await createChallenge(
      selectedFriend.id,
      challengeType,
      challengeName,
      targetValue,
      durationDays,
      description
    );

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create challenge",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Challenge Created!",
        description: "Your challenge has been sent"
      });
      setChallengeDialogOpen(false);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Training Squad
          </h1>
          <p className="text-muted-foreground mt-1">
            Iron sharpens iron. Train together.
          </p>
        </div>

        {/* How This Works - Dismissable Instructions Banner */}
        {showInstructions && (
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-primary uppercase tracking-wide">How This Works</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 -mr-2 -mt-1"
                      onClick={dismissInstructions}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span><strong>Partners:</strong> Add 1-on-1 friends</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-primary" />
                      <span><strong>Squads:</strong> Group Bible study</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Swords className="h-3.5 w-3.5 text-primary" />
                      <span><strong>Battles:</strong> Challenge friends</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-primary" />
                      <span><strong>Ranks:</strong> Squad leaderboard</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                    Share your <strong>Squad Code</strong> below to connect. Check <Link to="/progress" className="text-primary underline font-medium">Your Stats</Link> for personal progress.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Training Partner Code Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Your Squad Code
            </CardTitle>
            <CardDescription>Share this code for training partners to join you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono text-xl text-center tracking-widest font-bold">
                {myFriendCode || '--------'}
              </div>
              <Button variant="outline" size="icon" onClick={handleCopyCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter partner's code"
                value={friendCodeInput}
                onChange={(e) => setFriendCodeInput(e.target.value.toUpperCase())}
                className="font-mono tracking-wider uppercase"
                maxLength={8}
              />
              <Button 
                onClick={handleAddFriend} 
                disabled={isAddingFriend || !friendCodeInput.trim()}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Badge variant="secondary" className="bg-orange-500 text-white">
                  {pendingRequests.length}
                </Badge>
                Training Partner Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{request.requester_name}</p>
                      <p className="text-sm text-muted-foreground font-mono">{request.requester_friend_code}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => acceptRequest(request.id)}>
                        Accept
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => declineRequest(request.id)}>
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="partners" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="partners" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Partners</span>
              {friends.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {friends.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="squads" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Squads</span>
              {groups.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {groups.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-1">
              <Swords className="h-4 w-4" />
              <span className="hidden sm:inline">Battles</span>
              {challenges.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {challenges.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Ranks</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="partners" className="mt-4">
            <FriendsList 
              friends={friends}
              loading={loading}
              onChallenge={handleStartChallenge}
              onRemove={removeFriend}
            />
          </TabsContent>

          <TabsContent value="squads" className="mt-4">
            {currentGroup ? (
              <GroupDetail
                group={currentGroup}
                members={members}
                studyPlans={studyPlans}
                currentSession={currentSession}
                sessions={sessions}
                discussions={discussions}
                onBack={() => selectGroup('')}
                onCreatePlan={createStudyPlan}
                onCreateSession={createSession}
                onCompleteSession={completeSession}
                onPostDiscussion={postDiscussion}
                onFetchDiscussions={fetchDiscussions}
                onUpdateSettings={updateMemberSettings}
                onLeave={leaveGroup}
                onDelete={deleteGroup}
              />
            ) : (
              <div className="space-y-4">
                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button onClick={() => setCreateGroupDialogOpen(true)} className="flex-1">
                    <Users className="h-4 w-4 mr-2" />
                    Create Squad
                  </Button>
                  <Button variant="outline" onClick={() => setJoinGroupDialogOpen(true)} className="flex-1">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Squad
                  </Button>
                </div>

                {/* Training Squads List */}
                {groupsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="h-12 bg-muted rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : groups.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <h3 className="font-semibold mb-1">No Training Squads Yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Create or join a training squad for Bible study, accountability, and prayer support.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <GroupsList groups={groups} onSelectGroup={selectGroup} />
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="challenges" className="mt-4">
            <ChallengesList 
              challenges={challenges}
              loading={loading}
              onAccept={acceptChallenge}
              onDecline={declineChallenge}
            />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-4">
            <MyStatsCard friends={friends} />
            <Leaderboard friends={friends} />
          </TabsContent>
        </Tabs>

        <CreateChallengeDialog
          open={challengeDialogOpen}
          onOpenChange={setChallengeDialogOpen}
          onSubmit={handleCreateChallenge}
        />

        <CreateGroupDialog
          open={createGroupDialogOpen}
          onOpenChange={setCreateGroupDialogOpen}
          onSubmit={createGroup}
        />

        <JoinGroupDialog
          open={joinGroupDialogOpen}
          onOpenChange={setJoinGroupDialogOpen}
          onSubmit={joinGroupByCode}
        />
      </div>
    </PageLayout>
  );
}
