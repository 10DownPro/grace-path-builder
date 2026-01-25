import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Settings, 
  Users, 
  UserPlus, 
  PenLine, 
  Target, 
  Music, 
  BookMarked,
  ChevronRight,
  Crown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useFollows } from '@/hooks/useFollows';
import { usePremium } from '@/hooks/usePremium';
import { FollowButton } from '@/components/social/FollowButton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Profile() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { following, followers, loading } = useFollows();
  const { isPremium } = usePremium();
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');

  const actionButtons = [
    {
      icon: PenLine,
      label: 'Reflections',
      description: 'Your journal entries',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      onClick: () => navigate('/prayer')
    },
    {
      icon: Target,
      label: 'Challenges',
      description: 'Personal goals',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      onClick: () => navigate('/friends?tab=challenges')
    },
    {
      icon: Music,
      label: 'Music',
      description: 'Worship playlists',
      color: 'text-success',
      bgColor: 'bg-success/10',
      onClick: () => navigate('/session')
    },
    {
      icon: BookMarked,
      label: 'Saved Verses',
      description: 'Your armory',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      onClick: () => navigate('/battles')
    },
  ];

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  return (
    <PageLayout>
      <div className="px-4 pt-6 pb-6 space-y-6">
        {/* Header with Settings */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                  {getInitials(profile?.name || '')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {profile?.name || 'Warrior'}
                  </h2>
                  {isPremium && (
                    <Crown className="h-5 w-5 text-warning" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {profile?.commitment || 'Committed'} • Training Daily
                </p>
              </div>
            </div>

            {/* Follower/Following Counts */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => setActiveTab('followers')}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-center",
                  activeTab === 'followers'
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <p className="text-3xl font-bold text-foreground">{followers.length}</p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="h-4 w-4" />
                  Followers
                </p>
              </button>
              <button
                onClick={() => setActiveTab('following')}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-center",
                  activeTab === 'following'
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <p className="text-3xl font-bold text-foreground">{following.length}</p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Following
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-3">
          {actionButtons.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="gym-card p-4 flex flex-col items-center gap-2 hover:border-primary/50 transition-all group"
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                action.bgColor
              )}>
                <action.icon className={cn("h-6 w-6", action.color)} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Followers/Following List */}
        <Card className="border-border">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'followers' | 'following')}>
              <TabsList className="w-full grid grid-cols-2 rounded-none border-b border-border">
                <TabsTrigger value="followers" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Followers ({followers.length})
                </TabsTrigger>
                <TabsTrigger value="following" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Following ({following.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="followers" className="m-0">
                <ScrollArea className="h-[250px]">
                  {loading ? (
                    <div className="p-4 space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                          <div className="w-10 h-10 rounded-full bg-muted" />
                          <div className="flex-1 h-4 bg-muted rounded" />
                        </div>
                      ))}
                    </div>
                  ) : followers.length === 0 ? (
                    <div className="p-8 text-center">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">No followers yet</p>
                      <p className="text-sm text-muted-foreground">Share your journey to connect!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {followers.map((user) => (
                        <div key={user.user_id} className="flex items-center gap-3 p-4 hover:bg-muted/50">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/20 text-primary font-bold">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{user.name}</p>
                          </div>
                          <FollowButton userId={user.user_id} userName={user.name} size="sm" />
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="following" className="m-0">
                <ScrollArea className="h-[250px]">
                  {loading ? (
                    <div className="p-4 space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                          <div className="w-10 h-10 rounded-full bg-muted" />
                          <div className="flex-1 h-4 bg-muted rounded" />
                        </div>
                      ))}
                    </div>
                  ) : following.length === 0 ? (
                    <div className="p-8 text-center">
                      <UserPlus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">Not following anyone</p>
                      <p className="text-sm text-muted-foreground">Find training partners in the Feed!</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => navigate('/feed')}
                      >
                        Explore Feed
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {following.map((user) => (
                        <div key={user.user_id} className="flex items-center gap-3 p-4 hover:bg-muted/50">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/20 text-primary font-bold">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{user.name}</p>
                          </div>
                          <FollowButton userId={user.user_id} userName={user.name} size="sm" />
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
