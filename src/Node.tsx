import { useContext, useState } from "react";
import { Status, EnemyObject, focusEnemy } from "./Enemy";
import { useStore } from "./state";

// NOTE: That's my biggest gripe with the current design 
// Enemy state is updated in two different places, rather than being handled in one
// But I have no idea how to do decoupling, the globalStore wouldn't help. As I would still be updating the state from two places. The only other idea I can come up with is, game loop responsibility is rendering, and Node responisbility, well is just setting state. For that I need some kind of store, where I can put data, and the loop would take care of it

// NOTE: let's define responsibilities
// The responsibility of the game loop is:
// 1. Move enemies 
// 2. Determine win condition 
// Responsibility of Map
// 1. Display Nodes
// Responsibility of Node
// 1. Update state of the enemy based on the word that's being typed

function Node({
  name,
  status,
  _word,
  focus,
  _typedWord,
}: {
  name: string;
  status: Status;
  _word: string;
  focus: boolean;
  _typedWord: string;
}) {
  let { getEnemies, setEnemies } = useStore();
  const [typedWord, setTypedWord] = useState(_typedWord);
  let style = {};
  if (status == Status.Hero){
      style = { backgroundColor: "green" };
  } else if (status == Status.Active && focus) {
    style = { backgroundColor: "red", outline: "5px solid blue" };
  } else if (status == Status.Active) {
    style = { backgroundColor: "red" };
  } else if (status == Status.Inactive) style = { backgroundColor: "yellow" };
    
  return (
    <div key={name} className={"node"} style={style}>
      {status == Status.Active ? (
        <>
          <span className="typed">{_typedWord}</span>
          <input
            className="input"
            style={style}
            autoFocus={focus && status == Status.Active}
            value={typedWord}
            // value={focus && status == Status.Active ? typedWord : ""}
            onChange={(e) => {
              // wordRef.current = { name: name, word: _typedWord + e.target.value };
              getEnemies().map((enemy: EnemyObject) => {
                if (enemy.name == name) {
                  console.log(`I'm ${enemy.name} and this's my untyped word 
                              ${enemy.typedWord} and init word is ${_typedWord}
                                and the typedWord is ${typedWord}
                              `);
                }
              });
              setTypedWord(e.target.value);
            // Typed correct word
              if (e.target.value == _word) {
                setEnemies(
                  focusEnemy(
                    getEnemies().map((enemy: EnemyObject) => {
                      if (enemy.name == name) {
                        enemy.status = Status.Disabled;
                        enemy.focus = false;
                      }
                      return enemy;
                    }),
                  ),
                );
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

export { Node };
