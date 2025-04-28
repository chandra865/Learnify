import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, PlayCircle, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import VideoPlayer1 from "./VideoPlayer1";
import {
  FaTimes,
  FaPlay,
  FaCheck,
  FaUser,
  FaCalendarAlt,
  FaGlobe,
} from "react-icons/fa";
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
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/enrollment/check-user-enrollment/${user._id}/${courseId}`,
        {
          withCredentials: true,
        }
      );

      const status = response.data.data.enrollmentStatus;
      setIsEnrolled(status);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user && courseId) {
      checkEnrollment();
    }
  }, [user, courseId]);

  const fetchSection = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/section/get-section-by-course/${courseId}`,
        {
          withCredentials: true,
        }
      );
      setCourseContent(response.data.data);

      // Initialize all sections as collapsed
      const initialExpandState = {};
      response.data.data.forEach((section) => {
        initialExpandState[section._id] = false;
      });
      setExpandedSections(initialExpandState);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (courseId) {
      fetchSection();
    }
  }, [courseId]);

  const handleCourseWatch = async (courseId, section, lecture) => {
    if (isEnrolled) {
      navigate(`/course-watch/${courseId}/${section._id}/${lecture._id}`);
    }
    else if (lecture.isFree) {
      setSelectedLecture(lecture);
      setShowPreview(true);
    } else {
      alert("your are not enrolled in this course");
    }
  };
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleAllSections = () => {
    const allExpanded = Object.values(expandedSections).every((val) => val);
    const updatedState = {};
    for (const key in expandedSections) {
      updatedState[key] = !allExpanded;
    }
    setExpandedSections(updatedState);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const totalLectures = courseContent.reduce(
    (acc, section) => acc + section.lectures.length,
    0
  );
  const totalDurationSeconds = courseContent.reduce(
    (acc, section) => acc + section.duration,
    0
  );
  const totalHours = Math.floor(totalDurationSeconds / 3600);
  const totalMinutes = Math.floor((totalDurationSeconds % 3600) / 60);

  return (
    <div className="mt-20">
      <h1 className="text-3xl text-white font-extrabold">Course content</h1>
      <div className="py-3 flex justify-between items-center text-white">
        <div className="font-medium">
          {courseContent.length} sections • {totalLectures} lectures •{" "}
          {totalHours}h {totalMinutes}m total length
        </div>
        <button
          onClick={toggleAllSections}
          className="text-blue-400 hover:underline text-sm cursor-pointer"
        >
          {Object.values(expandedSections).every((val) => val)
            ? "Collapse all sections"
            : "Expand all sections"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto text-white shadow-sm border border-gray-700 overflow-hidden ">
        {courseContent
          .filter((section) => section.published)
          .map((section) => (
            <div key={section._id} className="border-b border-gray-700">
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer bg-gray-800 hover:bg-gray-700 transition"
                onClick={() => toggleSection(section._id)}
              >
                <div className="flex items-center">
                  {expandedSections[section._id] ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                  <h3 className="ml-2 font-medium">{section.title}</h3>
                </div>
                <div className="text-gray-400 text-sm">
                  {section.lectures.length} lectures •{" "}
                  {Math.floor(section.duration / 60)} min
                </div>
              </div>

              <AnimatePresence>
                {expandedSections[section._id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-gray-900"
                  >
                    {section.lectures.map((lecture) => (
                      <div
                        key={lecture._id}
                        onClick={(e) =>
                          handleCourseWatch(courseId, section, lecture)
                        }
                        className={`px-6 py-3 flex items-center justify-between ${
                          lecture.isFree || isEnrolled ? "cursor-pointer" : ""
                        } hover:bg-gray-800 transition `}
                      >
                        <div className="flex items-center">
                          <PlayCircle size={18} className="text-white mr-3" />
                          <span
                            className={`text-white text-sm ${
                              lecture.isFree ? "text-blue-400" : ""
                            }`}
                          >
                            {lecture.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          {lecture.isFree && (
                            <span className="text-blue-400 underline text-sm ">
                              Preview
                            </span>
                          )}

                          <span className="text-xs text-gray-400">
                            {formatDuration(lecture.duration)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
      </div>

      {showPreview && selectedLecture && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray bg-opacity-50 backdrop-blur-sm z-50"
          role="dialog"
        >
          <div className="bg-gray-900 p-6 shadow-lg w-full max-w-2xl relative">
            <div className="flex flex-row justify-between items-center mb-4">
              <h1 className="text-xl font-bold text-white">Lecture Preview</h1>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPreview(false);
                  setSelectedLecture(null);
                }}
                className="w-8 h-8 cursor-pointer flex items-center justify-center bg-white text-gray-800 rounded-full shadow-md hover:bg-gray-200 transition"
              >
                <FaTimes size={16} />
              </button>
            </div>
            <h1 className="text-xl font-bold text-white mb-4">
              {selectedLecture.title}
            </h1>
            <VideoPlayer1 src={selectedLecture.videoUrl} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseContent;
