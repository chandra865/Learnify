import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import CreateQuiz from "./CreateQuiz";
import { FaArrowLeft } from "react-icons/fa";
const LectureManage = () => {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true);
  //const courseId = useSelector((state) => state.course.selectedCourse._id);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/quiz/get-all-quiz/${lectureId}?quizFor=${"lecture"}`,
        {
          withCredentials: true,
        }
      );
      setQuizzes(response.data.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/assignment/get-all-assignment/${lectureId}`,
        {
          withCredentials: true,
        }
      );
      setAssignments(response.data.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    fetchAssignments();
  }, [lectureId]);

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

  const deleteAssignment = async (assignmentId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/assignment/delete-assignment/${assignmentId}`,
        {
          withCredentials: true,
        }
      );
      alert("Assignment deleted successfully");
      fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadMedia = async (file, mediaType) => {
    const formData = new FormData();
    formData.append("media", file); // Attach the file
    formData.append("mediaType", mediaType); // Specify media type ("thumbnail" or "video")

    try {
      setDisable(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/media/upload-media",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Important for file upload
          },

          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            // Only update if there's a significant change
            if (progressRef.current !== percent) {
              progressRef.current = percent;
              setProgress(percent);
            }
          },
        }
      );
      setDisable(false);
      setProgress(0);
      // console.log(`Upload ${mediaType} Success:`, response.data.data);
      toast.success(`${mediaType} Uploaded  Successfully`);
      return response.data.data; // Contains { publicId, url }
    } catch (error) {
      // console.error(`Upload ${mediaType} Failed:`, error.response.data);
      throw error;
    }
  };

  const handleFileChange = async (event, mediaType) => {
    const file = event.target.files[0]; // Get the selected file

    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      const mediaData = await uploadMedia(file, mediaType);
      // console.log(`${mediaType} Uploaded:`, mediaData);

      // Store publicId & URL in state (for form submission)
      if (mediaType === "thumbnail") {
        setImgPreview(URL.createObjectURL(file));
        setThumbnail(
          JSON.stringify({
            publicId: mediaData.thumbnail.publicId,
            url: mediaData.thumbnail.url,
          })
        );
      } else if (mediaType === "video") {
        setVideoPreview(URL.createObjectURL(file));
        setVideoFile(
          JSON.stringify({
            publicId: mediaData.video.publicId,
            url: mediaData.video.url,
            duration: mediaData.video.duration,
          })
        );
      }

      // console.log("Thumbnail:", thumbnail);
      // console.log("Video:", videoFile);
    } catch (error) {
      // console.error(`Error uploading ${mediaType}:`, error);
      toast.error(`Error while uploading ${mediaType}`);
    }
  };

  const uploadAssignment = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("assignment", file);

    try {
      await axios.post(
        `http://localhost:8000/api/v1/assignment/upload/${lectureId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Assignment uploaded successfully");
      fetchAssignments();
    } catch (error) {
      console.error("Error uploading assignment:", error);
    }
  };

  return (
    <>
      {isFormVisible ? (
        <div className="max-w-4xl mx-auto mt-6 p-6 bg-gray-900 text-white rounded-lg">
          {/* <button
            className="flex items-center cursor-pointer text-white"
            onClick={() => setIsFormVisible(false)}
          >
            <FaArrowLeft className="mr-2" />
          </button> */}
          <h2 className="text-2xl font-semibold">
            Lecture Quizzes & Assignments
          </h2>

          {/*  Quiz Management */}
          <div className="mt-6">
            <h3 className="text-xl font-medium">📝 Quizzes</h3>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => setIsFormVisible(false)}
            >
              Add Quiz
            </button>
            {loading ? (
              <p>Loading quizzes...</p>
            ) : quizzes.length === 0 ? (
              <p>No quizzes available.</p>
            ) : (
              quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="mt-3 p-3 bg-gray-800 rounded-lg flex justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold">{quiz.title}</p>
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

          {/* 📂 Assignment Management */}
          <div className="mt-6">
            <h3 className="text-xl font-medium">📂 Assignments</h3>
            <button
              className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-md"
              onClick={() => fileInputRef.current.click()}
            >
              Choose File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
            {file && <p className="mt-2 text-sm">Selected File: {file.name}</p>}
            {loading ? (
              <p>Loading assignments...</p>
            ) : assignments.length === 0 ? (
              <p>No assignments available.</p>
            ) : (
              assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="mt-3 p-3 bg-gray-800 rounded-lg flex justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold">{assignment.title}</p>
                    <a
                      href={assignment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      View
                    </a>
                  </div>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                    onClick={() => deleteAssignment(assignment._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <CreateQuiz
          courseId={""}
          lectureId={lectureId}
          type={"lecture"}
        />
      )}
    </>
  );
};

export default LectureManage;
