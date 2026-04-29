"use client";

import Link from "next/link";
import { usePolls } from "../api";

export function PollList() {
  const { data, isLoading, error } = usePolls();

  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-52 animate-pulse border border-border bg-card/40"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-destructive">
        {"// err · "}
        {error.message}
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="border border-dashed border-border/60 bg-card/30 px-6 py-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
          {"// ballot empty · no polls registered"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((poll, i) => (
        <Link
          key={poll.id}
          href={`/poll/${poll.slug}`}
          className="group relative flex h-full flex-col overflow-hidden border border-border bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/60 hover:bg-card/70 hover:-translate-y-1"
        >
          {/* hover glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* corner crosshairs */}
          <span className="pointer-events-none absolute left-2 top-2 h-2 w-2 border-l border-t border-primary/0 transition-colors duration-300 group-hover:border-primary" />
          <span className="pointer-events-none absolute right-2 top-2 h-2 w-2 border-r border-t border-primary/0 transition-colors duration-300 group-hover:border-primary" />
          <span className="pointer-events-none absolute bottom-2 left-2 h-2 w-2 border-b border-l border-primary/0 transition-colors duration-300 group-hover:border-primary" />
          <span className="pointer-events-none absolute bottom-2 right-2 h-2 w-2 border-b border-r border-primary/0 transition-colors duration-300 group-hover:border-primary" />

          {/* index row */}
          <div className="flex items-start justify-between p-7 pb-3 font-mono text-[0.65rem] uppercase tracking-[0.32em]">
            <span className="text-muted-foreground">
              poll/
              <span className="text-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
            </span>
            <span className="flex items-center gap-2 text-secondary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary" />
              </span>
              live
            </span>
          </div>

          {/* question */}
          <div className="flex-1 px-7 pb-8">
            <h3 className="font-sans text-2xl font-bold leading-[1.1] tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
              {poll.question}
            </h3>
            <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
              /{poll.slug}
            </p>
          </div>

          {/* CTA bar */}
          <div className="flex items-center justify-between border-t border-border/60 bg-background/40 px-7 py-4 font-mono text-[0.65rem] uppercase tracking-[0.3em]">
            <span className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
              cast vote
            </span>
            <span className="flex items-center gap-2 text-primary">
              <span className="hidden h-px w-6 bg-primary/40 transition-all duration-300 group-hover:w-12 group-hover:bg-primary md:block" />
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
