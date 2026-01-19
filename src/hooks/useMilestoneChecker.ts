import { useCallback } from 'react';
import { useMilestones, Milestone } from './useMilestones';
import { useUserProgress } from './useUserProgress';
import { useSessions } from './useSessions';
import { usePrayers } from './usePrayers';
import { toast } from 'sonner';

export function useMilestoneChecker() {
  const { milestones, userMilestones, awardMilestone, isMilestoneAchieved, refetch } = useMilestones();
  const { progress } = useUserProgress();
  const { sessions } = useSessions();
  const { prayers } = usePrayers();

  const checkAndAwardMilestones = useCallback(async () => {
    if (!progress || milestones.length === 0) return;

    const newlyAwarded: Milestone[] = [];

    for (const milestone of milestones) {
      // Skip already achieved milestones
      if (isMilestoneAchieved(milestone.id)) continue;

      let shouldAward = false;

      switch (milestone.requirement_type) {
        case 'consecutive_days':
          // Check current streak against requirement
          shouldAward = progress.current_streak >= milestone.requirement_value;
          break;

        case 'total_sessions':
          // Check total sessions completed
          shouldAward = progress.total_sessions >= milestone.requirement_value;
          break;

        case 'total_minutes':
          // Check total minutes spent in sessions
          shouldAward = progress.total_minutes >= milestone.requirement_value;
          break;

        case 'total_prayers':
          // Check total prayers created
          shouldAward = prayers.length >= milestone.requirement_value;
          break;

        case 'answered_prayers':
          // Check answered prayers count
          const answeredCount = prayers.filter(p => p.answered).length;
          shouldAward = answeredCount >= milestone.requirement_value;
          break;

        case 'total_verses':
          // Check total verses read across all sessions
          const totalVerses = sessions.reduce((sum, s) => sum + (s.verses_read || 0), 0);
          shouldAward = totalVerses >= milestone.requirement_value;
          break;

        case 'longest_streak':
          // Check longest streak ever
          shouldAward = progress.longest_streak >= milestone.requirement_value;
          break;

        default:
          break;
      }

      if (shouldAward) {
        const result = await awardMilestone(milestone.id);
        if (!result.error && !result.alreadyAchieved) {
          newlyAwarded.push(milestone);
        }
      }
    }

    // Show celebration toasts for newly awarded milestones
    for (const milestone of newlyAwarded) {
      toast.success(
        `${milestone.icon_emoji} ${milestone.name} Unlocked!`,
        {
          description: milestone.reward_message || milestone.description,
          duration: 5000,
        }
      );
    }

    if (newlyAwarded.length > 0) {
      refetch();
    }

    return newlyAwarded;
  }, [milestones, progress, sessions, prayers, isMilestoneAchieved, awardMilestone, refetch]);

  return {
    checkAndAwardMilestones
  };
}
