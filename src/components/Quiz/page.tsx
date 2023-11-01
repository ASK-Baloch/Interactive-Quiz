"use client";
import { useEffect, useState } from "react";

function QuizComponent() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((data) => setCategories(data.trivia_categories));
  }, []);

  useEffect(() => {
    if (selectedCategory && difficulty) {
      fetch(
        `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${difficulty}`
      )
        .then((response) => response.json())
        .then((data) => {
          // Shuffle the order of questions
          data.results.sort(() => Math.random() - 0.5);

          // Shuffle the order of answers for each question
          data.results.forEach((question) => {
            question.question = decodeURIComponent(
              question.question.replaceAll('&#039;', "'").replaceAll('&quot;', '"')
            );
            question.answers = [
              ...question.incorrect_answers,
              question.correct_answer,
            ];
            question.answers.sort(() => Math.random() - 0.5);
          });

          setQuestions(data.results);
        });
    }
  }, [selectedCategory, difficulty]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1);
    }
    if (!startTime) {
      setStartTime(new Date());
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    if (currentQuestionIndex >= questions.length - 1) {
      setEndTime(new Date());
    }
  };

  const handleRestart = () => {
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStartTime(null);
    setEndTime(null);
    setSelectedCategory(null);
    setDifficulty(null);
  };

  if (!selectedCategory || !difficulty) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Select a category:</h2>
        {categories.map((category) => (
          <button
            key={category.id}
            className="block w-full text-left p-2 bg-blue-500 text-white rounded mb-2"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
        <h2 className="text-xl font-bold mb-2 mt-4">Select a difficulty:</h2>
        {["easy", "medium", "hard"].map((difficultyLevel) => (
          <button
            key={difficultyLevel}
            className="block w-full text-left p-2 bg-blue-500 text-white rounded mb-2"
            onClick={() => setDifficulty(difficultyLevel)}
          >
            {difficultyLevel}
          </button>
        ))}
      </div>
    );
  }

  if (currentQuestionIndex >= questions.length) {
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    return (
      <div>
        <div className="flex justify-center mt-96 font-bold text-center ">
          Your score is: {score}.
          <br />
          You took {timeTaken} seconds to complete the quiz.
        </div>

        <button
          className="mt-6 block w-full text-center p-2 bg-blue-500 text-white rounded "
          onClick={handleRestart}
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 mt-44 text-white">
      <h2 className="text-xl font-bold mb-2">
        {questions[currentQuestionIndex].question}
      </h2>
      {questions[currentQuestionIndex].answers.map((answer, i) => (
        <button
          key={i}
          className={`block w-full text-left p-2 rounded mb-2 ${
            selectedAnswer === answer
              ? answer === questions[currentQuestionIndex].correct_answer
                ? "bg-green-400"
                : "bg-red-400"
              : "bg-gray-500"
          }`}
          onClick={() => handleAnswer(answer)}
          disabled={selectedAnswer}
        >
          {answer}
        </button>
      ))}
      {selectedAnswer && (
        <button
          className="mt-4 block w-full text-center p-2 bg-blue-500 text-white rounded"
          onClick={handleNextQuestion}
        >
          Next Question
        </button>
      )}
    </div>
  );
}

export default QuizComponent;
