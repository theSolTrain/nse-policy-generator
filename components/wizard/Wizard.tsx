'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { FormProvider, useForm, type FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Stepper from './Stepper'
import { steps } from './steps'

// ✅ New step components
import StepDisclaimer from './steps/StepDisclaimer'
import StepSchoolDetails from './steps/StepSchoolDetails'
import StepPAN from './steps/StepPAN'
import StepArrangements from './steps/StepArrangements'
import StepFinalising from './steps/StepFinalising'
import StepComplete from './steps/StepComplete'

import { wizardSchema, type WizardFormValues } from '@/lib/schema/wizardSchema'

const STORAGE_KEY = 'nse-wizard-draft'

// Helper to serialize form data (excluding files)
function serializeFormData(data: WizardFormValues): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { schoolLogo, catchmentMap, ...serializable } = data
  return JSON.stringify(serializable)
}

// Helper to deserialize form data
function deserializeFormData(json: string): Partial<WizardFormValues> {
  try {
    return JSON.parse(json)
  } catch {
    return {}
  }
}

const defaultValues: WizardFormValues = {
  disclaimerAccepted: false,
  schoolName: '',
  schoolURN: '',
  schoolAddress: '',
  schoolWebsite: '',
  schoolType: '',
  schoolPhase: '',
  schoolLogo: undefined,
  visionStatement: '',
  diocese: '',
  admissionsAuthority: '',
  namedContact: '',
  localAuthority: '',
  localAuthorityAddress: '',
  ageRange: '',
  numberOnRoll: '',
  wasOversubscribedLastYear: 'no',
  hadFaithBasedCriteriaLastYear: 'no',
  faithAdmissionsLastYear: '',
  appealDays: '20',
  admissionYear: '',
  pan: '',
  yearGroups: {
    reception: false,
    year3: false,
    year7: false,
    year12: false,
  },
  yearOfLastConsultation: '',
  scheduledReviewMeetingDate: '',
  consultationDeadline: '',
  dateIssuedForConsultation: '',
  dateDeterminedByGovBody: '',
  dateForwardedToLAandDBE: '',
  // Step 4: Admission Arrangements - Conditional sections
  includeSocialAndMedicalNeed: false,
  includePupilPremium: false,
  pupilPremiumMaxPercentage: '',
  pupilPremiumTypes: {
    pupilPremium: false,
    earlyYearsPupilPremium: false,
    servicePremium: false,
  },
  pupilPremiumNurseryName: '',
  pupilPremiumNurseryTypes: {
    nurseryVersionPupilPremium: false,
    nurseryVersionEarlyYearsPupilPremium: false,
    nurseryVersionServicePremium: false,
  },
  includeFaithBased: false,
  faithBasedOptions: {
    catchmentAreaOrParish: false,
    publicWorshipCoFE: false,
    evangelicalAlliance: false,
    otherFaiths: false,
  },
  faithBasedChurchName: '',
  faithBasedAttendanceFrequency: undefined,
  includeChildrenOfStaff: false,
  childrenOfStaffCategories: {
    staffRecruited: false,
    staffEmployed: false,
  },
  childrenOfStaffType: undefined,
  includeSiblings: false,
  siblingsTiming: undefined,
  includeNamedFeederSchool: false,
  namedFeederSchool: '',
  includeDistanceFromSchool: false,
  distanceSchoolCalculated: '',
  howIsHomeAddressDetermined: '',
  includeCatchmentArea: false,
  catchmentMap: undefined,
  tiebreakerMeasure: undefined,
  // Legacy - keeping for backward compatibility
  oversubscriptionCriteria: [],
  criteriaOrder: undefined,
  supportDocuments: [],
  contactEmail: '',
  contactPhone: '',
}

export default function Wizard() {
  // Always start with 0 - same on server and client to prevent hydration mismatch
  const [currentStep, setCurrentStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  // Initialize form with default values (same on server and client)
  const methods = useForm<WizardFormValues>({
    resolver: zodResolver(wizardSchema),
    mode: 'onTouched',
    defaultValues, // Always use defaults initially
  })

  // Restore from localStorage AFTER mount (client-side only)
  // This prevents hydration mismatch by ensuring server and client render the same initial state
  useEffect(() => {
    // Restore current step
    const savedStep = localStorage.getItem(`${STORAGE_KEY}-step`)
    if (savedStep) {
      const step = parseInt(savedStep, 10)
      if (step >= 0 && step < steps.length) {
        setCurrentStep(step)
      }
    }

    // Restore form data
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const restored = deserializeFormData(saved)
      // Use reset() to update form with restored values
      methods.reset({ ...defaultValues, ...restored })
    }
  }, [methods])

  // Save form data to localStorage on change
  useEffect(() => {
    const subscription = methods.watch((data) => {
      localStorage.setItem(STORAGE_KEY, serializeFormData(data as WizardFormValues))
    })
    return () => subscription.unsubscribe()
  }, [methods])

  // Save current step to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}-step`, currentStep.toString())
  }, [currentStep])

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const step = steps[currentStep]

  const back = () => {
    if (!isFirstStep && !isGenerating && !isValidating) {
      setCurrentStep((s) => s - 1)
    }
  }

  const next = async () => {
    if (isGenerating || isValidating) return

    setIsValidating(true)
    try {
      const ok =
        step.fields.length === 0
          ? true
          : await methods.trigger(step.fields as FieldPath<WizardFormValues>[], { shouldFocus: true })

      if (!ok) return
      if (!isLastStep) setCurrentStep((s) => s + 1)
    } finally {
      setIsValidating(false)
    }
  }

  const onGenerate = useCallback(async () => {
    setIsGenerating(true)
    setGenerateError(null)

    try {
      // Validate everything before sending
      const ok = await methods.trigger(undefined, { shouldFocus: true })
      if (!ok) {
        setGenerateError('Please fix the errors above before generating.')
        return
      }

      const formData = methods.getValues()
      
      // Build FormData for multipart submission
      const formDataToSend = new FormData()

      // Append all text fields as JSON (easier to parse on server)
      // We'll exclude files and append them separately
      const { schoolLogo, catchmentMap, ...textFields } = formData
      formDataToSend.append('data', JSON.stringify(textFields))

      // Append files if they exist
      if (schoolLogo instanceof File) {
        formDataToSend.append('schoolLogo', schoolLogo)
      }
      if (catchmentMap instanceof File) {
        formDataToSend.append('catchmentMap', catchmentMap)
      }

      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        // Don't set Content-Type header - browser will set it with boundary
        body: formDataToSend,
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Failed to generate PDF')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      // Generate filename from school name and admission year
      const schoolName = formData.schoolName || 'School'
      const admissionYear = formData.admissionYear || 'Unknown'
      const sanitizedName = schoolName.replace(/[^a-z0-9]/gi, '_').substring(0, 50)
      const filename = `NSE_${sanitizedName}_${admissionYear.replace('/', '-')}.pdf`

      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Something went wrong generating the PDF.'
      setGenerateError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }, [methods])

  const StepComponent = useMemo(() => {
    switch (step.id) {
      case 'disclaimer':
        return <StepDisclaimer />

      case 'schoolDetails':
        return <StepSchoolDetails />

      case 'pan':
        return <StepPAN />

      case 'arrangements':
        return <StepArrangements />

      case 'finalising':
        return <StepFinalising />

      case 'complete':
        return (
          <StepComplete
            onGenerate={onGenerate}
            isGenerating={isGenerating}
            error={generateError}
          />
        )

      default:
        return <div>Unknown step</div>
    }
  }, [step.id, isGenerating, generateError, onGenerate])

  const isNavigating = isGenerating || isValidating

  return (
    <FormProvider {...methods}>
      <section className="wizard">
        <Stepper currentStep={currentStep} />

        <div className="wizard__form-container">
          <div className="wizard__form-header">
            <h2 className="wizard__form-title">{step.title}</h2>
            <div className="wizard__form-step">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="wizard__form"
          >
            {StepComponent}
          </form>
        </div>

        <div className="wizard__navigation">
          {!isFirstStep && (
            <button
              type="button"
              onClick={back}
              disabled={isNavigating}
              className="nav-button"
              style={{
                // backgroundColor: isNavigating ? '#ccc' : '#6c757d',
                // cursor: isNavigating ? 'not-allowed' : 'pointer',
              }}
            >
              Back
            </button>
          )}

          {!isLastStep && (
            <button
              type="button"
              onClick={next}
              disabled={isNavigating}
              className="nav-button"
              style={{
                // backgroundColor: isNavigating ? '#ccc' : 'rgb(102, 158, 255)',
                // cursor: isNavigating ? 'not-allowed' : 'pointer',
              }}
            >
              {isValidating ? 'Validating...' : 'Next'}
            </button>
          )}
        </div>
      </section>
    </FormProvider>
  )
}
