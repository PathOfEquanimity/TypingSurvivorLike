import { Status } from "@/utils/enemy";
import { useEffect, useState } from "react";

const findLetterSize = (word_length: number) => {
  const padding = 0;
  const node_size = 80;
  return (node_size - padding) / word_length;
};

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
  const [wordObject, setWordObject] =
    useState<{ letter: string; color: string }[]>();
  const [focus, setFocus] = useState(_focus);

  useEffect(() => {
    if (_word != undefined)
      setWordObject(
        Array.from(_word).map((l, i) => {
          let new_color;
          if (_typedWord[i] == undefined) {
            new_color = "text-black";
          } else if (_typedWord[i] == l) {
            new_color = "text-green-500";
          } else {
            new_color = "text-red-500";
          }
          return { letter: l, color: new_color };
        }),
      );
  }, [_typedWord, _word]);

  useEffect(() => {
    setFocus(_focus);
  }, [_focus]);

  let className = "node";

  if (status == Status.Hero) {
    className = "heroNode";
  } else if (status == Status.Active && focus) {
    className = "activeFocusedNode";
  } else if (status == Status.Active) {
    className = "activeNode";
  } else if (status == Status.Inactive) {
    className = "inactiveNode";
  }

  return (
    <div key={name} className={className + " nodeBase"}>
      {status == Status.Active ? (
        <>
          {wordObject?.map(
            ({ letter, color }: { letter: string; color: string }, i) => {
              return (
                <span
                  key={`${name}: ${i}`}
                  className={color}
                  style={{
                    // color: color,
                    fontSize: `${findLetterSize(_word.length)}px`,
                    fontWeight: "bold",
                  }}
                >
                  {letter}
                </span>
              );
            },
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export { Node };
