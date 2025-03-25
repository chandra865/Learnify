import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateQuiz = () => {
  const { courseId, lectureId, type } = useParams();
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
  ]);

  //Handle question text change
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = value;
    setQuestions(updatedQuestions);
  };

  //Handle option text change
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Handle correct answer selection
  const handleCorrectAnswerChange = (qIndex, optIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctAnswerIndex = optIndex;
    setQuestions(updatedQuestions);
  };

  // Add new question
  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 }]);
  };

  // Remove question
  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  // Submit quiz
  const handleCreateQuiz = async () => {
    if (!quizTitle) return alert("Enter a quiz title!");
    if (questions.some((q) => q.questionText.trim() === "" || q.options.some((opt) => opt.trim() === ""))) {
      return alert("Ensure all questions and options are filled!");
    }

    const formattedQuestions = questions.map((q) => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.options[q.correctAnswerIndex],
    }));

    const quizData = { title:quizTitle, lectureId: lectureId, courseId:courseId, questions: formattedQuestions, passingScore: 50 };
    console.log(quizData);
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/quiz/create-quiz?quizFor=${type}`, quizData,
        {
            withCredentials:true,
        }
      );
      console.log(response.data.data);
      alert("Quiz created successfully!");
      if(type === "lecture"){
        navigate(`/manage-lecture/${courseId}/${lectureId}`);
      }else{
        navigate(`/dashboard/created`);
      }
      
    } catch (error) { 
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-semibold">Create Quiz</h2>
      
      {/*Quiz Title */}
      <input
        type="text"
        className="mt-3 w-full p-2 bg-gray-800 text-white rounded-md"
        placeholder="Enter quiz title"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
      />

      {/*Questions Section */}
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mt-4 p-4 bg-gray-800 rounded-md">
          <input
            type="text"
            className="w-full p-2 bg-gray-700 text-white rounded-md"
            placeholder={`Question ${qIndex + 1}`}
            value={q.questionText}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
          />
          
          {/*Options */}
          {q.options.map((option, optIndex) => (
            <div key={optIndex} className="mt-2 flex items-center">
              <input
                type="text"
                className="flex-1 p-2 bg-gray-700 text-white rounded-md"
                placeholder={`Option ${optIndex + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
              />
              <input
                type="radio"
                name={`correct-${qIndex}`}
                className="ml-2"
                checked={q.correctAnswerIndex === optIndex}
                onChange={() => handleCorrectAnswerChange(qIndex, optIndex)}
              />
            </div>
          ))}

          {/* Remove Question Button */}
          <button className="mt-3 px-3 py-1 bg-red-500 text-white rounded-md" onClick={() => removeQuestion(qIndex)}>
            Remove Question
          </button>
        </div>
      ))}

      {/* Add Question Button */}
      <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md" onClick={addQuestion}>
        Add Question
      </button>

      {/*  Submit Quiz Button */}
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleCreateQuiz}>
        Create Quiz
      </button>
    </div>
  );
};

export default CreateQuiz;
