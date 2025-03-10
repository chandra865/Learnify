import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
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
        setError("Failed to fetch enrolled courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, [userId]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Your Enrolled Courses</h2>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={course?.thumbnail?.url || "https://via.placeholder.com/300"}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                <p className="text-blue-600 font-medium">Category: {course.category}</p>
                <p className="text-green-600 font-medium mb-4">Price: ${course.price}</p>
                <button
                  onClick={() => navigate(`/course/enroll/${course._id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-300"
                >
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No enrolled courses found.</p>
      )}
    </div>
  );
};

export default EnrolledCourses;
