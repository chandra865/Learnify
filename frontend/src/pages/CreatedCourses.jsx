import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../component/Loading";
import StarRating from "../component/StarRating";
import EditCourse from "./EditCourse";
import PublishCourse from "../component/PublishCourse";
import AddResources from "../component/AddResources";
import AddLecture from "./AddLecture";
import CourseAnalytics from "../component/CourseAnalytics";
import CommentsFeedback from "../component/CommentsFeedback";
import { useDispatch } from "react-redux";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";
import { FaArrowLeft } from "react-icons/fa";
import Coupon from "../component/Coupon";


const CreatedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(false);
  const [chossenCourse, setChossenCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("edit");
  const userId = useSelector((state) => state.user.userData?._id);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCreatedCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/course/inst-courses",
          { withCredentials: true }
        );
        setCourses(response.data.data);
      } catch (err) {
        toast.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCreatedCourses();
  }, [userId]);

  

  const tabs = [
    { key: "edit", label: "Edit Course" },
    { key: "lecture", label: "Add Lecture" },
    { key: "resources", label: "Add Resources" },
    { key: "coupon", label: "Add Coupon" },
    { key: "publish", label: "Publish Course" },
    { key: "analytics", label: "Course Analytics" },
    { key: "feedback", label: "Comments & Feedback" },
  ];  


  const handleCourseSelection = (course) => {
    dispatch(setSelectedCourse(course));
    setChossenCourse(course);
    setSelected(true);
    setActiveTab("edit");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "edit":
        return <EditCourse/>;
      case "publish":
        return <PublishCourse/>;
      case "resources":
        return <AddResources/>;
      case "lecture":
        return <AddLecture/>;
      case "coupon":
        return <Coupon/>;
      case "analytics":
        return <CourseAnalytics/>;
      case "feedback":
        return <CommentsFeedback/>;
      default:
        return <EditCourse/>;
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <h2 className="text-2xl font-extrabold text-center mb-2 text-white">Created Courses</h2>

      <div className="flex-1 p-6">
        {!selected ? (
          <div>
            {courses.length === 0 ? (
              <p className="text-center text-gray-500">No courses found.</p>
            ) : (
              courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => handleCourseSelection(course)}
                  className="flex py-4 px-2 border-b-2 text-white hover:bg-gray-700 transform transition duration-300 hover:scale-102 cursor-pointer"
                >
                  <div className="w-70 h-40 flex-shrink-0">
                    <img
                      src={course.thumbnail?.url}
                      alt={course.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex flex-row w-full px-4">
                    <div className="w-full">
                      <h1 className="text-xl font-extrabold">{course.title}</h1>
                      <p className="text-white">{course.description}</p>
                      <p className="text-gray-400 text-sm my-1">
                        {course?.instructor?.name || "Unknown Instructor"}
                      </p>
                      <StarRating rating={course.averageRating || 0} />
                      <p className="text-gray-400 text-sm my-1">
                        {course.lecture?.length || 0} Lectures
                      </p>
                    </div>
                    <div className="flex flex-col justify-between">
                      <p className="px-10 text-xl font-extrabold">₹{course.price}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div>

            <div className="flex flex-row gap-2 mb-2">
            <button className="flex items-center cursor-pointer text-white" onClick={() => setSelected(false)}>
              <FaArrowLeft className="mr-2" />
            </button>
            <h1 className=" text-2xl font-extrabold text-white ">{chossenCourse.title}</h1>
            </div>
            <div className="flex border-b border-gray-700 text-white">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`p-2 mx-2 cursor-pointer ${
                    activeTab === tab.key ? "border-b-2 border-blue-400" : "text-gray-400"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-4 bg-gray-800 mt-4 rounded">{renderTabContent()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatedCourses;