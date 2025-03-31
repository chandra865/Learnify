import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import { useNavigate, useParams} from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedLecture } from "../store/slice/selectedLectureSlice";
import axios from "axios";
import VideoPlayer from "../component/VideoPlayer";

const TABS = ["overview", "announcement", "review", "notes"];

const MediaPlayer = () => {
  const course = useSelector((state) => state.course.selectedCourse);
  const currLecture = useSelector((state)=>state.lecture.selectedLecture);

  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [checked, setChecked] = useState(false);
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
          setLectures(lectureData);
        } else {
          setLectures(lectureData.filter((lecture) => lecture.isFree === true));
        }
      } catch (error) {
        // console.error("Error fetching lectures:", err);
        console.log(error);
        alert(error.response?.data?.message || "Error fetching lectures");
      }
    };
  
    if (isEnrolled !== null) {
      fetchLectures();
    }
  }, [courseId, isEnrolled]);

  useEffect(() => {
    setCurrentLectureIndex(parseInt(index));
  }, [index]);


  const formatDuration = (seconds) => {
    const roundedSeconds = Math.round(seconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;
    console.log(remainingSeconds);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    if (currentLectureIndex < lectures.length - 1) {
      navigate(`/media-player/${courseId}/${currentLectureIndex + 1}`);
    }
  };

  return (
    <div className="flex flex-row min-h-screen">
      {/* Video & Tabs Section (Scrollable) */}
      <div className="bg-gray-900 text-white w-[1100px] min-h-screen overflow-y-auto p-4">
        <h1 className="text-2xl font-bold my-4">{course?.title}</h1>
        {/* Video Player */}
        <div className="relative">
          {/* //<VideoPlayer src={"https://www.w3schools.com/html/mov_bbb.mp4"}/> */}
          <video
            src={currLecture?.videoUrl.url}
            // src="https://www.w3schools.com/html/mov_bbb.mp4"
            controls
            className="w-full rounded-lg"
          />
          
        </div>
        <span className="texl-xl font-bold">{currLecture?.title}</span>

        {/* Tabs */}
        <div className="flex border-b mt-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 cursor-pointer capitalize ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === "overview" && <p>Overview content goes here...</p>}
          {activeTab === "announcement" && <p>Announcement details here...</p>}
          {activeTab === "review" && <p>Reviews will be shown here...</p>}
          {activeTab === "notes" && <p>Your saved notes appear here...</p>}
        </div>
      </div>

      {/* Sticky Lecture List */}
      <div className="bg-gray-900 text-white w-[450px] min-h-screen sticky top-0 p-2">
        <h2 className="text-xl font-bold border-b pb-2 mt-6">Lecture List</h2>
        <ul className="mt-4 ">
          {lectures.map((lecture, index) => (
            <li
              key={index}
              className="flex items-center justify-between border-1 px-4 py-7"
              onClick={()=>dispatch(setSelectedLecture(lecture))}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 flex items-center justify-center border border-white 
                    ${
                      checked ? "bg-gray-500 border-gray-500" : "bg-transparent"
                    }`} 
                  onClick={()=>setChecked(!checked)}
                >
                  {checked && <FaCheck className="text-gray-900 text-sm" />}
                </div>

                <span className="text-sm">{lecture.title}</span>
              </div>
              <span className="text-sm text-gray-400">{formatDuration(lecture.duration)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MediaPlayer;
