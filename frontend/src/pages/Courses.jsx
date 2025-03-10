import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/course/all-courses");
        const courseData = response.data.data;
        const filteredCourses = courseData.filter((course) => course.published === true)
        console.log(filteredCourses);
        setCourses(filteredCourses);
      } catch (err) {
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-6xl p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Available Courses</h2>
        {loading ? (
          <p className="text-center text-gray-600">Loading courses...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-600">No courses available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-gray-50 border rounded-lg overflow-hidden shadow-md">
                <img
                  src={course.thumbnail?.url || "https://via.placeholder.com/300"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-700 mb-3">{course.description}</p>
                  <p className="text-blue-600 font-medium">Category: {course.category}</p>
                  <p className="text-blue-600 font-medium">Price: ${course.price}</p>
                  <Link
                    to={`/course/enroll/${course._id}`}
                    className="mt-4 block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
