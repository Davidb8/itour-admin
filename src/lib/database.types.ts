export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      donors: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          image_url: string | null
          is_anonymous: boolean | null
          name: string
          tier: string | null
          tour_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_anonymous?: boolean | null
          name: string
          tier?: string | null
          tour_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_anonymous?: boolean | null
          name?: string
          tier?: string | null
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donors_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      stop_audio: {
        Row: {
          audio_url: string
          created_at: string | null
          duration_seconds: number | null
          id: string
          language_code: string
          stop_id: string
          updated_at: string | null
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          language_code: string
          stop_id: string
          updated_at?: string | null
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          language_code?: string
          stop_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stop_audio_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "stops"
            referencedColumns: ["id"]
          },
        ]
      }
      stop_images: {
        Row: {
          alt_text: string | null
          display_order: number | null
          id: string
          image_url: string
          stop_id: string
        }
        Insert: {
          alt_text?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          stop_id: string
        }
        Update: {
          alt_text?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          stop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stop_images_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "stops"
            referencedColumns: ["id"]
          },
        ]
      }
      stop_translations: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          language_code: string
          stop_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          language_code: string
          stop_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          language_code?: string
          stop_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stop_translations_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "stops"
            referencedColumns: ["id"]
          },
        ]
      }
      stops: {
        Row: {
          audio_url: string | null
          content: string | null
          created_at: string | null
          display_order: number
          id: string
          latitude: number | null
          longitude: number | null
          title: string
          tour_id: string
          updated_at: string | null
        }
        Insert: {
          audio_url?: string | null
          content?: string | null
          created_at?: string | null
          display_order: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          title: string
          tour_id: string
          updated_at?: string | null
        }
        Update: {
          audio_url?: string | null
          content?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          title?: string
          tour_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stops_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_facts: {
        Row: {
          created_at: string | null
          display_order: number | null
          fact: string
          id: string
          is_published: boolean | null
          tour_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          fact: string
          id?: string
          is_published?: boolean | null
          tour_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          fact?: string
          id?: string
          is_published?: boolean | null
          tour_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_facts_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_faqs: {
        Row: {
          answer: string
          created_at: string | null
          display_order: number | null
          id: string
          is_published: boolean | null
          question: string
          tour_id: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          question: string
          tour_id: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          question?: string
          tour_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_faqs_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_sections: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string | null
          display_order: number | null
          id: string
          is_published: boolean | null
          title: string
          tour_id: string
          updated_at: string | null
        }
        Insert: {
          audio_url?: string | null
          content: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          title: string
          tour_id: string
          updated_at?: string | null
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          title?: string
          tour_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_sections_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          content_updated_at: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          donation_url: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          location: string | null
          name: string
          slug: string
          support_text: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          content_updated_at?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          donation_url?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          name: string
          slug: string
          support_text?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          content_updated_at?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          donation_url?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          name?: string
          slug?: string
          support_text?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string | null
          tour_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          role?: string | null
          tour_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string | null
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tour_id: { Args: Record<PropertyKey, never>; Returns: string }
      is_super_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tour = Database['public']['Tables']['tours']['Row']
export type TourInsert = Database['public']['Tables']['tours']['Insert']
export type TourUpdate = Database['public']['Tables']['tours']['Update']

export type Stop = Database['public']['Tables']['stops']['Row']
export type StopInsert = Database['public']['Tables']['stops']['Insert']
export type StopUpdate = Database['public']['Tables']['stops']['Update']

export type StopImage = Database['public']['Tables']['stop_images']['Row']
export type StopImageInsert = Database['public']['Tables']['stop_images']['Insert']
export type StopImageUpdate = Database['public']['Tables']['stop_images']['Update']

export type Donor = Database['public']['Tables']['donors']['Row']
export type DonorInsert = Database['public']['Tables']['donors']['Insert']
export type DonorUpdate = Database['public']['Tables']['donors']['Update']

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type TourSection = Database['public']['Tables']['tour_sections']['Row']
export type TourSectionInsert = Database['public']['Tables']['tour_sections']['Insert']
export type TourSectionUpdate = Database['public']['Tables']['tour_sections']['Update']

export type TourFaq = Database['public']['Tables']['tour_faqs']['Row']
export type TourFaqInsert = Database['public']['Tables']['tour_faqs']['Insert']
export type TourFaqUpdate = Database['public']['Tables']['tour_faqs']['Update']

export type TourFact = Database['public']['Tables']['tour_facts']['Row']
export type TourFactInsert = Database['public']['Tables']['tour_facts']['Insert']
export type TourFactUpdate = Database['public']['Tables']['tour_facts']['Update']

// Stop with images relation
export type StopWithImages = Stop & {
  stop_images: StopImage[]
}

// Tour with stats
export type TourWithStats = Tour & {
  stop_count: number
  image_count: number
  donor_count: number
}
