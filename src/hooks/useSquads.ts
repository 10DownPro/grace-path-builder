import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Squad {
  id: string;
  name: string;
  description: string | null;
  icon_emoji: string;
  created_by: string;
  max_members: number;
  created_at: string;
  member_count?: number;
  is_creator?: boolean;
}

export interface SquadMember {
  id: string;
  squad_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  name?: string;
  current_streak?: number;
  total_sessions?: number;
}

export interface SquadActivity {
  id: string;
  squad_id: string;
  user_id: string;
  activity_type: string;
  activity_data: unknown;
  created_at: string;
  user_name?: string;
}

export function useSquads() {
  const { user } = useAuth();
  const [squads, setSquads] = useState<Squad[]>([]);
  const [currentSquad, setCurrentSquad] = useState<Squad | null>(null);
  const [members, setMembers] = useState<SquadMember[]>([]);
  const [activities, setActivities] = useState<SquadActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSquads();
    }
  }, [user]);

  const fetchSquads = async () => {
    if (!user) return;
    setLoading(true);

    // Get squads where user is a member or creator
    const { data: memberData } = await supabase
      .from('squad_members')
      .select('squad_id')
      .eq('user_id', user.id);

    const squadIds = memberData?.map(m => m.squad_id) || [];

    // Also get squads created by user
    const { data: createdSquads } = await supabase
      .from('squads')
      .select('*')
      .eq('created_by', user.id);

    const allSquadIds = [...new Set([...squadIds, ...(createdSquads?.map(s => s.id) || [])])];

    if (allSquadIds.length > 0) {
      const { data: squadData } = await supabase
        .from('squads')
        .select('*')
        .in('id', allSquadIds);

      if (squadData) {
        // Get member counts
        const { data: counts } = await supabase
          .from('squad_members')
          .select('squad_id')
          .in('squad_id', allSquadIds);

        const countMap = new Map<string, number>();
        counts?.forEach(c => {
          countMap.set(c.squad_id, (countMap.get(c.squad_id) || 0) + 1);
        });

        const enriched = squadData.map(s => ({
          ...s,
          member_count: countMap.get(s.id) || 0,
          is_creator: s.created_by === user.id
        }));

        setSquads(enriched);
      }
    } else {
      setSquads([]);
    }

    setLoading(false);
  };

  const createSquad = async (name: string, description?: string, iconEmoji: string = '⚔️') => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('squads')
      .insert({
        name,
        description,
        icon_emoji: iconEmoji,
        created_by: user.id
      })
      .select()
      .single();

    if (data && !error) {
      // Add creator as first member
      await supabase.from('squad_members').insert({
        squad_id: data.id,
        user_id: user.id,
        role: 'admin'
      });
      await fetchSquads();
    }

    return { data, error };
  };

  const selectSquad = async (squadId: string) => {
    const squad = squads.find(s => s.id === squadId);
    if (squad) {
      setCurrentSquad(squad);
      await fetchSquadDetails(squadId);
    }
  };

  const fetchSquadDetails = async (squadId: string) => {
    if (!user) return;

    // Fetch members
    const { data: memberData } = await supabase
      .from('squad_members')
      .select('*')
      .eq('squad_id', squadId);

    if (memberData) {
      const userIds = memberData.map(m => m.user_id);
      
      // Use public_profiles view instead of profiles table (squad members may not be friends)
      const { data: profiles } = await supabase
        .from('public_profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);

      const { data: progress } = await supabase
        .from('user_progress')
        .select('user_id, current_streak, total_sessions')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);
      const progressMap = new Map(progress?.map(p => [p.user_id, p]) || []);

      const enriched = memberData.map(m => ({
        ...m,
        name: profileMap.get(m.user_id) || 'Soldier',
        current_streak: progressMap.get(m.user_id)?.current_streak || 0,
        total_sessions: progressMap.get(m.user_id)?.total_sessions || 0
      }));

      setMembers(enriched.sort((a, b) => b.current_streak - a.current_streak));
    }

    // Fetch activities
    const { data: activityData } = await supabase
      .from('squad_activities')
      .select('*')
      .eq('squad_id', squadId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (activityData) {
      const userIds = [...new Set(activityData.map(a => a.user_id))];
      // Use public_profiles view for activity names too
      const { data: profiles } = await supabase
        .from('public_profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);

      const enriched = activityData.map(a => ({
        ...a,
        user_name: profileMap.get(a.user_id) || 'Soldier'
      }));

      setActivities(enriched);
    }
  };

  const inviteMember = async (squadId: string, friendUserId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('squad_members')
      .insert({
        squad_id: squadId,
        user_id: friendUserId,
        role: 'member'
      });

    if (!error && currentSquad?.id === squadId) {
      await fetchSquadDetails(squadId);
    }

    return { error };
  };

  const leaveSquad = async (squadId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('squad_members')
      .delete()
      .eq('squad_id', squadId)
      .eq('user_id', user.id);

    if (!error) {
      if (currentSquad?.id === squadId) {
        setCurrentSquad(null);
        setMembers([]);
        setActivities([]);
      }
      await fetchSquads();
    }

    return { error };
  };

  const deleteSquad = async (squadId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('squads')
      .delete()
      .eq('id', squadId);

    if (!error) {
      if (currentSquad?.id === squadId) {
        setCurrentSquad(null);
        setMembers([]);
        setActivities([]);
      }
      await fetchSquads();
    }

    return { error };
  };

  const postActivity = async (squadId: string, activityType: string, activityData: Record<string, any>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('squad_activities')
      .insert({
        squad_id: squadId,
        user_id: user.id,
        activity_type: activityType,
        activity_data: activityData
      });

    if (!error && currentSquad?.id === squadId) {
      await fetchSquadDetails(squadId);
    }

    return { error };
  };

  return {
    squads,
    currentSquad,
    members,
    activities,
    loading,
    createSquad,
    selectSquad,
    inviteMember,
    leaveSquad,
    deleteSquad,
    postActivity,
    refetch: fetchSquads
  };
}
