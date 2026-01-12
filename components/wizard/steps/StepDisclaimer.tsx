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
    <div className="wizard__form-content">
      <p>
        This Admissions Builder is a tool to assist you in preparing your admission arrangements, but it does not constitute guidance or legal advice. It does not take the place of Diocesan Board of Education guidance and consultation. 
        <b>You must consult with your Diocesan Board of Education about your proposed admission arrangements before any public consultation. You must also have regard to any guidance from your Diocesan Board of Education when constructing any faith-based admission arrangements and must consult with your Diocesan Board of Education when deciding how membership or practice of the faith is to be demonstrated. </b> 
        The admission authority must ensure that the admission arrangements are compliant with all relevant legislation, including the School Admissions Code.
      </p>
      <p>
        Please ensure all information is accurate and complete before generating the PDF.
      </p>

      <label className="wizard__form-checkbox">
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
