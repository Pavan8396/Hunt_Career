# **Definitive QA Test Plan: Hunt Career Frontend**
## **Version 3.0 (Exhaustive & Combinatorial)**

---

## **1. Test Strategy & Scope**

### **1.1. Objective**
To achieve maximum test coverage by employing a combinatorial, data-driven, and risk-based testing methodology. This plan aims to generate 1000+ test permutations by combining functional test cases with extensive data sets, environmental matrices, and state-based checks.

### **1.2. Scope**
- **In Scope:** All frontend pages, components, user flows, UI/UX, accessibility, and security checks for the Job Seeker and Employer modules.
- **Out of Scope:** Backend performance/load testing, database integrity testing (covered by backend tests).

---

## **2. Test Environment Matrix**

Each functional test case (`TC-FUNC-XXX`) must be executed against the following environments. This matrix alone multiplies the test load by **12**.

| Browser | Desktop (1920x1080) | Tablet (768x1024) | Mobile (375x812) |
| :--- | :---: | :---: | :---: |
| **Chrome (Latest)** | ✅ | ✅ | ✅ |
| **Firefox (Latest)** | ✅ | ✅ | ✅ |
| **Safari (Latest)** | ✅ | ✅ | ✅ |
| **Edge (Latest)** | ✅ | ✅ | ✅ |

---

## **3. Test Data Sets (Data-Driven Testing)**

### **3.1. `DS-EMAIL` - Email Address Data**
- **Valid (Subset):** `test@example.com`, `test.name@example.co.uk`, `test-name@example.info`
- **Invalid (Full Set):** `plainaddress`, `@domain.com`, `test@`, `test@domain@com`, `test@.com`, `test@domain,com`, `test space@domain.com`, `test@domain space.com`, `.test@domain.com`, `test.@domain.com`, `test..test@domain.com`, `"test"@domain.com`, `usér@domain.com`, `test@domain.c`, `test@-domain.com`, `test@domain-.com`, `a_very_long_local_part_that_is_over_64_characters_long_for_sure@domain.com`, `test@[127.0.0.1]`, `test@domain..com`, `(comment)test@domain.com`

### **3.2. `DS-PASSWORD` - Password Data**
- **Valid:** `password123`, `P@ssw0rd!`, `a-b_c=d`
- **Invalid:** `short`, `longpasswordthatiswayoverthecharacterlimitdefinedbythesystem`, ` ` (empty), ` leading-space`, `trailing-space `

### **3.3. `DS-SEARCH` - Search String Data**
- **Standard:** `Developer`, `engineer`, `QA`
- **Case-Insensitive:** `dEvElOpEr`
- **Multi-word:** `Senior Software Engineer`
- **With Numbers:** `Developer level 2`
- **Special Chars:** `!@#$%^&*()`
- **Long String:** A 200-character string.
- **Empty:** ` `
- **Basic XSS Probes:** `<script>alert('xss')</script>`, `"><img src=x onerror=alert(1)>`
- **Basic SQLi Probes:** `test' OR 1=1; --`

### **3.4. `DS-JOB-FORM` - Job Posting Form Data**
- **Valid:** Complete and valid data for all fields.
- **Invalid (Permutations):**
    - Empty Title, Valid Everything Else
    - Empty Location, Valid Everything Else
    - Empty Salary, Valid Everything Else
    - Invalid Salary (e.g., "abc", "-100")
    - Empty Description
    - Long strings in all text fields
    - XSS/SQLi probes in all text fields

---

## **4. Granular Functional Test Cases**

### **4.1. Authentication (`Signup.jsx`, `Login.jsx`, etc.)**
| ID | Test Case | Data Source(s) | Priority |
| :--- | :--- | :--- | :--- |
| **TC-FUNC-AUTH-001** | Attempt user registration with each entry in the email dataset. | `DS-EMAIL` | High |
| **TC-FUNC-AUTH-002** | Attempt user registration with each entry in the password dataset. | `DS-PASSWORD` | High |
| **TC-FUNC-AUTH-003** | Attempt user login with each entry in the email and password datasets. | `DS-EMAIL`, `DS-PASSWORD` | High |
| **TC-FUNC-AUTH-004** | **[State]** Verify the 'Submit' button is disabled until all required fields are valid. | All auth forms | High |
| **TC-FUNC-AUTH-005** | **[API Failure]** Simulate a `500 Internal Server Error` on signup/login submission. | A user-friendly error message "Something went wrong, please try again" is shown. | High |
| **TC-FUNC-AUTH-006** | **[API Failure]** Simulate a network timeout on signup/login submission. | A loading indicator persists, then shows a "Network error" message. | Medium |

### **4.2. Job Search & Viewing (`Home.jsx`, `JobDetails.jsx`)**
| ID | Test Case | Data Source(s) | Priority |
| :--- | :--- | :--- | :--- |
| **TC-FUNC-SEEK-001** | Execute a search for each string in the search dataset. | `DS-SEARCH` | High |
| **TC-FUNC-SEEK-002** | **[State]** Verify skeleton loading cards are displayed while the job list API call is pending. | - | Medium |
| **TC-FUNC-SEEK-003** | **[State]** On the Job Details page, verify the 'Save' button state changes on hover, focus, and after being clicked. | - | Medium |
| **TC-FUNC-SEEK-004** | **[State]** Verify the 'Apply' button state changes on hover, focus, and after being clicked (becomes disabled). | - | High |
| **TC-FUNC-SEEK-005** | **[API Failure]** Simulate the job list API returning a `500` error. | A "Could not load jobs" error message is shown instead of the list. | High |
| **TC-FUNC-SEEK-006** | **[API Failure]** Simulate the job list API returning an empty array `[]`. | A "No jobs found" message is shown. | High |
| **TC-FUNC-SEEK-007** | **[API Failure]** Simulate the job details API returning a `404 Not Found`. | A "Job not found" error page is shown. | Medium |

### **4.3. Employer Job Management (`EmployerDashboard.jsx`, `PostJobPage.jsx`)**
| ID | Test Case | Data Source(s) | Priority |
| :--- | :--- | :--- | :--- |
| **TC-FUNC-EMP-001** | Attempt to create a new job using each permutation from the job form dataset. | `DS-JOB-FORM` | High |
| **TC-FUNC-EMP-002** | **[State]** Verify dashboard widgets show a loading state before data is available. | - | Medium |
| **TC-FUNC-EMP-003** | **[API Failure]** Simulate the dashboard data API returning a `500` error. | Widgets display "N/A" or an error icon. | High |

---

## **5. UI/UX & Accessibility (WCAG) Checklist**
This checklist must be applied to **every page and interactive component** in the application.

### **5.1. UI & Responsiveness**
- [ ] No horizontal scrolling on any device in the environment matrix.
- [ ] Font sizes are readable on all devices.
- [ ] Click/tap targets are adequately sized for mobile (min 44x44px).
- [ ] All interactive elements have clear `hover` and `focus` states.
- [ ] Spacing and alignment are consistent across all pages.
- [ ] Dark mode theme is applied correctly to all elements, with no unstyled components.

### **5.2. Accessibility (A11y)**
- [ ] All images have descriptive `alt` text.
- [ ] All form inputs are linked to a `<label>` tag.
- [ ] Color contrast for all text and UI elements meets WCAG AA standards.
- [ ] The application is fully navigable and operable using only a keyboard.
- [ ] The focus order when tabbing is logical and follows the visual layout.
- [ ] Focus is clearly visible and not obscured.
- [ ] Modal dialogs (like Chatbox) trap focus correctly.
- [ ] ARIA roles and attributes are used correctly where needed (e.g., `role="alert"` for toasts).

---

## **6. Full End-to-End Scenarios (Expanded)**

### **E2E-QA-001: Seeker - The "Changed My Mind" Flow**
1. Log in as a Job Seeker.
2. Search for "Analyst".
3. Save the first job.
4. Save the second job.
5. Go to the "Saved Jobs" page.
6. Verify both jobs are present.
7. Unsave the first job.
8. Verify it is removed from the list.
9. Go back to the search results.
10. Apply for the second job.
11. Go to the "Applied Jobs" page and verify it's there.
12. Attempt to apply for the second job again from the details page.
13. Verify the button is disabled or an error is shown.
14. Log out.

### **E2E-QA-002: Employer - The "Correction" Flow**
1. Log in as an Employer.
2. Post a new job with a typo in the title (e.g., "Sfotware Engineer").
3. Go to "Posted Jobs" and verify the job with the typo is there.
4. **[Future Feature]** Click "Edit" on the job.
5. Correct the title to "Software Engineer".
6. Save the changes.
7. Verify the title is updated in the "Posted Jobs" list.
8. Log out.

### **E2E-QA-003: The "API Goes Down" Flow**
1. Start navigating the site as a Job Seeker.
2. Use a browser extension or proxy to simulate the backend API going offline (returning `500` errors for all calls).
3. Attempt to perform key actions: login, search, view details, save a job.
4. Verify that each action fails gracefully with a user-friendly error message, and the application UI does not crash.