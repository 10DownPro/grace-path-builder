# FaithFit Repositioning Plan

A focused rework across visual system, copy, onboarding, homepage, and daily experience. Preserves existing data model and routes — changes are concentrated in the design system, landing page, onboarding, and the dashboard/session surfaces.

## 1. Visual System (foundation — do first)

Update `src/index.css` and `tailwind.config.ts`:
- Replace orange-dominant palette with the new tokens:
  - `--background` → #111827 (Deep Navy Charcoal)
  - `--card` / secondary surface → #1F2937
  - `--primary` → #4F7CAC (Muted Faith Blue)
  - `--secondary` / accent → #6B8F71 (Restoration Sage)
  - `--success` → #6B8F71
  - `--border` → #374151
  - `--muted-foreground` → #9CA3AF
  - `--foreground` → #FFFFFF, secondary text #D1D5DB
- Demote orange (#E87722) to a sparingly-used highlight token (`--accent-warm`) for notifications, brand moments, active states only.
- Soften typography: keep Bebas Neue only for the FaithFit logo wordmark; switch headings to a calmer display (Fraunces or Instrument Serif) and body to Inter for a premium spiritual-formation feel.
- Replace harsh shadows/borders (4px gym borders) with softer 1px borders, gentle shadows, and more whitespace.

## 2. Landing Page (`src/pages/Landing.tsx`)

Full copy + layout pass:
- Headline: **Build or Rebuild Your Walk With God.**
- Subheadline: *Whether you're just getting started or finding your way back, FaithFit guides you through worship, scripture, prayer, and reflection — one day at a time.*
- Primary CTA: **Join the Waitlist** → `/waitlist`
- Secondary CTA: **See How It Works** → scrolls to How It Works
- Two audience cards: *New to faith* / *Coming back to God*
- "Today's Walk" feature section (Worship · Scripture · Prayer · Reflection) — conversational, not athletic
- Remove all "grind/battle/workout/level up/spiritual athlete" language

## 3. Onboarding (`src/components/onboarding/OnboardingFlow.tsx`)

Replace existing commitment/time/focus steps with three warm questions:
1. **Where are you in your journey?** — New to faith / Curious about God / Returning after time away / Following for years
2. **What do you need most right now?** — Guidance / Consistency / Healing / Purpose / Prayer / Understanding the Bible
3. **How much time can you give God each day?** — 5 / 10 / 15 / 20+ min

End screen: replace **"DAY 1 STARTS NOW"** with **"Your Walk Begins"** — calm reveal of their personalized track (Starting Faith or Coming Back) instead of confetti/countdown.

## 4. Guided Tracks (new lightweight feature)

Add `src/pages/Tracks.tsx` + `src/lib/tracks.ts` with two seeded tracks:
- **Starting Faith**: Who is God? · Who is Jesus? · What is prayer? · How do I read the Bible? · What does salvation mean?
- **Coming Back**: Starting over · Guilt and shame · Trusting God again · Rebuilding consistency · Returning to prayer · Hearing God's voice

Each topic = short intro + scripture + reflection prompt. Stored client-side initially (no migration needed). Surfaced on the homepage based on onboarding answer.

## 5. Home Dashboard (`src/pages/Dashboard.tsx` + home components)

- Rename "Today's Workout" → **Today's Walk**; rework `WorkoutCard.tsx` into `TodaysWalkCard.tsx` with calmer styling (no "SETS", no gradient progress bar shine, no dumbbell icon).
- Replace `WeeklyGrind.tsx` ("This Week's Grind", "PERFECT WEEK", "WARRIOR") with `WeeklyRhythm.tsx` — gentle progress without ranking labels.
- Replace `BattleVersesCard.tsx` "Struggling Today?" → **Scripture for what you're facing** (keep destination, soften visual).
- Streak handling: on return after missed days show **"Welcome back. Let's continue."** — never "You broke your streak."
- Add a "Continue your track" card linking to the user's chosen guided track.

## 6. Navigation (`src/components/layout/Navigation.tsx`)

- Train → **Walk**
- Trenches → **Community**
- Squad → **Friends**
- Keep Home, Bible

## 7. Session / Daily Experience (`src/pages/Session.tsx`)

- Header: **Today's Walk** (not "Training Session")
- Step names: Worship / Scripture / Prayer / Reflection (already correct) — soften surrounding copy, remove "set", "rep", "battle" language
- Completion state: **"Well done. See you tomorrow."** (replace "Workout Complete! 💪")

## 8. Copy Sweep

Global search/replace pass across components for: workout → walk, training → time with God, grind → rhythm, battle mode → scripture for hard days, spiritual athlete → (remove), level up → grow, locked in → ready. Keep changes presentation-only; do not touch DB schema or hooks logic.

## Out of Scope
- No database migrations (existing tables/streaks remain; only UI messaging changes)
- No new backend logic
- Keeps Faith Training Guide / book code flow as-is, just softened copy
- Logo asset untouched
