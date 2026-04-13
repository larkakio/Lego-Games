"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LEVELS } from "@/game/levels";
import { readMaxUnlockedLevel } from "@/lib/progress";

export default function LevelsPage() {
  const [maxUnlocked, setMaxUnlocked] = useState(1);

  useEffect(() => {
    setMaxUnlocked(readMaxUnlockedLevel());
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col px-4 pb-16 pt-8">
      <nav className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-xs font-mono text-cyan-500/80">
          Home
        </Link>
      </nav>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-xl tracking-[0.3em] text-cyan-200">
        SECTORS
      </h1>
      <ul className="flex flex-col gap-3">
        {LEVELS.map((l) => {
          const open = l.id <= maxUnlocked;
          return (
            <li key={l.id}>
              {open ? (
                <Link
                  href={`/play/${l.id}`}
                  className="flex items-center justify-between rounded border border-cyan-500/25 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-100 hover:border-fuchsia-500/40"
                >
                  <span>
                    {l.id}. {l.name}
                  </span>
                  <span className="font-mono text-[10px] text-lime-400">OPEN</span>
                </Link>
              ) : (
                <div className="flex items-center justify-between rounded border border-slate-800 px-4 py-3 text-sm text-slate-600">
                  <span>
                    {l.id}. {l.name}
                  </span>
                  <span className="font-mono text-[10px]">LOCKED</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
