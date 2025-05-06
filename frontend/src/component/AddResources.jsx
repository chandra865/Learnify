import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";
import CreateQuiz from "./CreateQuiz";

const AddResources = () => {
  const course = useSelector((state) => state.course.selectedCourse);
  // console.log("course", course)
  const dispatch = useDispatch();

  const [isFormVisible, setIsFormVisible] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/quiz/get-all-quiz/${
          course._id
        }?quizFor=${"course"}`,
        {
          withCredentials: true,
        }
      );
      console.log("response", response);
      setQuizzes(response.data.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [course._id]);

  const handleAddQuiz = () => {
    // Logic to add a quiz

    if (course.certificateOption === "quiz") {
      setIsFormVisible(false);
    } else {
      alert(
        "you cannot add a quiz, because at the time of creating course you selected certificate option as no quiz"
      );
      return;
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/quiz/delete-quiz/${quizId}`,
        {
          withCredentials: true,
        }
      );
      alert("Quiz deleted successfully");
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <div>
      {isFormVisible ? (
        <div className="mt-6 text-white">
          <h3 className="text-xl font-medium">Quizzes</h3>
          {course.quiz.length === 0 && (
            <button
              className="mt-2 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded"
              onClick={handleAddQuiz}
            >
              Add Quiz
            </button>
          )}

          {loading ? (
            <p>Loading quizzes...</p>
          ) : quizzes.length === 0 ? (
            <p>No quizzes available.</p>
          ) : (
            quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="mt-3 p-2 bg-gray-700 rounded flex justify-between"
              >
                <div>
                  <p className="">{quiz.title}</p>
                </div>
                <button
                  className="text-blue-500 hover:text-blue-600  cursor-pointer "
                  onClick={() => deleteQuiz(quiz._id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>
          <CreateQuiz
            courseId={course._id}
            lectureId={"lecture"}
            type="course"
          />
          <button
            className="mt-2 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-md"
            onClick={() => setIsFormVisible(true)}
          >
            back
          </button>
        </div>
      )}
    </div>
  );
};
export default AddResources;
