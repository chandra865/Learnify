import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const GiveQuiz = ({ Id, type }) => {
  const [quizzes, setQuizzes] = useState([]);

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
  }, [Id, type]);

  // const handleQuizCompletion = async () => {
  //   try {
  //     await axios.post(
  //       `${API_BASE_URL}/api/v1/course/complete-quiz`,
  //       {
  //         courseId: Id,
  //         userId: "userId", // Replace with actual user ID
  //       },
  //       { withCredentials: true }
  //     );
  //     alert("Congratulations! You've completed the quiz and your course status is updated.");
  //   } catch (error) {
  //     toast.error(
  //       error.response?.data?.message || "Error updating course status"
  //     );
  //   }
  // };

  const handleGiveQuizClick = (quizId) => {
    window.open(`/quiz/${quizId}`, "_blank");
  };

  return (
    <div className="mt-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>
      {quizzes.length === 0 ? (
        <p className="text-gray-400">No quizzes available for this lecture.</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li
              key={quiz._id}
              className="border p-4 rounded flex flex-row items-center justify-between bg-gray-800"
            >
              <div>
                <h3 className="text-lg font-semibold">{quiz.title}</h3>
              </div>
              <button
                onClick={() => handleGiveQuizClick(quiz._id)}
                className="text-blue-500 hover:text-blue-700 cursor-pointer underline"
              >
                Give Quiz
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GiveQuiz;
