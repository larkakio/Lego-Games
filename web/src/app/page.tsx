import Link from "next/link";
import { WalletSection } from "@/components/WalletSection";

export default function HomePage() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-lg flex-col items-center px-4 pb-20 pt-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.4) 2px, rgba(0,240,255,0.4) 3px)",
        }}
      />
      <header className="relative z-10 mb-10 text-center">
        <p className="mb-2 font-mono text-[10px] tracking-[0.5em] text-fuchsia-400/80">
          BASE · ARCADE
        </p>
        <h1 className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-lime-300 bg-clip-text font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          NEON BRICK GRID
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
          Swipe the holo field. Slide the neon brick onto the EXIT tile. Clear
          sectors to unlock the next route.
        </p>
      </header>

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-3">
        <Link
          href="/play/1"
          className="rounded border border-cyan-400/50 bg-cyan-500/10 py-4 text-center text-sm font-semibold tracking-wide text-cyan-100 shadow-[0_0_24px_rgba(0,240,255,0.15)]"
        >
          Enter sector 1
        </Link>
        <Link
          href="/levels"
          className="rounded border border-slate-700 py-3 text-center text-xs font-mono text-slate-400"
        >
          Level map
        </Link>
      </div>

      <WalletSection />
    </main>
  );
}
