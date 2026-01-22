'use client'

import { useFormContext, useFieldArray } from 'react-hook-form'
import type { WizardFormValues } from '@/lib/schema/wizardSchema'

function ErrorText({ message, style }: { message?: string, style?: React.CSSProperties }) {
  if (!message) return null
  return <div className="wizard__error-text" style={style}>{message}</div>
}

export default function StepArrangements() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<WizardFormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'oversubscriptionCriteria',
  })

  const catchmentMap = watch('catchmentMap')

  // Initialize with one empty criterion if none exist
  if (fields.length === 0) {
    append({ id: `criteria-${new Date().getTime()}`, text: '', priority: 1 })
  }

  return (
    <div className="wizard__form-content">
      <div className="form-element-wrapper form-element-wrapper--full-width">
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Oversubscription Criteria</h3>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
          Add the oversubscription criteria in order of priority. You can reorder them in the next step.
        </p>

        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              padding: 16,
              border: '1px solid #ddd',
              borderRadius: 8,
              marginBottom: 12,
              backgroundColor: '#fafafa',
              paddingBottom: '30px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong>Criterion {index + 1}</strong>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  style={{
                    padding: '4px 12px',
                    fontSize: 12,
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            <label style={{ display: 'block' }}>
              <div style={{ marginBottom: 4, fontSize: 14 }}>Criterion text</div>
              <textarea
                rows={3}
                style={{ width: '100%', padding: 8 }}
                {...register(`oversubscriptionCriteria.${index}.text` as const)}
              />
              <ErrorText style={{ bottom: 8, left: 15 }} message={errors.oversubscriptionCriteria?.[index]?.text?.message as string} />
            </label>
            <input
              type="hidden"
              {...register(`oversubscriptionCriteria.${index}.priority` as const)}
              value={index + 1}
            />
            <input
              type="hidden"
              {...register(`oversubscriptionCriteria.${index}.id` as const)}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ id: `criteria-${Date.now()}`, text: '', priority: fields.length + 1 })}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          + Add Criterion
        </button>

        <ErrorText message={errors.oversubscriptionCriteria?.message as string} />
      </div>

      <div className="form-element-wrapper form-element-wrapper--full-width">
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Catchment Area Map</h3>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>
          Upload an image showing your school&apos;s catchment area (optional).
        </p>

        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) {
              setValue('catchmentMap', undefined, { shouldValidate: true })
              return
            }

            // Validate file type
            const allowedTypes = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg', 'image/webp']
            if (!allowedTypes.includes(file.type)) {
              setValue('catchmentMap', undefined, { shouldValidate: true })
              alert('Invalid file type. Please upload PNG, JPG, WebP, or SVG.')
              return
            }

            // Validate file size (3MB max)
            const maxSize = 3 * 1024 * 1024 // 3MB
            if (file.size > maxSize) {
              setValue('catchmentMap', undefined, { shouldValidate: true })
              alert('File size exceeds 3MB. Please upload a smaller file.')
              return
            }

            setValue('catchmentMap', file, { shouldValidate: true })
          }}
        />

        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
          Accepted formats: PNG, JPG, WebP, SVG. Max size: 3MB.
        </div>

        {catchmentMap instanceof File && (
          <div style={{ marginTop: 8, fontSize: 12 }}>
            Selected: <strong>{catchmentMap.name}</strong> ({Math.round(catchmentMap.size / 1024)} KB)
            {'  '}
            <button
              type="button"
              onClick={() => setValue('catchmentMap', undefined, { shouldValidate: true })}
              style={{ marginLeft: 10 }}
            >
              Remove
            </button>
          </div>
        )}

        <ErrorText message={errors.catchmentMap?.message as string} />
      </div>
    </div>
  )
}
