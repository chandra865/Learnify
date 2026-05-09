import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import { User, Layers, Clock } from "lucide-react";

const CourseCard = ({ course, layout = "vertical" }) => {
  const dispatch = useDispatch();

  const handleClick = () => dispatch(setSelectedCourse(course));

  const PriceDisplay = () => (
    <div className="flex items-center gap-2">
      {course.price === course.finalPrice ? (
        <span className="text-sm font-black text-slate-900">₹{course.price}</span>
      ) : (
        <>
          <span className="text-sm font-black text-slate-900">₹{course.finalPrice}</span>
          <span className="text-[10px] font-medium text-slate-400 line-through">₹{course.price}</span>
        </>
      )}
    </div>
  );

  if (layout === "horizontal") {
    return (
      <Link onClick={handleClick} to={`/course/enroll/${course._id}`} className="block group">
        <Card hover className="flex flex-col md:flex-row gap-6 p-4 bg-white border-slate-200">
          <div className="w-full md:w-56 h-36 shrink-0 overflow-hidden rounded-md border border-slate-100">
            <img
              src={course.thumbnail?.url}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <PriceDisplay />
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                {course.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <User size={12} />
                {course?.instructor?.name || "Verified Expert"}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Layers size={12} />
                {course.lectures?.length || 0} Modules
              </div>
              <div className="ml-auto">
                <StarRating rating={course.averageRating || 0} />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link onClick={handleClick} to={`/course/enroll/${course._id}`} className="block group">
      <Card hover className="h-full flex flex-col bg-white border-slate-200">
        <div className="relative h-44 overflow-hidden border-b border-slate-100">
          <img
            src={course.thumbnail?.url}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
             <Badge variant="primary" className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-sm">
                ₹{course.finalPrice}
             </Badge>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-md font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
              {course.title}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <User size={10} />
              {course?.instructor?.name || "Verified Expert"}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <StarRating rating={course.averageRating || 0} />
            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">
               <Clock size={10} />
               Self-Paced
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CourseCard;
