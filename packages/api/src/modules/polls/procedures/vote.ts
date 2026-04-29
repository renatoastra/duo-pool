import { db } from "@duopool/database";
import { castVote, getPollBySlug } from "@duopool/database/query/polls";
import { ORPCError } from "@orpc/server";
import { pub } from "../../../orpc.ts";

export const voteProc = pub.polls.vote.handler(async ({ input, context }) => {
  if (!context.voterId) {
    throw new ORPCError("UNAUTHORIZED");
  }
  const poll = await getPollBySlug(db, input.slug);
  if (!poll) {
    throw new ORPCError("NOT_FOUND");
  }
  if (!poll.options.some((o) => o.id === input.pollOptionId)) {
    throw new ORPCError("BAD_REQUEST");
  }
  const result = await castVote(db, {
    pollId: poll.id,
    pollOptionId: input.pollOptionId,
    voterCookie: context.voterId,
  });
  return "ok" in result
    ? { status: "ok" as const }
    : { status: "alreadyVoted" as const };
});
