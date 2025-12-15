'use client'

import { useFormContext, useFieldArray } from 'react-hook-form'
import { useState, useEffect } from 'react'
import type { WizardFormValues } from '@/lib/schema/wizardSchema'

function ErrorText({ message }: { message?: string }) {
  if (!message) return null
  return <div style={{ color: 'crimson', marginTop: 6 }}>{message}</div>
}

export default function StepFinalising() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<WizardFormValues>()

  const criteria = watch('oversubscriptionCriteria') || []
  const [criteriaOrder, setCriteriaOrder] = useState<string[]>([])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'supportDocuments',
  })

  // Initialize criteria order from criteria IDs
  useEffect(() => {
    if (criteria.length > 0) {
      const currentOrder = watch('criteriaOrder') || []
      const criteriaIds = criteria.map((c) => c.id)
      
      // Only initialize if we don't have an order yet, or if criteria IDs changed
      if (currentOrder.length === 0 || 
          currentOrder.length !== criteriaIds.length ||
          !criteriaIds.every((id) => currentOrder.includes(id))) {
        setCriteriaOrder(criteriaIds)
        setValue('criteriaOrder', criteriaIds)
      } else if (criteriaOrder.length === 0) {
        // Use existing order from form state
        setCriteriaOrder(currentOrder)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteria.length, setValue])

  const moveCriterion = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...criteriaOrder]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= newOrder.length) return

    ;[newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]]
    setCriteriaOrder(newOrder)
    setValue('criteriaOrder', newOrder)
  }

  const getCriterionById = (id: string) => {
    return criteria.find((c) => c.id === id)
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Reorder Oversubscription Criteria</h3>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
          Review and reorder your oversubscription criteria. The order shown here will be used in the final PDF.
        </p>

        {criteriaOrder.length > 0 ? (
          <div style={{ display: 'grid', gap: 8 }}>
            {criteriaOrder.map((criterionId, index) => {
              const criterion = getCriterionById(criterionId)
              if (!criterion) return null

              return (
                <div
                  key={criterionId}
                  style={{
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    backgroundColor: '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                      Priority {index + 1}
                    </div>
                    <div>{criterion.text || '(Empty criterion)'}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button
                      type="button"
                      onClick={() => moveCriterion(index, 'up')}
                      disabled={index === 0}
                      style={{
                        padding: '4px 8px',
                        fontSize: 12,
                        backgroundColor: index === 0 ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCriterion(index, 'down')}
                      disabled={index === criteriaOrder.length - 1}
                      style={{
                        padding: '4px 8px',
                        fontSize: 12,
                        backgroundColor: index === criteriaOrder.length - 1 ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: index === criteriaOrder.length - 1 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ padding: 16, backgroundColor: '#fff3cd', borderRadius: 8 }}>
            No criteria to reorder. Please add criteria in the previous step.
          </div>
        )}

        <ErrorText message={errors.criteriaOrder?.message as any} />
      </div>

      <div>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Support Documents</h3>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
          Add links to any supporting documents (optional).
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
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong>Document {index + 1}</strong>
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
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <label>
                <div style={{ marginBottom: 4, fontSize: 14 }}>Document name</div>
                <input
                  type="text"
                  style={{ width: '100%', padding: 8 }}
                  {...register(`supportDocuments.${index}.name` as const)}
                />
                <ErrorText message={errors.supportDocuments?.[index]?.name?.message} />
              </label>
              <label>
                <div style={{ marginBottom: 4, fontSize: 14 }}>URL</div>
                <input
                  type="url"
                  placeholder="https://..."
                  style={{ width: '100%', padding: 8 }}
                  {...register(`supportDocuments.${index}.url` as const)}
                />
                <ErrorText message={errors.supportDocuments?.[index]?.url?.message} />
              </label>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ name: '', url: '' })}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          + Add Document
        </button>
      </div>

      <div>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Contact Details</h3>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
          Provide contact information for queries (optional).
        </p>

        <div style={{ display: 'grid', gap: 16 }}>
          <label>
            <div style={{ marginBottom: 4 }}>Email address</div>
            <input
              type="email"
              placeholder="contact@school.example.com"
              style={{ width: '100%', padding: 8 }}
              {...register('contactEmail')}
            />
            <ErrorText message={errors.contactEmail?.message} />
          </label>

          <label>
            <div style={{ marginBottom: 4 }}>Phone number</div>
            <input
              type="tel"
              placeholder="+44 123 456 7890"
              style={{ width: '100%', padding: 8 }}
              {...register('contactPhone')}
            />
            <ErrorText message={errors.contactPhone?.message} />
          </label>
        </div>
      </div>
    </div>
  )
}
