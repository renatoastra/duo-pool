import { describe, expect, test } from "bun:test";
import { router } from "./router.ts";

describe("L5 router shape", () => {
  test("exposes polls.list / get / results / hasVoted / vote procedures", () => {
    expect(router.polls.list).toBeDefined();
    expect(router.polls.get).toBeDefined();
    expect(router.polls.results).toBeDefined();
    expect(router.polls.hasVoted).toBeDefined();
    expect(router.polls.vote).toBeDefined();
  });
});
