import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Loading from "../component/Loading";
import CourseCard from "../component/CourseCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Navigation, Pagination as SwiperPagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { courseBaseUrl, categoryBaseUrl } from "../utils/endpoints";
import Pagination from "../component/Pagination";

const Courses = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryCourses, setCategoryCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const swiperRef = useRef(null);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(categoryBaseUrl);
        const categoryData = response.data.data;
        setCategories(categoryData.map(cat => cat.name));
        if (categoryData.length > 0) {
          setActiveCategory(categoryData[0].name);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch categories");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Courses for active category and page
  useEffect(() => {
    if (!activeCategory) return;

    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        const response = await axios.get(courseBaseUrl, {
          params: {
            category: activeCategory,
            page: currentPage,
            limit: 8
          }
        });
        const { list, pagination: pagData } = response.data.data;
        setCategoryCourses(list);
        setPagination(pagData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch courses");
      } finally {
        setCoursesLoading(false);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [activeCategory, currentPage]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to page 1
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading && !activeCategory) return <Loading />;

  return (
    <div className="bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto text-white">
        <h2 className="text-3xl font-extrabold text-center mb-8">
          Explore Our Courses
        </h2>

        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400">No courses available</p>
        ) : (
          <>
            {/* Category Tabs Slider */}
            <div className="relative mb-8">
              <Swiper
                ref={swiperRef}
                spaceBetween={20}
                slidesPerView={3}
                loop={categories.length > 6}
                modules={[Navigation, SwiperPagination]}
                breakpoints={{
                  480: { slidesPerView: 3 },
                  640: { slidesPerView: 4 },
                  768: { slidesPerView: 5 },
                  1024: { slidesPerView: 6 },
                }}
              >
                {categories.map((category, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`cursor-pointer text-center py-3 px-4 rounded-full transition-all duration-300 border-2 whitespace-nowrap ${
                        activeCategory === category
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                      }`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div
                className="absolute top-1/2 -left-12 transform -translate-y-1/2 cursor-pointer text-2xl text-gray-400 hover:text-white transition-colors"
                onClick={() => swiperRef.current.swiper.slidePrev()}
              >
                <FaChevronLeft />
              </div>
              <div
                className="absolute top-1/2 -right-12 transform -translate-y-1/2 cursor-pointer text-2xl text-gray-400 hover:text-white transition-colors"
                onClick={() => swiperRef.current.swiper.slideNext()}
              >
                <FaChevronRight />
              </div>
            </div>

            {/* Courses Grid */}
            <div className="min-h-[400px]">
              {coursesLoading ? (
                <div className="flex justify-center items-center h-64">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : categoryCourses.length > 0 ? (
                <>
                  <h3 className="text-2xl font-extrabold text-center mb-10">
                    Courses in {activeCategory}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categoryCourses.map((course) => (
                      <CourseCard
                        key={course._id}
                        course={course}
                        layout="vertical"
                      />
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
                <p className="text-center text-gray-500 py-20">No courses found in this category.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
