import { ChangeEvent, ChangeEventHandler, useContext, useEffect, useState } from "react";
import { Status, EnemyObject, focusEnemy } from "./Enemy";
import { useEnemyStore, useWordStore } from "./state";

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

// TODO: now I need to pass something back to the App, which can be done with a global like store

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
  let {getWords, setWords} = useWordStore()

  const [typedWord, setTypedWord] = useState(_typedWord);
  const [wordObject, setWordObject] = useState<{letter: string, color: string}[]>()

  useEffect(() => {
    setTypedWord(_typedWord);
    if (_word != undefined)
        setWordObject(Array.from(_word).map((l, i) => {
            let new_color = _typedWord[i] == l ? "green" : "black" 
            return {letter: l, color: new_color}
        }))
  }, [_typedWord, _word]);

  const onWordTyped = (e: ChangeEvent<HTMLInputElement>) => {
      setTypedWord(e.target.value);
      console.log(e.target.value)
      const filtered = getWords().filter(({key}: {key: string}) => key != name)
      setWords([...filtered, {key: name, typedWord: e.target.value}])
      //update color
      setWordObject(wordObject?.map((obj, i)=> {
          let new_color = e.target.value[i] == obj.letter ? "green" : obj.color
          return {letter: obj.letter, color: new_color}
      }))
  }

  let style = {};
  if (status == Status.Hero){
      style = { backgroundColor: "green" };
  } else if (status == Status.Active && focus) {
    style = { backgroundColor: "", outline: "5px solid red" };
  } else if (status == Status.Active) {
    style = { backgroundColor: "" };
  } else if (status == Status.Inactive) style = { backgroundColor: "yellow" };
   // NOTE: What I want is to create a field, where I display my word, as a list of characters, and as I type, all that's being displayed is the change in colors. So as a first step I can turn word into a a list of nodes, that'll have letter + color. The second step is to create an invisible input button
  return (
    <div key={name} className={"node"} style={style}>
      {status == Status.Active ? (
        <>
          {wordObject?.map(({letter, color}: {letter: string, color: string})=> {
              return <span style={{color: color, fontSize: "22px", fontWeight: "bold"}}>{letter}</span>
          })}
          <input
            className="invisibleInput"
            style={style}
            autoFocus={focus && status == Status.Active}
            value={typedWord}
            onChange={onWordTyped}
          />
          {/* <span className="toBeTyped">{_word}</span> */}
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export { Node };
