# Learnify Backend — Improvement Recommendations

> **Priority Levels:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## 1. Security

### 🔴 1.1 Input Validation & Sanitization
**Current:** No input validation library. Manual checks only verify field presence, not data types, lengths, or formats. User input is passed directly to MongoDB queries.

**Action:**
- Add `express-validator` or `joi`/`zod` for schema-based request validation on every endpoint
- Sanitize inputs to prevent NoSQL injection (e.g., `$gt`, `$ne` in JSON bodies)
- Validate ObjectId format before passing to `findById()`
- Add length limits on strings (title, description, bio, etc.)

---

### 🔴 1.2 Broken Access Control (Authorization Gaps)
**Current Issues:**
- `POST /add-cart` accepts `userId` from request body — any authenticated user can add to another user's cart
- `POST /verify-payment` accepts `userId` from body — payment can be attributed to a wrong user
- `POST /update-progress` accepts `userId` from body — user can manipulate another user's progress
- `POST /complete` and `/uncomplete` accept `userId` from body
- `GET /get-cart/:userId` — any authenticated user can view another user's cart
- `GET /get-enrolled-courses/:userId` — any user can view another user's enrollments
- `PATCH /update-course/:courseId` — no check that the instructor owns the course
- `DELETE /delete-lecture`, `/delete-video` — no check that the instructor owns the course containing the lecture
- `GET /get-certificate/:userId/:courseId` — any user can download another user's certificate

**Action:**
- **Always use `req.user._id`** instead of accepting `userId` from request body or params
- Add ownership checks: verify `course.instructor === req.user._id` before allowing course/section/lecture mutations
- Add enrollment verification before allowing progress/certificate access

---

### 🔴 1.3 Payment Security
**Current Issues:**
- `amount` is accepted from the client in `POST /create-order` and `POST /verify-payment` — client can send a lower price
- No server-side amount validation against actual course prices
- `courseAccessGranted` is set to `true` without verifying the actual Razorpay payment amount matches expected amount
- No idempotency — same payment can potentially be verified multiple times

**Action:**
- Calculate `amount` server-side from course prices (with coupon discounts applied)
- Verify `razorpay_order_id` amount matches expected amount from DB
- Mark orders with unique transaction ID; reject duplicate verifications
- Use Razorpay webhooks for payment confirmation instead of relying solely on client-side callback

---

### 🟠 1.4 Rate Limiting
**Current:** No rate limiting on any endpoints.

**Action:**
- Add `express-rate-limit` globally (e.g., 100 req/min per IP)
- Stricter limits on sensitive endpoints: `/login` (5/min), `/send-otp` (3/min), `/password-reset-token` (3/min), `/register` (5/min)
- Consider per-user rate limiting for authenticated endpoints

---

### 🟠 1.5 CORS Configuration
**Current:** Single origin from env var. No validation that it's a proper URL.

**Action:**
- Support multiple origins (array-based) for staging/production
- Validate origin URLs at startup

---

### 🟠 1.6 Security Headers
**Current:** No security headers configured.

**Action:**
- Add `helmet` middleware for security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`, etc.)
- Remove `X-Powered-By: Express` header

---

### 🟠 1.7 Cookie Security
**Current:** Inconsistent cookie options across the codebase:
- `googleAuthCallback` hardcodes `secure: true, sameSite: "none"` while `loginUser`/`logoutUser` use env-based logic
- No `maxAge` or `expires` set on cookies

**Action:**
- Centralize cookie options in a shared config
- Set proper `maxAge` matching token expiry times
- Ensure consistent `secure` and `sameSite` across all cookie-setting operations

---

### 🟡 1.8 OTP Security
**Current:** OTP is a 6-digit random number, no rate limiting, no brute-force protection. Comment says 5 min TTL but code sets 120 seconds.

**Action:**
- Fix TTL to match intended duration (comment vs code mismatch)
- Add rate limiting for OTP attempts per email
- Hash OTPs before storing (bcrypt or argon2)
- Limit maximum verification attempts (e.g., 5 per OTP)

---

### 🟡 1.9 Password Reset Token
**Current:** Token is a random hex string stored in plaintext.

**Action:**
- Hash the token before storing in DB (use `crypto.createHash`)
- Compare hashed token on verification

---

### 🟡 1.10 Secrets & Environment Variables
**Current:** `.env` file present in repo (1092 bytes). `crypto` package listed in dependencies (built-in, should not be installed).

**Action:**
- Ensure `.env` is in `.gitignore` (verify it's not committed)
- Remove `crypto` from package.json dependencies (it's a Node.js built-in)
- Validate all required env vars at startup and fail fast if missing

---

## 2. Reliability

### 🔴 2.1 Database Transactions
**Current:** Multi-document operations (e.g., payment verification → transaction + enrollment + course update + user update + cart delete) have no atomicity. If any step fails, data becomes inconsistent.

**Action:**
- Use MongoDB transactions (`session.startTransaction()`) for:
  - Payment verification flow (Transaction + Enrollment + Course + User + Cart)
  - Lecture/Section deletion (Lecture + Section + S3)
  - User registration + OTP flow
- Implement rollback patterns for external service failures (S3, Razorpay)

---

### 🔴 2.2 Error in `index.js` — Variable Name Bug
**Current:** `catch((error) => { console.log("MongoDb Connection failed !!!", err); })` — references `err` instead of `error`. This will crash at startup if MongoDB is unavailable.

**Action:** Fix the variable name to `error`.

---

### 🟠 2.3 Graceful Shutdown
**Current:** No graceful shutdown handling. Server stops abruptly on `SIGTERM`/`SIGINT`.

**Action:**
- Handle `SIGTERM` and `SIGINT` signals
- Close MongoDB connections gracefully
- Stop accepting new requests, let in-flight requests finish
- Close S3 clients

---

### 🟠 2.4 Response Status Code Inconsistencies
**Current:** Multiple endpoints return wrong HTTP status codes:
- `getCourse` returns `201` (Created) for a GET request
- `getAllCourses` returns `201` for a GET request
- `getProgress` returns `201` for a GET request
- `getCourseReviews` returns `201` in ApiResponse but `200` in `res.status()`
- `deleteReview` calls `res.status(200).json(201, "", "Review deleted")` — broken response

**Action:** Audit all endpoints and use correct HTTP status codes consistently.

---

### 🟠 2.5 Missing `new` Keyword in `ApiError`
**Current:** In `updateEducation` (line 303) and `updateExperience` (line 414): `throw ApiError(...)` instead of `throw new ApiError(...)`. In `addVideoToLecture` (line 52): `throw ApiError(...)`.

**Action:** Add `new` keyword to all `ApiError` instantiations.

---

### 🟠 2.6 Double Response in `getExperties`
**Current:** `getExperties` controller sends two responses: `res.status(200).json(...)` followed by `res.json({ skills: user.skills })` — will crash with "headers already sent" error.

**Action:** Remove the second `res.json()` call.

---

### 🟠 2.7 `deleteExpertise` Returns `ApiError` Instead of `ApiResponse`
**Current:** `deleteExpertise` returns `new ApiError(200, ...)` instead of `new ApiResponse(200, ...)`.

**Action:** Replace `ApiError` with `ApiResponse`.

---

### 🟡 2.8 Deprecated Mongoose Method
**Current:** `deleteReview` uses `review.remove()` which is deprecated in Mongoose v8.

**Action:** Replace with `review.deleteOne()` or `Review.findByIdAndDelete()`.

---

### 🟡 2.9 Refresh Token Bug
**Current:** `refreshAccessToken` destructures `{ accessToken, newRefreshToken }` but `generateAccessAndRefreshToken` returns `{ accessToken, refreshToken }`. The `newRefreshToken` will be `undefined`.

**Action:** Fix destructuring to `{ accessToken, refreshToken: newRefreshToken }`.

---

### 🟡 2.10 Cart `removeFromCart` Uses GET Instead of DELETE
**Current:** `remove-from-cart` route is `GET` — should be `DELETE` for RESTful semantics.

**Action:** Change to `DELETE` method.

---

### 🟡 2.11 `completeLecture` in Enrollment Controller is Broken
**Current:** References `enrollment.progress.completedLectures` but `Enrollment` model has no `progress` field. This will crash.

**Action:** Either remove this dead code or add the `progress` field to the enrollment model if needed.

---

## 3. Code Quality & Maintainability

### 🟠 3.1 Project Structure Improvements

**Action:**
- **Move config/ inside src/**: Keep all source code under `src/`
- **Consistent file naming**: Mix of `PascalCase` (`Education.js`, `PasswordResetToken.model.js`) and `camelCase` (`cart.model.js`). Standardize to `kebab-case` or `camelCase`
- **Consistent export style**: Some models use `export const`, others use `export default`. Standardize
- **Group by feature (optional)**: Consider moving related models/controllers/routes into feature folders (e.g., `features/auth/`, `features/course/`)
- **Remove dead code**: `constants.js` is empty, `courseEnrollment` and `stuCourses` appear unused, `addLecture` in course controller is legacy

---

### 🟠 3.2 Centralize Configuration
**Current:** `dotenv.config()` is called in 3 places (`app.js`, `passport.js`, `cloudinary.js`).

**Action:**
- Call `dotenv.config()` once at the entry point (`index.js`)
- Create a centralized `config.js` that validates and exports all env vars
- Fail fast on missing required env vars

---

### 🟠 3.3 Route Design (RESTful Conventions)
**Current:** Non-RESTful naming and verb misuse throughout:
- `GET /remove-from-cart` (should be `DELETE`)
- `POST /update-education` (should be `PUT/PATCH`)
- `POST /update-experience` (should be `PUT/PATCH`)
- `POST /update-profile` (should be `PUT/PATCH`)
- `POST /Add-course` (inconsistent casing)
- `GET /fetchcourse/:courseId` (should just be `GET /:courseId`)

**Action:**
- Follow RESTful conventions: use nouns for resources, HTTP verbs for actions
- Example: `GET /courses`, `GET /courses/:id`, `POST /courses`, `PATCH /courses/:id`, `DELETE /courses/:id`

---

### 🟡 3.4 Remove Duplication
**Current:**
- `addLecture` exists in both `course.controller.js` (legacy) and `lecture.controller.js` (current)
- `courseEnrollment` and `stuCourses` in course controller reference non-existent model fields (`enrolledStudents`, `enrolledCourses`)
- Cookie options logic is duplicated across `loginUser`, `logoutUser`, `refreshAccessToken`

**Action:**
- Remove duplicate/dead controllers
- Extract cookie options to a shared utility

---

### 🟡 3.5 Typos in Codebase
- `"exprtise"`, `"succesfully"`, `"fetched succesfully"`, `"worng"`, `"recommeded"`, `"Reveiw"`, `"enrolle"`, `"MongoDb Connnection failed"`, `"expertiesIndex"`, `"something went worng while adding education"` (in experience context)
- These appear in user-facing API messages

**Action:** Fix all typos in user-facing messages and variable names.

---

### 🟡 3.6 JSON.parse on Request Body Fields
**Current:** `createCourse`, `updateCourse`, `updateProfile` call `JSON.parse()` on individual body fields (`thumbnail`, `videoFile`, `profilePicture`, `socialLinks`) with unnecessary `await`.

**Action:**
- Have the client send proper JSON objects (not stringified sub-objects)
- Remove unnecessary `await` on synchronous `JSON.parse()`
- Add try-catch around parse calls to handle malformed input

---

## 4. Observability

### 🔴 4.1 Structured Logging
**Current:** `console.log()`/`console.error()` scattered throughout. No structured format, no log levels, no request correlation.

**Action:**
- Add a structured logging library: `winston` or `pino`
- Log levels: `error`, `warn`, `info`, `debug`
- Include request ID in all logs for correlation
- Log: incoming requests, response times, errors, DB queries, external service calls
- Never log sensitive data (passwords, tokens, OTPs, payment details)

---

### 🔴 4.2 Request Logging Middleware
**Current:** No request/response logging.

**Action:**
- Add `morgan` middleware (or custom middleware with `pino-http`)
- Log: method, URL, status code, response time, user ID (if authenticated)

---

### 🟠 4.3 Health Check Endpoint
**Current:** None.

**Action:**
- Add `GET /health` endpoint that checks:
  - Server is running
  - MongoDB connection is alive
  - (Optional) Cloudinary/S3 connectivity
- Used by load balancers, monitoring, and deployment pipelines

---

### 🟠 4.4 Error Tracking & Alerting
**Current:** Errors are logged only to stdout. No external error tracking.

**Action:**
- Integrate Sentry or similar APM for error tracking
- Capture unhandled rejections and uncaught exceptions
- Alert on error rate spikes

---

### 🟡 4.5 Metrics & Monitoring
**Current:** None.

**Action:**
- Expose Prometheus metrics via `prom-client`:
  - HTTP request count, latency histograms
  - Active connections
  - DB query latency
  - Error counts by type
- Set up Grafana dashboards for visualization
- Alternatively, use cloud-native solutions (CloudWatch, Datadog)

---

### 🟡 4.6 Request Tracing
**Current:** No distributed tracing.

**Action:**
- Add unique request IDs via `uuid` or `nanoid` (attach to `req.id`)
- Pass through to all logs and external service calls
- For microservice readiness: integrate OpenTelemetry

---

## 5. Performance

### 🟠 5.1 Database Indexing
**Current:** No custom indexes defined (only default `_id` and unique fields).

**Action:**
- Add compound indexes for common queries:
  - `Enrollment`: `{ user: 1, course: 1 }` (unique compound)
  - `Progress`: `{ userId: 1, courseId: 1 }` (unique compound)
  - `Review`: `{ courseId: 1, userId: 1 }`
  - `Section`: `{ courseId: 1, order: 1 }`
  - `Lecture`: `{ sectionId: 1, order: 1 }`
  - `Transaction`: `{ userId: 1, createdAt: -1 }`
  - `Coupon`: `{ courseId: 1, status: 1, expiresAt: 1 }`
  - `Course`: `{ instructor: 1 }`, text index on `{ title, subtitle, category, subcategory }`

---

### 🟠 5.2 N+1 Query Problems
**Current:**
- `verifyPayment` loops through `courseIds` and runs individual queries inside the loop
- `getInstructorStats` fetches courses then enrollment counts separately
- `addReview` fetches all reviews to recalculate average after each add

**Action:**
- Use bulk operations: `insertMany`, `updateMany`, `$in` queries
- Use MongoDB aggregation pipeline for stats calculations
- Use `$inc` and `$avg` aggregations for review ratings instead of fetching all reviews

---

### 🟡 5.3 Pagination
**Current:** No pagination on any list endpoint. `getAllCourses`, `getAllQuizzes`, `getCourseReviews`, `getEnrolledCourses` return all records.

**Action:**
- Add `skip`/`limit` pagination (or cursor-based for large datasets)
- Accept `page` and `limit` query params
- Return `total`, `page`, `totalPages` in response

---

### 🟡 5.4 Query Optimization for Search
**Current:** `courseSearch` creates regex per word per field — very expensive for large datasets, no text indexes.

**Action:**
- Create a MongoDB text index on `Course` (title, subtitle, category, subcategory)
- Use `$text` + `$search` for efficient full-text search
- Consider Elasticsearch/Algolia for production-grade search

---

## 6. Testing

### 🔴 6.1 No Tests Exist
**Current:** Zero test files. No test framework configured.

**Action:**
- Add testing framework: `vitest` or `jest`
- **Unit tests:** For utilities (ApiError, ApiResponse, updateCoursePrice, asyncHandler)
- **Integration tests:** For controllers with an in-memory MongoDB (using `mongodb-memory-server`)
- **API tests:** Using `supertest` for endpoint-level testing
- Add `test` script to `package.json`
- Aim for critical path coverage first: auth, payments, enrollment

---

## 7. DevOps & Infrastructure

### 🟡 7.1 Dockerize the Backend
**Action:**
- Create a `Dockerfile` with multi-stage build
- Create `docker-compose.yml` with MongoDB service
- Standardize development environment

---

### 🟡 7.2 CI/CD Pipeline
**Action:**
- Add GitHub Actions workflow for:
  - Linting (ESLint)
  - Tests
  - Build validation
  - Optional: auto-deploy to staging on merge

---

### 🟡 7.3 API Documentation
**Current:** No API documentation.

**Action:**
- Add Swagger/OpenAPI documentation using `swagger-jsdoc` + `swagger-ui-express`
- Auto-generate from route definitions
- Serve at `/api-docs`

---

## Summary Priority Matrix

| Priority | Count | Categories |
|----------|-------|------------|
| 🔴 Critical | 7 | Input validation, access control, payment security, DB transactions, startup bug, structured logging, request logging, tests |
| 🟠 High | 12 | Rate limiting, CORS, security headers, cookies, graceful shutdown, status codes, missing `new`, double response, wrong return type, centralize config, REST conventions, health check, error tracking, DB indexing, N+1 queries |
| 🟡 Medium | 14 | OTP security, password reset, secrets, deprecated methods, refresh token bug, cart HTTP method, dead code, typos, JSON.parse, file naming, duplication, pagination, search optimization, metrics, tracing, Docker, CI/CD, API docs |

### Recommended Execution Order
1. **Fix active bugs first:** startup `err` variable, double response, missing `new`, refresh token destructuring, deprecated `remove()`, broken `completeLecture`, wrong `ApiError` return
2. **Security hardening:** Input validation, access control fixes, payment amount verification, rate limiting, helmet
3. **Observability:** Structured logging, request logging, health check, error tracking
4. **Reliability:** Database transactions, graceful shutdown, status code audit
5. **Performance:** Database indexes, pagination, N+1 fixes
6. **Testing:** Set up test framework, write critical path tests
7. **DevOps:** Docker, CI/CD, API docs
