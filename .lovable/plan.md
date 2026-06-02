## FaithFit Journey System Overhaul — Plan

Community is untouched. All work below is scoped to Journey / Tracks / Lessons / Progress / Discipleship experience.

This is a large content + structural change, so I'm splitting it into 3 phases. Each phase produces a usable app — no half-broken intermediate state.

---

### What changes (data model)

Current model:
```text
Track → Lesson
```

New model:
```text
Track → Module → Lesson → (Session view)
```

Each **Lesson** gets a fixed 7-part structure:
1. Teaching (2–4 short paragraphs, Jesus-centered)
2. Scripture (passage + why it matters + what it teaches about God / Jesus + how it applies today)
3. Understanding (plain-language explanation)
4. Reflection (1 thoughtful question)
5. Prayer (always ends `"In Jesus' name, Amen. 🙏🏽"`)
6. Action Step (1 simple real-world action)
7. Completion (encouragement + pointer to next lesson)

Target lesson length: **5–10 minutes of real reading + reflection**, not 30 seconds.

---

### Phase 1 — Structural foundation (this turn)

Code-only. No content loss; existing 6 journeys are migrated into the new shape so nothing breaks.

1. **`src/lib/journeys.ts`** — extend types:
   - Add `Lesson` (7-part structure above) and `Module` (`{ id, title, summary, lessons[] }`).
   - Keep `Journey` but switch `modules: JourneyModule[]` → `modules: Module[]` where each Module owns `lessons: Lesson[]`.
   - Provide a `legacyToLesson()` adapter so the current 60-ish modules become single-lesson modules until Phase 2 fills them out. Nothing in the app breaks.
2. **`src/hooks/useJourney.ts`** — update progress logic:
   - Track completion at the **lesson** level (`completed_lesson_ids: string[]`) instead of module level.
   - Derive module progress (`completedLessons / totalLessons`) and track progress.
   - Expose `currentLesson`, `nextLesson`, `estimatedMinutesRemaining`.
3. **`src/components/journey/LessonViewer.tsx`** — render the 7-part flow:
   - Teaching → Scripture (with "why it matters" / "about God" / "about Jesus" / "applies today") → Understanding → Reflection → Prayer → Action Step → Completion.
   - Enforce prayer ending `"In Jesus' name, Amen. 🙏🏽"` (utility appends if missing).
4. **`src/pages/Tracks.tsx`** — Track list shows modules nested under tracks, with progress bars at track and module level, and a clear "Continue: Module X, Lesson Y" CTA.
5. **Completion screens**:
   - Lesson complete → encouragement + reflection recap + next lesson CTA.
   - Module complete → module summary + key takeaways + next module preview.
   - Track complete → recommendations (Next Track, Related Track, Faith Circle, Prayer Partner, Community, Bible Reading Plan). Never a dead end.
6. **Database**: rename/extend the lesson-completion column to store lesson IDs. Lightweight migration: add `completed_lesson_ids text[]` to `user_progress` (or equivalent existing table) without dropping the old field; backfill from old completions where possible.

Verify in browser: Tracks page loads, each track expands into modules+lessons, opening a lesson shows the 7-part flow, completing one advances progress correctly.

---

### Phase 2 — Content build-out (next turn, after you confirm Phase 1)

Write the actual ~180 discipleship lessons.

| Track | Modules | Lessons |
|---|---|---|
| Starting Faith | 10 | ~40 |
| Coming Back | 10 | ~40 |
| Learning Prayer | 6 | ~25 |
| Understanding Jesus | 6 | ~25 |
| Building Consistency | 5 | ~20 |
| Healing & Restoration | 6 | ~30 |
| **Total** | **43** | **~180** |

Module structure follows your spec verbatim. Every lesson:
- Centers Jesus (even outside Understanding Jesus).
- Ends prayer with `"In Jesus' name, Amen. 🙏🏽"`.
- Includes scripture with full context (why / about God / about Jesus / applies today).
- Has 1 action step.

I'll deliver this as a new `src/content/lessons/` folder (one file per track for reviewability), imported into `journeys.ts`. This keeps PRs reviewable and content easy to edit later.

Realistic delivery: **2 tracks per turn** (the writing has to be careful, not generated boilerplate). So Phase 2 is ~3 turns of content. I'll confirm tone with you after the first track lands.

---

### Phase 3 — Polish

- Progress visualizations (track ring + module bars + lesson dots).
- "Estimated time remaining" on the dashboard's Continue Journey card.
- Completion celebrations (calm — no confetti spam, no "level up").
- Scripture renderer: never show a verse without the 4-part context block.
- Audit every existing generated prayer in the app (session prayers, micro-actions, prayer journal templates) and enforce the `"In Jesus' name, Amen. 🙏🏽"` ending.

---

### Tone guardrails (applied everywhere)

- Allowed: walk with Jesus, follow Jesus, return to Jesus, grace, restoration, invitation, presence.
- Forbidden: level up, grind, earn, streak shame, "you're behind", "catch up", performance metaphors, military/gym metaphors in journey content.

---

### What I need from you before I start Phase 1

1. **Confirm the 3-phase split is okay.** (Otherwise I'll try to do it all and quality will suffer.)
2. **Confirm I can add `completed_lesson_ids` to the user-progress table** (small additive migration, no data loss).
3. **Confirm the prayer ending is exactly `"In Jesus' name, Amen. 🙏🏽"`** with that specific brown hand emoji — I want to match exactly.

If yes to all three, I'll execute Phase 1 in the next turn and verify it in the browser before stopping.
