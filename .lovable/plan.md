
# Implementation Plan: Prayer & Verse Sharing + Full Bible Access

## Overview
This plan covers four features:
1. Allow users to un-mark "answered prayers" (deselect by accident)
2. Share Battle Verses to the community feed
3. Share prayers to the community feed
4. Add a full Bible reader for complete scripture access

---

## 1. Deselect "Answered Prayers" Feature

**Current Issue**: Once a prayer is marked as "answered," there's no way to undo this. Users may accidentally tap the button and want to reverse it.

**Changes Required**:

**src/hooks/usePrayers.ts**
- Add new function `unmarkAnswered(id: string)` that sets `answered = false`, clears `answered_date` and `answered_note`

**src/components/prayer/PrayerCard.tsx**
- Add an "Undo" or "Unmark" button that appears on answered prayers
- Shows in the answered badge section (e.g., small "Undo" link)
- Triggers the new unmark function

**src/pages/Prayer.tsx**
- Add handler `handleUnmarkAnswered` to pass the new function to PrayerCard

---

## 2. Share Battle Verses to Community Feed

**Current Behavior**: The VerseDisplay component has a "Share" button that only copies to clipboard or uses native OS share. It does NOT post to the in-app community feed.

**Changes Required**:

**src/components/feelings/VerseDisplay.tsx**
- Add "Share to Community" option in the share flow
- Create a dialog to compose a post with the verse pre-attached
- Pass verse reference and text to the CreatePostDialog or a new ShareToFeedDialog

**New Component: src/components/feed/ShareVerseToFeedDialog.tsx**
- A dialog for sharing a verse to the feed
- Pre-populates with the verse text and reference
- Allows user to add their own thoughts/commentary
- Uses `createPost` from useCommunityFeed with verse data in content_data

**src/hooks/useCommunityFeed.ts**
- Ensure `createPost` can handle a `verse` post type or `content_data` that includes verse info

---

## 3. Share Prayers to Community Feed

**Current Behavior**: Prayers are personal and stored in the `prayers` table. Users can share to Squad prayer wall via `usePrayerSocial` but NOT to the main community feed.

**Changes Required**:

**src/components/prayer/PrayerCard.tsx**
- Add "Share to Feed" button/option
- Opens a dialog to share the prayer as a post

**New Component: src/components/prayer/SharePrayerToFeedDialog.tsx**
- A dialog that lets users share their prayer to the community feed
- Options: Share as-is or add context
- Uses `createPost` with prayer_request type and includes prayer content

**src/pages/Prayer.tsx**
- Wire up the new share dialog

---

## 4. Full Bible Access

**Current Behavior**: The app has:
- A "Scripture" page (Armory) that shows random verses, search by reference, and verse of the day
- An edge function `fetch-passage` that can fetch any book/chapter/verse from bible-api.com
- A `useGroupScripture` hook for fetching full chapters

**Approach**: Create a new "Bible" page with:
- Book selector (Old Testament / New Testament)
- Chapter selector
- Full chapter reading view
- Verse-by-verse navigation
- Save/bookmark functionality

**New Files**:

**src/pages/Bible.tsx**
- Main Bible reader page
- Book/chapter navigation
- Display full chapter text verse-by-verse
- Uses `useGroupScripture` hook for fetching

**New Component: src/components/bible/BookSelector.tsx**
- List of all 66 books organized by Old/New Testament
- Tap to select, then choose chapter

**New Component: src/components/bible/ChapterReader.tsx**
- Displays the chapter text
- Each verse tappable for actions (save, share to feed)

**New Component: src/components/bible/VerseActionSheet.tsx**
- Action sheet when tapping a verse
- Options: Save to Battle Verses, Share to Feed, Copy

**src/App.tsx**
- Add route `/bible` with the Bible page

**src/components/layout/Navigation.tsx** (or relevant nav component)
- Add "Bible" to bottom navigation or menu

---

## Technical Details

### Database Changes
None required - existing tables and edge functions support all features.

### Edge Functions
Already have `fetch-passage` that supports full chapter fetching.

### Post Types
The community feed already supports flexible `content_data` that can include verse info or prayer content.

---

## Implementation Order
1. **Deselect Answered Prayers** - Simple fix, quick win
2. **Share Prayers to Feed** - Moderate, builds on existing post creation
3. **Share Battle Verses to Feed** - Similar pattern to prayers
4. **Full Bible Access** - Largest feature, creates new page and components

---

## Summary of Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| src/hooks/usePrayers.ts | Modify | Add `unmarkAnswered` function |
| src/components/prayer/PrayerCard.tsx | Modify | Add undo button + share to feed button |
| src/pages/Prayer.tsx | Modify | Wire up new handlers |
| src/components/feed/ShareVerseToFeedDialog.tsx | Create | Dialog for sharing verses to feed |
| src/components/feelings/VerseDisplay.tsx | Modify | Add "Share to Feed" option |
| src/components/prayer/SharePrayerToFeedDialog.tsx | Create | Dialog for sharing prayers to feed |
| src/pages/Bible.tsx | Create | Full Bible reader page |
| src/components/bible/BookSelector.tsx | Create | Book selection UI |
| src/components/bible/ChapterReader.tsx | Create | Chapter display component |
| src/components/bible/VerseActionSheet.tsx | Create | Verse tap actions |
| src/App.tsx | Modify | Add /bible route |
| src/components/layout/Navigation.tsx | Modify | Add Bible nav item |
