# Technology Guide & Questions Breakdown

## Key Technologies Explained

### 1. **React Hook Form** (`react-hook-form`)
**What it does:** Manages form state and validation without re-rendering on every keystroke.

**Key concepts:**
- `useForm()` - Creates form instance with validation rules
- `FormProvider` - Shares form state to child components
- `useFormContext()` - Access form methods in child components
- `register()` - Connects input fields to form state
- `watch()` - Observes field values (reactive)
- `setValue()` - Programmatically set field values
- `useFieldArray()` - Manages dynamic arrays (like criteria list)

**Example:**
```tsx
const { register, watch } = useFormContext()
<input {...register('schoolName')} />  // Connects input to form
const name = watch('schoolName')        // Reactively gets value
```

### 2. **Zod** (`zod`)
**What it does:** TypeScript-first schema validation library.

**Key concepts:**
- Defines the shape and validation rules for your data
- Works with React Hook Form via `@hookform/resolvers`
- Provides TypeScript types automatically

**Example:**
```ts
z.string().min(1, 'Required')           // String, at least 1 char
z.enum(['yes', 'no'])                   // Must be 'yes' or 'no'
z.object({ name: z.string() })          // Object with nested fields
```

### 3. **Playwright**
**What it does:** Browser automation tool - we use it to convert HTML to PDF.

**How it works:**
- Launches headless Chromium browser
- Loads our HTML template
- Renders it as PDF
- Returns PDF bytes

**Why Playwright over pdf-lib?**
- Easier to style with CSS
- Better HTML/CSS support
- More maintainable templates

### 4. **FormData API**
**What it does:** Browser API for sending files + form data together.

**Why we use it:**
- Can't send files via JSON
- Multipart/form-data is required for file uploads
- Server receives both JSON data and files

---

## Questions Breakdown by Step

### Step 1: Disclaimer
**Questions:**
- ✅ `disclaimerAccepted` (checkbox) - Must be checked to proceed

**PDF Conditional Logic Needed:**
- None (this is just a gate to proceed)

---

### Step 2: School Details
**Questions:**

**Basic Info:**
- `schoolName` (text) - Required
- `schoolAddress` (text) - Required
- `schoolWebsite` (text) - Optional URL
- `schoolType` (text) - Required
- `schoolPhase` (text) - Required
- `schoolLogo` (file upload) - Optional image

**Vision & Organization:**
- `visionStatement` (textarea) - Required
- `diocese` (text) - Required
- `admissionsAuthority` (text) - Required
- `namedContact` (text) - Required

**Local Authority:**
- `localAuthority` (text) - Required
- `localAuthorityAddress` (text) - Required
- `ageRange` (text) - Required
- `numberOnRoll` (text) - Required

**Previous Year Info:**
- `wasOversubscribedLastYear` (radio: yes/no) - Required
- `hadFaithBasedCriteriaLastYear` (radio: yes/no) - Required
- `faithAdmissionsLastYear` (number) - Optional (only shown if hadFaithBasedCriteriaLastYear = 'yes')
- `appealDays` (number) - Required, min 20
- `admissionYear` (select: 2025/2026, 2026/2027, 2027/2028) - Required

**PDF Conditional Logic Needed:**
- Show/hide `faithAdmissionsLastYear` section based on `hadFaithBasedCriteriaLastYear`
- Show/hide school logo if uploaded
- Show/hide website if provided

---

### Step 3: Published Admission Number (PAN)
**Questions:**

**PAN Info:**
- `pan` (text) - Required
- `yearGroups` (checkboxes) - At least one required:
  - `reception` (boolean)
  - `year3` (boolean)
  - `year7` (boolean)
  - `year12` (boolean)

**Dates:**
- `yearOfLastConsultation` (text, 4-digit year) - Required
- `scheduledReviewMeetingDate` (date) - Required
- `consultationDeadline` (date) - Required
- `dateIssuedForConsultation` (date) - Required
- `dateDeterminedByGovBody` (date) - Required
- `dateForwardedToLAandDBE` (date) - Required

**PDF Conditional Logic Needed:**
- Show only selected year groups (not all checkboxes)
- Format dates consistently

---

### Step 4: Admission Arrangements
**Questions:**

**Oversubscription Criteria:**
- `oversubscriptionCriteria` (array of objects) - At least one required:
  - Each has: `id`, `text`, `priority`
  - User can add/remove dynamically

**Catchment Map:**
- `catchmentMap` (file upload) - Optional image

**PDF Conditional Logic Needed:**
- Show criteria in order (using `criteriaOrder` from next step)
- Show/hide catchment map section if uploaded
- Handle empty criteria list gracefully

---

### Step 5: Finalising the Text
**Questions:**

**Criteria Reordering:**
- `criteriaOrder` (array of IDs) - Optional, used to reorder criteria

**Support Documents:**
- `supportDocuments` (array of objects) - Optional:
  - Each has: `name`, `url`

**Contact Info:**
- `contactEmail` (email) - Optional
- `contactPhone` (text) - Optional

**PDF Conditional Logic Needed:**
- Use `criteriaOrder` if provided, otherwise use original order
- Show/hide support documents section if any exist
- Show/hide contact info section if provided

---

## Next Steps: Adding PDF Conditionals

We need to update `lib/pdf/template.ts` to:
1. Show/hide sections based on user selections
2. Use conditional text based on yes/no answers
3. Format data appropriately
4. Handle optional fields gracefully

Let's work through this step by step!

