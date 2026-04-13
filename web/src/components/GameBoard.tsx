"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { applySwipe, initialState } from "@/game/engine";
import { LEVELS } from "@/game/levels";
import type { LevelDef } from "@/game/types";
import type { Direction } from "@/game/types";
import { unlockAfterLevel } from "@/lib/progress";

const SWIPE_MIN_PX = 28;

function dirFromDelta(dx: number, dy: number): Direction | null {
  if (Math.abs(dx) < SWIPE_MIN_PX && Math.abs(dy) < SWIPE_MIN_PX) {
    return null;
  }
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }
  return dy > 0 ? "down" : "up";
}

type GameBoardProps = {
  level: LevelDef;
};

export function GameBoard({ level }: GameBoardProps) {
  const [state, setState] = useState(() => initialState(level));
  const startRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setState(initialState(level));
  }, [level]);

  useEffect(() => {
    if (state.won) {
      unlockAfterLevel(level.id);
    }
  }, [state.won, level.id]);

  const reset = useCallback(() => {
    setState(initialState(level));
  }, [level]);

  const onSwipe = useCallback(
    (dir: Direction) => {
      setState((prev) => applySwipe(level, prev, dir));
    },
    [level],
  );

  const grid = useMemo(() => {
    const cells: { r: number; c: number; wall: boolean; goal: boolean }[] =
      [];
    for (let r = 0; r < level.rows; r++) {
      for (let c = 0; c < level.cols; c++) {
        const wall = level.walls.includes(`${r},${c}`);
        const goal = level.goal.r === r && level.goal.c === c;
        cells.push({ r, c, wall, goal });
      }
    }
    return cells;
  }, [level]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const start = startRef.current;
    startRef.current = null;
    if (!start) {
      return;
    }
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const dir = dirFromDelta(dx, dy);
    if (dir) {
      onSwipe(dir);
    }
  };

  const budget = level.moveBudget;
  const movesLeft =
    budget != null ? Math.max(0, budget - state.moves) : null;

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center justify-between font-mono text-xs tracking-widest text-cyan-300/90">
        <span>
          LV {level.id} · {level.name}
        </span>
        <span>
          MOVES {state.moves}
          {budget != null ? ` / ${budget}` : ""}
        </span>
      </div>

      <div
        role="application"
        aria-label="Swipe on the neon grid to slide the brick"
        className="relative touch-none select-none rounded-sm border border-fuchsia-500/40 bg-[#05060a] p-2 shadow-[0_0_40px_rgba(255,0,170,0.12)]"
        style={{
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          startRef.current = null;
        }}
      >
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))`,
          }}
        >
          {grid.map(({ r, c, wall, goal }) => {
            const here = state.player.r === r && state.player.c === c;
            return (
              <div
                key={`${r}-${c}`}
                className={[
                  "relative flex aspect-square items-center justify-center rounded-[3px] border text-[10px]",
                  wall
                    ? "border-slate-800 bg-[#0c0f18] shadow-inner"
                    : goal
                      ? "border-lime-400/60 bg-lime-500/10 shadow-[inset_0_0_12px_rgba(184,255,0,0.25)]"
                      : "border-cyan-500/15 bg-[#0a0d14]",
                ].join(" ")}
              >
                {goal && (
                  <span className="pointer-events-none text-[9px] font-mono text-lime-300/80">
                    EXIT
                  </span>
                )}
                {here && (
                  <div
                    className={[
                      "absolute inset-[3px] rounded-[2px] border-2 border-cyan-300 bg-gradient-to-br from-fuchsia-500/90 to-cyan-400/80 shadow-[0_0_18px_rgba(0,240,255,0.55)]",
                      state.won ? "animate-pulse" : "",
                    ].join(" ")}
                    style={{
                      transform: "skewX(-6deg) rotate(-1deg)",
                      boxShadow:
                        "4px 6px 0 rgba(0,0,0,0.35), 0 0 22px rgba(255,0,170,0.35)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {state.won && (
          <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-sm bg-black/75 p-4 text-center backdrop-blur-sm">
            <p className="font-[family-name:var(--font-display)] text-lg tracking-[0.2em] text-cyan-300">
              SECTOR CLEARED
            </p>
            <p className="text-xs text-slate-400">
              Neon brick synced. Next route unlocked.
            </p>
            {LEVELS.some((l) => l.id === level.id + 1) && (
              <Link
                href={`/play/${level.id + 1}`}
                className="rounded border border-lime-400/60 bg-lime-500/10 px-4 py-2 text-sm font-semibold text-lime-200"
              >
                Next level
              </Link>
            )}
            <button
              type="button"
              onClick={reset}
              className="text-xs text-fuchsia-300 underline-offset-4 hover:underline"
            >
              Replay sector
            </button>
          </div>
        )}

        {state.lost && !state.won && (
          <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-sm bg-black/80 p-4 text-center backdrop-blur-sm">
            <p className="text-sm text-red-400">Move limit reached</p>
            <button
              type="button"
              onClick={reset}
              className="rounded border border-fuchsia-500/50 px-4 py-2 text-sm text-fuchsia-200"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded border border-cyan-500/30 px-3 py-2 text-xs font-mono text-cyan-200/90"
        >
          Restart
        </button>
        {movesLeft !== null && !state.won && (
          <span className="self-center font-mono text-[11px] text-slate-500">
            {movesLeft} swipes left
          </span>
        )}
      </div>
    </div>
  );
}
