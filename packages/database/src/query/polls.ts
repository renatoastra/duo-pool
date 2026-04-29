import { and, asc, eq, sql } from "drizzle-orm";
import type { Database } from "../client.ts";
import { pollOptions, polls, votes } from "../schema/polls.ts";

// Layer 3 — Pure DB functions. Each takes db as the first argument.
// No business rules here. No side effects beyond db.

export async function listPolls(db: Database) {
  return db
    .select({
      id: polls.id,
      slug: polls.slug,
      question: polls.question,
      createdAt: polls.createdAt,
    })
    .from(polls)
    .orderBy(asc(polls.createdAt));
}

export async function getPollBySlug(db: Database, slug: string) {
  const poll = await db.query.polls.findFirst({
    where: eq(polls.slug, slug),
  });
  if (!poll) {
    return null;
  }

  const options = await db
    .select()
    .from(pollOptions)
    .where(eq(pollOptions.pollId, poll.id))
    .orderBy(asc(pollOptions.order), asc(pollOptions.label));

  return { ...poll, options };
}

export async function getResults(db: Database, slug: string) {
  const poll = await db.query.polls.findFirst({
    where: eq(polls.slug, slug),
  });
  if (!poll) {
    return null;
  }

  const rows = await db
    .select({
      optionId: pollOptions.id,
      label: pollOptions.label,
      order: pollOptions.order,
      count: sql<number>`COALESCE(COUNT(${votes.id}), 0)::int`,
    })
    .from(pollOptions)
    .leftJoin(votes, eq(votes.pollOptionId, pollOptions.id))
    .where(eq(pollOptions.pollId, poll.id))
    .groupBy(pollOptions.id, pollOptions.label, pollOptions.order)
    .orderBy(asc(pollOptions.order));

  const total = rows.reduce((acc, r) => acc + r.count, 0);

  return {
    pollId: poll.id,
    slug: poll.slug,
    question: poll.question,
    total,
    options: rows.map((r) => ({
      optionId: r.optionId,
      label: r.label,
      count: r.count,
      percentage: total === 0 ? 0 : Math.round((r.count / total) * 1000) / 10,
    })),
  };
}

export async function hasVoted(
  db: Database,
  input: { voterId: string; pollId: string },
): Promise<boolean> {
  const rows = await db
    .select({ id: votes.id })
    .from(votes)
    .where(
      and(
        eq(votes.voterCookie, input.voterId),
        eq(votes.pollId, input.pollId),
      ),
    )
    .limit(1);
  return rows.length > 0;
}

/**
 * Returns the `pollOptionId` this voter picked on a given poll, or `null`
 * if they have not voted yet. Used by the result page to render
 * "✓ Você votou X" without exposing extra data via the public API.
 */
export async function getUserVote(
  db: Database,
  input: { voterId: string; pollId: string },
): Promise<string | null> {
  const rows = await db
    .select({ pollOptionId: votes.pollOptionId })
    .from(votes)
    .where(
      and(
        eq(votes.voterCookie, input.voterId),
        eq(votes.pollId, input.pollId),
      ),
    )
    .limit(1);
  return rows[0]?.pollOptionId ?? null;
}

export async function castVote(
  db: Database,
  input: { pollId: string; pollOptionId: string; voterCookie: string },
): Promise<{ ok: true } | { alreadyVoted: true }> {
  try {
    await db.insert(votes).values({
      pollId: input.pollId,
      pollOptionId: input.pollOptionId,
      voterCookie: input.voterCookie,
    });
    return { ok: true };
  } catch (error) {
    // ADR-003: UNIQUE (voter_cookie, poll_id) is the source of truth — let
    // the constraint speak (no SELECT pre-check) and translate 23505 here.
    // Match the constraint name so other unique violations bubble up.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: unknown }).code === "23505" &&
      (error as { constraint?: string }).constraint ===
        "votes_voter_poll_unique"
    ) {
      return { alreadyVoted: true };
    }
    throw error;
  }
}
