import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../component/Loading";
import CourseCard from "../component/CourseCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryCourses, setCategoryCourses] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/course/all-courses"
        );
        const courseData = response.data.data;
        const filteredCourses = courseData.filter(course => course.published === true);
        setCourses(filteredCourses);

        const defaultCategory = filteredCourses[0]?.category;
        setActiveCategory(defaultCategory);

        if (defaultCategory) {
          setCategoryCourses(
            filteredCourses.filter(course => course.category === defaultCategory)
          );
        }
      } catch (err) {
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCategoryCourses(courses.filter(course => course.category === category));
  };

  if (loading) return <Loading />;

  const categories = [...new Set(courses.map(course => course.category))];

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
            <div className="relative mb-6">
              <Swiper
                ref={swiperRef}
                spaceBetween={20}
                slidesPerView={3}
                loop={true}
                modules={[Navigation, Pagination]}
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
                      className={`cursor-pointer text-center py-3 px-4 rounded-full transition-all duration-300 whitespace-nowrap ${
                        activeCategory === category
                          ? "bg-black text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              <div
                className="absolute top-1/2 left-0 transform -translate-y-1/2 cursor-pointer text-xl text-white hover:text-blue-500"
                style={{ zIndex: 10, left: "-30px" }}
                onClick={() => swiperRef.current.swiper.slidePrev()}
              >
                <FaChevronLeft />
              </div>
              <div
                className="absolute top-1/2 right-0 transform -translate-y-1/2 cursor-pointer text-xl text-white hover:text-blue-500"
                style={{ zIndex: 10, right: "-30px" }}
                onClick={() => swiperRef.current.swiper.slideNext()}
              >
                <FaChevronRight />
              </div>
            </div>

            {/* Courses Grid */}
            {categoryCourses.length > 0 && (
              <div>
                <h3 className="text-2xl font-extrabold text-center mb-6">
                  Top Courses in {activeCategory}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryCourses.slice(0, 12).map((course) => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      layout="vertical"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
