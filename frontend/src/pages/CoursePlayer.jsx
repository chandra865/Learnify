import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Play,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
  Medal,
  CheckCircle,
  Layout,
  Maximize2,
  ChevronLeft,
  Settings,
  Circle,
  Check,
  X,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import VideoPlayer1 from "../component/VideoPlayer1";
import GiveQuiz from "../component/GiveQuiz";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import { progressBaseUrl, sectionBaseUrl, lectureBaseUrl, quizBaseUrl } from "../utils/endpoints";
import Card from "../component/ui/Card";
import Button from "../component/ui/Button";
import Badge from "../component/ui/Badge";

const CoursePlayer = () => {
  const [activeLecture, setActiveLecture] = useState(0);
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
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [showCertificatePopup, setShowCertificatePopup] = useState(false);
  const [isCourseQuizTaken, setIsCourseQuizTaken] = useState(false);
  
  const course = useSelector((state) => state.course.selectedCourse);
  const user = useSelector((state) => state.user.userData);
  const userId = user?._id;

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(`${sectionBaseUrl}/${courseId}`, { withCredentials: true });
        setCourseContent(response.data.data);
        const initialExpandState = {};
        response.data.data.forEach((section) => {
          initialExpandState[section._id] = section._id === sectionId;
        });
        setExpandedSections(initialExpandState);
      } catch (error) {
        toast.error("Module synchronization failure");
      }
    };
    fetchSections();
  }, [courseId, sectionId]);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await axios.get(`${lectureBaseUrl}/${lectureId}`, { withCredentials: true });
        setVideoUrl(response.data.data.videoUrl);
      } catch (error) {
        toast.error("Node synchronization failed");
      }
    };
    fetchVideoUrl();
  }, [lectureId]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId || !courseId) return;
      try {
        const response = await axios.get(`${progressBaseUrl}/${userId}/${courseId}`, { withCredentials: true });
        const progress = response.data.data;
        setCourseProgress(progress.progressPercentage);
        setCompletedLectures(progress.completedLectures || []);
        if (progress.progressPercentage === 100) setIsCourseCompleted(true);
      } catch (error) {
        // Quiet fail
      }
    };
    fetchProgress();
  }, [userId, courseId, lectureId]);

  const handleMarkComplete = async (lid, isComplete) => {
    const endpoint = isComplete ? "uncomplete" : "complete";
    try {
      const response = await axios.post(`${progressBaseUrl}/${endpoint}`, {
        userId, courseId, lectureId: lid, totalLectures: getAllLectures().length
      }, { withCredentials: true });
      
      const progress = response.data.data;
      setCourseProgress(progress.progressPercentage);
      setCompletedLectures(progress.completedLectures || []);
    } catch (err) {
      toast.error("Progress synchronization failure");
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const response = await axios.get(`${progressBaseUrl}/certificate/${userId}/${courseId}`, {
        withCredentials: true, responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${user.name}_${course.title}_certificate.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error("Certificate generation error");
    }
  };

  const getAllLectures = () =>
    courseContent.flatMap((section) =>
      section.lectures.map((lecture) => ({ ...lecture, sectionId: section._id, courseId }))
    );

  const getCurrentLectureIndex = () => getAllLectures().findIndex((lec) => lec._id === lectureId);
  const getNextLecture = () => {
    const lectures = getAllLectures();
    const index = getCurrentLectureIndex();
    return index < lectures.length - 1 ? lectures[index + 1] : null;
  };

  return (
    <div className="h-screen bg-[#fafafa] flex flex-col overflow-hidden">
      {/* Navigation Terminal */}
      <nav className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 relative z-50">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Learnify" className="h-7 w-7" />
            <span className="text-sm font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">Learnify</span>
          </Link>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Node</span>
             <h2 className="text-xs font-bold text-slate-900 truncate max-w-[300px]">{course.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Acquisition: {Math.round(courseProgress)}%</span>
                    <div className="w-32 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="bg-blue-600 h-full transition-all duration-500" 
                            style={{ width: `${courseProgress}%` }}
                        />
                    </div>
                </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ChevronLeft size={16} className="mr-2" /> Exit Terminal
            </Button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Playback Chamber */}
        <main className={`flex flex-col transition-all duration-500 bg-slate-950 overflow-y-auto ${isTheaterMode ? "w-full" : "w-[calc(100%-340px)]"}`}>
          <div className="aspect-video w-full bg-black relative shadow-2xl">
            {videoUrl ? (
              <VideoPlayer1
                src={videoUrl}
                ref={videoPlayerRef}
                onExpand={(exp) => setIsTheaterMode(exp)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                 <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Functional Documentation Node */}
          <div className="bg-white border-t border-slate-200">
             <div className="flex border-b border-slate-100 h-14 bg-slate-50/50">
                {["overview", "resources", "community"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      px-8 flex items-center text-[10px] font-black uppercase tracking-[0.2em] transition-all relative
                      ${activeTab === tab ? "text-blue-600 bg-white" : "text-slate-400 hover:text-slate-900"}
                    `}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-600" />}
                  </button>
                ))}
             </div>

             <div className="p-10 space-y-8 min-h-[400px]">
                {activeTab === "overview" && (
                  <div className="max-w-4xl space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Technical Specification</h3>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">
                            This node provides high-density curriculum focus on the core architectural patterns. Use the sidebar to synchronize across the entire module matrix.
                        </p>
                    </div>
                    <GiveQuiz Id={lectureId} type={"lecture"} />
                  </div>
                )}
                {activeTab === "resources" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                        <Card className="p-6 bg-slate-50 border-slate-200/60 flex items-center justify-between group cursor-pointer hover:bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                                    <BookOpen size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-900">Module Documentation</span>
                            </div>
                            <Button variant="ghost" size="sm">Download</Button>
                        </Card>
                        <Card className="p-6 bg-slate-50 border-slate-200/60 flex items-center justify-between group cursor-pointer hover:bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                                    <FileText size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-900">Transcript Protocol</span>
                            </div>
                            <Button variant="ghost" size="sm">Open</Button>
                        </Card>
                        {isCourseCompleted && (
                            <Card className="p-6 md:col-span-2 bg-blue-50 border-blue-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <Medal size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest">Platform Certification Architecture</h4>
                                        <p className="text-xs font-medium text-blue-600">Your professional license is ready for deployment.</p>
                                    </div>
                                </div>
                                <Button size="sm" onClick={handleDownloadCertificate}>Generate Certificate</Button>
                            </Card>
                        )}
                    </div>
                )}
             </div>
          </div>
        </main>

        {/* Matrix Sidebar */}
        <aside className={`
            fixed right-0 top-0 bottom-0 bg-white border-l border-slate-200 transition-all duration-500 z-40
            ${isTheaterMode ? "translate-x-full" : "translate-x-0 width-[340px]"}
        `}>
           <div className="h-full flex flex-col h-140">
              <div className="h-14 px-5 flex items-center justify-between bg-slate-50 border-b border-slate-200 h-14">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Module Matrix</h3>
                  <Badge variant="primary" className="bg-white border-slate-200 font-black">{courseContent.length} Braces</Badge>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {courseContent
                  .filter((section) => section.published)
                  .map((section) => (
                    <div key={section._id}>
                      <button
                        className={`w-full flex items-center justify-between p-4 px-5 text-left transition-colors ${
                          expandedSections[section._id] ? "bg-slate-50/50" : "hover:bg-slate-50"
                        }`}
                        onClick={() => setExpandedSections(prev => ({ ...prev, [section._id]: !prev[section._id] }))}
                      >
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-tight">{section.title}</h4>
                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                <span>{section.lectures.length} Nodes</span>
                                <span className="opacity-30">•</span>
                                <span>{Math.floor(section.duration / 60)}m Capacity</span>
                            </div>
                        </div>
                        <div className={`transition-transform duration-300 ${expandedSections[section._id] ? "rotate-180" : ""}`}>
                            <ChevronDown size={14} className="text-slate-300" />
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedSections[section._id] && (
                          <motion.div
                            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                            className="bg-white overflow-hidden"
                          >
                            {section.lectures.map((lecture) => (
                              <div
                                key={lecture._id}
                                onClick={() => navigate(`/course-watch/${courseId}/${section._id}/${lecture._id}`)}
                                className={`
                                    flex items-center gap-4 px-5 py-3.5 transition-all group cursor-pointer border-l-4
                                    ${lecture._id === lectureId ? "bg-blue-50 border-blue-600" : "border-transparent hover:bg-slate-50"}
                                `}
                              >
                                <button 
                                    className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                        completedLectures.includes(lecture._id) 
                                        ? "bg-blue-600 border-blue-600 text-white" 
                                        : "border-slate-200 group-hover:border-slate-400 bg-white"
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarkComplete(lecture._id, completedLectures.includes(lecture._id));
                                    }}
                                >
                                    {completedLectures.includes(lecture._id) && <Check size={12} />}
                                </button>
                                <div className="flex-1 space-y-1">
                                    <span className={`text-[13px] font-bold tracking-tight leading-snug block transition-colors ${
                                        lecture._id === lectureId ? "text-blue-700" : "text-slate-600 group-hover:text-slate-900"
                                    }`}>
                                        {lecture.title}
                                    </span>
                                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        <Play size={10} className={lecture._id === lectureId ? "text-blue-600" : ""} />
                                        <span>{Math.floor(lecture.duration / 60)}m Deployment</span>
                                    </div>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
              </div>
           </div>
        </aside>
      </div>

      {/* Completion Terminal Overlay */}
      {showCertificatePopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
           <Card className="max-w-md w-full bg-white border-slate-200 p-10 text-center space-y-8 shadow-2xl">
              <div className="w-20 h-20 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-200">
                  <ShieldCheck size={40} />
              </div>
              <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Curriculum Mastered</h2>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                      Your technical proficiency has been synchronized across all module nodes. Professional certification is now eligible for generation.
                  </p>
              </div>
              <div className="flex flex-col gap-3">
                  <Button size="lg" onClick={handleDownloadCertificate}>Deploy Certificate</Button>
                  <Button variant="ghost" onClick={() => setShowCertificatePopup(false)}>Return to Terminal</Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
