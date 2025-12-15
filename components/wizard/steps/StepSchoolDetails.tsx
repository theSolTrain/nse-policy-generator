'use client'

import { useFormContext } from 'react-hook-form'
import type { WizardFormValues } from '@/lib/schema/wizardSchema'

function ErrorText({ message }: { message?: string }) {
  if (!message) return null
  return <div style={{ color: 'crimson', marginTop: 6 }}>{message}</div>
}

export default function StepSchoolDetails() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<WizardFormValues>()

  const logo = watch('schoolLogo')

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {/* Two-column-ish layout without styling framework */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <label>
          <div>School name</div>
          <input {...register('schoolName')} />
          <ErrorText message={errors.schoolName?.message} />
        </label>

        <label>
          <div>School address</div>
          <input {...register('schoolAddress')} />
          <ErrorText message={errors.schoolAddress?.message} />
        </label>

        <label>
          <div>School website address</div>
          <input placeholder="https://www.schoolwebsite.com" {...register('schoolWebsite')} />
          <ErrorText message={errors.schoolWebsite?.message as any} />
        </label>

        <label>
          <div>School type</div>
          <input {...register('schoolType')} />
          <ErrorText message={errors.schoolType?.message} />
        </label>

        <label style={{ gridColumn: '1 / -1' }}>
          <div>School phase</div>
          <input {...register('schoolPhase')} />
          <ErrorText message={errors.schoolPhase?.message} />
        </label>
      </div>

      {/* Logo upload */}
      <div>
        <div style={{ marginBottom: 8 }}>School logo</div>

        <input
          type="file"
          accept="image/png,image/svg+xml,image/jpeg,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0]
            setValue('schoolLogo', file, { shouldValidate: true })
          }}
        />

        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
          png or svg preferred for quality reasons. One file only.
        </div>

        {logo instanceof File && (
          <div style={{ marginTop: 8, fontSize: 12 }}>
            Selected: <strong>{logo.name}</strong> ({Math.round(logo.size / 1024)} KB)
            {'  '}
            <button
              type="button"
              onClick={() => setValue('schoolLogo', undefined, { shouldValidate: true })}
              style={{ marginLeft: 10 }}
            >
              Remove
            </button>
          </div>
        )}

        <ErrorText message={errors.schoolLogo?.message as any} />
      </div>

      {/* Vision statement */}
      <label>
        <div>Vision statement</div>
        <textarea rows={6} {...register('visionStatement')} />
        <ErrorText message={errors.visionStatement?.message} />
      </label>

      {/* Remaining fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <label>
          <div>Diocese</div>
          <input {...register('diocese')} />
          <ErrorText message={errors.diocese?.message} />
        </label>

        <label>
          <div>Admissions authority</div>
          <input {...register('admissionsAuthority')} />
          <ErrorText message={errors.admissionsAuthority?.message} />
        </label>

        <label style={{ gridColumn: '1 / -1' }}>
          <div>Named post to contact for queries on admissions (including appeals)</div>
          <input {...register('namedContact')} />
          <ErrorText message={errors.namedContact?.message} />
        </label>

        <label>
          <div>Local authority</div>
          <input {...register('localAuthority')} />
          <ErrorText message={errors.localAuthority?.message} />
        </label>

        <label>
          <div>Age range</div>
          <input {...register('ageRange')} />
          <ErrorText message={errors.ageRange?.message} />
        </label>

        <label style={{ gridColumn: '1 / -1' }}>
          <div>Local authority address</div>
          <input {...register('localAuthorityAddress')} />
          <ErrorText message={errors.localAuthorityAddress?.message} />
        </label>

        <label>
          <div>Number on roll</div>
          <input {...register('numberOnRoll')} />
          <ErrorText message={errors.numberOnRoll?.message} />
        </label>
      </div>

      {/* Yes/No radios */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend>Was your school oversubscribed (in the previous admissions year, if applicable)?</legend>
        <label style={{ display: 'block', marginTop: 6 }}>
          <input type="radio" value="yes" {...register('wasOversubscribedLastYear')} /> Yes
        </label>
        <label style={{ display: 'block', marginTop: 6 }}>
          <input type="radio" value="no" {...register('wasOversubscribedLastYear')} /> No
        </label>
        <ErrorText message={errors.wasOversubscribedLastYear?.message} />
      </fieldset>

      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend>
          Did your admissions arrangements contain faith-based oversubscription criteria (in the previous admissions year)?
        </legend>
        <label style={{ display: 'block', marginTop: 6 }}>
          <input type="radio" value="yes" {...register('hadFaithBasedCriteriaLastYear')} /> Yes
        </label>
        <label style={{ display: 'block', marginTop: 6 }}>
          <input type="radio" value="no" {...register('hadFaithBasedCriteriaLastYear')} /> No
        </label>
        <ErrorText message={errors.hadFaithBasedCriteriaLastYear?.message} />
      </fieldset>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <label>
          <div>
            How many pupils were admitted on the basis of faith as prioritised through faith oversubscription criteria (in the previous admissions year)?
          </div>
          <input {...register('faithAdmissionsLastYear')} />
          <ErrorText message={errors.faithAdmissionsLastYear?.message} />
        </label>

        <label>
          <div>Admission year</div>
          <select {...register('admissionYear')}>
            <option value="">Select…</option>
            <option value="2025/2026">2025/2026</option>
            <option value="2026/2027">2026/2027</option>
            <option value="2027/2028">2027/2028</option>
          </select>
          <ErrorText message={errors.admissionYear?.message} />
        </label>

        <label style={{ gridColumn: '1 / -1' }}>
          <div>
            Number of days from date of letter refusing a place within which parents can bring an appeal (must be at least 20)
          </div>
          <input {...register('appealDays')} />
          <ErrorText message={errors.appealDays?.message} />
        </label>
      </div>
    </div>
  )
}
