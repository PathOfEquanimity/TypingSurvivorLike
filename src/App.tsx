import { useState, useEffect } from 'react'
import './App.css'
import {EnemyObject} from "./Enemy.tsx" 
import {GameMap} from "./GameMap.tsx"

function App() {
  const [enemies, setEnemies] = useState<EnemyObject[]>([])
  useEffect(() => {
    setEnemies([{name: "strong_one"}])
  },[])
  
  return (
    <>
        <GameMap enemies={enemies} />
    </>
  )
}

export default App
