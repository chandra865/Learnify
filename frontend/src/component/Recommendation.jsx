import axios from "axios";
import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Users, 
  Terminal, 
  ChevronRight, 
  Target, 
  Zap, 
  Layers,
  ArrowRight
} from "lucide-react";
import { toast } from "react-toastify";
import { courseBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

const Recommendation = () => {
  const courseId = useSelector((state) => state.course.selectedCourse?._id);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!courseId) return;
      try {
        const response = await axios.get(`${courseBaseUrl}/recommend/${courseId}`);
        setCourses(response.data.data);
      } catch (error) {
        toast.error("Recommendation registry sync failure");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [courseId]);

  if (loading && courses.length === 0) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Registry Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
              <Target size={16} />
           </div>
           <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 leading-none mb-1">Recommended Protocols</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discovery Node suggestions</p>
           </div>
        </div>
        <Badge variant="outline" className="border-slate-100 text-slate-400 text-[10px] font-black uppercase px-4 py-2">
           Registry v4.0 Active
        </Badge>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => (
            <Link key={course._id} to={`/course/enroll/${course._id}`} className="group">
              <Card className="p-0 border-slate-200 overflow-hidden group-hover:border-blue-300 transition-all flex flex-col md:flex-row relative bg-white">
                <div className="w-full md:w-48 h-32 overflow-hidden shrink-0 relative">
                   <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-all z-10" />
                   <img
                     src={course.thumbnail?.url || "https://via.placeholder.com/300"}
                     alt={course.title}
                     className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                   />
                   <div className="absolute top-3 left-3 z-20">
                      <Badge className="bg-slate-900/80 backdrop-blur-md text-[8px] border-none">₹{course.price}</Badge>
                   </div>
                </div>

                <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="space-y-2">
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-6">
                         <StarRating rating={course.averageRating || 0} />
                         <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Users size={12} className="text-slate-300" />
                            {course.studentenrolled} Learners
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                         <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Sync Node</span>
                         <div className="flex items-center gap-1 text-slate-900 font-bold">
                            Commit <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                         </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                         <Zap size={20} className={course.studentenrolled > 100 ? "animate-pulse" : ""} />
                      </div>
                   </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="py-20 text-center space-y-6 border-dashed border-slate-200 bg-slate-100/30">
           <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-slate-300 shadow-sm">
              <Layers size={32} />
           </div>
           <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Discovery matrix exhausted</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">No additional intelligence nodes detected in current local registry.</p>
           </div>
        </Card>
      )}
    </div>
  );
};

export default Recommendation;
