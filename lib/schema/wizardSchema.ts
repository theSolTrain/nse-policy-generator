import { z } from 'zod'

export const wizardSchema = z.object({
  // Step 1: School details
  schoolName: z.string().min(1, 'School name is required'),
  schoolLocation: z.string().min(1, 'School location is required'),

  // Step 2: Context
  context: z.string().min(1, 'Context is required'),

  // Add the rest as you go:
  // strengths: z.string().min(1, 'Required'),
  // challenges: z.string().min(1, 'Required'),
  // actions: z.string().min(1, 'Required'),
  // summary: z.string().min(1, 'Required'),
})

export type WizardFormValues = z.infer<typeof wizardSchema>
