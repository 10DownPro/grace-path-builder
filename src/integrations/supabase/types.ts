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
      prayers: {
        Row: {
          answered: boolean
          answered_date: string | null
          answered_note: string | null
          content: string
          created_at: string
          id: string
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
          updated_at: string
          user_id: string
          weekly_goal: number
        }
        Insert: {
          book_code_used?: string | null
          commitment?: string
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
          updated_at?: string
          user_id: string
          weekly_goal?: number
        }
        Update: {
          book_code_used?: string | null
          commitment?: string
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
          updated_at?: string
          user_id?: string
          weekly_goal?: number
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
      user_progress: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_session_date: string | null
          longest_streak: number
          total_minutes: number
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
          total_sessions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
    }
    Views: {
      public_profiles: {
        Row: {
          commitment: string | null
          created_at: string | null
          focus_areas: string[] | null
          id: string | null
          name: string | null
          preferred_time: string | null
          updated_at: string | null
          user_id: string | null
          weekly_goal: number | null
        }
        Insert: {
          commitment?: string | null
          created_at?: string | null
          focus_areas?: string[] | null
          id?: string | null
          name?: string | null
          preferred_time?: string | null
          updated_at?: string | null
          user_id?: string | null
          weekly_goal?: number | null
        }
        Update: {
          commitment?: string | null
          created_at?: string | null
          focus_areas?: string[] | null
          id?: string | null
          name?: string | null
          preferred_time?: string | null
          updated_at?: string | null
          user_id?: string | null
          weekly_goal?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
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
