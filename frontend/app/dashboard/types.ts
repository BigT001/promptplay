export interface Project {
  id: number
  title: string
  description: string | null
  category: string | null
  progress: number
  created_at: string
  updated_at: string
}