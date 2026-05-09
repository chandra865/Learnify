import { useEffect, useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  PlayCircle, 
  Lock, 
  Unlock, 
  Clock, 
  Layers, 
  X, 
  Play,
  MonitorPlay,
  Terminal,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import VideoPlayer1 from "./VideoPlayer1";
import { toast } from "react-toastify";
import { enrollmentBaseUrl, sectionBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

const CourseContent = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseContent, setCourseContent] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const courseId = useSelector((state) => state.course.selectedCourse._id);
  const user = useSelector((state) => state.user.userData);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialStatus = async () => {
      if (user && courseId) {
        try {
          const res = await axios.get(`${enrollmentBaseUrl}/${user._id}/${courseId}`, { withCredentials: true });
          setIsEnrolled(res.data.data.enrollmentStatus);
        } catch (err) {}
      }
    };
    fetchInitialStatus();
  }, [user, courseId]);

  useEffect(() => {
    const fetchContent = async () => {
      if (courseId) {
        try {
          const res = await axios.get(`${sectionBaseUrl}/${courseId}`, { withCredentials: true });
          const sections = res.data.data.filter(s => s.published);
          setCourseContent(sections);
          
          const initialState = {};
          sections.forEach(s => { initialState[s._id] = false; });
          setExpandedSections(initialState);
        } catch (err) {
          toast.error("Curriculum sync failed");
        }
      }
    };
    fetchContent();
  }, [courseId]);

  const handleWatch = (section, lecture) => {
    if (isEnrolled) {
      navigate(`/course-watch/${courseId}/${section._id}/${lecture._id}`);
    } else if (lecture.isFree) {
      setSelectedLecture(lecture);
      setShowPreview(true);
    } else {
      toast.error("Protocol error: Enrollment required for this node");
    }
  };

  const toggleAll = () => {
    const allExp = Object.values(expandedSections).every(v => v);
    const newState = {};
    Object.keys(expandedSections).forEach(k => { newState[k] = !allExp; });
    setExpandedSections(newState);
  };

  const totalS = courseContent.reduce((a, s) => a + (s.duration || 0), 0);
  const totalL = courseContent.reduce((a, s) => a + s.lectures.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Curriculum Topology</h2>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <span>{courseContent.length} Sections</span>
             <div className="w-1 h-1 rounded-full bg-slate-300" />
             <span>{totalL} Nodes</span>
             <div className="w-1 h-1 rounded-full bg-slate-300" />
             <span>{Math.floor(totalS / 3600)}h {Math.floor((totalS % 3600) / 60)}m Total</span>
          </div>
        </div>
        <button 
          onClick={toggleAll}
          className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
        >
          {Object.values(expandedSections).every(v => v) ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white overflow-hidden shadow-sm">
        {courseContent.map((section, idx) => (
          <div key={section._id} className={idx !== courseContent.length - 1 ? "border-b border-slate-100" : ""}>
             <div 
               onClick={() => setExpandedSections(p => ({...p, [section._id]: !p[section._id]}))}
               className="flex items-center justify-between px-6 py-5 cursor-pointer bg-white hover:bg-slate-50 transition-colors group"
             >
                <div className="flex items-center gap-4">
                   <div className={`p-2 rounded-xl border transition-all ${expandedSections[section._id] ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-100 border-slate-200 text-slate-500 group-hover:border-slate-300"}`}>
                      {expandedSections[section._id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                   </div>
                   <div className="space-y-0.5">
                      <h3 className="font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Module {idx + 1} • {section.lectures.length} Lectures
                      </p>
                   </div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {Math.floor(section.duration / 60)}m Execution
                </div>
             </div>

             <AnimatePresence>
               {expandedSections[section._id] && (
                 <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: "auto" }}
                   exit={{ height: 0 }}
                   className="overflow-hidden bg-slate-50/50"
                 >
                    <div className="px-6 pb-4 space-y-1">
                       {section.lectures.map((lecture, lIdx) => (
                         <div 
                           key={lecture._id}
                           onClick={() => handleWatch(section, lecture)}
                           className={`group/item flex items-center justify-between p-3 rounded-2xl border border-transparent transition-all ${lecture.isFree || isEnrolled ? "hover:bg-white hover:border-slate-200 hover:shadow-sm cursor-pointer" : "opacity-60"}`}
                         >
                            <div className="flex items-center gap-4">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${lecture.isFree ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400 group-hover/item:bg-white"}`}>
                                  {isEnrolled || lecture.isFree ? <PlayCircle size={16} /> : <Lock size={16} />}
                               </div>
                               <div className="space-y-0.5">
                                  <p className="text-sm font-bold text-slate-700 group-hover/item:text-slate-900 transition-colors">
                                    {lecture.title}
                                  </p>
                                  {lecture.isFree && (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">Free Preview</span>
                                  )}
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                 {Math.floor(lecture.duration / 60)}:{String(Math.floor(lecture.duration % 60)).padStart(2, '0')}
                               </span>
                               {isEnrolled && (
                                 <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 group-hover/item:bg-emerald-50 group-hover/item:text-emerald-500 transition-all">
                                    <ShieldCheck size={12} />
                                 </div>
                               )}
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showPreview && selectedLecture && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md"
          >
             <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-black w-full max-w-4xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl"
             >
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500 flex items-center justify-center text-blue-400">
                         <MonitorPlay size={20} />
                      </div>
                      <div className="space-y-0.5">
                         <h3 className="font-black tracking-widest text-white uppercase text-[10px]">Node Simulation</h3>
                         <p className="text-white font-bold tracking-tight text-sm line-clamp-1">{selectedLecture.title}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => { setShowPreview(false); setSelectedLecture(null); }}
                     className="p-2 text-slate-400 hover:text-white transition-colors"
                   >
                      <X size={24} />
                   </button>
                </div>
                <div className="aspect-video bg-black rounded-b-[40px] overflow-hidden">
                   <VideoPlayer1 src={selectedLecture.videoUrl} />
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseContent;
