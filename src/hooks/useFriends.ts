import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Friend {
  id: string;
  user_id: string;
  name: string;
  friend_code: string;
  current_streak: number;
  total_sessions: number;
  friendship_id: string;
}

export interface FriendRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  requester_friend_code: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  challenger_id: string;
  challenged_id: string;
  challenger_name?: string;
  challenged_name?: string;
  challenge_type: string;
  challenge_name: string;
  description?: string;
  target_value: number;
  start_date: string;
  end_date: string;
  status: string;
  winner_id?: string;
  my_progress: number;
  their_progress: number;
}

export function useFriends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [myFriendCode, setMyFriendCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAll();
    }
  }, [user]);

  const fetchAll = async () => {
    if (!user) return;
    setLoading(true);
    await Promise.all([
      fetchFriends(),
      fetchPendingRequests(),
      fetchChallenges(),
      fetchMyFriendCode()
    ]);
    setLoading(false);
  };

  const fetchMyFriendCode = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('friend_code')
      .eq('user_id', user.id)
      .single();
    if (data?.friend_code) {
      setMyFriendCode(data.friend_code);
    }
  };

  const fetchFriends = async () => {
    if (!user) return;
    
    // Get all accepted friendships where I'm either requester or addressee
    const { data: friendships, error } = await supabase
      .from('friendships')
      .select('*')
      .eq('status', 'accepted')
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    if (error || !friendships) {
      console.error('Error fetching friendships:', error);
      return;
    }

    // Get friend user IDs
    const friendIds = friendships.map(f => 
      f.requester_id === user.id ? f.addressee_id : f.requester_id
    );

    if (friendIds.length === 0) {
      setFriends([]);
      return;
    }

    // Get friend profiles using public_profiles view (bypasses RLS for friend data)
    const { data: profiles } = await supabase
      .from('public_profiles')
      .select('user_id, name')
      .in('user_id', friendIds);

    const { data: progress } = await supabase
      .from('user_progress')
      .select('user_id, current_streak, total_sessions')
      .in('user_id', friendIds);

    const friendsList: Friend[] = friendIds.map(friendId => {
      const profile = profiles?.find(p => p.user_id === friendId);
      const prog = progress?.find(p => p.user_id === friendId);
      const friendship = friendships.find(f => 
        f.requester_id === friendId || f.addressee_id === friendId
      );
      
      return {
        id: friendId,
        user_id: friendId,
        name: profile?.name || 'Unknown',
        friend_code: '', // Not needed for display
        current_streak: prog?.current_streak || 0,
        total_sessions: prog?.total_sessions || 0,
        friendship_id: friendship?.id || ''
      };
    });

    setFriends(friendsList);
  };

  const fetchPendingRequests = async () => {
    if (!user) return;
    
    const { data: requests, error } = await supabase
      .from('friendships')
      .select('*')
      .eq('addressee_id', user.id)
      .eq('status', 'pending');

    if (error || !requests) {
      console.error('Error fetching requests:', error);
      return;
    }

    const requesterIds = requests.map(r => r.requester_id);
    if (requesterIds.length === 0) {
      setPendingRequests([]);
      return;
    }

    // Use public_profiles view to get requester info
    const { data: profiles } = await supabase
      .from('public_profiles')
      .select('user_id, name')
      .in('user_id', requesterIds);

    const pendingList: FriendRequest[] = requests.map(req => {
      const profile = profiles?.find(p => p.user_id === req.requester_id);
      return {
        id: req.id,
        requester_id: req.requester_id,
        requester_name: profile?.name || 'Unknown',
        requester_friend_code: '', // Not needed for pending requests
        created_at: req.created_at
      };
    });

    setPendingRequests(pendingList);
  };

  const fetchChallenges = async () => {
    if (!user) return;
    
    const { data: challengeData, error } = await supabase
      .from('challenges')
      .select('*')
      .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
      .in('status', ['pending', 'active'])
      .order('created_at', { ascending: false });

    if (error || !challengeData) {
      console.error('Error fetching challenges:', error);
      return;
    }

    // Get all participant IDs
    const participantIds = [...new Set(challengeData.flatMap(c => [c.challenger_id, c.challenged_id]))];
    
    // Use public_profiles view
    const { data: profiles } = await supabase
      .from('public_profiles')
      .select('user_id, name')
      .in('user_id', participantIds);

    const { data: progressData } = await supabase
      .from('challenge_progress')
      .select('*')
      .in('challenge_id', challengeData.map(c => c.id));

    const challengesList: Challenge[] = challengeData.map(ch => {
      const challengerProfile = profiles?.find(p => p.user_id === ch.challenger_id);
      const challengedProfile = profiles?.find(p => p.user_id === ch.challenged_id);
      const myProg = progressData?.find(p => p.challenge_id === ch.id && p.user_id === user.id);
      const theirId = ch.challenger_id === user.id ? ch.challenged_id : ch.challenger_id;
      const theirProg = progressData?.find(p => p.challenge_id === ch.id && p.user_id === theirId);
      
      return {
        id: ch.id,
        challenger_id: ch.challenger_id,
        challenged_id: ch.challenged_id,
        challenger_name: challengerProfile?.name,
        challenged_name: challengedProfile?.name,
        challenge_type: ch.challenge_type,
        challenge_name: ch.challenge_name,
        description: ch.description,
        target_value: ch.target_value,
        start_date: ch.start_date,
        end_date: ch.end_date,
        status: ch.status,
        winner_id: ch.winner_id,
        my_progress: myProg?.current_value || 0,
        their_progress: theirProg?.current_value || 0
      };
    });

    setChallenges(challengesList);
  };

  const sendFriendRequest = async (friendCode: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Find user by friend code using secure function (prevents profile enumeration)
    const { data: targetProfiles, error: findError } = await supabase
      .rpc('lookup_friend_by_code', { _friend_code: friendCode.toUpperCase() });

    const targetProfile = targetProfiles?.[0];

    if (findError || !targetProfile) {
      return { error: new Error('Friend code not found') };
    }

    if (targetProfile.user_id === user.id) {
      return { error: new Error('You cannot add yourself') };
    }

    // Check if friendship already exists
    const { data: existing } = await supabase
      .from('friendships')
      .select('*')
      .or(`and(requester_id.eq.${user.id},addressee_id.eq.${targetProfile.user_id}),and(requester_id.eq.${targetProfile.user_id},addressee_id.eq.${user.id})`)
      .single();

    if (existing) {
      return { error: new Error('Friendship already exists or pending') };
    }

    const { error } = await supabase
      .from('friendships')
      .insert({
        requester_id: user.id,
        addressee_id: targetProfile.user_id,
        status: 'pending'
      });

    if (error) {
      return { error };
    }

    return { data: { name: targetProfile.display_name }, error: null };
  };

  const acceptRequest = async (requestId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (!error) {
      await fetchAll();
    }

    return { error };
  };

  const declineRequest = async (requestId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', requestId);

    if (!error) {
      await fetchAll();
    }

    return { error };
  };

  const removeFriend = async (friendshipId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId);

    if (!error) {
      await fetchAll();
    }

    return { error };
  };

  const createChallenge = async (
    friendId: string, 
    challengeType: string, 
    challengeName: string, 
    targetValue: number, 
    durationDays: number,
    description?: string
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    const { data: challenge, error } = await supabase
      .from('challenges')
      .insert({
        challenger_id: user.id,
        challenged_id: friendId,
        challenge_type: challengeType,
        challenge_name: challengeName,
        description,
        target_value: targetValue,
        end_date: endDate.toISOString().split('T')[0],
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      return { error };
    }

    // Create progress entries for both users
    await supabase.from('challenge_progress').insert([
      { challenge_id: challenge.id, user_id: user.id, current_value: 0 },
      { challenge_id: challenge.id, user_id: friendId, current_value: 0 }
    ]);

    await fetchChallenges();
    return { data: challenge, error: null };
  };

  const acceptChallenge = async (challengeId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('challenges')
      .update({ status: 'active' })
      .eq('id', challengeId);

    if (!error) {
      await fetchChallenges();
    }

    return { error };
  };

  const declineChallenge = async (challengeId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('challenges')
      .update({ status: 'declined' })
      .eq('id', challengeId);

    if (!error) {
      await fetchChallenges();
    }

    return { error };
  };

  return {
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
    declineChallenge,
    refetch: fetchAll
  };
}
