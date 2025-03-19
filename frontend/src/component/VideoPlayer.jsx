import { useEffect, useRef, useState } from "react";
import axios from "axios";

const VideoPlayer = ({ userId, courseId, lectureId, videoUrl }) => {
  const videoRef = useRef(null);
  const [watchTime, setWatchTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;

    const saveProgress = () => {
      axios.post("http://localhost:8000/api/v1/progress/update-progress", {
        userId, courseId, lectureId,
        watchTime: video.currentTime,
        totalDuration: video.duration
      }).catch((err) => console.log(err));
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

  return <video ref={videoRef} src={videoUrl} controls />;
};

export default VideoPlayer;
