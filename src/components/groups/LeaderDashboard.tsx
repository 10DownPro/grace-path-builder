import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Calendar,
  MessageSquare,
  Shield,
  ChevronRight
} from 'lucide-react';
import { GroupMember, StudySession, MemberProgress } from '@/hooks/useStudyGroups';

interface LeaderDashboardProps {
  groupId: string;
  members: GroupMember[];
  sessions: StudySession[];
  memberProgress: MemberProgress[];
  onApproveSubmission?: (progressId: string) => Promise<void>;
  onScheduleDiscussion?: (sessionId: string, time: Date) => Promise<void>;
}

export function LeaderDashboard({
  groupId,
  members,
  sessions,
  memberProgress,
  onApproveSubmission,
  onScheduleDiscussion
}: LeaderDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Calculate stats
  const totalMembers = members.length;
  const currentSession = sessions[0];
  const completedThisSession = currentSession?.completed_by?.length || 0;
  const completionRate = totalMembers > 0 ? Math.round((completedThisSession / totalMembers) * 100) : 0;

  // Calculate average completion across all sessions
  const avgCompletion = sessions.length > 0
    ? Math.round(sessions.reduce((acc, s) => {
        const completed = s.completed_by?.length || 0;
        return acc + (totalMembers > 0 ? (completed / totalMembers) * 100 : 0);
      }, 0) / sessions.length)
    : 0;

  // Get pending approvals (child submissions needing review)
  const pendingApprovals = memberProgress.filter(p => !p.is_approved);

  // Group members by reading level for chart
  const levelDistribution = members.reduce((acc, m) => {
    const level = m.reading_level || 'adult';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const levelColors: Record<string, string> = {
    picture: 'bg-pink-500',
    early_reader: 'bg-yellow-500',
    intermediate: 'bg-green-500',
    advanced: 'bg-blue-500',
    young_adult: 'bg-purple-500',
    adult: 'bg-indigo-500',
    scholarly: 'bg-gray-500'
  };

  const levelLabels: Record<string, string> = {
    picture: 'Picture (3-6)',
    early_reader: 'Early (7-10)',
    intermediate: 'Intermediate (11-13)',
    advanced: 'Advanced (14-17)',
    young_adult: 'Young Adult (18-25)',
    adult: 'Adult (26+)',
    scholarly: 'Scholarly'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display uppercase tracking-wider flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Leader Dashboard
        </h2>
        {pendingApprovals.length > 0 && (
          <Badge variant="destructive">
            {pendingApprovals.length} Pending
          </Badge>
        )}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary">{totalMembers}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="h-4 w-4" />
                  Members
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-500">{completionRate}%</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  This Session
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-500">{avgCompletion}%</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Avg Completion
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-orange-500">{sessions.length}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Sessions
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reading Level Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Reading Level Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(levelDistribution).map(([level, count]) => (
                <div key={level} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{levelLabels[level] || level}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={`h-full ${levelColors[level] || 'bg-gray-500'}`}
                      style={{ width: `${(count / totalMembers) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Current Session Progress */}
          {currentSession && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Current Session Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium mb-2">
                  {currentSession.book} {currentSession.chapter}
                </div>
                <Progress value={completionRate} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{completedThisSession} of {totalMembers} completed</span>
                  <span>{completionRate}%</span>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-3 mt-4">
          {members.map(member => {
            const memberSessions = memberProgress.filter(p => p.user_id === member.user_id);
            const memberCompletionRate = sessions.length > 0
              ? Math.round((memberSessions.length / sessions.length) * 100)
              : 0;

            return (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                      {member.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{member.name}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {levelLabels[member.reading_level] || member.reading_level}
                        </Badge>
                        {member.current_streak && member.current_streak > 0 && (
                          <span className="text-orange-500">🔥 {member.current_streak}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{memberCompletionRate}%</div>
                      <div className="text-xs text-muted-foreground">completion</div>
                    </div>
                  </div>
                  <Progress value={memberCompletionRate} className="h-1 mt-3" />
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-3 mt-4">
          {pendingApprovals.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending approvals</p>
                <p className="text-sm">All submissions have been reviewed</p>
              </CardContent>
            </Card>
          ) : (
            pendingApprovals.map(progress => (
              <Card key={progress.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium">{progress.user_name || 'Member'}</div>
                      <div className="text-sm text-muted-foreground">
                        {progress.reading_level} level • {progress.time_spent_minutes} min
                      </div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  
                  {progress.reflection_text && (
                    <div className="bg-muted/50 rounded-lg p-3 text-sm mb-3">
                      <div className="font-medium text-xs text-muted-foreground mb-1">Reflection:</div>
                      {progress.reflection_text}
                    </div>
                  )}
                  
                  {progress.questions_for_group && (
                    <div className="bg-blue-500/10 rounded-lg p-3 text-sm mb-3">
                      <div className="font-medium text-xs text-blue-500 mb-1">Question for Group:</div>
                      {progress.questions_for_group}
                    </div>
                  )}

                  {onApproveSubmission && (
                    <Button 
                      onClick={() => onApproveSubmission(progress.id)}
                      className="w-full"
                      size="sm"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve Submission
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
