import { EnemyObject, constructEnemies } from "./Enemy";
import { create } from 'zustand'


type Store = {
  enemies?: EnemyObject[] 
  getEnemies: CallableFunction
  enemyFocused?: Boolean
  createEnemies: (n: number) => void
  setEnemies: CallableFunction
}

const useStore = create<Store>()((set, get) => ({
  enemies: undefined,
  getEnemies: () => get().enemies,
  enemyFocused: undefined,
  createEnemies: (n: number) => set((state) => ({...state, enemies: constructEnemies(n)})),
  setEnemies: set,
}))



export {useStore}
