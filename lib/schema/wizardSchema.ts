import { z } from 'zod'

// Simple helper for optional file validation later
const fileSchema = z
  .any()
  .refine((v) => v === undefined || v === null || v instanceof File, 'Invalid file')

export const wizardSchema = z.object({
  // Step 2: School Details
  schoolName: z.string().min(1, 'School name is required'),
  schoolAddress: z.string().min(1, 'School address is required'),
  schoolWebsite: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  schoolType: z.string().min(1, 'School type is required'),
  schoolPhase: z.string().min(1, 'School phase is required'),

  // File upload (logo) – optional for now (we can make it required later)
  schoolLogo: fileSchema.optional(),

  // Vision statement (for MVP we’ll use a textarea; rich text later)
  visionStatement: z.string().min(1, 'Vision statement is required'),

  diocese: z.string().min(1, 'Diocese is required'),
  admissionsAuthority: z.string().min(1, 'Admissions authority is required'),
  namedContact: z.string().min(1, 'Named contact is required'),
  localAuthority: z.string().min(1, 'Local authority is required'),
  localAuthorityAddress: z.string().min(1, 'Local authority address is required'),
  ageRange: z.string().min(1, 'Age range is required'),
  numberOnRoll: z.string().min(1, 'Number on roll is required'),

  wasOversubscribedLastYear: z.enum(['yes', 'no']),
  hadFaithBasedCriteriaLastYear: z.enum(['yes', 'no']),

  faithAdmissionsLastYear: z
    .string()
    .min(1, 'Please enter a number')
    .refine((v) => !Number.isNaN(Number(v)), 'Must be a number'),

  appealDays: z
    .string()
    .min(1, 'Please enter a number (must be at least 20)')
    .refine((v) => !Number.isNaN(Number(v)), 'Must be a number')
    .refine((v) => Number(v) >= 20, 'Must be at least 20'),

  admissionYear: z.string().min(1, 'Admission year is required'),

  // Step 1 Disclaimer (we’ll do later) / other steps placeholders:
  // disclaimerAccepted: z.boolean(),


  // Step 3: Published Admission Number
  pan: z.string().min(1, 'PAN is required'),

  yearGroups: z.object({
    reception: z.boolean().optional(),
    year3: z.boolean().optional(),
    year7: z.boolean().optional(),
    year12: z.boolean().optional(),
  }).refine(
    (v) => Object.values(v).some(Boolean),
    'Please select at least one year group'
  ),

  yearOfLastConsultation: z
  .string()
  .min(4, 'Enter a year')
  .refine((v) => /^\d{4}$/.test(v), 'Enter a 4-digit year'),

  scheduledReviewMeetingDate: z.string().min(1, 'Meeting date is required'),
  consultationDeadline: z.string().min(1, 'Consultation deadline is required'),
  dateIssuedForConsultation: z.string().min(1, 'Date to be issued for consultation is required'),
  dateDeterminedByGovBody: z.string().min(1, 'Determination date is required'),
  dateForwardedToLAandDBE: z.string().min(1, 'Forwarded date is required'),

})

export type WizardFormValues = z.infer<typeof wizardSchema>
