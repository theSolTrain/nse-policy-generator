import type { WizardFormValues } from '@/lib/schema/wizardSchema'

type TemplateData = WizardFormValues & {
  schoolLogoBase64?: string
  catchmentMapBase64?: string
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'N/A'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return dateStr
  }
}

function formatLongDate(): string {
  const date = new Date()
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

// Group metadata matching StepFinalising
const GROUP_METADATA = {
  looked_after: { id: 'looked_after', title: 'Looked After Children and Previously Looked After Children' },
  social_medical: { id: 'social_medical', title: 'Social and Medical Need' },
  pupil_premium: { id: 'pupil_premium', title: 'Pupil Premium' },
  faith_based: { id: 'faith_based', title: 'Faith Based' },
  children_of_staff: { id: 'children_of_staff', title: 'Children of Staff' },
  siblings: { id: 'siblings', title: 'Siblings' },
  named_feeder_school: { id: 'named_feeder_school', title: 'Named Feeder School' },
  distance_from_school: { id: 'distance_from_school', title: 'Distance from School' },
  catchment_area: { id: 'catchment_area', title: 'Catchment Area' },
  any_other_children: { id: 'any_other_children', title: 'Any Other Children' },
} as const

type GroupId = keyof typeof GROUP_METADATA

// Helper to generate group content HTML
function generateGroupContent(groupId: GroupId, data: TemplateData): string {
  switch (groupId) {
    case 'looked_after':
      return `
        <p>Children who are looked after or were previously looked after, including those children who appear to have been in state care outside of England and ceased to be in state care as a result of being adopted.</p>
      `
    
    case 'social_medical':
      if (!data.includeSocialAndMedicalNeed) return ''
      return `
        <p>Children with a particular medical or social need that can only be met at this school. Supporting evidence in the form of a letter from a doctor or social worker or other relevant qualified, independent professional would be required.</p>
      `
    
    case 'pupil_premium':
      if (!data.includePupilPremium) return ''
      const ppTypes: string[] = []
      if (data.pupilPremiumTypes?.pupilPremium) ppTypes.push('pupil premium')
      if (data.pupilPremiumTypes?.earlyYearsPupilPremium) ppTypes.push('early years pupil premium')
      if (data.pupilPremiumTypes?.servicePremium) ppTypes.push('service premium')
      
      if (ppTypes.length === 0) return ''
      
      let ppText = `Children eligible for ${ppTypes.join(', ')}`
      if (data.pupilPremiumMaxPercentage) {
        ppText += ` (up to ${data.pupilPremiumMaxPercentage}% of places)`
      }
      
      if (data.pupilPremiumNurseryName) {
        const nurseryTypes: string[] = []
        if (data.pupilPremiumNurseryTypes?.nurseryVersionPupilPremium) nurseryTypes.push('pupil premium')
        if (data.pupilPremiumNurseryTypes?.nurseryVersionEarlyYearsPupilPremium) nurseryTypes.push('early years pupil premium')
        if (data.pupilPremiumNurseryTypes?.nurseryVersionServicePremium) nurseryTypes.push('service premium')
        
        if (nurseryTypes.length > 0) {
          ppText += `<br /><br />Children eligible for ${nurseryTypes.join(', ')} who are in a nursery class at ${data.pupilPremiumNurseryName}`
        }
      }
      
      return `<p>${ppText}</p>`
    
    case 'faith_based':
      if (!data.includeFaithBased) return ''
      const faithOptions: string[] = []
      if (data.faithBasedOptions?.catchmentAreaOrParish) {
        faithOptions.push(`Residence in the Parish or in the catchment area and attendance at public worship in a Church of England church${data.faithBasedChurchName ? ` (${data.faithBasedChurchName})` : ''}`)
      }
      if (data.faithBasedOptions?.publicWorshipCoFE) {
        faithOptions.push('Attendance at public worship in any Church of England church')
      }
      if (data.faithBasedOptions?.evangelicalAlliance) {
        faithOptions.push('A Christian Church means any church which is designated under the Ecumenical Relations Measure nationally by the Archbishops of Canterbury and York or locally by the diocesan bishop; or is a member of Churches Together in England; or of the Evangelical Alliance; or a Partner church of Affinity')
      }
      if (data.faithBasedOptions?.otherFaiths) {
        faithOptions.push('Attendance at public worship or its equivalent by members of other faiths')
      }
      
      let faithText = faithOptions.join('<br />')
      if (data.faithBasedAttendanceFrequency) {
        const frequency = data.faithBasedAttendanceFrequency === 'less_8' 
          ? 'Eight times in the twelve months immediately prior to the date of application'
          : 'Sixteen times in the twenty-four months immediately prior to the closing date for application'
        faithText += `<br /><br />Frequency requirement: ${frequency}`
      }
      
      return `<p>${faithText}</p>`
    
    case 'children_of_staff':
      if (!data.includeChildrenOfStaff) return ''
      const staffCategories: string[] = []
      if (data.childrenOfStaffCategories?.staffRecruited) {
        staffCategories.push('Children of staff recruited to fill a vacant post for which there is a demonstrable skill shortage')
      }
      if (data.childrenOfStaffCategories?.staffEmployed) {
        let staffType = 'staff'
        if (data.childrenOfStaffType === 'teaching_staff') staffType = 'teaching staff'
        else if (data.childrenOfStaffType === 'non_teaching_staff') staffType = 'non-teaching staff'
        else if (data.childrenOfStaffType === 'all_staff') staffType = 'all staff'
        staffCategories.push(`Children of ${staffType} who have been employed at the school for two or more years at the time at which application for admission is made`)
      }
      return `<p>${staffCategories.join('<br />')}</p>`
    
    case 'siblings':
      if (!data.includeSiblings) return ''
      const siblingTiming = data.siblingsTiming === 'time_application' 
        ? 'at the time of application'
        : data.siblingsTiming === 'time_admission'
        ? 'at the time of admission'
        : data.siblingsTiming === 'catchment_parish'
        ? 'at the time of application who live within the catchment area/parish'
        : 'at the time of application who live outside the catchment area/parish'
      return `<p>Children with a sibling attending the school ${siblingTiming}. (&apos;Sibling&apos; means a brother or sister, a half brother or sister, a legally adopted brother or sister or half-brother or sister, a step brother or sister, or other child living in the same household who, in any of these cases, will be living with them at the same address at the date of their entry to the academy).</p>`
    
    case 'named_feeder_school':
      if (!data.includeNamedFeederSchool || !data.namedFeederSchool) return ''
      return `<p>Children attending ${data.namedFeederSchool}.</p>`
    
    case 'distance_from_school':
      if (!data.includeDistanceFromSchool) return ''
      let distanceText = ''
      if (data.distanceSchoolCalculated) {
        distanceText += `<p><strong>How distance is calculated:</strong> ${data.distanceSchoolCalculated}</p>`
      }
      if (data.howIsHomeAddressDetermined) {
        distanceText += `<p><strong>How home address is determined:</strong> ${data.howIsHomeAddressDetermined}</p>`
      }
      return distanceText
    
    case 'catchment_area':
      if (!data.includeCatchmentArea) return ''
      return data.catchmentMapBase64 
        ? `<div class="catchment-map"><img src="${data.catchmentMapBase64}" alt="Catchment Area Map" /></div>`
        : '<p>Catchment area applies (map not provided).</p>'
    
    case 'any_other_children':
      return `<p>Any other children.</p>`
    
    default:
      return ''
  }
}

export function generateHtmlTemplate(data: TemplateData): string {
  const {
    schoolName,
    schoolAddress,
    schoolWebsite,
    schoolType,
    schoolPhase,
    schoolLogoBase64,
    visionStatement,
    diocese,
    admissionsAuthority,
    namedContact,
    localAuthority,
    localAuthorityAddress,
    ageRange,
    numberOnRoll,
    wasOversubscribedLastYear,
    hadFaithBasedCriteriaLastYear,
    faithAdmissionsLastYear,
    appealDays,
    admissionYear,
    pan,
    yearGroups,
    yearOfLastConsultation,
    scheduledReviewMeetingDate,
    consultationDeadline,
    dateIssuedForConsultation,
    dateDeterminedByGovBody,
    dateForwardedToLAandDBE,
    catchmentMapBase64,
    groupOrder,
    supportDocuments,
    contactEmail,
    contactPhone,
    // Conditional fields
    includeSocialAndMedicalNeed,
    includePupilPremium,
    pupilPremiumMaxPercentage,
    pupilPremiumTypes,
    pupilPremiumNurseryName,
    pupilPremiumNurseryTypes,
    includeFaithBased,
    faithBasedOptions,
    faithBasedChurchName,
    faithBasedAttendanceFrequency,
    includeChildrenOfStaff,
    childrenOfStaffCategories,
    childrenOfStaffType,
    includeSiblings,
    siblingsTiming,
    includeNamedFeederSchool,
    namedFeederSchool,
    includeDistanceFromSchool,
    distanceSchoolCalculated,
    howIsHomeAddressDetermined,
    includeCatchmentArea,
    tiebreakerMeasure,
  } = data

  // Build active groups list (same logic as StepFinalising)
  const activeGroups: GroupId[] = ['looked_after']
  if (includeSocialAndMedicalNeed) activeGroups.push('social_medical')
  if (includePupilPremium) activeGroups.push('pupil_premium')
  if (includeFaithBased) activeGroups.push('faith_based')
  if (includeChildrenOfStaff) activeGroups.push('children_of_staff')
  if (includeSiblings) activeGroups.push('siblings')
  if (includeNamedFeederSchool) activeGroups.push('named_feeder_school')
  if (includeDistanceFromSchool) activeGroups.push('distance_from_school')
  if (includeCatchmentArea) activeGroups.push('catchment_area')
  activeGroups.push('any_other_children')

  // Use groupOrder if available, otherwise use activeGroups order
  const orderedGroups = groupOrder && groupOrder.length > 0
    ? groupOrder.filter((id) => activeGroups.includes(id as GroupId)) as GroupId[]
    : activeGroups

  const selectedYearGroups = Object.entries(yearGroups || {})
    .filter(([, selected]) => selected)
    .map(([key]) => {
      const map: Record<string, string> = {
        reception: 'Reception',
        year3: 'Year 3',
        year7: 'Year 7',
        year12: 'Year 12',
      }
      return map[key] || key
    })
    .join(', ')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NSE Admission Arrangements - ${schoolName || 'School'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #000;
      padding: 40px;
      background: #fff;
    }
    
    .header {
      margin-bottom: 30px;
      border-bottom: 2px solid #000;
      padding-bottom: 20px;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .logo-section {
      flex: 0 0 auto;
    }
    
    .logo-section img {
      max-width: 150px;
      max-height: 100px;
      object-fit: contain;
    }
    
    .header-text {
      flex: 1;
      margin-left: 20px;
    }
    
    h1 {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 10px;
      text-align: center;
    }
    
    h2 {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 24px;
      margin-bottom: 12px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4px;
    }
    
    h3 {
      font-size: 12pt;
      font-weight: bold;
      margin-top: 16px;
      margin-bottom: 8px;
    }
    
    .school-info {
      margin-bottom: 20px;
    }
    
    .info-row {
      margin-bottom: 8px;
    }
    
    .info-label {
      font-weight: bold;
      display: inline-block;
      min-width: 200px;
    }
    
    .section {
      margin-bottom: 24px;
      page-break-inside: avoid;
    }
    
    .criteria-list {
      margin-left: 20px;
      margin-top: 12px;
    }
    
    .criterion-item {
      margin-bottom: 12px;
      padding-left: 20px;
      position: relative;
    }
    
    .criterion-number {
      position: absolute;
      left: 0;
      font-weight: bold;
    }
    
    .criterion-text {
      margin-left: 30px;
    }
    
    .catchment-map {
      margin-top: 16px;
      text-align: center;
    }
    
    .catchment-map img {
      max-width: 100%;
      max-height: 400px;
      object-fit: contain;
      border: 1px solid #ccc;
    }
    
    .support-docs {
      margin-top: 12px;
    }
    
    .support-doc-item {
      margin-bottom: 8px;
    }
    
    .contact-info {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #ccc;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    
    table td {
      padding: 8px;
      border: 1px solid #ccc;
    }
    
    table th {
      padding: 8px;
      border: 1px solid #ccc;
      background-color: #f0f0f0;
      font-weight: bold;
      text-align: left;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #000;
      font-size: 9pt;
      text-align: center;
      color: #666;
    }
    
    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-content">
      ${schoolLogoBase64 ? `<div class="logo-section"><img src="${schoolLogoBase64}" alt="School Logo" /></div>` : ''}
      <div class="header-text">
        <h1>Admission Arrangements</h1>
        <div style="text-align: center; font-size: 12pt; margin-top: 8px;">
          ${schoolName || 'School Name'}
        </div>
        <div style="text-align: center; font-size: 10pt; margin-top: 4px;">
          Admission Year: ${admissionYear || 'N/A'}
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>1. School Details</h2>
    <div class="school-info">
      <div class="info-row"><span class="info-label">School Name:</span> ${schoolName || 'N/A'}</div>
      <div class="info-row"><span class="info-label">School Address:</span> ${schoolAddress || 'N/A'}</div>
      ${schoolWebsite ? `<div class="info-row"><span class="info-label">Website:</span> ${schoolWebsite}</div>` : ''}
      <div class="info-row"><span class="info-label">School Type:</span> ${schoolType || 'N/A'}</div>
      <div class="info-row"><span class="info-label">School Phase:</span> ${schoolPhase || 'N/A'}</div>
      <div class="info-row"><span class="info-label">Age Range:</span> ${ageRange || 'N/A'}</div>
      <div class="info-row"><span class="info-label">Number on Roll:</span> ${numberOnRoll || 'N/A'}</div>
      <div class="info-row"><span class="info-label">Diocese:</span> ${diocese || 'N/A'}</div>
      <div class="info-row"><span class="info-label">Admissions Authority:</span> ${admissionsAuthority || 'N/A'}</div>
      <div class="info-row"><span class="info-label">Local Authority:</span> ${localAuthority || 'N/A'}</div>
      <div class="info-row"><span class="info-label">Local Authority Address:</span> ${localAuthorityAddress || 'N/A'}</div>
      <div class="info-row"><span class="info-label">Named Contact:</span> ${namedContact || 'N/A'}</div>
    </div>

    ${visionStatement ? `
    <h3>Vision Statement</h3>
    <div style="margin-top: 8px;">${visionStatement}</div>
    ` : ''}

    <h3>Previous Year Information</h3>
    <div class="school-info">
      <div class="info-row"><span class="info-label">Oversubscribed Last Year:</span> ${wasOversubscribedLastYear === 'yes' ? 'Yes' : 'No'}</div>
      <div class="info-row"><span class="info-label">Had Faith-Based Criteria:</span> ${hadFaithBasedCriteriaLastYear === 'yes' ? 'Yes' : 'No'}</div>
      ${hadFaithBasedCriteriaLastYear === 'yes' ? `<div class="info-row"><span class="info-label">Faith Admissions Last Year:</span> ${faithAdmissionsLastYear || 'N/A'}</div>` : ''}
      <div class="info-row"><span class="info-label">Appeal Days:</span> ${appealDays || 'N/A'} days</div>
    </div>
  </div>

  <div class="section">
    <h2>2. Published Admission Number (PAN)</h2>
    <div class="school-info">
      <div class="info-row"><span class="info-label">PAN:</span> ${pan || 'N/A'}</div>
      <div class="info-row"><span class="info-label">Year Groups:</span> ${selectedYearGroups || 'N/A'}</div>
      <div class="info-row"><span class="info-label">Year of Last Consultation:</span> ${yearOfLastConsultation || 'N/A'}</div>
    </div>

    <h3>Key Dates</h3>
    <table>
      <tr>
        <th>Event</th>
        <th>Date</th>
      </tr>
      <tr>
        <td>Scheduled Review Meeting</td>
        <td>${formatDate(scheduledReviewMeetingDate)}</td>
      </tr>
      <tr>
        <td>Consultation Deadline</td>
        <td>${formatDate(consultationDeadline)}</td>
      </tr>
      <tr>
        <td>Date Issued for Consultation</td>
        <td>${formatDate(dateIssuedForConsultation)}</td>
      </tr>
      <tr>
        <td>Date Determined by Governing Body</td>
        <td>${formatDate(dateDeterminedByGovBody)}</td>
      </tr>
      <tr>
        <td>Date Forwarded to LA and DBE</td>
        <td>${formatDate(dateForwardedToLAandDBE)}</td>
      </tr>
    </table>
  </div>

  <div class="section">
    <h2>3. Oversubscription Criteria</h2>
    <p style="margin-bottom: 16px;">
      All children whose Education, Health and Care Plan (EHCP) names the school must be admitted. 
      This is not an oversubscription criterion, but the children count against the PAN. If the number 
      of applications received is less than the PAN, all applicants will be offered places. If, after 
      the admission of any children with an EHCP naming the school, the number of applications exceeds 
      the number of places remaining available, the school&apos;s oversubscription criteria will be 
      used to determine the allocation of places.
    </p>
    ${orderedGroups && orderedGroups.length > 0 ? `
    <div class="criteria-list">
      ${orderedGroups.map((groupId, index) => {
        const group = GROUP_METADATA[groupId]
        const content = generateGroupContent(groupId, data)
        if (!content) return '' // Skip groups with no content
        return `
        <div class="criterion-item">
          <span class="criterion-number">${index + 1}.</span>
          <div class="criterion-text">
            <strong>${group.title}</strong>
            ${content}
          </div>
        </div>
        `
      }).join('')}
    </div>
    ` : '<p>No criteria specified.</p>'}
  </div>

  ${tiebreakerMeasure ? `
  <div class="section">
    <h2>4. Tiebreaker</h2>
    <h3>Distance from school</h3>
    <p><strong>Measure used:</strong> ${
      tiebreakerMeasure === 'crow_files'
        ? 'We will measure the distance by a straight line. All straight-line distances are calculated electronically using a geographical information system and with the support of the Local Authority where required'
        : 'This will be measured by the shortest walking distance by road or maintained footpath or other public rights of way from the pupil&apos;s home, to the main entrance point of the school using a GIS computerised mapping system'
    }</p>
    <p>If two or more applicants for the final place live the same distance from the school, random allocation will be used as a final tie-breaker, and will be supervised by someone independent of the school.</p>
  </div>
  ` : ''}

  ${supportDocuments && supportDocuments.length > 0 ? `
  <div class="section">
    <h2>${tiebreakerMeasure ? '5' : '4'}. Support Documents</h2>
    <div class="support-docs">
      ${supportDocuments.map((doc) => `
        <div class="support-doc-item">
          <strong>${doc.name}</strong>
          ${doc.url ? `<br /><a href="${doc.url}">${doc.url}</a>` : ''}
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  ${contactEmail || contactPhone ? `
  <div class="section">
    <h2>${tiebreakerMeasure ? (supportDocuments && supportDocuments.length > 0 ? '6' : '5') : (supportDocuments && supportDocuments.length > 0 ? '5' : '4')}. Contact Information</h2>
    <div class="contact-info">
      ${contactEmail ? `<div class="info-row"><span class="info-label">Email:</span> ${contactEmail}</div>` : ''}
      ${contactPhone ? `<div class="info-row"><span class="info-label">Phone:</span> ${contactPhone}</div>` : ''}
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>Generated by NSE Policy Generator</p>
    <p>Document generated on ${formatLongDate()}</p>
  </div>
</body>
</html>`
}

