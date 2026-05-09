import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ProgressBar from "../component/ProgressBar";
import { Link } from "react-router-dom";
import StarRating from "../component/StarRating";
import { toast } from "react-toastify";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";
import { useDispatch } from "react-redux";
import { enrollmentBaseUrl } from "../utils/endpoints";
import SkeletonLoader from "../component/SkeletonLoader";
import { getErrorMessage } from "../utils/errorUtils";
import Pagination from "../component/Pagination";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user.userData?._id);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `${enrollmentBaseUrl}/${userId}`,
          { 
            params: { page: currentPage, limit: 10 },
            withCredentials: true 
          }
        );

        const { list, pagination: pagData } = response.data.data;
        setCourses(list);
        setPagination(pagData);
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to fetch enrolled courses"));
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchEnrolledCourses();
  }, [userId, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const dispatch = useDispatch();
  const handleClick = (course) => dispatch(setSelectedCourse(course));

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <h2 className="text-2xl font-extrabold text-center mb-6 text-white">Enrolled Courses</h2>
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <SkeletonLoader type="card" count={4} />
        ) : courses.length > 0 ? (
          <div className="">
            {courses.map((course) => (
              <Link 
              key={course._id}
              onClick={() => handleClick(course)}
              to={`/course/enroll/${course._id}`}>
                <div className="flex mb-4 border-b-2 hover:bg-gray-700 transform transition duration-300 hover:scale-102">
                  {/* Course Image */}
                  <div className="w-70 h-40 flex-shrink-0">
                    <img
                      src={course.thumbnail?.url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Course Details */}
                  <div className="flex flex-row w-full ">
                    <div className="w-full px-4">
                      <p className="text-xl font-extrabold">{course.title}</p>
                      <div>
                        <p className="text-white">{course.subtitle}</p>
                        <p className="text-white-500 text-sm my-1">
                          {course?.instructor?.name || "Unknown Instructor"}
                        </p>

                        {/* Rating */}
                        <StarRating rating={course.averageRating || 0} />

                        {/* Course Meta Info */}
                        {/* <p className="text-white-500 text-sm my-1">
                          {course.lecture?.length || 0} Lectures
                        </p> */}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between">
                      <p className="px-10 text-xl font-extrabold ">
                        ₹{course.price}
                      </p>
                      <ProgressBar userId={userId} courseId={course._id} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            <Pagination 
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
            />
        </div>
      ) : (
        <p className="text-center text-gray-400">No enrolled courses found.</p>
      )}
      </div>
    </div>
  );
};

export default EnrolledCourses;
