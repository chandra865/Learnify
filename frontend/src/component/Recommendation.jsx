import axios from "axios";
import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaStar, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Recommendation = () => {
  const courseId = useSelector((state) => state.course.selectedCourse._id);
  const [courses, setCourses] = useState([]);
  const [enrolledStu, setEnrolledStu] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/course/recommend/${courseId}`
        );
        setCourses(response.data.data);
      } catch (error) {
        toast.error(
          error?.response?.data.message || "Error fetching recommendations"
        );
      }
    };

    fetchRecommendations();
  }, [courseId]);

  return (
    <div className="my-10 bg-gray-900 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-white">
        Recommended Courses
      </h3>
      {courses.length > 0 ? (
        <div className="space-y-2">
          {courses.map((course) => (
            <Link to={`/course/enroll/${course._id}`}>
              <div
                key={course._id}
                className="cursor-pointer flex items-center border-b-1 transition-transform transform hover:scale-105 hover:bg-gray-700"
              >
                {/* Course Thumbnail */}
                <img
                  src={
                    course.thumbnail?.url || "https://via.placeholder.com/300"
                  }
                  alt={course.title}
                  className="w-28 h-18 object-cover"
                />

                {/* Course Details - Title, Rating, Enrolled Students, and Price */}
                <div className="flex flex-1 items-center justify-between mx-2">
                  {/* Course Title */}
                  <h3 className="text-sm font-bold text-white w-1/3">
                    {course.title}
                  </h3>

                  {/* Ratings */}
                  <span className="flex items-center gap-1 text-sm text-yellow-400 font-bold">
                    <FaStar size={18} />
                    {course.averageRating || 0}
                  </span>

                  {/* Enrolled Students */}
                  <span className="flex items-center gap-1 text-sm text-gray-300 text-sm">
                    <FaUser size={14} />
                    {course.studentenrolled}
                  </span>

                  {/* Price */}
                  <p className="text-sm font-bold">₹{course.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-white text-center">No recommendations available.</p>
      )}
    </div>
  );
};

export default Recommendation;
