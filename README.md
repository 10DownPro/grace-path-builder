# Faith Training App

> Build your faith like you build your body - Daily spiritual training, measurable progress, real accountability.

A mobile-first gamified Christian discipleship app that helps believers ages 18-40 build consistent spiritual habits through structured 4-part daily training sessions, topical Scripture search, and social accountability.

---

## 🎯 Vision

Faith Training transforms sporadic spiritual interest into consistent, measurable daily discipleship habits. Think "Duolingo for faith" - structured, gamified, and motivating.

---

## 📱 Core Features

### 1. Daily 4-Part Training (The 4 Pillars of Faith)
Complete structured sessions in 20 minutes:
- **🎵 Worship** (15 min) - Begin with praise via curated YouTube playlists
- **📖 Scripture** (10 min) - Read from perpetual reading plans (Gospel, Psalms, One Year Bible)
- **🙏 Prayer** (10 min) - Journal using ACTS framework (Adoration, Confession, Thanksgiving, Supplication)
- **✍️ Reflection** (5 min) - Apply Scripture to life with guided prompts

### 2. Topical Scripture Search (Battle Verses)
Find Bible verses for 28 life situations instantly:
- Everyday struggles: Anxiety, Doubt, Anger, Confusion, Loneliness
- Relationships: Marriage, Parenting, Friendship, Conflict
- Direction: Career, Purpose, Life Transitions
- Crisis categories: Include professional resources (988 hotline, Crisis Text Line)
- **100% free forever** - we never paywall Scripture

### 3. Streak Tracking & Gamification
- Track consecutive days of training
- Dynamic training button changes by time (Morning Training → Save Your Streak at 11:30pm)
- 7 levels: Recruit → Soldier → Warrior → Veteran → Commander → Champion → Legend
- Points system: Earn from training, prayers, Battle Verses, community engagement
- Rewards shop: Cosmetic items + functional upgrades (streak freezes, XP boosts)
- 40+ milestones: 7-day, 30-day, 100-day streaks and more

### 4. Community & Social Accountability
- **Squads**: Accountability groups with prayer walls, live activity, challenges
- **Friends**: Training partners who encourage each other
- **Community Feed**: Share testimonies, video prayers, encouragements
- **Live Activity**: See who's training now in real-time
- **Prayer Supporters**: Track who's praying for you

### 5. Additional Features
- Video posts: Record 2-3 min prayers, testimonies, encouragements
- Micro-actions: Quick prayers, verse snacks for multiple daily touchpoints
- Challenges: Friend duels and squad competitions
- Family Study Mode: Same passage at 7 reading levels (ages 3-65+)
- Answered prayer tracking & testimony creation
- Daily mystery rewards

---

## 💰 Monetization (Freemium Model)

### Free Forever
- ✅ Unlimited daily training (all 4 steps)
- ✅ All Battle Verses & crisis resources
- ✅ Prayer journal (unlimited)
- ✅ 1 reading plan, 1 squad, 10 friends
- ✅ Save 50 verses
- ✅ 5 posts/week, 2 videos/month
- ✅ All gamification (points, levels, milestones)

### Premium ($4.99/month or $39/year)
- 💎 Unlimited reading plans (run multiple simultaneously)
- 💎 Unlimited saved verses + custom collections
- 💎 Unlimited squads, friends, posts, videos
- 💎 Family study mode (7 reading levels)
- 💎 Advanced analytics & lifetime stats
- 💎 Ad-free, offline mode
- 💎 3 streak freezes/month, 2X points weekends

### Lifetime Premium (Book Purchase)
- 📖 "Faith Training Guide" book ($24.99)
- Includes redemption code for lifetime premium
- Creates book-app ecosystem (drives both revenues)

**Target Conversion:** 20-28% of active users become paying customers

---

## 🎨 Design System

### Brand Aesthetic
**Gritty Industrial** - Fitness training meets spiritual warfare

- NOT soft/pastel/calm
- Bold, aggressive, "NO DAYS OFF" energy
- Think: CrossFit meets prayer, drill sergeant meets pastor

### Colors
```css
Primary:     #E87722  /* Burnt Orange - CTAs, streaks */
Secondary:   #4A5568  /* Steel Gray - borders, inactive */
Accent:      #3D8B61  /* Gritty Green - success states */
Background:  #1E1E1E  /* Dark Charcoal - main background */
Surface:     #292929  /* Lighter Gray - cards */
Text:        #F2F2F2  /* Off-White - primary text */
Warning:     #F5C842  /* Caution Yellow - streak danger */
Error:       #DC2626  /* Red - broken streaks, crisis */
```

### Typography
- **Headlines:** Oswald Bold, UPPERCASE, tracking-tight
  - H1: 32px mobile, H2: 24px, H3: 20px
- **Body:** Inter Regular, 16px base
- **Stats/Numbers:** Oswald at large sizes for impact

### Design Principles
- Heavy 2-4px borders (industrial look)
- 3D button press effects (tactile feel)
- Thick progress bars (8-12px, visible progress)
- Uppercase commanding headers
- Dark theme with burnt orange accents

---

## 🏗️ Technical Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animations:** Framer Motion
- **PWA:** Installable, offline-capable
- **Mobile-First:** Bottom tab navigation, touch-optimized

### Backend
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email, Google, Apple)
- **Storage:** Supabase Storage (videos, images)
- **Realtime:** Supabase Realtime (live squad activity)
- **Functions:** Supabase Edge Functions

### Integrations
- **YouTube API:** Worship video playlists
- **Stripe:** Premium subscriptions
- **Email:** Resend/SendGrid (launch notifications)
- **Analytics:** Plausible or Google Analytics

### Hosting
- **Platform:** Vercel or Netlify
- **Domain:** dailydesciple.com
- **SSL:** Automatic HTTPS

---

## 📊 Database Schema (Key Tables)

### Core Tables
```sql
users                      -- User accounts, streaks, points, level
training_sessions          -- Daily session tracking (4 steps)
reading_plans              -- Available Bible reading plans
user_reading_progress      -- User progress in plans
scripture_readings         -- Daily Scripture passages (4 translations)
prayers                    -- ACTS prayer journal
reflection_prompts         -- Prompts linked to Scripture
feeling_categories         -- 28 Battle Verses categories
battle_verses              -- 600+ verses organized by topic
saved_verses               -- User's saved verses
```

### Social Tables
```sql
community_feed_posts       -- User posts, testimonies, videos
feed_reactions             -- Reactions (🔥🙏💪❤️)
feed_comments              -- Comments on posts
post_videos                -- Video uploads
squads                     -- Accountability groups
squad_members              -- Squad membership
friendships                -- Training partners
prayer_supporters          -- Who's praying for whom
```

### Gamification Tables
```sql
milestones                 -- 40+ achievements
user_milestones            -- User milestone progress
rewards_catalog            -- Rewards shop items
user_rewards_inventory     -- User's purchased rewards
challenges                 -- Friend/squad competitions
challenge_participants     -- Challenge leaderboards
```

### Premium Tables
```sql
user_subscriptions         -- Premium status, Stripe IDs
book_codes                 -- Lifetime premium codes
feature_gates              -- Free vs premium limits
user_feature_usage         -- Usage tracking
```

### Moderation Tables
```sql
flagged_content            -- Auto-flagged posts
crisis_resources           -- 988 hotline, Crisis Text Line
```

**All tables have Row Level Security (RLS) enabled**

---

## 🚀 MVP Build Priority

### Phase 1 - Core Loop (Build First)
1. ✅ Authentication (signup, login, Google/Apple)
2. ✅ Onboarding flow (4 screens, reading plan selection)
3. ✅ Home dashboard with dynamic training button
4. ✅ Daily 4-part training (Worship → Scripture → Prayer → Reflection)
5. ✅ Streak tracking (basic counter, milestones)
6. ✅ Battle Verses (10 categories, 100 verses MVP)
7. ✅ Prayer journal (ACTS framework)
8. ✅ Profile with stats

### Phase 2 - Social & Engagement
9. ✅ Community feed (posts, reactions, comments)
10. ✅ Squads (join, prayer wall, basic)
11. ✅ Gamification (points, levels, milestones)
12. ✅ Premium paywall triggers
13. ✅ Book code redemption

### Phase 3 - Advanced Features
14. ✅ Video posts (record/upload)
15. ✅ Challenges (friend/squad)
16. ✅ Rewards shop
17. ✅ Family study mode
18. ✅ Admin panel (moderation, codes)

---

## 🎯 Target Users

### Primary: Individual Christians (B2C)
- **Age:** 18-40 years old
- **Pain Point:** Want spiritual growth but lack structure and consistency
- **Desire:** Measurable progress, daily accountability, biblical guidance
- **Behavior:** Respond well to gamification, value community support

### User Personas

**Sarah (27, Marketing Manager)**
- Struggles with devotional consistency despite good intentions
- Needs structure and reminders
- Values progress tracking and visual feedback
- Active on social media, loves sharing milestones

**Mike (32, Software Engineer)**
- Wants faith to feel as structured as his fitness routine
- Analytical, loves data and stats
- Seeks accountability from like-minded believers
- Battle Verses user during work stress

**Jessica (24, Teacher)**
- New believer, needs guidance on spiritual disciplines
- Overwhelmed by "just read your Bible" advice
- Wants community and encouragement
- Family study mode for teaching kids

### Secondary: Families & Small Groups
- Parents wanting age-appropriate Bible study
- Small group leaders needing discussion tools
- Churches looking for discipleship resources (future B2B)

---

## 📈 Success Metrics

### User Acquisition
- **Beta:** 100 users in first 30 days
- **Launch:** 10,000 downloads in 6 months
- **Year 1:** 50,000 active users

### Engagement (North Star Metrics)
- **Daily Active Users (DAU):** 30% of MAU
- **Training Completion Rate:** 75%+ complete all 4 steps
- **Average Streak Length:** 12+ days
- **Day 7 Retention:** 40%+
- **Day 30 Retention:** 20%+

### Monetization
- **Premium Conversion:** 20-28% of active users
- **Book Sales:** 5-8% of users
- **Average LTV:** $45-60 per paying user
- **Target Revenue:** $50k MRR within 18 months

### Community Health
- **Squad Participation:** 60% of users join a squad
- **Prayer Engagement:** 40% log prayers weekly
- **Battle Verses Usage:** 70% search verses within first month
- **Testimony Sharing:** 15% share testimonies

---

## 🛡️ Content Moderation & Safety

### Legal Protection
- **Disclaimers:** "This app provides spiritual support, NOT mental health treatment"
- **Terms of Service:** Clear liability limitations
- **Privacy Policy:** COPPA-compliant for family mode
- **User Agreement:** Required acknowledgment during onboarding

### Crisis Support
**4 Crisis Categories** (Suicidal Thoughts, Self-Harm, Abuse, Severe Depression):
- Display crisis resources FIRST (before verses):
  - 📞 Call 988 (Suicide & Crisis Lifeline)
  - 📱 Text HOME to 741741 (Crisis Text Line)
  - 🚨 Call 911 for emergencies
- Prominent disclaimer on every page
- User must tap "I Understand - Show Verses" to proceed

### Auto-Moderation
- **50-100 keywords** trigger auto-flag (suicide, self-harm, abuse, violence)
- Severity levels: high/medium/low
- Moderator review queue for flagged content
- User report button on all posts

### Human Moderation
- Admin dashboard for flagged content review
- Approve/remove actions with notes
- User warnings and suspension capability

---

## 🔐 Security & Privacy

### Authentication
- Supabase Auth (email/password, Google OAuth, Apple Sign-In)
- Email verification required
- Password reset flow
- Session management

### Row Level Security (RLS)
- **Enabled on ALL tables**
- Users can only access their own data
- Squad members can only see squad content
- Admins have elevated permissions
- Public insert for waitlist only

### Data Protection
- Input validation (XSS protection)
- Rate limiting on API endpoints
- Encrypted storage (Supabase default)
- GDPR-compliant data export/deletion
- COPPA-compliant for family mode (parental consent required)

---

## 📱 Mobile-First Design

### Navigation
- **Bottom Tab Bar:** Home, Feed, Prayer, Squad, Profile
- Fixed position, always visible
- Thumb-friendly zones (important actions in bottom 2/3)
- Large tap targets (minimum 44x44px)

### Interactions
- Touch-optimized (no hover states as primary)
- Swipe gestures (swipe to delete, swipe between tabs)
- Pull-to-refresh on feeds
- Modal sheets (slide up from bottom)
- Native keyboard handling

### Performance
- Lazy load images below fold
- WebP format for images
- Service worker for offline capability
- Cached content (reading plans, saved verses)
- Target: <2 second load time

### Responsive Breakpoints
- **Mobile:** <768px (single column, stack)
- **Tablet:** 768px-1024px (2 columns)
- **Desktop:** >1024px (3 columns, but secondary)

---

## 🧪 Testing Strategy

### Unit Tests
- Form validation (email, password strength)
- Database queries (CRUD operations)
- RLS policies (access control)
- Point calculation logic
- Streak tracking logic

### Integration Tests
- Complete training session flow
- Signup → Onboarding → First training
- Premium upgrade flow
- Book code redemption
- Video upload and playback

### Manual Testing Checklist
- [ ] Daily training (all 4 steps complete)
- [ ] Streak continues when all steps done
- [ ] Streak breaks when steps missed
- [ ] Grace day saves missed streak
- [ ] Battle Verses search and save
- [ ] Crisis categories show resources first
- [ ] Community feed (post, react, comment)
- [ ] Squad join and prayer wall
- [ ] Video recording and upload
- [ ] Premium paywall triggers
- [ ] Book code unlocks lifetime premium
- [ ] Admin moderation queue works
- [ ] Mobile responsive (iPhone, Android)
- [ ] Offline mode (cached content)

### Browser Testing
- Chrome (primary)
- Safari (iOS users)
- Firefox
- Edge

### Device Testing
- iPhone 12, 13, 14 (iOS 16+)
- Samsung Galaxy S21, S22 (Android 12+)
- iPad (tablet view)

---

## 🚀 Launch Strategy

### Beta Launch (Weeks 1-4)
- Invite-only: 20-30 beta testers (friends, family, church)
- Focus: First training completion, streak retention
- Gather feedback on core loop
- Fix critical bugs

### Soft Launch (Weeks 5-8)
- Public waitlist (target: 1,000 signups)
- Early access for first 100 signups
- Limited features (Phase 1 only)
- Monitor engagement metrics

### Public Launch (Week 9+)
- Product Hunt launch
- Social media campaign (Instagram, TikTok)
- Christian influencer partnerships
- Church partnerships (bulk signups)
- Book pre-orders with app code

### Marketing Channels
1. **Product Hunt:** Launch day feature
2. **Social Media:** Instagram Reels, TikTok videos showing app
3. **Content Marketing:** Blog posts on spiritual disciplines
4. **Influencers:** Partner with Christian content creators
5. **Churches:** Bulk codes for youth groups, small groups
6. **Podcast Ads:** Christian podcasts (Tim Keller, The Bible Project)
7. **SEO:** Rank for "Christian habit app", "daily devotional app"

### Book Launch Strategy
- "Faith Training Guide" ($24.99) includes lifetime premium code
- Drives book sales AND app adoption
- Amazon, Christian bookstores, church bulk orders
- Pre-order campaign with early bird discount

---

## 🗺️ Roadmap

### Q1 2026 - MVP Launch
- ✅ Core 4-part training
- ✅ Battle Verses (100 verses, 10 categories)
- ✅ Basic gamification
- ✅ Squads & friends
- ✅ Community feed
- ✅ Premium paywall
- 🎯 **Goal:** 100 active users, 7-day retention 40%+

### Q2 2026 - Growth & Engagement
- ⏳ Expand Battle Verses (600 verses, 28 categories)
- ⏳ Video posts feature
- ⏳ Challenges (friend/squad)
- ⏳ Rewards shop
- ⏳ Mobile apps (iOS/Android native)
- 🎯 **Goal:** 1,000 active users, 20% premium conversion

### Q3 2026 - Advanced Features
- ⏳ Family study mode (7 reading levels)
- ⏳ Advanced analytics dashboard
- ⏳ Offline mode (full cache)
- ⏳ Audio Bible integration
- ⏳ Devotional content (curated series)
- 🎯 **Goal:** 5,000 active users, book launch

### Q4 2026 - B2B Expansion
- ⏳ Ministry leader dashboard
- ⏳ Church group licenses
- ⏳ Custom reading plans (user-created)
- ⏳ API for third-party integrations
- 🎯 **Goal:** 10,000 active users, 5 church partnerships

### 2027+ - Scale & Expand
- Multi-language support (Spanish, Portuguese)
- AI-powered personalized reading plans
- Live group study sessions
- Podcast integration (in-app)
- Marketplace for user-created content

---

## 🤝 Contributing

### For Developers
This project is currently in private beta. If you're interested in contributing:
1. Email: hello@dailydesciple.com
2. Include: Your background, why you're interested, how you'd like to help

### For Content Creators
We need:
- Bible scholars for verse curation
- Pastors for devotional review
- Counselors for crisis resource validation

### For Beta Testers
Sign up for the waitlist: https://dailydesciple.com

---

## 📞 Contact & Support

### General Inquiries
- **Email:** hello@dailydesciple.com
- **Website:** https://dailydesciple.com
- **Support:** support@dailydesciple.com

### Social Media
- **Instagram:** @faithtrainingapp
- **TikTok:** @faithtrainingapp
- **YouTube:** Faith Training
- **Twitter/X:** @faithtrainingapp

### Crisis Resources
If you're in crisis, please contact:
- **988 Suicide & Crisis Lifeline:** Call or text 988
- **Crisis Text Line:** Text HOME to 741741
- **Emergency:** Call 911

---

## 📄 License

Copyright © 2026 Faith Training. All rights reserved.

This is proprietary software. Unauthorized copying, distribution, or use is prohibited.

---

## 🙏 Acknowledgments

Built with:
- ❤️ Love for Christ and His church
- 🔥 Passion for discipleship
- 💪 Commitment to helping believers grow

**"Therefore, go and make disciples of all nations..."** - Matthew 28:19

---

**Version:** 1.0.0 (MVP)  
**Last Updated:** January 2026  
**Status:** Pre-Launch Beta

---

*Faith Training - Build Your Faith Like You Build Your Body*
