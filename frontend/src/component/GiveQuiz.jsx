import { useState, useEffect } from "react";
import axios from "axios";

const GiveQuiz = ({Id,type}) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/quiz/get-all-quiz/${Id}?quizFor=${type}`,
          {
            withCredentials: true,
          }
        );
        setQuizzes(response.data.data);
      } catch (error) {
        console.error(
          "Error fetching quizzes:",
          error.response?.data?.message || error.message
        );
      }
    };
    fetchQuizzes();
  }, [Id]);

  const handleQuizSelection = (quiz) => {
    setSelectedQuiz(quiz);
    setUserAnswers({});
    setScore(null);
  };

  const handleOptionChange = (questionIndex, selectedOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    const totalQuestions = selectedQuiz.questions.length;

    selectedQuiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(calculatedScore);
  };

  return (
    <div className="mt-4 bg-gray-900 p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>
      {quizzes.length === 0 ? (
        <p className="text-gray-400">No quizzes available for this lecture.</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li key={quiz._id} className="border p-4 rounded-md">
              <h3 className="text-lg font-semibold">{quiz.title}</h3>
              <button
                onClick={() => handleQuizSelection(quiz)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-2"
              >
                Take Quiz
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedQuiz && (
        <div className="mt-6 bg-gray-800 p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4">{selectedQuiz.title}</h2>
          {selectedQuiz.questions.map((question, index) => (
            <div key={index} className="mt-4">
              <p className="font-medium">{question.questionText}</p>
              {question.options.map((option, optIndex) => (
                <label key={optIndex} className="block mt-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={() => handleOptionChange(index, option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mt-4"
          >
            Submit
          </button>

          {score !== null && (
            <h3 className="text-lg font-bold mt-4">
              Your Score: {score}% {score >= 50 ? "✅ Passed" : "❌ Failed"}
            </h3>
          )}
        </div>
      )}
    </div>
  );
};

export default GiveQuiz;