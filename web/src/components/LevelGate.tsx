"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readMaxUnlockedLevel } from "@/lib/progress";

type LevelGateProps = {
  levelId: number;
  children: React.ReactNode;
};

export function LevelGate({ levelId, children }: LevelGateProps) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const max = readMaxUnlockedLevel();
    setAllowed(levelId <= max);
    setReady(true);
  }, [levelId]);

  if (!ready) {
    return (
      <div className="font-mono text-sm text-cyan-500/60">Loading sector…</div>
    );
  }

  if (!allowed) {
    return (
      <div className="max-w-md rounded border border-red-500/30 bg-red-950/20 p-6 text-center">
        <p className="mb-2 text-sm text-red-300">This sector is locked.</p>
        <p className="mb-4 text-xs text-slate-500">
          Clear the previous level to unlock.
        </p>
        <Link
          href="/levels"
          className="text-sm text-cyan-400 underline-offset-4 hover:underline"
        >
          Level map
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
