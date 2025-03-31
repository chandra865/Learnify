import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";

const CourseCard = ({ course, layout = "horizontal" }) => {

  const dispatch = useDispatch();
  

  return layout === "horizontal" ? (
    // Horizontal Card
    <Link 
    onClick={()=>dispatch(setSelectedCourse(course))}
    to={`/course/enroll/${course._id}`}>
      <div className="flex py-4 px-2 border-b-2 hover:bg-gray-700 transform transition duration-300 hover:scale-102">
        {/* Course Image */}
        <div className="w-70 h-40 flex-shrink-0">
          <img
            src={course.thumbnail.url}
            alt={course.title}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Course Details */}
        <div className="flex flex-row w-full ">
          <div className="w-full px-4">
            <h1 className="text-xl font-extrabold">{course.title}</h1>

            <div>
              <p className="text-white">{course.description}</p>
              <p className="text-white-500 text-sm my-1">
                {course?.instructor?.name || "Unknown Instructor"}
              </p>

              {/* Rating */}
              <StarRating rating={course.averageRating || 0} />

              {/* Course Meta Info */}
              <p className="text-white-500 text-sm my-1">
                {course.lecture?.length || 0} Lectures
              </p>
            </div>
          </div>
          <p className="px-10 text-xl font-extrabold ">₹{course.price}</p>
        </div>
      </div>
    </Link>
  ) : (
    // Vertical Card
    <Link 
    onClick={()=>dispatch(setSelectedCourse(course))}
    to={`/course/enroll/${course._id}`}>
      <div className=" rounded-lg hover:bg-gray-700 transition transform hover:scale-105">
        {/* Course Image */}
        <div className="h-40 object-cover">
          <img
            src={course.thumbnail?.url}
            alt={course.title}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Course Details */}
        <div className="mt-3">
          <h1 className="text-xl font-extrabold">{course.title}</h1>

          <p className="text-white text-sm">{course.description}</p>
          <p className="text-white-500 text-sm my-1">
            {course?.instructor?.name || "Unknown Instructor"}
          </p>

          {/* Rating */}
          <StarRating rating={course.averageRating || 0} />

          {/* Course Meta Info */}
          <p className="text-white-500 text-sm my-1">
            {course.lecture?.length || 0} Lectures
          </p>

          {/* Price */}
          <p className="text-xl font-extrabold mt-2">₹{course.price}</p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
