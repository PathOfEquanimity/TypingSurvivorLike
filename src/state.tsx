import { EnemyObject, constructEnemies } from "./Enemy";
import { create } from 'zustand'

interface TypedWord {
    key: string
    typedWord: string
}


type EnemyStore = {
  enemies?: EnemyObject[] 
  getEnemies: CallableFunction
  enemyFocused?: Boolean
  createEnemies: (n: number) => void
  setEnemies: CallableFunction
}

type StateStore = {
  typedWords: TypedWord[]
  getWords: CallableFunction
  setWords: CallableFunction
}

const useWordStore = create<StateStore>()((set, get) => ({
  typedWords: [],
  getWords: () => get().typedWords,
  setWords: (words: TypedWord[]) => set((state) => ({...state, typedWords: words})),
}))

const useEnemyStore = create<EnemyStore>()((set, get) => ({
  enemies: undefined,
  getEnemies: () => get().enemies,
  enemyFocused: undefined,
  createEnemies: (n: number) => set((state) => ({...state, enemies: constructEnemies(n)})),
  setEnemies: set,
}))



export {useEnemyStore, useWordStore}
