import { useState } from "react";

function Millonaire() {
  const questions = [
    {
      question: "Mi Magyarország fővárosa?",
      options: ["Pécs", "Budapest", "Debrecen", "Szombathely"],
      correctAnswer: "Budapest",
    },
    {
      question: "Mi a legnagyobb óceán?",
      options: ["Csendes-óceán", "Atlanti-óceán", "India-óceán", "Jeges-óceán"],
      correctAnswer: "Csendes-óceán",
    },
    {
      question: "Ki írta a 'Harry Potter' könyveket?",
      options: [
        "J.R.R. Tolkien",
        "J.K. Rowling",
        "George R.R. Martin",
        "C.S. Lewis",
      ],
      correctAnswer: "J.K. Rowling",
    },
    {
      question: "Melyik évben zajlott az első holdra szállás?",
      options: ["1969", "1959", "1975", "1980"],
      correctAnswer: "1969",
    },
    {
      question: "Mi a pi értéke?",
      options: ["3.14", "3.12", "2.72", "2.50"],
      correctAnswer: "3.14",
    },
  ];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="millionaire-game">
      <h1>Legyen Ön is Milliomos</h1>
      {!showResult ? (
        <div className="question-state">
          <h2>{currentQuestion.question}</h2>
          <div>
            {currentQuestion.options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="question-state">
          <h2>Kvíz vége!</h2>
          <p>
            Elért pontszám: {score} / {questions.length}
          </p>
        </div>
      )}
    </div>
  );
}

export default Millonaire;
