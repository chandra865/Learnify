import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  PlayCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
  Medal,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import VideoPlayer1 from "../component/VideoPlayer1";
import GiveQuiz from "../component/GiveQuiz";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const CoursePlayer = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeLecture, setActiveLecture] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const { courseId, sectionId, lectureId } = useParams();
  const [courseContent, setCourseContent] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoPlayerRef = useRef(null);
  const navigate = useNavigate();
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Progress tracking states
  const [courseProgress, setCourseProgress] = useState(0);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [completedSectionLectures, setCompletedSectionLectures] = useState([]);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [showCertificatePopup, setShowCertificatePopup] = useState(null);
  const [isCourseQuizTaken, setIsCourseQuizTaken] = useState(false);
  const course = useSelector((state) => state.course.selectedCourse);
  const user = useSelector((state) => state.user.userData);
  const userId = user?._id;

  // Fetch course sections
  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/section/get-section-by-course/${courseId}`,
          { withCredentials: true }
        );
        setCourseContent(response.data.data);

        const initialExpandState = {};
        response.data.data.forEach((section) => {
          initialExpandState[section._id] = false;
        });
        setExpandedSections(initialExpandState);
      } catch (error) {
        toast.error( 
          error?.response?.data.message || "Error fetching course sections"
        );
      }
    };
    fetchSection();
  }, [courseId]);

  // Fetch video URL
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/lecture/get-lecture/${lectureId}`,
          { withCredentials: true }
        );
        setVideoUrl(response.data.data.videoUrl);
      } catch (error) {
        toast.error(  
          error?.response?.data.message || "Error fetching video URL"
        );
      }
    };
    fetchVideoUrl();
  }, [lectureId]);

  // checking is quiz taken or not
  useEffect(() => {
    const checkQuizTaken = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/quiz/has-completed-quiz`,
          {
            params: { courseId: courseId },
            withCredentials: true,
          }
        );
        setIsCourseQuizTaken(response.data.data.completed);
      } catch (error) {
        console.log(error);
      }
    };
    checkQuizTaken();
  }, [courseId]);

  const totalLectures = courseContent.reduce(
    (acc, section) => acc + section.lectures.length,
    0
  );

  // Fetch course progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId || !courseId) return;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/progress/get-progress/${userId}/${courseId}`,
          { withCredentials: true }
        );

        const progress = response.data.data;
        setCourseProgress(progress.progressPercentage);
        setCompletedLectures(progress.completedLectures || []);

        if (progress.progressPercentage === 100) {
          setIsCourseCompleted(true);
          setShowCertificatePopup(true);
        }
      } catch (error) {
        toast.error(
          error?.response?.data.message || "Error fetching progress"
        );
      }
    };

    fetchProgress();
  }, [userId, courseId]);

  // Track video progress
  useEffect(() => {
    if (isCourseCompleted) return;

    const video = videoPlayerRef.current?.videoRef.current;
    if (!video) return;

    const saveProgress = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/progress/update-progress`,
          {
            userId,
            courseId,
            lectureId,
            watchTime: video.currentTime,
            totalDuration: video.duration,
            totalLectures,
          },
          { withCredentials: true }
        );

        const progress = response.data.data;
        setCourseProgress(progress.progressPercentage);
        setCompletedLectures(progress.completedLectures || []);

        if (progress.progressPercentage === 100 && !isCourseCompleted) {
          setIsCourseCompleted(true);
          setShowCertificatePopup(true);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (video) {
      video.addEventListener("pause", saveProgress);
      video.addEventListener("ended", saveProgress);
      window.addEventListener("beforeunload", saveProgress);

      return () => {
        video.removeEventListener("pause", saveProgress);
        video.removeEventListener("ended", saveProgress);
        window.removeEventListener("beforeunload", saveProgress);
      };
    }
  }, [userId, courseId, lectureId, isCourseCompleted, videoPlayerRef]);

  const handleMarkUncomplete = async (lectureId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/progress/uncomplete`,
        {
          userId: user._id,
          courseId,
          lectureId,
          totalLectures: getAllLectures().length,
        },
        { withCredentials: true }
      );

      const updatedLectures = completedLectures.filter(
        (id) => id !== lectureId
      );
      setCompletedLectures(updatedLectures);

      const newProgress =
        (updatedLectures.length / getAllLectures().length) * 100;
      setCourseProgress(newProgress);

      if (isCourseCompleted && newProgress < 100) {
        setIsCourseCompleted(false);
      }
    } catch (err) {
      alert("Error marking uncomplete");
    }
  };

  const handleMarkComplete = async (lectureId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/progress/complete`,
        {
          userId: user._id,
          courseId,
          lectureId,
          totalLectures: getAllLectures().length,
        },
        { withCredentials: true }
      );

      if (!completedLectures.includes(lectureId)) {
        const updatedLectures = [...completedLectures, lectureId];
        setCompletedLectures(updatedLectures);

        const newProgress =
          (updatedLectures.length / getAllLectures().length) * 100;
        setCourseProgress(newProgress);

        if (newProgress === 100 && !isCourseCompleted) {
          setIsCourseCompleted(true);
          setShowCertificatePopup(true);
        }
      }
    } catch (err) {
      console.error("Error marking complete", err);
    }
  };

  // Handle certificate download
  const handleDownloadCertificate = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/progress/get-certificate/${userId}/${courseId}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${user.name}_${course.title}_certificate.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error(
        error?.response?.data.message || "Error downloading certificate"
      );
    }
  };

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

  const handleLectureCheckboxToggle = (lectureId, isCurrentlyCompleted) => {
    if (isCurrentlyCompleted) {
      handleMarkUncomplete(lectureId);
    } else {
      handleMarkComplete(lectureId);
    }
  };

  // Auto-advance to the next lecture when the video ends
  useEffect(() => {
    const videoElement = videoPlayerRef.current?.videoRef.current;

    const handleEnded = () => {
      // Mark current lecture as complete when video ends
      //handleMarkComplete(lectureId);

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

  // Function to determine if a lecture is completed
  const isLectureCompleted = (lectureId) => {
    return completedLectures.includes(lectureId);
  };

  //count completed lectures within a section
  const getCompletedLecturesInSection = (sectionId) => {
    const section = courseContent.find((section) => section._id === sectionId);
    if (!section || !section.lectures) return 0;

    return section.lectures.filter((lecture) =>
      completedLectures.includes(lecture._id)
    ).length;
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Sticky Top Bar */}
      <nav className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <div className="flex flex-row items-center gap-2">
              <img src={logo} alt="Logo" className="h-10 w-10" />
              <p className="text-blue-500 font-extrabold text-xl">Learnify</p>
            </div>
          </Link>

          {/* Course Title */}
          <div className="text-lg font-semibold truncate max-w-xs">
            {course.title}
          </div>

          {/* Progress */}
          <div className="flex items-center">
            <div className="w-32 bg-gray-700 rounded-full h-2.5 mr-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${courseProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-400">
              Progress: {Math.round(courseProgress)}%
            </div>
          </div>
        </div>
      </nav>

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
              onExpand={(expanded) => setIsTheaterMode(expanded)}
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
                <GiveQuiz Id={lectureId} type={"lecture"} />
              </>
            )}

            {activeTab === "resources" && (
              <div className="flex flex-col space-y-4 mb-4">
                <button className="flex items-center px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
                  <BookOpen className="mr-2" size={16} /> Resources
                </button>
                <button className="flex items-center px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
                  <FileText className="mr-2" size={16} /> Transcript
                </button>

                {isCourseCompleted && isCourseQuizTaken && (
                  <button
                    onClick={() => setShowCertificatePopup(true)}
                    className="mt-4 ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                  >
                    <Medal className="mr-2" size={16} /> Get Certificate
                  </button>
                )}
                {isCourseCompleted && course.certificateOption === "quiz" && (
                  <GiveQuiz Id={course._id} type={"course"} />
                )}
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
                          {getCompletedLecturesInSection(section._id)}/
                          {section.lectures.length}
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
                                    checked={isLectureCompleted(lecture._id)}
                                    className="w-4 h-4 bg-gray-800 border border-gray-400 rounded"
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleLectureCheckboxToggle(
                                        lecture._id,
                                        isLectureCompleted(lecture._id)
                                      );
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                <div className="w-[90%] py-4 flex flex-col gap-2">
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
          <div className="w-[28%] bg-gray-800 border-l border-gray-700 overflow-y-auto">
            <h3 className="text-xl font-bold py-4 px-2 bg-gray-700">
              Course Content
            </h3>
            {courseContent
              .filter((section) => section.published)
              .map((section) => (
                <div key={section._id} className="border-b-1 border-white">
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
                      {getCompletedLecturesInSection(section._id)}/
                      {section.lectures.length}
                      {" | "}
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
                                checked={isLectureCompleted(lecture._id)}
                                className="w-4 h-4 bg-gray-800 border border-gray-400 rounded"
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleLectureCheckboxToggle(
                                    lecture._id,
                                    isLectureCompleted(lecture._id)
                                  );
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="w-[90%] py-4 flex flex-col gap-2">
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

      {/* Certificate Popup */}
      {showCertificatePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
            <div className="text-yellow-400 mb-4">
              <Medal size={64} className="mx-auto" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              🎉 Congratulations! 🎉
            </h2>

            {course?.certificateOption === "direct" || isCourseQuizTaken ? (
              <>
                <p className="text-lg text-white mb-4">
                  You have successfully completed the course!
                </p>
                <p className="text-gray-300 mb-6">
                  You've achieved {Math.round(courseProgress)}% course
                  completion. Your certificate is ready for download.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleDownloadCertificate}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Medal className="mr-2" size={20} /> Get Certificate
                  </button>
                  <button
                    onClick={() => setShowCertificatePopup(false)}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg text-white mb-4">
                  You've completed all lectures, but you need to pass the quiz
                  to get your certificate.
                </p>
                <p className="text-gray-300 mb-6">
                  Please complete the quiz associated with this course in the
                  resources tab to unlock your certificate.
                </p>
                <div className="flex justify-center space-x-4">
                  {/* <button
                    onClick={() => {
                      setShowCertificatePopup(false);
                      <GiveQuiz Id={course._id} type={"course"} />
                      navigate(``);
                    }}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
                  >
                    Take Quiz
                  </button> */}
                  <button
                    onClick={() => setShowCertificatePopup(false)}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                  >
                    Okay
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
