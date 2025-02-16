import { useState, useEffect } from 'react'
import './App.css'
import { EnemyObject } from "./EnemyObject.tsx"
import { GameMap } from "./GameMap.tsx"
import { PlayerObject } from './PlayerObject.tsx'

const GRID_SIZE = 15;

let enemyId = 0;

function getRandomEnemy(): EnemyObject {
  const x = Math.floor(Math.random() * GRID_SIZE);
  const y = Math.floor(Math.random() * GRID_SIZE);
  const words = ["warrior", "mage", "thief"];
  const movesTowardsPlayer = [true, false];

  enemyId += 1;

  return {
    name: `enemy_${enemyId}`,
    status: "inactive",
    x,
    y,
    word: words[Math.floor(Math.random() * words.length)],
    moves_towards_player: movesTowardsPlayer[Math.floor(Math.random() * movesTowardsPlayer.length)]
  };
}

function App() {
  const [enemies, setEnemies] = useState<EnemyObject[]>([])
  const [player] = useState<PlayerObject>({
    name: "Player1",
    word: "example",
    score: 0,
    lifeBar: 100,
    x: Math.floor(GRID_SIZE / 2),
    y: Math.floor(GRID_SIZE / 2)
  });

  useEffect(() => {
    const newEnemies = Array.from({ length: 3 }, () => getRandomEnemy());
    setEnemies(newEnemies);
  }, [])

  return (
    <>
      <GameMap gridSize={GRID_SIZE} enemies={enemies} player={player} />
    </>
  );
}

export default App;
