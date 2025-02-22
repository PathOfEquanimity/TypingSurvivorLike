import { PLAYER_POS } from "./GameMap";

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
  typedWord?: string;
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

function Enemy() {
  return <p>Hello world</p>;
}

export { Enemy, type EnemyObject, type Pos, Status, findDistance, focusEnemy };
