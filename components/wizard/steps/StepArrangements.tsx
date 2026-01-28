'use client'

import { useFormContext } from 'react-hook-form'
import type { WizardFormValues } from '@/lib/schema/wizardSchema'

function ErrorText({ message, style }: { message?: string, style?: React.CSSProperties }) {
  if (!message) return null
  return <div className="wizard__error-text" style={style}>{message}</div>
}

export default function StepArrangements() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<WizardFormValues>()

  // Watch all conditional checkboxes
  const includeSocialAndMedicalNeed = watch('includeSocialAndMedicalNeed')
  const includePupilPremium = watch('includePupilPremium')
  const includeFaithBased = watch('includeFaithBased')
  const includeChildrenOfStaff = watch('includeChildrenOfStaff')
  const includeSiblings = watch('includeSiblings')
  const includeNamedFeederSchool = watch('includeNamedFeederSchool')
  const includeDistanceFromSchool = watch('includeDistanceFromSchool')
  const includeCatchmentArea = watch('includeCatchmentArea')
  const catchmentMap = watch('catchmentMap')
  const faithBasedOptions = watch('faithBasedOptions')
  const childrenOfStaffCategories = watch('childrenOfStaffCategories')

  return (
    <div className="wizard__form-content">
      {/* Intro text */}
      <div className="form-element-wrapper form-element-wrapper--full-width">
        <div style={{ marginBottom: 24 }}>
          <p style={{ marginBottom: 12 }}>
            All children whose Education, Health and Care Plan (EHCP) names the school must be admitted. 
            This is not an oversubscription criterion, but the children count against the PAN. If the number 
            of applications received is less than the PAN, all applicants will be offered places. If, after 
            the admission of any children with an EHCP naming the school, the number of applications exceeds 
            the number of places remaining available, the school&apos;s oversubscription criteria will be 
            used to determine the allocation of places.
          </p>
          <p>
            The final oversubscription criterion in any admission arrangement must be &quot;any other children&quot;. 
            As this is mandatory, it will automatically appear as the final criterion when the arrangements 
            are created as a PDF. You do not need to insert it yourself.
          </p>
        </div>
      </div>

      {/* Looked After Children - Always shown (informational) */}
      <div className="form-element-wrapper form-element-wrapper--full-width">
        <fieldset style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <legend style={{ fontWeight: 'bold', padding: '0 8px' }}>
            Looked After Children and Previously Looked After Children
          </legend>
          <div style={{ marginTop: 12, padding: '12px', backgroundColor: '#f0f0ff', borderRadius: 4 }}>
            <p style={{ margin: 0, fontSize: 14 }}>
              The first oversubscription criterion must always be Looked After and Previously Looked After Children. 
              As this is a legal requirement, it automatically appears as the first of the school&apos;s oversubscription criteria.
            </p>
          </div>
        </fieldset>
      </div>

      {/* Social and Medical Need */}
      <div className="form-element-wrapper form-element-wrapper--full-width">
        <fieldset style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <legend style={{ fontWeight: 'bold', padding: '0 8px' }}>Social and Medical need</legend>
          
          <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f0ff', borderRadius: 4 }}>
            <h4 style={{ marginTop: 0, marginBottom: 8 }}>Think about...</h4>
            <p style={{ margin: 0, fontSize: 14 }}>
              Your Local Authority may have a coordinated approach to social and medical need. Your Diocesan Board 
              of Education may also recommend a particular approach. Please consult with them before finalising this criterion.
            </p>
          </div>

          <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
            <p style={{ margin: 0, fontSize: 14 }}>
              Throughout the Gospels, we see Christ going to people where they are, meeting them in their need 
              and welcoming them into fullness of life.
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: 14 }}>
              How can your admissions arrangements meet the needs of the community that it serves?
            </p>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <input
              type="checkbox"
              {...register('includeSocialAndMedicalNeed')}
            />
            <span>Tick to include Social and Medical need section</span>
          </label>

          {includeSocialAndMedicalNeed && (
            <div style={{ marginTop: 12, padding: '12px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 4 }}>
              <p style={{ margin: 0, fontSize: 14 }}>
                Supporting evidence in the form of a letter from a doctor or social worker or other relevant 
                qualified, independent professional would be required.
              </p>
            </div>
          )}
        </fieldset>
      </div>

      {/* Pupil Premium */}
      <div className="form-element-wrapper form-element-wrapper--full-width">
        <fieldset style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <legend style={{ fontWeight: 'bold', padding: '0 8px' }}>Pupil Premium</legend>
          
          <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f0ff', borderRadius: 4 }}>
            <h4 style={{ marginTop: 0, marginBottom: 8 }}>Think about...</h4>
            <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
              To what extent do your admissions arrangements reflect a special attention to the disadvantaged or excluded?
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>
              How does your approach to admissions encourage hope and aspiration?
            </p>
          </div>

          <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
            <p style={{ margin: 0, fontSize: 14 }}>
              You can give priority to children eligible for the early years pupil premium, the pupil premium 
              and also children eligible for the service premium.
            </p>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <input
              type="checkbox"
              {...register('includePupilPremium')}
            />
            <span>Tick to include Pupil premium section</span>
          </label>

          {includePupilPremium && (
            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>
                <div style={{ marginBottom: 4, fontSize: 14 }}>
                  You may specify a maximum percentage or number who can benefit under this criterion. If you would 
                  like to do this, please enter the maximum percentage of children to be admitted in each year group 
                  under this criterion.
                </div>
                <input
                  type="number"
                  {...register('pupilPremiumMaxPercentage')}
                  style={{ width: '100%', maxWidth: 200 }}
                />
              </label>

              <fieldset style={{ border: 'none', padding: 0, margin: '16px 0' }}>
                <legend style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>
                  Select the different versions of pupil premium that you would like included in your arrangements:
                </legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" {...register('pupilPremiumTypes.pupilPremium')} />
                    <span>Pupil premium</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" {...register('pupilPremiumTypes.earlyYearsPupilPremium')} />
                    <span>Early years pupil premium</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" {...register('pupilPremiumTypes.servicePremium')} />
                    <span>Service premium</span>
                  </label>
                </div>
              </fieldset>

              <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#f0f0ff', borderRadius: 4 }}>
                <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
                  You can give priority to children eligible for early years pupil premium, pupil premium or 
                  service premium who are in a nursery class, which is part of the school or attend a nursery 
                  that is established and run by the school.
                </p>
                <p style={{ margin: 0, fontSize: 14 }}>
                  There is no automatic admission from nursery into reception; these are required to have separate 
                  admission arrangements.
                </p>
              </div>

              <label style={{ display: 'block', marginTop: 16 }}>
                <div style={{ marginBottom: 4, fontSize: 14 }}>
                  If you would like to do so, please enter the name of the nursery here
                </div>
                <input
                  type="text"
                  {...register('pupilPremiumNurseryName')}
                  placeholder="e.g. St. Helena Charter School, East Halpy"
                  style={{ width: '100%' }}
                />
              </label>

              <fieldset style={{ border: 'none', padding: 0, margin: '16px 0' }}>
                <legend style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>
                  Please select the different versions of pupil premium that you would like included in your 
                  priority for a nursery class:
                </legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" {...register('pupilPremiumNurseryTypes.nurseryVersionPupilPremium')} />
                    <span>Pupil premium</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" {...register('pupilPremiumNurseryTypes.nurseryVersionEarlyYearsPupilPremium')} />
                    <span>Early years pupil premium</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" {...register('pupilPremiumNurseryTypes.nurseryVersionServicePremium')} />
                    <span>Service premium</span>
                  </label>
                </div>
              </fieldset>
            </div>
          )}
        </fieldset>
      </div>

      {/* Faith Based */}
      <div className="form-element-wrapper form-element-wrapper--full-width">
        <fieldset style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <legend style={{ fontWeight: 'bold', padding: '0 8px' }}>Faith based</legend>
          
          <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f0ff', borderRadius: 4 }}>
            <h4 style={{ marginTop: 0, marginBottom: 8 }}>Think about...</h4>
            <p style={{ margin: 0, fontSize: 14 }}>
              How will including this criterion allow you to reflect your community and foster a commitment 
              to those who are disadvantaged?
            </p>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <input
              type="checkbox"
              {...register('includeFaithBased')}
            />
            <span>Tick to include faith based section</span>
          </label>

          <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
            <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
              You must also have regard to any guidance from your Diocesan Board of Education when constructing 
              any faith-based admission arrangements and must consult when deciding how membership or practice of 
              the faith is to be demonstrated.
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
              If any practice requirement is to be used, it must have been set out by the Diocesan Board of 
              Education in guidance.
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>
              We recommend that a useful focus for governors/directors when reviewing admissions issues should be 
              the &apos;crunch point&apos; in the criteria, which is the point at which the criteria is most frequently 
              applied. Providers may consider removing criteria that are never or very infrequently applied to make 
              the application process as transparent and straightforward as possible.
            </p>
          </div>

          <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
            <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
              Including this criterion means you must also have a Supplementary Information Form (SIF) as part 
              of your admissions arrangements.
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>
              It is important to check that the wording on faith-based criteria of the admissions policy, the SIF 
              and any clergy reference form are identical. A SIF must only be required to obtain essential information 
              not included on the Common Application Form (CAF). It is not therefore required in every case. The two 
              principal reasons it can be required are if the school uses faith-based criteria or takes account of 
              social or medical need within its criteria (for which additional evidence is normally required. Check 
              that the Local Authority Common Application Form does not already include information that the school 
              is intending to put on the SIF: if on the CAF, then the same information must not be sought via the SIF.
            </p>
          </div>

          {includeFaithBased && (
            <div style={{ marginTop: 16 }}>
              <fieldset style={{ border: 'none', padding: 0, margin: '16px 0' }}>
                <legend style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>
                  Faith based options, tick if you want a faith-based oversubscription criterion to apply to:
                </legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <input type="checkbox" {...register('faithBasedOptions.catchmentAreaOrParish')} style={{ marginTop: 4 }} />
                    <div>
                      <span>Residence in the Parish or in the catchment area and attendance at public worship in a Church of England church (Remember to specify in the field below)</span>
                      <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                        Check with your Diocesan Board of Education before restricting church attendance to only one or 
                        a small number of named churches, for example as pastoral reorganisations increase in number and 
                        scale, it may be wiser to broaden the range of churches that are within the criteria, for example 
                        to &apos;any Church of England church&apos;.
                      </div>
                    </div>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <input type="checkbox" {...register('faithBasedOptions.publicWorshipCoFE')} style={{ marginTop: 4 }} />
                    <div>
                      <span>Attendance at public worship in any Church of England church</span>
                      <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                        It is recommended that attendance at public worship is the sole measure of religious activity used, 
                        and that that attendance at public worship is sufficiently defined and set out in guidance by the 
                        Diocesan Board of Education. This criterion means physical attendance at an act of public worship. 
                        Online worship and private prayers in the church building do not meet this requirement. Whilst the 
                        pattern of church worship naturally varies, the routine weekly services (morning and evening prayer 
                        and celebration of the Eucharist) meet this criterion, as do the many other forms of public worship 
                        found in the Church of England.
                      </div>
                    </div>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <input type="checkbox" {...register('faithBasedOptions.evangelicalAlliance')} style={{ marginTop: 4 }} />
                    <div>
                      <span>A Christian Church means any church which is designated under the Ecumenical Relations Measure nationally 
                        by the Archbishops of Canterbury and York or locally by the diocesan bishop; or is a member of Churches 
                        Together in England; or of the Evangelical Alliance; or a Partner church of Affinity</span>
                      <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                        This definition has a clear statutory basis: A Measure is church legislation, passed by General Synod and 
                        approved by parliament and requires royal assent. Once in force, the Measure is equivalent to a statute. It 
                        applies across England and covers all dioceses, The Archbishops designate churches nationally and diocesan 
                        bishops can designate new churches which are found locally, and which may not have a national presence. It 
                        includes churches with which we partner, including those with which we are not formally in communion and other 
                        bodies, principally the Quakers and the Salvation Army that would not define themselves as churches. It is 
                        more inclusive than other definitions: it can take account of new churches, especially those that may not have 
                        a national presence. At the same time, the criteria for designation take account of the new church&apos;s overall 
                        theology, its leadership and financial position. It is accessible: the bodies nationally designated are published 
                        online, and churches designated locally can be found from each diocese.
                      </div>
                    </div>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <input type="checkbox" {...register('faithBasedOptions.otherFaiths')} style={{ marginTop: 4 }} />
                    <div>
                      <span>Attendance at public worship or its equivalent by members of other faiths</span>
                      <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                        The rationale for this criteria needs to be carefully explained and discussed with the Diocesan Board of Education, 
                        it is also crucial to frame the attendance criteria for these faiths so that their adherents are not unintentionally 
                        excluded from fulfilling them e.g., by not specifying that attendance at worship must be on a Sunday.
                      </div>
                    </div>
                  </label>
                </div>
              </fieldset>

              {faithBasedOptions?.catchmentAreaOrParish && (
                <label style={{ display: 'block', marginTop: 16 }}>
                  <div style={{ marginBottom: 4, fontSize: 14 }}>
                    As you selected option 1, please include church name here
                  </div>
                  <input
                    type="text"
                    {...register('faithBasedChurchName')}
                    placeholder="e.g. St George's, Bathmor"
                    style={{ width: '100%' }}
                  />
                  <ErrorText message={errors.faithBasedChurchName?.message} />
                </label>
              )}

              <fieldset style={{ border: 'none', padding: 0, margin: '16px 0' }}>
                <legend style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>
                  What frequency of attendance is required?
                </legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="radio" value="less_8" {...register('faithBasedAttendanceFrequency')} />
                    <span>Eight times in the twelve months immediately prior to the date of application</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="radio" value="less_16" {...register('faithBasedAttendanceFrequency')} />
                    <span>Sixteen times in the twenty-four months immediately prior to the closing date for application</span>
                  </label>
                </div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                  Both the duration and frequency of attendance at public worship must be clearly defined and provide an obvious threshold. 
                  Additionally, the arrangements need to consider that the frequency and duration of attendance at public worship is reasonable 
                  and proportionate.
                </div>
                <ErrorText message={errors.faithBasedAttendanceFrequency?.message} />
              </fieldset>
            </div>
          )}
        </fieldset>
      </div>

      {/* Children of Staff */}
      <div className="form-element-wrapper form-element-wrapper--full-width">
        <fieldset style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <legend style={{ fontWeight: 'bold', padding: '0 8px' }}>Children of staff</legend>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <input
              type="checkbox"
              {...register('includeChildrenOfStaff')}
            />
            <span>Tick to include Children of Staff section</span>
          </label>

          <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f0ff', borderRadius: 4 }}>
            <h4 style={{ marginTop: 0, marginBottom: 8 }}>Think about...</h4>
            <p style={{ margin: 0, fontSize: 14 }}>
              How will this criterion impact on the pupils, school and wider community?
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 14 }}>
              In each case this criterion applies only to staff who have been employed at the school for two or 
              more years at the time at which application for admission is made.
            </p>
          </div>

          {includeChildrenOfStaff && (
            <div style={{ marginTop: 16 }}>
              <fieldset style={{ border: 'none', padding: 0, margin: '16px 0' }}>
                <legend style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>
                  Please select which categories you want to include
                </legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" {...register('childrenOfStaffCategories.staffRecruited')} />
                    <span>Children of staff recruited to fill a vacant post for which there is a demonstrable skill shortage</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" {...register('childrenOfStaffCategories.staffEmployed')} />
                    <span>Children of staff who have been employed at the school for two or more years at the time at which application for admission is made</span>
                  </label>
                </div>
              </fieldset>

              {childrenOfStaffCategories?.staffEmployed && (
                <fieldset style={{ border: 'none', padding: 0, margin: '16px 0' }}>
                  <legend style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>
                    Please select which category you want to include
                  </legend>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="radio" value="teaching_staff" {...register('childrenOfStaffType')} />
                      <span>Children of teaching staff only</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="radio" value="non_teaching_staff" {...register('childrenOfStaffType')} />
                      <span>Children of non-teaching staff only</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="radio" value="all_staff" {...register('childrenOfStaffType')} />
                      <span>Children of all staff</span>
                    </label>
                  </div>
                  <ErrorText message={errors.childrenOfStaffType?.message} />
                </fieldset>
              )}
            </div>
          )}
        </fieldset>
      </div>

      {/* Siblings */}
      <div className="form-element-wrapper form-element-wrapper--full-width">
        <fieldset style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <legend style={{ fontWeight: 'bold', padding: '0 8px' }}>Siblings</legend>
          
          <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f0ff', borderRadius: 4 }}>
            <h4 style={{ marginTop: 0, marginBottom: 8 }}>Think about...</h4>
            <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
              How will this criterion impact on the pupils, school and wider community?
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
              Would this criterion benefit the wider community or would it foster division?
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
              This will be dependent upon your local context.
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>
              How will you strike a balance between the needs of families with more than one child and the needs 
              of first born or only children to attend the school?
            </p>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
            <input type="checkbox" {...register('includeSiblings')} style={{ marginTop: 4 }} />
            <span>
              Tick to include Siblings section (&apos;Sibling&apos; means a brother or sister, a half brother or sister, 
              a legally adopted brother or sister or half-brother or sister, a step brother or sister, or other child 
              living in the same household who, in any of these cases, will be living with them at the same address 
              at the date of their entry to the academy).
            </span>
          </label>

          {includeSiblings && (
            <fieldset style={{ border: 'none', padding: 0, margin: '16px 0' }}>
              <legend style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>
                Children with a sibling attending the school
              </legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="radio" value="time_application" {...register('siblingsTiming')} />
                  <span>at the time of application</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="radio" value="time_admission" {...register('siblingsTiming')} />
                  <span>at the time of admission</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="radio" value="catchment_parish" {...register('siblingsTiming')} />
                  <span>at the time of application who live within the catchment area/parish</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="radio" value="outside_catchment_parish" {...register('siblingsTiming')} />
                  <span>at the time of application who live outside the catchment area/parish.</span>
                </label>
              </div>
              <ErrorText message={errors.siblingsTiming?.message} />
            </fieldset>
          )}
        </fieldset>
      </div>

      {/* Named Feeder School */}
      <div className="form-element-wrapper form-element-wrapper--full-width">
        <fieldset style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <legend style={{ fontWeight: 'bold', padding: '0 8px' }}>Named Feeder School</legend>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <input
              type="checkbox"
              {...register('includeNamedFeederSchool')}
            />
            <span>Tick to include named feeder school or schools</span>
          </label>

          {includeNamedFeederSchool && (
            <label style={{ display: 'block', marginTop: 16 }}>
              <div style={{ marginBottom: 4, fontSize: 14 }}>Insert named feeder school</div>
              <input
                type="text"
                {...register('namedFeederSchool')}
                placeholder="eg. St. Helena Charter School, East Halpy"
                style={{ width: '100%' }}
              />
              <ErrorText message={errors.namedFeederSchool?.message} />
            </label>
          )}
        </fieldset>
      </div>

      {/* Distance from School */}
      <div className="form-element-wrapper form-element-wrapper--full-width">
        <fieldset style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <legend style={{ fontWeight: 'bold', padding: '0 8px' }}>Distance from school</legend>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <input
              type="checkbox"
              {...register('includeDistanceFromSchool')}
            />
            <span>Tick to include Distance from school section</span>
          </label>

          {includeDistanceFromSchool && (
            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', marginBottom: 16 }}>
                <div style={{ marginBottom: 4, fontSize: 14 }}>
                  How will the distance from school be calculated?
                </div>
                <textarea
                  rows={5}
                  {...register('distanceSchoolCalculated')}
                  style={{ width: '100%', padding: 8 }}
                />
                <ErrorText message={errors.distanceSchoolCalculated?.message} />
              </label>

              <label style={{ display: 'block' }}>
                <div style={{ marginBottom: 4, fontSize: 14 }}>
                  How is the home address determined?
                </div>
                <textarea
                  rows={5}
                  {...register('howIsHomeAddressDetermined')}
                  style={{ width: '100%', padding: 8 }}
                />
                <ErrorText message={errors.howIsHomeAddressDetermined?.message} />
              </label>
            </div>
          )}
        </fieldset>
      </div>

      {/* Catchment Area */}
      <div className="form-element-wrapper form-element-wrapper--full-width">
        <fieldset style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <legend style={{ fontWeight: 'bold', padding: '0 8px' }}>Catchment area</legend>
          
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 14 }}>
              If you wish to use a catchment area for the school as one of the criteria, attach a map to indicate 
              the extent of that catchment area.
            </p>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <input
              type="checkbox"
              {...register('includeCatchmentArea')}
            />
            <span>Tick to include Catchment Area section</span>
          </label>

          {includeCatchmentArea && (
            <div style={{ marginTop: 16 }}>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) {
                    setValue('catchmentMap', undefined, { shouldValidate: true })
                    return
                  }

                  const allowedTypes = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg', 'image/webp']
                  if (!allowedTypes.includes(file.type)) {
                    setValue('catchmentMap', undefined, { shouldValidate: true })
                    alert('Invalid file type. Please upload PNG, JPG, WebP, or SVG.')
                    return
                  }

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
          )}
        </fieldset>
      </div>

      {/* Tiebreaker Section */}
      <div className="form-element-wrapper form-element-wrapper--full-width">
        <fieldset style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <legend style={{ fontWeight: 'bold', padding: '0 8px' }}>Tiebreaker</legend>
          
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Distance from school</h3>
          </div>

          <fieldset style={{ border: 'none', padding: 0, margin: '16px 0' }}>
            <legend style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>
              Measure used
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <input type="radio" value="crow_files" {...register('tiebreakerMeasure')} style={{ marginTop: 4 }} />
                <span>
                  We will measure the distance by a straight line. All straight-line distances are calculated 
                  electronically using a geographical information system and with the support of the Local Authority 
                  where required
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <input type="radio" value="gis" {...register('tiebreakerMeasure')} style={{ marginTop: 4 }} />
                <span>
                  This will be measured by the shortest walking distance by road or maintained footpath or other 
                  public rights of way from the pupil&apos;s home, to the main entrance point of the school using a 
                  GIS computerised mapping system.
                </span>
              </label>
            </div>
            <ErrorText message={errors.tiebreakerMeasure?.message} />
          </fieldset>

          <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
            <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
              If two or more applicants for the final place live the same distance from the school, random allocation 
              will be used as a final tie-breaker, and will be supervised by someone independent of the school.
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>
              This will be measured by the shortest walking distance by road or maintained footpath or other public 
              rights of way from the pupil&apos;s home, to the main entrance point of the school using a GIS computerised 
              mapping system.
            </p>
          </div>
        </fieldset>
      </div>
    </div>
  )
}
