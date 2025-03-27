import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../component/Loading";
import CourseReviews from "../component/CourseReviews";
import AddReview from "../component/AddReview";
import Recommendation from "../component/Recommendation";
import GiveQuiz from "../component/GiveQuiz";

const CourseInfo = () => {
  const { course_id } = useParams();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [reviewRating, setReviewRating] = useState(null);
  const [reviewComment, setReviewComment] = useState(null);
  const [courseProgress, setCourseProgress] = useState(false);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);

  const user = useSelector((state) => state.user.userData);
  const navigate = useNavigate();

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/progress/get-progress/${user._id}/${course_id}`
        );
        const progress = response.data.data;
        console.log(progress.progressPercentage);
        if (progress.progressPercentage === 100) {
          setIsCourseCompleted(true); 
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [user, course_id]);

  useEffect(() => {
    if (user?.enrolledCourses?.includes(course_id)) {
      setIsEnrolled(true);
    } else {
      setIsEnrolled(false);
    }
  }, [user, course_id]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/course/fetchcourse/${course_id}`,
          { withCredentials: true }
        );
        setCourse(response.data.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "something went wrong while fetching course";
        alert(errorMessage);
      }
    };

    fetchCourse();
  }, [course_id]);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/course/lectures/${course_id}`,
          { withCredentials: true }
        );
        const lectureData = response.data.data.lectures;
        if (isEnrolled) {
          setLectures(lectureData);
        } else {
          setLectures(lectureData.filter((lecture) => lecture.isFree === true));
        }
      } catch (err) {
        const errorMessage =
          error.response?.data?.message ||
          "something went wrong while fetching course";
        alert(errorMessage);
      }
    };

    if (isEnrolled !== null) {
      fetchLectures();
    }
  }, [isEnrolled, course_id]);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/progress/get-progress/${user._id}/${course_id}`,
          {
            withCredentials: true,
          }
        );

        const progress = response.data.data;
        // console.log(progress.progressPercentage);
        setCourseProgress(progress.progressPercentage === 100);
      } catch (error) {
        console.error(
          "Error while fetching progress:",
          error?.response?.data?.message
        );
      }
    };

    fetchProgress();
  }, [user._id, course_id]);

  const handleEnroll = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/course/enrolle/${course_id}`,
        {},
        { withCredentials: true }
      );
      setIsEnrolled(true);
      toast.success(response?.data?.message || "Enrollment Successfull");
    } catch (error) {
      // console.log(error.response?.data);
      const errorMessage =
        error.response?.data?.message || "Error in enrollment";
      toast.error(errorMessage);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/progress/get-certificate/${user._id}/${course._id}`,
        {
          withCredentials: true,
          responseType: "blob",
        } // Important for handling PDFs
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${user.name}_${course._id}_certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Error downloading certificate:", error);
    }
  };

  const handleReviewSubmit = (e) => {
    e.prevent.default();
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-gray-300 min-h-screen py-10">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Course Content */}
        <div className="flex-1 bg-gray-900 text-white shadow-lg rounded-lg p-6">
          {/* Course Title */}
          <h1 className="text-4xl font-bold text-blue-400">{course?.title}</h1>

          {/* Course Description */}
          <p className="text-gray-300 mt-3 text-lg leading-relaxed">
            {course?.description}
          </p>

          {/* Course Details */}
          <div className="mt-6 space-y-3">
            <p className="text-lg font-medium flex items-center gap-3">
              <span className="text-green-400 text-xl">📚</span>
              <span className="text-gray-300">
                Category:{" "}
                <span className="font-semibold text-white">
                  {course?.category}
                </span>
              </span>
            </p>

            <p className="text-lg font-medium flex items-center gap-3">
              <span className="text-yellow-400 text-xl">💰</span>
              <span className="text-gray-300">
                Price:{" "}
                <span className="font-semibold text-white">
                  ₹{course?.price}
                </span>
              </span>
            </p>

            <p className="text-lg font-medium flex items-center gap-3">
              <span className="text-purple-400 text-xl">🌐</span>
              <span className="text-gray-300">
                Language:{" "}
                <span className="font-semibold text-white">
                  {course?.language}
                </span>
              </span>
            </p>

            <p className="text-lg font-medium flex items-center gap-3">
              <span className="text-pink-400 text-xl">👨‍🏫</span>
              <span className="text-gray-300">
                Instructor:{" "}
                <span className="font-semibold text-white">
                  {course?.instructor?.name}
                </span>
              </span>
            </p>
          </div>

          {/* What You Will Learn */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-200">
              🚀 What You'll Learn
            </h2>
            <ul className="mt-4 space-y-3">
              {course?.whatYouWillLearn?.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition duration-200"
                >
                  {/* Bullet Icon */}
                  <span className="text-blue-400 text-lg">📌</span>

                  {/* Learning Point */}
                  <p className="text-lg">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Course Includes */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-200">
              🎯 This Course Includes
            </h2>
            <ul className="mt-4 space-y-3">
              {course?.courseIncludes?.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                >
                  {/* Check Icon */}
                  <span className="text-green-400 text-lg">✔</span>

                  {/* Item Text */}
                  <p className="text-lg">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Lectures List */}
          <h2 className="mt-6 text-2xl font-bold text-gray-200">
            📚 Course Lectures
          </h2>
          <ul className="mt-4 space-y-3">
            {lectures.length > 0 ? (
              lectures.map((lecture, index) => (
                <li
                  key={lecture._id}
                  className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition cursor-pointer"
                  onClick={() =>
                    navigate(`/media-player/${course_id}/${index}`)
                  }
                >
                  {/* Lecture Number */}
                  <span className="w-8 h-8 flex items-center justify-center font-semibold text-lg bg-blue-500 text-white rounded-full">
                    {index + 1}
                  </span>

                  {/* Lecture Title */}
                  <p className="flex-1 text-lg font-medium">{lecture.title}</p>

                  {/* Play Icon */}
                  <span className="text-gray-400 group-hover:text-white transition">
                    ▶
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No lectures available</p>
            )}
          </ul>

          {courseProgress && <GiveQuiz Id={course_id} />}
          {isCourseCompleted && isEnrolled && (
            <button
              onClick={handleDownloadCertificate}
              className="mt-4 bg-blue-500 text-white px-4 py-2 mx-2 rounded"
            >
              Get Certificate
            </button>
          )}
          <Recommendation courseId={course_id} />

          {/* Reviews Section */}
          {/* console.log(course_id); */}
          <CourseReviews courseId={course_id} />
          {/* Add Review Section (Only if user is enrolled) */}
          {isEnrolled && <AddReview courseId={course_id} />}
        </div>

        {/* Sidebar (Course Preview & Enroll) */}
        <div className="w-full lg:w-1/3 bg-gray-900 text-white shadow-lg rounded-lg p-6 lg:sticky top-4 h-fit">
          {/* Course Preview */}
          <div className="relative">
            {showPreview ? (
              <div className="fixed inset-0 bg-gray-300 bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
                <div className="relative bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-4xl">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowPreview(false)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full"
                  >
                    ✖
                  </button>

                  {/* Video Player */}
                  <video controls className="w-full rounded-lg">
                    <source src={course?.preview?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={
                    course?.thumbnail?.url || "https://via.placeholder.com/300"
                  }
                  alt="Course Thumbnail"
                  className="rounded-lg w-full h-48 object-cover"
                />
                <button
                  className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 text-white font-bold text-lg opacity-0 hover:opacity-100 transition"
                  onClick={handlePreviewClick}
                >
                  ▶ How to Play
                </button>
              </>
            )}
          </div>

          {/* Price & Enroll Button */}
          <p className="text-xl font-bold text-white mt-4">₹{course?.price}</p>
          <button
            onClick={handleEnroll}
            disabled={isEnrolled}
            className={`w-full mt-4 py-3 text-lg font-semibold rounded-lg text-white transition ${
              isEnrolled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            }`}
          >
            {isEnrolled ? "Already Enrolled" : "Enroll Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo;
