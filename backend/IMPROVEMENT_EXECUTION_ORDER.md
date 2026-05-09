# Learnify Backend — Improvement Execution Order

> A safe, phased plan to incrementally improve the backend without breaking anything.
> Each phase builds on the previous one. Complete all items within a phase before moving to the next.

---

## Guiding Principles

1. **Fix what's broken first** — Active bugs crash the app; fix those before adding features
2. **Foundation before features** — Config centralization and logging must come before security hardening
3. **Non-breaking → Breaking** — Internal refactors first, then API contract changes last
4. **Each phase = deployable** — After completing any phase, the app should work correctly

---

## Phase 1: Fix Active Bugs ⚡ *(~1 day)*

> **Risk: ZERO** — These are pure bug fixes. Nothing changes in behavior, things just stop crashing.

| # | Item | Ref | Why First |
|---|------|-----|-----------|
| 1 | Fix `err` → `error` variable in `index.js` catch block | §2.2 | Server crashes on DB failure |
| 2 | Remove second `res.json()` in `getExperties` | §2.6 | Crashes with "headers sent" error |
| 3 | Add missing `new` keyword to `ApiError` calls in `updateEducation`, `updateExperience`, `addVideoToLecture` | §2.5 | Throws TypeError instead of proper error |
| 4 | Fix `deleteExpertise` returning `ApiError` → `ApiResponse` | §2.7 | Returns error format on success |
| 5 | Fix refresh token destructuring: `{ accessToken, refreshToken: newRefreshToken }` | §2.9 | Token refresh sets `undefined` cookie |
| 6 | Replace deprecated `review.remove()` with `review.deleteOne()` | §2.8 | Will break on Mongoose v8+ |
| 7 | Remove broken `completeLecture` in enrollment controller (references non-existent `progress` field) | §2.11 | Crashes when called |

**Test:** Start server, login, refresh token, delete a review, delete expertise — all should work without crashes.

---

## Phase 2: Centralize Configuration & Entry Point ⚙️ *(~0.5 day)*

> **Risk: LOW** — Internal restructuring only. No API changes.

| # | Item | Ref | Why Now |
|---|------|-----|---------|
| 1 | Move `dotenv.config()` to a single place in `index.js` (remove from `app.js`, `passport.js`, `cloudinary.js`) | §3.2 | Foundation for all subsequent changes |
| 2 | Create `src/config/index.js` that validates all required env vars and exports them | §3.2, §1.10 | Fail-fast on missing config; single source of truth |
| 3 | Remove `crypto` from `package.json` dependencies (it's a Node.js built-in) | §1.10 | Unnecessary dependency |

**Test:** Server starts normally. All features still work.

---

## Phase 3: Observability Foundation 📊 *(~1 day)*

> **Risk: LOW** — Adds new middleware; doesn't change any existing logic.
> **Why before security?** You need logging to debug issues when you start changing auth/access patterns.

| # | Item | Ref | Why Now |
|---|------|-----|---------|
| 1 | Install & configure `winston` or `pino` as structured logger | §4.1 | Replace all `console.log/error` |
| 2 | Add request logging middleware (`morgan` or `pino-http`) | §4.2 | See every request with timing |
| 3 | Add unique request ID middleware (`crypto.randomUUID()`) | §4.6 | Correlate logs per request |
| 4 | Add `GET /health` endpoint (check server + MongoDB status) | §4.3 | Basic monitoring readiness |
| 5 | Update `errorHandler.js` to log errors with the structured logger | §4.1 | Errors now appear in structured logs |

**Test:** Make API calls, verify structured JSON logs appear with request IDs and timings. Hit `/health` and verify response.

---

## Phase 4: Security Hardening (Non-Breaking) 🔒 *(~1–2 days)*

> **Risk: LOW** — Adds protections without changing API contracts.

| # | Item | Ref | Why Now |
|---|------|-----|---------|
| 1 | Install & add `helmet` middleware | §1.6 | Security headers, zero risk |
| 2 | Install & add `express-rate-limit` — global + per-endpoint on `/login`, `/send-otp`, `/register`, `/password-reset-token` | §1.4 | Prevent brute force |
| 3 | Centralize cookie options into `src/config/cookieOptions.js` | §1.7 | Consistent cookie behavior |
| 4 | Update `loginUser`, `logoutUser`, `refreshAccessToken`, `googleAuthCallback` to use shared cookie config | §1.7 | Fix inconsistent cookie settings |
| 5 | Add `maxAge` to cookies matching token expiry | §1.7 | Cookies expire with tokens |
| 6 | Fix OTP TTL mismatch (comment says 5 min, code says 120s) — pick one and align | §1.8 | Prevent confusion |

**Test:** Login/logout/refresh/Google OAuth still work. Rate limiting kicks in on rapid requests. Cookies have proper attributes.

---

## Phase 5: Access Control Fixes 🛡️ *(~1–2 days)*

> **Risk: MEDIUM** — Changes where user IDs come from. Frontend may need updates if it sends `userId` in body.
>
> ⚠️ **Coordinate with frontend** — Some endpoints currently accept `userId` from body; after this phase they'll use `req.user._id`.

| # | Item | Ref | What Changes |
|---|------|-----|-------------|
| 1 | `addCart`: Use `req.user._id` instead of `req.body.userId` | §1.2 | Frontend stop sending userId |
| 2 | `verifyPayment`: Use `req.user._id` instead of `req.body.userId` | §1.2 | Frontend stop sending userId |
| 3 | `updateProgress`, `markLectureComplete`, `unmarkLectureComplete`: Use `req.user._id` | §1.2 | Frontend stop sending userId |
| 4 | `getCart`: Use `req.user._id` instead of `req.params.userId` → change to `GET /cart` | §1.2 | Route change |
| 5 | `getEnrolledCourses`, `checkUserEnrollment`, `getEnrolledCourseCountForUser`: Use `req.user._id` for own-data routes | §1.2 | Route change |
| 6 | `getCertificate`: Verify `userId === req.user._id` | §1.2 | Prevents stealing certificates |
| 7 | Add ownership checks: `updateCourse`, `changePublishStatus` → verify `course.instructor === req.user._id` | §1.2 | Instructor can only edit own courses |
| 8 | Add ownership checks: `deleteLecture`, `deleteVideo`, `updateLecture` → verify instructor owns the course | §1.2 | Same |

**Test:** All operations work for the correct user. Attempting to access another user's data returns 403.

---

## Phase 6: Input Validation ✅ *(~2 days)*

> **Risk: LOW-MEDIUM** — Only rejects bad input; valid requests still work.

| # | Item | Ref | What To Do |
|---|------|-----|-----------|
| 1 | Install `zod` or `joi` | §1.1 | Validation library |
| 2 | Create validation schemas for all request bodies (start with auth routes, then courses, then payments) | §1.1 | Type + format + length checks |
| 3 | Create a validation middleware that runs schemas before controllers | §1.1 | Clean separation |
| 4 | Validate ObjectId format in all `:id` params | §1.1 | Prevents Mongoose CastError |
| 5 | Remove manual `if (!field)` checks from controllers (replaced by schemas) | §1.1 | Cleaner code |
| 6 | Fix `JSON.parse()` calls — wrap in try-catch or have frontend send proper objects | §3.6 | Prevent crashes on malformed input |

**Test:** Valid requests work as before. Invalid requests return clear 400 errors with field-level messages.

---

## Phase 7: Payment Security 💳 *(~1 day)*

> **Risk: MEDIUM** — Changes payment flow logic. Test thoroughly.

| # | Item | Ref | What To Do |
|---|------|-----|-----------|
| 1 | `createOrder`: Calculate `amount` server-side from course prices (don't trust client amount) | §1.3 | Server computes total |
| 2 | `verifyPayment`: Verify the Razorpay order amount matches expected amount | §1.3 | Prevent price manipulation |
| 3 | Add idempotency check — reject duplicate `razorpay_order_id` verification | §1.3 | Prevent double-enrollment |
| 4 | (Optional) Set up Razorpay webhooks as backup verification | §1.3 | Extra reliability |

**Test:** Complete a full payment flow. Verify amounts are calculated correctly. Try sending wrong amount — should be rejected.

---

## Phase 8: Database Reliability 🗄️ *(~1–2 days)*

> **Risk: MEDIUM** — Adds transactions and indexes. Requires MongoDB replica set for transactions.

| # | Item | Ref | What To Do |
|---|------|-----|-----------|
| 1 | Add MongoDB compound indexes on frequently queried fields | §5.1 | Performance + data integrity |
| 2 | Wrap `verifyPayment` in a MongoDB transaction | §2.1 | Atomic payment + enrollment |
| 3 | Wrap lecture/section deletion in transactions | §2.1 | Atomic cleanup |
| 4 | Add `{ user: 1, course: 1 }` unique compound index on `Enrollment` | §5.1 | Prevent duplicate enrollments at DB level |
| 5 | Add `{ userId: 1, courseId: 1 }` unique compound index on `Progress` | §5.1 | Prevent duplicate progress records |

> ⚠️ **Note:** MongoDB transactions require a **replica set**. If running standalone MongoDB locally, you'll need to convert it or use `mongodb-memory-server` with `--replSet` for testing.

**Test:** Payment flow still works. Try creating duplicate enrollments — should be rejected. Verify query performance improved.

---

## Phase 9: Code Cleanup & RESTful Refactoring 🧹 *(~1–2 days)*

> **Risk: MEDIUM-HIGH** — API route changes. **Must coordinate with frontend.**
>
> ⚠️ **Strategy:** Keep old routes working (deprecated) while adding new RESTful routes. Remove old routes after frontend is updated.

| # | Item | Ref | What To Do |
|---|------|-----|-----------|
| 1 | Fix all typos in API response messages | §3.5 | Non-breaking, do first |
| 2 | Remove dead code: `courseEnrollment`, `stuCourses` in course controller, `completeLecture` in enrollment controller | §3.4, §2.11 | Already broken/unused |
| 3 | Remove legacy `addLecture` from course controller (kept in lecture controller) | §3.4 | Duplicate code |
| 4 | Change `removeFromCart` from `GET` to `DELETE` | §2.10 | Fix HTTP verb |
| 5 | Change `updateEducation`/`updateExperience` from `POST` to `PATCH` | §3.3 | Correct REST verb |
| 6 | Standardize file naming (pick one convention, rename files) | §3.1 | Consistency |
| 7 | Standardize export style (named vs default) | §3.1 | Consistency |

**Test:** All affected operations still work from frontend. Run through all major user flows.

---

## Phase 10: Performance & Pagination 🚀 *(~1 day)*

> **Risk: LOW-MEDIUM** — Adds query params; existing calls without params get default behavior.

| # | Item | Ref | What To Do |
|---|------|-----|-----------|
| 1 | Add pagination to `getAllCourses`, `getCourseReviews`, `getEnrolledCourses`, `getAllQuizzes` | §5.3 | Default page=1, limit=20 |
| 2 | Fix N+1 in `verifyPayment` — use bulk `insertMany` for enrollments | §5.2 | Faster payments |
| 3 | Add text index on `Course` for search, use `$text` query | §5.4 | Faster search |
| 4 | Use aggregation pipeline for `addReview` average rating calculation | §5.2 | No more fetching all reviews |

**Test:** List endpoints return paginated results. Search is faster. Payment with cart works correctly.

---

## Phase 11: Graceful Shutdown & Error Tracking 🧯 *(~0.5 day)*

> **Risk: LOW** — Adds infrastructure without changing business logic.

| # | Item | Ref | What To Do |
|---|------|-----|-----------|
| 1 | Handle `SIGTERM`/`SIGINT` — close MongoDB + stop accepting requests | §2.3 | Clean deploys |
| 2 | Add unhandled rejection / uncaught exception handlers | §4.4 | Prevent silent crashes |
| 3 | (Optional) Integrate Sentry for error tracking | §4.4 | Production error visibility |
| 4 | Fix all remaining status code inconsistencies (201 → 200 for GETs) | §2.4 | Correct HTTP semantics |

**Test:** Send `SIGTERM` to process — should shut down cleanly. Errors appear in Sentry.

---

## Phase 12: Testing 🧪 *(~3–5 days)*

> **Risk: ZERO** — Tests don't change production code.

| # | Item | Ref | Priority Order |
|---|------|-----|---------------|
| 1 | Set up `vitest` or `jest` with `mongodb-memory-server` | §6.1 | Foundation |
| 2 | Unit tests for utilities: `ApiError`, `ApiResponse`, `asyncHandler`, `updateCoursePrice` | §6.1 | Quick wins |
| 3 | Integration tests for auth flow: register → OTP → login → refresh → logout | §6.1 | Critical path |
| 4 | Integration tests for payment flow: create order → verify → enrollment check | §6.1 | Money path |
| 5 | Integration tests for course CRUD + section/lecture CRUD | §6.1 | Core feature |
| 6 | Add `test` and `test:ci` scripts to `package.json` | §6.1 | CI readiness |

---

## Phase 13: DevOps & Documentation 📦 *(~1–2 days)*

> **Risk: ZERO** — Doesn't change application code.

| # | Item | Ref | What To Do |
|---|------|-----|-----------|
| 1 | Add Swagger/OpenAPI docs at `/api-docs` | §7.3 | Self-documenting API |
| 2 | Create `Dockerfile` + `docker-compose.yml` | §7.1 | Standardized dev env |
| 3 | Add GitHub Actions CI pipeline (lint + test) | §7.2 | Automated quality gates |
| 4 | Add Prometheus metrics endpoint (optional) | §4.5 | Production monitoring |

---

## Visual Dependency Map

```
Phase 1 (Bug Fixes)
    │
Phase 2 (Centralize Config) ─── foundation for everything
    │
Phase 3 (Observability) ─────── you need logs before making changes
    │
    ├── Phase 4 (Security Headers/Rate Limiting) ── non-breaking security
    │       │
    │   Phase 5 (Access Control) ── ⚠️ needs frontend coordination
    │       │
    │   Phase 6 (Input Validation)
    │       │
    │   Phase 7 (Payment Security)
    │
Phase 8 (DB Reliability) ─────── transactions + indexes
    │
Phase 9 (Code Cleanup/REST) ──── ⚠️ needs frontend coordination
    │
Phase 10 (Performance) ────────── pagination + query optimization
    │
Phase 11 (Graceful Shutdown) ──── infrastructure polish
    │
Phase 12 (Testing) ────────────── can start in parallel from Phase 4 onwards
    │
Phase 13 (DevOps) ─────────────── final polish
```

---

## Time Estimates

| Phase | Effort | Cumulative |
|-------|--------|------------|
| Phase 1: Bug Fixes | ~1 day | 1 day |
| Phase 2: Config | ~0.5 day | 1.5 days |
| Phase 3: Observability | ~1 day | 2.5 days |
| Phase 4: Security (Non-Breaking) | ~1–2 days | 4.5 days |
| Phase 5: Access Control | ~1–2 days | 6.5 days |
| Phase 6: Input Validation | ~2 days | 8.5 days |
| Phase 7: Payment Security | ~1 day | 9.5 days |
| Phase 8: DB Reliability | ~1–2 days | 11.5 days |
| Phase 9: Code Cleanup | ~1–2 days | 13.5 days |
| Phase 10: Performance | ~1 day | 14.5 days |
| Phase 11: Graceful Shutdown | ~0.5 day | 15 days |
| Phase 12: Testing | ~3–5 days | 20 days |
| Phase 13: DevOps | ~1–2 days | 22 days |
| **Total** | **~3–4 weeks** | |

> 💡 **Tip:** Phases 12 (Testing) can start in parallel from Phase 4 onwards. Writing tests as you implement each phase is ideal — start with auth tests while doing Phase 4, add payment tests during Phase 7, etc.
