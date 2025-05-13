import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";

const CourseCard = ({ course, layout = "horizontal" }) => {
  const dispatch = useDispatch();

  const handleClick = () => dispatch(setSelectedCourse(course));

  return layout === "horizontal" ? (
    // Responsive Horizontal Card
    <Link
      onClick={handleClick}
      to={`/course/enroll/${course._id}`}
      className="block"
    >
      <div className="flex flex-col md:flex-row gap-4 border-b-2 py-4 px-2 hover:bg-gray-700 transition duration-300 hover:scale-[1.01]">
        {/* Course Image */}
        <div className="w-full md:w-60 h-40 flex-shrink-0">
          <img
            src={course.thumbnail?.url}
            alt={course.title}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Course Details */}
        <div className="flex flex-col md:flex-row justify-between w-full">
          <div className="flex-1 px-1 md:px-4 space-y-1">
            <h1 className="text-lg md:text-xl font-extrabold">{course.title}</h1>
            <p className="text-sm text-white">{course.subtitle}</p>
            <p className="text-xs text-gray-400">
              {course?.instructor?.name || "Unknown Instructor"}
            </p>
            <StarRating rating={course.averageRating || 0} />
          </div>
          <div className="md:px-4 mt-2 md:mt-0">
            <p className="text-xl font-extrabold">₹{course.price}</p>
          </div>
        </div>
      </div>
    </Link>
  ) : (
    // Responsive Vertical Card
    <Link
      onClick={handleClick}
      to={`/course/enroll/${course._id}`}
      className="block"
    >
      <div className="hover:bg-gray-700 transition transform hover:scale-105 p-2 rounded">
        {/* Course Image */}
        <div className="h-40 md:h-48 w-full rounded overflow-hidden">
          <img
            src={course.thumbnail?.url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Course Details */}
        <div className="mt-3 space-y-1">
          <h1 className="text-lg md:text-xl font-extrabold">{course.title}</h1>
          <p className="text-xs text-gray-400">
            {course?.instructor?.name || "Unknown Instructor"}
          </p>
          <StarRating rating={course.averageRating || 0} />

          {/* Price */}
          <div className="flex items-center gap-2 mt-1">
            {course.price === course.finalPrice ? (
              <span className="text-lg font-extrabold">₹{course.price}</span>
            ) : (
              <>
                <span className="text-lg font-extrabold">
                  ₹{course.finalPrice}
                </span>
                <span className="line-through text-sm text-gray-500">
                  ₹{course.price}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
