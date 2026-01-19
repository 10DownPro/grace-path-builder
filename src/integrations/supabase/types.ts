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
          commitment: string
          created_at: string
          focus_areas: string[] | null
          id: string
          name: string
          preferred_time: string
          updated_at: string
          user_id: string
          weekly_goal: number
        }
        Insert: {
          commitment?: string
          created_at?: string
          focus_areas?: string[] | null
          id?: string
          name?: string
          preferred_time?: string
          updated_at?: string
          user_id: string
          weekly_goal?: number
        }
        Update: {
          commitment?: string
          created_at?: string
          focus_areas?: string[] | null
          id?: string
          name?: string
          preferred_time?: string
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
          worship_completed?: boolean
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
