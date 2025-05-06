import * as z from "zod"

export const characterSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  role: z.string()
    .max(100, "Role must be less than 100 characters")
    .optional(),
  description: z.string()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  personality: z.string()
    .max(2000, "Personality description must be less than 2000 characters")
    .optional(),
  goals: z.string()
    .max(2000, "Goals must be less than 2000 characters")
    .optional(),
  background: z.string()
    .max(5000, "Background must be less than 5000 characters")
    .optional()
})

export type CharacterFormData = z.infer<typeof characterSchema>

export type Character = CharacterFormData & {
  id: number
  project_id: number
  created_at: Date
  updated_at: Date
}