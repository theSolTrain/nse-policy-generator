'use client'

import { useFormContext } from 'react-hook-form'
import type { WizardFormValues } from '@/lib/schema/wizardSchema'

function ErrorText({ message }: { message?: string }) {
  if (!message) return null
  return <div style={{ color: 'crimson', marginTop: 6 }}>{message}</div>
}

export default function StepDisclaimer() {
  const {
    register,
    formState: { errors },
  } = useFormContext<WizardFormValues>()

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{ padding: 16, backgroundColor: 'black', borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Disclaimer</h3>
        <p>
          By proceeding, you acknowledge that you are authorized to complete this form on behalf of your school.
          The information provided will be used to generate admission arrangements documentation.
        </p>
        <p>
          Please ensure all information is accurate and complete before generating the PDF.
        </p>
      </div>

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
        <input
          type="checkbox"
          {...register('disclaimerAccepted')}
          style={{ marginTop: 4 }}
        />
        <div>
          <strong>I understand and accept</strong>
          <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>
            I confirm that I have read and understood the above disclaimer and agree to proceed.
          </div>
        </div>
      </label>

      <ErrorText message={errors.disclaimerAccepted?.message} />
    </div>
  )
}
