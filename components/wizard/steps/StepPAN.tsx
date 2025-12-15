'use client'

import { useFormContext } from 'react-hook-form'
import type { WizardFormValues } from '@/lib/schema/wizardSchema'

function ErrorText({ message }: { message?: string }) {
  if (!message) return null
  return <div style={{ color: 'crimson', marginTop: 6 }}>{message}</div>
}

export default function StepPAN() {
  const {
    register,
    formState: { errors },
  } = useFormContext<WizardFormValues>()

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <label>
        <div>Enter PAN</div>
        <input {...register('pan')} />
        <ErrorText message={errors.pan?.message} />
      </label>

      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend>Year group(s)</legend>

        <label style={{ display: 'block', marginTop: 6 }}>
          <input type="checkbox" {...register('yearGroups.reception')} /> Reception
        </label>
        <label style={{ display: 'block', marginTop: 6 }}>
          <input type="checkbox" {...register('yearGroups.year3')} /> Year 3
        </label>
        <label style={{ display: 'block', marginTop: 6 }}>
          <input type="checkbox" {...register('yearGroups.year7')} /> Year 7
        </label>
        <label style={{ display: 'block', marginTop: 6 }}>
          <input type="checkbox" {...register('yearGroups.year12')} /> Year 12
        </label>

        <ErrorText message={errors.yearGroups?.message as any} />
      </fieldset>

      <label>
        <div>Year of last consultation</div>
        <input placeholder="e.g. 2019" {...register('yearOfLastConsultation')} />
        <ErrorText message={errors.yearOfLastConsultation?.message} />
      </label>

      <label>
        <div>Governing Body/Academy Trust meeting at which the arrangements are scheduled for review</div>
        <input type="date" {...register('scheduledReviewMeetingDate')} />
        <ErrorText message={errors.scheduledReviewMeetingDate?.message} />
      </label>

      <label>
        <div>Consultation deadline</div>
        <input type="date" {...register('consultationDeadline')} />
        <ErrorText message={errors.consultationDeadline?.message} />
      </label>

      <label>
        <div>Date proposed admission arrangements to be issued for consultation</div>
        <input type="date" {...register('dateIssuedForConsultation')} />
        <ErrorText message={errors.dateIssuedForConsultation?.message} />
      </label>

      <label>
        <div>Date of governors/directors meeting at which the admissions arrangements is determined</div>
        <input type="date" {...register('dateDeterminedByGovBody')} />
        <ErrorText message={errors.dateDeterminedByGovBody?.message} />
      </label>

      <label>
        <div>Date forwarded to Local Authority and the Diocesan Board of Education</div>
        <input type="date" {...register('dateForwardedToLAandDBE')} />
        <ErrorText message={errors.dateForwardedToLAandDBE?.message} />
      </label>
    </div>
  )
}
