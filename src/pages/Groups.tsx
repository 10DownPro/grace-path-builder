import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, BookOpen, MessageSquare } from 'lucide-react';
import { useStudyGroups, GROUP_TYPES } from '@/hooks/useStudyGroups';
import { GroupsList } from '@/components/groups/GroupsList';
import { GroupDetail } from '@/components/groups/GroupDetail';
import { CreateGroupDialog } from '@/components/groups/CreateGroupDialog';
import { JoinGroupDialog } from '@/components/groups/JoinGroupDialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function Groups() {
  const {
    groups,
    currentGroup,
    members,
    studyPlans,
    currentSession,
    sessions,
    discussions,
    loading,
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
    deleteGroup
  } = useStudyGroups();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  if (loading) {
    return (
      <PageLayout>
        <div className="space-y-4">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </PageLayout>
    );
  }

  // If a group is selected, show the group detail view
  if (currentGroup) {
    return (
      <PageLayout>
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
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl uppercase tracking-wider text-foreground">
            Bible Study Groups
          </h1>
          <p className="text-muted-foreground">
            Study together at every level
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Group
          </Button>
          <Button
            variant="outline"
            onClick={() => setJoinDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Join Group
          </Button>
        </div>

        {/* Group Types Info */}
        {groups.length === 0 && (
          <Card className="border-2 border-dashed border-muted-foreground/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Study Together
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create or join a group to study Scripture with family, friends, or your community.
                Each member can read at their own level while studying the same passages together.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {GROUP_TYPES.slice(0, 4).map(type => (
                  <div key={type.value} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{type.emoji}</span>
                    <span className="font-medium">{type.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Groups List */}
        {groups.length > 0 && (
          <GroupsList
            groups={groups}
            onSelectGroup={selectGroup}
          />
        )}

        {/* Dialogs */}
        <CreateGroupDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSubmit={createGroup}
        />
        <JoinGroupDialog
          open={joinDialogOpen}
          onOpenChange={setJoinDialogOpen}
          onSubmit={joinGroupByCode}
        />
      </div>
    </PageLayout>
  );
}
