import { EnemyObject, Pos, Status } from "./Enemy.tsx";
import { useContext } from "react";
import { EnemyContext } from "./App.tsx";
import { v4 as uuidv4 } from "uuid";

const GRID_Y_LENGTH = 10;
const GRID_X_LENGTH = 20;
const PLAYER_POS: Pos = {
  y: Math.floor(GRID_Y_LENGTH / 2),
  x: Math.floor(GRID_X_LENGTH / 2),
};

function Node({
  name,
  status,
  _word,
  focus,
}: {
  name: string;
  status: Status;
  _word: string;
  focus: boolean;
  typedWord: string;
}) {
  let { enemies, setEnemies, word, setWord } = useContext(EnemyContext);
  let style = {};
  if (status == Status.Hero) style = { backgroundColor: "green" };
  else if (status == Status.Active) {
    style = { backgroundColor: "red" };
  } else if (status == Status.Inactive) style = { backgroundColor: "yellow" };

  return (
    <div className="node" style={style}>
      {status == Status.Active ? (
        <>
          <div className="toBeTyped">{_word}</div>
          <input
            className="node"
            style={style}
            autoFocus={focus && status == Status.Active}
            value={focus && status == Status.Active ? word : ""}
            onChange={(e) => {
              setWord(e.target.value);
              if (e.target.value == _word) {
                setEnemies(
                  enemies.map((enemy: EnemyObject) => {
                    if (enemy.name == name) {
                      enemy.status = Status.Disabled;
                      enemy.focus = false;
                    }
                    return enemy;
                  }),
                );
                setWord("");
              }
            }}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
}

function GameMap({ enemies }: { enemies: EnemyObject[] }) {
  const grid = [];
  for (let y = 0; y < GRID_Y_LENGTH; y++) {
    const currentRow = [];
    for (let x = 0; x < GRID_X_LENGTH; x++) {
      let status = Status.Hero;
      let word = "Hero";
      let focus = false;
      let key = "h1";
      let typedWord = "";
      if (!(y == PLAYER_POS.y && x == PLAYER_POS.x)) {
        const enemy = enemies.find(
          (enemy) =>
            enemy.position.y == y &&
            enemy.position.x == x &&
            enemy.status != Status.Disabled,
        );
        status = enemy === undefined ? Status.Disabled : enemy.status;
        word = enemy === undefined ? "" : enemy.word;
        focus = enemy === undefined ? false : enemy.focus;
        key = enemy === undefined ? uuidv4() : enemy.name;
        typedWord = typedWord === undefined ? "" : enemy?.typedWord;
      }
      currentRow.push(
        <Node
          typedWord={typedWord}
          name={key}
          status={status}
          _word={word}
          focus={focus}
        ></Node>,
      );
    }
    grid.push(currentRow);
  }

  // NOTE: displays grid
  return (
    <div className="grid">
      {grid.map((row, rowId) => {
        return (
          <div key={rowId}>
            {row.map((node) => {
              return node;
            })}
          </div>
        );
      })}
    </div>
  );
}

export { GameMap, PLAYER_POS };
