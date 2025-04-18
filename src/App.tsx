import { useState, useEffect, createContext, useRef } from "react";
import "./App.css";
import {
  EnemyObject,
  Status,
  Pos,
  findDistance,
  focusEnemy,
} from "./Enemy.tsx";
import {
  PLAYER_POS,
} from "./constants.tsx";
import { GameMap } from "./GameMap.tsx";
import LifeBar from "./LifeBar.tsx";
import { useStore } from "./state.tsx";

const MAX = 10000 + 1; // account for exclusivity
const MIN = 1;
const ACTIVATION_THRESHOLD = 9900;
const MOVEMENT_THRESHOLD = 1;
const MAX_LIFE = 3;
const DAMAGE = 1;


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


//NOTE: what exactly am I trying to improve by introducing global state?
// Sure it solves the issue of props drill downs but that's not what I had problems with

// TODO: refactor the game loop to use the requestAnimationFrame, and change the logic to support it, and see if it sovles my problems
function App() {
    const [init, setInit] = useState(false)
    const {createEnemies, getEnemies, setEnemies} = useStore()
    const gameLogic = (delta: number) => {
        const enemies = getEnemies()
        // throw Error;
          const visited: Pos[] = [];
          if(!enemies)
              return;
          if (enemies.every(({status})=> status == Status.Disabled)) throw Error;
          let new_enemies = enemies!.map((enemy: EnemyObject) => {
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
              // TODO: now it sets on when it was on player square for one, move rather than when it's about to hit. The easy to fix it to take the area around the player and check for it instead for the play_pos
            } else if (enemy.status == Status.Active) {
                // TODO: how can I update enemy position with delta in mind?
                // Currently position is based on a very small grid, and renders are not smooth at all, I don't want to have multiple boxes per node, to much effort. So one way to enable movement, is to increase position by delta passed. Another way to do this, is to say that 100 cycles will be equal to one move,
                // The problem is, I don't have pixels, but rather I have 2d grid, with a very limited number of elements.
                //
                enemy.timeActivated += delta
                if (enemy.timeActivated >= MOVEMENT_THRESHOLD){
                      enemy.position = nextStep(enemy.position, PLAYER_POS, visited);
                      visited.push(enemy.position);
                      enemy.timeActivated = 0
                }
            }
            return enemy;
          });
          new_enemies = focusEnemy(new_enemies);
          // Check if there's no active focus
          //
          setEnemies(new_enemies);
    }
  // Note: this is basically the 60 fps rendering, that I could've ahcieved with interval, but with more issues. So now, I need to adapt my previous game logic to this
  // Delta is amount of time passed since previous render, so I can update the position of my objets smooth like, because delta can change a bit, and if we don't account for it and always render at the same pace, there will be stuttering, a slow down in the movement 
  const lastTimeRef = useRef(0);
  const totalDelta = useRef(0);

  useEffect(() => {
        if (!init){
            createEnemies(10)
            setInit(true)
        }

       let animationFrameId: number;

        const gameLoop = (timestamp: DOMHighResTimeStamp) => {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;
            const deltaTime = (timestamp - lastTimeRef.current) / 1000; // Convert to seconds
            lastTimeRef.current = timestamp;
            totalDelta.current += deltaTime

            // gameLogic(deltaTime)
            if (totalDelta.current >= 0.1){
                gameLogic(totalDelta.current)
                totalDelta.current = 0
            }
            animationFrameId = requestAnimationFrame(gameLoop);
        };

        animationFrameId = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animationFrameId); 
  })
    // return <h1>Enemy Position: {JSON.stringify(getEnemies()?.map(({timeActivated})=> Math.round(timeActivated)))}</h1>;
    //
  return (
    <>
        {/* <LifeBar life={life} maxLife={MAX_LIFE} /> */}
        <GameMap />
    </>
  );
}

export { App };
