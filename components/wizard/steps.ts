import type { WizardFormValues } from '@/lib/schema/wizardSchema'

export type WizardStep = {
  id: string
  title: string
  fields: (keyof WizardFormValues)[]
}

export const steps: WizardStep[] = [
  {
    id: 'school',
    title: 'School details',
    fields: ['schoolName', 'schoolLocation'],
  },
  {
    id: 'context',
    title: 'Context',
    fields: ['context'],
  },
  {
    id: 'review',
    title: 'Review & generate',
    fields: [],
  },
]



// Add the rest later, following the same pattern:
// { id: 'strengths', title: 'Strengths', fields: ['strengths'] },
// { id: 'challenges', title: 'Challenges', fields: ['challenges'] },
// { id: 'actions', title: 'Actions', fields: ['actions'] },
// { id: 'summary', title: 'Summary', fields: ['summary'] },
// { id: 'review', title: 'Review & generate', fields: [] },