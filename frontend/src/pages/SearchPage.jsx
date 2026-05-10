import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CourseCard from "../component/CourseCard";
import { courseBaseUrl } from "../utils/endpoints";
import SkeletonLoader from "../component/SkeletonLoader";
import { getErrorMessage } from "../utils/errorUtils";
import { toast } from "react-toastify";

import Pagination from "../component/Pagination";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query"); //Get search query from URL
  const initialPage = parseInt(searchParams.get("page")) || 1;
  
  const [courses, setCourses] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: initialPage,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [filters, setFilters] = useState({
    title: query || "",
    rating: "",
    price: "",
    language: "",
    page: initialPage,
  });

  useEffect(() => {
    const queryParam = searchParams.get("query") || "";
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const ratingParam = searchParams.get("rating") || "";
    const priceParam = searchParams.get("price") || "";
    const languageParam = searchParams.get("language") || "";

    setFilters((prev) => {
      if (
        prev.title === queryParam &&
        prev.page === pageParam &&
        prev.rating === ratingParam &&
        prev.price === priceParam &&
        prev.language === languageParam
      ) {
        return prev;
      }
      return {
        ...prev,
        title: queryParam,
        page: pageParam,
        rating: ratingParam,
        price: priceParam,
        language: languageParam,
      };
    });
  }, [searchParams]);

  useEffect(() => {
    fetchCourses(filters);
    // Update URL when filters change
    const params = new URLSearchParams();
    if (filters.title) params.set("query", filters.title);
    if (filters.rating) params.set("rating", filters.rating);
    if (filters.price) params.set("price", filters.price);
    if (filters.language) params.set("language", filters.language);
    params.set("page", filters.page.toString());
    
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); //Fetch courses when filters change

  const fetchCourses = async (currentFilters) => {
    setLoading(true); //Show loading before fetching
    try {
      const response = await axios.get(
        `${courseBaseUrl}/search`,
        {
          params: currentFilters,
        }
      );
      const { list, pagination: pagData } = response.data.data;
      setCourses(list);
      setTotalResults(pagData.totalItems || 0); 
      setPagination(pagData);
    } catch (error) {
      toast.error(getErrorMessage(error, "Error fetching search results"));
    } finally {
      setLoading(false); //Hide loading after fetching
    }
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 }); // Reset to page 1 on filter change
  };

  return (
    <div className="container mx-auto bg-gray-900 text-white min-h-screen p-20" >
      {/* Search Results Header */}
      <h2 className="text-2xl font-extrabold mb-4 ml-5 pt-10">
        {loading
          ? "Loading results..."
          : `${totalResults.toLocaleString()} results for “${filters.title}”`}
      </h2>

      <div className="md:flex">
        {/* Sidebar Filters (Fixed) */}
        <div className="w-full md:w-1/4 p-4 bg-gray-800 rounded-lg md:sticky md:top-6 h-fit ml-5 z-0">
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
            value={filters.language}
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
            <SkeletonLoader type="card" count={3} />
          ) : courses.length > 0 ? (
            <>
              <div className="grid gap-6">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
              <Pagination 
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
              />
            </>
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