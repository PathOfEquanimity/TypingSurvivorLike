import { GRID_Y_LENGTH, GRID_X_LENGTH, PLAYER_POS } from "@/utils/constants.ts";
import { words } from "@/assets/words1k.json";

export const constructEnemies = (n: number, donutThreshold: number) => {
  const scrambled = words.sort(() => Math.random() - 0.5);
  const n_words = scrambled.slice(0, n);
  return n_words.map((word, i) => {
    const [ymin, ymax] = [
      [0, Math.floor(GRID_Y_LENGTH / 2) - donutThreshold],
      [Math.floor(GRID_Y_LENGTH / 2) + donutThreshold, GRID_Y_LENGTH],
    ][Math.floor(Math.random() * 2)];
    const [xmin, xmax] = [
      [0, Math.floor(GRID_X_LENGTH / 2) - donutThreshold],
      [Math.floor(GRID_X_LENGTH / 2) + donutThreshold, GRID_X_LENGTH],
    ][Math.floor(Math.random() * 2)];
    return {
      name: `s${i}`,
      word: word,
      position: {
        y: Math.floor(Math.random() * (ymax - ymin + 1)) + ymin,
        x: Math.floor(Math.random() * (xmax - xmin + 1)) + xmin,
      },
      status: Status.Inactive,
      focus: false,
      typedWord: "",
      timeActivated: 0,
    };
  });
};

enum Status {
  Active,
  Inactive,
  Disabled,
  Hero,
}

interface Pos {
  y: number;
  x: number;
}

interface EnemyObject {
  name: string;
  position: Pos;
  status: Status;
  word: string;
  focus: boolean;
  typedWord: string;
  timeActivated: number;
}

const findDistance = (p1: Pos, p2: Pos) => {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;
  return Math.abs(a) + Math.abs(b);
};

const focusEnemy = (enemies: EnemyObject[]) => {
  const focused_enemy = enemies.find(
    (enemy) => enemy.focus == true && enemy.status == Status.Active,
  );
  if (focused_enemy === undefined) {
    const final = enemies.reduce(
      (acc: { distance: number; enemy_key: string }, enemy: EnemyObject) => {
        if (enemy.status == Status.Active) {
          const current_enemy_distance = findDistance(
            enemy.position,
            PLAYER_POS,
          );
          return current_enemy_distance < acc.distance
            ? { distance: current_enemy_distance, enemy_key: enemy.name }
            : acc;
        }
        return acc;
      },
      { distance: 100, enemy_key: "invalid" },
    );
    enemies = enemies.map((enemy) => {
      if (enemy.name == final.enemy_key) {
        enemy.focus = true;
      }

      return enemy;
    });
  }

  return enemies;
};

export { type EnemyObject, type Pos, Status, findDistance, focusEnemy };
