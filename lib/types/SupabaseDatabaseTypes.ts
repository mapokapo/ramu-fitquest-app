export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      challenges: {
        Row: {
          challenge_code: string;
          created_at: string;
          id: number;
          max_units: number;
          min_units: number;
          reward_multiplier: number;
        };
        Insert: {
          challenge_code: string;
          created_at?: string;
          id?: number;
          max_units: number;
          min_units: number;
          reward_multiplier: number;
        };
        Update: {
          challenge_code?: string;
          created_at?: string;
          id?: number;
          max_units?: number;
          min_units?: number;
          reward_multiplier?: number;
        };
        Relationships: [];
      };
      daily_challenges: {
        Row: {
          challenge_id: number;
          created_at: string;
          date: string;
          id: number;
          units: number;
        };
        Insert: {
          challenge_id: number;
          created_at?: string;
          date: string;
          id?: number;
          units: number;
        };
        Update: {
          challenge_id?: number;
          created_at?: string;
          date?: string;
          id?: number;
          units?: number;
        };
        Relationships: [
          {
            foreignKeyName: "daily_challenges_challenge_id_fkey";
            columns: ["challenge_id"];
            isOneToOne: false;
            referencedRelation: "challenges";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          points: number;
          profile_picture_url: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          points?: number;
          profile_picture_url?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          points?: number;
          profile_picture_url?: string | null;
        };
        Relationships: [];
      };
      user_challenges: {
        Row: {
          created_at: string;
          daily_challenge_id: number;
          id: number;
          progress: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          daily_challenge_id: number;
          id?: number;
          progress?: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          daily_challenge_id?: number;
          id?: number;
          progress?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_challenges_daily_challenge_id_fkey";
            columns: ["daily_challenge_id"];
            isOneToOne: false;
            referencedRelation: "daily_challenges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_challenges_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_daily_challenge: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      delete_your_account: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      get_user_leaderboard_position: {
        Args: {
          user_id: string;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
