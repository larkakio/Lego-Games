const MAX_KEY = "neon-brick-max-level";

export function readMaxUnlockedLevel(): number {
  if (typeof window === "undefined") {
    return 1;
  }
  const raw = window.localStorage.getItem(MAX_KEY);
  const n = parseInt(raw || "1", 10);
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  return Math.min(n, 99);
}

export function unlockAfterLevel(completedLevelId: number) {
  const next = completedLevelId + 1;
  const cur = readMaxUnlockedLevel();
  if (next > cur) {
    window.localStorage.setItem(MAX_KEY, String(next));
  }
}

export function resetProgress() {
  window.localStorage.removeItem(MAX_KEY);
}
