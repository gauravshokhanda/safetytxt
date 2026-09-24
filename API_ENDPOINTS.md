# API Endpoints

This file is an inventory of the API calls used by the app code in `src/api/client.js` and the direct `fetch` calls found in screens.

Notes:
- Payloads below are based on actual call sites in the app.
- Response shapes are what the app expects or checks for, not always the full backend schema.
- `GET` requests usually also include an automatic cache-busting query param `v=<random>` unless the caller disables it.
- Authenticated requests rely on the shared `Authorization: Bearer <token>` header set through `setToken()`.

## Endpoint Matrix

| Source | Method | Endpoint | Auth | Payload / Query | Expected response |
|---|---|---|---|---|---|
| `src/api/client.js:4` | `POST` | `/wp-json/learnpress/v1/token` | No | `username`, `password` | `token`, `user_id`, auth fields |
| `src/api/client.js:6` | `POST` | `/wp-json/learnpress/v1/token/register` | No | `email`, `username`, `password`, `confirm_password`, `first_name`, `phone_number` | `token`, `user_id`, auth fields |
| `src/api/client.js:11` | `GET` | `/wp-json/learnpress/v1/courses` | No/Token | caller query params | `status`, `data` array |
| `src/api/client.js:19` | `GET` | `/wp-json/learnpress/v1/courses1` | No/Token | caller query params | `status`, `data` array |
| `src/api/client.js:27` | `GET` | `/wp-json/learnpress/v1/courses2` | No/Token | caller query params | `status`, `data` array |
| `src/api/client.js:36` | `GET` | `/wp-json/learnpress/v1/courses3?courses_id={id}` | No/Token | `courses_id` | `restrict` |
| `src/api/client.js:39` | `GET` | `/wp-json/learnpress/v1/courses/{id}` | No/Token | course id path param | `status`, `data.course_data`, `sections` |
| `src/api/client.js:46` | `POST` | `/wp-json/learnpress/v1/courses/finish` | Yes | `id`, `course_id` | `status`, `message` |
| `src/api/client.js:49` | `POST` | `/wp-json/learnpress/v1/courses/retake` | Yes | `id` | `status`, `message` |
| `src/api/client.js:52` | `POST` | `/wp-json/learnpress/v1/courses/enroll` | Yes | `id` | `status`, `message` |
| `src/api/client.js:55` | `POST` | `/wp-json/learnpress/v1/lessons/finish` | Yes | `id`, `course_id` | `status`, `message` |
| `src/api/client.js:58` | `GET` | `/wp-json/learnpress/v1/quiz/{id}` | Yes | quiz id path param, optional query params | quiz payload with `questions` |
| `src/api/client.js:61` | `POST` | `/wp-json/learnpress/v1/quiz/start` | Yes | `id`, `course_id` | `status`, `results.questions` |
| `src/api/client.js:63` | `POST` | `/wp-json/learnpress/v1/quiz/finish` | Yes | `id`, `answered`, `course_id` | `status`, `results` |
| `src/api/client.js:66` | `POST` | `/wp-json/learnpress/v1/quiz/retake` | Yes | quiz retake fields | `status`, `message` |
| `src/api/client.js:69` | `GET` | `/wp-json/learnpress/v1/users` | Yes | caller query params | `status`, `data` array |
| `src/api/client.js:71` | `GET` | `/wp-json/learnpress/v1/users/{id}` | Yes | user id path param | `data` user object |
| `src/api/client.js:73` | `POST multipart` | `/wp-json/learnpress/v1/users/{id}` | Yes | multipart form data | `status`, `message`, `data` |
| `src/api/client.js:82` | `GET` | `/wp-json/wp/v2/course_category` | No | caller query params | category list |
| `src/api/client.js:85` | `POST` | `/wp-json/learnpress/v1/wishlist/toggle` | Yes | wishlist fields, usually `id` | `status`, `message`, `data.in_wishlist` |
| `src/api/client.js:88` | `GET` | `/wp-json/learnpress/v1/wishlist` | Yes | caller query params | wishlist data |
| `src/api/client.js:91` | `GET` | `/wp-json/learnpress/v1/wishlist/course/{id}` | Yes | course id path param | `data.in_wishlist` |
| `src/api/client.js:94` | `GET` | `/wp-json/learnpress/v1/assignments/{id}` | Yes | assignment id path param | assignment details |
| `src/api/client.js:96` | `POST` | `/wp-json/learnpress/v1/assignments/start/` | Yes | `id` | `data.status`, `message` |
| `src/api/client.js:99` | `POST` | `/wp-json/learnpress/v1/assignments/retake/` | Yes | `id` | `data.status`, `message` |
| `src/api/client.js:102` | `POST multipart` | `/wp-json/learnpress/v1/assignments/submit/` | Yes | `action`, `id`, `note`, `file[]` | `data.status`, `message` |
| `src/api/client.js:105` | `POST` | `/wp-json/learnpress/v1/assignments/delete-submit-file/` | Yes | `fileId`, `id` | `data.status`, `message` |
| `src/api/client.js:122` | `GET` | `/wp-json/learnpress/v1/courses1` | No | fixed query params | `status`, `data` array |
| `src/api/client.js:136` | `GET` | `/wp-json/learnpress/v1/course_category` | No | `orderby=count`, `order=desc` | category list |
| `src/api/client.js:145` | `GET` | `/wp-json/learnpress/v1/review/course/{id}` | Yes | course id path param, optional query params | reviews + pagination |
| `src/api/client.js:148` | `POST` | `/wp-json/learnpress/v1/review/submit` | Yes | review fields | `status`, `message` |
| `src/api/client.js:151` | `POST` | `/wp-json/learnpress/v1/quiz/check_answer` | Yes | `id`, `question_id`, `answered` | `result`, `explanation`, optional `options` |
| `src/api/client.js:154` | `POST` | `/wp-json/learnpress/v1/users/reset-password` | No | `user_login` | `code`, `message` |
| `src/api/client.js:157` | `POST` | `/wp-json/learnpress/v1/users/change-password` | Yes | password change fields | `status`, `message` |
| `src/api/client.js:160` | `POST` | `/wp-json/learnpress/v1/courses/verify-receipt` | Yes | `receipt-data`, `is-ios`, `course-id` | `status`, `message` |
| `src/api/client.js:163` | `POST` | `/wp-json/learnpress/v1/users/delete` | Yes | delete-account fields | `status`, `message` |
| `src/api/client.js:166` | `GET` | `/wp-json/lp/v1/mobile-app/product-iap` | No | caller query params | array of product ids |
| `src/api/client.js:169` | `POST` | `/wp-json/learnpress/v1/push-notifications/register-device` | Yes | `device_token`, `device_type` | `status`, `message` |
| `src/api/client.js:174` | `POST` | `/wp-json/learnpress/v1/push-notifications/delete-device` | Yes | `device_token` | `status`, `message` |
| `src/api/client.js:179` | `GET` | `/wp-json/learnpress/notifications/v1/notifications` | Yes | caller query params | notifications data |
| `src/api/client.js:184` | `GET` | `/wp-json/custom-api/v2/get-certificate-url` | Yes | caller query params | `certificate_url` |
| `src/api/client.js:189` | `POST` | `/wp-json/custom-api/v1/finish-course` | No/Token | `course_id`, `user_id` | `status`, `message` |
| `src/screens/courses-details/index.js:225` | `GET` | `/wp-json/learnpress/v1/courses3?course_id={id}` | No/Token | `course_id` | `restrict` |
| `src/screens/courses-details/index.js:776` | `POST` | `/wp-json/custom-api/v2/get-certificate-url` | No/Token | `course_id`, `user_id` | `certificate_url`, `message` |

## Auth

### `POST /wp-json/learnpress/v1/token`
- Used by: `Client.login()`
- Payload:
```json
{
  "username": "string",
  "password": "string"
}
```
- Expected response:
```json
{
  "token": "string",
  "user_id": "number",
  "...": "other user/auth fields"
}
```
- App usage:
  - Checks `response.token`
  - Stores token and user object
  - On error, may inspect `response.code` for `incorrect_password` or `invalid_username`

### `POST /wp-json/learnpress/v1/token/register`
- Used by: `Client.register()`
- Payload:
```json
{
  "email": "string",
  "username": "string",
  "password": "string",
  "confirm_password": "string",
  "first_name": "string",
  "phone_number": "string"
}
```
- Expected response:
```json
{
  "token": "string",
  "user_id": "number",
  "...": "other user/auth fields"
}
```
- App usage:
  - Checks `response.token`
  - Otherwise shows `response.message`

## Courses

### `GET /wp-json/learnpress/v1/courses`
- Used by: `Client.course()`, `Client.topCoursesWithStudent()`
- Query params:
  - `Client.course(params)` forwards any params object
  - `Client.topCoursesWithStudent()` uses:
```json
{
  "popular": false,
  "restrict": "public"
}
```
- Expected response:
```json
{
  "status": "success",
  "data": ["array of courses"]
}
```
- App usage:
  - Treated as a course list response

### `GET /wp-json/learnpress/v1/courses1`
- Used by: `Client.Newcourse()`, `Client.newCourses()`
- Query params:
  - `Client.Newcourse(params)` forwards params
  - `Client.newCourses()` uses:
```json
{
  "order": "desc",
  "optimize": true,
  "status": "publish"
}
```
- Expected response:
```json
{
  "status": "success",
  "data": ["array of courses"]
}
```

### `GET /wp-json/learnpress/v1/courses2`
- Used by: `Client.Newcourse2()`
- Query params:
  - forwards any params object
- Expected response:
```json
{
  "status": "success",
  "data": ["array of courses"]
}
```
- App usage:
  - Response is logged for debugging

### `GET /wp-json/learnpress/v1/courses3?courses_id={id}`
- Used by: `Client.courseDetailNewRestrict()`
- Query params:
```json
{
  "courses_id": "number|string"
}
```
- Expected response:
```json
{
  "restrict": "string|null",
  "...": "other fields"
}
```
- App usage:
  - Direct screen call also uses a variant with `course_id`:
    - `GET https://safetytxt.com/wp-json/learnpress/v1/courses3?course_id={id}`
  - Screen reads `data.restrict`

### `GET /wp-json/learnpress/v1/courses/{id}`
- Used by: `Client.courseDetail()`, `Client.getOverview()`
- Query params:
  - `Client.getOverview(id)` adds:
```json
{
  "optimize": "intructor,meta_data,on_sale,count_students,can_finish,can_retake,ratake_count,rataken,duration,tags,categories,rating,price,origin_price,sale_price"
}
```
- Expected response:
```json
{
  "status": "success",
  "data": {
    "course_data": {
      "status": "string",
      "graduation": "string",
      "result": {
        "result": "number|string"
      }
    },
    "sections": ["array"],
    "...": "other course fields"
  }
}
```
- App usage:
  - Checks `course.data.course_data.status`
  - Checks `course.data.course_data.graduation`
  - Checks `course.data.course_data.result.result`

### `POST /wp-json/learnpress/v1/courses/finish`
- Used by: `Client.finishCourse()`
- Payload:
```json
{
  "id": "number|string",
  "course_id": "number|string"
}
```
- Expected response:
```json
{
  "status": "success",
  "message": "string"
}
```
- App usage:
  - The app has this method, but the newer flow uses `finishCourseCustom()`

### `POST /wp-json/custom-api/v1/finish-course`
- Used by: `Client.finishCourseCustom()`
- Payload:
```json
{
  "course_id": "number|string",
  "user_id": "number|string|null"
}
```
- Expected response:
```json
{
  "status": "success",
  "message": "string",
  "...": "other fields"
}
```
- App usage:
  - Checks `response.status === 'success'`
  - Shows `response.message`

### `POST /wp-json/learnpress/v1/courses/retake`
- Used by: `Client.retakeCourse()`
- Payload:
```json
{
  "id": "number|string"
}
```
- Expected response:
```json
{
  "status": "success",
  "message": "string"
}
```

### `POST /wp-json/learnpress/v1/courses/enroll`
- Used by: `Client.enroll()`
- Payload:
```json
{
  "id": "number|string"
}
```
- Expected response:
```json
{
  "status": "success",
  "message": "string"
}
```

### `POST /wp-json/learnpress/v1/courses/verify-receipt`
- Used by: `Client.verifyReceipt()`
- Payload:
```json
{
  "receipt-data": "string",
  "is-ios": "boolean",
  "course-id": "number|string"
}
```
- Expected response:
```json
{
  "status": "success",
  "message": "string"
}
```
- App usage:
  - Checks `verifyReceipt.status === 'success'`

## Lessons

### `GET /wp-json/learnpress/v1/lessons/{id}`
- Used by: `Client.lessonWithId()`
- Query params:
  - any optional params object passed by the caller
- Expected response:
```json
{
  "status": "success",
  "data": {
    "...": "lesson fields"
  }
}
```

### `GET /wp-json/learnpress/v1/lessons`
- Used by: `Client.lesson()`
- Query params:
  - any params object
- Expected response:
```json
{
  "status": "success",
  "data": ["array of lessons"]
}
```

### `POST /wp-json/learnpress/v1/lessons/finish`
- Used by: `Client.completeLesson()`
- Payload:
```json
{
  "id": "number|string",
  "course_id": "number|string"
}
```
- Expected response:
```json
{
  "status": "success",
  "message": "string"
}
```
- App usage:
  - Checks `response.status === 'success'`

## Quiz

### `GET /wp-json/learnpress/v1/quiz/{id}`
- Used by: `Client.quiz()`
- Query params:
  - optional params object
- Expected response:
```json
{
  "status": "success",
  "data": {
    "questions": ["array"],
    "...": "quiz fields"
  }
}
```

### `POST /wp-json/learnpress/v1/quiz/start`
- Used by: `Client.quizStart()`
- Payload:
```json
{
  "id": "number|string",
  "course_id": "number|string"
}
```
- Expected response:
```json
{
  "status": "success",
  "results": {
    "questions": ["array"],
    "checked_questions": ["array"]
  }
}
```
- App usage:
  - Checks `response.status === 'success'`
  - Uses `response.results.questions`

### `POST /wp-json/learnpress/v1/quiz/finish`
- Used by: `Client.quizFinish()`
- Payload:
```json
{
  "id": "number|string",
  "answered": "object",
  "course_id": "number|string"
}
```
- `answered` shape in app:
```json
{
  "questionId": "selected value or array of values"
}
```
- Expected response:
```json
{
  "status": "success",
  "results": {
    "...": "quiz results"
  }
}
```
- App usage:
  - Checks `response.status === 'success'`

### `POST /wp-json/learnpress/v1/quiz/retake`
- Used by: `Client.quizRetake()`
- Payload:
```json
{
  "...": "quiz retake fields"
}
```
- Expected response:
```json
{
  "status": "success",
  "message": "string"
}
```
- Note:
  - No in-app call site was found in the current scan, so the exact payload is not confirmed from usage.

### `POST /wp-json/learnpress/v1/quiz/check_answer`
- Used by: `Client.checkAnswer()`
- Payload:
```json
{
  "id": "number|string",
  "question_id": "number|string",
  "answered": "string|array|object"
}
```
- Expected response:
```json
{
  "result": "boolean|string",
  "explanation": "string|null",
  "options": ["array|null"],
  "code": "string|null",
  "message": "string|null"
}
```
- App usage:
  - Checks `response.code === 'cannot_check_answer'`
  - Uses `response.result`
  - Uses `response.explanation`
  - Optionally replaces current question options with `response.options`

## Users

### `GET /wp-json/learnpress/v1/users`
- Used by: `Client.allUser()`, `Client.getIntructor()`
- Query params:
  - any params object
- Expected response:
```json
{
  "status": "success",
  "data": ["array of users"]
}
```

### `GET /wp-json/learnpress/v1/users/{id}`
- Used by: `Client.getUser()`
- Expected response:
```json
{
  "status": "success",
  "data": {
    "...": "user fields"
  }
}
```

### `POST /wp-json/learnpress/v1/users/reset-password`
- Used by: `Client.resetEmail()`
- Payload:
```json
{
  "user_login": "string"
}
```
- Expected response:
```json
{
  "code": "success|error",
  "message": "string"
}
```
- App usage:
  - Checks `response.code === 'success'`

### `POST /wp-json/learnpress/v1/users/change-password`
- Used by: `Client.changePassword()`
- Payload:
```json
{
  "...": "password change fields"
}
```
- Expected response:
```json
{
  "status": "success",
  "message": "string"
}
```
- Note:
  - No concrete call site was found during this scan, so payload shape is not fully confirmed.

### `POST /wp-json/learnpress/v1/users/delete`
- Used by: `Client.deleteAccount()`
- Payload:
```json
{
  "...": "delete-account fields"
}
```
- Expected response:
```json
{
  "status": "success",
  "message": "string"
}
```
- Note:
  - Call site exists, but the exact payload varies by backend implementation.

### `POST /wp-json/learnpress/v1/users/{id}` with `multipart/form-data`
- Used by: `Client.updateUser()`
- Body:
  - multipart form data
- Expected response:
```json
{
  "status": "success",
  "message": "string",
  "data": {
    "...": "updated user fields"
  }
}
```

## Wishlist

### `POST /wp-json/learnpress/v1/wishlist/toggle`
- Used by: `Client.addRemoveWishlist()`
- Payload:
```json
{
  "...": "wishlist toggle fields"
}
```
- Expected response:
```json
{
  "status": "success",
  "message": "string",
  "data": {
    "in_wishlist": "yes|no"
  }
}
```

### `GET /wp-json/learnpress/v1/wishlist`
- Used by: `Client.getWishlist()`
- Query params:
  - any params object
- Expected response:
```json
{
  "status": "success",
  "data": ["array of wishlist items"]
}
```

### `GET /wp-json/learnpress/v1/wishlist/course/{id}`
- Used by: `Client.getWishlistWithId()`
- Expected response:
```json
{
  "status": "success",
  "data": {
    "in_wishlist": "yes|no"
  }
}
```

## Reviews

### `GET /wp-json/learnpress/v1/review/course/{id}`
- Used by: `Client.getReview()`
- Query params:
  - optional params object, commonly `{ per_page: 3 }`
- Expected response:
```json
{
  "status": "success",
  "message": "string",
  "data": {
    "reviews": {
      "reviews": ["array"],
      "paged": "number",
      "pages": "number"
    },
    "total": "number"
  }
}
```

### `POST /wp-json/learnpress/v1/review/submit`
- Used by: `Client.createReview()`
- Payload:
```json
{
  "...": "review fields such as course id, title, content, rating"
}
```
- Expected response:
```json
{
  "status": "success",
  "message": "string"
}
```

## Assignments

### `GET /wp-json/learnpress/v1/assignments/{id}`
- Used by: `Client.getAssignment()`
- Expected response:
```json
{
  "name": "string",
  "duration": {
    "format": "string"
  },
  "files_amount": "number",
  "passing_grade": "number",
  "introdution": "string",
  "can_finish_course": "boolean",
  "results": {
    "status": "string"
  },
  "assignment_answer": {
    "note": "string",
    "file": "object"
  },
  "attachment": ["array"]
}
```

### `POST /wp-json/learnpress/v1/assignments/start/`
- Used by: `Client.startAssignment()`
- Payload:
```json
{
  "id": "number|string"
}
```
- Expected response:
```json
{
  "data": {
    "status": 200
  },
  "message": "string"
}
```

### `POST /wp-json/learnpress/v1/assignments/retake/`
- Used by: `Client.retakeAssignment()`
- Payload:
```json
{
  "id": "number|string"
}
```
- Expected response:
```json
{
  "data": {
    "status": 200
  },
  "message": "string"
}
```

### `POST /wp-json/learnpress/v1/assignments/submit/`
- Used by: `Client.saveSendAssignment()`
- Body:
  - `multipart/form-data`
- App-built form fields:
```json
{
  "action": "save|submit",
  "id": "number|string",
  "note": "string",
  "file[]": ["file objects"]
}
```
- Expected response:
```json
{
  "data": {
    "status": 200
  },
  "message": "string"
}
```

### `POST /wp-json/learnpress/v1/assignments/delete-submit-file/`
- Used by: `Client.deleteFileAssignment()`
- Payload:
```json
{
  "fileId": "number|string",
  "id": "number|string"
}
```
- Expected response:
```json
{
  "data": {
    "status": 200
  },
  "message": "string"
}
```

## Push Notifications

### `POST /wp-json/learnpress/v1/push-notifications/register-device`
- Used by: `Client.registerFCMToken()`
- Payload:
```json
{
  "device_token": "string",
  "device_type": "ios|android"
}
```
- Expected response:
```json
{
  "status": "success",
  "message": "string"
}
```

### `POST /wp-json/learnpress/v1/push-notifications/delete-device`
- Used by: `Client.deleteFCMToken()`
- Payload:
```json
{
  "device_token": "string"
}
```
- Expected response:
```json
{
  "status": "success",
  "message": "string"
}
```

## Notifications

### `GET /wp-json/learnpress/notifications/v1/notifications`
- Used by: `Client.getNotifications()`
- Query params:
  - any params object
- Expected response:
```json
{
  "status": "success",
  "data": ["array of notifications"]
}
```

## In-App Purchase

### `GET /wp-json/lp/v1/mobile-app/product-iap`
- Used by: `Client.getProductIAP()`
- Query params:
  - any params object
- Expected response:
```json
[
  "array of product SKU ids"
]
```
- App usage:
  - If response is an array, it is stored and used for IAP product fetch

## Certificates

### `GET /wp-json/custom-api/v2/get-certificate-url`
- Used by: `Client.getCertificates()`
- Query params:
  - any params object
- Expected response:
```json
{
  "status": "success",
  "certificate_url": "string"
}
```

## Direct Fetch Calls

### `GET https://safetytxt.com/wp-json/learnpress/v1/courses3?course_id={id}`
- Used by: `src/screens/courses-details/index.js`
- Query params:
```json
{
  "course_id": "number|string"
}
```
- Expected response:
```json
{
  "restrict": "string|null",
  "...": "other fields"
}
```

### `POST https://safetytxt.com/wp-json/custom-api/v2/get-certificate-url`
- Used by: `src/screens/courses-details/index.js`
- Payload:
```json
{
  "course_id": "number|string",
  "user_id": "number|string"
}
```
- Expected response:
```json
{
  "certificate_url": "string",
  "message": "string",
  "...": "other fields"
}
```
- App usage:
  - Parses raw text response manually
  - Checks `response.ok`
  - Uses `data.certificate_url` to open the certificate view

## Direct Backend Usage Notes

- `src/config/index.js` sets `SITE_URL` to `https://safetytxt.com`
- Most `Client` endpoints are built by prefixing that base URL to the path in `src/api/client.js`
- A small number of endpoints are called directly with `fetch()` in screen files instead of going through `Client`

## Source Index

### `src/api/client.js`
- [src/api/client.js:4](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L4) `POST /wp-json/learnpress/v1/token`
- [src/api/client.js:6](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L6) `POST /wp-json/learnpress/v1/token/register`
- [src/api/client.js:11](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L11) `GET /wp-json/learnpress/v1/courses`
- [src/api/client.js:19](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L19) `GET /wp-json/learnpress/v1/courses1`
- [src/api/client.js:27](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L27) `GET /wp-json/learnpress/v1/courses2`
- [src/api/client.js:36](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L36) `GET /wp-json/learnpress/v1/courses3?courses_id={id}`
- [src/api/client.js:39](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L39) `GET /wp-json/learnpress/v1/courses/{id}`
- [src/api/client.js:41](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L41) `GET /wp-json/learnpress/v1/lessons/{id}`
- [src/api/client.js:44](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L44) `GET /wp-json/learnpress/v1/lessons`
- [src/api/client.js:46](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L46) `POST /wp-json/learnpress/v1/courses/finish`
- [src/api/client.js:49](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L49) `POST /wp-json/learnpress/v1/courses/retake`
- [src/api/client.js:52](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L52) `POST /wp-json/learnpress/v1/courses/enroll`
- [src/api/client.js:55](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L55) `POST /wp-json/learnpress/v1/lessons/finish`
- [src/api/client.js:58](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L58) `GET /wp-json/learnpress/v1/quiz/{id}`
- [src/api/client.js:61](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L61) `POST /wp-json/learnpress/v1/quiz/start`
- [src/api/client.js:63](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L63) `POST /wp-json/learnpress/v1/quiz/finish`
- [src/api/client.js:66](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L66) `POST /wp-json/learnpress/v1/quiz/retake`
- [src/api/client.js:69](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L69) `GET /wp-json/learnpress/v1/users`
- [src/api/client.js:71](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L71) `GET /wp-json/learnpress/v1/users/{id}`
- [src/api/client.js:73](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L73) `POST multipart /wp-json/learnpress/v1/users/{id}`
- [src/api/client.js:76](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L76) `GET /wp-json/learnpress/v1/courses/{id}` with `optimize=...`
- [src/api/client.js:82](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L82) `GET /wp-json/wp/v2/course_category`
- [src/api/client.js:85](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L85) `POST /wp-json/learnpress/v1/wishlist/toggle`
- [src/api/client.js:88](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L88) `GET /wp-json/learnpress/v1/wishlist`
- [src/api/client.js:91](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L91) `GET /wp-json/learnpress/v1/wishlist/course/{id}`
- [src/api/client.js:94](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L94) `GET /wp-json/learnpress/v1/assignments/{id}`
- [src/api/client.js:96](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L96) `POST /wp-json/learnpress/v1/assignments/start/`
- [src/api/client.js:99](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L99) `POST /wp-json/learnpress/v1/assignments/retake/`
- [src/api/client.js:102](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L102) `POST multipart /wp-json/learnpress/v1/assignments/submit/`
- [src/api/client.js:105](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L105) `POST /wp-json/learnpress/v1/assignments/delete-submit-file/`
- [src/api/client.js:111](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L111) `GET /wp-json/learnpress/v1/courses`
- [src/api/client.js:122](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L122) `GET /wp-json/learnpress/v1/courses1`
- [src/api/client.js:136](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L136) `GET /wp-json/learnpress/v1/course_category`
- [src/api/client.js:145](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L145) `GET /wp-json/learnpress/v1/review/course/{id}`
- [src/api/client.js:148](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L148) `POST /wp-json/learnpress/v1/review/submit`
- [src/api/client.js:151](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L151) `POST /wp-json/learnpress/v1/quiz/check_answer`
- [src/api/client.js:154](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L154) `POST /wp-json/learnpress/v1/users/reset-password`
- [src/api/client.js:157](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L157) `POST /wp-json/learnpress/v1/users/change-password`
- [src/api/client.js:160](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L160) `POST /wp-json/learnpress/v1/courses/verify-receipt`
- [src/api/client.js:163](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L163) `POST /wp-json/learnpress/v1/users/delete`
- [src/api/client.js:166](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L166) `GET /wp-json/lp/v1/mobile-app/product-iap`
- [src/api/client.js:169](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L169) `POST /wp-json/learnpress/v1/push-notifications/register-device`
- [src/api/client.js:174](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L174) `POST /wp-json/learnpress/v1/push-notifications/delete-device`
- [src/api/client.js:179](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L179) `GET /wp-json/learnpress/notifications/v1/notifications`
- [src/api/client.js:184](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L184) `GET /wp-json/custom-api/v2/get-certificate-url`
- [src/api/client.js:189](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/api/client.js#L189) `POST /wp-json/custom-api/v1/finish-course`

### Direct screen calls
- [src/screens/courses-details/index.js:225](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/courses-details/index.js#L225) `GET /wp-json/learnpress/v1/courses3?course_id={id}`
- [src/screens/courses-details/index.js:776](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/courses-details/index.js#L776) `POST /wp-json/custom-api/v2/get-certificate-url`
- [src/screens/courses-details/index.js:787](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/courses-details/index.js#L787) raw `fetch()` for certificate URL
- [src/screens/home/index.js:389](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/home/index.js#L389) external link only, not an API call
- [src/screens/home/index.js:412](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/screens/home/index.js#L412) external link only, not an API call

### `src/config/index.js`
- [src/config/index.js:2](/Users/gauravshokhanda/Desktop/leave/learnpress-mobile-react-native/src/config/index.js#L2) base URL is `https://safetytxt.com`

## Shared Response Patterns

Across the app, the following fields are commonly checked:
- `status === 'success'`
- `code === 'success'`
- `token`
- `message`
- `data`
- `results`
- `response.data.status === 200`

If you want, I can also turn this into a tighter developer-facing spec with:
- endpoint method, path, auth requirement
- request body
- success response
- error response
- source file and line references
