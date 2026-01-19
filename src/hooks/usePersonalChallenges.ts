import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PersonalChallenge {
  id: string;
  user_id: string;
  challenge_type: string;
  challenge_name: string;
  description: string | null;
  icon_emoji: string;
  target_value: number;
  current_value: number;
  duration_days: number;
  difficulty_level: string;
  scripture_motivation: string | null;
  started_at: string;
  ends_at: string;
  completed_at: string | null;
  status: string;
}

export const CHALLENGE_TEMPLATES = [
  {
    type: 'streak',
    name: 'WEEK OF WAR',
    description: 'Train 7 consecutive days',
    icon: '⚔️',
    duration: 7,
    target: 7,
    difficulty: 'beginner',
    scripture: 'Endure hardness, as a good soldier of Jesus Christ. - 2 Timothy 2:3'
  },
  {
    type: 'streak',
    name: 'MONTH OF DISCIPLINE',
    description: 'Train 30 consecutive days',
    icon: '🏆',
    duration: 30,
    target: 30,
    difficulty: 'intermediate',
    scripture: 'I discipline my body and keep it under control. - 1 Corinthians 9:27'
  },
  {
    type: 'streak',
    name: 'RELENTLESS 100',
    description: 'Train 100 consecutive days',
    icon: '💎',
    duration: 100,
    target: 100,
    difficulty: 'advanced',
    scripture: 'Be ye stedfast, unmoveable, always abounding. - 1 Corinthians 15:58'
  },
  {
    type: 'prayer',
    name: 'PRAYER SURGE',
    description: 'Log 21 prayers in 21 days',
    icon: '🙏',
    duration: 21,
    target: 21,
    difficulty: 'beginner',
    scripture: 'The effectual fervent prayer of a righteous man availeth much. - James 5:16'
  },
  {
    type: 'prayer',
    name: 'PRAY WITHOUT CEASING',
    description: 'Pray every day for 40 days',
    icon: '🔥',
    duration: 40,
    target: 40,
    difficulty: 'advanced',
    scripture: 'Pray without ceasing. - 1 Thessalonians 5:17'
  },
  {
    type: 'scripture',
    name: 'WORD IMMERSION',
    description: 'Read 50 verses in 7 days',
    icon: '📖',
    duration: 7,
    target: 50,
    difficulty: 'beginner',
    scripture: 'Thy word have I hid in mine heart. - Psalm 119:11'
  },
  {
    type: 'scripture',
    name: 'BIBLE DIVE',
    description: 'Read 200 verses in 30 days',
    icon: '📚',
    duration: 30,
    target: 200,
    difficulty: 'intermediate',
    scripture: 'Study to shew thyself approved unto God. - 2 Timothy 2:15'
  },
  {
    type: 'worship',
    name: 'WORSHIP WEEK',
    description: 'Complete 7 worship sessions in 7 days',
    icon: '🎵',
    duration: 7,
    target: 7,
    difficulty: 'beginner',
    scripture: 'Enter into his gates with thanksgiving. - Psalm 100:4'
  },
  {
    type: 'complete',
    name: 'PERFECT WEEK',
    description: 'Complete all 4 session steps 7 days straight',
    icon: '✨',
    duration: 7,
    target: 7,
    difficulty: 'intermediate',
    scripture: 'Be ye doers of the word, and not hearers only. - James 1:22'
  },
  {
    type: 'battles',
    name: 'FACE YOUR GIANTS',
    description: 'Use "Find By Feeling" 10 times in 14 days',
    icon: '⚔️',
    duration: 14,
    target: 10,
    difficulty: 'beginner',
    scripture: 'The battle is the LORD\'s. - 1 Samuel 17:47'
  }
];

export function usePersonalChallenges() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<PersonalChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChallenges();
    }
  }, [user]);

  const fetchChallenges = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('personal_challenges')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setChallenges(data);
    }

    setLoading(false);
  };

  const startChallenge = async (template: typeof CHALLENGE_TEMPLATES[0]) => {
    if (!user) return { error: new Error('Not authenticated') };

    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + template.duration);

    const { data, error } = await supabase
      .from('personal_challenges')
      .insert({
        user_id: user.id,
        challenge_type: template.type,
        challenge_name: template.name,
        description: template.description,
        icon_emoji: template.icon,
        target_value: template.target,
        duration_days: template.duration,
        difficulty_level: template.difficulty,
        scripture_motivation: template.scripture,
        ends_at: endsAt.toISOString()
      })
      .select()
      .single();

    if (!error) {
      await fetchChallenges();
    }

    return { data, error };
  };

  const updateProgress = async (challengeId: string, newValue: number) => {
    if (!user) return { error: new Error('Not authenticated') };

    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return { error: new Error('Challenge not found') };

    const updates: Partial<PersonalChallenge> = {
      current_value: newValue
    };

    // Check if completed
    if (newValue >= challenge.target_value) {
      updates.status = 'completed';
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('personal_challenges')
      .update(updates)
      .eq('id', challengeId);

    if (!error) {
      await fetchChallenges();
    }

    return { error };
  };

  const abandonChallenge = async (challengeId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('personal_challenges')
      .update({ status: 'abandoned' })
      .eq('id', challengeId);

    if (!error) {
      await fetchChallenges();
    }

    return { error };
  };

  const getActiveChallenges = () => {
    const now = new Date();
    return challenges.filter(c => 
      c.status === 'active' && new Date(c.ends_at) > now
    );
  };

  const getCompletedChallenges = () => {
    return challenges.filter(c => c.status === 'completed');
  };

  const getFailedChallenges = () => {
    const now = new Date();
    return challenges.filter(c => 
      c.status === 'active' && 
      new Date(c.ends_at) <= now &&
      c.current_value < c.target_value
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return {
    challenges,
    loading,
    startChallenge,
    updateProgress,
    abandonChallenge,
    getActiveChallenges,
    getCompletedChallenges,
    getFailedChallenges,
    getDifficultyColor,
    templates: CHALLENGE_TEMPLATES,
    refetch: fetchChallenges
  };
}
