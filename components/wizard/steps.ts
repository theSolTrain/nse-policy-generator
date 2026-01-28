import type { WizardFormValues } from '@/lib/schema/wizardSchema'

export type WizardStep = {
  id: string
  title: string
  fields: (keyof WizardFormValues | string)[]
}

export const steps: WizardStep[] = [
  { id: 'disclaimer', title: 'Disclaimer', fields: ['disclaimerAccepted'] },

  {
    id: 'schoolDetails',
    title: 'School Details',
    fields: [
      'schoolName',
      'schoolAddress',
      'schoolWebsite',
      'schoolType',
      'schoolPhase',
      'schoolLogo',
      'visionStatement',
      'diocese',
      'admissionsAuthority',
      'namedContact',
      'localAuthority',
      'localAuthorityAddress',
      'ageRange',
      'numberOnRoll',
      'wasOversubscribedLastYear',
      'hadFaithBasedCriteriaLastYear',
      'faithAdmissionsLastYear',
      'appealDays',
      'admissionYear',
    ],
  },

  {
    id: 'pan',
    title: 'Published Admission Number',
    fields: [
      'pan',
      'yearOfLastConsultation',
      'scheduledReviewMeetingDate',
      'consultationDeadline',
      'dateIssuedForConsultation',
      'dateDeterminedByGovBody',
      'dateForwardedToLAandDBE',
      // Include parent object to trigger .refine() validation
      // (checks that at least one checkbox is selected)
      'yearGroups',
      // Also include individual paths for field-level validation
      'yearGroups.reception',
      'yearGroups.year3',
      'yearGroups.year7',
      'yearGroups.year12',
    ],
  },

  {
    id: 'arrangements',
    title: 'School Admission Arrangements',
    fields: [
      'includeSocialAndMedicalNeed',
      'includePupilPremium',
      'includeFaithBased',
      'includeChildrenOfStaff',
      'includeSiblings',
      'includeNamedFeederSchool',
      'includeDistanceFromSchool',
      'includeCatchmentArea',
      'catchmentMap',
      'tiebreakerMeasure',
      // Conditional required fields will be validated via schema refinements
    ],
  },

  {
    id: 'finalising',
    title: 'Finalising the Text',
    fields: ['criteriaOrder', 'supportDocuments', 'contactEmail', 'contactPhone'],
  },

  { id: 'complete', title: 'Complete / Download', fields: [] },
]
