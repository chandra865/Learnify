import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../component/Loading";
import ProgressBar from "../component/ProgressBar";
import { Link } from "react-router-dom";
import StarRating from "../component/StarRating";
import { CircularProgressbar } from "react-circular-progressbar";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user.userData?._id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/enrollment/get-enrolled-courses/${userId}`,
          { withCredentials: true }
        );

        setCourses(response.data.data);
      } catch (err) {
        toast.error(
          err?.response?.data.message || "Error fetching enrolled courses"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, [userId]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen p-6 bg-gray-800 text-white">
      <h2 className="text-2xl font-extrabold text-center mb-8">
        Enrolled Courses
      </h2>

      {courses.length > 0 ? (
        <div className="">
          {courses.map((course) => (
              <Link to={`/course/enroll/${course._id}`}>
                <div className="flex mb-4 border-b-2 hover:bg-gray-700 transform transition duration-300 hover:scale-102">
                  {/* Course Image */}
                  <div className="w-70 h-40 flex-shrink-0">
                    <img
                      src={course.thumbnail?.url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Course Details */}
                  <div className="flex flex-row w-full ">
                    <div className="w-full px-4">
                      <p className="text-xl font-extrabold">{course.title}</p>
                      <div>
                        <p className="text-white">{course.subtitle}</p>
                        <p className="text-white-500 text-sm my-1">
                          {course?.instructor?.name || "Unknown Instructor"}
                        </p>

                        {/* Rating */}
                        <StarRating rating={course.averageRating || 0} />

                        {/* Course Meta Info */}
                        {/* <p className="text-white-500 text-sm my-1">
                          {course.lecture?.length || 0} Lectures
                        </p> */}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between">
                      <p className="px-10 text-xl font-extrabold ">
                        ₹{course.price}
                      </p>
                      <ProgressBar userId={userId} courseId={course._id} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No enrolled courses found.</p>
      )}
    </div>
  );
};

export default EnrolledCourses;
