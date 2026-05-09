import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { 
  BookOpen, 
  Clock, 
  Terminal, 
  ShieldCheck, 
  ChevronRight,
  MonitorPlay,
  Layers,
  Zap
} from "lucide-react";
import Loading from "../component/Loading";
import ProgressBar from "../component/ProgressBar";
import StarRating from "../component/StarRating";
import { toast } from "react-toastify";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";
import { enrollmentBaseUrl } from "../utils/endpoints";
import Card from "../component/ui/Card";
import Badge from "../component/ui/Badge";
import Button from "../component/ui/Button";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user.userData?._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${enrollmentBaseUrl}/${userId}`, { withCredentials: true });
        setCourses(response.data.data);
      } catch (err) {
        toast.error("Enrollment registry sync failed");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, [userId]);

  const handleClick = (course) => dispatch(setSelectedCourse(course));

  if (loading) return <Loading />;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Matrix Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                 <MonitorPlay size={16} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Active Knowledge Nodes</p>
           </div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
              Enrolled <br />
              <span className="text-slate-400">Curriculum Matrix</span>
           </h2>
        </div>
        <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 px-4 py-2">
           {courses.length} Active Protocols
        </Badge>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {courses.map((course) => (
            <Link 
              key={course._id}
              onClick={() => handleClick(course)}
              to={`/course/enroll/${course._id}`}
              className="block"
            >
              <Card className="p-0 border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                <div className="flex flex-col md:flex-row items-stretch">
                   {/* Manifest Visual */}
                   <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden bg-slate-100">
                      <img
                        src={course.thumbnail?.url}
                        alt={course.title}
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>

                   {/* Registry Details */}
                   <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6">
                      <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                              {course.title}
                            </h3>
                            <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                               <ChevronRight size={18} />
                            </div>
                         </div>
                         <p className="text-sm font-medium text-slate-400 line-clamp-1">{course.subtitle}</p>
                         <div className="flex items-center gap-4 pt-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Architect: {course?.instructor?.name}</p>
                            <div className="h-3 w-[1px] bg-slate-200" />
                            <StarRating rating={course.averageRating || 0} />
                         </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-slate-100">
                         <div className="flex-1 max-w-sm space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                               <span>Synchronization Progress</span>
                               <Zap size={10} className="text-amber-500" />
                            </div>
                            <ProgressBar userId={userId} courseId={course._id} />
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="text-right">
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dispatch Value</p>
                               <p className="text-lg font-black text-slate-900 tracking-tighter italic">₹{course.price}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="py-24 text-center space-y-6 border-dashed border-slate-200 bg-slate-50/50">
           <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-slate-300 shadow-sm">
              <Layers size={32} />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">No Active Protocols Found</h3>
              <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto">
                Identity registry has no active node subscriptions. Explore discovery terminal to initialize synchronization.
              </p>
           </div>
           <Button variant="outline" size="sm" onClick={() => navigate("/courses")}>Discovery Hub</Button>
        </Card>
      )}
    </div>
  );
};

export default EnrolledCourses;
