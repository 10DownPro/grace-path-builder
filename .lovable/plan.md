# FaithFit Retention & Engagement Redesign

Shifts the app from "fitness/grind tracking" to a guided, grace-based walk. No leaderboards, no streak shame, no battles. Users return because they feel progress, belonging, and welcome.

## 1. Journey System (replaces generic activity)

- Extend `src/lib/tracks.ts` into a full Journey model: `id`, `title`, `description`, `modules[]` (each with `id`, `title`, `summary`, `scripture`, `reflection`, `prayer`).
- New hook `src/hooks/useJourney.ts` (localStorage-backed): tracks active journey, completed module IDs, % complete, next recommended module, recently unlocked.
- Seed 6 journeys: Starting Faith, Coming Back, Learning Prayer, Understanding Jesus, Building Consistency, Healing & Restoration.
- Rebuild `src/pages/Tracks.tsx` → renamed display as "Journeys" with progress bars, next step CTA, recently unlocked strip.
- Home dashboard gets a `JourneyProgressCard` showing current journey %, next module, "Continue your journey" CTA.

## 2. Milestone System (replaces ranks/grind achievements)

- New `src/lib/milestones.ts` with grace-based milestones (First Prayer, First Chapter Read, 7 Days of Prayer, First Reflection, First Month, Encouraged Someone, Joined a Circle, etc.). Each: `id`, `emoji`, `title`, `description`, `predicate(stats)`.
- New hook `src/hooks/useMilestonesV2.ts` evaluates predicates against sessions/prayers/progress and stores achieved IDs in localStorage (no DB migration).
- New `MilestoneShelf` component shown on Home + Profile.
- Replace the existing "rank" display in Profile and remove `WeeklyGrind` achievement badges.

## 3. Daily Check-in

- New `src/components/home/DailyCheckIn.tsx`: four options (Struggling / Distracted / Doing Okay / Growing) shown once per day, persisted in localStorage as `faithfit-mood-YYYY-MM-DD`.
- New `src/lib/moodContent.ts`: per-mood scripture suggestion, prayer prompt, reflection question, encouragement line.
- Home dashboard, session intro, and Today's Scripture all read the day's mood to adapt copy/verse selection.

## 4. Faith Circles (replaces Squads/Battles language)

- Rename `src/pages/Friends.tsx` route content + nav label to "Circles" (keep underlying DB tables — pure UI/copy change).
- Update `src/components/friends/SquadsList.tsx`, `SquadChat.tsx`, `SquadPrayerWall.tsx`, `CreateSquadDialog.tsx` copy: Squad → Circle, "join squad" → "join circle", remove competition framing.
- Hide `Leaderboard.tsx` from the Circles page (keep file, remove route/tab).
- Add suggested Circle themes when creating: Starting Faith / Coming Back / Prayer / Healing / Consistency / Purpose.
- Remove all "Battle" navigation — `/battles` route stays for scripture-by-feeling but renamed to "Scripture for Today" inside the Scripture section; remove from primary nav.

## 5. Prayer Partner System

- New `src/components/circles/PrayerPartnerCard.tsx` and a simple opt-in toggle stored in profile (`localStorage` for now to avoid DB migration in this pass — flagged as TODO for backend pairing).
- UI surfaces: weekly prayer goal, send-encouragement quick action, "Check in on your partner" prompt when partner hasn't logged in 3+ days (client-side using last session date from sessions hook for self; partner placeholder until backend pairing).

## 6. Small Steps (replaces Quick Wins)

- Rework `src/components/micro-actions/QuickActionsBar.tsx` → new `SmallStepsCard.tsx`:
  - Pray for one person
  - Read one verse
  - Write one sentence (reflection)
  - Encourage one person
- Remove competition/goal-percentage language; replace with "Even one step counts today."
- Keep underlying `useMicroActions` hook for persistence; relabel categories.

## 7. Today's Focus + Today's Scripture

- New `src/components/home/TodaysFocusCard.tsx`: single recommended action derived from active journey's next module + daily mood.
- Rename `BattleVerseOfDayCard.tsx` → `TodaysScriptureCard.tsx`. Adds: context line, reflection question, prayer prompt, Save + Share buttons.
- Remove `BattleVerse.tsx` / `BattleVersesCard.tsx` usage from Home.

## 8. This Week's Walk (replaces Weekly Grind)

- New `src/components/home/ThisWeeksWalk.tsx` replacing `WeeklyGrind.tsx`. Same 4 metrics tracked (sessions, prayers, reflections, scriptures) but framed as growth: no "PERFECT WEEK / WARRIOR / SCHOLAR" tiered badges. Soft progress bars only.

## 9. Grace-Based Streaks

- Update `useProgress` and any streak displays: never render "streak broken". When `lastSessionDate` is >1 day old, show "We've saved your place. Welcome back."
- Add `daysWalkedThisMonth` derived counter shown alongside current streak: "You've walked with God N days this month."
- Remove pulsing/aggressive streak protection UI; soften copy.

## 10. Unlock System

- Journey modules naturally unlock as previous ones complete.
- Add `lockedReason` field shown calmly: "Complete <previous> to open this study." No countdown timers, no scarcity.

## 11. Copy + Navigation Sweep

- Nav order: Home, Journey (was Walk/Train), Circles (was Community/Squad), Scripture, Profile.
- Global copy sweep: battle→scripture for today, grind→walk, squad→circle, mission→focus, rank→milestone, "broken streak"→"welcome back".

## Technical notes

- No database migrations in this pass. All new state (journey progress, milestones v2, daily mood, prayer partner opt-in) uses localStorage keys prefixed `faithfit-*`. Existing Supabase tables (sessions, prayers, squads) are reused with renamed UI labels only.
- All new components use existing design tokens (`--primary`, `--secondary` sage, `--card`, `--muted-foreground`). No new color tokens needed.
- Files to create: `src/hooks/useJourney.ts`, `src/hooks/useMilestonesV2.ts`, `src/hooks/useDailyMood.ts`, `src/lib/journeys.ts`, `src/lib/milestonesV2.ts`, `src/lib/moodContent.ts`, `src/components/home/DailyCheckIn.tsx`, `src/components/home/JourneyProgressCard.tsx`, `src/components/home/TodaysFocusCard.tsx`, `src/components/home/TodaysScriptureCard.tsx`, `src/components/home/ThisWeeksWalk.tsx`, `src/components/home/MilestoneShelf.tsx`, `src/components/home/SmallStepsCard.tsx`, `src/components/circles/PrayerPartnerCard.tsx`.
- Files to edit: `src/pages/Index.tsx`, `src/pages/Tracks.tsx`, `src/pages/Friends.tsx`, `src/components/layout/Navigation.tsx`, `src/components/friends/*` (copy), and remove Battle entries from nav.

## Out of scope (this pass)

- Backend prayer-partner pairing (placeholder UI only).
- Push-notification scheduling changes.
- Removing the `/battles` route entirely — kept accessible from Scripture for users mid-flow.
