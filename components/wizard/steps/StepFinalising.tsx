'use client'

import { useFormContext, useFieldArray } from 'react-hook-form'
import { useState, useEffect, useMemo } from 'react'
import type { WizardFormValues } from '@/lib/schema/wizardSchema'

function ErrorText({ message }: { message?: string }) {
  if (!message) return null
  return <div style={{ color: 'crimson', marginTop: 6 }}>{message}</div>
}

// Define group metadata
const GROUP_METADATA = {
  looked_after: { id: 'looked_after', title: 'Looked After Children and Previously Looked After Children', alwaysFirst: true, alwaysLast: false },
  social_medical: { id: 'social_medical', title: 'Social and Medical Need', alwaysFirst: false, alwaysLast: false },
  pupil_premium: { id: 'pupil_premium', title: 'Pupil Premium', alwaysFirst: false, alwaysLast: false },
  faith_based: { id: 'faith_based', title: 'Faith Based', alwaysFirst: false, alwaysLast: false },
  children_of_staff: { id: 'children_of_staff', title: 'Children of Staff', alwaysFirst: false, alwaysLast: false },
  siblings: { id: 'siblings', title: 'Siblings', alwaysFirst: false, alwaysLast: false },
  named_feeder_school: { id: 'named_feeder_school', title: 'Named Feeder School', alwaysFirst: false, alwaysLast: false },
  distance_from_school: { id: 'distance_from_school', title: 'Distance from School', alwaysFirst: false, alwaysLast: false },
  catchment_area: { id: 'catchment_area', title: 'Catchment Area', alwaysFirst: false, alwaysLast: false },
  any_other_children: { id: 'any_other_children', title: 'Any Other Children', alwaysFirst: false, alwaysLast: true },
} as const

type GroupId = keyof typeof GROUP_METADATA

export default function StepFinalising() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<WizardFormValues>()

  // Watch all the conditional flags from StepArrangements
  const includeSocialAndMedicalNeed = watch('includeSocialAndMedicalNeed')
  const includePupilPremium = watch('includePupilPremium')
  const includeFaithBased = watch('includeFaithBased')
  const includeChildrenOfStaff = watch('includeChildrenOfStaff')
  const includeSiblings = watch('includeSiblings')
  const includeNamedFeederSchool = watch('includeNamedFeederSchool')
  const includeDistanceFromSchool = watch('includeDistanceFromSchool')
  const includeCatchmentArea = watch('includeCatchmentArea')

  // Get active groups based on what was selected
  const activeGroups = useMemo(() => {
    const groups: GroupId[] = ['looked_after'] // Always include Looked After first

    if (includeSocialAndMedicalNeed) groups.push('social_medical')
    if (includePupilPremium) groups.push('pupil_premium')
    if (includeFaithBased) groups.push('faith_based')
    if (includeChildrenOfStaff) groups.push('children_of_staff')
    if (includeSiblings) groups.push('siblings')
    if (includeNamedFeederSchool) groups.push('named_feeder_school')
    if (includeDistanceFromSchool) groups.push('distance_from_school')
    if (includeCatchmentArea) groups.push('catchment_area')

    groups.push('any_other_children') // Always include "Any Other Children" last

    return groups
  }, [
    includeSocialAndMedicalNeed,
    includePupilPremium,
    includeFaithBased,
    includeChildrenOfStaff,
    includeSiblings,
    includeNamedFeederSchool,
    includeDistanceFromSchool,
    includeCatchmentArea,
  ])

  const [groupOrder, setGroupOrder] = useState<string[]>([])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'supportDocuments',
  })

  // Initialize group order from active groups
  useEffect(() => {
    const currentOrder = watch('groupOrder') || []
    
    // Check if fixed groups are in correct positions
    const lookedAfterIsFirst = currentOrder[0] === 'looked_after'
    const anyOtherChildrenIsLast = currentOrder.length > 0 && currentOrder[currentOrder.length - 1] === 'any_other_children'
    
    // Only initialize if we don't have an order yet, or if active groups changed, or if fixed positions are wrong
    if (currentOrder.length === 0 || 
        currentOrder.length !== activeGroups.length ||
        !activeGroups.every((id) => currentOrder.includes(id)) ||
        !lookedAfterIsFirst ||
        !anyOtherChildrenIsLast) {
      // Filter out any groups that are no longer active, preserving order
      const filteredOrder = currentOrder.filter((id) => activeGroups.includes(id as GroupId))
      
      // Find new groups that need to be added
      const newGroups = activeGroups.filter((id) => !filteredOrder.includes(id))
      
      // Build new order ensuring fixed positions:
      // 1. "looked_after" must be first
      // 2. "any_other_children" must be last
      // 3. New groups go in the middle (before "any_other_children")
      // IMPORTANT: Always extract fixed groups separately, even if they're in the wrong position
      const lookedAfter = activeGroups.includes('looked_after') ? 'looked_after' : null
      const anyOtherChildren = activeGroups.includes('any_other_children') ? 'any_other_children' : null
      
      // Get middle groups (everything except the fixed first/last)
      // This includes both existing middle groups AND any that were incorrectly placed
      const middleGroups = filteredOrder.filter(
        (id) => id !== 'looked_after' && id !== 'any_other_children'
      )
      
      // Combine: first + middle + new groups + last
      const newOrder: string[] = []
      if (lookedAfter) newOrder.push(lookedAfter)
      newOrder.push(...middleGroups)
      newOrder.push(...newGroups)
      if (anyOtherChildren) newOrder.push(anyOtherChildren)
      
      setGroupOrder(newOrder)
      setValue('groupOrder', newOrder)
    } else if (groupOrder.length === 0) {
      // Use existing order from form state, but validate fixed positions
      const validatedOrder = [...currentOrder]
      const lookedAfterIndex = validatedOrder.indexOf('looked_after')
      const anyOtherChildrenIndex = validatedOrder.indexOf('any_other_children')
      
      // Ensure "looked_after" is first
      if (lookedAfterIndex > 0) {
        validatedOrder.splice(lookedAfterIndex, 1)
        validatedOrder.unshift('looked_after')
      }
      
      // Ensure "any_other_children" is last
      if (anyOtherChildrenIndex >= 0 && anyOtherChildrenIndex < validatedOrder.length - 1) {
        validatedOrder.splice(anyOtherChildrenIndex, 1)
        validatedOrder.push('any_other_children')
      }
      
      setGroupOrder(validatedOrder)
      if (JSON.stringify(validatedOrder) !== JSON.stringify(currentOrder)) {
        setValue('groupOrder', validatedOrder)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroups.length, setValue])

  const moveGroup = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...groupOrder]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= newOrder.length) return

    // Don't allow moving "Looked After" from first position or "Any Other Children" from last
    const currentGroupId = newOrder[index] as GroupId
    const targetGroupId = newOrder[newIndex] as GroupId
    
    if (GROUP_METADATA[currentGroupId]?.alwaysFirst && direction === 'up') return
    if (GROUP_METADATA[currentGroupId]?.alwaysLast && direction === 'down') return
    if (GROUP_METADATA[targetGroupId]?.alwaysFirst && direction === 'down') return
    if (GROUP_METADATA[targetGroupId]?.alwaysLast && direction === 'up') return

    ;[newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]]
    setGroupOrder(newOrder)
    setValue('groupOrder', newOrder)
  }

  const isGroupFixed = (groupId: string) => {
    const group = GROUP_METADATA[groupId as GroupId]
    return (group?.alwaysFirst === true) || (group?.alwaysLast === true) || false
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Reorder Oversubscription Criteria Groups</h3>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
          Please now arrange the order of priority in which you would like the oversubscription criteria to appear in the final text of your admission arrangements. Please note that when you have done this, a further final category (&quot;All Other Children&quot;) will be added at the end of the list automatically.
          <br /><br />
          As well as the oversubscription criteria you have selected, the final word document/PDF will also contain additional standard provisions so that parents are informed about matters such as how any attendance at public worship requirements apply when places of worship have been required to close, admissions outside the normal round, appeals and waiting lists.
        </p>

        {groupOrder.length > 0 ? (
          <div style={{ display: 'grid', gap: 8 }}>
            {groupOrder.map((groupId, index) => {
              const group = GROUP_METADATA[groupId as GroupId]
              if (!group) return null

              const isFixed = isGroupFixed(groupId)
              const canMoveUp = index > 0 && !isFixed && !GROUP_METADATA[groupOrder[index - 1] as GroupId]?.alwaysFirst
              const canMoveDown = index < groupOrder.length - 1 && !isFixed && !GROUP_METADATA[groupOrder[index + 1] as GroupId]?.alwaysLast

              return (
                <div
                  key={groupId}
                  style={{
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    backgroundColor: isFixed ? '#f0f0f0' : '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                      Priority {index + 1}
                      {isFixed && <span style={{ marginLeft: 8, fontStyle: 'italic' }}>(Fixed position)</span>}
                    </div>
                    <div>{group.title}</div>
                  </div>
                  {!isFixed && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <button
                        type="button"
                        onClick={() => moveGroup(index, 'up')}
                        disabled={!canMoveUp}
                        style={{
                          padding: '4px 8px',
                          fontSize: 12,
                          backgroundColor: !canMoveUp ? '#ccc' : '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: !canMoveUp ? 'not-allowed' : 'pointer',
                        }}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveGroup(index, 'down')}
                        disabled={!canMoveDown}
                        style={{
                          padding: '4px 8px',
                          fontSize: 12,
                          backgroundColor: !canMoveDown ? '#ccc' : '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: !canMoveDown ? 'not-allowed' : 'pointer',
                        }}
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ padding: 16, backgroundColor: '#fff3cd', borderRadius: 8 }}>
            No groups to reorder. Please select criteria groups in the previous step.
          </div>
        )}

        <ErrorText message={errors.groupOrder?.message as unknown as string} />
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
