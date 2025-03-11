import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const MediaPlayer = () => {
  const { courseId, index } = useParams();
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(parseInt(index));
  const [isEnrolled, setIsEnrolled] = useState(false);

  const user = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (user?.enrolledCourses?.includes(courseId)) {
      setIsEnrolled(true);
    } else {
      setIsEnrolled(false);
    }
  }, [courseId]);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/course/lectures/${courseId}`,
          { withCredentials: true }
        );
        const lectureData = response.data.data.lectures;
        if (isEnrolled) {
          console.log("inside");
          setLectures(lectureData);
        } else {
          setLectures(lectureData.filter((lecture) => lecture.isFree === true));
        }
      } catch (err) {
        console.error("Error fetching lectures:", err);
      }
    };
  
    if (isEnrolled !== null) {
      fetchLectures();
    }
  }, [courseId, isEnrolled]);

  useEffect(() => {
    setCurrentLectureIndex(parseInt(index));
  }, [index]);

  const handleNext = () => {
    if (currentLectureIndex < lectures.length - 1) {
      navigate(`/media-player/${courseId}/${currentLectureIndex + 1}`);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white p-6">
      {lectures.length > 0 ? (
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6">
          
          {/* Video Player Section */}
          <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-blue-400">{lectures[currentLectureIndex]?.title}</h1>
            <video
              key={lectures[currentLectureIndex]?.videoUrl.url}
              src={lectures[currentLectureIndex]?.videoUrl.url}
              controls
              autoPlay
              className="w-full rounded-lg shadow-md border-2 border-gray-700"
              onEnded={handleNext}
            />
            <button
              className={`mt-4 w-full py-2 rounded-lg text-lg font-semibold ${
                currentLectureIndex < lectures.length - 1 ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-700 cursor-not-allowed"
              }`}
              onClick={handleNext}
              disabled={currentLectureIndex >= lectures.length - 1}
            >
              Next Lecture →
            </button>
          </div>

          {/* Sticky Sidebar for Lecture List */}
          <div className="w-full md:w-1/3 bg-gray-800 p-4 rounded-lg shadow-lg h-[500px] overflow-y-auto sticky top-6">
            <h2 className="text-lg font-semibold mb-3 text-green-400">Upcoming Lectures</h2>
            <ul className="space-y-2">
              {lectures.map((lecture, i) => (
                <li
                  key={lecture._id}
                  className={`cursor-pointer p-3 border rounded-lg flex items-center gap-3 transition ${
                    i === currentLectureIndex ? "bg-blue-600 font-bold" : "hover:bg-gray-700"
                  }`}
                  onClick={() => navigate(`/media-player/${courseId}/${i}`)}
                >
                  <span className="text-gray-300">🎬</span> 
                  <span>{lecture.title}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      ) : (
        <p className="text-gray-400">No lectures found.</p>
      )}
    </div>
  );
};

export default MediaPlayer;
