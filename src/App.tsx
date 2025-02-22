import { useState, useEffect, createContext } from "react";
import "./App.css";
import {
  EnemyObject,
  Status,
  Pos,
  findDistance,
  focusEnemy,
} from "./Enemy.tsx";
import {
  GameMap,
  PLAYER_POS,
  GRID_Y_LENGTH,
  GRID_X_LENGTH,
} from "./GameMap.tsx";
import { words } from "./words1k.json";
import LifeBar from "./LifeBar.tsx";

const MAX = 100 + 1; // account for exclusivity
const MIN = 1;
const ACTIVATION_THRESHOLD = 80;
const MAX_LIFE = 3;
const DAMAGE = 1;

const constructEnemies = (n: number) => {
  const scrambled = words.sort(() => Math.random() - 0.5);
  const n_words = scrambled.slice(0, n);
  console.log(n_words);
  return n_words.map((word, i) => {
    return {
      name: `s${i}`,
      word: word,
      position: {
        y: Math.floor(Math.random() * GRID_Y_LENGTH),
        x: Math.floor(Math.random() * GRID_X_LENGTH),
      },
      status: Status.Inactive,
      focus: false,
    };
  });
};

const EnemyContext = createContext({});

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

const ENEMIES = constructEnemies(10);

function App() {
  const [enemies, setEnemies] = useState<EnemyObject[]>(ENEMIES);
  const [word, setWord] = useState("");
  const [life, setLife] = useState(MAX_LIFE);
  const [restart, setRestart] = useState(false);
  // Enemies interaction
  useEffect(() => {
    let tracked_life = MAX_LIFE;
    let timesRun = 0;
    const interval = setInterval(() => {
      if (tracked_life <= 0) {
        window.alert("You lost")
        setEnemies(constructEnemies(10));
        setWord("");
        setLife(MAX_LIFE);
        setRestart(!restart);
        return () => clearInterval(interval);
      }
      timesRun++;
      const visited: Pos[] = [];
      let new_enemies = enemies.map((enemy) => {
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
          tracked_life -= DAMAGE;
          setLife(tracked_life);
          // TODO: now it sets on when it was on player square for one, move rather than when it's about to hit. The easy to fix it to take the area around the player and check for it instead for the play_pos
        } else if (enemy.status == Status.Active) {
          enemy.position = nextStep(enemy.position, PLAYER_POS, visited);
          visited.push(enemy.position);
        }
        return enemy;
      });
      new_enemies = focusEnemy(new_enemies);
      // Check if there's no active focus
      setEnemies(new_enemies);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [restart]);

  return (
    <>
      <LifeBar life={life} maxLife={MAX_LIFE} />
      <EnemyContext.Provider value={{ enemies, setEnemies, word, setWord }}>
        <GameMap enemies={enemies} />
      </EnemyContext.Provider>
    </>
  );
}

export { App, EnemyContext };
