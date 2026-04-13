import type { Direction, GameState, LevelDef } from "./types";

const DR: Record<Direction, number> = {
  up: -1,
  down: 1,
  left: 0,
  right: 0,
};
const DC: Record<Direction, number> = {
  up: 0,
  down: 0,
  left: -1,
  right: 1,
};

function key(r: number, c: number) {
  return `${r},${c}`;
}

function isWall(level: LevelDef, r: number, c: number) {
  return level.walls.includes(key(r, c));
}

export function initialState(level: LevelDef): GameState {
  return {
    levelId: level.id,
    player: { ...level.playerStart },
    moves: 0,
    won: false,
    lost: false,
  };
}

/** Slide the player brick until blocked by wall, grid edge, or goal (pass through empty). */
export function applySwipe(
  level: LevelDef,
  state: GameState,
  dir: Direction,
): GameState {
  if (state.won || state.lost) {
    return state;
  }

  const dr = DR[dir];
  const dc = DC[dir];
  let { r, c } = state.player;
  const { rows, cols, goal } = level;

  while (true) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
      break;
    }
    if (isWall(level, nr, nc)) {
      break;
    }
    r = nr;
    c = nc;
    if (r === goal.r && c === goal.c) {
      const moves = state.moves + 1;
      return {
        ...state,
        player: { r, c },
        moves,
        won: true,
        lost: false,
      };
    }
  }

  const moves = state.moves + 1;
  const onGoal = r === goal.r && c === goal.c;
  let lost: boolean = state.lost;
  if (!onGoal && level.moveBudget != null && moves >= level.moveBudget) {
    lost = true;
  }

  return {
    ...state,
    player: { r, c },
    moves,
    won: onGoal,
    lost,
  };
}
