import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import GiveQuiz from "./GiveQuiz";
import { useNavigate } from "react-router-dom";

const VideoPlayer = ({ userId, courseId, lectureId, videoUrl }) => {
  const videoRef = useRef(null);
  const [watchTime, setWatchTime] = useState(0);
  const user = useSelector((state) => state.user.userData);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.enrolledCourses?.includes(courseId)) {
      setIsEnrolled(true);
    } else {
      setIsEnrolled(false);
    }
  }, [user, courseId]);

  useEffect(() => {
    const video = videoRef.current;

    const saveProgress = () => {
      axios
        .post("http://localhost:8000/api/v1/progress/update-progress", {
          userId,
          courseId,
          lectureId,
          watchTime: video.currentTime,
          totalDuration: video.duration,
        })
        .catch((err) => console.log(err));
    };

    video.addEventListener("pause", saveProgress);
    video.addEventListener("ended", saveProgress);
    window.addEventListener("beforeunload", saveProgress);

    return () => {
      video.removeEventListener("pause", saveProgress);
      video.removeEventListener("ended", saveProgress);
      window.removeEventListener("beforeunload", saveProgress);
    };
  }, [userId, courseId, lectureId]);

  return (
    <div>
      <video ref={videoRef} src={videoUrl} controls className="w-full" />
      {isEnrolled && <GiveQuiz lectureId={lectureId}/>}
    </div>
  );
};

export default VideoPlayer;
