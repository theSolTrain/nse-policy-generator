'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import type { WizardFormValues } from '@/lib/schema/wizardSchema'

type Props = {
  onGenerate: () => void
  isGenerating: boolean
  error?: string | null
}

export default function ReviewStep({ onGenerate, isGenerating, error }: Props) {
  const { control } = useFormContext<WizardFormValues>()
  const values = useWatch({ control })

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <div><strong>School name:</strong> {values.schoolName || '—'}</div>
        <div><strong>School location:</strong> {values.schoolLocation || '—'}</div>
        <div><strong>Context:</strong></div>
        <div style={{ whiteSpace: 'pre-wrap', border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
          {values.context || '—'}
        </div>
      </div>

      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      <button type="button" onClick={onGenerate} disabled={isGenerating}>
        {isGenerating ? 'Generating…' : 'Generate PDF'}
      </button>
    </div>
  )
}
