export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      battle_verses_daily: {
        Row: {
          background_image_url: string | null
          created_at: string
          id: string
          theme: string
          verse_date: string
          verse_reference: string
          verse_text_esv: string | null
          verse_text_kjv: string
          verse_text_niv: string | null
          verse_text_nlt: string | null
        }
        Insert: {
          background_image_url?: string | null
          created_at?: string
          id?: string
          theme?: string
          verse_date: string
          verse_reference: string
          verse_text_esv?: string | null
          verse_text_kjv: string
          verse_text_niv?: string | null
          verse_text_nlt?: string | null
        }
        Update: {
          background_image_url?: string | null
          created_at?: string
          id?: string
          theme?: string
          verse_date?: string
          verse_reference?: string
          verse_text_esv?: string | null
          verse_text_kjv?: string
          verse_text_niv?: string | null
          verse_text_nlt?: string | null
        }
        Relationships: []
      }
      bible_passages: {
        Row: {
          book: string
          chapter: number
          created_at: string | null
          display_order: number | null
          id: string
          is_popular: boolean | null
          passage_name: string
          passage_theme: string | null
          verse_end: number | null
          verse_start: number | null
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_popular?: boolean | null
          passage_name: string
          passage_theme?: string | null
          verse_end?: number | null
          verse_start?: number | null
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_popular?: boolean | null
          passage_name?: string
          passage_theme?: string | null
          verse_end?: number | null
          verse_start?: number | null
        }
        Relationships: []
      }
      book_code_attempts: {
        Row: {
          attempted_at: string
          id: string
          user_id: string
          was_successful: boolean
        }
        Insert: {
          attempted_at?: string
          id?: string
          user_id: string
          was_successful?: boolean
        }
        Update: {
          attempted_at?: string
          id?: string
          user_id?: string
          was_successful?: boolean
        }
        Relationships: []
      }
      book_codes: {
        Row: {
          batch_number: number | null
          book_edition: string | null
          code: string
          created_at: string
          id: string
          is_redeemed: boolean
          redeemed_at: string | null
          redeemed_by_user_id: string | null
        }
        Insert: {
          batch_number?: number | null
          book_edition?: string | null
          code: string
          created_at?: string
          id?: string
          is_redeemed?: boolean
          redeemed_at?: string | null
          redeemed_by_user_id?: string | null
        }
        Update: {
          batch_number?: number | null
          book_edition?: string | null
          code?: string
          created_at?: string
          id?: string
          is_redeemed?: boolean
          redeemed_at?: string | null
          redeemed_by_user_id?: string | null
        }
        Relationships: []
      }
      challenge_progress: {
        Row: {
          challenge_id: string
          current_value: number
          id: string
          last_updated: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          current_value?: number
          id?: string
          last_updated?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          current_value?: number
          id?: string
          last_updated?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_name: string
          challenge_type: string
          challenged_id: string
          challenger_id: string
          created_at: string
          description: string | null
          end_date: string
          id: string
          start_date: string
          status: string
          target_value: number
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          challenge_name: string
          challenge_type: string
          challenged_id: string
          challenger_id: string
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          start_date?: string
          status?: string
          target_value?: number
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          challenge_name?: string
          challenge_type?: string
          challenged_id?: string
          challenger_id?: string
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          target_value?: number
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: []
      }
      community_feed_posts: {
        Row: {
          answered_at: string | null
          answered_testimony: string | null
          comment_count: number | null
          content_data: Json
          created_at: string | null
          edited_at: string | null
          engagement_score: number | null
          id: string
          is_answered: boolean | null
          is_deleted: boolean | null
          is_pinned: boolean | null
          is_user_generated: boolean | null
          link_preview_data: Json | null
          media_type: string | null
          media_url: string | null
          mentioned_users: string[] | null
          poll_data: Json | null
          poll_expires_at: string | null
          post_text: string | null
          post_type: string
          prayer_count: number | null
          prayer_urgency: string | null
          reaction_count: number | null
          share_count: number | null
          squad_id: string | null
          tags: string[] | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          answered_at?: string | null
          answered_testimony?: string | null
          comment_count?: number | null
          content_data?: Json
          created_at?: string | null
          edited_at?: string | null
          engagement_score?: number | null
          id?: string
          is_answered?: boolean | null
          is_deleted?: boolean | null
          is_pinned?: boolean | null
          is_user_generated?: boolean | null
          link_preview_data?: Json | null
          media_type?: string | null
          media_url?: string | null
          mentioned_users?: string[] | null
          poll_data?: Json | null
          poll_expires_at?: string | null
          post_text?: string | null
          post_type: string
          prayer_count?: number | null
          prayer_urgency?: string | null
          reaction_count?: number | null
          share_count?: number | null
          squad_id?: string | null
          tags?: string[] | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          answered_at?: string | null
          answered_testimony?: string | null
          comment_count?: number | null
          content_data?: Json
          created_at?: string | null
          edited_at?: string | null
          engagement_score?: number | null
          id?: string
          is_answered?: boolean | null
          is_deleted?: boolean | null
          is_pinned?: boolean | null
          is_user_generated?: boolean | null
          link_preview_data?: Json | null
          media_type?: string | null
          media_url?: string | null
          mentioned_users?: string[] | null
          poll_data?: Json | null
          poll_expires_at?: string | null
          post_text?: string | null
          post_type?: string
          prayer_count?: number | null
          prayer_urgency?: string | null
          reaction_count?: number | null
          share_count?: number | null
          squad_id?: string | null
          tags?: string[] | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_feed_posts_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      crisis_resources: {
        Row: {
          category_id: string | null
          contact_info: string | null
          country: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_emergency: boolean | null
          name: string | null
          resource_type: string | null
        }
        Insert: {
          category_id?: string | null
          contact_info?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_emergency?: boolean | null
          name?: string | null
          resource_type?: string | null
        }
        Update: {
          category_id?: string | null
          contact_info?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_emergency?: boolean | null
          name?: string | null
          resource_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crisis_resources_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "feeling_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_micro_goals: {
        Row: {
          bonus_claimed: boolean | null
          completed_breath_prayers: number | null
          completed_encouragements: number | null
          completed_gratitude: number | null
          completed_prayers: number | null
          completed_verses: number | null
          created_at: string | null
          encouragements_goal: number | null
          goal_date: string | null
          id: string
          quick_prayers_goal: number | null
          user_id: string
          verse_snacks_goal: number | null
        }
        Insert: {
          bonus_claimed?: boolean | null
          completed_breath_prayers?: number | null
          completed_encouragements?: number | null
          completed_gratitude?: number | null
          completed_prayers?: number | null
          completed_verses?: number | null
          created_at?: string | null
          encouragements_goal?: number | null
          goal_date?: string | null
          id?: string
          quick_prayers_goal?: number | null
          user_id: string
          verse_snacks_goal?: number | null
        }
        Update: {
          bonus_claimed?: boolean | null
          completed_breath_prayers?: number | null
          completed_encouragements?: number | null
          completed_gratitude?: number | null
          completed_prayers?: number | null
          completed_verses?: number | null
          created_at?: string | null
          encouragements_goal?: number | null
          goal_date?: string | null
          id?: string
          quick_prayers_goal?: number | null
          user_id?: string
          verse_snacks_goal?: number | null
        }
        Relationships: []
      }
      daily_spin_tracking: {
        Row: {
          has_spun_today: boolean | null
          id: string
          spin_date: string | null
          spin_result_reward_id: string | null
          spun_at: string | null
          user_id: string
        }
        Insert: {
          has_spun_today?: boolean | null
          id?: string
          spin_date?: string | null
          spin_result_reward_id?: string | null
          spun_at?: string | null
          user_id: string
        }
        Update: {
          has_spun_today?: boolean | null
          id?: string
          spin_date?: string | null
          spin_result_reward_id?: string | null
          spun_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_spin_tracking_spin_result_reward_id_fkey"
            columns: ["spin_result_reward_id"]
            isOneToOne: false
            referencedRelation: "mystery_rewards_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      encouragements: {
        Row: {
          created_at: string
          encouragement_type: string | null
          from_user_id: string
          id: string
          is_read: boolean | null
          message: string
          to_user_id: string
        }
        Insert: {
          created_at?: string
          encouragement_type?: string | null
          from_user_id: string
          id?: string
          is_read?: boolean | null
          message: string
          to_user_id: string
        }
        Update: {
          created_at?: string
          encouragement_type?: string | null
          from_user_id?: string
          id?: string
          is_read?: boolean | null
          message?: string
          to_user_id?: string
        }
        Relationships: []
      }
      feature_gates: {
        Row: {
          created_at: string
          description: string | null
          feature_name: string
          free_tier_limit: number | null
          requires_premium: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          feature_name: string
          free_tier_limit?: number | null
          requires_premium?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          feature_name?: string
          free_tier_limit?: number | null
          requires_premium?: boolean
        }
        Relationships: []
      }
      feed_comments: {
        Row: {
          comment_text: string
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_feed_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_feed_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_shares: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          shared_by_user_id: string
          shared_to_squad_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          shared_by_user_id: string
          shared_to_squad_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          shared_by_user_id?: string
          shared_to_squad_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_shares_shared_to_squad_id_fkey"
            columns: ["shared_to_squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      feeling_categories: {
        Row: {
          category_type: string | null
          created_at: string | null
          description: string | null
          emoji: string | null
          id: string
          is_crisis: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          category_type?: string | null
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          id: string
          is_crisis?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          category_type?: string | null
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          id?: string
          is_crisis?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      feeling_verses: {
        Row: {
          book: string
          category_id: string | null
          chapter: number
          context_note: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_power_verse: boolean | null
          reference: string
          relevance_score: number | null
          text_esv: string | null
          text_kjv: string | null
          text_niv: string | null
          text_nlt: string | null
          times_saved: number | null
          times_shown: number | null
          updated_at: string | null
          verse_end: number | null
          verse_start: number
        }
        Insert: {
          book: string
          category_id?: string | null
          chapter: number
          context_note?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_power_verse?: boolean | null
          reference: string
          relevance_score?: number | null
          text_esv?: string | null
          text_kjv?: string | null
          text_niv?: string | null
          text_nlt?: string | null
          times_saved?: number | null
          times_shown?: number | null
          updated_at?: string | null
          verse_end?: number | null
          verse_start: number
        }
        Update: {
          book?: string
          category_id?: string | null
          chapter?: number
          context_note?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_power_verse?: boolean | null
          reference?: string
          relevance_score?: number | null
          text_esv?: string | null
          text_kjv?: string | null
          text_niv?: string | null
          text_nlt?: string | null
          times_saved?: number | null
          times_shown?: number | null
          updated_at?: string | null
          verse_end?: number | null
          verse_start?: number
        }
        Relationships: [
          {
            foreignKeyName: "feeling_verses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "feeling_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_discussions: {
        Row: {
          id: string
          is_pinned: boolean | null
          message_text: string
          message_type: string | null
          parent_message_id: string | null
          posted_at: string
          reactions: Json | null
          session_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_pinned?: boolean | null
          message_text: string
          message_type?: string | null
          parent_message_id?: string | null
          posted_at?: string
          reactions?: Json | null
          session_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_pinned?: boolean | null
          message_text?: string
          message_type?: string | null
          parent_message_id?: string | null
          posted_at?: string
          reactions?: Json | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_discussions_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "group_discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_discussions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_member_progress: {
        Row: {
          completed_at: string
          discussion_notes: string | null
          group_id: string
          id: string
          is_approved: boolean | null
          leader_feedback: string | null
          questions_for_group: string | null
          reading_level: string
          reflection_text: string | null
          session_id: string
          time_spent_minutes: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          discussion_notes?: string | null
          group_id: string
          id?: string
          is_approved?: boolean | null
          leader_feedback?: string | null
          questions_for_group?: string | null
          reading_level: string
          reflection_text?: string | null
          session_id: string
          time_spent_minutes?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          discussion_notes?: string | null
          group_id?: string
          id?: string
          is_approved?: boolean | null
          leader_feedback?: string | null
          questions_for_group?: string | null
          reading_level?: string
          reflection_text?: string | null
          session_id?: string
          time_spent_minutes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_member_progress_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_member_progress_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          age_group: string | null
          display_name: string | null
          group_id: string
          id: string
          is_active: boolean | null
          joined_at: string
          reading_level: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          age_group?: string | null
          display_name?: string | null
          group_id: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          reading_level?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          age_group?: string | null
          display_name?: string | null
          group_id?: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          reading_level?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_study_plans: {
        Row: {
          book: string
          chapter_end: number
          chapter_start: number
          created_at: string
          current_chapter: number
          end_date: string | null
          frequency: string | null
          group_id: string
          id: string
          is_active: boolean | null
          plan_name: string
          plan_type: string | null
          start_date: string | null
          study_day: string | null
        }
        Insert: {
          book: string
          chapter_end?: number
          chapter_start?: number
          created_at?: string
          current_chapter?: number
          end_date?: string | null
          frequency?: string | null
          group_id: string
          id?: string
          is_active?: boolean | null
          plan_name: string
          plan_type?: string | null
          start_date?: string | null
          study_day?: string | null
        }
        Update: {
          book?: string
          chapter_end?: number
          chapter_start?: number
          created_at?: string
          current_chapter?: number
          end_date?: string | null
          frequency?: string | null
          group_id?: string
          id?: string
          is_active?: boolean | null
          plan_name?: string
          plan_type?: string | null
          start_date?: string | null
          study_day?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_study_plans_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_study_sessions: {
        Row: {
          book: string
          chapter: number
          completed_by: Json | null
          created_at: string
          discussed: boolean | null
          discussion_time: string | null
          group_id: string
          id: string
          leader_notes: string | null
          plan_id: string | null
          session_date: string | null
          session_title: string | null
        }
        Insert: {
          book: string
          chapter: number
          completed_by?: Json | null
          created_at?: string
          discussed?: boolean | null
          discussion_time?: string | null
          group_id: string
          id?: string
          leader_notes?: string | null
          plan_id?: string | null
          session_date?: string | null
          session_title?: string | null
        }
        Update: {
          book?: string
          chapter?: number
          completed_by?: Json | null
          created_at?: string
          discussed?: boolean | null
          discussion_time?: string | null
          group_id?: string
          id?: string
          leader_notes?: string | null
          plan_id?: string | null
          session_date?: string | null
          session_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_study_sessions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_study_sessions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "group_study_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      live_squad_activity: {
        Row: {
          activity_data: Json | null
          activity_type: string
          ended_at: string | null
          id: string
          is_active: boolean | null
          squad_id: string | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          squad_id?: string | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          squad_id?: string | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_squad_activity_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      micro_actions: {
        Row: {
          action_type: string
          created_at: string | null
          description: string | null
          duration_seconds: number
          icon_emoji: string | null
          id: string
          is_active: boolean | null
          name: string
          points_reward: number
        }
        Insert: {
          action_type: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number
          icon_emoji?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points_reward?: number
        }
        Update: {
          action_type?: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number
          icon_emoji?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points_reward?: number
        }
        Relationships: []
      }
      milestones: {
        Row: {
          created_at: string
          description: string
          display_order: number
          icon_emoji: string
          id: string
          is_active: boolean
          milestone_type: string
          name: string
          requirement_type: string
          requirement_value: number
          reward_message: string | null
          scripture_reference: string | null
          scripture_text: string | null
          tier: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          icon_emoji?: string
          id?: string
          is_active?: boolean
          milestone_type: string
          name: string
          requirement_type: string
          requirement_value: number
          reward_message?: string | null
          scripture_reference?: string | null
          scripture_text?: string | null
          tier?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          icon_emoji?: string
          id?: string
          is_active?: boolean
          milestone_type?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
          reward_message?: string | null
          scripture_reference?: string | null
          scripture_text?: string | null
          tier?: string
        }
        Relationships: []
      }
      mystery_rewards_catalog: {
        Row: {
          created_at: string | null
          description: string | null
          drop_rate_percentage: number
          icon_emoji: string | null
          id: string
          is_active: boolean | null
          rarity: string
          reward_name: string
          reward_type: string
          reward_value: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          drop_rate_percentage: number
          icon_emoji?: string | null
          id?: string
          is_active?: boolean | null
          rarity: string
          reward_name: string
          reward_type: string
          reward_value?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          drop_rate_percentage?: number
          icon_emoji?: string | null
          id?: string
          is_active?: boolean | null
          rarity?: string
          reward_name?: string
          reward_type?: string
          reward_value?: number | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          last_notified_at: string | null
          preferred_time: string
          push_subscription: Json | null
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          last_notified_at?: string | null
          preferred_time?: string
          push_subscription?: Json | null
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          last_notified_at?: string | null
          preferred_time?: string
          push_subscription?: Json | null
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          reference_id: string | null
          reference_type: string | null
          title: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          reference_id?: string | null
          reference_type?: string | null
          title: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      passage_levels: {
        Row: {
          activity_suggestion: string | null
          created_at: string | null
          discussion_questions: Json | null
          id: string
          key_verse: string | null
          passage_id: string
          prayer_prompt: string | null
          reading_level: string
          summary: string
        }
        Insert: {
          activity_suggestion?: string | null
          created_at?: string | null
          discussion_questions?: Json | null
          id?: string
          key_verse?: string | null
          passage_id: string
          prayer_prompt?: string | null
          reading_level: string
          summary: string
        }
        Update: {
          activity_suggestion?: string | null
          created_at?: string | null
          discussion_questions?: Json | null
          id?: string
          key_verse?: string | null
          passage_id?: string
          prayer_prompt?: string | null
          reading_level?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "passage_levels_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "bible_passages"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_challenges: {
        Row: {
          challenge_name: string
          challenge_type: string
          completed_at: string | null
          created_at: string
          current_value: number | null
          description: string | null
          difficulty_level: string | null
          duration_days: number
          ends_at: string
          icon_emoji: string | null
          id: string
          scripture_motivation: string | null
          started_at: string
          status: string | null
          target_value: number
          user_id: string
        }
        Insert: {
          challenge_name: string
          challenge_type: string
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          description?: string | null
          difficulty_level?: string | null
          duration_days: number
          ends_at: string
          icon_emoji?: string | null
          id?: string
          scripture_motivation?: string | null
          started_at?: string
          status?: string | null
          target_value: number
          user_id: string
        }
        Update: {
          challenge_name?: string
          challenge_type?: string
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          description?: string | null
          difficulty_level?: string | null
          duration_days?: number
          ends_at?: string
          icon_emoji?: string | null
          id?: string
          scripture_motivation?: string | null
          started_at?: string
          status?: string | null
          target_value?: number
          user_id?: string
        }
        Relationships: []
      }
      poll_votes: {
        Row: {
          id: string
          option_index: number
          post_id: string
          user_id: string
          voted_at: string | null
        }
        Insert: {
          id?: string
          option_index: number
          post_id: string
          user_id: string
          voted_at?: string | null
        }
        Update: {
          id?: string
          option_index?: number
          post_id?: string
          user_id?: string
          voted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_feed_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_media: {
        Row: {
          created_at: string | null
          id: string
          media_type: string
          media_url: string
          post_id: string
          thumbnail_url: string | null
          upload_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_type: string
          media_url: string
          post_id: string
          thumbnail_url?: string | null
          upload_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          media_type?: string
          media_url?: string
          post_id?: string
          thumbnail_url?: string | null
          upload_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_media_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_feed_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_comments: {
        Row: {
          comment_text: string
          created_at: string | null
          id: string
          prayer_id: string
          user_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string | null
          id?: string
          prayer_id: string
          user_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string | null
          id?: string
          prayer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_comments_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "prayers"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_interactions: {
        Row: {
          id: string
          post_id: string
          prayed_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          post_id: string
          prayed_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          post_id?: string
          prayed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_interactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_feed_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_reactions: {
        Row: {
          created_at: string | null
          id: string
          prayer_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          prayer_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          prayer_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_reactions_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "prayers"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_supporters: {
        Row: {
          added_to_my_list: boolean | null
          created_at: string | null
          id: string
          last_prayed_at: string | null
          prayed_today: boolean | null
          prayer_id: string
          total_times_prayed: number | null
          user_id: string
        }
        Insert: {
          added_to_my_list?: boolean | null
          created_at?: string | null
          id?: string
          last_prayed_at?: string | null
          prayed_today?: boolean | null
          prayer_id: string
          total_times_prayed?: number | null
          user_id: string
        }
        Update: {
          added_to_my_list?: boolean | null
          created_at?: string | null
          id?: string
          last_prayed_at?: string | null
          prayed_today?: boolean | null
          prayer_id?: string
          total_times_prayed?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_supporters_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "prayers"
            referencedColumns: ["id"]
          },
        ]
      }
      prayers: {
        Row: {
          answered: boolean
          answered_date: string | null
          answered_note: string | null
          content: string
          created_at: string
          id: string
          shared_at: string | null
          shared_to_squad: boolean | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answered?: boolean
          answered_date?: string | null
          answered_note?: string | null
          content: string
          created_at?: string
          id?: string
          shared_at?: string | null
          shared_to_squad?: boolean | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answered?: boolean
          answered_date?: string | null
          answered_note?: string | null
          content?: string
          created_at?: string
          id?: string
          shared_at?: string | null
          shared_to_squad?: boolean | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          book_code_used: string | null
          commitment: string
          community_enabled: boolean | null
          created_at: string
          focus_areas: string[] | null
          friend_code: string | null
          has_book: boolean
          hide_book_promos: boolean
          id: string
          is_premium: boolean
          name: string
          preferred_time: string
          premium_activated_at: string | null
          premium_source: string | null
          show_sensitive_topics: boolean | null
          updated_at: string
          user_id: string
          weekly_goal: number
        }
        Insert: {
          book_code_used?: string | null
          commitment?: string
          community_enabled?: boolean | null
          created_at?: string
          focus_areas?: string[] | null
          friend_code?: string | null
          has_book?: boolean
          hide_book_promos?: boolean
          id?: string
          is_premium?: boolean
          name?: string
          preferred_time?: string
          premium_activated_at?: string | null
          premium_source?: string | null
          show_sensitive_topics?: boolean | null
          updated_at?: string
          user_id: string
          weekly_goal?: number
        }
        Update: {
          book_code_used?: string | null
          commitment?: string
          community_enabled?: boolean | null
          created_at?: string
          focus_areas?: string[] | null
          friend_code?: string | null
          has_book?: boolean
          hide_book_promos?: boolean
          id?: string
          is_premium?: boolean
          name?: string
          preferred_time?: string
          premium_activated_at?: string | null
          premium_source?: string | null
          show_sensitive_topics?: boolean | null
          updated_at?: string
          user_id?: string
          weekly_goal?: number
        }
        Relationships: []
      }
      reported_posts: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          report_details: string | null
          report_reason: string
          reported_by_user_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          report_details?: string | null
          report_reason: string
          reported_by_user_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          report_details?: string | null
          report_reason?: string
          reported_by_user_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reported_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_feed_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number
          icon_emoji: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_premium_only: boolean
          name: string
          point_cost: number
          reward_data: Json | null
          reward_type: string
          stock_limit: number | null
          times_redeemed: number
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          icon_emoji?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_premium_only?: boolean
          name: string
          point_cost: number
          reward_data?: Json | null
          reward_type?: string
          stock_limit?: number | null
          times_redeemed?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          icon_emoji?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_premium_only?: boolean
          name?: string
          point_cost?: number
          reward_data?: Json | null
          reward_type?: string
          stock_limit?: number | null
          times_redeemed?: number
        }
        Relationships: []
      }
      sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_minutes: number
          id: string
          prayer_completed: boolean
          reflection_completed: boolean
          scripture_completed: boolean
          session_date: string
          updated_at: string
          user_id: string
          verses_read: number
          worship_completed: boolean
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          prayer_completed?: boolean
          reflection_completed?: boolean
          scripture_completed?: boolean
          session_date?: string
          updated_at?: string
          user_id: string
          verses_read?: number
          worship_completed?: boolean
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          prayer_completed?: boolean
          reflection_completed?: boolean
          scripture_completed?: boolean
          session_date?: string
          updated_at?: string
          user_id?: string
          verses_read?: number
          worship_completed?: boolean
        }
        Relationships: []
      }
      squad_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string
          id: string
          squad_id: string
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string
          id?: string
          squad_id: string
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string
          id?: string
          squad_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "squad_activities_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      squad_members: {
        Row: {
          id: string
          joined_at: string
          role: string | null
          squad_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string | null
          squad_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string | null
          squad_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "squad_members_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      squad_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          message_type: string | null
          squad_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          message_type?: string | null
          squad_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          message_type?: string | null
          squad_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "squad_messages_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      squad_prayer_requests: {
        Row: {
          answered_at: string | null
          answered_testimony: string | null
          created_at: string
          id: string
          is_answered: boolean | null
          is_private: boolean | null
          prayed_by: Json | null
          prayer_count: number | null
          prayer_request: string
          squad_id: string
          user_id: string
        }
        Insert: {
          answered_at?: string | null
          answered_testimony?: string | null
          created_at?: string
          id?: string
          is_answered?: boolean | null
          is_private?: boolean | null
          prayed_by?: Json | null
          prayer_count?: number | null
          prayer_request: string
          squad_id: string
          user_id: string
        }
        Update: {
          answered_at?: string | null
          answered_testimony?: string | null
          created_at?: string
          id?: string
          is_answered?: boolean | null
          is_private?: boolean | null
          prayed_by?: Json | null
          prayer_count?: number | null
          prayer_request?: string
          squad_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "squad_prayer_requests_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      squad_presence: {
        Row: {
          current_activity: string | null
          id: string
          is_online: boolean | null
          last_active_at: string | null
          squad_id: string | null
          user_id: string
        }
        Insert: {
          current_activity?: string | null
          id?: string
          is_online?: boolean | null
          last_active_at?: string | null
          squad_id?: string | null
          user_id: string
        }
        Update: {
          current_activity?: string | null
          id?: string
          is_online?: boolean | null
          last_active_at?: string | null
          squad_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "squad_presence_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "squads"
            referencedColumns: ["id"]
          },
        ]
      }
      squads: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          icon_emoji: string | null
          id: string
          max_members: number | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          icon_emoji?: string | null
          id?: string
          max_members?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          icon_emoji?: string | null
          id?: string
          max_members?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      streak_protection_log: {
        Row: {
          created_at: string
          id: string
          protected_date: string
          user_id: string
          user_reward_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          protected_date: string
          user_id: string
          user_reward_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          protected_date?: string
          user_id?: string
          user_reward_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "streak_protection_log_user_reward_id_fkey"
            columns: ["user_reward_id"]
            isOneToOne: false
            referencedRelation: "user_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          group_avatar_emoji: string | null
          group_code: string | null
          group_name: string
          group_type: string
          id: string
          is_active: boolean | null
          is_public: boolean | null
          max_members: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          group_avatar_emoji?: string | null
          group_code?: string | null
          group_name: string
          group_type?: string
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_members?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          group_avatar_emoji?: string | null
          group_code?: string | null
          group_name?: string
          group_type?: string
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_members?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          message_text: string
          times_shown: number | null
          tone: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_text: string
          times_shown?: number | null
          tone?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_text?: string
          times_shown?: number | null
          tone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "feeling_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonies: {
        Row: {
          created_at: string | null
          id: string
          is_featured: boolean | null
          media_urls: Json | null
          related_prayer_id: string | null
          related_verse_reference: string | null
          related_verse_text: string | null
          testimony_text: string
          testimony_type: string
          title: string
          updated_at: string | null
          user_id: string
          visibility: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          media_urls?: Json | null
          related_prayer_id?: string | null
          related_verse_reference?: string | null
          related_verse_text?: string | null
          testimony_text: string
          testimony_type: string
          title: string
          updated_at?: string | null
          user_id: string
          visibility?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          media_urls?: Json | null
          related_prayer_id?: string | null
          related_verse_reference?: string | null
          related_verse_text?: string | null
          testimony_text?: string
          testimony_type?: string
          title?: string
          updated_at?: string | null
          user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonies_related_prayer_id_fkey"
            columns: ["related_prayer_id"]
            isOneToOne: false
            referencedRelation: "prayers"
            referencedColumns: ["id"]
          },
        ]
      }
      testimony_comments: {
        Row: {
          comment_text: string
          created_at: string | null
          id: string
          testimony_id: string
          user_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string | null
          id?: string
          testimony_id: string
          user_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string | null
          id?: string
          testimony_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimony_comments_testimony_id_fkey"
            columns: ["testimony_id"]
            isOneToOne: false
            referencedRelation: "testimonies"
            referencedColumns: ["id"]
          },
        ]
      }
      testimony_reactions: {
        Row: {
          created_at: string | null
          id: string
          reaction_type: string
          testimony_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reaction_type: string
          testimony_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reaction_type?: string
          testimony_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimony_reactions_testimony_id_fkey"
            columns: ["testimony_id"]
            isOneToOne: false
            referencedRelation: "testimonies"
            referencedColumns: ["id"]
          },
        ]
      }
      testimony_shares: {
        Row: {
          created_at: string | null
          id: string
          shared_by_user_id: string
          testimony_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          shared_by_user_id: string
          testimony_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          shared_by_user_id?: string
          testimony_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimony_shares_testimony_id_fkey"
            columns: ["testimony_id"]
            isOneToOne: false
            referencedRelation: "testimonies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_book_promotions: {
        Row: {
          clicked: boolean
          dismissed: boolean
          id: string
          promotion_type: string
          shown_at: string
          user_id: string
        }
        Insert: {
          clicked?: boolean
          dismissed?: boolean
          id?: string
          promotion_type: string
          shown_at?: string
          user_id: string
        }
        Update: {
          clicked?: boolean
          dismissed?: boolean
          id?: string
          promotion_type?: string
          shown_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_feature_usage: {
        Row: {
          created_at: string
          feature_name: string
          id: string
          last_used_at: string | null
          period_start: string | null
          reset_period: string | null
          usage_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_name: string
          id?: string
          last_used_at?: string | null
          period_start?: string | null
          reset_period?: string | null
          usage_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          feature_name?: string
          id?: string
          last_used_at?: string | null
          period_start?: string | null
          reset_period?: string | null
          usage_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_feature_usage_feature_name_fkey"
            columns: ["feature_name"]
            isOneToOne: false
            referencedRelation: "feature_gates"
            referencedColumns: ["feature_name"]
          },
        ]
      }
      user_feed_settings: {
        Row: {
          created_at: string | null
          feed_algorithm_preference: string | null
          id: string
          muted_users: Json | null
          show_friends_only: boolean | null
          show_public_feed: boolean | null
          show_squad_only: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feed_algorithm_preference?: string | null
          id?: string
          muted_users?: Json | null
          show_friends_only?: boolean | null
          show_public_feed?: boolean | null
          show_squad_only?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          feed_algorithm_preference?: string | null
          id?: string
          muted_users?: Json | null
          show_friends_only?: boolean | null
          show_public_feed?: boolean | null
          show_squad_only?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          followed_at: string | null
          followed_user_id: string
          follower_user_id: string
          id: string
        }
        Insert: {
          followed_at?: string | null
          followed_user_id: string
          follower_user_id: string
          id?: string
        }
        Update: {
          followed_at?: string | null
          followed_user_id?: string
          follower_user_id?: string
          id?: string
        }
        Relationships: []
      }
      user_micro_actions: {
        Row: {
          action_type: string
          completed_at: string | null
          content_data: Json | null
          id: string
          micro_action_id: string | null
          points_earned: number | null
          session_date: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          completed_at?: string | null
          content_data?: Json | null
          id?: string
          micro_action_id?: string | null
          points_earned?: number | null
          session_date?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          completed_at?: string | null
          content_data?: Json | null
          id?: string
          micro_action_id?: string | null
          points_earned?: number | null
          session_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_micro_actions_micro_action_id_fkey"
            columns: ["micro_action_id"]
            isOneToOne: false
            referencedRelation: "micro_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_milestones: {
        Row: {
          achieved_at: string
          id: string
          is_viewed: boolean
          milestone_id: string
          shared_count: number
          user_id: string
        }
        Insert: {
          achieved_at?: string
          id?: string
          is_viewed?: boolean
          milestone_id: string
          shared_count?: number
          user_id: string
        }
        Update: {
          achieved_at?: string
          id?: string
          is_viewed?: boolean
          milestone_id?: string
          shared_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mystery_rewards: {
        Row: {
          claimed_at: string | null
          id: string
          is_claimed: boolean | null
          reward_id: string | null
          user_id: string
          won_at: string | null
        }
        Insert: {
          claimed_at?: string | null
          id?: string
          is_claimed?: boolean | null
          reward_id?: string | null
          user_id: string
          won_at?: string | null
        }
        Update: {
          claimed_at?: string | null
          id?: string
          is_claimed?: boolean | null
          reward_id?: string | null
          user_id?: string
          won_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_mystery_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "mystery_rewards_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notification_settings: {
        Row: {
          aggressive_mode: boolean | null
          created_at: string | null
          dm_alerts: boolean | null
          final_warning_time: string | null
          id: string
          micro_action_reminders: boolean | null
          prayer_request_alerts: boolean | null
          reminder_time_1: string | null
          reminder_time_2: string | null
          squad_activity_alerts: boolean | null
          streak_reminders_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aggressive_mode?: boolean | null
          created_at?: string | null
          dm_alerts?: boolean | null
          final_warning_time?: string | null
          id?: string
          micro_action_reminders?: boolean | null
          prayer_request_alerts?: boolean | null
          reminder_time_1?: string | null
          reminder_time_2?: string | null
          squad_activity_alerts?: boolean | null
          streak_reminders_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aggressive_mode?: boolean | null
          created_at?: string | null
          dm_alerts?: boolean | null
          final_warning_time?: string | null
          id?: string
          micro_action_reminders?: boolean | null
          prayer_request_alerts?: boolean | null
          reminder_time_1?: string | null
          reminder_time_2?: string | null
          squad_activity_alerts?: boolean | null
          streak_reminders_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_onboarding_progress: {
        Row: {
          completed_at: string | null
          current_step: number | null
          id: string
          started_at: string | null
          steps_completed: Json | null
          tour_completed: boolean | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_step?: number | null
          id?: string
          started_at?: string | null
          steps_completed?: Json | null
          tour_completed?: boolean | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_step?: number | null
          id?: string
          started_at?: string | null
          steps_completed?: Json | null
          tour_completed?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_session_date: string | null
          longest_streak: number
          total_minutes: number
          total_points: number
          total_sessions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_session_date?: string | null
          longest_streak?: number
          total_minutes?: number
          total_points?: number
          total_sessions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_session_date?: string | null
          longest_streak?: number
          total_minutes?: number
          total_points?: number
          total_sessions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          activated_at: string | null
          expires_at: string | null
          id: string
          is_equipped: boolean
          redeemed_at: string
          reward_id: string
          user_id: string
          uses_remaining: number | null
        }
        Insert: {
          activated_at?: string | null
          expires_at?: string | null
          id?: string
          is_equipped?: boolean
          redeemed_at?: string
          reward_id: string
          user_id: string
          uses_remaining?: number | null
        }
        Update: {
          activated_at?: string | null
          expires_at?: string | null
          id?: string
          is_equipped?: boolean
          redeemed_at?: string
          reward_id?: string
          user_id?: string
          uses_remaining?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_saved_verses: {
        Row: {
          category_id: string | null
          id: string
          personal_note: string | null
          saved_at: string | null
          user_id: string
          verse_id: string | null
        }
        Insert: {
          category_id?: string | null
          id?: string
          personal_note?: string | null
          saved_at?: string | null
          user_id: string
          verse_id?: string | null
        }
        Update: {
          category_id?: string | null
          id?: string
          personal_note?: string | null
          saved_at?: string | null
          user_id?: string
          verse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_verses_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "feeling_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          book_code_used: string | null
          created_at: string
          expires_at: string | null
          id: string
          premium_source: string | null
          started_at: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string
          subscription_type: string
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          book_code_used?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          premium_source?: string | null
          started_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string
          subscription_type?: string
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          book_code_used?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          premium_source?: string | null
          started_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string
          subscription_type?: string
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_verse_interactions: {
        Row: {
          category_id: string | null
          helped_rating: number | null
          id: string
          interaction_type: string | null
          user_id: string
          verse_id: string | null
          viewed_at: string | null
        }
        Insert: {
          category_id?: string | null
          helped_rating?: number | null
          id?: string
          interaction_type?: string | null
          user_id: string
          verse_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          category_id?: string | null
          helped_rating?: number | null
          id?: string
          interaction_type?: string | null
          user_id?: string
          verse_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_verse_interactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "feeling_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_verse_interactions_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "feeling_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: string
          notified: boolean | null
          referral_code: string | null
          referred_by: string | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          notified?: boolean | null
          referral_code?: string | null
          referred_by?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          notified?: boolean | null
          referral_code?: string | null
          referred_by?: string | null
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          commitment: string | null
          created_at: string | null
          display_name: string | null
          user_id: string | null
        }
        Insert: {
          commitment?: string | null
          created_at?: string | null
          display_name?: never
          user_id?: string | null
        }
        Update: {
          commitment?: string | null
          created_at?: string | null
          display_name?: never
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      activate_reward: {
        Args: { _user_reward_id: string }
        Returns: {
          expires_at: string
          message: string
          success: boolean
        }[]
      }
      award_points: {
        Args: { _points: number; _reason: string; _user_id: string }
        Returns: number
      }
      check_feature_access: {
        Args: { p_feature_name: string; p_user_id: string }
        Returns: Json
      }
      create_challenge_with_progress: {
        Args: {
          _challenge_name: string
          _challenge_type: string
          _challenged_id: string
          _challenger_id: string
          _description?: string
          _end_date: string
          _target_value: number
        }
        Returns: string
      }
      create_study_group: {
        Args: {
          _description?: string
          _group_avatar_emoji?: string
          _group_name: string
          _group_type: string
        }
        Returns: string
      }
      increment_feature_usage: {
        Args: { p_feature_name: string; p_user_id: string }
        Returns: undefined
      }
      is_squad_member: {
        Args: { _squad_id: string; _user_id: string }
        Returns: boolean
      }
      is_study_group_leader: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
      is_study_group_member: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
      is_user_premium: { Args: { _user_id: string }; Returns: boolean }
      lookup_friend_by_code: {
        Args: { _friend_code: string }
        Returns: {
          display_name: string
          user_id: string
        }[]
      }
      redeem_book_code: {
        Args: { _code: string }
        Returns: {
          code_info: Json
          message: string
          success: boolean
        }[]
      }
      redeem_reward: {
        Args: { _reward_id: string }
        Returns: {
          message: string
          reward_info: Json
          success: boolean
        }[]
      }
      update_challenge_progress: {
        Args: { _challenge_type: string; _increment?: number; _user_id: string }
        Returns: undefined
      }
      use_streak_freeze: {
        Args: { _date: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
