import { describe, expect, test } from "bun:test";
import { pollsContract } from "./polls.ts";

describe("pollsContract", () => {
  test("exposes list / get / results / hasVoted", () => {
    expect(pollsContract.list).toBeDefined();
    expect(pollsContract.get).toBeDefined();
    expect(pollsContract.results).toBeDefined();
    expect(pollsContract.hasVoted).toBeDefined();
  });

  test("exposes vote with correct input/output shape", () => {
    expect(pollsContract.vote).toBeDefined();

    const inputSchema = pollsContract.vote["~orpc"].inputSchema;
    const okParse = inputSchema?.safeParse({
      slug: "demo-poll",
      pollOptionId: "11111111-1111-1111-1111-111111111111",
      voterCookie: "voter-1",
    });
    expect(okParse?.success).toBe(true);

    const outputSchema = pollsContract.vote["~orpc"].outputSchema;
    expect(outputSchema?.safeParse({ status: "ok" }).success).toBe(true);
    expect(outputSchema?.safeParse({ status: "alreadyVoted" }).success).toBe(
      true,
    );
    expect(outputSchema?.safeParse({ status: "nope" }).success).toBe(false);
  });
});
