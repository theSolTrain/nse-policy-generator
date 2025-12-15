'use client'

import { useFormContext } from 'react-hook-form'
import type { WizardFormValues } from '@/lib/schema/wizardSchema'

export default function StepSchool() {
  const {
    register,
    formState: { errors },
  } = useFormContext<WizardFormValues>()

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <label>
        <div>School name</div>
        <input {...register('schoolName')} />
        {errors.schoolName && (
          <div style={{ color: 'crimson' }}>{errors.schoolName.message}</div>
        )}
      </label>

      <label>
        <div>School location</div>
        <input {...register('schoolLocation')} />
        {errors.schoolLocation && (
          <div style={{ color: 'crimson' }}>{errors.schoolLocation.message}</div>
        )}
      </label>
    </div>
  )
}
