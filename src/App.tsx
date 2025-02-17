import { useState, useEffect, createContext, useRef } from "react";
import "./App.css";
import { EnemyObject, Status, Pos } from "./Enemy.tsx";
import { GameMap, PLAYER_POS, GRID_Y_LENGTH, GRID_X_LENGTH } from "./GameMap.tsx";
import {words} from "./words1k.json"


const MAX = 100 + 1; // account for exclusivity
const MIN = 1;
const ACTIVATION_THRESHOLD = 80;


const constructEnemies = (n: number) => {
    const scrambled = words.sort(() => Math.random() - 0.5)
    const n_words = scrambled.slice(0, n)
    return n_words.map((word, i) => {
       return {
            name: `s${i}`,
            word: word,
            position: {y: Math.floor(Math.random() * GRID_Y_LENGTH), x: Math.floor(Math.random() * GRID_X_LENGTH)},
            status: Status.Inactive,
            focus: false
       } 
    })
}

const EnemyContext = createContext({});

function findDistance(p1: Pos, p2: Pos) {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;
  return Math.abs(a) + Math.abs(b);
}

function nextStep(current: Pos, target: Pos, visited: Pos[]) {
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
        undefined
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
  const [enemies, setEnemies] = useState<EnemyObject[]>(constructEnemies(10));
  const [word, setWord] = useState("");
  // Enemies interaction
  useEffect(() => {
    constructEnemies(10)
    let timesRun = 0;
    const interval = setInterval(() => {
      if (timesRun === 10) {
        clearInterval(interval);
      }
      timesRun++;
      const visited: Pos[] = [];
      console.log("Render");
      let new_enemies = enemies.map((enemy) => {
        if (enemy.status == Status.Inactive) {
          // TODO: improve threshold activation
          if (Math.random() * (MAX - MIN) + MIN >= ACTIVATION_THRESHOLD)
            enemy.status = Status.Active;
        } else if (
          enemy.position.y == PLAYER_POS.y &&
          enemy.position.x == PLAYER_POS.x
        ) {
          enemy.status = Status.Disabled;
        } else if (enemy.status == Status.Active) {
          enemy.position = nextStep(enemy.position, PLAYER_POS, visited);
          console.log(visited);
          visited.push(enemy.position);
        }
        return enemy;
      });
      // Check if there's no active focus
      const focused_enemy = new_enemies.find(
        (enemy) => enemy.focus == true && enemy.status == Status.Active,
      );
      if (focused_enemy === undefined) {
        const final = new_enemies.reduce(
          (
            acc: { distance: number; enemy_key: string },
            enemy: EnemyObject,
          ) => {
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
        new_enemies = new_enemies.map((enemy) => {
          if (enemy.name == final.enemy_key) {
            enemy.focus = true;
            console.log(enemy);
          }

          return enemy;
        });
      }
      setEnemies(new_enemies);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <EnemyContext.Provider value={{ enemies, setEnemies, word, setWord }}>
        <GameMap enemies={enemies} />
      </EnemyContext.Provider>
    </>
  );
}

export { App, EnemyContext };
