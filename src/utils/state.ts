import { EnemyObject, constructEnemies } from "@/utils/enemy";
import { create } from "zustand";

interface TypedWord {
  key: string;
  typedWord: string;
}

type EnemyStore = {
  enemies: EnemyObject[];
  getEnemies: () => EnemyObject[];
  createEnemies: (n: number, donutThreshold: number) => void;
  setEnemies: (enemies: EnemyObject[]) => void;
};

type StateStore = {
  typedWords: TypedWord[];
  getWords: () => TypedWord[];
  setWords: (words: TypedWord[]) => void;
};

const useEnemyStore = create<EnemyStore>()((set, get) => ({
  enemies: [],
  getEnemies: () => get().enemies,
  createEnemies: (n: number, donutThreshold: number) =>
    set((state) => ({
      ...state,
      enemies: constructEnemies(n, donutThreshold),
    })),
  setEnemies: (enemies: EnemyObject[]) =>
    set((state) => ({ ...state, enemies: enemies })),
}));

const useWordStore = create<StateStore>()((set, get) => ({
  typedWords: [],
  getWords: () => get().typedWords,
  setWords: (words: TypedWord[]) =>
    set((state) => ({ ...state, typedWords: words })),
}));

export { useEnemyStore, useWordStore };
