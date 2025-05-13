import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";
import axios from "axios";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const QuizPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
 
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/quiz/get-quiz/${quizId}`,
          { withCredentials: true }
        );
        setQuiz(res.data.data);
      } catch (err) {
        toast.error(
          err?.response?.data.message || "Error fetching quiz data"
        );
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (selectedOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correct++;
    });

    const calculated = Math.round((correct / quiz.questions.length) * 100);
    setScore(calculated);

    if (quiz.course && calculated >= quiz.passingScore) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/course/complete-quiz`,
          {
            courseId: quiz.course,
          },
          { withCredentials: true }
        );
        dispatch(setSelectedCourse(response.data.data));
        alert("Quiz completed successfully!");

      } catch (error) {
        console.error("Error updating course quiz status:", error);
        alert("Error updating quiz status.");
      }
    }
  };

  const goNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (!quiz) return <div className="text-white p-4">Loading quiz...</div>;

  const question = quiz.questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-lg mt-6 shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">{quiz.title}</h1>

      <div className="mb-4">
        <p className="text-lg font-semibold mb-2">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
        <p className="text-base mb-4">{question.questionText}</p>

        <div className="space-y-3">
          {question.options.map((option, i) => (
            <label
              key={i}
              className={`block p-3 rounded-lg cursor-pointer ${
                userAnswers[currentQuestion] === option
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={option}
                checked={userAnswers[currentQuestion] === option}
                onChange={() => handleOptionChange(option)}
                className="mr-3"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={goBack}
          disabled={currentQuestion === 0}
          className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        {currentQuestion < quiz.questions.length - 1 ? (
          <button
            onClick={goNext}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Submit Quiz
          </button>
        )}
      </div>

      {score !== null && (
        <div className="mt-6 text-xl text-center">
          <p>
            Your Score:{" "}
            <span
              className={
                score >= quiz.passingScore ? "text-green-400" : "text-red-400"
              }
            >
              {score}% {score >= quiz.passingScore ? "✅ Passed" : "❌ Failed"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
