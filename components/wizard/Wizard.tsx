'use client'

import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Stepper from './Stepper'
import { steps } from './steps'

import StepSchool from './StepSchool'
import StepContext from './StepContext'
import ReviewStep from './ReviewStep'

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
      schoolLocation: '',
      context: '',
    },
  })

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const step = steps[currentStep]

  const back = () => {
    if (!isFirstStep) setCurrentStep((s) => s - 1)
  }

  const next = async () => {
    const fields = step.fields
    const ok =
      fields.length === 0
        ? true
        : await methods.trigger(fields, { shouldFocus: true })

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
      case 'school':
        return <StepSchool />
      case 'context':
        return <StepContext />
      case 'review':
        return (
          <ReviewStep
            onGenerate={onGenerate}
            isGenerating={isGenerating}
            error={generateError}
          />
        )
      default:
        return <div>Step content goes here</div>
    }
  }, [step.id, isGenerating, generateError])

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
