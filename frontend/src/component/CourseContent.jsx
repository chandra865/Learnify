import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Play, Lock, Unlock, Clock, FileText, X } from "lucide-react";
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

  const checkEnrollment = async () => {
    if (!user || !courseId) return;
    try {
      const response = await axios.get(`${enrollmentBaseUrl}/${user._id}/${courseId}`, { withCredentials: true });
      setIsEnrolled(response.data.data.enrollmentStatus);
    } catch (error) {
      // Quiet fail
    }
  };

  useEffect(() => {
    checkEnrollment();
  }, [user, courseId]);

  const fetchSection = async () => {
    if (!courseId) return;
    try {
      const response = await axios.get(`${sectionBaseUrl}/${courseId}`, { withCredentials: true });
      setCourseContent(response.data.data);
      
      const initialExpandState = {};
      response.data.data.forEach((section, idx) => {
        initialExpandState[section._id] = idx === 0; // Default first section expanded
      });
      setExpandedSections(initialExpandState);
    } catch (error) {
      toast.error("Module synchronization failed");
    }
  };

  useEffect(() => {
    fetchSection();
  }, [courseId]);

  const handleCourseWatch = (section, lecture) => {
    if (isEnrolled) {
      navigate(`/course-watch/${courseId}/${section._id}/${lecture._id}`);
    } else if (lecture.isFree) {
      setSelectedLecture(lecture);
      setShowPreview(true);
    } else {
      toast.error("Verification Required: Please acquire a license to access this terminal node.");
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const totalLectures = courseContent.reduce((acc, section) => acc + section.lectures.length, 0);
  const totalDurationSeconds = courseContent.reduce((acc, section) => acc + section.duration, 0);
  const totalHours = Math.floor(totalDurationSeconds / 3600);
  const totalMinutes = Math.floor((totalDurationSeconds % 3600) / 60);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Curriculum Architecture</h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <span>{courseContent.length} Braces</span>
            <span className="opacity-30">•</span>
            <span>{totalLectures} Terminal Nodes</span>
            <span className="opacity-30">•</span>
            <span>{totalHours > 0 ? `${totalHours}h ` : ""}{totalMinutes}m Total Capacity</span>
          </div>
        </div>
        <button
          onClick={() => {
            const allExpanded = Object.values(expandedSections).every(v => v);
            const newState = {};
            courseContent.forEach(s => newState[s._id] = !allExpanded);
            setExpandedSections(newState);
          }}
          className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors"
        >
          {Object.values(expandedSections).every(v => v) ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
        {courseContent
          .filter((section) => section.published)
          .map((section) => (
            <div key={section._id} className="group">
              <div
                className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-colors ${
                  expandedSections[section._id] ? "bg-slate-50/50" : "hover:bg-slate-50"
                }`}
                onClick={() => toggleSection(section._id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`transition-transform duration-200 ${expandedSections[section._id] ? "rotate-180" : ""}`}>
                    <ChevronDown size={16} className="text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                    {section.title}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                  <span className="hidden sm:inline">{section.lectures.length} Nodes</span>
                  <span>{Math.floor(section.duration / 60)}m Capacity</span>
                </div>
              </div>

              <AnimatePresence>
                {expandedSections[section._id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white divide-y divide-slate-50">
                      {section.lectures.map((lecture) => (
                        <div
                          key={lecture._id}
                          onClick={() => handleCourseWatch(section, lecture)}
                          className={`
                            px-6 py-3.5 flex items-center justify-between group/lesson transition-colors
                            ${lecture.isFree || isEnrolled ? "cursor-pointer hover:bg-slate-50" : "opacity-60 grayscale"}
                          `}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="shrink-0 text-slate-300 group-hover/lesson:text-blue-600 transition-colors">
                              {lecture.isFree || isEnrolled ? <Play size={14} className="fill-current" /> : <Lock size={14} />}
                            </div>
                            <span className="text-sm font-medium text-slate-600 group-hover/lesson:text-slate-900 transition-colors line-clamp-1">
                              {lecture.title}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            {lecture.isFree && !isEnrolled && (
                              <Badge variant="primary" className="bg-blue-50 text-blue-600 border-blue-100">Open Access</Badge>
                            )}
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                               <Clock size={12} />
                               {formatDuration(lecture.duration)}
                            </div>
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

      {showPreview && selectedLecture && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-4xl bg-slate-900 border-white/10 overflow-hidden relative">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
               <div className="space-y-1">
                  <h3 className="text-white font-bold text-lg tracking-tight">Open Access Node: {selectedLecture.title}</h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Protocol Preview Matrix</p>
               </div>
               <button onClick={() => { setShowPreview(false); setSelectedLecture(null); }} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <X size={20} />
               </button>
            </div>
            <div className="aspect-video bg-black">
               <VideoPlayer1 src={selectedLecture.videoUrl} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseContent;
