'use client'

import { useFormContext } from 'react-hook-form'
import type { WizardFormValues } from '@/lib/schema/wizardSchema'

export default function StepContext() {
  const {
    register,
    formState: { errors },
  } = useFormContext<WizardFormValues>()

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <label>
        <div>Context</div>
        <textarea rows={6} {...register('context')} />
        {errors.context && (
          <div style={{ color: 'crimson' }}>{errors.context.message}</div>
        )}
      </label>
    </div>
  )
}
