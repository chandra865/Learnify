import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const LectureManage = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/quiz/get-all-quiz/${lectureId}`,
          {
              withCredentials:true
          }
      );
      setQuizzes(response.data.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [courseId, lectureId]);

  const deleteQuiz = async (quizId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/quiz/delete-quiz/${quizId}`, 
        {
            withCredentials:true
        }
      );
      alert("quiz deleted successfully");
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-semibold">Lecture Quizzes</h2>

      {/* 📝 Quiz Management */}
      <div className="mt-6">
        <h3 className="text-xl font-medium">📝 Quizzes</h3>
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => navigate(`/create-quiz/${courseId}/${lectureId}`)}
        >
            Add Quiz
        </button>
        {loading ? (
          <p>Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p>No quizzes available.</p>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz._id} className="mt-3 p-3 bg-gray-800 rounded-lg flex justify-between">
              <div>
                <p className="text-lg font-semibold">{quiz.title}</p>
                {/* <p>📌 Attempts: {quiz.attempts}</p>
                <p>🏆 Top Score: {quiz.topScore}</p> */}
              </div>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded-md"
                onClick={() => deleteQuiz(quiz._id)}
              >
                 Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LectureManage;
