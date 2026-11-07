export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          category: string;
          status: 'planning' | 'active' | 'paused' | 'completed';
          color: string;
          target_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          category?: string;
          status?: 'planning' | 'active' | 'paused' | 'completed';
          color?: string;
          target_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          category?: string;
          status?: 'planning' | 'active' | 'paused' | 'completed';
          color?: string;
          target_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_milestones: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          title: string;
          is_completed: boolean;
          due_date: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          title: string;
          is_completed?: boolean;
          due_date?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          title?: string;
          is_completed?: boolean;
          due_date?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          description: string | null;
          status: 'todo' | 'in_progress' | 'completed' | 'deferred';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          due_date: string | null;
          source_app: string;
          tags: string[];
          order_index: number;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          title: string;
          description?: string | null;
          status?: 'todo' | 'in_progress' | 'completed' | 'deferred';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          due_date?: string | null;
          source_app?: string;
          tags?: string[];
          order_index?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          title?: string;
          description?: string | null;
          status?: 'todo' | 'in_progress' | 'completed' | 'deferred';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          due_date?: string | null;
          source_app?: string;
          tags?: string[];
          order_index?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
