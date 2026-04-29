import { PollList } from "@/modules/polls/components/PollList";
import { VoteNowButton } from "@/modules/polls/components/VoteNowButton";

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen flex-1 overflow-x-clip bg-background">
      <BackgroundFX />
      <StatusHud />
      <Hero />
      <PollsSection />
      <SiteFooter />
    </main>
  );
}

function BackgroundFX() {
  return (
    <>
      {/* Grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      {/* Scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* Magenta corona top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-72 right-[-18rem] -z-10 h-[44rem] w-[44rem] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-primary), transparent 60%)",
        }}
      />
      {/* Cyan corona bottom-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-72 left-[-18rem] -z-10 h-[40rem] w-[40rem] rounded-full opacity-25 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent), transparent 60%)",
        }}
      />
      {/* Mint highlight mid-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-[-10rem] -z-10 h-[24rem] w-[24rem] rounded-full opacity-15 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-secondary), transparent 60%)",
        }}
      />
    </>
  );
}

function StatusHud() {
  return (
    <div className="border-b border-border/60 bg-background/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-3 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
          </span>
          <span className="text-secondary">live · transmitting</span>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span className="text-accent">[</span>
          <span className="font-bold tracking-[0.34em] text-foreground">
            AWS Cloud Club · Univali
          </span>
          <span className="text-accent">]</span>
        </div>
        <span className="text-foreground">{">"} ready</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="mb-10 font-mono text-[0.7rem] uppercase tracking-[0.45em] text-muted-foreground">
            <span className="text-accent">[ 00 ]</span>
            <span className="mx-3 inline-block h-px w-10 align-middle bg-border" />
            signal · live polls runtime
          </p>

          <h1 className="font-sans font-black leading-[0.84] tracking-tight text-[clamp(3.5rem,12vw,11rem)]">
            <span className="block text-foreground">DUO</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(110deg, var(--color-primary) 0%, var(--color-accent) 55%, var(--color-secondary) 100%)",
              }}
            >
              POOL
            </span>
          </h1>

          <p className="mt-12 max-w-2xl font-serif text-2xl leading-snug text-foreground/95 md:text-3xl">
            AI amplifica.{" "}
            <em className="text-primary [font-style:italic]">
              O processo é seu.
            </em>
          </p>

          <p className="mt-7 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
            <span className="text-accent">{">"}</span> Live polls + engenharia
            de contexto. Talk demo construída ao vivo, no palco. Vote, refresca
            em 2s, sem login — só um{" "}
            <code className="border border-border/60 bg-card/60 px-1.5 py-0.5 text-secondary">
              dp_voter
            </code>{" "}
            anônimo.
          </p>
        </div>

        <aside className="lg:col-span-4 lg:pt-16">
          <div className="relative border border-border bg-card/30 backdrop-blur-md">
            <div className="absolute -top-2.5 left-4 bg-background px-2 font-mono text-[0.6rem] uppercase tracking-[0.35em] text-accent">
              /readme
            </div>
            <dl className="space-y-4 p-6 font-mono text-[0.7rem]">
              <Row k="talk" v="AI Amplifica" />
              <Row k="venue" v="MEETUP #02" highlight />
              <Row k="stack" v="next 16 · oRPC · drizzle · tanstack" />
              <Row k="refresh" v="@ 2000ms" />
            </dl>
          </div>

          <VoteNowButton />

          <p className="mt-6 font-mono text-[0.65rem] leading-relaxed uppercase tracking-[0.18em] text-muted-foreground">
            <span className="text-primary">▮</span> 5-layer flow · drizzle → zod
            → contract → procedure → ui · qualquer agente respeita a
            arquitetura.
          </p>
        </aside>
      </div>

      {/* Marquee strip */}
      <div className="mt-20 overflow-hidden border-y border-border/60 bg-card/20">
        <div className="flex animate-[scroll_40s_linear_infinite] gap-12 whitespace-nowrap py-4 font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
          {Array.from({ length: 6 }).map((_, i) => (
            <MarqueeRow key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/40 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd
        className={`text-right ${highlight ? "text-secondary" : "text-foreground"}`}
      >
        {v}
      </dd>
    </div>
  );
}

function MarqueeRow() {
  const items = [
    "anonymous votes",
    "▲",
    "2-second refresh",
    "▲",
    "context engineering",
    "▲",
    "5-layer data flow",
    "▲",
    "no auth · no tracking",
    "▲",
  ];
  return (
    <>
      {items.map((it, i) => (
        <span
          key={i}
          className={it === "▲" ? "text-primary" : "text-muted-foreground"}
        >
          {it}
        </span>
      ))}
    </>
  );
}

function PollsSection() {
  return (
    <section
      id="ballot"
      className="relative mx-auto max-w-[1400px] scroll-mt-24 border-t border-border/60 px-6 py-20 md:py-28"
    >
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.45em] text-muted-foreground">
            <span className="text-accent">[ 01 ]</span>
            <span className="mx-3 inline-block h-px w-10 align-middle bg-border" />
            ballot
          </p>
          <h2 className="mt-4 font-sans text-4xl font-black tracking-tight md:text-6xl">
            Polls disponíveis
          </h2>
        </div>
        <div className="flex items-center gap-4 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="hidden h-px w-16 bg-border md:block" />
          <span>escolha · vote · veja em tempo real</span>
          <span className="text-primary">→</span>
        </div>
      </header>
      <PollList />
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="relative mx-auto max-w-[1400px] border-t border-border/60 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[0.65rem] uppercase tracking-[0.32em] text-muted-foreground">
        <span>{"// end of transmission"}</span>
        <span className="hidden md:block">
          built live · on stage · 2026.04.29
        </span>
        <span className="text-foreground">{"> duopool"}</span>
      </div>
    </footer>
  );
}
