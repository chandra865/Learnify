import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../component/Loading";
import StarRating from "../component/StarRating";
import CourseCard from "../component/CourseCard";
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
    <div className="flex justify-center items-center bg-gray-900 py-10">
      <div className="w-full max-w-7xl p-6 bg-gray-900 text-white  rounded-xl">
        <h2 className="text-3xl font-extrabold text-center mb-8">
          Explore Our Courses
        </h2>

        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-600">No courses available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course) => (
              <CourseCard course={course} layout="vertical" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
