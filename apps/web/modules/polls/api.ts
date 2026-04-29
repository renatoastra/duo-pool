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

interface VoteInput {
  slug: string;
  pollOptionId: string;
}

export function useVote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VoteInput) => orpc.polls.vote(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["polls", "results", variables.slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["polls", "hasVoted", variables.slug],
      });
    },
  });
}
