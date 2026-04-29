/**
 * polls.vote — full user flow.
 *
 * Mocks `@/lib/orpc-client` directly because @orpc/client/fetch doesn't go
 * through MSW's patched fetch in bun + happy-dom (see PollList.test.tsx).
 * Three user-observable assertions:
 *   1. ok → router.push to /poll/<slug>/result
 *   2. alreadyVoted → inline "Voto já registrado" message, no nav
 *   3. after commit, every option button is disabled
 */

import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { renderWithProviders } from "@duopool/test-config/frontend";
import { fireEvent, waitFor } from "@testing-library/react";

const POLL = {
  id: "poll-1",
  slug: "vibecoding-vs-eng-contexto",
  question: "Vibecoding ou Engenharia de Contexto?",
  options: [
    { id: "opt-vibe", label: "Vibecoding" },
    { id: "opt-eng", label: "Engenharia de Contexto" },
  ],
};

const HOLD_MS = 1_000;

type VoteInput = {
  slug: string;
  pollOptionId: string;
};
type VoteResult = { status: "ok" } | { status: "alreadyVoted" };

const orpcState = {
  vote: mock<(input: VoteInput) => Promise<VoteResult>>(() =>
    Promise.resolve({ status: "ok" }),
  ),
};
const routerState = {
  push: mock<(path: string) => void>(() => undefined),
};

mock.module("@/lib/orpc-client", () => ({
  orpc: {
    polls: {
      vote: (input: VoteInput) => orpcState.vote(input),
    },
  },
}));

mock.module("next/navigation", () => ({
  useRouter: () => routerState,
}));

import { VoteScreen } from "../VoteScreen";

function holdAndRelease(button: HTMLElement) {
  fireEvent.pointerDown(button);
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      fireEvent.pointerUp(button);
      resolve();
    }, HOLD_MS + 80),
  );
}

describe("polls.vote — full user flow (live demo target)", () => {
  beforeEach(() => {
    orpcState.vote = mock(() => Promise.resolve({ status: "ok" }));
    routerState.push = mock(() => undefined);
  });

  afterEach(() => {
    // no-op — beforeEach resets state
  });

  test("audience holds Vibecoding → vote registered → taken to the result page", async () => {
    const view = renderWithProviders(<VoteScreen poll={POLL} />);

    const vibecoding = view.getByRole("button", { name: /vibecoding/i });
    expect(vibecoding).toBeInTheDocument();
    expect(vibecoding).toBeEnabled();

    await holdAndRelease(vibecoding);

    await waitFor(() => {
      expect(routerState.push).toHaveBeenCalledWith(
        `/poll/${POLL.slug}/result`,
      );
    });
  }, 5_000);

  test("audience already voted from this device → sees 'Voto já registrado' and stays on the vote page", async () => {
    orpcState.vote = mock(() => Promise.resolve({ status: "alreadyVoted" }));

    const view = renderWithProviders(<VoteScreen poll={POLL} />);

    const vibecoding = view.getByRole("button", { name: /vibecoding/i });
    await holdAndRelease(vibecoding);

    await waitFor(() => {
      expect(view.getByText(/voto já registrado/i)).toBeInTheDocument();
    });
    expect(routerState.push).not.toHaveBeenCalled();
  }, 5_000);

  test("after a committed vote, every option button is disabled — no double commit", async () => {
    orpcState.vote = mock(() => Promise.resolve({ status: "alreadyVoted" }));

    const view = renderWithProviders(<VoteScreen poll={POLL} />);

    const vibecoding = view.getByRole("button", { name: /vibecoding/i });
    await holdAndRelease(vibecoding);

    await waitFor(() => {
      expect(view.getByText(/voto já registrado/i)).toBeInTheDocument();
    });

    expect(view.getByRole("button", { name: /vibecoding/i })).toBeDisabled();
    expect(
      view.getByRole("button", { name: /engenharia de contexto/i }),
    ).toBeDisabled();
  }, 5_000);
});
