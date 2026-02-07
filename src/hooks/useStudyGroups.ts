import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface StudyGroup {
  id: string;
  group_name: string;
  group_type: string;
  description: string | null;
  created_by: string;
  group_code: string;
  is_public: boolean;
  max_members: number;
  group_avatar_emoji: string;
  is_active: boolean;
  created_at: string;
  member_count?: number;
  is_creator?: boolean;
  is_leader?: boolean;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  age_group: string;
  reading_level: string;
  display_name: string | null;
  is_active: boolean;
  joined_at: string;
  name?: string;
  current_streak?: number;
}

export interface StudyPlan {
  id: string;
  group_id: string;
  plan_name: string;
  plan_type: string;
  book: string;
  chapter_start: number;
  chapter_end: number;
  current_chapter: number;
  frequency: string;
  study_day: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

export interface StudySession {
  id: string;
  group_id: string;
  plan_id: string | null;
  book: string;
  chapter: number;
  session_title: string | null;
  session_date: string;
  discussion_time: string | null;
  leader_notes: string | null;
  completed_by: unknown[];
  discussed: boolean;
  created_at: string;
}

export interface MemberProgress {
  id: string;
  group_id: string;
  user_id: string;
  session_id: string;
  reading_level: string;
  completed_at: string;
  time_spent_minutes: number;
  reflection_text: string | null;
  discussion_notes: string | null;
  questions_for_group: string | null;
  is_approved: boolean;
  user_name?: string;
}

export interface Discussion {
  id: string;
  session_id: string;
  user_id: string;
  message_text: string;
  message_type: string;
  parent_message_id: string | null;
  is_pinned: boolean;
  reactions: Record<string, number>;
  posted_at: string;
  user_name?: string;
}

export const READING_LEVELS = [
  { value: 'picture', label: 'Picture Book (Ages 3-6)', ageGroup: 'early_childhood' },
  { value: 'early_reader', label: 'Early Reader (Ages 7-10)', ageGroup: 'elementary' },
  { value: 'intermediate', label: 'Intermediate (Ages 11-13)', ageGroup: 'middle_school' },
  { value: 'advanced', label: 'Advanced (Ages 14-17)', ageGroup: 'teen' },
  { value: 'adult', label: 'Adult (Ages 18+)', ageGroup: 'adult' },
] as const;

export const GROUP_TYPES = [
  { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', description: 'Parents and children studying together' },
  { value: 'friends', label: 'Friends', emoji: '🤝', description: 'Peers studying together' },
  { value: 'small_group', label: 'Small Group', emoji: '⛪', description: 'Church-based mixed ages' },
  { value: 'youth', label: 'Youth Group', emoji: '🎓', description: 'Teens and young adults' },
  { value: 'couples', label: 'Couples', emoji: '💑', description: 'Married or dating couples' },
  { value: 'custom', label: 'Custom', emoji: '📖', description: 'Any combination' },
] as const;

export const AGE_GROUPS = [
  { value: 'early_childhood', label: 'Early Childhood (3-6)', defaultLevel: 'picture' },
  { value: 'elementary', label: 'Elementary (7-10)', defaultLevel: 'early_reader' },
  { value: 'middle_school', label: 'Middle School (11-13)', defaultLevel: 'intermediate' },
  { value: 'teen', label: 'Teen (14-17)', defaultLevel: 'advanced' },
  { value: 'young_adult', label: 'Young Adult (18-25)', defaultLevel: 'adult' },
  { value: 'adult', label: 'Adult (26-64)', defaultLevel: 'adult' },
  { value: 'senior', label: 'Senior (65+)', defaultLevel: 'adult' },
] as const;

export function useStudyGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [currentGroup, setCurrentGroup] = useState<StudyGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [memberProgress, setMemberProgress] = useState<MemberProgress[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
    if (!user) return;
    setLoading(true);

    // Get groups where user is a member
    const { data: memberData } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', user.id)
      .eq('is_active', true);

    const memberGroupIds = memberData?.map(m => m.group_id) || [];

    // Get groups created by user
    const { data: createdGroups } = await supabase
      .from('study_groups')
      .select('*')
      .eq('created_by', user.id)
      .eq('is_active', true);

    const allGroupIds = [...new Set([...memberGroupIds, ...(createdGroups?.map(g => g.id) || [])])];

    if (allGroupIds.length > 0) {
      const { data: groupData } = await supabase
        .from('study_groups')
        .select('*')
        .in('id', allGroupIds)
        .eq('is_active', true);

      if (groupData) {
        // Get member counts
        const { data: counts } = await supabase
          .from('group_members')
          .select('group_id')
          .in('group_id', allGroupIds)
          .eq('is_active', true);

        // Get user roles
        const { data: roles } = await supabase
          .from('group_members')
          .select('group_id, role')
          .eq('user_id', user.id)
          .in('group_id', allGroupIds);

        const countMap = new Map<string, number>();
        counts?.forEach(c => {
          countMap.set(c.group_id, (countMap.get(c.group_id) || 0) + 1);
        });

        const roleMap = new Map(roles?.map(r => [r.group_id, r.role]) || []);

        const enriched = groupData.map(g => ({
          ...g,
          member_count: countMap.get(g.id) || 0,
          is_creator: g.created_by === user.id,
          is_leader: g.created_by === user.id || roleMap.get(g.id) === 'leader' || roleMap.get(g.id) === 'co_leader'
        }));

        setGroups(enriched);
      }
    } else {
      setGroups([]);
    }

    setLoading(false);
  };

  const createGroup = async (
    name: string,
    groupType: string,
    description?: string,
    emoji: string = '📖'
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Use the security definer function to create group and add creator as leader
    const { data: groupId, error } = await supabase
      .rpc('create_study_group', {
        _group_name: name,
        _group_type: groupType,
        _description: description || null,
        _group_avatar_emoji: emoji
      });

    if (!error && groupId) {
      await fetchGroups();
    }

    return { data: groupId ? { id: groupId } : null, error };
  };

  const joinGroupByCode = async (code: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data: group, error: findError } = await supabase
      .from('study_groups')
      .select('*')
      .eq('group_code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (findError || !group) {
      return { error: new Error('Group not found. Please check the code and try again.') };
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return { error: new Error('You are already a member of this group.') };
    }

    // Check member limit
    const { count } = await supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', group.id)
      .eq('is_active', true);

    if (count && count >= group.max_members) {
      return { error: new Error('This group is full.') };
    }

    const { error } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: 'member',
        age_group: 'adult',
        reading_level: 'adult'
      });

    if (!error) {
      await fetchGroups();
    }

    return { data: group, error };
  };

  const selectGroup = async (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setCurrentGroup(group);
      await fetchGroupDetails(groupId);
    }
  };

  const fetchGroupDetails = async (groupId: string) => {
    if (!user) return;

    // Fetch members
    const { data: memberData } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId)
      .eq('is_active', true);

    if (memberData) {
      const userIds = memberData.map(m => m.user_id);

      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', userIds);

      const { data: progress } = await supabase
        .from('user_progress')
        .select('user_id, current_streak')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.name]) || []);
      const progressMap = new Map(progress?.map(p => [p.user_id, p.current_streak]) || []);

      const enriched = memberData.map(m => ({
        ...m,
        name: profileMap.get(m.user_id) || m.display_name || 'Unknown',
        current_streak: progressMap.get(m.user_id) || 0
      }));

      setMembers(enriched);
    }

    // Fetch study plans
    const { data: planData } = await supabase
      .from('group_study_plans')
      .select('*')
      .eq('group_id', groupId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    setStudyPlans(planData || []);

    // Fetch recent sessions
    const { data: sessionData } = await supabase
      .from('group_study_sessions')
      .select('*')
      .eq('group_id', groupId)
      .order('session_date', { ascending: false })
      .limit(10);

    if (sessionData && sessionData.length > 0) {
      setSessions(sessionData.map(s => ({
        ...s,
        completed_by: Array.isArray(s.completed_by) ? s.completed_by : []
      })));
      setCurrentSession({
        ...sessionData[0],
        completed_by: Array.isArray(sessionData[0].completed_by) ? sessionData[0].completed_by : []
      });
    } else {
      setSessions([]);
      setCurrentSession(null);
    }
  };

  const createStudyPlan = async (
    groupId: string,
    planName: string,
    book: string,
    chapterStart: number,
    chapterEnd: number,
    frequency: string = 'weekly',
    studyDay?: string
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('group_study_plans')
      .insert({
        group_id: groupId,
        plan_name: planName,
        book,
        chapter_start: chapterStart,
        chapter_end: chapterEnd,
        current_chapter: chapterStart,
        frequency,
        study_day: studyDay
      })
      .select()
      .single();

    if (data && !error) {
      // Create first session
      await supabase.from('group_study_sessions').insert({
        group_id: groupId,
        plan_id: data.id,
        book,
        chapter: chapterStart,
        session_title: `${book} Chapter ${chapterStart}`
      });

      await fetchGroupDetails(groupId);
    }

    return { data, error };
  };

  const createSession = async (
    groupId: string,
    book: string,
    chapter: number,
    title?: string,
    planId?: string
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('group_study_sessions')
      .insert({
        group_id: groupId,
        plan_id: planId,
        book,
        chapter,
        session_title: title || `${book} Chapter ${chapter}`
      })
      .select()
      .single();

    if (data && !error) {
      await fetchGroupDetails(groupId);
    }

    return { data, error };
  };

  const completeSession = async (
    sessionId: string,
    groupId: string,
    readingLevel: string,
    reflectionText?: string,
    questionsForGroup?: string,
    timeSpentMinutes: number = 0
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Record progress
    const { error: progressError } = await supabase
      .from('group_member_progress')
      .insert({
        group_id: groupId,
        user_id: user.id,
        session_id: sessionId,
        reading_level: readingLevel,
        reflection_text: reflectionText,
        questions_for_group: questionsForGroup,
        time_spent_minutes: timeSpentMinutes
      });

    if (progressError) return { error: progressError };

    // Update session completed_by array
    const { data: session } = await supabase
      .from('group_study_sessions')
      .select('completed_by')
      .eq('id', sessionId)
      .single();

    const completedBy = Array.isArray(session?.completed_by) ? session.completed_by : [];
    if (!completedBy.includes(user.id)) {
      await supabase
        .from('group_study_sessions')
        .update({ completed_by: [...completedBy, user.id] })
        .eq('id', sessionId);
    }

    await fetchGroupDetails(groupId);
    return { error: null };
  };

  const postDiscussion = async (
    sessionId: string,
    message: string,
    messageType: string = 'comment',
    parentId?: string
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('group_discussions')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        message_text: message,
        message_type: messageType,
        parent_message_id: parentId
      })
      .select()
      .single();

    return { data, error };
  };

  const fetchDiscussions = async (sessionId: string) => {
    const { data } = await supabase
      .from('group_discussions')
      .select('*')
      .eq('session_id', sessionId)
      .order('posted_at', { ascending: true });

    if (data) {
      const userIds = [...new Set(data.map(d => d.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.name]) || []);

      const enriched = data.map(d => ({
        ...d,
        reactions: typeof d.reactions === 'object' && d.reactions !== null ? d.reactions as Record<string, number> : {},
        user_name: profileMap.get(d.user_id) || 'Unknown'
      }));

      setDiscussions(enriched);
    }
  };

  const updateMemberSettings = async (
    groupId: string,
    ageGroup: string,
    readingLevel: string,
    displayName?: string
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('group_members')
      .update({
        age_group: ageGroup,
        reading_level: readingLevel,
        display_name: displayName
      })
      .eq('group_id', groupId)
      .eq('user_id', user.id);

    if (!error) {
      await fetchGroupDetails(groupId);
    }

    return { error };
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('group_members')
      .update({ is_active: false })
      .eq('group_id', groupId)
      .eq('user_id', user.id);

    if (!error) {
      if (currentGroup?.id === groupId) {
        setCurrentGroup(null);
        setMembers([]);
        setStudyPlans([]);
        setSessions([]);
      }
      await fetchGroups();
    }

    return { error };
  };

  const deleteGroup = async (groupId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('study_groups')
      .delete()
      .eq('id', groupId);

    if (!error) {
      if (currentGroup?.id === groupId) {
        setCurrentGroup(null);
        setMembers([]);
        setStudyPlans([]);
        setSessions([]);
      }
      await fetchGroups();
    }

    return { error };
  };

  return {
    groups,
    currentGroup,
    members,
    studyPlans,
    currentSession,
    sessions,
    memberProgress,
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
    deleteGroup,
    refetch: fetchGroups
  };
}
