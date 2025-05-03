import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
const CreateQuiz = ({ courseId, lectureId, type }) => {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
  ]);
  const [expandedQuestions, setExpandedQuestions] = useState([0]);

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswer = (qIdx, oIdx) => {
    const updated = [...questions];
    updated[qIdx].correctAnswerIndex = oIdx;
    setQuestions(updated);
  };

  const toggleExpand = (index) => {
    setExpandedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const addQuestion = () => {
    const newIndex = questions.length;
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
    ]);
    setExpandedQuestions([newIndex]);
    //setExpandedQuestions((prev) => [...prev, questions.length]); // Expand new question
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
      setExpandedQuestions((prev) => prev.filter((i) => i !== index));
    }
  };

  const handleCreateQuiz = async () => {
    if (!quizTitle) return alert("Please enter a quiz title.");
    if (
      questions.some(
        (q) => !q.questionText.trim() || q.options.some((o) => !o.trim())
      )
    ) {
      return alert("Please fill in all questions and options.");
    }

    const formatted = questions.map((q) => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.options[q.correctAnswerIndex],
    }));

    try {
      await axios.post(
        `http://localhost:8000/api/v1/quiz/create-quiz?quizFor=${type}`,
        {
          title: quizTitle,
          courseId,
          lectureId,
          questions: formatted,
          passingScore: 50,
        },
        { withCredentials: true }
      );

      alert("Quiz created successfully.");
      navigate("/dashboard/created");
    } catch (err) {
      console.error("Quiz creation failed:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-row items-center gap-4 mb-6">
        {/* <button
          className="flex items-center cursor-pointer text-white"
          onClick={() => setSelected(false)}
        >
          <FaArrowLeft className="" />
        </button> */}
        <h2 className="text-2xl font-bold">Create a New Quiz</h2>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Quiz Title</label>
        <input
          type="text"
          placeholder="Enter quiz title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {questions.map((q, qIdx) => {
        const isExpanded = expandedQuestions.includes(qIdx);
        return (
          <div
            key={qIdx}
            className="mb-4 p-4 bg-gray-800 rounded-md border border-gray-700"
          >
            <div className="flex justify-between items-center">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => toggleExpand(qIdx)}
              >
                {isExpanded ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
                <h3 className="text-lg font-semibold">
                  {q.questionText || `Question ${qIdx + 1}`}
                </h3>
              </div>

              <button
                onClick={() => removeQuestion(qIdx)}
                className="text-red-400 hover:text-red-600"
                title="Remove question"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {isExpanded && (
              <>
                <input
                  type="text"
                  placeholder="Enter the question"
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                  className="w-full mt-3 p-2 bg-gray-700 rounded-md mb-4"
                />

                <div className="space-y-3">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder={`Option ${oIdx + 1}`}
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(qIdx, oIdx, e.target.value)
                        }
                        className="flex-1 p-2 bg-gray-700 rounded-md"
                      />
                      <button
                        type="button"
                        className={`px-3 py-1 rounded-md text-sm ${
                          q.correctAnswerIndex === oIdx
                            ? "bg-green-600 text-white"
                            : "bg-gray-600 text-gray-200 hover:bg-green-500"
                        }`}
                        onClick={() => handleCorrectAnswer(qIdx, oIdx)}
                      >
                        {q.correctAnswerIndex === oIdx
                          ? "✔ Correct"
                          : "Mark Correct"}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}

      <div className="flex gap-4 mt-6">
        <button
          onClick={addQuestion}
          className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Add Question
        </button>

        <button
          onClick={handleCreateQuiz}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded cursor-pointer"
        >
          Create Quiz
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;
