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
    oversubscriptionCriteria,
    catchmentMapBase64,
    criteriaOrder,
    supportDocuments,
    contactEmail,
    contactPhone,
  } = data

  // Get ordered criteria
  const orderedCriteria = criteriaOrder && criteriaOrder.length > 0
    ? criteriaOrder.map((id) => oversubscriptionCriteria.find((c) => c.id === id)).filter(Boolean)
    : oversubscriptionCriteria

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
    <div style="margin-top: 8px; white-space: pre-wrap;">${visionStatement}</div>
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
    ${orderedCriteria && orderedCriteria.length > 0 ? `
    <div class="criteria-list">
      ${orderedCriteria.map((criterion, index) => `
        <div class="criterion-item">
          <span class="criterion-number">${index + 1}.</span>
          <div class="criterion-text">${criterion?.text || ''}</div>
        </div>
      `).join('')}
    </div>
    ` : '<p>No criteria specified.</p>'}
  </div>

  ${catchmentMapBase64 ? `
  <div class="section">
    <h2>4. Catchment Area Map</h2>
    <div class="catchment-map">
      <img src="${catchmentMapBase64}" alt="Catchment Area Map" />
    </div>
  </div>
  ` : ''}

  ${supportDocuments && supportDocuments.length > 0 ? `
  <div class="section">
    <h2>5. Support Documents</h2>
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
    <h2>6. Contact Information</h2>
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

