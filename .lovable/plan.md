

# Plan: Fix Challenge Progress Tracking & Add Push Notifications

## Problem Analysis

### Challenge Progress Issues (0/7 showing for both users)
Based on my investigation, I found THREE problems preventing challenge progress from tracking:

1. **RLS Policy Blocks Progress Record Creation**: When creating a challenge, the code tries to insert progress records for BOTH users (yourself and opponent). But the RLS policy only allows `auth.uid() = user_id`, so the insert for the opponent fails silently.

2. **Challenge Type Mismatch**: The challenge types stored in the database use **plural** names (`sessions`, `verses`, `prayers`), but when updating progress in Session.tsx, you call `challenge_type: 'session'` (singular). This means the update never finds matching records.

3. **No Progress Records Exist**: The `challenge_progress` table is completely empty because the RLS issue has been blocking all inserts.

### Push Notifications
Currently, the app only supports **foreground browser notifications** (when the browser is open). For true push notifications that work when the app is closed, we need:
- A service worker for background handling
- PWA configuration (manifest, icons)
- Optional: Backend scheduled triggers

---

## Solution

### Part 1: Fix Challenge Progress System

**A. Database Migration - Create SECURITY DEFINER Function for Challenge Creation**

Create a new function that can insert progress records for both participants (bypasses RLS):

```sql
CREATE OR REPLACE FUNCTION public.create_challenge_with_progress(
  _challenger_id uuid,
  _challenged_id uuid,
  _challenge_type text,
  _challenge_name text,
  _target_value integer,
  _end_date date,
  _description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _challenge_id uuid;
BEGIN
  -- Insert the challenge
  INSERT INTO challenges (
    challenger_id, challenged_id, challenge_type,
    challenge_name, target_value, end_date, description, status
  )
  VALUES (
    _challenger_id, _challenged_id, _challenge_type,
    _challenge_name, _target_value, _end_date, _description, 'pending'
  )
  RETURNING id INTO _challenge_id;

  -- Create progress records for BOTH users
  INSERT INTO challenge_progress (challenge_id, user_id, current_value)
  VALUES 
    (_challenge_id, _challenger_id, 0),
    (_challenge_id, _challenged_id, 0);

  RETURN _challenge_id;
END;
$$;
```

**B. Fix Challenge Type Naming in Session.tsx**

Change the call from `'session'` to `'sessions'` (plural) to match database values.

**C. Update useFriends.ts to Use the New RPC**

Replace direct table inserts with the secure RPC call.

---

### Part 2: Add Push Notifications (PWA Setup)

**A. Install PWA Plugin**

Add `vite-plugin-pwa` dependency for service worker generation.

**B. Configure vite.config.ts**

Add PWA configuration with:
- Web app manifest (name, icons, theme colors)
- Service worker with notification handling
- Offline caching strategy

**C. Create Service Worker Handler**

Add notification click handling and background sync capabilities.

**D. Update useNotifications Hook**

Add service worker registration and push subscription management.

**E. Add Install App Page**

Create an `/install` route with instructions for adding to home screen.

---

## Technical Implementation Details

### Files to Create/Modify:

| File | Action | Purpose |
|------|--------|---------|
| `supabase/migrations/*.sql` | Create | New RPC function for challenge creation |
| `src/hooks/useFriends.ts` | Modify | Use RPC instead of direct inserts |
| `src/pages/Session.tsx` | Modify | Fix challenge type from 'session' to 'sessions' |
| `vite.config.ts` | Modify | Add PWA plugin configuration |
| `public/manifest.json` | Create | PWA manifest |
| `src/sw.ts` | Create | Service worker for push notifications |
| `src/hooks/useNotifications.ts` | Modify | Add service worker registration |
| `src/pages/Install.tsx` | Create | Install instructions page |
| `src/App.tsx` | Modify | Add install route |

### Challenge Type Mapping:
| Challenge Preset | Database Type | Session Trigger |
|-----------------|---------------|-----------------|
| Session Sprint | `sessions` | Training completion |
| Prayer Warrior | `prayers` | Prayer logged |
| Scripture Showdown | `verses` | Verse saved |
| 7-Day Streak | `streak` | Daily streak |

---

## Expected Outcomes

After implementation:
1. Challenge progress will correctly track when either user completes activities
2. The progress bars will update in real-time
3. Users can enable push notifications that work even when the browser is closed
4. The app can be installed to the home screen on mobile devices

