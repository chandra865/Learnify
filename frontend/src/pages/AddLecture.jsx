import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../component/Loading";

const AddLecture = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [lectureData, setLectureData] = useState({
    title: "",
    videoFile: null,
    isFree: false,
  });
  const [disable, setDisable] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const progressRef = useRef(0);
  const videoInputRef = useRef(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/course/inst-courses",
          { withCredentials: true }
        );
        // console.log(response.data.data);
        setCourses(response.data.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Something went wrong! Please try again later.";

        alert(errorMessage);
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/course/lectures/${course._id}`
      );
      setLectures(response.data.data.lectures);
    } catch (error) {
      // console.error("Error fetching lectures:", error.response?.data?.message);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong! Please try again later.";

      alert(errorMessage);
    }
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
      toast.success(`${mediaType} Upload  Successfully`);
      return response.data.data; // Contains { publicId, url }
    } catch (error) {
      // console.error(`Upload ${mediaType} Failed:`, error.response.data);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong! Please try again later.";
      throw errorMessage;
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

      setVideoPreview(URL.createObjectURL(file));
      setLectureData({
        ...lectureData,
        videoFile: JSON.stringify({
          publicId: mediaData.video.publicId,
          url: mediaData.video.url,
        }),
      });
    } catch (error) {
      // console.error(`Error uploading ${mediaType}:`, error);
      alert(`Error while uploading ${mediaType}:`)
    }
  };

  const handleAddLecture = async (e) => {
    setDisable(true);
    e.preventDefault();

    if (!lectureData.videoFile) {
      toast.error("Please select a video file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("title", lectureData.title);
    formData.append("videoFile", lectureData.videoFile);
    formData.append("isFree", lectureData.isFree || false);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/course/add-lecture/${selectedCourse._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setLectures([...lectures, response.data.data.newLecture]);
      setLectureData({ title: "", videoFile: null, isFree: false });
      setVideoPreview(null);
      if (videoInputRef.current) videoInputRef.current.value = "";
      setDisable(false);
      toast.success("Lecture added successfully!");
    } catch (error) {
      setDisable(false);
      // console.error("Error adding lecture:", error.response?.data?.message);
      const errorMessage = error.response?.data?.message || "Some error while adding lecture"
      // console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  if(loading) return <Loading/>;
  return (
    <div className="min-h-screen p-6 bg-gray-900">
      {!selectedCourse ? (
        <div className="grid grid-cols-1 gap-6">
          {courses.length === 0 ? (
            <p className="text-center text-gray-500">No courses found.</p>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className="p-6 bg-gray-800 text-white shadow-lg rounded-lg flex"
              >
                <img
                  src={course.thumbnail?.url}
                  alt={course.title}
                  className="w-80 h-50 object-cover rounded-lg mr-4"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{course.title}</h2>
                  <p className="mt-2">{course.description}</p>
                  <p className="mt-4">Category:- {course.category}</p>
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => handleCourseSelect(course)}
                  >
                    Manage Lectures
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          <h3 className="text-3xl text-white font-bold">
            {selectedCourse.title}
          </h3>
          <ul className="my-2 space-y-3">
            {lectures.length > 0 ? (
              lectures.map((lecture, index) => (
                <li
                  key={lecture._id}
                  className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition cursor-pointer"
                  onClick={() =>
                    navigate(`/media-player/${selectedCourse._id}/${index}`)
                  }
                >
                  {/* Lecture Number
                  <span className="w-8 h-8 flex items-center justify-center font-semibold text-lg bg-blue-500 text-white rounded-full">
                    {index + 1}
                  </span> */}

                  {/* Lecture Title */}
                  <p className="flex-1 text-lg font-medium">{lecture?.title}</p>

                  {/* Play Icon */}
                  <span className="text-gray-400 group-hover:text-white transition">
                    ▶
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-500 my-2">No lectures available</p>
            )}
          </ul>
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <form onSubmit={handleAddLecture} className="mt-4">
              {/* Lecture Title Input */}
              <input
                type="text"
                name="title"
                placeholder="Lecture Title"
                value={lectureData.title}
                onChange={(e) =>
                  setLectureData({ ...lectureData, title: e.target.value })
                }
                className="w-full p-2 border rounded mb-3 "
                required
              />

              {/* Video Upload Input */}
              <input
                type="file"
                name="videoFile"
                accept="video/*"
                onChange={(e) => handleFileChange(e, "video")}
                className="w-full p-2 border rounded mb-3"
                ref={videoInputRef}
                required
              />

              {videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  className="mt-2 h-50 object-cover rounded"
                />
              )}

              {progress > 0 && (
                <div className="w-full bg-gray-200 rounded-full mt-2">
                  <div
                    className="bg-blue-500 text-xs font-medium text-white text-center p-1 leading-none rounded-full"
                    style={{ width: `${progress}%` }}
                    ref={progressRef}
                  >
                    {progress}%
                  </div>
                </div>
              )}

              {/* Checkbox for Free/Paid Lecture */}
              <label className="flex items-center cursor-pointer mb-3">
                <span className="mr-2 text-white">Mark as Free Lecture</span>
                <div
                  className={`relative w-12 h-6 rounded-full transition ${
                    lectureData.isFree ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onClick={() =>
                    setLectureData((prev) => ({
                      ...prev,
                      isFree: !prev.isFree,
                    }))
                  }
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full shadow-md top-0.5 transition-all ${
                      lectureData.isFree ? "left-7" : "left-0.5"
                    }`}
                  ></div>
                </div>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className={`${
                  disable
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                } text-white p-2 rounded mx-auto mt-4 `}
                disabled={disable}
              >
                Add Lecture
              </button>
            </form>

            {/* <button
            onClick={handlePublish}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
          >
            <FaCheckCircle /> <span>Publish Course</span>
          </button> */}
          </div>

          <button
            onClick={() => setSelectedCourse(null)}
            className="bg-blue-500 text-white px-4 py-2 my-4 mx-4 rounded-lg hover:bg-blue-600"
          >
            Back
          </button>
        </>
      )}
    </div>
  );
};

export default AddLecture;
