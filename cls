[33mcommit ce437c197af6d911e48c47d81f272d530f7dbf82[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m, [m[1;31morigin/HEAD[m[33m)[m
Merge: f3dd52c 1407daa
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Thu Sep 25 12:27:53 2025 +0530

    Merge pull request #80 from Pavan8396/fix-job-type-filter
    
    fix: Sanitize jobTypes parameter to prevent ReDoS

[33mcommit 1407daaede8d4209f12af1da91ef0db678db2c9a[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Thu Sep 25 06:57:19 2025 +0000

    fix: Sanitize jobTypes parameter to prevent ReDoS

[33mcommit f3dd52c3d2cb47a1a732e4d45089cfec561a6e41[m
Merge: 7fa7da3 b066473
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Thu Sep 25 11:43:47 2025 +0530

    Merge pull request #79 from Pavan8396/fix/cleanup-and-error-fixes
    
    Fix JSX error, remove console logs, and clean up redundant error mess…

[33mcommit b066473b835daf31b369785388d3c2f09209b29c[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Thu Sep 25 06:12:45 2025 +0000

    Fix JSX error, remove console logs, and clean up redundant error messages

[33mcommit 7fa7da35818407a2ab18f8e44fe2aff5a981c2f0[m
Author: Pavan <pavanumashankar8@gmail.com>
Date:   Thu Sep 25 11:18:53 2025 +0530

    frontend changes

[33mcommit efac6b2a59074d4771cac802422e0a1e9ab9e544[m
Merge: 41b82dc 76978bc
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Thu Sep 25 10:54:29 2025 +0530

    Merge pull request #78 from Pavan8396/feature/job-portal-improvements
    
    feat: Implement comprehensive features and bug fixes

[33mcommit 76978bcb703f5bc9ef239f00692c541a4b6461f2[m[33m ([m[1;31morigin/feature/job-portal-improvements[m[33m)[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Thu Sep 25 05:24:13 2025 +0000

    feat: Implement comprehensive features and bug fixes
    
    This commit introduces a wide range of features and bug fixes to improve the application's functionality and user experience.
    
    - **Applied Jobs Page**: A new page for job seekers to view all the jobs they have applied for.
    - **Employer Dashboard**: A revamped dashboard for employers with statistics on job applications and postings.
    - **Floating Chatbox**: The chat system has been refactored to use a floating chatbox that persists across sessions.
    - **Chat History**: Chat conversations are now saved to the database and can be retrieved at any time.
    - **Delete Chat History**: Users can now delete their chat history.
    - **Bug Fixes**:
      - Fixed a logout error that occurred on the chat screen.
      - Resolved inconsistencies in the user icon menu.
      - Fixed a bug where the chat partner's name was not displayed.
      - Addressed several other minor bugs and improved overall stability.

[33mcommit 41b82dc7ec0a6e5b4d9fab33f921be6b35dfdd66[m
Merge: 036265f e4dcefa
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Thu Sep 25 10:26:14 2025 +0530

    Merge pull request #77 from Pavan8396/feature/job-portal-improvements
    
    feat: Implement comprehensive features and bug fixes

[33mcommit e4dcefafe7709ee3de882a4950f860d1527a0b14[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Thu Sep 25 04:55:50 2025 +0000

    feat: Implement comprehensive features and bug fixes
    
    This commit introduces a wide range of features and bug fixes to improve the application's functionality and user experience.
    
    - **Applied Jobs Page**: A new page for job seekers to view all the jobs they have applied for.
    - **Employer Dashboard**: A revamped dashboard for employers with statistics on job applications and postings.
    - **Floating Chatbox**: The chat system has been refactored to use a floating chatbox that persists across sessions.
    - **Chat History**: Chat conversations are now saved to the database and can be retrieved at any time.
    - **Delete Chat History**: Users can now delete their chat history.
    - **Bug Fixes**:
      - Fixed a logout error that occurred on the chat screen.
      - Resolved inconsistencies in the user icon menu.
      - Fixed a bug where the chat partner's name was not displayed.
      - Addressed several other minor bugs and improved overall stability.

[33mcommit 036265fe8b8e80cf06a2a254b6af159a3fb0010a[m
Author: Pavan <pavanumashankar8@gmail.com>
Date:   Thu Sep 25 01:25:03 2025 +0530

    frontend changes

[33mcommit 0cc3ef5915ef6463e5eacd60d02bf515ff70f6a0[m
Merge: 97f6bf1 53751fe
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Thu Sep 25 01:18:59 2025 +0530

    Merge pull request #76 from Pavan8396/feature/job-portal-improvements
    
    fix: Final implementation of all features and fixes

[33mcommit 53751feb2375a15919bb69c96a470a728e1b8ef8[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 19:48:30 2025 +0000

    fix: Final implementation of all features and fixes
    
    This commit includes the final, stable implementation of all requested features and bug fixes.
    
    - **Chat System**: The chat system is now a full page-based application. It correctly persists conversations across sessions, displays the chat partner's name, and allows for chat history deletion. All known bugs have been resolved.
    - **Applied Jobs Page**: The 'Applied Jobs' page for job seekers has been re-implemented.
    - **User Icon Menu**: The inconsistency in the employer's user icon menu has been fixed.
    - **Dashboard Improvements**: The employer dashboard has been enhanced with charts and a list of recent applications.
    - **User Details Fetching**: The bug related to fetching user details from the wrong collection has been fixed.
    - **Syntax Error Fix**: A syntax error in Navbar.jsx has been fixed.

[33mcommit 97f6bf17fe06d18aebb49b36132fa8c8761cf9fa[m
Merge: 35ae1db ab8b072
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Thu Sep 25 01:07:41 2025 +0530

    Merge pull request #75 from Pavan8396/feature/job-portal-improvements
    
    fix: Final implementation of all features and fixes

[33mcommit ab8b072b47700241438c3767eb0c630e02c2492a[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 19:37:22 2025 +0000

    fix: Final implementation of all features and fixes
    
    This commit includes the final, stable implementation of all requested features and bug fixes.
    
    - **Chat System**: The chat system is now a full page-based application. It correctly persists conversations across sessions, displays the chat partner's name, and allows for chat history deletion. All known bugs have been resolved.
    - **Applied Jobs Page**: The 'Applied Jobs' page for job seekers has been re-implemented.
    - **User Icon Menu**: The inconsistency in the employer's user icon menu has been fixed.
    - **Dashboard Improvements**: The employer dashboard has been enhanced with charts and a list of recent applications.
    - **User Details Fetching**: The bug related to fetching user details from the wrong collection has been fixed.

[33mcommit 35ae1db576f1736588d4486a6f24ec0d02722566[m
Merge: df75d23 94b3f1a
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 23:53:01 2025 +0530

    Merge pull request #74 from Pavan8396/feature/job-portal-improvements
    
    fix: Final implementation of all features and fixes

[33mcommit 94b3f1a446f2f50058f10f802ee34f3a9f00a015[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 18:22:31 2025 +0000

    fix: Final implementation of all features and fixes
    
    This commit includes the final, stable implementation of all requested features and bug fixes.
    
    - **Chat System**: The chat system is now fully persistent. Messages are saved to the database and loaded when a chat is opened. The UI is a persistent, floating chatbox that displays the chat partner's name and has a delete option. All known bugs, including the logout error, history loading issue, and the user details fetching error, have been resolved.
    - **Applied Jobs Page**: The 'Applied Jobs' page for job seekers has been re-implemented.
    - **User Icon Menu**: The inconsistency in the employer's user icon menu has been fixed.
    - **Dashboard Improvements**: The employer dashboard has been enhanced with charts and a list of recent applications.

[33mcommit df75d236d6963e6e5e92e2e3831862184abc344a[m
Merge: 1d3f5a0 da509e4
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 23:27:11 2025 +0530

    Merge pull request #73 from Pavan8396/feature/job-portal-improvements
    
    fix: Final implementation of all features and fixes

[33mcommit da509e4d9f385bfa2d15f701e1bedaacf6fa5c4c[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 17:56:51 2025 +0000

    fix: Final implementation of all features and fixes
    
    This commit includes the final, stable implementation of all requested features and bug fixes.
    
    - **Chat System**: The chat system is now fully persistent. Messages are saved to the database and loaded when a chat is opened. The UI is a persistent, floating chatbox that displays the chat partner's name and has a delete option. All known bugs have been resolved.
    - **Applied Jobs Page**: The 'Applied Jobs' page for job seekers has been re-implemented.
    - **User Icon Menu**: The inconsistency in the employer's user icon menu has been fixed.
    - **Dashboard Improvements**: The employer dashboard has been enhanced with charts and a list of recent applications.

[33mcommit 1d3f5a07b50aa93815047fd27a555f72c8eeef66[m
Merge: e4b1268 c54983d
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 23:00:37 2025 +0530

    Merge pull request #72 from Pavan8396/feature/job-portal-improvements
    
    fix: Final fixes for chat persistence and UI

[33mcommit c54983d5199c1d98a9115a278b73d105854a704a[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 17:29:50 2025 +0000

    fix: Final fixes for chat persistence and UI
    
    This commit provides the definitive fixes for all outstanding issues.
    
    - **Chat Persistence**: The chat system now correctly persists conversations across sessions. Messages are saved to the database and loaded when a chat is opened. A race condition that prevented history from loading after a re-login has been resolved by making the `ChatContext`'s connection logic more robust and dependent on the authentication state.
    - **User Icon Menu**: The inconsistency in the employer's user icon menu has been fixed by removing redundant links.
    - **Applied Jobs Page**: This commit also re-implements the 'Applied Jobs' page, which was lost in a previous reset.

[33mcommit e4b12686af71c75e856ae0ed0df519cf640a0356[m
Merge: 0d022c9 658f931
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 22:43:21 2025 +0530

    Merge pull request #71 from Pavan8396/feature/job-portal-improvements
    
    fix: Final implementation of all features and fixes

[33mcommit 658f931c419a42d953d06eae090248c0b1d6c45a[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 17:12:58 2025 +0000

    fix: Final implementation of all features and fixes
    
    This commit includes the final, stable implementation of all requested features and bug fixes.
    
    - **Chat System**: The chat system is now fully persistent. Messages are saved to the database and loaded when a chat is opened. The UI is a persistent, floating chatbox. All known bugs, including the logout error and history loading issue, have been resolved.
    - **Applied Jobs Page**: The 'Applied Jobs' page for job seekers has been implemented, including the necessary backend endpoint and frontend components.
    - **User Icon Menu**: The inconsistency in the employer's user icon menu has been fixed by removing redundant links.
    - **Dashboard Improvements**: The employer dashboard has been enhanced with charts for applications over time and job postings by type, as well as a list of recent applications.

[33mcommit 0d022c953dca20f4e0ac697404fc1b510f763c36[m
Merge: a714eaf c826275
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 22:34:36 2025 +0530

    Merge pull request #70 from Pavan8396/feature/job-portal-improvements
    
    fix: Implement full chat persistence and restore features

[33mcommit c82627595f930fd161228f1e6322218a8fd73cef[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 17:04:03 2025 +0000

    fix: Implement full chat persistence and restore features
    
    This commit addresses several issues:
    - Implements true persistence for the chat feature by saving messages to the database and fetching the history. This ensures that chat conversations are no longer lost on page refresh or logout/login.
    - Restores the 'Applied Jobs' page feature, including the backend endpoint and the frontend page and navigation links.
    - Restores the fix for the user icon menu inconsistency by removing redundant links from the employer's user icon menu.
    - Implements the employer dashboard improvements with charts and a list of recent applications.

[33mcommit a714eaf7b1a2e1671270535e4c993e48614ca04c[m
Merge: f8ab8ba 58bbdc8
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 22:17:28 2025 +0530

    Merge pull request #69 from Pavan8396/feature/job-portal-improvements
    
    fix: Ensure chat history loads correctly after re-login

[33mcommit 58bbdc877f44d0547ca492c2c3210172e09c2275[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 16:46:32 2025 +0000

    fix: Ensure chat history loads correctly after re-login
    
    This commit fixes a bug where the chat history would fail to load after a user logged out and logged back in without a full page refresh.
    
    The root cause was a race condition where the `ChatContext` was not properly reacting to changes in the authentication token from the `AuthContext`.
    
    The fix involves:
    - Updating `ChatContext` to explicitly depend on the `token` from `AuthContext`.
    - Ensuring the socket connection is re-established with the new token on login.
    - Using the token from the context for API calls instead of reading directly from `sessionStorage`.
    
    This makes the chat system's state management more robust and ensures it always has the correct authentication details.

[33mcommit f8ab8ba5088c356724bf0e0410a882fc4f3a8a5f[m
Merge: 0355124 77334e5
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 22:06:26 2025 +0530

    Merge pull request #68 from Pavan8396/feature/job-portal-improvements
    
    fix: Implement full chat persistence

[33mcommit 77334e5f983e784c2938beed47e208cd599fc1be[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 16:36:01 2025 +0000

    fix: Implement full chat persistence
    
    This commit implements true persistence for the chat feature by saving messages to the database.
    
    The key changes include:
    - The backend socket server now saves every chat message to a `chats` collection in MongoDB.
    - A new API endpoint (`GET /api/chat/:roomId`) has been added to fetch the chat history for a given conversation.
    - The frontend `ChatContext` now calls this endpoint when a chat is opened, populating the chat window with the full conversation history.
    
    This ensures that chat conversations are no longer lost on page refresh or logout/login, providing a complete and robust chat experience.

[33mcommit 03551243c303fc5152da731c140fd24664712558[m
Merge: f6d3443 fbba20e
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 21:06:22 2025 +0530

    Merge pull request #67 from Pavan8396/feature/job-portal-improvements
    
    fix: Overhaul chat system for persistence and two-way communication

[33mcommit fbba20e55dec4734e27027950cb524e27016d840[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 15:34:40 2025 +0000

    fix: Overhaul chat system for persistence and two-way communication
    
    This commit completely refactors the chat system to address several critical bugs and improve user experience.
    
    The key changes include:
    - A new global `ChatContext` now manages the socket connection and all chat state, ensuring that conversations persist across page navigation.
    - The dedicated chat page has been replaced with a persistent, floating `Chatbox` component available on all pages.
    - The new `Chatbox` includes a close button and closes automatically on outside clicks.
    - The bug causing a logout error has been resolved by properly managing the socket lifecycle within the new context.
    - Chat initiation is now correctly implemented for both job seekers (from the job details page) and employers (from the applications list on the posted jobs page), enabling two-way communication.
    - The old, non-functional chat component and its route have been removed.

[33mcommit f6d34437ee04de6ce06b11997bb54ab8dc940938[m
Merge: ddc3875 f45244d
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 20:03:39 2025 +0530

    Merge pull request #66 from Pavan8396/feature/job-portal-improvements
    
    feat: Implement persistent chat system

[33mcommit f45244df5a4d9d2ad1fca695b4d0346f4b867848[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 14:33:04 2025 +0000

    feat: Implement persistent chat system
    
    This commit refactors the chat functionality to be more robust and user-friendly. It addresses three issues from the original request:
    - The logout error on the chat screen.
    - The lack of chat conversation persistence.
    - The poor chatbox close behavior.
    
    This has been achieved by:
    - Creating a global `ChatContext` to manage the socket connection and chat state, ensuring conversations persist across page navigation and the socket lifecycle is handled correctly.
    - Replacing the old page-based chat with a new, persistent `Chatbox` component that floats on all pages.
    - The new `Chatbox` component includes a close button and closes automatically when the user clicks outside of it.
    - The old `ChatPage.jsx` file has been removed to avoid code duplication and confusion.

[33mcommit ddc387536776cd356c1ce9d80e16e86fb8513176[m
Merge: d15241b 2b70886
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 19:42:28 2025 +0530

    Merge pull request #65 from Pavan8396/feature/job-portal-improvements
    
    feat: Implement 'Applied Jobs' page

[33mcommit 2b70886a7e63a8b3c308bfc2b826192a2d9ac150[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 14:11:30 2025 +0000

    feat: Implement 'Applied Jobs' page
    
    This commit introduces the 'Applied Jobs' page, allowing job seekers to view a list of jobs they have applied for.
    
    This is a full-stack implementation that includes:
    - A new backend API endpoint (`GET /api/user/applied-jobs`) to fetch the applied jobs for the authenticated user.
    - A new frontend page component (`AppliedJobs.jsx`) that calls this endpoint and displays the jobs.
    - Integration of the new page into the application's routing and navigation, with links in the user dropdown menu.

[33mcommit d15241bdf6a0fc7591f0b91b3b020da3dc97c308[m
Merge: a11b2e8 130f902
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 19:21:27 2025 +0530

    Merge pull request #64 from Pavan8396/feature/job-portal-improvements
    
    feat: Implement multiple features and bugfixes

[33mcommit 130f9021a05892d4a5e96408d6c802688c32704e[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 13:50:06 2025 +0000

    feat: Implement multiple features and bugfixes
    
    This commit addresses several issues and adds new features to the job portal application.
    
    - **Applied Jobs Page**: Implemented a new 'Applied Jobs' page for job seekers to view jobs they have applied to. This includes a new route, a page component, and a link in the navbar.
    - **Logout Error Fix**: Fixed a concurrent rendering error that occurred when a job seeker tried to log out from the chat screen. The issue was resolved by properly managing the socket.io connection lifecycle.
    - **Dashboard Improvements**: Enhanced the employer dashboard with new features, including charts for applications over time and job postings by type, and a list of recent applications.
    - **User Icon Menu Fix**: Removed redundant 'Dashboard' and 'Post A Job' links from the employer's user icon menu to improve UI consistency.
    - **Chat Persistence**: Implemented chat conversation persistence using a global `ChatContext`. Conversations now persist across page navigation.
    - **Chatbox Close Behavior**: Improved the chatbox close behavior by adding a close button and allowing the chatbox to close automatically when the user clicks outside of it.

[33mcommit a11b2e874ad5617dc5911edd48ea0053b9ee18ca[m
Merge: 21a24a9 007878a
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 17:44:25 2025 +0530

    Merge pull request #63 from Pavan8396/fix-delete-job-bug
    
    docs: Update README.md with comprehensive project documentation

[33mcommit 007878aab803d34784a232200f22d122b5f1c764[m[33m ([m[1;31morigin/fix-delete-job-bug[m[33m)[m
Merge: a23ac2e 21a24a9
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 17:44:16 2025 +0530

    Merge branch 'main' into fix-delete-job-bug

[33mcommit a23ac2e0131761395f0bc13d37b3c83563aca496[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 12:11:02 2025 +0000

    docs: Update README.md with comprehensive project documentation
    
    This commit updates the `README.md` file to provide a comprehensive overview of the project. The new README includes:
    - A detailed list of features for both job seekers and employers.
    - A complete technology stack for the frontend and backend.
    - Instructions on how to set up and run the project locally.
    - A list of all the API endpoints.

[33mcommit 21a24a9decfbbe89d1d62dd9bb80169f8e981d57[m
Author: Pavan <pavanumashankar8@gmail.com>
Date:   Wed Sep 24 14:26:59 2025 +0530

    frontend changes

[33mcommit 29a06701ebef2a3133fb16489e334a56c4993902[m
Merge: bdf9edf c1c7b68
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 14:02:20 2025 +0530

    Merge pull request #62 from Pavan8396/fix-delete-job-bug
    
    feat: Implement multiple features and bug fixes

[33mcommit c1c7b68438ddb5dd485e2272970387f58d5c8a2a[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 08:31:22 2025 +0000

    feat: Implement multiple features and bug fixes
    
    This commit includes the following changes as requested by the user:
    
    1.  **Fix Logout Error from Chat Screen:**
        -   Refactored the chat components (`Chat.jsx`, `ChatPage.jsx`) to use `useRef` for the socket instance. This prevents the socket from being re-initialized on re-renders and fixes the concurrent rendering error on logout.
    
    2.  **Improve 'Shortlisted Candidates' Page:**
        -   Refactored the 'Shortlisted Candidates' page to group candidates by job posting.
        -   The backend now uses an aggregation pipeline to return the candidates grouped by job.
        -   The frontend has been updated to display the data in the new grouped format.
    
    3.  **Create 'Applied Jobs' Page:**
        -   Implemented a new page where users can see all the jobs they have applied for.
        -   This includes a new backend endpoint and a new frontend page.
    
    4.  **Enhance Employer Dashboard:**
        -   Redesigned the employer dashboard to include graphs.
        -   Added two new backend endpoints to provide stats data for the graphs.
        -   The dashboard now displays a bar chart of applications over time and a pie chart of job postings by type.
    
    This commit also includes several other improvements and bug fixes that were identified during development, including:
    -   Fixing the "Users" collection name issue.
    -   Fixing the JWT `type` vs. `userType` inconsistency.
    -   Fixing the `deleteJob` functionality.
    -   Adding a comprehensive test suite for the backend.

[33mcommit bdf9edf4fb199c498024142824c3c5791ee11cee[m
Merge: 1655578 6a84cf5
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 13:24:29 2025 +0530

    Merge pull request #61 from Pavan8396/fix-delete-job-bug
    
    Fix delete job bug

[33mcommit 6a84cf5ab1b6157d1455a800dd3d66f600d849c8[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 07:53:47 2025 +0000

    feat: Implement multiple features and bug fixes
    
    This commit includes the following changes as requested by the user:
    
    1.  **Fix Logout Error from Chat Screen:**
        -   Refactored the chat components (`Chat.jsx`, `ChatPage.jsx`) to use `useRef` for the socket instance. This prevents the socket from being re-initialized on re-renders and fixes the concurrent rendering error on logout.
    
    2.  **Improve 'Shortlisted Candidates' Page:**
        -   Refactored the 'Shortlisted Candidates' page to group candidates by job posting.
        -   The backend now uses an aggregation pipeline to return the candidates grouped by job.
        -   The frontend has been updated to display the data in the new grouped format.
    
    3.  **Create 'Applied Jobs' Page:**
        -   Implemented a new page where users can see all the jobs they have applied for.
        -   This includes a new backend endpoint and a new frontend page.
    
    4.  **Enhance Employer Dashboard:**
        -   Redesigned the employer dashboard to include graphs.
        -   Added two new backend endpoints to provide stats data for the graphs.
        -   The dashboard now displays a bar chart of applications over time and a pie chart of job postings by type.
    
    This commit also includes several other improvements and bug fixes that were identified during development, including:
    -   Fixing the "Users" collection name issue.
    -   Fixing the JWT `type` vs. `userType` inconsistency.
    -   Fixing the `deleteJob` functionality.
    -   Adding a comprehensive test suite for the backend.

[33mcommit 1655578438137a3087dadbdaa52126b34f86ae08[m
Author: Pavan <pavanumashankar8@gmail.com>
Date:   Wed Sep 24 12:40:17 2025 +0530

    frontend changes

[33mcommit 066cbea7180c63858d987809aa31ced9d5374c4d[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 07:08:28 2025 +0000

    Fix: Explicitly set 'Users' collection name in userModel
    
    This commit fixes a bug where the application was writing to a new, incorrect `users` collection instead of the existing `Users` collection. This was caused by Mongoose defaulting to a pluralized and lowercased collection name.
    
    The fix explicitly sets the collection name to 'Users' in the `userModel.js` file, ensuring that all user data is stored and retrieved from the correct collection.

[33mcommit 212be735ce2b9805bfea35658d1f8ab2825bc7b8[m
Merge: dbb7d72 9c24ee4
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 11:41:01 2025 +0530

    Merge pull request #60 from Pavan8396/fix-delete-job-bug
    
    feat: Separate Shortlist and Chat buttons and add Shortlisted Candida…

[33mcommit 9c24ee4cc1f7a77188bc36306cd3209e340acba8[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 06:07:01 2025 +0000

    feat: Separate Shortlist and Chat buttons and add Shortlisted Candidates page
    
    This commit implements the following changes:
    - The "Shortlist" and "Chat" buttons on the Posted Jobs page are now separate. The "Chat" button is always visible, and the "Shortlist" button is only visible for non-shortlisted candidates.
    - A new page has been added for employers to view all their shortlisted candidates in one place.
    - A new backend endpoint has been created to support this new page.

[33mcommit dbb7d72cdfe8b9921685aaf880bc7a0b9497ccdf[m
Merge: d714564 d7a923e
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 10:53:28 2025 +0530

    Merge pull request #59 from Pavan8396/fix-delete-job-bug
    
    Fix: Prevent state update on unmounted chat component

[33mcommit d7a923e01cfdc3dcc054066733d436ca8f2dd261[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 05:21:39 2025 +0000

    Fix: Prevent state update on unmounted chat component
    
    This commit fixes a React rendering error that occurred when a user logged out from the chat screen. The error was caused by a state update being called on an unmounted component.
    
    The fix introduces a ref to track the mounted state of the chat component and prevents the state from being updated if the component is unmounted. This resolves the race condition and prevents the error.

[33mcommit d71456429f89af8aa3ef9451134076fdb890842a[m
Merge: c9acfd3 2442dc3
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 10:10:16 2025 +0530

    Merge pull request #58 from Pavan8396/fix-delete-job-bug
    
    Fix: Resolve view applicants bug and access regression

[33mcommit 2442dc3091f41fe3de35711719f083232df4ab37[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 04:39:29 2025 +0000

    Fix: Resolve view applicants bug and access regression
    
    This commit addresses several issues:
    - Fixes a bug that prevented employers from seeing job applicants. This was caused by an inconsistent collection name for users and an issue with the `populate` function. The user model now explicitly sets the collection name to 'Users', and the `populate` call in `applicationController.js` now explicitly specifies the model.
    - Fixes a regression that prevented employers from accessing their own job postings. This was caused by an inconsistency in the JWT payload. The JWT payload for both users and employers now uses `userType`.
    - Improves the `deleteJob` functionality to also remove the job from the employer's `postedJobs` array.
    - Adds a comprehensive test suite to verify the fixes and prevent future regressions.

[33mcommit c9acfd3184a284cb4cbac7772be128a75045747f[m
Merge: a9d6e27 c7d09b9
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 09:57:45 2025 +0530

    Merge pull request #57 from Pavan8396/fix-delete-job-bug
    
    Fix: Correct JWT payload for employer login

[33mcommit c7d09b9a6a986fc57918ffef38d04e7aa951b63c[m
Author: google-labs-jules[bot] <161369871+google-labs-jules[bot]@users.noreply.github.com>
Date:   Wed Sep 24 04:27:02 2025 +0000

    Fix: Correct JWT payload for employer login
    
    A previous commit introduced a regression that prevented employers from accessing their own job postings. This was due to an inconsistency between the JWT payload generated at login and the check performed in the `isEmployer` middleware.
    
    This commit fixes the regression by changing the JWT payload to use `userType: 'employer'` instead of `type: 'employer'`, aligning it with the middleware.

[33mcommit a9d6e274018c3b9aa9a26ad7e9cbe635c85bc134[m
Merge: bc8d129 8130ee7
Author: Pavan8396 <115888049+Pavan8396@users.noreply.github.com>
Date:   Wed Sep 24 09:50:20 2025 +0530

    Merge pull request #56 from Pavan8396/fix-delete-job-bug
    
    Fix: Ensure employers can see job applicants
