import {
  getProc,
  hasVotedProc,
  listProc,
  resultsProc,
  voteProc,
} from "./modules/polls/procedures/index.ts";

// oRPC router — wires every procedure into a single tree mirroring the
// contract shape. The shape `{ polls: { list, get, results, hasVoted, vote } }`
// matches `contract.polls.{list, get, results, hasVoted, vote}` exactly so
// type inference works end-to-end for the frontend orpcClient.

export const router = {
  polls: {
    list: listProc,
    get: getProc,
    results: resultsProc,
    hasVoted: hasVotedProc,
    vote: voteProc,
  },
};

export type Router = typeof router;
