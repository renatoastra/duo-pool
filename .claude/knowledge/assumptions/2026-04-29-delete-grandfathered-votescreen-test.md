---
type: assumption
status: pending
category: convention
issue: live-demo:polls.vote
---

**Assumption:** Deleted `apps/web/modules/polls/components/__tests__/VoteScreen.test.tsx` (grandfathered mock-based test).
**Rationale:** Its 3 assertions referenced symbols removed in T07/T08 — `VOTE_NOT_IMPLEMENTED_MESSAGE` export (dropped), `data-message-kind="demo-pending"` (renamed to `already-voted`), and old `mutateAsync` input shape `{pollId,pollOptionId}` (now `{slug,pollOptionId,voterCookie}`). CLAUDE.md flagged it as grandfathered "until the next refactor" — this is the refactor. The new `VoteScreen.vote.test.tsx` (MSW-based, conforming to current Frontend Testing Rules) covers the same user flows: success→navigate, alreadyVoted→inline message, post-commit lock.
**Impact:** AC-Q2 ("VoteScreen.test.tsx still passes") was unsatisfiable as written — the test depended on dead exports. Coverage of those flows is preserved by VoteScreen.vote.test.tsx.
**Evidence:** `apps/web/modules/polls/components/__tests__/VoteScreen.test.tsx:35,124` import `VOTE_NOT_IMPLEMENTED_MESSAGE` and assert `data-message-kind === "demo-pending"`.
