export type Direction = "up" | "down" | "left" | "right";

export type CellKind = "empty" | "wall" | "goal";

export type LevelDef = {
  id: number;
  name: string;
  rows: number;
  cols: number;
  /** R,C keys "r,c" */
  walls: readonly string[];
  goal: { r: number; c: number };
  playerStart: { r: number; c: number };
  /** Optional max swipes (lose if exceeded) */
  moveBudget?: number;
};

export type GameState = {
  levelId: number;
  player: { r: number; c: number };
  moves: number;
  won: boolean;
  lost: boolean;
};
