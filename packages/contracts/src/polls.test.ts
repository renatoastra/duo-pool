import { describe, expect, test } from "bun:test";
import { pollsContract } from "./polls.ts";

describe("pollsContract", () => {
  test("exposes list / get / results / hasVoted", () => {
    expect(pollsContract.list).toBeDefined();
    expect(pollsContract.get).toBeDefined();
    expect(pollsContract.results).toBeDefined();
    expect(pollsContract.hasVoted).toBeDefined();
  });

  test("exposes vote", () => {
    expect(pollsContract.vote).toBeDefined();
  });
});
