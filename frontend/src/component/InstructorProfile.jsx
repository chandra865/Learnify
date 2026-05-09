import { Star, GraduationCap, BookOpen, User, ShieldCheck, Mail } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { userBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

const InstructorProfile = () => {
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [enrolledStudents, setEnrolledStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  const course = useSelector((state) => state.course.selectedCourse);
  const instructorId = course?.instructor._id;

  const fetchInstructorStats = async () => {
    if (!instructorId) return;
    try {
      const response = await axios.get(`${userBaseUrl}/stats/${instructorId}`, { withCredentials: true });
      setTotalCourses(response.data.data.totalCourses);
      setEnrolledStudents(response.data.data.totalStudents);
    } catch (error) {
      // Quiet fail
    }
  };

  const fetchInstructorRating = async () => {
    if (!instructorId) return;
    try {
      const response = await axios.get(`${userBaseUrl}/${instructorId}/rating-reviews`, { withCredentials: true });
      setRating(response.data.data.averageRating);
      setReviews(response.data.data.totalReviews);
    } catch (error) {
      // Quiet fail
    }
  };

  useEffect(() => {
    fetchInstructorRating();
    fetchInstructorStats();
  }, [instructorId]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Lead Architecture</h2>
        <Badge variant="primary" className="bg-blue-50 text-blue-700 border-blue-100">
            Verified Instructor
        </Badge>
      </div>

      <Card className="p-8 lg:p-10 bg-white border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <User size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-10 relative z-10">
          <div className="shrink-0 space-y-4">
             <div className="relative">
                <img
                    src={course.instructor?.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={course.instructor?.name}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-slate-50 shadow-sm"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white">
                    <ShieldCheck size={16} />
                </div>
             </div>
             
             <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <Star size={14} className="text-amber-500 fill-current" />
                    <span>{rating} Instructor Rating</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <GraduationCap size={14} className="text-slate-400" />
                    <span>{enrolledStudents.toLocaleString()} High-Tier Students</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <BookOpen size={14} className="text-slate-400" />
                    <span>{totalCourses} Professional Modules</span>
                </div>
             </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {course?.instructor?.name}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Lead Curriculum Architect</p>
            </div>

            <div className="prose prose-slate max-w-none text-sm font-medium text-slate-600 leading-relaxed">
              {course?.instructor?.bio || "No biographical data synchronized for this architect."}
            </div>

            <div className="pt-6 flex gap-4 border-t border-slate-50">
               <button className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                  <Mail size={14} /> Send Protocol Message
               </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InstructorProfile;
