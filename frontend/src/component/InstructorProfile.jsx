import { 
  Star, 
  Users, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Terminal, 
  User,
  Zap,
  Quote
} from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { userBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import StarRating from "./StarRating";

const InstructorProfile = () => {
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [enrolledStudents, setEnrolledStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  const course = useSelector((state) => state.course.selectedCourse);
  const instructorId = course?.instructor?._id;

  const fetchInstructorStats = async () => {
    if (!instructorId) return;
    try {
      const statsRes = await axios.get(`${userBaseUrl}/stats/${instructorId}`, { withCredentials: true });
      setTotalCourses(statsRes.data.data.totalCourses);
      setEnrolledStudents(statsRes.data.data.totalStudents);

      const ratingRes = await axios.get(`${userBaseUrl}/${instructorId}/rating-reviews`, { withCredentials: true });
      setRating(ratingRes.data.data.averageRating);
      setReviews(ratingRes.data.data.totalReviews);
    } catch (error) {
      console.error("Instructor registry sync failure");
    }
  };

  useEffect(() => {
    fetchInstructorStats();
  }, [instructorId]);

  if (!course?.instructor) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
         <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
            <User size={16} />
         </div>
         <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Entity Topology</h2>
      </div>

      <Card className="p-8 border-slate-200 bg-white group hover:border-blue-300 transition-all">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Avatar Station */}
          <div className="relative shrink-0">
             <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] overflow-hidden border-4 border-white shadow-xl relative z-10 grayscale-[0.2] group-hover:grayscale-0 transition-all">
                <img
                  src={course.instructor?.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="Instructor"
                  className="w-full h-full object-cover"
                />
             </div>
             <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg z-20">
                <ShieldCheck size={16} />
             </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">
                 {course.instructor.name}
               </h3>
               <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                     <StarRating rating={rating} />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">({reviews} Analysis)</span>
                  </div>
                  <Badge variant="outline" className="text-[8px] border-slate-100 text-slate-400">Stable Protocol v4.0</Badge>
               </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-50">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                     <Users size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest leading-none">Yield (Students)</span>
                  </div>
                  <p className="text-lg font-black text-slate-900 tracking-tighter italic">{enrolledStudents}</p>
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                     <BookOpen size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest leading-none">Nodes (Courses)</span>
                  </div>
                  <p className="text-lg font-black text-slate-900 tracking-tighter italic">{totalCourses}</p>
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                     <ShieldCheck size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest leading-none">Ref Registry</span>
                  </div>
                  <p className="text-lg font-black text-slate-900 tracking-tighter italic">{reviews}</p>
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                     <Zap size={14} className="text-blue-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest leading-none">Rating Index</span>
                  </div>
                  <p className="text-lg font-black text-blue-600 tracking-tighter italic">{rating.toFixed(1)}</p>
               </div>
            </div>

            <div className="pt-6 border-t border-slate-50 relative">
               <Quote size={32} className="absolute -top-2 -left-4 text-slate-50 -z-0" />
               <p className="text-sm font-medium text-slate-500 leading-relaxed italic relative z-10">
                 "{course.instructor.bio || "No intelligence bio available for this entity. Operational status remains active."}"
               </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InstructorProfile;
