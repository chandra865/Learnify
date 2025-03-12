import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../component/Loading";

const CreatedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disable, setDisable] = useState(false);

  const userId = useSelector((state) => state.user.userData?._id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreatedCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/course/inst-courses`,
          { withCredentials: true }
        );
        setCourses(response.data.data);
      } catch (err) {
        // setError("Failed to fetch created courses");
        // console.error(err);
        alert("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCreatedCourses();
  }, [userId, loading]);

  const handleCoursePublish = async (courseId) => {
    // console.log(courseId);
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/course/publish/${courseId}`,
        null,
        {
          withCredentials: true,
        }
      );
      toast.success(response?.data?.message || "Course published successfully!");
      setDisable(true);
      setLoading(true);
    } catch (error) {
      // console.error("Error publishing course:", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Failed to publish course.");
    }
  };

  if (loading) return <Loading/>;

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Created Courses
      </h2>

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
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="mt-2">{course.description}</p>
                <p className="mt-4">Category:- {course.category}</p>
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={() => navigate(`/edit-course/${course._id}`)}
                >
                  Edit Lecture
                </button>

                <button
                  className={`${
                    course.published
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                  } text-white px-4 py-2 rounded-lg  mx-4   `}
                  disabled={course.published}
                  onClick={() => handleCoursePublish(course._id)}
                >
                  Publish Lecture
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id} className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-gray-700">{course.description}</p>
              <p className="text-blue-600 font-medium">Category: {course.category}</p>
              <p className="text-green-600 font-medium">Price: ₹{course.price}</p>
              
              <div className="mt-4">
                <button
                  onClick={() => navigate(`/course/edit/${course._id}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition duration-300 w-full"
                >
                  Edit Course
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No created courses found.</p>
        )}
      </div> */}
    </div>
  );
};

export default CreatedCourses;
