export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: string
          images: string[]
          stock: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category: string
          images?: string[]
          stock?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string
          images?: string[]
          stock?: number
          created_at?: string
        }
      }
      social_media: {
        Row: {
          id: string
          platform: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          platform: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          platform?: string
          url?: string
          created_at?: string
        }
      }
      advertisements: {
        Row: {
          id: string
          title: string
          image_url: string
          link_url: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          image_url: string
          link_url?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          image_url?: string
          link_url?: string | null
          active?: boolean
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          product_id: string
          name: string
          email: string
          comment: string
          rating: number
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          email: string
          comment: string
          rating: number
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          email?: string
          comment?: string
          rating?: number
          approved?: boolean
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          read?: boolean
          created_at?: string
        }
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
  }
}