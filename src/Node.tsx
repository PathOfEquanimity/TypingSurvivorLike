import { ChangeEvent, useEffect, useState } from "react";
import { Status } from "./Enemy";
import { useWordStore } from "./state";


const findLetterSize = (word_length: number) => {
    const padding = 0;
    const node_size = 80;
    return (node_size - padding) / word_length
    
}

/**
 * Renders a word node that displays each letter with color-coded feedback based on user input and node status.
 *
 * The node visually indicates correct, incorrect, and untyped letters by coloring them green, red, or black, respectively. When active and focused, it provides an invisible input for typing, updating both local and global state as the user types.
 *
 * @param name - Unique identifier for the node.
 * @param status - The current status of the node (e.g., Hero, Active, Inactive).
 * @param _word - The target word to be displayed and typed.
 * @param _focus - Whether the node should be focused for input.
 * @param _typedWord - The current typed input for this node.
 *
 * @returns A React element representing the node with dynamic letter coloring and input handling.
 */
function Node({
  name,
  status,
  _word,
  _focus,
  _typedWord,
}: {
  name: string;
  status: Status;
  _word: string;
  _focus: boolean;
  _typedWord: string;
}) {
  let {getWords, setWords} = useWordStore()

  const [typedWord, setTypedWord] = useState(_typedWord);
  const [wordObject, setWordObject] = useState<{letter: string, color: string}[]>()
  const [focus, setFocus] = useState(_focus)

  useEffect(() => {
    setTypedWord(_typedWord);
    if (_word != undefined)
        setWordObject(Array.from(_word).map((l, i) => {
            let new_color; 
            if (_typedWord[i] == undefined){
                new_color = "black"
            } else if (_typedWord[i] == l){
                new_color = "green"
            } else{
                new_color = "red"
            }
            return {letter: l, color: new_color}
        }))
  }, [_typedWord, _word]);

  useEffect(() => {
        setFocus(focus)
  }, [_focus])

  const onWordTyped = (e: ChangeEvent<HTMLInputElement>) => {
      setTypedWord(e.target.value);
      console.log(e.target.value)
      const filtered = getWords().filter(({key}: {key: string}) => key != name)
      setWords([...filtered, {key: name, typedWord: e.target.value}])
      setWordObject(wordObject?.map((obj, i)=> {
          let new_color = e.target.value[i] == obj.letter ? "green" : obj.color
          return {letter: obj.letter, color: new_color}
      }))
  }

  // let style = {};
  // if (status == Status.Hero){
  //     style = { backgroundColor: "green" };
  // } else if (status == Status.Active && focus) {
  //   style = { backgroundColor: "", outline: "5px solid red" };
  // } else if (status == Status.Active) {
  //   style = { backgroundColor: "" };
  // } else if (status == Status.Inactive) style = { backgroundColor: "yellow" };
  let className = "node"

  if (status == Status.Hero){
      className = "heroNode" 
  } else if (status == Status.Active && focus) {
      className = "activeFocusedNode" 
  } else if (status == Status.Active) {
      className = "activeNode";
  } else if (status == Status.Inactive) {
      className = "inactiveNode"
    }

    return (
    <div key={name} className={className}>
      {status == Status.Active ? (
        <>
          {wordObject?.map(({letter, color}: {letter: string, color: string})=> {
              return <span key={crypto.randomUUID()} style={{color: color, fontSize: `${findLetterSize(_word.length)}px`, fontWeight: "bold"}}>{letter}</span>
          })}
          <input
            className="invisibleInput"
            autoFocus={focus && status == Status.Active}
            value={typedWord}
            onChange={onWordTyped}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export { Node };
