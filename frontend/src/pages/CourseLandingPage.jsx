import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../component/Loading";
import StarRating from "../component/StarRating";
import Recommendation from "../component/Recommendation";
import CourseReviews from "../component/CourseReviews";
import AddReview from "../component/AddReview";
import { useDispatch } from "react-redux";

import {
  FaTimes,
  FaPlay,
  FaCheck,
  FaUser,
  FaCalendarAlt,
  FaGlobe,
} from "react-icons/fa";
import { setSelectedLecture } from "../store/slice/selectedLectureSlice";

const CourseLandingPage = () => {
  const user = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const date = new Date(course?.updatedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

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

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

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

  const handleCart = async (price) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/cart/add-cart`,
        {
          userId : user._id, 
          courseId: course_id,
          price: price,
        },
        { withCredentials: true }
      );
      // console.log(response.data.data);
      toast.success(response?.data?.message || "Added to cart successfully");
    }
    catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error adding to cart";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-900">
      <div className="h-[300px] bg-gray-700 bg-gradient-to-t from-black via-black/50 to-black/0 transition-opacity">
        <div className=" mx-50 pt-10 text-white flex flex-row gap-15">
          {/* course info */}
          <div className="pt-10 w-4/5">
            {/* Course Title */}
            <h1 className="text-3xl font-extrabold">{course?.title}</h1>

            {/* Course subtitle */}
            <h2 className="mt-3 text-xl leading-relaxed">{course?.subtitle}</h2>

            <p className="mt-4 flex items-center text-sm">
              <FaUser className="text-white mr-2" /> Created by Shekhar
            </p>
            <p className="flex items-center text-sm">
              <FaCalendarAlt className="text-white mr-2" /> Last update{" "}
              {formattedDate}
            </p>
            <p className="flex items-center text-sm">
              <FaGlobe className="text-white mr-2" /> {course?.language}
            </p>
          
            {/* What You Will Learn */}
            <div className="mt-6 bg-gray-800 p-8">
              <h2 className="text-2xl font-bold text-gray-200">
                What You'll Learn
              </h2>
              <ul className="mt-2">
                {course?.whatYouWillLearn?.map((item, index) => (
                  <li key={index} className="flex items-center text-white text-sm">
                    <span className="text-gray-500 mr-3">
                      <FaCheck size={12} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Course Includes */}
            <div className="mt-6 bg-gray-800 p-8 ">
              <h2 className="text-2xl font-bold text-white mb-4">
                This Course Includes
              </h2>
              <ul className="mt-2">
                {course?.courseIncludes?.map((item, index) => (
                  <li key={index} className="flex text-sm items-center text-white">
                    <span className="text-gray-500 mr-3">
                      <FaCheck size={12} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lectures List */}
            <div>
            <h2 className="mt-10 mb-6 text-2xl font-bold">Course Lectures</h2>

            <ul className="">
              <p className="">
                {course?.lecture.length} Lecture |{" "}
                {course?.enrolledStudents.length} Learners
              </p>
              {lectures.length > 0 ? (
                lectures.map((lecture, index) => (
                  <li
                    key={lecture._id}
                    className="flex items-center px-4 py-4 border-white border-2  hover:bg-gray-700 transition cursor-pointer"
                    onClick={() =>{
                      navigate(`/media-player/${course_id}/${index}`);
                      dispatch(setSelectedLecture(lecture));
                    }
                      
                    }
                  >
                    {/* Lecture Title */}
                    <p className="flex-1 text-lg font-medium">
                      {lecture.title}
                    </p>

                    {/* Play Icon */}
                    <span className="text-gray-400 group-hover:text-white transition">
                      <FaPlay size={16} />
                    </span>
                  </li>
                ))
                
              ) : (
                <p className="text-gray-500">No lectures available</p>
              )}
            </ul>
            </div>

            <div className="mt-10">
              <p className="text-xl font-bold mb-4">Description</p>
              <p className="text-sm">{course?.description}</p>
            </div>

            <Recommendation courseId={course_id} />
            <CourseReviews courseId={course_id} />
            {<AddReview courseId={course_id} />}
          </div>

          {/* course side bar */}
          <div className="bg-gray-800 w-2/5 text-white shadow-lg lg:sticky top-4 h-fit">
            {/* Course Preview */}
            <div className="relative">
              {showPreview ? (
                <div
                  className="fixed inset-0 flex items-center justify-center bg-gray bg-opacity-50 backdrop-blur-sm z-50"
                  role="dialog"
                >
                  <div className="bg-gray-900 p-6 shadow-lg w-full max-w-2xl relative">
                    <div className="flex flex-row justify-between items-center mb-4">
                      <h1 className="text-xl font-bold text-white">
                        Course Preview
                      </h1>

                      {/* Close Button */}
                      <button
                        onClick={() => setShowPreview(false)}
                        className="w-8 h-8 cursor-pointer flex items-center justify-center bg-white text-gray-800 rounded-full shadow-md hover:bg-gray-200 transition"
                      >
                        <FaTimes size={16} />
                      </button>
                    </div>
                    <h1 className="text-xl font-bold text-white mb-4">
                      {course.title}
                    </h1>
                    {/* Video Player */}
                    <video controls className="w-full">
                      <source src={course?.preview?.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-48">
                  <img
                    src={
                      course?.thumbnail?.url ||
                      "https://via.placeholder.com/300"
                    }
                    alt="Course Thumbnail"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black via-black/50 to-black/0 transition-opacity">
                    <button
                      className="w-12 h-12 cursor-pointer flex items-center justify-center bg-white text-black rounded-full text-xl font-bold shadow-lg hover:scale-110 transition"
                      onClick={handlePreviewClick}
                    >
                      <span className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-full">
                        <FaPlay size={16} />
                      </span>
                    </button>
                    <span className="mt-2 text-white text-gl font-bold">
                      Preview this course
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Price & Enroll Button */}
            <div className="p-4">
            <StarRating rating={course?.averageRating || 0} />
              <p className="text-2xl font-bold text-white mt-4 mb-4">
                ₹{course?.price}
              </p>
              <button 
              className="text-lg w-full px-6 py-3 border-1 rounded-[5px] font-bold cursor-pointer hover:bg-gray-600"
              onClick={() =>handleCart(course?.price)}
              >
                Add to cart
              </button>
              <button
                onClick={handleEnroll}
                disabled={isEnrolled}
                className={`w-full px-6 py-3 text-lg font-bold mt-2 rounded-[5px] text-white transition ${
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
      </div>
    </div>
  );
};

export default CourseLandingPage;
