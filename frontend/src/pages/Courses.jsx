import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../component/Loading";
import StarRating from "../component/StarRating";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/course/all-courses"
        );
        const courseData = response.data.data;
        const filteredCourses = courseData.filter(
          (course) => course.published === true
        );
        setCourses(filteredCourses);
      } catch (err) {
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
      <div className="w-full max-w-7xl p-6 bg-white shadow-xl rounded-xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Explore Our Courses
        </h2>

        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-600">No courses available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white border rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                {/* Course Thumbnail */}
                <img
                  src={course.thumbnail?.url || "https://via.placeholder.com/300"}
                  alt={course.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  {/* Course Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>

                  {/* Star Rating */}
                  <StarRating rating={course.averageRating || 0} />

                  {/* Description */}
                  <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Category & Price */}
                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-blue-600 font-medium text-sm">
                      {course.category}
                    </p>
                    <p className="text-gray-900 font-bold">${course.price}</p>
                  </div>

                  {/* View Details Button */}
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
