import { EnemyContext } from "./App";
import { useContext, useState } from "react";
import { Status, EnemyObject, focusEnemy  } from "./Enemy";

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
}) {
  let { enemies, setEnemies, word, setWord } = useContext(EnemyContext);
  const [typedWord, setTypedWord] = useState("")
  let style = {};
  if (status == Status.Hero) style = { backgroundColor: "green" };
  else if (status == Status.Active && focus) {
    style = { backgroundColor: "red", outline: "5px solid blue" };
  } else if (status == Status.Active) {
    style = { backgroundColor: "red" };
  } else if (status == Status.Inactive) style = { backgroundColor: "yellow" };
  return (
    <div key={name} className={"node"} style={style}>
      {status == Status.Active ? (
        <>
          <span className="typed">{word}</span>
          <input
            className="input"
            style={style}
            autoFocus={focus && status == Status.Active}
            value={focus && status == Status.Active ? word : ""}
            onChange={(e) => {
              setWord(e.target.value);
              if (e.target.value == _word) {
                setEnemies(
                  focusEnemy(
                    enemies.map((enemy: EnemyObject) => {
                      if (enemy.name == name) {
                        enemy.status = Status.Disabled;
                        enemy.focus = false;
                      }
                      return enemy;
                    }),
                  ),
                );
                setWord("");
              }
            }}
          />
      <span className="toBeTyped">{_word}</span>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export {Node}
