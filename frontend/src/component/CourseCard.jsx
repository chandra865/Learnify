import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";
import { User, BookOpen, Clock, ShieldCheck, ArrowRight, Zap } from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

const CourseCard = ({ course, layout = "vertical" }) => {
  const dispatch = useDispatch();

  const handleClick = () => dispatch(setSelectedCourse(course));

  const content = (
    <>
      {/* Media Node */}
      <div className={`relative overflow-hidden ${layout === "horizontal" ? "w-full md:w-72 h-48 md:h-full" : "h-48"} flex-shrink-0 group-hover:scale-105 transition-transform duration-500`}>
        <img
          src={course.thumbnail?.url}
          alt={course.title}
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge variant="primary" className="bg-white/90 backdrop-blur-sm border-white/50 text-blue-700 shadow-sm">
                {course.category}
            </Badge>
            {course.level && (
                 <Badge variant="outline" className="bg-slate-900/50 backdrop-blur-sm border-slate-700 text-white shadow-sm">
                    {course.level}
                </Badge>
            )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Identity Node */}
      <div className="flex-1 p-6 flex flex-col justify-between gap-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-[1.1] group-hover:text-blue-600 transition-colors line-clamp-2">
              {course.title}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest line-clamp-1">
              {course.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 py-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <User size={12} className="text-slate-400" />
              {course?.instructor?.name || "Expert Architect"}
            </div>
            <div className="h-3 w-[1px] bg-slate-200" />
            <StarRating rating={course.averageRating || 0} />
          </div>

          <div className="flex items-center gap-5 pt-1">
             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <BookOpen size={12} />
                {course.sections?.length || 0} Modules
             </div>
             {course.duration && (
               <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Clock size={12} />
                {course.duration}
              </div>
             )}
          </div>
        </div>

        {/* Action & Pricing Matrix */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Terminal Price</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900 tracking-tight">₹{course.finalPrice}</span>
              {course.price !== course.finalPrice && (
                <span className="text-xs font-bold text-slate-400 line-through">₹{course.price}</span>
              )}
            </div>
          </div>
          
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
             <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Link
      onClick={handleClick}
      to={`/course/enroll/${course._id}`}
      className="group block h-full focus:outline-none"
    >
      <Card className={`h-full flex ${layout === "horizontal" ? "flex-col md:flex-row md:h-64" : "flex-col"} hover:border-blue-600/20 transition-all duration-300 transform group-hover:translate-y-[-4px]`}>
        {content}
      </Card>
    </Link>
  );
};

export default CourseCard;
