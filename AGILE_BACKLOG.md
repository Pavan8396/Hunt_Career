# Hunt-Career: Agile Backlog

**Document Version:** 1.0  
**Date:** February 27, 2026  
**Status:** Ready for Sprint Planning  

---

## 📊 Backlog Summary

| Epic ID | Epic Name | Total Story Points | Priority |
|---------|-----------|-------------------|----------|
| EPIC-001 | Authentication & Security | 40 | P0 |
| EPIC-002 | Job Discovery & Search | 35 | P0 |
| EPIC-003 | Application Management | 30 | P0 |
| EPIC-004 | Saved Jobs Functionality | 20 | P0 |
| EPIC-005 | Real-time Communication | 35 | P1 |
| EPIC-006 | Employer Tools | 45 | P0 |
| EPIC-007 | Employer Analytics Dashboard | 25 | P1 |
| EPIC-008 | Company Reviews System | 20 | P1 |
| EPIC-009 | Administration & Moderation | 30 | P1 |
| EPIC-010 | User Profile Management | 25 | P1 |
| EPIC-011 | Theme & Accessibility | 20 | P2 |
| EPIC-012 | Notifications & Feedback | 20 | P1 |

**Total Story Points:** 345

---

## 🎯 EPIC 1: Authentication & Security

**Description:**  
Provides secure user and employer registration, authentication, and session management capabilities to ensure platform access control and data security.

**Business Goal:**  
Enable secure access to the platform for all user types while protecting sensitive data and maintaining user trust through robust security measures.

**Associated PRD Features:** AUTH-001, AUTH-002, AUTH-003, AUTH-004, AUTH-005

---

### User Story 1.1: Job Seeker Registration

**Story:**  
As a Job Seeker (Sarah Chen)  
I want to create an account with my personal details  
So that I can access job search and application features

**Acceptance Criteria:**

**Happy Path:**
- **Given** a new job seeker visits the registration page
- **When** they provide valid first name, last name, email, password (8+ chars), and 10-digit phone number
- **Then** a new user account is created successfully
- **And** they receive a success confirmation message
- **And** they are redirected to the login page

**Edge Cases & Validation:**
- **Given** a user tries to register with an existing email
- **When** they submit the form
- **Then** they see an error: "User already exists"
- **And** the form retains other valid fields

- **Given** a user enters a password with fewer than 8 characters
- **When** they submit the form
- **Then** they see a validation error: "Password must be at least 8 characters"

- **Given** a user enters an invalid email format
- **When** they submit the form
- **Then** they see a validation error: "Please enter a valid email address"

- **Given** a user enters a non-10-digit phone number
- **When** they submit the form
- **Then** they see a validation error: "Phone number must be 10 digits"

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** None (Foundation)  
**Traceability:** AUTH-001

---

### User Story 1.2: Employer Registration

**Story:**  
As an Employer (Michael Rodriguez)  
I want to register my company with company details  
So that I can post job listings and manage applicants

**Acceptance Criteria:**

**Happy Path:**
- **Given** a new employer visits the employer registration page
- **When** they provide valid company name, email, and password (8+ chars)
- **Then** a new employer account is created successfully
- **And** they receive a success confirmation
- **And** they are redirected to the employer login page

**Edge Cases & Validation:**
- **Given** an employer tries to register with an existing company email
- **When** they submit the form
- **Then** they see an error: "Company already registered with this email"

- **Given** an employer enters a company name with fewer than 2 characters
- **When** they submit the form
- **Then** they see a validation error: "Company name is required"

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** None (Foundation)  
**Traceability:** AUTH-002

---

### User Story 1.3: User Login & Logout

**Story:**  
As a registered User (Job Seeker or Employer)  
I want to log in and out of the platform securely  
So that I can access my personalized features and protect my account

**Acceptance Criteria:**

**Happy Path - Login:**
- **Given** a registered user is on the login page
- **When** they enter valid email and password credentials
- **Then** they are authenticated successfully
- **And** they receive a JWT token with 1-hour expiration
- **And** they are redirected to their role-specific dashboard

**Happy Path - Logout:**
- **Given** an authenticated user clicks the logout button
- **When** they confirm logout
- **Then** their session token is invalidated
- **And** they are redirected to the home page
- **And** any stored authentication data is cleared

**Edge Cases:**
- **Given** a user enters incorrect credentials
- **When** they submit the login form
- **Then** they see an error: "Invalid email or password"
- **And** the password field is cleared

- **Given** a suspended user attempts to login
- **When** they submit valid credentials
- **Then** they see an error: "Account suspended. Contact support."

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** US 1.1, US 1.2  
**Traceability:** AUTH-003

---

### User Story 1.4: Session Management

**Story:**  
As a registered User  
I want my session to expire automatically after a period of time  
So that my account remains secure if I forget to logout

**Acceptance Criteria:**

**Happy Path:**
- **Given** a user is authenticated with an active session
- **When** 1 hour passes without activity
- **Then** the JWT token expires automatically
- **And** the user is redirected to the login page with a message: "Session expired. Please login again."

**Token Refresh:**
- **Given** a user has an active session
- **When** they perform actions within the session duration
- **Then** their session remains active

**Edge Cases:**
- **Given** a user tries to access a protected route with an expired token
- **When** the request is made
- **Then** they receive a 401 Unauthorized response
- **And** they are redirected to login

**Priority:** P1  
**Story Points:** 3  
**Dependencies:** US 1.3  
**Traceability:** AUTH-004

---

### User Story 1.5: Password Security

**Story:**  
As a Platform Administrator  
I want passwords to be securely hashed  
So that user credentials are protected even if the database is compromised

**Acceptance Criteria:**

**Security Implementation:**
- **Given** a user registers with a password
- **When** the account is created
- **Then** the password is hashed using bcrypt with salt rounds 10
- **And** the plain text password is never stored

**Login Verification:**
- **Given** a user attempts to login
- **When** they submit their password
- **Then** the system compares the bcrypt hash of the input with the stored hash
- **And** authentication succeeds only if hashes match

**Priority:** P0  
**Story Points:** 3  
**Dependencies:** US 1.1, US 1.2  
**Traceability:** AUTH-001, AUTH-002

---

### User Story 1.6: Account Suspension (Admin)

**Story:**  
As an Administrator  
I want to suspend or activate user and employer accounts  
So that I can manage platform security and enforce policies

**Acceptance Criteria:**

**Happy Path - Suspend:**
- **Given** an admin is viewing the user/employer management page
- **When** they click "Suspend" on an active account
- **Then** the account status changes to "suspended"
- **And** the user/employer can no longer login
- **And** any active sessions are invalidated

**Happy Path - Activate:**
- **Given** an admin is viewing a suspended account
- **When** they click "Activate" on the suspended account
- **Then** the account status changes to "active"
- **And** the user/employer can login again

**Edge Cases:**
- **Given** a suspended user attempts to perform actions via API
- **When** any authenticated request is made
- **Then** they receive a 403 Forbidden response with message: "Account suspended"

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** US 1.3, EPIC-009  
**Traceability:** AUTH-005

---

### User Story 1.7: CORS & Security Headers

**Story:**  
As a Developer  
I want to implement CORS policies and security headers  
So that the API is protected from cross-origin attacks and common vulnerabilities

**Acceptance Criteria:**

**CORS Configuration:**
- **Given** a request originates from an allowed origin (localhost:3000 for dev)
- **When** the request reaches the API
- **Then** the request is processed successfully

- **Given** a request originates from a non-whitelisted origin
- **When** the request reaches the API
- **Then** it is rejected with a CORS error

**Security Headers:**
- **Given** any API response
- **When** the response is returned
- **Then** it includes appropriate security headers (X-Content-Type-Options, X-Frame-Options, Content-Security-Policy)

**Priority:** P1  
**Story Points:** 3  
**Dependencies:** None  
**Traceability:** NFR - Security

---

### User Story 1.8: Protected Route Guard

**Story:**  
As a Job Seeker  
I want to be redirected to login when trying to access protected features  
So that I understand authentication is required

**Acceptance Criteria:**

**Happy Path:**
- **Given** an unauthenticated guest tries to access /saved-jobs or /applied-jobs
- **When** they navigate to the protected route
- **Then** they are redirected to the login page
- **And** after successful login, they are redirected back to the intended page

**Role-Based Access:**
- **Given** a job seeker tries to access employer-only routes
- **When** they navigate to the route
- **Then** they receive a 403 Forbidden response or are redirected to their dashboard

- **Given** an employer tries to access job seeker-only features
- **When** they navigate to the route
- **Then** they are redirected to their employer dashboard

**Priority:** P0  
**Story Points:** 3  
**Dependencies:** US 1.3  
**Traceability:** AUTH-003

---

## 🔍 EPIC 2: Job Discovery & Search

**Description:**  
Enables job seekers to discover, search, and filter job opportunities through an intuitive interface with advanced filtering and sorting capabilities.

**Business Goal:**  
Help job seekers efficiently find relevant job opportunities, increasing platform engagement and application rates.

**Associated PRD Features:** SRCH-001, SRCH-002, SRCH-003, SRCH-004, SRCH-005, SRCH-006, SRCH-007

---

### User Story 2.1: Full-Text Job Search

**Story:**  
As a Job Seeker (Sarah Chen)  
I want to search for jobs using keywords  
So that I can quickly find relevant positions matching my skills and interests

**Acceptance Criteria:**

**Happy Path:**
- **Given** a user is on the home page
- **When** they enter "React Developer" in the search box and submit
- **Then** they see jobs matching the search term in title, company name, or description
- **And** results display within 500ms
- **And** matching keywords are highlighted in results

**Search Variations:**
- **Given** a user searches for partial terms
- **When** they enter "React" 
- **Then** results include jobs with "React", "React.js", "ReactJS", "React Native"

**Case Insensitivity:**
- **Given** a user searches with different casing
- **When** they enter "REACT DEVELOPER" or "react developer"
- **Then** the search returns the same results (case-insensitive)

**Empty Results:**
- **Given** a user searches for a term with no matches
- **When** results are returned
- **Then** they see a message: "No jobs found matching your search. Try different keywords."

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** EPIC-006 (Job posting must exist)  
**Traceability:** SRCH-001

---

### User Story 2.2: Location Filtering

**Story:**  
As a Job Seeker  
I want to filter jobs by location  
So that I can find opportunities in my preferred geographic area

**Acceptance Criteria:**

**Happy Path:**
- **Given** a user is viewing job listings
- **When** they open the location filter dropdown
- **Then** they see a list of available locations with checkboxes
- **And** they can select multiple locations
- **And** the job list updates to show only selected locations

**Dropdown Search:**
- **Given** a location filter dropdown is open
- **When** they type in the search input within the dropdown
- **Then** the location list filters dynamically based on input

**Filter Badges:**
- **Given** a user has selected location filters
- **When** filters are applied
- **Then** visual filter badges appear above the job list showing active filters
- **And** each badge has a clear (X) button to remove individual filters

**Clear All:**
- **Given** a user has multiple location filters active
- **When** they click "Clear All"
- **Then** all location filters are removed
- **And** the job list shows all locations again

**Priority:** P0  
**Story Points:** 3  
**Dependencies:** US 2.1  
**Traceability:** SRCH-002

---

### User Story 2.3: Job Type Filtering

**Story:**  
As a Job Seeker  
I want to filter jobs by employment type  
So that I can find positions matching my availability preferences

**Acceptance Criteria:**

**Happy Path:**
- **Given** a user is viewing job listings
- **When** they open the job type filter dropdown
- **Then** they see options: Full-Time, Part-Time, Contract, Internship, Freelance
- **And** they can select multiple job types
- **And** the job list updates to show only selected job types

**Combined Filtering:**
- **Given** a user has applied both location and job type filters
- **When** they add or remove filters
- **Then** the results show jobs matching ALL selected criteria (AND logic)

**Priority:** P0  
**Story Points:** 3  
**Dependencies:** US 2.1  
**Traceability:** SRCH-003

---

### User Story 2.4: Job Sorting Options

**Story:**  
As a Job Seeker  
I want to sort job results by different criteria  
So that I can organize listings according to my preferences

**Acceptance Criteria:**

**Happy Path:**
- **Given** a user is viewing job listings
- **When** they select a sort option from the dropdown
- **Then** jobs are reordered according to the selected criteria

**Available Sort Options:**
- **Given** the sort dropdown is open
- **When** they view options
- **Then** they see: Title (A-Z), Title (Z-A), Company Name (A-Z), Company Name (Z-A), Newest First, Oldest First

**Sort Persistence:**
- **Given** a user has selected a sort option
- **When** they apply additional filters or search
- **Then** the selected sort order is maintained

**Priority:** P1  
**Story Points:** 3  
**Dependencies:** US 2.1  
**Traceability:** SRCH-004

---

### User Story 2.5: Job List Pagination

**Story:**  
As a Job Seeker  
I want to view jobs in paginated results  
So that the page loads quickly and I can navigate through many listings

**Acceptance Criteria:**

**Happy Path:**
- **Given** there are more than 6 jobs matching the criteria
- **When** the job list loads
- **Then** only 6 jobs are displayed per page
- **And** numbered pagination controls appear at the bottom

**Navigation:**
- **Given** a user is on page 1 of results
- **When** they click on page number 2
- **Then** the next 6 jobs are displayed
- **And** the page scrolls to the top of the job list

**Edge Cases:**
- **Given** there are fewer than 6 jobs
- **When** the list loads
- **Then** all jobs are displayed without pagination controls

**Priority:** P1  
**Story Points:** 3  
**Dependencies:** US 2.1  
**Traceability:** SRCH-005

---

### User Story 2.6: Job Details View

**Story:**  
As a Job Seeker  
I want to view detailed information about a job  
So that I can evaluate if the position matches my qualifications and interests

**Acceptance Criteria:**

**Happy Path:**
- **Given** a user clicks on a job card
- **When** the job details page loads
- **Then** they see comprehensive job information:
  - Job title
  - Company name and logo (if available)
  - Full job description
  - Required location
  - Job type badge
  - Posting date
  - Company information section
  - Company reviews summary

**Company Information:**
- **Given** a user is viewing job details
- **When** they scroll to the company section
- **Then** they see company description, website link, and average rating
- **And** they can click to view all company reviews

**Apply/Save Actions:**
- **Given** an authenticated job seeker views job details
- **When** they click "Apply Now"
- **Then** the one-click application process begins

- **Given** an authenticated job seeker views job details
- **When** they click the save/bookmark icon
- **Then** the job is added to their saved jobs list

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** US 2.1, EPIC-004  
**Traceability:** SRCH-006

---

### User Story 2.7: Active Filter Badges

**Story:**  
As a Job Seeker  
I want to see visual indicators of my active filters  
So that I can easily understand what criteria are applied and remove them if needed

**Acceptance Criteria:**

**Happy Path:**
- **Given** a user has applied search and filter criteria
- **When** filters are active
- **Then** filter badges appear above the job list showing:
  - Search term: "React Developer"
  - Location: "Remote, New York"
  - Job Type: "Full-Time"

**Badge Interactions:**
- **Given** filter badges are displayed
- **When** a user clicks the X on a badge
- **Then** that specific filter is removed
- **And** the job list updates accordingly

**Clear All Option:**
- **Given** multiple filters are active
- **When** a user clicks "Clear All Filters"
- **Then** all filters and search terms are removed
- **And** the job list shows all available jobs

**Priority:** P1  
**Story Points:** 2  
**Dependencies:** US 2.2, US 2.3  
**Traceability:** SRCH-007

---

### User Story 2.8: Empty State & No Results

**Story:**  
As a Job Seeker  
I want to see helpful messages when no jobs match my criteria  
So that I understand why and know what to do next

**Acceptance Criteria:**

**No Search Results:**
- **Given** a search returns no results
- **When** the results page loads
- **Then** they see a friendly illustration/message
- **And** suggestions for alternative search terms
- **And** a "Clear Filters" button

**No Jobs Available:**
- **Given** the platform has no job listings
- **When** a user visits the home page
- **Then** they see a message: "No jobs available yet. Check back soon!"
- **And** a call-to-action to create a job alert (future feature)

**Priority:** P1  
**Story Points:** 2  
**Dependencies:** US 2.1  
**Traceability:** SRCH-001

---

## 📋 EPIC 3: Application Management

**Description:**  
Manages the end-to-end job application process including one-click apply, status tracking, and application history for job seekers.

**Business Goal:**  
Streamline the application process to increase application completion rates and provide transparency through status tracking.

**Associated PRD Features:** APPL-001, APPL-002, APPL-003, APPL-004, APPL-005, APPL-006

---

### User Story 3.1: One-Click Job Application

**Story:**  
As a Job Seeker (Sarah Chen)  
I want to apply to jobs with a single click  
So that I can quickly submit applications without repetitive form filling

**Acceptance Criteria:**

**Happy Path:**
- **Given** an authenticated job seeker is viewing a job details page
- **When** they click the "Apply Now" button
- **Then** an application is created immediately
- **And** the status is set to "Submitted"
- **And** they see a success toast notification: "Application submitted successfully!"
- **And** the button changes to "Applied" (disabled state)

**Duplicate Prevention:**
- **Given** a user has already applied to a job
- **When** they view that job again
- **Then** the "Apply" button shows "Applied" and is disabled
- **And** clicking it shows a message: "You have already applied to this job"

**Unauthenticated User:**
- **Given** a guest (unauthenticated) user tries to apply
- **When** they click "Apply Now"
- **Then** they are redirected to the login page
- **And** after login, they are returned to the job details page

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** EPIC-001, US 2.6  
**Traceability:** APPL-001, APPL-003

---

### User Story 3.2: Application Status Tracking

**Story:**  
As a Job Seeker  
I want to track the status of my job applications  
So that I know where I stand in the hiring process

**Acceptance Criteria:**

**Happy Path:**
- **Given** a job seeker navigates to "My Applications"
- **When** the page loads
- **Then** they see a list of all their applications with:
  - Job title and company name
  - Current status badge (Submitted, In Review, Interviewing, Offered, Rejected)
  - Application date
  - Last updated timestamp

**Status Workflow Display:**
- **Given** applications are listed
- **When** they view the status column
- **Then** they see color-coded badges:
  - Submitted: Blue
  - In Review: Yellow
  - Interviewing: Purple
  - Offered: Green
  - Rejected: Red

**Status History:**
- **Given** a user clicks on an application
- **When** the details view opens
- **Then** they see the complete status change history with timestamps

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** US 3.1  
**Traceability:** APPL-002, APPL-004

---

### User Story 3.3: Applied Jobs List Page

**Story:**  
As a Job Seeker  
I want a dedicated page showing all jobs I've applied to  
So that I can easily review my application history

**Acceptance Criteria:**

**Happy Path:**
- **Given** an authenticated job seeker clicks "Applied Jobs" in navigation
- **When** the page loads
- **Then** they see a list of all jobs they have applied to
- **And** each entry shows job title, company, location, and application status

**Sorting & Filtering:**
- **Given** a user is viewing applied jobs
- **When** they use the sort dropdown
- **Then** they can sort by: Application Date (newest/oldest), Status, Company Name

**Empty State:**
- **Given** a user has not applied to any jobs
- **When** they visit the Applied Jobs page
- **Then** they see a message: "You haven't applied to any jobs yet. Start searching!"
- **And** a CTA button to browse jobs

**Priority:** P1  
**Story Points:** 3  
**Dependencies:** US 3.2  
**Traceability:** APPL-005

---

### User Story 3.4: Employer Application Review

**Story:**  
As an Employer (Michael Rodriguez)  
I want to view all applicants for my job postings  
So that I can review candidates and manage the hiring process

**Acceptance Criteria:**

**Happy Path:**
- **Given** an employer is logged in
- **When** they navigate to their job listings and select a job
- **Then** they see a list of all applicants with:
  - Applicant name
  - Application date
  - Current status
  - Quick action buttons

**Applicant Details:**
- **Given** an employer is viewing applicants
- **When** they click on an applicant's name
- **Then** they see the applicant's profile including:
  - Contact information
  - Work experience
  - Education
  - Skills

**Filtering Applicants:**
- **Given** an employer is viewing applicants for a job
- **When** they use filter options
- **Then** they can filter by: Status, Application Date Range

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** US 3.1, EPIC-001  
**Traceability:** APPL-002, EMP-005

---

### User Story 3.5: Application Status Updates (Employer)

**Story:**  
As an Employer  
I want to update the status of job applications  
So that applicants know their progress in the hiring process

**Acceptance Criteria:**

**Happy Path:**
- **Given** an employer is viewing applicants for their job
- **When** they select a new status from the dropdown for an applicant
- **Then** the application status is updated
- **And** the applicant can see the new status immediately
- **And** a success toast is shown: "Status updated successfully"

**Status Workflow:**
- **Given** an employer updates a status
- **When** they select from available statuses
- **Then** they can choose from: Submitted → In Review → Interviewing → Offered or Rejected

**Bulk Status Update:**
- **Given** an employer selects multiple applicants
- **When** they choose a bulk action and apply
- **Then** all selected applicants' statuses are updated

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** US 3.4  
**Traceability:** APPL-004, EMP-006

---

### User Story 3.6: Application Status Notifications

**Story:**  
As a Job Seeker  
I want to be notified when my application status changes  
So that I stay informed about my job applications without constantly checking

**Acceptance Criteria:**

**Status Change Notification:**
- **Given** an employer updates an application status
- **When** the status change is saved
- **Then** the applicant receives a notification (toast on next page load / future: email)
- **And** the notification includes the job title and new status

**Notification Content:**
- **Given** a status changes to "Interviewing"
- **When** the notification is displayed
- **Then** it shows: "Your application for 'Senior Developer at TechCorp' has been updated to: Interviewing"

**Notification Dismissal:**
- **Given** a notification is displayed
- **When** a user clicks the X or it auto-dismisses
- **Then** the notification is marked as read

**Priority:** P2  
**Story Points:** 3  
**Dependencies:** US 3.5  
**Traceability:** APPL-006

---

## 🔖 EPIC 4: Saved Jobs Functionality

**Description:**  
Allows job seekers to bookmark jobs for later review and manage their saved job shortlist.

**Business Goal:**  
Increase user engagement and return visits by enabling job seekers to curate a personal list of interesting opportunities.

**Associated PRD Features:** SAVE-001, SAVE-002, SAVE-003, SAVE-004

---

### User Story 4.1: Save Job for Later

**Story:**  
As a Job Seeker (Sarah Chen)  
I want to save jobs to review later  
So that I can keep track of interesting opportunities while I research them

**Acceptance Criteria:**

**Happy Path:**
- **Given** an authenticated job seeker is viewing a job listing or details page
- **When** they click the bookmark/save icon
- **Then** the job is added to their saved jobs list
- **And** the icon changes to a filled bookmark state
- **And** a success toast appears: "Job saved successfully"

**Save from Card:**
- **Given** a user is viewing job cards in search results
- **When** they click the save icon on a job card
- **Then** the job is saved without navigating away
- **And** the icon state updates immediately (optimistic UI)

**Duplicate Prevention:**
- **Given** a job is already in the user's saved list
- **When** they try to save it again
- **Then** the system prevents duplicate entries
- **And** shows: "This job is already in your saved list"

**Priority:** P0  
**Story Points:** 3  
**Dependencies:** EPIC-001  
**Traceability:** SAVE-001

---

### User Story 4.2: Unsave Job

**Story:**  
As a Job Seeker  
I want to remove jobs from my saved list  
So that I can keep my list organized with only relevant opportunities

**Acceptance Criteria:**

**Happy Path:**
- **Given** a user is viewing their saved jobs list or a saved job
- **When** they click the filled bookmark icon (or "Unsave" button)
- **Then** the job is removed from their saved list
- **And** the icon changes to an outline state
- **And** a confirmation toast appears: "Job removed from saved list"

**From Saved Jobs Page:**
- **Given** a user is on the Saved Jobs page
- **When** they click the X or "Remove" button on a job card
- **Then** the job is removed from the list
- **And** the card animates out (slide/fade)

**Confirmation Modal:**
- **Given** a user tries to unsave a job
- **When** the action is destructive
- **Then** a confirmation modal appears: "Are you sure you want to remove this job from your saved list?"
- **And** options: "Cancel" and "Remove"

**Priority:** P0  
**Story Points:** 3  
**Dependencies:** US 4.1  
**Traceability:** SAVE-002

---

### User Story 4.3: Saved Jobs Management Page

**Story:**  
As a Job Seeker  
I want a dedicated page to view and manage all my saved jobs  
So that I can easily review and apply to jobs I've bookmarked

**Acceptance Criteria:**

**Happy Path:**
- **Given** an authenticated job seeker clicks "Saved Jobs" in navigation
- **When** the page loads
- **Then** they see all their saved jobs in a grid/list view
- **And** each job card shows the same information as search results

**Quick Actions:**
- **Given** a user is viewing saved jobs
- **When** they hover over or click on a job card
- **Then** they see quick action buttons: "View Details", "Apply Now", "Remove"

**Empty State:**
- **Given** a user has no saved jobs
- **When** they visit the Saved Jobs page
- **Then** they see a friendly illustration
- **And** message: "No saved jobs yet. Start exploring and save jobs you're interested in!"
- **And** a CTA button: "Browse Jobs"

**Apply Integration:**
- **Given** a user is on the Saved Jobs page
- **When** they click "Apply Now" on a saved job
- **Then** the one-click application process begins (US 3.1)
- **And** upon success, the job remains in saved list or moves to Applied (configurable)

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** US 4.1, US 4.2, US 3.1  
**Traceability:** SAVE-003

---

### User Story 4.4: Auth Guard for Save Feature

**Story:**  
As a Guest User  
I want to be redirected to login when I try to save a job  
So that I understand authentication is required for this feature

**Acceptance Criteria:**

**Redirect to Login:**
- **Given** a guest user is viewing job listings
- **When** they click the save/bookmark icon
- **Then** they are redirected to the login page
- **And** a message appears: "Please login to save jobs"

**Post-Login Redirect:**
- **Given** a guest user was redirected to login from trying to save a job
- **When** they successfully login
- **Then** they are redirected back to the job they tried to save
- **And** the save action is automatically completed (optional enhancement)

**Priority:** P1  
**Story Points:** 2  
**Dependencies:** US 4.1  
**Traceability:** SAVE-004

---

## 💬 EPIC 5: Real-time Communication

**Description:**  
Enables direct messaging between job applicants and employers through Socket.io-powered real-time chat with message persistence.

**Business Goal:**  
Facilitate transparent communication between candidates and employers, differentiating the platform with immediate engagement capabilities.

**Associated PRD Features:** CHAT-001, CHAT-002, CHAT-003, CHAT-004, CHAT-005, CHAT-006

---

### User Story 5.1: Socket.io Infrastructure Setup

**Story:**  
As a Developer  
I want to set up Socket.io server and client infrastructure  
So that real-time communication features can be built on top of it

**Acceptance Criteria:**

**Server Setup:**
- **Given** the backend server is running
- **When** Socket.io is initialized
- **Then** it listens for WebSocket connections on the configured port
- **And** it integrates with the existing Express server

**Client Connection:**
- **Given** a user is authenticated and on the platform
- **When** the client app loads
- **Then** a Socket.io connection is established
- **And** the connection persists during the session

**Redis Adapter (Future-Proofing):**
- **Given** Socket.io is configured
- **When** deployed in a multi-server environment
- **Then** the Redis adapter enables cross-server message broadcasting

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** EPIC-001  
**Traceability:** CHAT-001

---

### User Story 5.2: Room-Based Chat Initialization

**Story:**  
As an Applicant or Employer  
I want a dedicated chat room for each job application  
So that conversations are organized and private to the specific opportunity

**Acceptance Criteria:**

**Room Creation:**
- **Given** a job seeker applies to a job (US 3.1)
- **When** the application is created
- **Then** a unique chat room is created for that application
- **And** the room ID is associated with the application ID

**Room Access Control:**
- **Given** a chat room exists for an application
- **When** the applicant or posting employer accesses chat
- **Then** they are joined to the room and can see the conversation
- **And** other users cannot access the room

**Room Header:**
- **Given** a user is in a chat room
- **When** the chat panel opens
- **Then** the header shows: recipient name, job title

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** US 5.1, US 3.1  
**Traceability:** CHAT-002

---

### User Story 5.3: Real-time Messaging

**Story:**  
As an Applicant or Employer  
I want to send and receive messages in real-time  
So that we can communicate efficiently without page refreshes

**Acceptance Criteria:**

**Send Message:**
- **Given** a user is in a chat room
- **When** they type a message and click send (or press Enter)
- **Then** the message is immediately displayed in the chat
- **And** the message is broadcast to the other participant in real-time
- **And** the message is persisted to the database

**Receive Message:**
- **Given** a user has an active chat room open
- **When** the other participant sends a message
- **Then** the message appears immediately without page refresh
- **And** a notification sound plays (optional)
- **And** if the chat is minimized, a badge counter appears

**Optimistic UI Updates:**
- **Given** a user sends a message
- **When** they click send
- **Then** the message appears in the chat immediately (before server confirmation)
- **And** if the server rejects it, an error state is shown with retry option

**Priority:** P0  
**Story Points:** 8  
**Dependencies:** US 5.2  
**Traceability:** CHAT-001, CHAT-006

---

### User Story 5.4: Chat History Persistence

**Story:**  
As an Applicant or Employer  
I want to see the full history of our conversation  
So that I can reference previous messages and maintain context

**Acceptance Criteria:**

**Load History:**
- **Given** a user opens a chat room
- **When** the chat panel loads
- **Then** all previous messages for that application are loaded
- **And** they are displayed in chronological order (oldest to newest)
- **And** the view scrolls to the most recent message

**Message Format:**
- **Given** chat history is displayed
- **When** messages are rendered
- **Then** each message shows:
  - Sender name
  - Message text
  - Timestamp (formatted: "Today, 2:30 PM" or "Yesterday, 10:15 AM")
  - Different styling for sent vs received messages

**Scroll Behavior:**
- **Given** a user is viewing chat history
- **When** they scroll up
- **Then** older messages are loaded (pagination if large history)

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** US 5.2  
**Traceability:** CHAT-003

---

### User Story 5.5: Chat Access from Application Views

**Story:**  
As an Applicant or Employer  
I want to open chat directly from the application views  
So that communication is easily accessible in context

**Acceptance Criteria:**

**From Application List:**
- **Given** a job seeker is viewing their applications (US 3.2)
- **When** they click the "Chat" button on an application
- **Then** the chat panel opens for that application

**From Applicant Review:**
- **Given** an employer is reviewing applicants (US 3.4)
- **When** they click "Message" on an applicant
- **Then** the chat panel opens for that application

**From Job Details:**
- **Given** a job seeker has applied to a job
- **When** they view the job details
- **Then** they see a "Chat with Employer" button
- **And** clicking it opens the chat panel

**Priority:** P1  
**Story Points:** 3  
**Dependencies:** US 5.3, US 3.2, US 3.4  
**Traceability:** CHAT-002

---

### User Story 5.6: Chat Deletion

**Story:**  
As a User  
I want to be able to clear my chat history  
So that I can manage my privacy and clean up old conversations

**Acceptance Criteria:**

**Delete Chat:**
- **Given** a user is in a chat room
- **When** they click "Delete Chat" from the options menu
- **Then** a confirmation modal appears: "Are you sure? This will delete all messages permanently."

**Confirmation:**
- **Given** the delete confirmation is shown
- **When** they confirm deletion
- **Then** all messages for that chat room are deleted from the database
- **And** the chat panel shows an empty state

**Impact:**
- **Given** a user deletes their chat
- **When** the other participant views the chat
- **Then** they can still see the conversation (only deleter's view is cleared)
  - OR: Both views are cleared (product decision needed)

**Priority:** P2  
**Story Points:** 3  
**Dependencies:** US 5.4  
**Traceability:** CHAT-005

---

### User Story 5.7: Message Read Status

**Story:**  
As a User  
I want to see when my messages have been read  
So that I know if the other party has seen my communication

**Acceptance Criteria:**

**Read Receipts:**
- **Given** a user sends a message
- **When** the recipient opens/views the chat
- **Then** the message status changes to "Read"
- **And** a read indicator (checkmark or "Read" text) appears on the message

**Timestamp:**
- **Given** a message is read
- **When** hovering over the read indicator
- **Then** the exact read timestamp is shown as a tooltip

**Priority:** P2  
**Story Points:** 3  
**Dependencies:** US 5.3  
**Traceability:** CHAT-004

---

## 🏢 EPIC 6: Employer Tools

**Description:**  
Provides employers with comprehensive tools to post, manage, and optimize job listings, as well as review and manage applicants.

**Business Goal:**  
Enable employers to efficiently manage their hiring process, increasing platform value and employer retention.

**Associated PRD Features:** EMP-001, EMP-002, EMP-003, EMP-004, EMP-005, EMP-006, EMP-007

---

### User Story 6.1: Create Job Posting

**Story:**  
As an Employer (Michael Rodriguez)  
I want to create and publish job listings  
So that I can attract qualified candidates to my open positions

**Acceptance Criteria:**

**Happy Path:**
- **Given** an authenticated employer navigates to "Post a Job"
- **When** they complete the job form with:
  - Job title (required)
  - Company name (required, pre-filled)
  - Job description (required, supports markdown)
  - Location (required)
  - Job type (required: Full-Time, Part-Time, Contract, Internship, Freelance)
- **And** they click "Publish"
- **Then** the job is created and published
- **And** they see a success toast: "Job posted successfully!"
- **And** they are redirected to their job listings page

**Validation:**
- **Given** an employer submits the form with missing required fields
- **When** validation runs
- **Then** inline errors appear for each missing field
- **And** the form does not submit

**Duplicate Prevention:**
- **Given** an employer tries to post a job with the same title and company
- **When** they submit
- **Then** they see a warning: "A job with this title already exists. Continue anyway?"

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** EPIC-001  
**Traceability:** EMP-001, EMP-004

---

### User Story 6.2: Edit Job Posting

**Story:**  
As an Employer  
I want to edit my existing job postings  
So that I can update information as requirements change

**Acceptance Criteria:**

**Happy Path:**
- **Given** an employer is viewing their job listings
- **When** they click "Edit" on a job
- **Then** they are taken to the edit form pre-filled with current data
- **And** they can modify any field
- **And** clicking "Save Changes" updates the job
- **And** a success toast appears

**Edit Permissions:**
- **Given** an employer tries to edit another employer's job
- **When** they attempt the action
- **Then** they receive a 403 Forbidden response
- **And** an error message: "You don't have permission to edit this job"

**Timestamp Update:**
- **Given** a job is edited
- **When** changes are saved
- **Then** the "updatedAt" timestamp is refreshed
- **And** the job may be marked as "Updated recently" in search results

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** US 6.1  
**Traceability:** EMP-002

---

### User Story 6.3: Delete Job Posting

**Story:**  
As an Employer  
I want to delete my job postings  
So that I can remove filled positions or outdated listings

**Acceptance Criteria:**

**Single Delete:**
- **Given** an employer is viewing their job listings
- **When** they click "Delete" on a job
- **Then** a confirmation modal appears: "Are you sure? This action cannot be undone."
- **And** confirming deletes the job and all associated applications

**Bulk Delete:**
- **Given** an employer selects multiple jobs using checkboxes
- **When** they click "Delete Selected"
- **Then** a confirmation modal shows: "Delete X jobs? This action cannot be undone."
- **And** confirming deletes all selected jobs

**Cascade Effects:**
- **Given** a job has active applications
- **When** the job is deleted
- **Then** applicants see the job marked as "Position Closed" in their applications
- **And** associated chat rooms are archived (not deleted)

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** US 6.1  
**Traceability:** EMP-003

---

### User Story 6.4: View Posted Jobs List

**Story:**  
As an Employer  
I want to see a list of all jobs I've posted  
So that I can manage my active listings and track their performance

**Acceptance Criteria:**

**Happy Path:**
- **Given** an employer clicks "My Jobs" in navigation
- **When** the page loads
- **Then** they see all their job postings with:
  - Job title
  - Posting date
  - Number of applicants
  - Status (Active, Closed)
  - Quick action buttons (Edit, Delete, View Applicants)

**Sorting:**
- **Given** an employer is viewing their jobs
- **When** they select a sort option
- **Then** they can sort by: Post Date (newest/oldest), Title, Number of Applicants, Status

**Filtering:**
- **Given** an employer has many jobs
- **When** they use the filter options
- **Then** they can filter by: Status (Active/Closed), Job Type

**Empty State:**
- **Given** an employer has not posted any jobs
- **When** they visit "My Jobs"
- **Then** they see: "You haven't posted any jobs yet."
- **And** a CTA: "Post Your First Job"

**Priority:** P0  
**Story Points:** 5  
**Dependencies:** US 6.1  
**Traceability:** EMP-001

---

### User Story 6.5: Employer Profile Management

**Story:**  
As an Employer  
I want to update my company profile information  
So that job seekers can learn about my company and its culture

**Acceptance Criteria:**

**Profile Editing:**
- **Given** an employer navigates to their profile page
- **When** they click "Edit Profile"
- **Then** they can update:
  - Company name
  - Company description
  - Website URL
  - Company logo

**Logo Upload:**
- **Given** an employer is editing their profile
- **When** they select a logo image (JPG, PNG, max 2MB)
- **Then** the image is uploaded and displayed as preview
- **And** upon saving, the logo appears on all their job postings

**Validation:**
- **Given** an employer enters an invalid website URL
- **When** they save
- **Then** they see an error: "Please enter a valid URL"

**Public Profile:**
- **Given** a job seeker views a job
- **When** they click on the company name
- **Then** they see the employer's public profile with company information

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** EPIC-001  
**Traceability:** EMP-006, EMP-007

---

### User Story 6.6: Duplicate Job Prevention

**Story:**  
As a Platform  
I want to warn employers about potential duplicate job postings  
So that the job board remains clean and uncluttered

**Acceptance Criteria:**

**Duplicate Detection:**
- **Given** an employer creates a job with title "Senior React Developer" and company "TechCorp"
- **When** they try to create another job with the same title and company
- **Then** a warning appears: "A job with this title already exists. Are you sure you want to create a duplicate?"

**Override Option:**
- **Given** the duplicate warning is shown
- **When** the employer confirms they want to proceed
- **Then** the job is created despite being a duplicate
- **And** it is flagged in the system for admin review

**Priority:** P1  
**Story Points:** 3  
**Dependencies:** US 6.1  
**Traceability:** EMP-004

---

## 📊 EPIC 7: Employer Analytics Dashboard

**Description:**  
Provides employers with visual analytics and insights about their job postings, application trends, and hiring performance.

**Business Goal:**  
Give employers actionable insights to optimize their job postings and hiring process, increasing platform stickiness.

**Associated PRD Features:** ANLY-001, ANLY-002, ANLY-003

---

### User Story 7.1: Applications Over Time Chart

**Story:**  
As an Employer (Michael Rodriguez)  
I want to see a chart of applications received over time  
So that I can identify trends and optimize my posting strategy

**Acceptance Criteria:**

**Chart Display:**
- **Given** an employer navigates to their dashboard
- **When** the analytics section loads
- **Then** they see a line chart showing daily application volume
- **And** the X-axis shows dates, Y-axis shows number of applications

**Date Range:**
- **Given** the applications chart is displayed
- **When** they select a date range (Last 7 days, Last 30 days, Last 90 days)
- **Then** the chart updates to show data for the selected range

**Hover Details:**
- **Given** an employer hovers over a data point
- **When** the tooltip appears
- **Then** it shows the exact date and number of applications received

**No Data State:**
- **Given** an employer has no applications in the selected period
- **When** the chart loads
- **Then** they see a message: "No applications yet. Share your job postings to get more visibility!"

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** US 3.4  
**Traceability:** ANLY-001

---

### User Story 7.2: Job Postings Summary

**Story:**  
As an Employer  
I want to see a breakdown of my job postings by type  
So that I understand my hiring distribution

**Acceptance Criteria:**

**Visualization:**
- **Given** an employer is on the dashboard
- **When** the summary section loads
- **Then** they see a chart (pie or bar) showing job distribution by type:
  - Full-Time: X jobs
  - Part-Time: X jobs
  - Contract: X jobs
  - Internship: X jobs
  - Freelance: X jobs

**Interactive Elements:**
- **Given** a chart segment is clicked
- **When** the click occurs
- **Then** they are taken to the job listings filtered by that job type

**Statistics Cards:**
- **Given** the dashboard is loaded
- **When** the summary section renders
- **Then** they see cards showing:
  - Total Active Jobs
  - Total Applications Received
  - Average Applications per Job
  - Response Rate (%)

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** US 6.4  
**Traceability:** ANLY-002

---

### User Story 7.3: Recent Activity Feed

**Story:**  
As an Employer  
I want to see recent applicant activity  
So that I can quickly identify and respond to new candidates

**Acceptance Criteria:**

**Activity List:**
- **Given** an employer is on the dashboard
- **When** the recent activity section loads
- **Then** they see the last 5 applications with:
  - Applicant name
  - Job title applied for
  - Application date/time (e.g., "2 hours ago")
  - Current status

**Quick Actions:**
- **Given** recent activity is displayed
- **When** they hover over an activity item
- **Then** quick action buttons appear: "View Profile", "Update Status", "Message"

**Real-time Updates:**
- **Given** the dashboard is open
- **When** a new application is submitted
- **Then** the recent activity list updates automatically (via Socket.io)
- **And** a notification badge appears on the dashboard nav item

**Empty State:**
- **Given** an employer has no recent applications
- **When** the activity section loads
- **Then** they see: "No recent activity. Your jobs will appear here when candidates apply."

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** US 3.4, US 7.1  
**Traceability:** ANLY-003

---

### User Story 7.4: Dashboard Overview Page

**Story:**  
As an Employer  
I want a centralized dashboard view  
So that I can get a quick overview of my hiring activity

**Acceptance Criteria:**

**Layout:**
- **Given** an employer logs in or clicks "Dashboard"
- **When** the page loads
- **Then** they see a comprehensive dashboard with:
  - Welcome message with company name
  - Quick stats cards (Active Jobs, Total Apps, Avg per Job, Response Rate)
  - Applications Over Time chart
  - Job Postings Summary chart
  - Recent Activity list
  - Quick action buttons: "Post New Job", "View All Applicants"

**Responsive Design:**
- **Given** the dashboard is viewed on different screen sizes
- **When** the layout adjusts
- **Then** charts stack vertically on mobile, side-by-side on desktop

**Loading States:**
- **Given** dashboard data is loading
- **When** the page renders
- **Then** skeleton placeholders appear for charts and stats
- **And** real data replaces them as it loads

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** US 7.1, US 7.2, US 7.3  
**Traceability:** ANLY-001, ANLY-002, ANLY-003

---

## ⭐ EPIC 8: Company Reviews System

**Description:**  
Enables job seekers to submit and view company reviews and ratings, promoting transparency in the hiring process.

**Business Goal:**  
Build trust in the platform by providing transparent company feedback, helping job seekers make informed decisions.

**Associated PRD Features:** REVW-001, REVW-002, REVW-003, REVW-004

---

### User Story 8.1: Submit Company Review

**Story:**  
As a Job Seeker (Sarah Chen)  
I want to rate and review companies I've interacted with  
So that I can share my experience and help other job seekers

**Acceptance Criteria:**

**Happy Path:**
- **Given** an authenticated job seeker who has applied to a job
- **When** they navigate to the company profile and click "Write a Review"
- **Then** they see a review form with:
  - Star rating (1-5 stars)
  - Written review text area (minimum 50 characters, maximum 1000)
  - Submit button

**Submission:**
- **Given** a user completes the review form
- **When** they click "Submit Review"
- **Then** the review is saved
- **And** it appears on the company profile
- **And** the average rating is recalculated
- **And** they see a success toast: "Review submitted successfully!"

**Validation:**
- **Given** a user tries to submit without a rating
- **When** they click submit
- **Then** they see: "Please select a star rating"

- **Given** a user enters fewer than 50 characters
- **When** they click submit
- **Then** they see: "Review must be at least 50 characters"

**One Review Per Company:**
- **Given** a user has already reviewed a company
- **When** they try to submit another review
- **Then** they see: "You have already reviewed this company. Edit your existing review?"

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** EPIC-001, US 3.1  
**Traceability:** REVW-001, REVW-004

---

### User Story 8.2: View Company Reviews

**Story:**  
As a Job Seeker  
I want to read reviews about companies  
So that I can make informed decisions about where to apply

**Acceptance Criteria:**

**Review Display:**
- **Given** a user views a company profile or job details
- **When** the page loads
- **Then** they see:
  - Average star rating (e.g., "4.2 out of 5")
  - Total number of reviews
  - Rating breakdown (5 stars: X, 4 stars: X, etc.)
  - List of recent reviews

**Review Card:**
- **Given** reviews are displayed
- **When** a user views a review
- **Then** each review shows:
  - Reviewer's name (or "Anonymous")
  - Star rating
  - Review text
  - Date posted
  - "Helpful" button (future feature)

**Pagination:**
- **Given** a company has many reviews
- **When** viewing the reviews section
- **Then** reviews are paginated (5 per page)
- **And** they can navigate through pages

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** US 8.1  
**Traceability:** REVW-002, REVW-003

---

### User Story 8.3: Reviews on Job Details

**Story:**  
As a Job Seeker  
I want to see company reviews when viewing a job  
So that I can evaluate the employer while reading the job description

**Acceptance Criteria:**

**Integration:**
- **Given** a user is viewing job details (US 2.6)
- **When** they scroll to the company section
- **Then** they see:
  - Average rating with stars
  - "Based on X reviews" link
  - 3 most recent reviews
  - "View all reviews" link

**Quick Access:**
- **Given** reviews are shown on job details
- **When** a user clicks "View all reviews"
- **Then** they are taken to the company profile with reviews section focused

**Priority:** P1  
**Story Points:** 3  
**Dependencies:** US 8.2  
**Traceability:** REVW-002

---

## 🛡️ EPIC 9: Administration & Moderation

**Description:**  
Provides platform administrators with comprehensive tools to manage users, employers, job postings, and monitor platform health.

**Business Goal:**  
Ensure platform quality, security, and compliance through effective moderation and user management capabilities.

**Associated PRD Features:** ADMN-001, ADMN-002, ADMN-003, ADMN-004, ADMN-005, ADMN-006, ADMN-007, ADMN-008

---

### User Story 9.1: Admin Authentication

**Story:**  
As an Administrator  
I want to access the admin panel with elevated privileges  
So that I can perform platform management tasks

**Acceptance Criteria:**

**Admin Login:**
- **Given** an admin user has isAdmin flag set to true
- **When** they login through the regular login
- **Then** they see an additional "Admin Panel" option in navigation

**Access Control:**
- **Given** a non-admin user tries to access admin routes
- **When** they navigate to /admin/*
- **Then** they receive a 403 Forbidden response
- **And** are redirected to their dashboard with message: "Access denied"

**Priority:** P1  
**Story Points:** 3  
**Dependencies:** EPIC-001  
**Traceability:** ADMN-006

---

### User Story 9.2: Platform Statistics Dashboard

**Story:**  
As an Administrator  
I want to view platform-wide statistics  
So that I can monitor platform health and growth

**Acceptance Criteria:**

**Statistics Display:**
- **Given** an admin navigates to the Admin Dashboard
- **When** the page loads
- **Then** they see key metrics:
  - Total Registered Users (Job Seekers)
  - Total Registered Employers
  - Total Job Postings (Active/Closed breakdown)
  - Total Reviews Submitted
  - Total Applications Submitted
  - New signups today/this week/this month

**Visual Charts:**
- **Given** statistics are displayed
- **When** the dashboard renders
- **Then** they see visual representations:
  - User growth chart (line chart)
  - Job postings by type (pie chart)
  - Applications trend (area chart)

**Real-time Updates:**
- **Given** the admin dashboard is open
- **When** new data comes in
- **Then** statistics update automatically (every 5 minutes or real-time)

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** US 9.1  
**Traceability:** ADMN-001

---

### User Story 9.3: User Management

**Story:**  
As an Administrator  
I want to view, search, filter, and manage user accounts  
So that I can support users and enforce platform policies

**Acceptance Criteria:**

**User List:**
- **Given** an admin navigates to "Manage Users"
- **When** the page loads
- **Then** they see a table of all job seeker users with:
  - Name, Email, Phone
  - Registration date
  - Status (Active/Suspended)
  - Number of applications
  - Actions (View, Edit, Suspend/Activate, Delete)

**Search:**
- **Given** the user list is displayed
- **When** an admin types in the search box
- **Then** results filter in real-time by name or email

**Filter:**
- **Given** filter options are available
- **When** an admin selects filters
- **Then** they can filter by: Status (Active/Suspended), Date Range

**Sort:**
- **Given** the user list is displayed
- **When** column headers are clicked
- **Then** results sort by: Name, Email, Registration Date (ascending/descending)

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** US 9.1  
**Traceability:** ADMN-002, ADMN-007, ADMN-008

---

### User Story 9.4: Employer Management

**Story:**  
As an Administrator  
I want to view, search, filter, and manage employer accounts  
So that I can ensure quality employer presence on the platform

**Acceptance Criteria:**

**Employer List:**
- **Given** an admin navigates to "Manage Employers"
- **When** the page loads
- **Then** they see a table of all employers with:
  - Company Name, Email
  - Registration date
  - Status (Active/Suspended)
  - Number of job postings
  - Total applications received
  - Actions (View, Edit, Suspend/Activate, Delete)

**Search & Filter:**
- **Given** the employer list is displayed
- **When** an admin uses search
- **Then** results filter by company name or email
- **And** they can filter by status and date range

**Employer Details:**
- **Given** an admin clicks "View" on an employer
- **When** the details page loads
- **Then** they see:
  - Full company profile
  - All job postings
  - All applications received
  - Recent activity

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** US 9.1  
**Traceability:** ADMN-003, ADMN-007, ADMN-008

---

### User Story 9.5: Job Moderation

**Story:**  
As an Administrator  
I want to view and manage all job postings  
So that I can moderate content and remove inappropriate listings

**Acceptance Criteria:**

**Job List:**
- **Given** an admin navigates to "Manage Jobs"
- **When** the page loads
- **Then** they see all job postings across all employers with:
  - Job title, Company, Location, Type
  - Post date, Number of applicants
  - Status (Active/Deleted)
  - Actions (View, Delete)

**Delete Job:**
- **Given** an admin views a job listing
- **When** they click "Delete"
- **Then** a confirmation modal appears
- **And** upon confirmation, the job is soft-deleted
- **And** the employer is notified (optional)

**Search & Filter:**
- **Given** the job list is displayed
- **When** an admin uses search
- **Then** results filter by job title, company name, or location
- **And** they can filter by job type and status

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** US 9.1, EPIC-006  
**Traceability:** ADMN-004

---

### User Story 9.6: Account Status Toggle

**Story:**  
As an Administrator  
I want to suspend or activate user and employer accounts  
So that I can enforce platform policies and manage problematic accounts

**Acceptance Criteria:**

**Suspend User/Employer:**
- **Given** an admin is viewing user/employer management
- **When** they click "Suspend" on an active account
- **Then** a confirmation modal appears: "Suspend [Name/Company]? They will be unable to login."
- **And** upon confirmation, the account status changes to "Suspended"
- **And** any active sessions are invalidated immediately

**Activate Account:**
- **Given** an admin is viewing a suspended account
- **When** they click "Activate"
- **Then** the account status changes to "Active"
- **And** the user/employer can login again

**Bulk Actions:**
- **Given** an admin selects multiple accounts
- **When** they choose "Suspend Selected" or "Activate Selected"
- **Then** all selected accounts are updated

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** US 9.3, US 9.4  
**Traceability:** ADMN-005

---

### User Story 9.7: Grant/Revoke Admin Privileges

**Story:**  
As an Administrator  
I want to grant or revoke admin privileges to other users  
So that I can delegate platform management responsibilities

**Acceptance Criteria:**

**Make Admin:**
- **Given** an admin is viewing user details
- **When** they toggle the "Admin" switch
- **Then** the user's isAdmin flag is updated
- **And** if granted, the user can access admin panel on next login
- **And** if revoked, their admin access is immediately removed

**Security Check:**
- **Given** the last admin tries to revoke their own admin status
- **When** they attempt the action
- **Then** they see an error: "Cannot remove admin status from the last administrator"

**Audit Log:**
- **Given** admin privileges are changed
- **When** the action is completed
- **Then** an audit log entry is created with timestamp and admin who made the change

**Priority:** P2  
**Story Points:** 3  
**Dependencies:** US 9.3  
**Traceability:** ADMN-006

---

## 👤 EPIC 10: User Profile Management

**Description:**  
Enables job seekers and employers to create, view, and edit comprehensive profiles including work experience, education, and skills.

**Business Goal:**  
Allow users to showcase their professional background, improving matching quality between candidates and employers.

**Associated PRD Features:** PROF-001, PROF-002, PROF-003, PROF-004

---

### User Story 10.1: Job Seeker Profile View

**Story:**  
As a Job Seeker (Sarah Chen)  
I want to view my complete profile  
So that I can see how I appear to potential employers

**Acceptance Criteria:**

**Profile Display:**
- **Given** an authenticated job seeker navigates to "My Profile"
- **When** the page loads
- **Then** they see their profile organized in sections:
  - Personal Information (Name, Email, Phone)
  - Work Experience (timeline view)
  - Education
  - Skills (tag display)
  - Portfolio Links

**Public vs Private View:**
- **Given** a job seeker views their profile
- **When** they toggle "Preview Public View"
- **Then** they see exactly what employers see when reviewing their application

**Priority:** P1  
**Story Points:** 3  
**Dependencies:** EPIC-001  
**Traceability:** PROF-001

---

### User Story 10.2: Job Seeker Profile Editing

**Story:**  
As a Job Seeker  
I want to edit my profile information  
So that I can keep my professional information up to date

**Acceptance Criteria:**

**Edit Personal Info:**
- **Given** a job seeker is viewing their profile
- **When** they click "Edit Profile"
- **Then** they can update:
  - First name, Last name
  - Phone number
  - Profile picture (optional future feature)

**Manage Work Experience:**
- **Given** a user is editing their profile
- **When** they navigate to Work Experience section
- **Then** they can:
  - Add new experience (Title, Company, Location, Start/End Date, Description)
  - Edit existing entries
  - Delete entries
  - Reorder entries (drag and drop)

**Manage Education:**
- **Given** a user is editing their profile
- **When** they navigate to Education section
- **Then** they can add/edit/delete education entries (School, Degree, Field, Dates)

**Manage Skills:**
- **Given** a user is editing their profile
- **When** they navigate to Skills section
- **Then** they can:
  - Add skills (type and autocomplete from common skills)
  - Remove skills
  - Reorder skills

**Portfolio Links:**
- **Given** a user is editing their profile
- **When** they add portfolio links
- **Then** each link is validated (must be valid URL format)
- **And** links are displayed as clickable on the profile

**Save Changes:**
- **Given** a user makes profile changes
- **When** they click "Save Changes"
- **Then** all updates are persisted
- **And** a success toast appears
- **And** they are returned to profile view

**Priority:** P1  
**Story Points:** 8  
**Dependencies:** US 10.1  
**Traceability:** PROF-002

---

### User Story 10.3: Employer Profile View & Edit

**Story:**  
As an Employer  
I want to view and edit my company profile  
So that job seekers can learn about my company culture and values

**Acceptance Criteria:**

**View Profile:**
- **Given** an employer navigates to "Company Profile"
- **When** the page loads
- **Then** they see:
  - Company name and logo
  - Company description
  - Website link
  - Posted jobs count
  - Reviews summary

**Edit Profile:**
- **Given** an employer clicks "Edit Profile"
- **When** the edit form opens
- **Then** they can update: Company name, Description, Website, Logo

**Company Description:**
- **Given** an employer edits the description
- **When** they save
- **Then** the description supports rich text or markdown formatting
- **And** it displays correctly on the public profile

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** EPIC-001, US 6.5  
**Traceability:** PROF-003

---

### User Story 10.4: Admin Profile Editing

**Story:**  
As an Administrator  
I want to edit any user's or employer's profile  
So that I can help users with account issues or correct inappropriate content

**Acceptance Criteria:**

**Edit Any Profile:**
- **Given** an admin is viewing a user or employer profile
- **When** they click "Edit Profile"
- **Then** they have full editing capabilities for all profile fields
- **And** changes are saved with an audit note: "Edited by admin [Name] on [Date]"

**Profile Cleanup:**
- **Given** an admin identifies inappropriate content in a profile
- **When** they edit and remove the content
- **Then** the profile is updated immediately
- **And** the user/employer can see the changes on their next profile view

**Priority:** P2  
**Story Points:** 3  
**Dependencies:** US 10.2, US 10.3, US 9.1  
**Traceability:** PROF-004

---

## 🎨 EPIC 11: Theme & Accessibility

**Description:**  
Provides dark/light theme support and ensures the platform is accessible to users with disabilities through ARIA labels, keyboard navigation, and focus management.

**Business Goal:**  
Deliver an inclusive user experience that accommodates different user preferences and accessibility needs.

**Associated PRD Features:** THEM-001, THEM-002, ACCS-001, ACCS-002, ACCS-003

---

### User Story 11.1: Dark Mode Toggle

**Story:**  
As a User  
I want to toggle between light and dark themes  
So that I can use the platform comfortably in different lighting conditions

**Acceptance Criteria:**

**Toggle Function:**
- **Given** a user is on any page
- **When** they click the theme toggle button (in header)
- **Then** the theme switches between light and dark
- **And** all UI elements update their colors accordingly

**Color Scheme:**
- **Given** dark mode is active
- **When** viewing the interface
- **Then** colors follow the specification:
  - Background: #1F2937 (Gray 800)
  - Surface: #374151 (Gray 700)
  - Text Primary: #F9FAFB (Gray 50)
  - Text Secondary: #D1D5DB (Gray 300)
  - Primary: #3B82F6 (Blue 500)

**Icon Update:**
- **Given** the theme toggle button is visible
- **When** the theme changes
- **Then** the icon updates to reflect the current theme (Sun for dark mode, Moon for light mode)

**Priority:** P2  
**Story Points:** 3  
**Dependencies:** None  
**Traceability:** THEM-001

---

### User Story 11.2: Theme Preference Persistence

**Story:**  
As a User  
I want my theme preference to be saved  
So that I don't have to change it every time I visit

**Acceptance Criteria:**

**Save to Database:**
- **Given** an authenticated user changes their theme
- **When** the toggle is clicked
- **Then** the preference is saved to their user profile in the database

**Load Preference:**
- **Given** a user has previously set a theme preference
- **When** they login and load the platform
- **Then** their saved theme is applied automatically

**Guest Users:**
- **Given** a guest user changes the theme
- **When** they toggle
- **Then** the preference is saved to localStorage
- **And** it persists across sessions until they clear browser data

**Priority:** P2  
**Story Points:** 2  
**Dependencies:** US 11.1  
**Traceability:** THEM-002

---

### User Story 11.3: ARIA Labels & Screen Reader Support

**Story:**  
As a Visually Impaired User  
I want the platform to be compatible with screen readers  
So that I can navigate and use all features effectively

**Acceptance Criteria:**

**ARIA Labels:**
- **Given** interactive elements exist on the page
- **When** a screen reader encounters them
- **Then** each element has appropriate ARIA labels:
  - Buttons: aria-label describing the action
  - Forms: aria-labelledby linking labels to inputs
  - Navigation: aria-expanded for dropdowns
  - Live regions: aria-live for dynamic content updates

**Landmarks:**
- **Given** the page structure
- **When** parsed by assistive technology
- **Then** semantic landmarks are present:
  - `<header>` for header
  - `<nav>` for navigation
  - `<main>` for main content
  - `<footer>` for footer

**Alt Text:**
- **Given** images are present
- **When** viewed by screen readers
- **Then** all functional images have descriptive alt text
- **And** decorative images have empty alt=""

**Priority:** P2  
**Story Points:** 5  
**Dependencies:** None  
**Traceability:** ACCS-001

---

### User Story 11.4: Keyboard Navigation

**Story:**  
As a User who prefers keyboard navigation  
I want to navigate the entire platform using only my keyboard  
So that I can access all features without a mouse

**Acceptance Criteria:**

**Tab Navigation:**
- **Given** a user presses Tab
- **When** navigating through the page
- **Then** focus moves in logical order through all interactive elements

**Dropdown Accessibility:**
- **Given** a filter dropdown is focused
- **When** the user presses Enter or Space
- **Then** the dropdown opens
- **And** arrow keys navigate options
- **And** Escape closes the dropdown

**Modal Accessibility:**
- **Given** a modal is open
- **When** the user presses Tab
- **Then** focus is trapped within the modal
- **And** pressing Escape closes the modal

**Skip Links:**
- **Given** a user presses Tab on page load
- **When** the skip link appears
- **Then** pressing Enter jumps focus to main content

**Priority:** P2  
**Story Points:** 5  
**Dependencies:** None  
**Traceability:** ACCS-002

---

### User Story 11.5: Focus Management

**Story:**  
As a Keyboard User  
I want visible focus indicators on all interactive elements  
So that I can see where my focus is currently located

**Acceptance Criteria:**

**Focus Indicators:**
- **Given** any interactive element receives focus
- **When** focus is applied
- **Then** a visible focus ring/outline appears (minimum 2px contrast ratio)

**Focus States:**
- **Given** buttons, links, and form inputs
- **When** focused via keyboard
- **Then** each shows a distinct focus state that doesn't rely on color alone

**Focus Restoration:**
- **Given** a modal or dialog is closed
- **When** focus returns to the page
- **Then** focus is restored to the element that triggered the modal

**Priority:** P2  
**Story Points:** 3  
**Dependencies:** US 11.4  
**Traceability:** ACCS-003

---

## 🔔 EPIC 12: Notifications & Feedback

**Description:**  
Provides users with timely feedback through toast notifications, confirmation modals, loading states, and graceful error handling.

**Business Goal:**  
Keep users informed about system actions and provide clear feedback to improve user confidence and reduce confusion.

**Associated PRD Features:** FDBK-001, FDBK-002, FDBK-003, FDBK-004

---

### User Story 12.1: Toast Notifications

**Story:**  
As a User  
I want to see non-blocking notifications for important events  
So that I'm informed about the results of my actions without interruption

**Acceptance Criteria:**

**Success Toasts:**
- **Given** a user completes a successful action (save job, apply, update profile)
- **When** the action completes
- **Then** a green toast notification appears at the top-right
- **And** it shows a checkmark icon and success message
- **And** it auto-dismisses after 3 seconds

**Error Toasts:**
- **Given** an action fails (network error, validation error)
- **When** the error occurs
- **Then** a red toast notification appears
- **And** it shows an error icon and descriptive message
- **And** it persists until manually dismissed (for critical errors)

**Info Toasts:**
- **Given** information needs to be communicated
- **When** triggered
- **Then** a blue toast appears with an info icon

**Multiple Toasts:**
- **Given** multiple toasts are triggered
- **When** they appear
- **Then** they stack vertically with newest at the top
- **And** they don't overlap

**Priority:** P1  
**Story Points:** 3  
**Dependencies:** None  
**Traceability:** FDBK-001

---

### User Story 12.2: Confirmation Modals

**Story:**  
As a User  
I want to confirm destructive actions before they happen  
So that I can prevent accidental data loss

**Acceptance Criteria:**

**Delete Confirmation:**
- **Given** a user attempts to delete something (job, application, chat)
- **When** they click delete
- **Then** a modal appears with:
  - Warning icon
  - Title: "Are you sure?"
  - Description of consequences
  - "Cancel" and "Confirm Delete" buttons

**Unsave Confirmation:**
- **Given** a user tries to unsave a job
- **When** they click the action
- **Then** a modal asks: "Remove from saved jobs?"
- **And** options: "Keep" and "Remove"

**Modal Behavior:**
- **Given** a confirmation modal is open
- **When** the user clicks outside the modal or presses Escape
- **Then** the modal closes without action (cancel)

**Priority:** P1  
**Story Points:** 3  
**Dependencies:** None  
**Traceability:** FDBK-002

---

### User Story 12.3: Loading States (Skeleton Loaders)

**Story:**  
As a User  
I want to see loading indicators while content loads  
So that I know the system is working and the page isn't broken

**Acceptance Criteria:**

**Skeleton Cards:**
- **Given** job listings are loading
- **When** the page renders
- **Then** skeleton placeholder cards appear in the layout
- **And** they pulse with an animation to indicate loading

**Skeleton Variants:**
- **Given** different content types load
- **When** skeletons are displayed
- **Then** appropriate skeleton patterns appear:
  - Job cards: title bar, lines for description, circle for logo
  - Profile: circular avatar, multiple text lines
  - Charts: placeholder chart shapes

**Content Replacement:**
- **Given** skeleton loaders are visible
- **When** actual content loads
- **Then** skeletons fade out and real content fades in
- **And** the transition is smooth (no layout shift)

**Timeout Handling:**
- **Given** content takes longer than 10 seconds to load
- **When** the timeout occurs
- **Then** the skeleton is replaced with an error state
- **And** a "Retry" button appears

**Priority:** P1  
**Story Points:** 3  
**Dependencies:** None  
**Traceability:** FDBK-003

---

### User Story 12.4: Error Handling & Recovery

**Story:**  
As a User  
I want clear error messages with recovery actions  
So that I understand what went wrong and how to fix it

**Acceptance Criteria:**

**API Error Display:**
- **Given** an API request fails
- **When** the error occurs
- **Then** an error message appears explaining what happened
- **And** where applicable, a "Retry" or "Go Back" action is provided

**Network Error:**
- **Given** the user's internet connection is lost
- **When** they try to perform an action
- **Then** they see: "Connection lost. Please check your internet and try again."
- **And** a "Retry" button attempts the action again

**404 Page:**
- **Given** a user navigates to a non-existent page
- **When** the 404 error occurs
- **Then** they see a friendly "Page not found" message
- **And** links to: Home, Browse Jobs, Contact Support

**Server Error (500):**
- **Given** a server error occurs
- **When** the error page loads
- **Then** they see: "Something went wrong on our end. We're working to fix it."
- **And** a "Refresh Page" button
- **And** a link to contact support

**Form Errors:**
- **Given** a form submission has validation errors
- **When** the response returns
- **Then** inline errors appear next to the problematic fields
- **And** the first error field receives focus

**Priority:** P1  
**Story Points:** 5  
**Dependencies:** None  
**Traceability:** FDBK-004

---

## 🚀 Sprint Planning Suggestions

### Sprint 1 (Weeks 1-2): Foundation & Authentication
**Theme:** Core Infrastructure & User Access
**Total Story Points:** 29

| Story ID | User Story | Points | Priority |
|----------|------------|--------|----------|
| US 1.1 | Job Seeker Registration | 5 | P0 |
| US 1.2 | Employer Registration | 5 | P0 |
| US 1.3 | User Login & Logout | 5 | P0 |
| US 1.5 | Password Security | 3 | P0 |
| US 1.8 | Protected Route Guard | 3 | P0 |
| US 12.1 | Toast Notifications | 3 | P1 |
| US 12.3 | Loading States | 3 | P1 |
| US 1.7 | CORS & Security Headers | 2 | P1 |

**Sprint Goal:** Enable users to register, login, and access protected routes with basic feedback systems in place.

**Key Deliverables:**
- Authentication system fully functional
- JWT implementation with security
- Toast and loading state components
- Route protection middleware

---

### Sprint 2 (Weeks 3-4): Job Discovery
**Theme:** Job Search & Discovery Experience
**Total Story Points:** 26

| Story ID | User Story | Points | Priority |
|----------|------------|--------|----------|
| US 6.1 | Create Job Posting | 5 | P0 |
| US 2.1 | Full-Text Job Search | 5 | P0 |
| US 2.2 | Location Filtering | 3 | P0 |
| US 2.3 | Job Type Filtering | 3 | P0 |
| US 2.6 | Job Details View | 5 | P0 |
| US 2.5 | Job List Pagination | 3 | P1 |
| US 2.8 | Empty State & No Results | 2 | P1 |

**Sprint Goal:** Enable employers to post jobs and job seekers to discover them through search and filtering.

**Key Deliverables:**
- Job posting functionality (Employer)
- Job search with filters (Job Seeker)
- Job details page with company info
- Pagination and empty states

---

### Sprint 3 (Weeks 5-6): Applications & Saved Jobs
**Theme:** Core Application Workflow
**Total Story Points:** 26

| Story ID | User Story | Points | Priority |
|----------|------------|--------|----------|
| US 3.1 | One-Click Job Application | 5 | P0 |
| US 3.2 | Application Status Tracking | 5 | P0 |
| US 3.4 | Employer Application Review | 5 | P0 |
| US 3.5 | Application Status Updates | 5 | P0 |
| US 4.1 | Save Job for Later | 3 | P0 |
| US 4.2 | Unsave Job | 3 | P0 |

**Sprint Goal:** Complete the core application flow allowing job seekers to apply and employers to manage applications.

**Key Deliverables:**
- One-click apply system
- Application tracking dashboard
- Employer applicant review interface
- Status update workflow
- Save/unsave jobs functionality

---

### Sprint 4 (Weeks 7-8): Saved Jobs Page & Real-time Chat Infrastructure
**Theme:** Enhanced UX & Communication Foundation
**Total Story Points:** 26

| Story ID | User Story | Points | Priority |
|----------|------------|--------|----------|
| US 4.3 | Saved Jobs Management Page | 5 | P0 |
| US 4.4 | Auth Guard for Save Feature | 2 | P1 |
| US 5.1 | Socket.io Infrastructure Setup | 5 | P0 |
| US 5.2 | Room-Based Chat Initialization | 5 | P0 |
| US 5.3 | Real-time Messaging | 8 | P0 |
| US 3.3 | Applied Jobs List Page | 3 | P1 |

**Sprint Goal:** Complete saved jobs functionality and establish real-time chat infrastructure.

**Key Deliverables:**
- Saved jobs management page
- Socket.io server and client setup
- Room-based chat system
- Real-time messaging capability

---

### Sprint 5 (Weeks 9-10): Chat Completion & Employer Tools
**Theme:** Communication & Employer Experience
**Total Story Points:** 28

| Story ID | User Story | Points | Priority |
|----------|------------|--------|----------|
| US 5.4 | Chat History Persistence | 5 | P0 |
| US 5.5 | Chat Access from Application Views | 3 | P1 |
| US 6.2 | Edit Job Posting | 5 | P0 |
| US 6.3 | Delete Job Posting | 5 | P0 |
| US 6.4 | View Posted Jobs List | 5 | P0 |
| US 6.5 | Employer Profile Management | 5 | P1 |
| US 12.2 | Confirmation Modals | 3 | P1 |

**Sprint Goal:** Complete chat functionality and enhance employer job management capabilities.

**Key Deliverables:**
- Full chat with history persistence
- Job editing and deletion
- Employer job listings management
- Employer profile with logo upload

---

### Sprint 6 (Weeks 11-12): Admin Panel & Analytics
**Theme:** Platform Management & Insights
**Total Story Points:** 28

| Story ID | User Story | Points | Priority |
|----------|------------|--------|----------|
| US 9.1 | Admin Authentication | 3 | P1 |
| US 9.2 | Platform Statistics Dashboard | 5 | P1 |
| US 9.3 | User Management | 5 | P1 |
| US 9.4 | Employer Management | 5 | P1 |
| US 9.5 | Job Moderation | 5 | P1 |
| US 7.1 | Applications Over Time Chart | 5 | P1 |

**Sprint Goal:** Build admin capabilities for platform oversight and employer analytics.

**Key Deliverables:**
- Admin panel with authentication
- Platform statistics dashboard
- User/employer management interfaces
- Job moderation capabilities
- Employer analytics chart

---

### Sprint 7 (Weeks 13-14): Reviews, Profiles & Polish
**Theme:** Social Features & User Profiles
**Total Story Points:** 27

| Story ID | User Story | Points | Priority |
|----------|------------|--------|----------|
| US 8.1 | Submit Company Review | 5 | P1 |
| US 8.2 | View Company Reviews | 5 | P1 |
| US 8.3 | Reviews on Job Details | 3 | P1 |
| US 10.1 | Job Seeker Profile View | 3 | P1 |
| US 10.2 | Job Seeker Profile Editing | 8 | P1 |
| US 10.3 | Employer Profile View & Edit | 5 | P1 |

**Sprint Goal:** Add company reviews system and complete user profile management.

**Key Deliverables:**
- Company review submission and display
- Review integration on job details
- Job seeker and employer profile management
- Work experience, education, skills management

---

### Sprint 8 (Weeks 15-16): Analytics, Admin & UX Polish
**Theme:** Analytics Completion & Final Polish
**Total Story Points:** 26

| Story ID | User Story | Points | Priority |
|----------|------------|--------|----------|
| US 7.2 | Job Postings Summary | 5 | P1 |
| US 7.3 | Recent Activity Feed | 5 | P1 |
| US 7.4 | Dashboard Overview Page | 5 | P1 |
| US 9.6 | Account Status Toggle | 5 | P1 |
| US 2.4 | Job Sorting Options | 3 | P1 |
| US 2.7 | Active Filter Badges | 2 | P1 |
| US 1.4 | Session Management | 3 | P1 |

**Sprint Goal:** Complete employer analytics dashboard and final UX enhancements.

**Key Deliverables:**
- Full employer analytics dashboard
- Account suspension/activation
- Sorting and filter badges
- Session expiration handling

---

### Sprint 9 (Weeks 17-18): Theme & Accessibility
**Theme:** Accessibility & Theming
**Total Story Points:** 23

| Story ID | User Story | Points | Priority |
|----------|------------|--------|----------|
| US 11.1 | Dark Mode Toggle | 3 | P2 |
| US 11.2 | Theme Preference Persistence | 2 | P2 |
| US 11.3 | ARIA Labels & Screen Reader Support | 5 | P2 |
| US 11.4 | Keyboard Navigation | 5 | P2 |
| US 11.5 | Focus Management | 3 | P2 |
| US 12.4 | Error Handling & Recovery | 5 | P1 |

**Sprint Goal:** Implement theming and full accessibility compliance.

**Key Deliverables:**
- Dark/light mode with persistence
- Full ARIA label coverage
- Keyboard navigation throughout
- Focus management
- Comprehensive error handling

---

### Sprint 10 (Weeks 19-20): Admin Features & Final Polish
**Theme:** Admin Completion & Release Preparation
**Total Story Points:** 16

| Story ID | User Story | Points | Priority |
|----------|------------|--------|----------|
| US 9.7 | Grant/Revoke Admin Privileges | 3 | P2 |
| US 10.4 | Admin Profile Editing | 3 | P2 |
| US 5.6 | Chat Deletion | 3 | P2 |
| US 5.7 | Message Read Status | 3 | P2 |
| US 3.6 | Application Status Notifications | 3 | P2 |
| US 6.6 | Duplicate Job Prevention | 3 | P1 |
| US 1.6 | Account Suspension (Admin) | 5 | P1 |

**Sprint Goal:** Complete admin features, chat enhancements, and prepare for release.

**Key Deliverables:**
- Admin privilege management
- Admin profile editing
- Chat deletion and read receipts
- Status notifications
- Final bug fixes and polish

---

## 🔗 Dependencies Summary

### Critical Path Dependencies

```
EPIC-001 (Auth) 
    ├── EPIC-002 (Search)
    │   └── EPIC-003 (Applications)
    │       ├── EPIC-004 (Saved Jobs)
    │       ├── EPIC-005 (Chat)
    │       └── EPIC-008 (Reviews)
    ├── EPIC-006 (Employer Tools)
    │   ├── EPIC-007 (Analytics)
    │   └── EPIC-003 (Applications)
    ├── EPIC-009 (Admin)
    └── EPIC-010 (Profiles)
```

### Cross-Epic Dependencies

| Story | Depends On | Impact if Blocked |
|-------|------------|-------------------|
| US 3.1 (Apply) | US 2.6 (Job Details) | Cannot apply without job view |
| US 5.2 (Chat Rooms) | US 3.1 (Apply) | No applications = no chat rooms |
| US 7.1 (Analytics) | US 3.4 (Applicant Review) | No data to chart |
| US 8.1 (Reviews) | US 3.1 (Apply) | Can only review after applying |
| US 9.x (Admin) | US 1.3 (Login) | Cannot access admin without auth |

---

## 📊 Definition of Done

A User Story is considered **Done** when ALL of the following criteria are met:

### Code Quality
- [ ] Code is written and follows project style guidelines (ESLint passing)
- [ ] Code is reviewed and approved by at least one team member
- [ ] No console errors or warnings
- [ ] No TODO comments left in code

### Testing
- [ ] Unit tests written with minimum 80% coverage
- [ ] Integration tests passing for API endpoints
- [ ] Manual testing completed on target browsers
- [ ] Accessibility testing completed (keyboard navigation, screen reader)

### Acceptance Criteria
- [ ] All acceptance criteria from the story are met
- [ ] Happy path tested and working
- [ ] Edge cases handled appropriately
- [ ] Error states handled gracefully

### UI/UX
- [ ] UI matches design specifications
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Both light and dark themes render correctly
- [ ] Animations and transitions are smooth

### Documentation
- [ ] API documentation updated (if applicable)
- [ ] Component documentation updated (Storybook if used)
- [ ] README updated with any new environment variables

### Deployment
- [ ] Feature deployed to staging environment
- [ ] Smoke tests passing in staging
- [ ] No critical or high bugs open
- [ ] Product Owner acceptance obtained

---

## 📈 Velocity Planning

| Sprint | Points | Focus Area |
|--------|--------|------------|
| 1 | 29 | Foundation |
| 2 | 26 | Discovery |
| 3 | 26 | Applications |
| 4 | 26 | Chat & Saved Jobs |
| 5 | 28 | Employer Tools |
| 6 | 28 | Admin & Analytics |
| 7 | 27 | Reviews & Profiles |
| 8 | 26 | Analytics & Polish |
| 9 | 23 | Accessibility |
| 10 | 20 | Final Polish |

**Average Velocity:** 26 points/sprint  
**Total Points:** 285 (excluding future enhancements)

---

## 🎯 MVP Release Scope

### MVP Sprints: 1-6 (12 weeks)
**Stories Included:** All P0 and P1 stories
**Total Points:** ~180

**MVP Features:**
- ✅ User & Employer Authentication
- ✅ Job Search with Filters
- ✅ Job Details View
- ✅ One-Click Apply
- ✅ Application Tracking
- ✅ Employer Job Posting & Management
- ✅ Saved Jobs
- ✅ Real-time Chat (basic)
- ✅ Admin Panel (basic)
- ✅ Toast Notifications & Loading States

### Phase 2 Sprints: 7-8
**Stories Included:** Remaining P1 stories
- Company Reviews
- User Profiles
- Employer Analytics
- Admin Moderation Tools

### Phase 3 Sprints: 9-10
**Stories Included:** P2 stories
- Dark Mode
- Accessibility features
- Chat enhancements (read receipts, deletion)
- Advanced admin features

---

*This Agile Backlog is a living document. Updates should be tracked in version control and communicated to the team.*

**Document Version:** 1.0  
**Last Updated:** February 27, 2026  
**Next Review:** End of Sprint 1
