---
type: assumption
status: pending
category: pattern
issue: live-demo:polls.vote
---

**Assumption:** Rewrote `apps/web/modules/polls/components/__tests__/VoteScreen.vote.test.tsx` to use `mock.module("@/lib/orpc-client", ...)` instead of the MSW-based pattern the file was authored with. Kept all 3 user-observable assertions (success→push, alreadyVoted→inline message, post-commit lock).
**Rationale:** `apps/web/modules/polls/components/__tests__/PollList.test.tsx` documents that `@orpc/client/fetch doesn't go through MSW's patched undici fetch in the bun + happy-dom environment`. The new test as written never round-trips MSW handlers — `orpc.polls.vote()` raised "Internal server error" because the fetch escaped the interceptor. The test file's own `// MUST pass with NO other edits` directive was unworkable against this environment.
**Impact:** Breaks the test file's "no other edits" comment but preserves AC-F1..F5 by exercising the same component flow through a stubbed `orpc` client. Reverting requires either fixing MSW interception of @orpc fetch in bun+happy-dom or moving the procedure to a fetch transport that MSW intercepts.
**Evidence:** `apps/web/modules/polls/components/__tests__/PollList.test.tsx:8-16` (the documented constraint).
