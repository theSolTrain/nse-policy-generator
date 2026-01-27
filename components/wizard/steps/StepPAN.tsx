'use client'

import { useFormContext } from 'react-hook-form'
import type { WizardFormValues } from '@/lib/schema/wizardSchema'

function ErrorText({ message, style }: { message?: string, style?: React.CSSProperties }) {
  if (!message) return null
  return <div className="wizard__error-text" style={style}>{message}</div>
}

export default function StepPAN() {
  const {
    register,
    formState: { errors },
  } = useFormContext<WizardFormValues>()

  return (
    <div className="wizard__form-content">
      <div className="form-element-wrapper">
        <label>
          <div>Enter PAN</div>
          <input {...register('pan')} />
          <ErrorText message={errors.pan?.message} />
        </label>
      </div>

      <div className="form-element-wrapper">
        <label>
          <div>Year of last consultation</div>
          <input placeholder="e.g. 2019" {...register('yearOfLastConsultation')} />
          <ErrorText message={errors.yearOfLastConsultation?.message} />
        </label>
      </div>

      <div className="form-element-wrapper form-element-wrapper--full-width relative">
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend>Year group(s)</legend>

          <label style={{ display: 'block', marginTop: 6 }}>
            <input type="checkbox" style={{ marginRight: 10, width: 'auto' }} {...register('yearGroups.reception')} /> Reception
          </label>
          <label style={{ display: 'block', marginTop: 6 }}>
            <input type="checkbox" style={{ marginRight: 10, width: 'auto' }} {...register('yearGroups.year3')} /> Year 3
          </label>
          <label style={{ display: 'block', marginTop: 6 }}>
            <input type="checkbox" style={{ marginRight: 10, width: 'auto' }} {...register('yearGroups.year7')} /> Year 7
          </label>
          <label style={{ display: 'block', marginTop: 6 }}>
            <input type="checkbox" style={{ marginRight: 10, width: 'auto' }} {...register('yearGroups.year12')} /> Year 12
          </label>

          <ErrorText style={{ bottom: -5, left: 0 }} message={errors.yearGroups?.message as string} />
        </fieldset>
      </div>

      

      <div className="form-element-wrapper form-element-wrapper--full-width">
        <label>
          <div>Governing Body/Academy Trust meeting at which the arrangements are scheduled for review</div>
          <input type="date" {...register('scheduledReviewMeetingDate')} />
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
            The date of the meeting should allow time for consultation with the Diocese and then for the wider consultation, as required by the Code, for a minimum of six weeks starting no earlier than 1 October and ending no later than 31 January in the determination year.
          </div>
          <ErrorText message={errors.scheduledReviewMeetingDate?.message} />
        </label>
      </div>

      <div className="form-element-wrapper form-element-wrapper--full-width">
        <label>
          <div>Consultation deadline</div>
          <input type="date" {...register('consultationDeadline')} />
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
            Every school must determine its admissions arrangements annually, as evidenced via the minutes of the meeting at which the arrangements were determined.
            <br /><br />
            Where changes to the current admission arrangements are proposed, or where it is seven years since the last consultation, then once the admission authority has agreed the content, the proposed admission arrangements must be issued for public consultation as required by the School Admissions Code.
            <br /><br />
            Consultation must be for a minimum of six weeks starting no later than 1 October in the determination year (two academic years before the admission year, e.g. 2026/27 for admission in September 2028) and finishing no later than 31 January (so the latest date to begin consultation is 20 December). The Diocese must be consulted before the wider consultation commences.
          </div>
          <ErrorText message={errors.consultationDeadline?.message} />
        </label>
      </div>

      <div className="form-element-wrapper form-element-wrapper--full-width">
        <label>
          <div>Date proposed admission arrangements to be issued for consultation</div>
          <input type="date" {...register('dateIssuedForConsultation')} />
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
            Dates can only be between 1 October and 20 December.
          </div>
          <ErrorText message={errors.dateIssuedForConsultation?.message} />
        </label>
      </div>

      <div className="form-element-wrapper form-element-wrapper--full-width">
        <label>
          <div>Date of governors/directors meeting at which the admissions arrangements is determined</div>
          <input type="date" {...register('dateDeterminedByGovBody')} />
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
            Date on which the proposed arrangements and consultation responses are scheduled to be considered and determined.
            <br /><br />
            Each year, the admission authority must determine the admission arrangements by no later than 28 February in the determination year, even if they have not changed from previous years and no consultation has been required.
          </div>
          <ErrorText message={errors.dateDeterminedByGovBody?.message} />
        </label>
      </div>

      <div className="form-element-wrapper form-element-wrapper--full-width">
        <label>
          <div>Date forwarded to Local Authority and the Diocesan Board of Education</div>
          <input type="date" {...register('dateForwardedToLAandDBE')} />
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
            Under the Code, the admission authority must send the determined arrangements to the local authority by no later than 15 March in the determination year. The Code also requires the admission authority to send a copy of the determined arrangements to the Diocese.
          </div>
          <ErrorText message={errors.dateForwardedToLAandDBE?.message} />
        </label>
      </div>
    </div>
  )
}
