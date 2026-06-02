import { useCallback, useEffect, useState } from 'react';

const REFLECTIONS_KEY = 'faithfit-lesson-reflections-v1';
const REACTIONS_KEY = 'faithfit-lesson-reactions-v1';
const USER_REACTIONS_KEY = 'faithfit-user-reactions-v1';

export type ReactionKey = 'encouraged' | 'needed' | 'made-me-think' | 'life-changing';

export const REACTIONS: { key: ReactionKey; emoji: string; label: string }[] = [
  { key: 'encouraged', emoji: '❤️', label: 'Encouraged Me' },
  { key: 'needed', emoji: '🙏', label: 'Needed This' },
  { key: 'made-me-think', emoji: '🤔', label: 'Made Me Think' },
  { key: 'life-changing', emoji: '🔥', label: 'Life Changing' },
];

type ReflectionMap = Record<string, Record<string, string>>; // moduleKey -> questionId -> answer
type ReactionCounts = Record<ReactionKey, number>;
type ReactionsMap = Record<string, ReactionCounts>; // moduleKey -> counts
type UserReactionsMap = Record<string, ReactionKey | undefined>; // moduleKey -> chosen

const emptyCounts = (): ReactionCounts => ({ encouraged: 0, needed: 0, 'made-me-think': 0, 'life-changing': 0 });

function read<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
}
function write<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// Seed plausible anonymous community totals so the section never feels empty.
function seedCounts(moduleKey: string): ReactionCounts {
  let h = 0;
  for (let i = 0; i < moduleKey.length; i++) h = (h * 31 + moduleKey.charCodeAt(i)) >>> 0;
  return {
    encouraged: 40 + (h % 80),
    needed: 30 + ((h >> 3) % 70),
    'made-me-think': 20 + ((h >> 6) % 60),
    'life-changing': 10 + ((h >> 9) % 40),
  };
}

export function useLesson(journeyId: string, moduleId: string) {
  const moduleKey = `${journeyId}::${moduleId}`;

  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [counts, setCounts] = useState<ReactionCounts>(() => emptyCounts());
  const [userReaction, setUserReaction] = useState<ReactionKey | undefined>(undefined);

  useEffect(() => {
    const allRefl = read<ReflectionMap>(REFLECTIONS_KEY, {});
    setReflections(allRefl[moduleKey] || {});

    const allCounts = read<ReactionsMap>(REACTIONS_KEY, {});
    setCounts(allCounts[moduleKey] || seedCounts(moduleKey));

    const userMap = read<UserReactionsMap>(USER_REACTIONS_KEY, {});
    setUserReaction(userMap[moduleKey]);
  }, [moduleKey]);

  const saveReflection = useCallback((questionId: string, answer: string) => {
    setReflections((prev) => {
      const next = { ...prev, [questionId]: answer };
      const all = read<ReflectionMap>(REFLECTIONS_KEY, {});
      all[moduleKey] = next;
      write(REFLECTIONS_KEY, all);
      return next;
    });
  }, [moduleKey]);

  const toggleReaction = useCallback((reaction: ReactionKey) => {
    const allCounts = read<ReactionsMap>(REACTIONS_KEY, {});
    const userMap = read<UserReactionsMap>(USER_REACTIONS_KEY, {});
    const current = allCounts[moduleKey] || seedCounts(moduleKey);
    const prevChoice = userMap[moduleKey];
    const next = { ...current };
    if (prevChoice === reaction) {
      next[reaction] = Math.max(0, next[reaction] - 1);
      userMap[moduleKey] = undefined;
      setUserReaction(undefined);
    } else {
      if (prevChoice) next[prevChoice] = Math.max(0, next[prevChoice] - 1);
      next[reaction] = next[reaction] + 1;
      userMap[moduleKey] = reaction;
      setUserReaction(reaction);
    }
    allCounts[moduleKey] = next;
    write(REACTIONS_KEY, allCounts);
    write(USER_REACTIONS_KEY, userMap);
    setCounts(next);
  }, [moduleKey]);

  return { reflections, saveReflection, counts, userReaction, toggleReaction };
}
