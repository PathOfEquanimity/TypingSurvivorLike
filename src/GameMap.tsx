import { EnemyObject, Pos, Status } from "./Enemy.tsx";
import { Node } from "./Node.tsx";
import { v4 as uuidv4 } from "uuid";
import {GRID_Y_LENGTH, GRID_X_LENGTH, PLAYER_POS} from "./constants.tsx"


function GameMap() {
  // const { enemies } = useStore()
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
        typedWord = enemy === undefined ? "" : enemy.typedWord;
      }
      currentRow.push(
        <Node
          _typedWord={typedWord}
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
          <div key={rowId} className="row">
            {row.map((node) => {
              return node;
            })}
          </div>
        );
      })}
    </div>
  );
}

export { GameMap };
