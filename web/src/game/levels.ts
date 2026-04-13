import type { LevelDef } from "./types";

/** Handcrafted solvable neon-grid levels (swipe to slide until blocked). */
export const LEVELS: readonly LevelDef[] = [
  {
    id: 1,
    name: "Boot Sector",
    rows: 5,
    cols: 5,
    walls: ["2,2"],
    goal: { r: 0, c: 2 },
    playerStart: { r: 4, c: 2 },
    moveBudget: 20,
  },
  {
    id: 2,
    name: "Neon Maze",
    rows: 6,
    cols: 6,
    walls: ["2,1", "2,2", "2,3", "2,4"],
    goal: { r: 0, c: 2 },
    playerStart: { r: 5, c: 2 },
    moveBudget: 28,
  },
  {
    id: 3,
    name: "Arc Overload",
    rows: 7,
    cols: 7,
    walls: [
      "3,1",
      "3,2",
      "3,3",
      "3,4",
      "3,5",
    ],
    goal: { r: 0, c: 3 },
    playerStart: { r: 6, c: 3 },
    moveBudget: 40,
  },
];

export function getLevel(id: number): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id);
}
