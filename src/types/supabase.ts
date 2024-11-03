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
      tours: {
        Row: {
          id: string
          name: string
          date: string
          bus_number: string
          start_time: string
          end_time: string
          meeting_point: string
          guide_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          date: string
          bus_number: string
          start_time: string
          end_time: string
          meeting_point: string
          guide_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          date?: string
          bus_number?: string
          start_time?: string
          end_time?: string
          meeting_point?: string
          guide_id?: string | null
          created_at?: string
        }
      }
      tour_guides: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          availability: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          availability?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          availability?: boolean
          created_at?: string
        }
      }
      tour_clients: {
        Row: {
          id: string
          tour_id: string
          name: string
          phone: string
          check_in_status: 'pending' | 'checked-in' | 'no-show'
          created_at: string
        }
        Insert: {
          id?: string
          tour_id: string
          name: string
          phone: string
          check_in_status?: 'pending' | 'checked-in' | 'no-show'
          created_at?: string
        }
        Update: {
          id?: string
          tour_id?: string
          name?: string
          phone?: string
          check_in_status?: 'pending' | 'checked-in' | 'no-show'
          created_at?: string
        }
      }
    }
  }
}