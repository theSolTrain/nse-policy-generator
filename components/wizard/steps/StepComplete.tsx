'use client'

type Props = {
  onGenerate: () => void
  isGenerating: boolean
  error?: string | null
}

export default function StepComplete({ onGenerate, isGenerating, error }: Props) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h3>Admissions Arrangements Complete</h3>
      <p>Click below to download your PDF.</p>

      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      <button type="button" onClick={onGenerate} disabled={isGenerating}>
        {isGenerating ? 'Generating…' : 'Download PDF'}
      </button>
    </div>
  )
}
