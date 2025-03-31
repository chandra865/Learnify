import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import GiveQuiz from "./GiveQuiz";

const VideoPlayer = ({ userId, courseId, lectureId, videoUrl }) => {
  const videoRef = useRef(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isCourseCompleted, setIsCourseCompleted] = useState(null); 
  const user = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (user?.enrolledCourses?.includes(courseId)) {
      setIsEnrolled(true);
    } else {
      setIsEnrolled(false);
    }
  }, [user, courseId]);


  useEffect(() => {

    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/progress/get-progress/${userId}/${courseId}`
        );
        const progress = response.data.data;
        console.log(progress.progressPercentage);
        if (progress.progressPercentage === 100) {
          setIsCourseCompleted(true); // ✅ If already 100%, don't track further
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
        setIsCourseCompleted(false);
      }
    };

    fetchProgress();
  }, [userId, courseId]);

  useEffect(() => {
    
    if (isCourseCompleted === null || isCourseCompleted === true) return; 
    console.log(isCourseCompleted);
    
    const video = videoRef.current;
    const saveProgress = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/progress/update-progress",
          {
            userId,
            courseId,
            lectureId,
            watchTime: video.currentTime,
            totalDuration: video.duration,
          }
        );

        const progress = response.data.data;

        if (progress.progressPercentage === 100) {
          setShowPopup(true);
        }
      } catch (err) {
        console.log(err);
      }
    };

    video.addEventListener("pause", saveProgress);
    video.addEventListener("ended", saveProgress);
    window.addEventListener("beforeunload", saveProgress);

    return () => {
      video.removeEventListener("pause", saveProgress);
      video.removeEventListener("ended", saveProgress);
      window.removeEventListener("beforeunload", saveProgress);
    };
  }, [userId, courseId, lectureId, isCourseCompleted]);

  const handleDownloadCertificate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/progress/get-certificate/${userId}/${courseId}`,
        {
          withCredentials: true,
          responseType: "blob",
        } // Important for handling PDFs
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${user.name}_${courseId}_certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Error downloading certificate:", error);
    }
  };

  return (
    <div>
      <video ref={videoRef} src={videoUrl} controls className="w-full" />

      
      {isEnrolled && <GiveQuiz Id={lectureId} type={"lecture"} />}

      {/* Pop-up Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold text-white">
              🎉 Congratulations! 🎉
            </h2>
            <p className="mt-2 text-white">
              You have successfully completed the course!
            </p>
            <button
              onClick={handleDownloadCertificate}
              className="mt-4 bg-blue-500 text-white px-4 py-2 mx-2 rounded"
            >
              Get Certificate
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
