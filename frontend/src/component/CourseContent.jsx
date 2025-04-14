import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, PlayCircle, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const CourseContent = ({ courseId }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [courseContent, setCourseContent] = useState([]);

  useEffect(() => {
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
    fetchSection();
  }, [courseId]);

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
        {courseContent.map((section) => (
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
                      className={`px-6 py-3 flex items-center justify-between ${lecture.isFree ? "cursor-pointer":""} hover:bg-gray-800 transition `}
                    >
                      <div className="flex items-center">
                        <PlayCircle size={18} className="text-white mr-3" />
                        <span
                          className={`text-white text-sm ${
                            lecture.preview ? "text-blue-400" : ""
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
                        {/* {lecture.isLocked ? (
                          <Lock size={14} className="text-gray-500" />
                        ) : (
                          <Unlock size={14} className="text-green-400" />
                        )} */}
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
    </div>
  );
};

export default CourseContent;
