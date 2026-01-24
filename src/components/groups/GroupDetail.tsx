import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Copy,
  Crown,
  Users,
  BookOpen,
  MessageSquare,
  Settings,
  Plus,
  CheckCircle2,
  Clock,
  Flame,
  BarChart3,
  Library
} from 'lucide-react';
import { toast } from 'sonner';
import {
  StudyGroup,
  GroupMember,
  StudyPlan,
  StudySession,
  Discussion,
  MemberProgress,
  GROUP_TYPES,
  READING_LEVELS
} from '@/hooks/useStudyGroups';
import { StudySessionCard } from './StudySessionCard';
import { CreateStudyPlanDialog } from './CreateStudyPlanDialog';
import { MemberSettingsDialog } from './MemberSettingsDialog';
import { GroupSettingsDialog } from './GroupSettingsDialog';
import { LeaderDashboard } from './LeaderDashboard';
import { PassageLibrary } from './PassageLibrary';
import { useAuth } from '@/hooks/useAuth';

interface GroupDetailProps {
  group: StudyGroup;
  members: GroupMember[];
  studyPlans: StudyPlan[];
  currentSession: StudySession | null;
  sessions: StudySession[];
  discussions: Discussion[];
  memberProgress?: MemberProgress[];
  onBack: () => void;
  onCreatePlan: (
    groupId: string,
    planName: string,
    book: string,
    chapterStart: number,
    chapterEnd: number,
    frequency?: string,
    studyDay?: string
  ) => Promise<{ error: Error | null }>;
  onCreateSession: (
    groupId: string,
    book: string,
    chapter: number,
    title?: string,
    planId?: string
  ) => Promise<{ error: Error | null }>;
  onCompleteSession: (
    sessionId: string,
    groupId: string,
    readingLevel: string,
    reflectionText?: string,
    questionsForGroup?: string,
    timeSpentMinutes?: number
  ) => Promise<{ error: Error | null }>;
  onPostDiscussion: (
    sessionId: string,
    message: string,
    messageType?: string,
    parentId?: string
  ) => Promise<{ error: Error | null }>;
  onFetchDiscussions: (sessionId: string) => Promise<void>;
  onUpdateSettings: (
    groupId: string,
    ageGroup: string,
    readingLevel: string,
    displayName?: string
  ) => Promise<{ error: Error | null }>;
  onLeave: (groupId: string) => Promise<{ error: Error | null }>;
  onDelete: (groupId: string) => Promise<{ error: Error | null }>;
  onApproveSubmission?: (progressId: string) => Promise<void>;
}

export function GroupDetail({
  group,
  members,
  studyPlans,
  currentSession,
  sessions,
  discussions,
  memberProgress = [],
  onBack,
  onCreatePlan,
  onCreateSession,
  onCompleteSession,
  onPostDiscussion,
  onFetchDiscussions,
  onUpdateSettings,
  onLeave,
  onDelete,
  onApproveSubmission
}: GroupDetailProps) {
  const { user } = useAuth();
  const [createPlanOpen, setCreatePlanOpen] = useState(false);
  const [memberSettingsOpen, setMemberSettingsOpen] = useState(false);
  const [groupSettingsOpen, setGroupSettingsOpen] = useState(false);

  const typeInfo = GROUP_TYPES.find(t => t.value === group.group_type) || GROUP_TYPES[5];
  const currentMember = members.find(m => m.user_id === user?.id);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(group.group_code);
    toast.success('Squad code copied!');
  };

  const completedCount = currentSession?.completed_by?.length || 0;
  const totalMembers = members.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{group.group_avatar_emoji}</span>
            <h1 className="font-display text-2xl uppercase tracking-wider truncate">
              {group.group_name}
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{typeInfo.label}</Badge>
            <span className="text-sm text-muted-foreground">
              {members.length} members
            </span>
          </div>
        </div>
        {group.is_leader && (
          <Button variant="ghost" size="icon" onClick={() => setGroupSettingsOpen(true)}>
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Squad Code Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Squad Code</p>
              <p className="text-xl font-mono font-bold tracking-wider">{group.group_code}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyCode}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="study" className="w-full">
        <TabsList className={`grid w-full ${group.is_leader ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="study" className="text-xs sm:text-sm">
            <BookOpen className="h-4 w-4 mr-1" />
            Study
          </TabsTrigger>
          <TabsTrigger value="members" className="text-xs sm:text-sm">
            <Users className="h-4 w-4 mr-1" />
            Members
          </TabsTrigger>
          <TabsTrigger value="discuss" className="text-xs sm:text-sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            Discuss
          </TabsTrigger>
          {group.is_leader && (
            <TabsTrigger value="leader" className="text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4 mr-1" />
              Lead
            </TabsTrigger>
          )}
        </TabsList>

        {/* Study Tab */}
        <TabsContent value="study" className="space-y-6 mt-4">
          {/* Current Session */}
          {currentSession ? (
            <StudySessionCard
              session={currentSession}
              groupId={group.id}
              readingLevel={currentMember?.reading_level || 'adult'}
              completedCount={completedCount}
              totalMembers={totalMembers}
              isCompleted={currentSession.completed_by?.includes(user?.id || '')}
              onComplete={onCompleteSession}
            />
          ) : (
            <Card className="border-2 border-dashed border-muted-foreground/20">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Active Study</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {group.is_leader
                    ? 'Create a study plan or pick a passage from the library below'
                    : 'Waiting for the leader to create a study session. Browse the library below to self-study!'}
                </p>
                {group.is_leader && (
                  <Button onClick={() => setCreatePlanOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Study Plan
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Study Plans */}
          {studyPlans.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Study Plans
              </h3>
              {studyPlans.map(plan => (
                <Card key={plan.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{plan.plan_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {plan.book} {plan.chapter_start}-{plan.chapter_end} • {plan.frequency}
                        </p>
                      </div>
                      <Badge variant="outline">
                        Ch. {plan.current_chapter}/{plan.chapter_end}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Passage Library - Multi-Level Bible Content */}
          <div className="pt-4 border-t">
            <h3 className="font-display text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
              <Library className="h-5 w-5 text-primary" />
              Family Bible Library
            </h3>
            <PassageLibrary
              groupId={group.id}
              userReadingLevel={currentMember?.reading_level || 'adult'}
              isLeader={group.is_leader || false}
              onCreateSession={group.is_leader ? onCreateSession : undefined}
              completedPassageIds={[]}
            />
          </div>

          {/* Recent Sessions */}
          {sessions.length > 1 && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold">Past Sessions</h3>
              {sessions.slice(1).map(session => (
                <Card key={session.id} className="bg-muted/30">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{session.book} {session.chapter}</p>
                      <p className="text-xs text-muted-foreground">{session.session_date}</p>
                    </div>
                    <Badge variant={session.completed_by?.includes(user?.id || '') ? 'default' : 'outline'}>
                      {session.completed_by?.includes(user?.id || '') ? 'Completed' : 'Missed'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {group.is_leader && studyPlans.length === 0 && (
            <Button
              onClick={() => setCreatePlanOpen(true)}
              variant="outline"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Study Plan
            </Button>
          )}
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Members ({members.length})</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMemberSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              My Settings
            </Button>
          </div>

          <div className="space-y-3">
            {members.map(member => {
              const levelInfo = READING_LEVELS.find(l => l.value === member.reading_level);
              return (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {member.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{member.name}</span>
                          {member.role === 'leader' && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                          {member.user_id === user?.id && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {levelInfo?.label.split(' ')[0] || member.reading_level}
                          </Badge>
                          {member.current_streak > 0 && (
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              {member.current_streak} day streak
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Discussion Tab */}
        <TabsContent value="discuss" className="space-y-4 mt-4">
          {currentSession ? (
            <DiscussionBoard
              session={currentSession}
              discussions={discussions}
              onPost={onPostDiscussion}
              onFetch={onFetchDiscussions}
            />
          ) : (
            <Card className="border-2 border-dashed border-muted-foreground/20">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Start a study session to begin discussions
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Leader Dashboard Tab */}
        {group.is_leader && (
          <TabsContent value="leader" className="mt-4">
            <LeaderDashboard
              groupId={group.id}
              members={members}
              sessions={sessions}
              memberProgress={memberProgress}
              onApproveSubmission={onApproveSubmission}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Dialogs */}
      <CreateStudyPlanDialog
        open={createPlanOpen}
        onOpenChange={setCreatePlanOpen}
        groupId={group.id}
        onSubmit={onCreatePlan}
      />
      <MemberSettingsDialog
        open={memberSettingsOpen}
        onOpenChange={setMemberSettingsOpen}
        groupId={group.id}
        currentMember={currentMember}
        onSubmit={onUpdateSettings}
      />
      <GroupSettingsDialog
        open={groupSettingsOpen}
        onOpenChange={setGroupSettingsOpen}
        group={group}
        onLeave={onLeave}
        onDelete={onDelete}
      />
    </div>
  );
}

// Discussion Board Component
function DiscussionBoard({
  session,
  discussions,
  onPost,
  onFetch
}: {
  session: StudySession;
  discussions: Discussion[];
  onPost: (sessionId: string, message: string, type?: string) => Promise<{ error: Error | null }>;
  onFetch: (sessionId: string) => Promise<void>;
}) {
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!message.trim()) return;

    setPosting(true);
    const { error } = await onPost(session.id, message.trim());
    if (error) {
      toast.error(error.message);
    } else {
      setMessage('');
      await onFetch(session.id);
    }
    setPosting(false);
  };

  // Fetch discussions on mount
  useState(() => {
    onFetch(session.id);
  });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">
        Discussion: {session.book} {session.chapter}
      </h3>

      {/* Messages */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {discussions.length === 0 ? (
          <Card className="bg-muted/30">
            <CardContent className="p-4 text-center text-muted-foreground">
              No messages yet. Start the conversation!
            </CardContent>
          </Card>
        ) : (
          discussions.map(d => (
            <Card key={d.id}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                    {d.user_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{d.user_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(d.posted_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{d.message_text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share a thought or question..."
          className="flex-1 px-4 py-2 rounded-lg border bg-background"
          onKeyPress={(e) => e.key === 'Enter' && handlePost()}
        />
        <Button onClick={handlePost} disabled={posting || !message.trim()}>
          Post
        </Button>
      </div>
    </div>
  );
}
