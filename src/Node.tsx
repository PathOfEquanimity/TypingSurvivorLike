import { ChangeEvent, useEffect, useState } from "react";
import { Status } from "./Enemy";
import { useWordStore } from "./state";

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
              return <span key={crypto.randomUUID()} style={{color: color, fontSize: "22px", fontWeight: "bold"}}>{letter}</span>
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
