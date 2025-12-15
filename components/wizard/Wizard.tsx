'use client'

import { useMemo, useState } from 'react'
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

export default function Wizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  const methods = useForm<WizardFormValues>({
    resolver: zodResolver(wizardSchema),
    mode: 'onTouched',
    defaultValues: {
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
    }
    
  })

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const step = steps[currentStep]

  const back = () => {
    if (!isFirstStep) setCurrentStep((s) => s - 1)
  }

  const next = async () => {
    const ok =
      step.fields.length === 0
        ? true
        : await methods.trigger(step.fields as any, { shouldFocus: true })
  
    if (!ok) return
    if (!isLastStep) setCurrentStep((s) => s + 1)
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

      const payload = methods.getValues()

      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Failed to generate PDF')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'nse-report.pdf'
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

  return (
    <FormProvider {...methods}>
      <section>
        <Stepper currentStep={currentStep} />

        <div style={{ marginTop: 24 }}>
          <h2 style={{ marginBottom: 12 }}>{step.title}</h2>

          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ padding: 20, border: '1px dashed #ccc', borderRadius: 8 }}
          >
            {StepComponent}
          </form>
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          {!isFirstStep && (
            <button type="button" onClick={back}>
              Back
            </button>
          )}

          {!isLastStep && (
            <button type="button" onClick={next}>
              Next
            </button>
          )}
        </div>
      </section>
    </FormProvider>
  )
}
