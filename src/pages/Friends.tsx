import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFriends } from '@/hooks/useFriends';
import { FriendsList } from '@/components/friends/FriendsList';
import { ChallengesList } from '@/components/friends/ChallengesList';
import { CreateChallengeDialog } from '@/components/friends/CreateChallengeDialog';
import { Leaderboard } from '@/components/friends/Leaderboard';
import { Users, Trophy, Swords, Copy, UserPlus, Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

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
    setSelectedFriend(friendId);
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
      selectedFriend,
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
            Squad
          </h1>
          <p className="text-muted-foreground mt-1">
            Iron sharpens iron. Train together.
          </p>
        </div>

        {/* Friend Code Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Your Friend Code
            </CardTitle>
            <CardDescription>Share this code for others to add you</CardDescription>
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
                placeholder="Enter friend's code"
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
                Friend Requests
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
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Friends</span>
              {friends.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {friends.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-1">
              <Swords className="h-4 w-4" />
              <span className="hidden sm:inline">Challenges</span>
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

          <TabsContent value="friends" className="mt-4">
            <FriendsList 
              friends={friends}
              loading={loading}
              onChallenge={handleStartChallenge}
              onRemove={removeFriend}
            />
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
            <Leaderboard friends={friends} />
          </TabsContent>
        </Tabs>

        <CreateChallengeDialog
          open={challengeDialogOpen}
          onOpenChange={setChallengeDialogOpen}
          onSubmit={handleCreateChallenge}
        />
      </div>
    </PageLayout>
  );
}
