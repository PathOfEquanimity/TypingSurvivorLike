import { Pos } from "./enemy";

const GRID_Y_LENGTH = 10;
const GRID_X_LENGTH = 20;
const PLAYER_POS: Pos = {
  y: Math.floor(GRID_Y_LENGTH / 2),
  x: Math.floor(GRID_X_LENGTH / 2),
};

export { GRID_X_LENGTH, GRID_Y_LENGTH, PLAYER_POS };
