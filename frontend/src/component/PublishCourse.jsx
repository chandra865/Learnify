import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCourse } from "../store/slice/selectedCourseSlice";
import { toast } from "react-toastify";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const PublishCourse = () => {

  const course = useSelector((state) => state.course.selectedCourse);
  const dispatch = useDispatch();
  
  const fetchCourse = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/course/fetchcourse/${course._id}`,
        { withCredentials: true }
      );
      
      dispatch(setSelectedCourse(response.data.data));
    } catch (error) {
      toast.error(error?.response?.data.message || "Error fetching course data");
    }
    setLoading(false);
  };

  const handleCoursePublish = async () => {
    if (course.published === false && course.certificateOption === "quiz" && !course.quiz) {
      toast.error("First, add a quiz");
      return;
    }
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/course/change-publish-status/${course._id}`,
        null,
        { withCredentials: true }
      );
      toast.success(
        response?.data?.message || "Course publish status change successfully!"
      );
      fetchCourse();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change course publish status.");
    }
  };
  return (
    <div className="text-white">
        {course.published ?(
            <p className="text-2xl font-bold mb-4">Course is Published</p>
        ):(
            <p className="text-2xl font-bold mb-4">Course is Unpublish</p>
        )
        }
        <button
            className="bg-blue-500 text-white cursor-pointer py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            onClick={handleCoursePublish}
        >
            {course.published ? "Unpublish" : "Publish Course"}
        </button>
    </div>
  )
};

export default PublishCourse;
