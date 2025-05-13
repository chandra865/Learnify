import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CourseCard from "../component/CourseCard";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; //Base URL for API

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query"); //Get search query from URL
  const [courses, setCourses] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    title: query || "",
    rating: "",
    price: "",
    language: "",
  });

  useEffect(() => {
    fetchCourses(filters);
  }, [filters]); //Fetch courses when filters change

  const fetchCourses = async (filters) => {
    console.log(filters);
    setLoading(true); //Show loading before fetching
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/course/course-search`,
        {
          params: filters,
        }
      );
      setCourses(response.data.data);
      setTotalResults(response.data.data.length || 0); //Set total results
    } catch (error) {
      toast.error(
        error?.response?.data.message || "Error fetching courses"
      );
    } finally {
      setLoading(false); //Hide loading after fetching
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto bg-gray-900 text-white min-h-screen pd-20" >
      {/* Search Results Header */}
      <h2 className="text-2xl font-extrabold mb-4 ml-5 pt-10">
        {loading
          ? "Loading results..."
          : `${totalResults.toLocaleString()} results for “${filters.title}”`}
      </h2>

      <div className="md:flex">
        {/* Sidebar Filters (Fixed) */}
        <div className="w-full md:w-1/4 p-4 bg-gray-800 rounded-lg md:sticky md:top-6 h-fit ml-5">
          <h3 className="text-xl font-bold mb-3">Filters</h3>

          {/* Rating Filter */}
          <label className="block text-sm font-semibold mb-1">Rating</label>
          <select
            name="rating"
            value={filters.rating}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3 bg-gray-800"
          >
            <option value="">Any</option>
            <option value="5">⭐ 5</option>
            <option value="4">⭐ 4 & above</option>
            <option value="3">⭐ 3 & above</option>
          </select>

          {/* Price Filter */}
          <label className="block text-sm font-semibold mb-1">Price</label>
          <select
            name="price"
            value={filters.price}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3 bg-gray-800"
          >
            <option value="">Any</option>
            <option value="0">Free</option>
            <option value="500">₹500+</option>
            <option value="1000">₹1000+</option>
            <option value="5000">₹5000+</option>
            <option value="10000">₹10,000+</option>
            <option value="20000">₹20,000+</option>
          </select>

          {/* Language Filter */}
          <label className="block text-sm font-semibold mb-1">Language</label>
          <select
            name="language"
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3 bg-gray-800"
          >
            <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>

        {/* Course List (Scrollable) */}
        <div className="w-full px-5">
          {loading ? (
            <p className="text-center text-lg font-semibold">
              Fetching courses...
            </p>
          ) : courses.length > 0 ? (
            <div className="grid gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-center text-lg font-semibold text-gray-500">
              No courses found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;