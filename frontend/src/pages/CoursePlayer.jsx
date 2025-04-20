import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  PlayCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import VideoPlayer1 from "../component/VideoPlayer1";

const CoursePlayer = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeLecture, setActiveLecture] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const { courseId, sectionId, lectureId } = useParams();
  const [courseContent, setCourseContent] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoPlayerRef = useRef(null); // Ref for the VideoPlayer1 component
  const navigate = useNavigate();
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'resources' | 'content'

  const courseTitle = "React for Beginners";
  const progress = 33; // %

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

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/lecture/get-lecture/${lectureId}`,
          {
            withCredentials: true,
          }
        );
        setVideoUrl(response.data.data.videoUrl);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVideoUrl();
  }, [lectureId]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleMarkComplete = async (lectureId) => {
    try {
      await axios.post(
        `http://localhost:8000/api/v1/lecture/complete/${lectureId}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error marking complete", err);
    }
  };

  const getAllLectures = () =>
    courseContent.flatMap((section) =>
      section.lectures.map((lecture) => ({
        ...lecture,
        sectionId: section._id,
        courseId,
      }))
    );

  const getCurrentLectureIndex = () =>
    getAllLectures().findIndex((lec) => lec._id === lectureId);

  const getPrevLecture = () => {
    const lectures = getAllLectures();
    const index = getCurrentLectureIndex();
    return index > 0 ? lectures[index - 1] : null;
  };

  const getNextLecture = () => {
    const lectures = getAllLectures();
    const index = getCurrentLectureIndex();
    return index < lectures.length - 1 ? lectures[index + 1] : null;
  };

  const navigateToLecture = (lecture) => {
    if (lecture) {
      setExpandedSections((prev) => ({
        ...prev,
        [lecture.sectionId]: true,
      }));
      navigate(
        `/course-watch/${lecture.courseId}/${lecture.sectionId}/${lecture._id}`
      );
    }
  };

  // Auto-advance to the next lecture when the video ends
  useEffect(() => {
    const videoElement = videoPlayerRef.current?.videoRef.current; // Access the underlying video element

    const handleEnded = () => {
      const nextLecture = getNextLecture();
      if (nextLecture) {
        setIsTransitioning(true);
        setTimeout(() => {
          setIsTransitioning(false);
          navigateToLecture(nextLecture);
        }, 2000);
      }
    };

    if (videoElement) {
      videoElement.addEventListener("ended", handleEnded);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("ended", handleEnded);
      }
    };
  }, [lectureId, courseContent, navigate, getNextLecture]);

  const prevLecture = getPrevLecture();
  const nextLecture = getNextLecture();

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Sticky Top Bar */}

      <nav className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white">
            MyApp
          </Link>

          {/* Course Title - can be dynamic later */}
          <div className="text-lg font-semibold truncate max-w-xs">
            {courseTitle}
          </div>

          {/* Progress */}
          <div className="text-sm text-gray-400">Progress: 45%</div>
        </div>
      </nav>
      {/* <div className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <div className="text-xl font-semibold">{courseTitle}</div>
        <div className="w-1/3 bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div> */}

      <div className="flex flex-1 overflow-hidden">
        {/* Video Player and Content */}
        <div
          className={`flex flex-col overflow-y-auto scrollbar-hidden ${
            isTheaterMode ? "w-full" : "w-[72%]"
          }`}
        >
          {videoUrl && (
            <VideoPlayer1
              src={videoUrl}
              ref={videoPlayerRef}
              onPrevious={
                prevLecture ? () => navigateToLecture(prevLecture) : null
              }
              onNext={nextLecture ? () => navigateToLecture(nextLecture) : null}
              hasPrevious={!!prevLecture}
              hasNext={!!nextLecture}
              onExpand={(expanded) => setIsTheaterMode(expanded)} // Notify CoursePlayer of expand/collapse
            />
          )}
          {isTransitioning && (
            <div className="text-center text-gl text-white mt-4">
              Moving to next lecture...
            </div>
          )}

          {/* Tabs below the video player */}
          <div className="flex bg-gray-800 border-b border-gray-700">
            <button
              className={`px-6 py-3 text-gray-300 hover:text-white ${
                activeTab === "overview" ? "bg-gray-700 text-white" : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-6 py-3 text-gray-300 hover:text-white ${
                activeTab === "resources" ? "bg-gray-700 text-white" : ""
              }`}
              onClick={() => setActiveTab("resources")}
            >
              Resources
            </button>
            {isTheaterMode && (
              <button
                className={`px-6 py-3 text-gray-300 hover:text-white ${
                  activeTab === "content" ? "bg-gray-700 text-white" : ""
                }`}
                onClick={() => setActiveTab("content")}
              >
                Content
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6 flex-1">
            {activeTab === "overview" && (
              <>
                <h3 className="text-2xl font-bold mb-2">Lecture</h3>
                <p className="text-gray-300">
                  This is a sample lecture description. You can add notes,
                  transcript, or other resources here.
                </p>
                <button
                  onClick={() => handleMarkComplete(lectureId)}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark as Complete
                </button>
              </>
            )}

            {activeTab === "resources" && (
              <div className="flex space-x-4 mb-4">
                <button className="flex items-center px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
                  <BookOpen className="mr-2" size={16} /> Resources
                </button>
                <button className="flex items-center px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
                  <FileText className="mr-2" size={16} /> Transcript
                </button>
              </div>
            )}

            {activeTab === "content" && isTheaterMode && (
              <div className="bg-gray-800 border-l border-gray-700 pt-4">
                <h3 className="text-xl font-bold py-2 px-2 bg-gray-700">
                  Course Content
                </h3>
                {courseContent
                  .filter((section) => section.published)
                  .map((section) => (
                    <div key={section._id} className="border-b-1 border-white">
                      {/* ... (rest of the course content sidebar) ... */}
                      <div
                        className="flex flex-col justify-between px-2 py-3 cursor-pointer bg-gray-800 hover:bg-gray-700 transition"
                        onClick={() => toggleSection(section._id)}
                      >
                        <div className="flex flex-row items-center justify-between">
                          <div>
                            <span className="text-gl font-medium">
                              Section {section.order}: {section.title}
                            </span>
                          </div>
                          {expandedSections[section._id] ? (
                            <ChevronUp size={20} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {section.lectures.length}/
                          {Math.floor(section.duration / 60)} | min
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
                                onClick={() =>
                                  navigate(
                                    `/course-watch/${courseId}/${section._id}/${lecture._id}`
                                  )
                                }
                                className={`w-full flex flex-row items-center justify-between hover:bg-gray-600 cursor-pointer transition ${
                                  lecture._id === lectureId ? "bg-blue-600" : ""
                                }`}
                              >
                                <div className="w-[10%] py-8 flex justify-center p-2">
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 bg-gray-800 border border-gray-400 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                <div className=" w-[90%]  py-4 flex flex-col gap-2">
                                  <div className="">
                                    <span className="text-white text-gl">
                                      <span>{lecture.order}. </span>
                                      {lecture.title}
                                    </span>
                                  </div>
                                  <div className="flex flex-row gap-2">
                                    <PlayCircle
                                      size={16}
                                      className="text-gray-400"
                                    />
                                    <span className="text-xs text-gray-400">
                                      {Math.floor(lecture.duration / 60)}min
                                    </span>
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
            )}
          </div>
        </div>

        {/* Sidebar (Visible only when not in theater mode) */}
        {!isTheaterMode && (
          <div className="w-[28%] bg-gray-800 border-l border-gray-700 ">
            <h3 className="text-xl font-bold py-4 px-2 bg-gray-700">
              Course Content
            </h3>
            {courseContent
              .filter((section) => section.published)
              .map((section) => (
                <div key={section._id} className="border-b-1 border-white">
                  {/* ... (rest of the course content sidebar) ... */}
                  <div
                    className="flex flex-col justify-between px-2 py-3 cursor-pointer bg-gray-800 hover:bg-gray-700 transition"
                    onClick={() => toggleSection(section._id)}
                  >
                    <div className="flex flex-row items-center justify-between">
                      <div>
                        <span className="text-gl font-medium">
                          Section {section.order}: {section.title}
                        </span>
                      </div>
                      {expandedSections[section._id] ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {section.lectures.length}/
                      {Math.floor(section.duration / 60)} | min
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
                            onClick={() =>
                              navigate(
                                `/course-watch/${courseId}/${section._id}/${lecture._id}`
                              )
                            }
                            className={`w-full flex flex-row items-center justify-between hover:bg-gray-600 cursor-pointer transition ${
                              lecture._id === lectureId ? "bg-blue-600" : ""
                            }`}
                          >
                            <div className="w-[10%] py-8 flex justify-center p-2">
                              <input
                                type="checkbox"
                                className="w-4 h-4 bg-gray-800 border border-gray-400 rounded"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className=" w-[90%]  py-4 flex flex-col gap-2">
                              <div className="">
                                <span className="text-white text-gl">
                                  <span>{lecture.order}. </span>
                                  {lecture.title}
                                </span>
                              </div>
                              <div className="flex flex-row gap-2">
                                <PlayCircle
                                  size={16}
                                  className="text-gray-400"
                                />
                                <span className="text-xs text-gray-400">
                                  {Math.floor(lecture.duration / 60)}min
                                </span>
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
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;
