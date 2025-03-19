import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../component/Loading";
import ProgressBar from "../component/ProgressBar";

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
          `http://localhost:8000/api/v1/course/stu-courses`,
          { withCredentials: true }
        );
        setCourses(response.data.data);
      } catch (err) {
        alert(
          err.response?.data?.message || "Failed to fetch enrolled courses"
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
      <h2 className="text-3xl font-bold text-center mb-8">
        Your Enrolled Courses
      </h2>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const completedLectures = course?.completedLectures || 0;
            const totalLectures = course?.totalLectures || 1;
            const progress = Math.round(
              (completedLectures / totalLectures) * 100
            );

            return (
              <div
                key={course._id}
                className="bg-gray-700 shadow-lg rounded-lg overflow-hidden"
              >
                <img
                  src={
                    course?.thumbnail?.url || "https://via.placeholder.com/300"
                  }
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  <p className="text-sm mb-2">{course.description}</p>
                  <p className="text-blue-400 font-medium">
                    Category: {course.category}
                  </p>
                  <p className="text-green-400 font-medium mb-2">
                    Price: ${course.price}
                  </p>

                  {/* Progress Bar */}
                  {/* <div className="mb-4">
                    <p className="text-sm">Progress: {progress}%</p>
                    <div className="w-full bg-gray-600 h-2 rounded">
                      <div
                        className="bg-blue-500 h-2 rounded"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div> */}

                  <ProgressBar userId={userId} courseId={course._id} />

                  {/* Watch Course Button */}
                  <button
                    onClick={() => navigate(`/course/enroll/${course._id}`)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-300"
                  >
                    Watch Course
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400">No enrolled courses found.</p>
      )}
    </div>
  );
};

export default EnrolledCourses;
