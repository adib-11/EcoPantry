export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserType = 'individual' | 'family' | 'community';
export type ItemStatus = 'fresh' | 'expiring' | 'expired';
export type ResourceCategory = 'tip' | 'recipe' | 'article' | 'video';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          user_type: UserType | null;
          household_size: number | null;
          dietary_preferences: string | null;
          monthly_budget: number | null;
          green_score: number;
          location: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          user_type?: UserType | null;
          household_size?: number | null;
          dietary_preferences?: string | null;
          monthly_budget?: number | null;
          green_score?: number;
          location?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          user_type?: UserType | null;
          household_size?: number | null;
          dietary_preferences?: string | null;
          monthly_budget?: number | null;
          green_score?: number;
          location?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          quantity: number;
          unit: string;
          expiry_date: string | null;
          purchase_date: string | null;
          cost: number | null;
          image_url: string | null;
          batch: string | null;
          purchased_by: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: string;
          quantity: number;
          unit?: string;
          expiry_date?: string | null;
          purchase_date?: string | null;
          cost?: number | null;
          image_url?: string | null;
          batch?: string | null;
          purchased_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          quantity?: number;
          unit?: string;
          expiry_date?: string | null;
          purchase_date?: string | null;
          cost?: number | null;
          image_url?: string | null;
          batch?: string | null;
          purchased_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      consumptions: {
        Row: {
          id: string;
          user_id: string;
          meal_name: string;
          meal_date: string;
          ingredients_used: Json | null;
          servings: number | null;
          fed_people: number | null;
          image_url: string | null;
          wasted_items: Json | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_name: string;
          meal_date?: string;
          ingredients_used?: Json | null;
          servings?: number | null;
          fed_people?: number | null;
          image_url?: string | null;
          wasted_items?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_name?: string;
          meal_date?: string;
          ingredients_used?: Json | null;
          servings?: number | null;
          fed_people?: number | null;
          image_url?: string | null;
          wasted_items?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          category: ResourceCategory;
          content: string | null;
          image_url: string | null;
          ingredients: Json | null;
          expiring_ingredients: Json | null;
          prep_time: string | null;
          difficulty: Difficulty | null;
          icon: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: ResourceCategory;
          content?: string | null;
          image_url?: string | null;
          ingredients?: Json | null;
          expiring_ingredients?: Json | null;
          prep_time?: string | null;
          difficulty?: Difficulty | null;
          icon?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: ResourceCategory;
          content?: string | null;
          image_url?: string | null;
          ingredients?: Json | null;
          expiring_ingredients?: Json | null;
          prep_time?: string | null;
          difficulty?: Difficulty | null;
          icon?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          metadata: Json | null;
          points_earned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: string;
          metadata?: Json | null;
          points_earned?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: string;
          metadata?: Json | null;
          points_earned?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
