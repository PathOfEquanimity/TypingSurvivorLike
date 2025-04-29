import { useState, useEffect, useRef } from "react";
import "./App.css";
import {
  EnemyObject,
  Status,
  Pos,
  findDistance,
  focusEnemy,
} from "./Enemy.tsx";
import { PLAYER_POS } from "./constants.tsx";
import { GameMap } from "./GameMap.tsx";
import LifeBar from "./LifeBar.tsx";
import { useEnemyStore, useWordStore } from "./state.tsx";

const MAX = 10000 + 1; // account for exclusivity
const MIN = 1;
const ACTIVATION_THRESHOLD = 9900;
const MOVEMENT_THRESHOLD = 1;
const MAX_LIFE = 3;
const DAMAGE = 1;

function nextStep(
  current: Pos,
  target: Pos,
  visited: Pos[],
  allPositions: Pos[],
) {
  const options = [
    { y: 0, x: 1 },
    { y: 1, x: 0 },
    { y: -1, x: 0 },
    { y: 0, x: -1 },
    { y: 1, x: 1 },
    { y: 1, x: -1 },
    { y: -1, x: 1 },
    { y: -1, x: -1 },
  ];
  const final = options.reduce(
    (acc: { pos: Pos; distance: number }, { y, x }) => {
      const new_current = { y: current.y + y, x: current.x + x };
      if (
        visited.find((e) => new_current.y == e.y && new_current.x == e.x) !=
          undefined ||
        allPositions.find(
          (e) => new_current.y == e.y && new_current.x == e.x,
        ) != undefined
      ) {
        return acc;
      }
      const distance = findDistance(new_current, target);
      return acc.distance <= distance
        ? acc
        : { pos: new_current, distance: distance };
    },
    { pos: { y: 0, x: 0 }, distance: 100 },
  );
  return final.pos;
}

function App() {
  const [init, setInit] = useState(false);
  const [life, setLife] = useState(MAX_LIFE);

  const { createEnemies, getEnemies, setEnemies } = useEnemyStore();
  const { getWords } = useWordStore();

  const lastTimeRef = useRef(0);
  const totalDelta = useRef(0);

  useEffect(() => {
    if (!init) {
      createEnemies(10, 3);
      setInit(true);
    }

    let animationFrameId: number;
    let localLife = life;

    const gameLogic = (delta: number) => {
      const enemies = getEnemies();
      if (localLife <= 0) {
        location.reload();
        return;
      }
      let newLife = localLife;
      const visited: Pos[] = [];
      if (!enemies) return;
      if (
        enemies.every(
          ({ status }: { status: Status }) => status == Status.Disabled,
        )
      )
        throw Error;
      let new_enemies = enemies!.map((enemy: EnemyObject) => {
        const words = getWords().find(
          ({ key }: { key: string }) => key == enemy.name,
        );

        if (words != undefined) {
          enemy.typedWord = words.typedWord;
        }
        if (enemy.status == Status.Active && enemy.typedWord == enemy.word) {
          enemy.status = Status.Disabled;
          enemy.focus = false;
        }

        if (enemy.status == Status.Inactive) {
          // TODO: improve threshold activation
          if (Math.random() * (MAX - MIN) + MIN >= ACTIVATION_THRESHOLD)
            enemy.status = Status.Active;
        } else if (
          enemy.position.y == PLAYER_POS.y &&
          enemy.position.x == PLAYER_POS.x &&
          enemy.status == Status.Active
        ) {
          enemy.status = Status.Disabled;
          enemy.focus = false;
          newLife -= 1;
        } else if (enemy.status == Status.Active) {
          enemy.timeActivated += delta;
          if (enemy.timeActivated >= MOVEMENT_THRESHOLD) {
            const allPositions = enemies.reduce(
              (
                acc: Pos[],
                { position, status }: { position: Pos; status: Status },
              ) => {
                if ([Status.Active, Status.Inactive].includes(status))
                  return [...acc, position];
                return acc;
              },
              [],
            );
            enemy.position = nextStep(
              enemy.position,
              PLAYER_POS,
              visited,
              allPositions,
            );
            visited.push(enemy.position);
            enemy.timeActivated = 0;
          }
        }
        return enemy;
      });

      new_enemies = focusEnemy(new_enemies);
      setEnemies(new_enemies);
      setLife(newLife);
      localLife = newLife;
    };

    const gameLoop = (timestamp: DOMHighResTimeStamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = (timestamp - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = timestamp;
      totalDelta.current += deltaTime;

      if (totalDelta.current >= 0.1) {
        gameLogic(totalDelta.current);
        totalDelta.current = 0;
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  //
  return (
    <>
      <LifeBar life={life} maxLife={MAX_LIFE} />
      <GameMap />
    </>
  );
}

export { App };
