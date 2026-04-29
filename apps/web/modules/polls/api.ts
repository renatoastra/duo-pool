"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc-client";

// TanStack Query hooks for polls. This file owns query invalidation —
// components only do UI feedback. (Same rule as duo-admin starter.)

export function usePolls() {
  return useQuery({
    queryKey: ["polls", "list"],
    queryFn: () => orpc.polls.list(),
  });
}

export function usePoll(slug: string | undefined) {
  return useQuery({
    queryKey: ["polls", "get", slug],
    queryFn: slug ? () => orpc.polls.get({ slug }) : undefined,
    enabled: !!slug,
  });
}

export function usePollResults(slug: string | undefined) {
  return useQuery({
    queryKey: ["polls", "results", slug],
    queryFn: slug ? () => orpc.polls.results({ slug }) : undefined,
    enabled: !!slug,
    refetchInterval: 2_000, // Live results — polling every 2s during the talk.
  });
}

/**
 * Client-side fallback for the server-side redirect in `app/poll/[slug]/page.tsx`.
 * The RSC redirect is the primary mechanism; this hook covers hot-reload edge
 * cases where the server route briefly serves the vote screen with a stale
 * cookie. See ADR-001 / spec section "Server-side redirect".
 */
export function useHasVoted(slug: string | undefined) {
  return useQuery({
    queryKey: ["polls", "hasVoted", slug],
    queryFn: slug ? () => orpc.polls.hasVoted({ slug }) : undefined,
    enabled: !!slug,
  });
}

/**
 * useVote() — calls `polls.vote` and invalidates results + hasVoted on success.
 *
 * The procedure resolves slug→pollId server-side and reads the voter id from
 * the `dp_voter` cookie context (the `voterCookie` in the input is part of the
 * contract for demo compatibility but is ignored by the server). Components
 * still pass `voterCookie` so the contract validator accepts the payload.
 */
export function useVote(slug: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { pollOptionId: string; voterCookie: string }) =>
      orpc.polls.vote({ slug: slug!, ...input }),
    onSuccess: () => {
      // Invalidation lives in api.ts (per duo-admin rule).
      queryClient.invalidateQueries({ queryKey: ["polls", "results", slug] });
      queryClient.invalidateQueries({ queryKey: ["polls", "hasVoted", slug] });
    },
  });
}
