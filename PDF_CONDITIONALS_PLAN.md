# PDF Template Conditionals Plan

## Current Conditionals (Already Implemented ✅)

1. **School Logo** - Shows only if uploaded
2. **Website** - Shows only if provided
3. **Vision Statement** - Shows only if provided
4. **Faith Admissions** - Shows only if `hadFaithBasedCriteriaLastYear === 'yes'`
5. **Catchment Map** - Shows only if uploaded
6. **Support Documents** - Shows only if any exist
7. **Contact Info** - Shows only if email or phone provided

## Conditionals to Add/Improve

### 1. **Previous Year Information Section**
**Current:** Always shows "Oversubscribed Last Year: Yes/No"

**Improvement:** 
- If `wasOversubscribedLastYear === 'no'`, we could add conditional text like:
  - "The school was not oversubscribed in the previous admissions year."
- If `hadFaithBasedCriteriaLastYear === 'no'`, we could add:
  - "The school did not use faith-based oversubscription criteria in the previous admissions year."

**Location:** Line ~300-306

---

### 2. **Year Groups Display**
**Current:** Shows comma-separated list like "Reception, Year 3"

**Improvement:**
- If only one selected: "Reception"
- If multiple: "Reception, Year 3, Year 7"
- If none (shouldn't happen due to validation): "None specified"

**Location:** Line ~313

---

### 3. **Oversubscription Criteria**
**Current:** Shows "No criteria specified" if empty

**Improvement:**
- Could add a note: "The school has not specified oversubscription criteria."
- Or hide the entire section if empty (but validation requires at least one)

**Location:** Line ~347-357

---

### 4. **Section Numbering**
**Current:** Sections are numbered 1, 2, 3, 4, 5, 6

**Issue:** If catchment map or support docs are missing, numbering jumps (e.g., 1, 2, 3, 5, 6)

**Improvement:** 
- Use dynamic numbering based on what sections actually appear
- Or use descriptive headings without numbers

**Location:** Throughout template

---

### 5. **Canned Responses Based on Selections**

We could add conditional text blocks based on user selections:

**Example:**
- If `schoolType` contains "Academy" → Add note about academy trust
- If `schoolPhase` is "Primary" → Adjust language for primary context
- If `wasOversubscribedLastYear === 'yes'` → Add context about oversubscription

---

## Recommended Changes

### Priority 1: Fix Section Numbering
Make section numbers dynamic based on visible sections.

### Priority 2: Add Conditional Text for Yes/No Questions
Instead of just "Yes/No", add contextual sentences.

### Priority 3: Add School Type/Phase Specific Text
Customize language based on school characteristics.

---

## Implementation Approach

We'll update `lib/pdf/template.ts` to:
1. Build an array of sections that will be shown
2. Number sections dynamically
3. Add helper functions for conditional text generation
4. Add conditional text blocks where appropriate

Would you like me to implement these improvements?

