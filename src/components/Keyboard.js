import React from "react";


export default function Keyboard({ onInput, onSubmit, guesses, isDone, numGuess, lettersForKeyboard}) {
    const keys1 = `qwertyuiop`.split('');
    const keys2 = `asdfghjkl`.split('');
    const keys3 = `⌫zxcvbnm⏎`.split('');

    function mapKeys(keys) {
        return keys.map((key) => (
            <button
              className={`key ${key === '⏎' || key === '⌫' ? "key--wider" : ""}
               ${lettersForKeyboard[key] ? lettersForKeyboard[key] : ""}`}
              data-key={key}
              onClick={() => {
                if (key === '⏎') onSubmit();
                else {
                  let value = guesses[numGuess];
                  if (key === '⌫') value = value.slice(0, -1);
                  else value = (value + key).slice(0, 5);
                  onInput({ target: { value } });
                }
                navigator?.vibrate(10);
              }}
              disabled={isDone}
            >
              {key}
            </button>
          ))
    }
  
    return (
      <div className="keyboard">
        <div className="keyboard--row">{mapKeys(keys1)}</div>
        <div className="keyboard--row">{mapKeys(keys2)}</div>
        <div className="keyboard--row">{mapKeys(keys3)}</div>
      </div>
    );
  }