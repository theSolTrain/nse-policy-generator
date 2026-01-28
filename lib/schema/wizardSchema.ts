import { z } from 'zod'

// Simple helper for optional file validation later
const fileSchema = z
  .any()
  .refine((v) => v === undefined || v === null || v instanceof File, 'Invalid file')

export const wizardSchema = z.object({
  // Step 1: Disclaimer
  disclaimerAccepted: z.boolean().refine((v) => v === true, 'You must accept the disclaimer to proceed'),

  // Step 2: School Details
  schoolName: z.string().min(1, 'School name is required'),
  schoolURN: z.string().min(1, 'School URN is required'),
  schoolAddress: z.string().min(1, 'School address is required'),
  schoolWebsite: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  schoolType: z.string().min(1, 'School type is required'),
  schoolPhase: z.string().min(1, 'School phase is required'),

  // File upload (logo) – optional for now (we can make it required later)
  schoolLogo: fileSchema.optional(),

  // Vision statement (for MVP we'll use a textarea; rich text later)
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
    .optional()
    .refine((v) => !v || !Number.isNaN(Number(v)), 'Must be a number'),

  appealDays: z
    .string()
    .min(1, 'Please enter a number (must be at least 20)')
    .refine((v) => !Number.isNaN(Number(v)), 'Must be a number')
    .refine((v) => Number(v) >= 20, 'Must be at least 20'),

  admissionYear: z.string().min(1, 'Admission year is required'),

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

  // Step 4: Admission Arrangements
  // Conditional sections
  includeSocialAndMedicalNeed: z.boolean().optional(),
  includePupilPremium: z.boolean().optional(),
  pupilPremiumMaxPercentage: z.string().optional(),
  pupilPremiumTypes: z.object({
    pupilPremium: z.boolean().optional(),
    earlyYearsPupilPremium: z.boolean().optional(),
    servicePremium: z.boolean().optional(),
  }).optional(),
  pupilPremiumNurseryName: z.string().optional(),
  pupilPremiumNurseryTypes: z.object({
    nurseryVersionPupilPremium: z.boolean().optional(),
    nurseryVersionEarlyYearsPupilPremium: z.boolean().optional(),
    nurseryVersionServicePremium: z.boolean().optional(),
  }).optional(),

  includeFaithBased: z.boolean().optional(),
  faithBasedOptions: z.object({
    catchmentAreaOrParish: z.boolean().optional(),
    publicWorshipCoFE: z.boolean().optional(),
    evangelicalAlliance: z.boolean().optional(),
    otherFaiths: z.boolean().optional(),
  }).optional(),
  faithBasedChurchName: z.string().optional(),
  faithBasedAttendanceFrequency: z.enum(['less_8', 'less_16']).optional(),

  includeChildrenOfStaff: z.boolean().optional(),
  childrenOfStaffCategories: z.object({
    staffRecruited: z.boolean().optional(),
    staffEmployed: z.boolean().optional(),
  }).optional(),
  childrenOfStaffType: z.enum(['teaching_staff', 'non_teaching_staff', 'all_staff']).optional(),

  includeSiblings: z.boolean().optional(),
  siblingsTiming: z.enum(['time_application', 'time_admission', 'catchment_parish', 'outside_catchment_parish']).optional(),

  includeNamedFeederSchool: z.boolean().optional(),
  namedFeederSchool: z.string().optional(),

  includeDistanceFromSchool: z.boolean().optional(),
  distanceSchoolCalculated: z.string().optional(),
  howIsHomeAddressDetermined: z.string().optional(),

  includeCatchmentArea: z.boolean().optional(),
  catchmentMap: fileSchema.optional(),

  // Tiebreaker
  tiebreakerMeasure: z.enum(['crow_files', 'gis']).optional(),

  // Legacy - keeping for backward compatibility but will be auto-generated from conditionals
  oversubscriptionCriteria: z.array(z.object({
    id: z.string(),
    text: z.string().min(1, 'Criterion text is required'),
    priority: z.number(),
  })).min(1, 'At least one oversubscription criterion is required'),

  // Step 5: Finalising
  groupOrder: z.array(z.string()).optional(), // Array of group IDs in desired order (e.g., ['social_medical', 'pupil_premium', 'faith_based'])
  supportDocuments: z.array(z.object({
    name: z.string().min(1, 'Document name is required'),
    url: z.string().url('Please enter a valid URL').or(z.literal('')),
  })).optional(),
  contactEmail: z.string().email('Please enter a valid email address').or(z.literal('')).optional(),
  contactPhone: z.string().optional(),
})

export type WizardFormValues = z.infer<typeof wizardSchema>
