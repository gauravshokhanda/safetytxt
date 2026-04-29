# React Native + LearnPress: Auth + Course Completion Root Cause Report

## Scope
- App: React Native client in this repo
- Backend: LearnPress REST endpoints under `/wp-json/learnpress/v1/*`
- Symptom: Course completion works on website, but from mobile the course remains in `enrolled` state (UI shows “Continue”), and “Finish course” does not reliably become available / does not complete the course.

## Files Involved (Directly)
- Auth + token bootstrap
  - [login/index.js](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/login/index.js)
  - [index.js](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/index.js)
  - [reducers/user.js](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/reducers/user.js)
- API layer
  - [api/config.js](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/config.js)
  - [api/client.js](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js)
- Course details + “Continue” UI
  - [courses-details/index.js](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/courses-details/index.js)
- Learning flow (lesson/quiz complete + finish course)
  - [learning/index.js](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/learning/index.js)

## 1) Token Handling (Code Trace)

### Login response handling
- Login API call is made here: [login/index.js:L74-L137](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/login/index.js#L74-L137)
  - `const response = await Client.login(params);`
  - On success (`response?.token`):
    - `dispatch(saveUserToken(response.token))` persists token to redux
    - `dispatch(setUser(response))` stores user object
    - `setToken(response.token)` sets global API header

### Where JWT token is saved
- Token is stored in redux at `state.user.token` via reducer: [reducers/user.js:L29-L55](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/reducers/user.js#L29-L55)
  - `SAVE_USER_TOKEN` sets `token: action.token`

### Is `setToken(token)` called after login?
- Yes: [login/index.js:L94-L103](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/login/index.js#L94-L103)

### Is `setToken(savedToken)` called on app startup / restore / redux rehydrate?
- Yes:
  - Redux rehydrate hook: [index.js:L141-L155](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/index.js#L141-L155)
    - `const {user} = store.getState(); if (user?.token) setToken(user?.token);`
  - Also called inside notifications fetch if token exists: [index.js:L118-L139](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/index.js#L118-L139)

### Can API requests run before token is applied?
- In normal app startup, `PersistGate` runs `onBeforeLift` before rendering navigation tree: [index.js:L157-L186](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/index.js#L157-L186)
  - That means headers should have token before screens begin making requests after rehydrate.
- After login, `setToken()` is called immediately before subsequent protected calls (FCM register, getUser).

**Conclusion (Auth):** Token flow is present and should work. The root cause is not “token never set”. The more likely issue is missing parameters required by LearnPress for tracking progress/completion from mobile.

## 2) API Config Layer (Headers + Auth Presence)

### Where headers are built
- `HEADERS` is a module-global variable in [api/config.js](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/config.js)
  - Initialized with JSON headers
  - Mutated by `setToken(_token)` to add `Authorization: Bearer <token>`: [api/config.js:L238-L252](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/config.js#L238-L252)

### Confirm Authorization header is used for requests
- `config.get/post/put/delete/multipartPost` pass `headers: HEADERS` (or derived) into fetch.
  - Example GET: [api/config.js:L91-L130](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/config.js#L91-L130)
  - Example POST: [api/config.js:L132-L164](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/config.js#L132-L164)

### Are LearnPress protected endpoints called with auth headers?
- If `setToken()` has run, then yes (they all use `HEADERS`).
- To remove doubt, targeted logs were added (see “Suggested Logs / Debug” below) to print:
  - whether redux has `user.token`
  - safe headers (Authorization masked)
  - url + payload

**Conclusion (API headers):** The structure supports auth correctly, and we now log enough to verify at runtime.

## 3) LearnPress Course Completion Flow (Code Trace)

### Course details “Continue” button logic
- In CourseDetails bottom bar: if `course_data.status === 'enrolled'`, app shows “Continue” and progress %: [courses-details/index.js:L1237-L1310](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/courses-details/index.js#L1237-L1310)
- So if you still see “Continue”, backend is still returning the course as `enrolled` (not `finished`).

### Where Learning screen is opened (mobile learning flow entry)
- CourseDetails routes into LearningScreen with `idCourse`: [courses-details/index.js:L351-L359](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/courses-details/index.js#L351-L359)

### All code paths requested
- `finishCourse`:
  - API method: [api/client.js](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js) -> `finishCourse: POST /wp-json/learnpress/v1/courses/finish`
  - Triggered by UI button in Learning: [learning/index.js:L495-L546](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/learning/index.js#L495-L546)
  - **Critical gating:** Finish button is only shown if `data?.can_finish_course` is truthy: [learning/index.js:L800-L825](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/learning/index.js#L800-L825) and [learning/index.js:L1382-L1406](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/learning/index.js#L1382-L1406)
- `quizStart`:
  - API method: `POST /wp-json/learnpress/v1/quiz/start`
  - Triggered in Learning: [learning/index.js:L384-L421](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/learning/index.js#L384-L421)
- `quizFinish`:
  - API method: `POST /wp-json/learnpress/v1/quiz/finish`
  - Triggered in Learning: [learning/index.js:L452-L493](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/learning/index.js#L452-L493)
  - On success it only calls `reloadFinish()` (it does not call finishCourse automatically)
- `completeLesson`:
  - API method: `POST /wp-json/learnpress/v1/lessons/finish`
  - Triggered in Learning: [learning/index.js:L238-L264](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/learning/index.js#L238-L264)
- `retakeCourse`:
  - API method: `POST /wp-json/learnpress/v1/courses/retake`
  - Triggered in CourseDetails: [courses-details/index.js:L598-L614](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/courses-details/index.js#L598-L614)
- `courseDetail`:
  - API method: `GET /wp-json/learnpress/v1/courses/{id}` in [api/client.js](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js)
  - CourseDetails listens to `loadCourseDetail` event and refreshes: [courses-details/index.js:L74-L91](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/courses-details/index.js#L74-L91)

## 4) Root Cause (Why web works but mobile doesn’t)

### The exact bug
- The Learning screen was calling LearnPress lesson/quiz endpoints **without the `course_id` context**.
- In LearnPress mobile REST flows, endpoints commonly require `course_id` to:
  - mark a lesson as completed for the specific course enrollment
  - mark a quiz attempt as belonging to the course
  - compute `can_finish_course` correctly (which is used to show the “Finish course” button)

### What this breaks in mobile
- `data?.can_finish_course` may never become true because the lesson/quiz data is not tied to a specific course enrollment.
- Even if progress visually appears as 100% in CourseDetails, the server may not register the completion state for that enrollment, so:
  - `course_data.status` remains `enrolled`
  - CourseDetails keeps showing “Continue”
  - Certificates may be blocked server-side because the course is not finished

## 5) Fix Implemented (Minimal + Code-Trace Based)

### A) Pass `course_id` consistently through lesson/quiz completion flow
- Change: allow passing query params to `Client.lessonWithId()` and `Client.quiz()` so `course_id` can be included.
- Change: include `course_id` in all Learning requests that are course-context sensitive:
  - `Client.lessonWithId(lessonId, {course_id})`
  - `Client.quiz(quizId, {course_id})`
  - `Client.completeLesson({id: lessonId, course_id})`
  - `Client.quizStart({id: quizId, course_id})`
  - `Client.quizFinish({id: quizId, answered, course_id})`

Files changed:
- [api/client.js](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js)
- [learning/index.js](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/learning/index.js)

### B) Finish course call payload (already present)
- Finish course uses `POST /wp-json/learnpress/v1/courses/finish`
- Payload includes both `id` and `course_id`:
  - [learning/index.js:L495-L546](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/learning/index.js#L495-L546)

## 6) State Refresh After Finishing (What happens)
- On finish course success, Learning emits:
  - `loadCourseDetail` (CourseDetails refreshes course detail)
  - `loadMyCourse` (MyCourse refreshes list)
  - then navigates back
  - [learning/index.js:L528-L533](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/learning/index.js#L528-L533)

This is the correct refresh strategy, assuming finish actually updates the backend.

## 7) Suggested Logs / Debug (Added)

### What’s logged now
- For LearnPress GETs:
  - URL, params, masked headers, `hasToken`, `userId`
- For LearnPress POSTs:
  - URL, payload, masked headers, `hasToken`, `userId`
- For responses:
  - `finishCourse`, `completeLesson`, `quizStart`, `quizFinish` status + parsed response body

File:
- [api/config.js](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/config.js)

## 8) Why UI shows “Continue” (Direct reason)
- CourseDetails shows “Continue” when `course_data.status === 'enrolled'`:
  - [courses-details/index.js:L1239-L1269](file:///Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/courses-details/index.js#L1239-L1269)
- That means backend course detail is still returning `enrolled` instead of `finished`.
- The missing `course_id` in the Learning completion calls is the most direct, code-trace-supported reason the backend may not be finalizing the enrollment state from mobile.

## 9) Patch Summary (What changed)
- `Client.quiz()` and `Client.lessonWithId()` now accept optional params so we can send `course_id` as a query param.
- Learning screen now includes `course_id` in all lesson/quiz completion-related API calls.
- API layer now logs auth presence + request/response details for LearnPress endpoints to confirm whether Authorization is present and what payload is sent.

## 10) How to Verify
- Login, open a course, enter Learning.
- Complete a lesson, complete the final quiz, then finish course.
- Watch logs:
  - `POST learnpress url` for lesson/quiz finish should include payload with `course_id`
  - `GET learnpress url` for quiz/lesson fetch should include `course_id` param in URL
  - `POST finishCourse` should show `hasToken: true` and return `status: success`
- Return to course details:
  - course detail should now show `course_data.status: finished`
  - “Continue” should disappear (or be replaced by finished state)

