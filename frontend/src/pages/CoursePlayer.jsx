import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  PlayCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  FileText, 
  Medal, 
  CheckCircle,
  Layout,
  Maximize,
  Minimize,
  Settings,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Clock,
  Zap,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import VideoPlayer1 from "../component/VideoPlayer1";
import GiveQuiz from "../component/GiveQuiz";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import Button from "../component/ui/Button";
import Card from "../component/ui/Card";
import Badge from "../component/ui/Badge";
import { progressBaseUrl, sectionBaseUrl, lectureBaseUrl, quizBaseUrl } from "../utils/endpoints";

const CoursePlayer = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const { courseId, sectionId, lectureId } = useParams();
  const [courseContent, setCourseContent] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoPlayerRef = useRef(null);
  const navigate = useNavigate();
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [courseProgress, setCourseProgress] = useState(0);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [showCertificatePopup, setShowCertificatePopup] = useState(false);
  const [isCourseQuizTaken, setIsCourseQuizTaken] = useState(false);
  
  const course = useSelector((state) => state.course.selectedCourse);
  const user = useSelector((state) => state.user.userData);
  const userId = user?._id;

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axios.get(`${sectionBaseUrl}/${courseId}`, { withCredentials: true });
        const sections = res.data.data.filter(s => s.published);
        setCourseContent(sections);
        const initialState = {};
        sections.forEach(s => { initialState[s._id] = s._id === sectionId; });
        setExpandedSections(initialState);
      } catch (err) {
        toast.error("Curriculum sync failed");
      }
    };
    fetchSections();
  }, [courseId, sectionId]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${lectureBaseUrl}/${lectureId}`, { withCredentials: true });
        setVideoUrl(res.data.data.videoUrl);
      } catch (err) {
        toast.error("Video protocol error");
      }
    };
    fetchVideo();
  }, [lectureId]);

  useEffect(() => {
    if (userId && courseId) {
      const fetchProgress = async () => {
        try {
          const res = await axios.get(`${progressBaseUrl}/${userId}/${courseId}`, { withCredentials: true });
          const { progressPercentage, completedLectures } = res.data.data;
          setCourseProgress(progressPercentage);
          setCompletedLectures(completedLectures || []);
          if (progressPercentage === 100) setShowCertificatePopup(true);
        } catch (err) {}
      };
      fetchProgress();
    }
  }, [userId, courseId]);

  const handleLectureToggle = async (lId, done) => {
    try {
      const endpoint = done ? "uncomplete" : "complete";
      const totalL = courseContent.reduce((a, s) => a + s.lectures.length, 0);
      await axios.post(`${progressBaseUrl}/${endpoint}`, {
        userId, courseId, lectureId: lId, totalLectures: totalL
      }, { withCredentials: true });
      
      const updated = done ? completedLectures.filter(id => id !== lId) : [...completedLectures, lId];
      setCompletedLectures(updated);
      setCourseProgress((updated.length / totalL) * 100);
    } catch (err) {
      toast.error("Progress sync failure");
    }
  };

  const getLectures = () => courseContent.flatMap(s => s.lectures.map(l => ({ ...l, sId: s._id })));
  const currentIdx = getLectures().findIndex(l => l._id === lectureId);
  const nextL = getLectures()[currentIdx + 1];
  const prevL = getLectures()[currentIdx - 1];

  const navigateL = (l) => {
    if (l) navigate(`/course-watch/${courseId}/${l.sId}/${l._id}`);
  };

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* High-Density Header Station */}
      <nav className="h-16 px-6 flex justify-between items-center bg-slate-900 border-b border-white/5 relative z-50">
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:scale-105 transition-transform">
             <div className="flex items-center gap-2">
                <img src={logo} alt="Learnify" className="h-8 w-8" />
                <span className="text-blue-500 font-extrabold text-lg tracking-tighter">Learnify</span>
             </div>
          </Link>
          <div className="h-4 w-[1px] bg-slate-700 hidden md:block" />
          <div className="text-xs font-bold text-slate-300 truncate max-w-md hidden md:block">
            {course.title}
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sync Progress</p>
                 <p className="text-xs font-bold text-blue-400">{Math.round(courseProgress)}% Complete</p>
              </div>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${courseProgress}%` }}
                    className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                 />
              </div>
           </div>
           
           <Button variant="ghost" size="sm" className="hidden sm:block text-slate-400 hover:text-white" onClick={() => navigate("/")}>
             <ArrowLeft size={16} className="mr-2" /> Termination Node
           </Button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Cinematic Workspace */}
        <div className={`flex flex-col transition-all duration-500 ease-in-out bg-black ${isTheaterMode ? "w-full" : "w-3/4"}`}>
          <div className="relative flex-1 flex flex-col min-h-0">
             {videoUrl && (
               <VideoPlayer1
                 src={videoUrl}
                 ref={videoPlayerRef}
                 onPrevious={prevL ? () => navigateL(prevL) : null}
                 onNext={nextL ? () => navigateL(nextL) : null}
                 hasPrevious={!!prevL}
                 hasNext={!!nextL}
                 onExpand={(exp) => setIsTheaterMode(exp)}
               />
             )}
             
             {/* Dynamic Interaction Tabs */}
             <div className="bg-slate-900 border-t border-white/5 flex items-center px-6">
                {["overview", "resources", "content"].map(tab => (
                   (tab !== "content" || isTheaterMode) && (
                     <button
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative
                        ${activeTab === tab ? "text-blue-500" : "text-slate-500 hover:text-white"}`}
                     >
                       {tab === "content" ? "Framework" : tab}
                       {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-6 right-6 h-[2px] bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />}
                     </button>
                   )
                ))}
             </div>

             <div className="flex-1 overflow-y-auto p-10 bg-slate-950/50">
                <div className="max-w-4xl mx-auto space-y-10">
                   {activeTab === "overview" && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-white tracking-tight">Sync Overview</h3>
                            <Badge variant="primary" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">Node Active</Badge>
                        </div>
                        <p className="text-slate-400 font-medium leading-relaxed bg-slate-900/50 p-6 rounded-3xl border border-white/5">
                           This simulation covers core architectural principles for high-density knowledge distribution. 
                           Ensure protocol compliance before proceeding to next node synchronization.
                        </p>
                        <GiveQuiz Id={lectureId} type={"lecture"} />
                     </motion.div>
                   )}

                   {activeTab === "resources" && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-slate-900 border-white/5 p-6 hover:bg-slate-800 transition-colors group cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                               <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                  <BookOpen size={20} />
                               </div>
                               <Zap size={14} className="text-slate-700 group-hover:text-amber-500" />
                            </div>
                            <h4 className="font-bold text-white mb-1">Documentation Hub</h4>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Node manifest & assets</p>
                        </Card>
                        <Card className="bg-slate-900 border-white/5 p-6 hover:bg-slate-800 transition-colors group cursor-pointer text-left">
                            <div className="flex items-center justify-between mb-4">
                               <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                  <FileText size={20} />
                               </div>
                               <Settings size={14} className="text-slate-700" />
                            </div>
                            <h4 className="font-bold text-white mb-1">Transcript protocol</h4>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Full knowledge log</p>
                        </Card>
                        
                        {courseProgress === 100 && (
                          <Card className="md:col-span-2 bg-blue-600 border-transparent p-8 flex items-center justify-between group cursor-pointer shadow-2xl shadow-blue-900/40">
                             <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md">
                                   <Medal size={40} className="text-white animate-bounce" />
                                </div>
                                <div>
                                   <h4 className="text-xl font-black text-white tracking-tight">Final Accreditation Ready</h4>
                                   <p className="text-blue-100 text-sm font-bold opacity-80">Protocol successfully synchronized. Download manifest.</p>
                                </div>
                             </div>
                             <Button variant="outline" className="bg-white border-transparent text-blue-600 hover:bg-blue-50">
                                Retrieve
                             </Button>
                          </Card>
                        )}
                     </motion.div>
                   )}
                </div>
             </div>
          </div>
        </div>

        {/* Industrial Curriculum Terminal */}
        {!isTheaterMode && (
          <aside className="w-1/4 bg-slate-900 border-l border-white/5 flex flex-col relative z-40 shadow-2xl">
            <div className="p-6 bg-slate-800/50 border-b border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                   <Terminal size={14} /> Curriculum Topology
                </h3>
                <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-white">{courseContent.length} Sections Active</p>
                    <Badge variant="outline" className="border-slate-700 text-slate-400">Stable v4.0</Badge>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
               {courseContent.map((section, sIdx) => {
                 const done = completedLectures.filter(id => section.lectures.some(l => l._id === id)).length;
                 const total = section.lectures.length;
                 const isExp = expandedSections[section._id];

                 return (
                   <div key={section._id} className="border-b border-white/5">
                      <div 
                        onClick={() => setExpandedSections(p => ({...p, [section._id]: !isExp}))}
                        className={`px-6 py-5 cursor-pointer transition-colors group flex items-center justify-between
                         ${isExp ? "bg-slate-800/30" : "hover:bg-slate-800/20"}`}
                      >
                         <div className="flex-1 mr-4">
                            <h4 className={`text-xs font-bold leading-relaxed transition-colors ${isExp ? "text-blue-400" : "text-slate-300 group-hover:text-white"}`}>
                              Section {sIdx + 1}: {section.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                               <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{done}/{total} Nodes</p>
                               <div className="h-[2px] flex-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-slate-600" style={{ width: `${(done/total)*100}%` }} />
                               </div>
                            </div>
                         </div>
                         {isExp ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                      </div>

                      <AnimatePresence>
                        {isExp && (
                          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-slate-950/40">
                             {section.lectures.map((l, lIdx) => (
                               <div 
                                 key={l._id} 
                                 onClick={() => navigateL({ ...l, sId: section._id })}
                                 className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition-all border-l-2
                                  ${l._id === lectureId ? "bg-blue-600/10 border-blue-600" : "border-transparent hover:bg-slate-800/40"}`}
                               >
                                  <div className="flex-shrink-0" onClick={(e) => { e.stopPropagation(); handleLectureToggle(l._id, completedLectures.includes(l._id)); }}>
                                     {completedLectures.includes(l._id) ? (
                                       <CheckCircle size={18} className="text-emerald-500" />
                                     ) : (
                                       <div className={`w-[18px] h-[18px] rounded border ${l._id === lectureId ? "border-blue-400 bg-blue-600/20" : "border-slate-700 bg-slate-900"}`} />
                                     )}
                                  </div>
                                  <div className="flex-1">
                                     <p className={`text-[11px] font-bold line-clamp-2 transition-colors ${l._id === lectureId ? "text-white" : "text-slate-400"}`}>
                                       {l.order}. {l.title}
                                     </p>
                                     <div className="flex items-center gap-2 mt-1 opacity-60">
                                        <PlayCircle size={10} className={l._id === lectureId ? "text-blue-400" : ""} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">{Math.floor(l.duration/60)}m Simulation</span>
                                     </div>
                                  </div>
                               </div>
                             ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                 );
               })}
            </div>
          </aside>
        )}
      </div>

      <AnimatePresence>
         {showCertificatePopup && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-white/5 rounded-[40px] p-10 max-w-lg text-center space-y-8 shadow-2xl relative">
                <button onClick={() => setShowCertificatePopup(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
                <div className="relative">
                   <div className="absolute inset-0 bg-blue-600/20 blur-[60px] rounded-full" />
                   <div className="relative p-6 bg-slate-800 rounded-full w-24 h-24 mx-auto border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Medal size={48} className="animate-pulse" />
                   </div>
                </div>
                <div className="space-y-3">
                   <h2 className="text-3xl font-black text-white tracking-tight">Accreditation Verified</h2>
                   <p className="text-slate-400 font-medium leading-relaxed">
                      LMS protocol synchronization completed for {course.title}. 
                      The architectural manifest has been generated.
                   </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <Button size="lg" className="w-full">Retrieve Certificate</Button>
                   <Button variant="outline" size="lg" className="w-full" onClick={() => setShowCertificatePopup(false)}>Operational Hub</Button>
                </div>
             </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default CoursePlayer;
