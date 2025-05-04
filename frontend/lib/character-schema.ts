import * as z from "zod"

export const characterSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  archetype: z.string()
    .min(2, "Archetype must be at least 2 characters")
    .max(50, "Archetype must be less than 50 characters"),
  background: z.string()
    .min(10, "Background must be at least 10 characters")
    .max(2000, "Background must be less than 2000 characters"),
  goals: z.array(z.string())
    .min(1, "At least one goal is required")
    .max(5, "Maximum 5 goals allowed"),
  traits: z.array(z.string())
    .min(1, "At least one trait is required")
    .max(10, "Maximum 10 traits allowed"),
  relationships: z.array(z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    relation: z.string().min(2, "Relation must be at least 2 characters"),
    dynamics: z.string().min(10, "Dynamics must be at least 10 characters"),
  })).optional(),
  notes: z.string().max(5000, "Notes must be less than 5000 characters").optional(),
})

export type CharacterFormData = z.infer<typeof characterSchema>

export type Character = CharacterFormData & {
  id: string
  projectId: string
  createdAt: Date
  updatedAt: Date
}