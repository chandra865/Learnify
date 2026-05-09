import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  ArrowLeft, 
  Plus, 
  Settings, 
  Layers, 
  BookOpen, 
  Tag, 
  Globe, 
  BarChart3, 
  MessageSquare,
  Zap,
  Terminal,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import Loading from "../component/Loading";
import StarRating from "../component/StarRating";
import EditCourse from "./EditCourse";
import PublishCourse from "../component/PublishCourse";
import AddResources from "../component/AddResources";
import CourseAnalytics from "../component/CourseAnalytics";
import CommentsFeedback from "../component/CommentsFeedback";
import Coupon from "../component/Coupon";
import CourseCurriculum from "../component/CourseCurriculum";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";
import { courseBaseUrl } from "../utils/endpoints";
import Card from "../component/ui/Card";
import Badge from "../component/ui/Badge";
import Button from "../component/ui/Button";

const CreatedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(false);
  const [chossenCourse, setChossenCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("edit");
  const userId = useSelector((state) => state.user.userData?._id);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCreatedCourses = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${courseBaseUrl}/${userId}/instructor`, { withCredentials: true });
        setCourses(response.data.data);
      } catch (err) {
        toast.error("Authoring registry sync failed");
      } finally {
        setLoading(false);
      }
    };
    fetchCreatedCourses();
  }, [userId]);

  const tabs = [
    { key: "edit", label: "Manifest", icon: <Settings size={14} /> },
    { key: "lecture", label: "Nodes", icon: <Layers size={14} /> },
    { key: "resources", label: "Assets", icon: <BookOpen size={14} /> },
    { key: "coupon", label: "Protocol", icon: <Tag size={14} /> },
    { key: "publish", label: "Deployment", icon: <Globe size={14} /> },
    { key: "analytics", label: "Metrix", icon: <BarChart3 size={14} /> },
    { key: "feedback", label: "Intelligence", icon: <MessageSquare size={14} /> },
  ];

  const handleCourseSelection = (course) => {
    dispatch(setSelectedCourse(course));
    setChossenCourse(course);
    setSelected(true);
    setActiveTab("edit");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "edit": return <EditCourse />;
      case "publish": return <PublishCourse />;
      case "resources": return <AddResources />;
      case "lecture": return <CourseCurriculum />;
      case "coupon": return <Coupon />;
      case "analytics": return <CourseAnalytics />;
      case "feedback": return <CommentsFeedback />;
      default: return <EditCourse />;
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!selected ? (
        <div className="space-y-10">
          {/* Header Protocol */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600 border border-indigo-500/20">
                     <Layers size={16} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Instructor Authoring Matrix</p>
               </div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
                  Created <br />
                  <span className="text-slate-400">Knowledge Nodes</span>
               </h2>
            </div>
            <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 px-4 py-2">
               {courses.length} Nodes under Management
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {courses.length === 0 ? (
                <Card className="py-24 text-center space-y-6 border-dashed border-slate-200 bg-slate-50/50">
                   <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-slate-300 shadow-sm">
                      <Plus size={32} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">No Protocols Deployed</h3>
                      <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto">
                        Your authoring environment is currently empty. Initialize a new knowledge node to begin synchronization.
                      </p>
                   </div>
                   <Button size="sm" onClick={() => navigate("/dashboard/create")}>Initialize Deployment</Button>
                </Card>
             ) : (
                courses.map((course) => (
                  <Card 
                    key={course._id} 
                    onClick={() => handleCourseSelection(course)}
                    className="p-0 border-slate-200 overflow-hidden hover:border-indigo-300 hover:shadow-xl transition-all group cursor-pointer"
                  >
                     <div className="flex flex-col md:flex-row items-stretch">
                        <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden bg-slate-100">
                           <img src={course.thumbnail?.url} alt={course.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                 <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{course.title}</h3>
                                 <p className="text-sm font-medium text-slate-400 line-clamp-1">{course.subtitle}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-lg font-black text-slate-900 tracking-tighter italic">₹{course.price}</p>
                                 <Badge variant="outline" className="mt-1 text-[8px] border-slate-200 text-slate-400">Node ID: {course._id.slice(-6)}</Badge>
                              </div>
                           </div>
                           <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
                              <div className="flex items-center gap-6">
                                 <div className="flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stability Verified</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-amber-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deployment Active</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                                 Manage Protocol <ChevronRight size={14} />
                              </div>
                           </div>
                        </div>
                     </div>
                  </Card>
                ))
             )}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
           {/* Authoring Interface */}
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <Button variant="ghost" size="sm" onClick={() => setSelected(false)} className="p-2 -ml-2 text-slate-400 hover:text-slate-900">
                    <ArrowLeft size={20} />
                 </Button>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Node Management Hub</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight text-white uppercase">{chossenCourse.title}</h3>
                 </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                 <Terminal size={14} className="text-indigo-400" />
                 Operational Layer: Active
              </div>
           </div>

           <Card className="p-0 border-slate-200 overflow-hidden bg-white">
              <div className="flex flex-wrap border-b border-slate-100 bg-slate-50/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all relative
                      ${activeTab === tab.key ? "text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"}`}
                  >
                    {tab.icon}
                    {tab.label}
                    {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600" />}
                  </button>
                ))}
              </div>
              <div className="p-8 md:p-12">
                 <div className="max-w-5xl mx-auto">
                    {renderTabContent()}
                 </div>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};

export default CreatedCourses;