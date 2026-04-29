import { db } from "@duopool/database";
import { castVote, getPollBySlug } from "@duopool/database/query/polls";
import { ORPCError } from "@orpc/server";
import { pub } from "../../../orpc.ts";

// L5 procedure — polls.vote
//
// Security: the voter cookie is ALWAYS read from `context.voterId` (set by
// the route handler from the dp_voter cookie), NEVER from `input.voterCookie`.
// `input.voterCookie` is part of the contract for backward demo compatibility
// only; trusting it would be a spoof vector. See CLAUDE.md hard rule #5.
export const voteProc = pub.polls.vote.handler(
  async ({ input, context }) => {
    if (!context.voterId) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Missing voter cookie.",
      });
    }

    const poll = await getPollBySlug(db, input.slug);
    if (!poll) {
      throw new ORPCError("NOT_FOUND", { message: "Poll not found." });
    }

    const result = await castVote(db, {
      pollId: poll.id,
      pollOptionId: input.pollOptionId,
      voterCookie: context.voterId,
    });

    return "ok" in result
      ? ({ status: "ok" } as const)
      : ({ status: "alreadyVoted" } as const);
  },
);
