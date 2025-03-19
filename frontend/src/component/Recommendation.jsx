import axios from "axios";
import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { Link } from "react-router-dom";

const Recommendation = ({ courseId }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/course/recommend/${courseId}`);
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error?.response?.data?.message || error.message);
      }
    };

    fetchRecommendations();
  }, [courseId]);

  return (
    <div className="p-6 mt-10 bg-gray-900 rounded-lg shadow-lg">
      <h3 className="text-3xl font-bold mb-6 text-center text-white">Recommended Courses</h3>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
              <img
                src={course.thumbnail?.url || "https://via.placeholder.com/300"}
                alt={course.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                <StarRating rating={course.averageRating || 0} />
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{course.description}</p>
                <p className="text-blue-400 font-medium mt-2">Category: {course.category}</p>
                <p className="text-green-400 font-semibold mt-1">Price: ${course.price}</p>

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
      ) : (
        <p className="text-white text-center">No recommendations available.</p>
      )}
    </div>
  );
};

export default Recommendation;
