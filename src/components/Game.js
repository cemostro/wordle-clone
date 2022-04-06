import React, { useState, useEffect, useRef } from "react";
import words from "../words.js";
import Snackbar from '@mui/material/Snackbar';
import Keyboard from "./Keyboard.js"

const getAnswerIndex = () => 9558
// Math.floor(
//     (Date.now() - new Date(2022, 0, 23, 0, 0, 0).getTime()) / 86400e3
// ) % 30;

function useWords() {
    const [allWords, setAllWords] = useState(words);

    const answerIndex = getAnswerIndex();
    return {
        answer: allWords[answerIndex],
        answerIndex: answerIndex,
        isGuessValid: (guess) => allWords.includes(guess),
    };
}


export default function Game() {
    //turn answer into state so that it doesnt autorefresh
    const inputRef = useRef();
    const { answer, answerIndex, isGuessValid } = useWords();
    const [guesses, setGuesses] = useState(/*JSON.parse(localStorage.getItem(answer))?.guesses || */["", "", "", "", "", ""])
    const [numGuess, setNumGuess] = useState(/*JSON.parse(localStorage.getItem(answer))?.numGuess ||*/ 0);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(/*JSON.parse(localStorage.getItem(answer))?.currentLetterIndex ||*/ 0);
    const [message, setMessage] = useState('');
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    console.log(answer);

    useEffect(() => {
        if (message) {
            setSnackBarOpen(true)
        }
    }, [message]);

    useEffect(() => {
        // set cursorposition to end
        inputRef.current.selectionStart = currentLetterIndex;
        inputRef.current.focus()
      }, [answer, guesses]);

    //Save guesses
    useEffect(() => {
        localStorage.setItem(answer, JSON.stringify({
            guesses: guesses,
            numGuess: numGuess,
            currentLetterIndex: currentLetterIndex,
        }));
    }, [guesses, numGuess, currentLetterIndex]);


    const isCorrect = guesses[numGuess - 1] === answer;
    const isDone = isCorrect || numGuess === 6;

    const letterBoxes = [];
    const lettersForKeyboard = {};
    for (let i = 0; i < 6; i++) {
        let row;
        if (!guesses[i]) {
            row = ["", "", "", "", ""];
        } else {
            row = guesses[i].split("");
            while (row.length < 5) {
                row.push("");
            }
        }
        if (i < numGuess) {
            let answerCopy = answer.split("").filter((l, k) => l !== row[k]);
            letterBoxes.push(row.map((letter, j) => {
                const hasLetterIndex = answerCopy.indexOf(letter);
                if (hasLetterIndex !== -1) {
                    answerCopy.splice(hasLetterIndex, 1);
                }
                const hasLetter = hasLetterIndex !== -1
                const correctPlace = letter === answer[j]

                if (lettersForKeyboard[letter] !== "correctPlace") {
                    if (lettersForKeyboard[letter] !== "hasLetter") {
                        lettersForKeyboard[letter] = correctPlace ? "correctPlace" : hasLetter ? "hasLetter" : "submitted";
                    } else {
                        lettersForKeyboard[letter] = correctPlace ? "correctPlace" : "hasLetter";
                    }
                }

                console.log(lettersForKeyboard);

                return <div className={`letter submitted${correctPlace ? " correctPlace" : ""}${hasLetter ? " hasLetter" : ""}`}>{letter}</div>;
            }));
        } else {
            letterBoxes.push(row.map(letter => <div className="letter">{letter}</div>));
        }
    }

    console.log(letterBoxes);

    console.log(getAnswerIndex())

    const onSubmit = (event) => {
        event?.preventDefault();
        console.log("enter pressed!");
        const guess = guesses[numGuess];
        if (isDone || currentLetterIndex < 4) return;
        if (isGuessValid(guess)) {
            setNumGuess(prev => prev + 1);
            setCurrentLetterIndex(0);
        } else setMessage(`"${guess.toUpperCase()}" is not a valid word`);
    };

    const onInput = (event) => {
        console.log("key pressed!");
        if (!isDone) {
            const currentGuess = event.target.value.toLowerCase().replace(/[^a-z]/gi, "");
            console.log(event.target.value);

            setCurrentLetterIndex(currentGuess.length);
            setGuesses(prev => prev.map((guess, i) => i === numGuess ? currentGuess : guess));
        }
    }

    //Check if game over
    useEffect(() => {
        if (isCorrect) {
            setMessage("Congrats!");
        } else if (isDone) {
            setMessage(`The solution was ${answer.toUpperCase()}. Better luck tomorrow!`)
        }
    }, [numGuess])

    return (
        <label htmlFor="guess-input" className="input-area">
            <form onSubmit={onSubmit} className="guesses">
                {letterBoxes}
                <input
                    id="guess-input"
                    autoFocus
                    inputMode="none"
                    maxLength={5}
                    onInput={onInput}
                    autoComplete="off"
                    autoCorrect="off"
                    value={guesses[numGuess]}
                    ref={inputRef}
                    disabled={isDone}
                    aria-label="Gissning"
                />
            </form>
            <Snackbar
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
                open={snackBarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackBarOpen(false)}
                message={message}
            />
            <Keyboard
                onSubmit={onSubmit}
                onInput={onInput}
                guesses={guesses}
                isDone={isDone}
                numGuess={numGuess}
                lettersForKeyboard={lettersForKeyboard}
            />
        </label>
    )
}