"use client";

export function VoteNowButton() {
  return (
    <button
      type="button"
      onClick={() => {
        const target = document.getElementById("ballot");
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="group relative mt-6 flex w-full items-center justify-between border border-primary bg-primary px-6 py-4 font-sans text-sm font-black uppercase tracking-[0.32em] text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:-translate-y-0.5"
      style={{
        boxShadow:
          "0 0 0 1px var(--color-primary), 0 0 24px 2px color-mix(in oklch, var(--color-primary) 50%, transparent), 0 0 60px 8px color-mix(in oklch, var(--color-primary) 25%, transparent)",
      }}
    >
      <span className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="flex items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
        </span>
        Vote agora
      </span>
      <span className="flex items-center gap-2">
        <span className="h-px w-6 bg-primary-foreground/60 transition-all duration-300 group-hover:w-12" />
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </button>
  );
}
