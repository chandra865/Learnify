import { Link } from "react-router-dom";
import StarRating from "./StarRating";
const CourseCard = ({ course }) => {
  return (
    <div className="flex py-4 px-2 bg-gray-700 hover:bg-gray-800 transition">
      {/* Course Image */}
      <div className="w-70 h-40 flex-shrink-0">
        <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover rounded" />
      </div>

      {/* Course Details */}
      <div className="flex flex-col gap-2 ml-4 flex-grow">
        <div className="flex justify-between">
          <Link to={`/course/enroll/${course._id}`} className="text-2xl font-bold">
            {course.title}
          </Link>
          <p className="pr-10 text-xl">{course.price}</p>
        </div>

        <div>
          <p className="text-white text-400">{course.description.slice(0, 80)}...</p>
          {/* <p className="text-gray-500 text-xs mt-1">{course.instructor.name}, Instructor</p> */}

          {/* Rating */}
          <StarRating rating={course.averageRating || 0} />

          {/* Course Meta Info */}
          <p className="text-gray-500 text-sm mt-1">{course.lectures?.length || 0} lectures</p>
        </div>

        {/* Badges & Price */}
        {/* <div className="flex justify-between items-center mt-3">
          <div className="flex gap-2">
            {course.isPremium && <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">Premium</span>}
            {course.isBestseller && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Bestseller</span>}
          </div>
          <span className="text-lg font-bold">₹{course.price}</span>
        </div> */}
      </div>
    </div>
  );
};

export default CourseCard;
