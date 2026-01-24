import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Button } from '@/components/ui/button';
import { Copy, LogOut, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { StudyGroup } from '@/hooks/useStudyGroups';

interface GroupSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: StudyGroup;
  onLeave: (groupId: string) => Promise<{ error: Error | null }>;
  onDelete: (groupId: string) => Promise<{ error: Error | null }>;
}

export function GroupSettingsDialog({
  open,
  onOpenChange,
  group,
  onLeave,
  onDelete
}: GroupSettingsDialogProps) {
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(group.group_code);
    toast.success('Group code copied!');
  };

  const handleLeave = async () => {
    const { error } = await onLeave(group.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('You have left the group');
      onOpenChange(false);
    }
  };

  const handleDelete = async () => {
    const { error } = await onDelete(group.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Group deleted');
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Group Settings
            </DialogTitle>
            <DialogDescription>
              Manage your group settings and membership.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Group Info */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Group Name</p>
                <p className="font-medium">{group.group_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invite Code</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold text-lg">{group.group_code}</p>
                  <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="font-medium">{group.member_count || 0} / {group.max_members}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {!group.is_creator && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => setLeaveConfirmOpen(true)}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Group
                </Button>
              )}

              {group.is_creator && (
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => setDeleteConfirmOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Group
                </Button>
              )}
            </div>
          </div>

          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Leave Confirmation */}
      <AlertDialog open={leaveConfirmOpen} onOpenChange={setLeaveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Group?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave "{group.group_name}"? You'll need the group code to rejoin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeave}>Leave Group</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{group.group_name}" and all its study plans, sessions, and discussions. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
