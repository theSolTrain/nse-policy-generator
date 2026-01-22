'use client'

import { useFormContext } from 'react-hook-form'
import type { WizardFormValues } from '@/lib/schema/wizardSchema'

function ErrorText({ message }: { message?: string }) {
  if (!message) return null
  return <div className="wizard__error-text">{message}</div>
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
    <div className="wizard__form-content">
      <div className="form-element-wrapper">
        <label>
          <div>School name *</div>
          <input {...register('schoolName')} />
          <ErrorText message={errors.schoolName?.message} />
        </label>
      </div>

      <div className="form-element-wrapper">
        <label>
          <div>School address *</div>
          <input {...register('schoolAddress')} />
          <ErrorText message={errors.schoolAddress?.message} />
        </label>
      </div>

      <div className="form-element-wrapper">
        <label>
          <div>School website address</div>
          <input placeholder="https://www.schoolwebsite.com" {...register('schoolWebsite')} />
          <ErrorText message={errors.schoolWebsite?.message as string} />
        </label>
      </div>

      <div className="form-element-wrapper">
        <label>
          <div>School type *</div>
          <input {...register('schoolType')} />
          <ErrorText message={errors.schoolType?.message} />
        </label>
      </div>

      <div className="form-element-wrapper">
        <label>
        <div>School phase *</div>
        <input {...register('schoolPhase')} />
        <ErrorText message={errors.schoolPhase?.message} />
        </label>
      </div>

      {/* Logo upload */}
      <div className="form-element-wrapper">
        <div>School logo</div>

        <input
          type="file"
          accept="image/png,image/svg+xml,image/jpeg,image/jpg,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) {
              setValue('schoolLogo', undefined, { shouldValidate: true })
              return
            }

            // Validate file type
            const allowedTypes = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg', 'image/webp']
            if (!allowedTypes.includes(file.type)) {
              setValue('schoolLogo', undefined, { shouldValidate: true })
              alert('Invalid file type. Please upload PNG, JPG, WebP, or SVG.')
              return
            }

            // Validate file size (3MB max)
            const maxSize = 3 * 1024 * 1024 // 3MB
            if (file.size > maxSize) {
              setValue('schoolLogo', undefined, { shouldValidate: true })
              alert('File size exceeds 3MB. Please upload a smaller file.')
              return
            }

            setValue('schoolLogo', file, { shouldValidate: true })
          }}
        />

        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
          Accepted formats: PNG, JPG, WebP, SVG. Max size: 3MB.
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

        <ErrorText message={errors.schoolLogo?.message as string} />
      </div>

      {/* Vision statement */}
      <div className="form-element-wrapper">
        <label>
          <div>Vision statement*</div>
          <textarea rows={6} {...register('visionStatement')} />
          <ErrorText message={errors.visionStatement?.message} />
        </label>
      </div>

      <div className="form-element-wrapper">
        <label>
          <div>Diocese *</div>
          <input {...register('diocese')} />
          <ErrorText message={errors.diocese?.message} />
        </label>
      </div>

      <div className="form-element-wrapper">  
        <label>
          <div>Admissions authority *</div>
          <input {...register('admissionsAuthority')} />
          <ErrorText message={errors.admissionsAuthority?.message} />
        </label>
      </div>

      <div className="form-element-wrapper">
        <label style={{ gridColumn: '1 / -1' }}>
          <div>Named post to contact for queries on admissions (including appeals) *</div>
          <input {...register('namedContact')} />
          <ErrorText message={errors.namedContact?.message} />
        </label>
      </div>

      <div className="form-element-wrapper">
        <label>
          <div>Local authority *</div>
          <input {...register('localAuthority')} />
          <ErrorText message={errors.localAuthority?.message} />
        </label>
      </div>

      <div className="form-element-wrapper">
        <label>
          <div>Age range *</div>
          <input {...register('ageRange')} />
          <ErrorText message={errors.ageRange?.message} />
        </label>
      </div>

      <div className="form-element-wrapper">
        <label style={{ gridColumn: '1 / -1' }}>
          <div>Local authority address *</div>
          <input {...register('localAuthorityAddress')} />
          <ErrorText message={errors.localAuthorityAddress?.message} />
        </label>
      </div>

      <div className="form-element-wrapper">
        <label>
          <div>Number on roll *</div>
          <input {...register('numberOnRoll')} />
          <ErrorText message={errors.numberOnRoll?.message} />
        </label>
      </div>

      {/* Yes/No radios */}
      <div className="form-element-wrapper">
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend>Was your school oversubscribed (in the previous admissions year, if applicable)?</legend>
          <label style={{ display: 'block', marginTop: 10 }}>
            <input type="radio" value="yes" style={{ marginRight: 10, width: 'auto' }} {...register('wasOversubscribedLastYear')} /> Yes
          </label>
          <label style={{ display: 'block', marginTop: 6 }}>
            <input type="radio" value="no" style={{ marginRight: 10, width: 'auto' }} {...register('wasOversubscribedLastYear')} /> No
          </label>
          <ErrorText message={errors.wasOversubscribedLastYear?.message} />
        </fieldset>
      </div>

      <div className="form-element-wrapper">
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend>
          Did your admissions arrangements contain faith-based oversubscription criteria (in the previous admissions year)?
        </legend>
        <label style={{ display: 'block', marginTop: 10 }}>
          <input type="radio" value="yes" style={{ marginRight: 10, width: 'auto' }} {...register('hadFaithBasedCriteriaLastYear')} /> Yes
        </label>
        <label style={{ display: 'block', marginTop: 6 }}>
          <input type="radio" value="no" style={{ marginRight: 10, width: 'auto' }} {...register('hadFaithBasedCriteriaLastYear')} /> No
        </label>
        <ErrorText message={errors.hadFaithBasedCriteriaLastYear?.message} />
      </fieldset>
      </div>

      <div className="form-element-wrapper">
        <label>
          <div>
            How many pupils were admitted on the basis of faith as prioritised through faith oversubscription criteria (in the previous admissions year)?
          </div>
          <input {...register('faithAdmissionsLastYear')} />
          <ErrorText message={errors.faithAdmissionsLastYear?.message} />
        </label>
      </div>

      <div className="form-element-wrapper">
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
      </div>

      <div className="form-element-wrapper">
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
