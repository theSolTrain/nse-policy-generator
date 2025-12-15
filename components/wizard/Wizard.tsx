'use client'

import { useMemo, useState, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
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
  oversubscriptionCriteria: [],
  catchmentMap: undefined,
  criteriaOrder: undefined,
  supportDocuments: [],
  contactEmail: '',
  contactPhone: '',
}

export default function Wizard() {
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY}-step`)
      return saved ? parseInt(saved, 10) : 0
    }
    return 0
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  const methods = useForm<WizardFormValues>({
    resolver: zodResolver(wizardSchema),
    mode: 'onTouched',
    defaultValues: (() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const restored = deserializeFormData(saved)
          return { ...defaultValues, ...restored }
        }
      }
      return defaultValues
    })(),
  })

  // Save form data to localStorage on change
  useEffect(() => {
    const subscription = methods.watch((data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, serializeFormData(data as WizardFormValues))
      }
    })
    return () => subscription.unsubscribe()
  }, [methods])

  // Save current step to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}-step`, currentStep.toString())
    }
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
          : await methods.trigger(step.fields as any, { shouldFocus: true })

      if (!ok) return
      if (!isLastStep) setCurrentStep((s) => s + 1)
    } finally {
      setIsValidating(false)
    }
  }
  
  

  const onGenerate = async () => {
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
    } catch (e: any) {
      setGenerateError(e?.message || 'Something went wrong generating the PDF.')
    } finally {
      setIsGenerating(false)
    }
  }

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
  }, [step.id, isGenerating, generateError, methods])

  const isNavigating = isGenerating || isValidating

  return (
    <FormProvider {...methods}>
      <section>
        <Stepper currentStep={currentStep} />

        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ margin: 0 }}>{step.title}</h2>
            <div style={{ fontSize: 14, color: '#666' }}>
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ padding: 20, border: '1px dashed #ccc', borderRadius: 8 }}
          >
            {StepComponent}
          </form>
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
          {!isFirstStep && (
            <button
              type="button"
              onClick={back}
              disabled={isNavigating}
              style={{
                padding: '8px 16px',
                backgroundColor: isNavigating ? '#ccc' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: isNavigating ? 'not-allowed' : 'pointer',
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
              style={{
                padding: '8px 16px',
                backgroundColor: isNavigating ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: isNavigating ? 'not-allowed' : 'pointer',
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
