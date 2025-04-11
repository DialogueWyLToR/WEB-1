import { useState } from "react";

function Hangman() {
  const WORDS = ["REACT", "JAVASCRIPT", "PROGRAMOZÁS", "CDN", "AKASZTÓFA"];
  const MAX_WRONG = 6;
  const [word] = useState(
    () => WORDS[Math.floor(Math.random() * WORDS.length)]
  );
  const [guessed, setGuessed] = useState([]);
  const [wrong, setWrong] = useState(0);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handleGuess = (letter) => {
    if (guessed.includes(letter)) return;

    setGuessed([...guessed, letter]);

    if (!word.includes(letter)) {
      setWrong(wrong + 1);
    }
  };

  const getDisplayedWord = () =>
    word
      .split("")
      .map((l) => (guessed.includes(l) ? l : "_"))
      .join(" ");

  const isWinner = word.split("").every((l) => guessed.includes(l));
  const isLoser = wrong >= MAX_WRONG;

  const resetGame = () => {
    setGuessed([]);
    setWrong(0);
  };

  return (
    <div className="hangman-game">
      <h1>Akasztófa játék</h1>
      <div className="hangman">
        Hibák: {wrong} / {MAX_WRONG}
      </div>
      <div className="word">{getDisplayedWord()}</div>

      {isWinner && <div className="result">Gratulálok! Nyertél 🎉</div>}
      {isLoser && (
        <div className="result lost">Vesztettél 😢 A szó: {word}</div>
      )}

      <div className="keyboard">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessed.includes(letter) || isWinner || isLoser}
          >
            {letter}
          </button>
        ))}
      </div>

      {(isWinner || isLoser) && (
        <button onClick={resetGame} style={{ marginTop: "1rem" }}>
          Új játék
        </button>
      )}
    </div>
  );
}

export default Hangman;
