import { FaStar, FaUserGraduate, FaBookOpen, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

const InstructorProfile = () => {
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [enrolledStudents, setEnrolledStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  const course = useSelector((state) => state.course.selectedCourse);
  const instructorId = course?.instructor._id;

  const fetchInstructorCourseStudent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/user/get-instructor-stats/${instructorId}`,
        {
          withCredentials: true,
        }   
      );
      //     totalCourses: 0,
      // totalStudents

      console.log(response.data.data);
      setTotalCourses(response.data.data.totalCourses);
      setEnrolledStudents(response.data.data.totalStudents);
    } catch (error) {
      console.error(
        "Error fetching instructor data:",
        error?.response?.data?.message || error.message
      );
    }
  };

  const fetchInstructorRatingReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/user/get-instructor-rating-and-reviews/${instructorId}`,
        {
          withCredentials: true,
        }
      );
      // totalReviews: 0,
      // averageRating: 0,
      console.log(response.data.data);
      setRating(response.data.data.averageRating);
      setReviews(response.data.data.totalReviews);
    } catch (error) {
      console.error(
        "Error fetching instructor data:",

        error?.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    fetchInstructorRatingReviews();
    fetchInstructorCourseStudent();
  }, [instructorId]);

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-2">Instructor</h2>
      <div className="bg-gray-800 text-white p-4 rounded shadow max-w-3xl mx-auto my-4">
        <h3 className=" text-lg font-bold underline my-2">
          {course?.instructor?.name}
        </h3>

        <div className="flex items-center space-x-4 mb-6">
          <img
            src={
              course.instructor?.profilePicture?.url ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Instructor"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="space-y-2 text-sm ">
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              <span>
                <strong>{rating}</strong> Instructor Rating
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaUser className="" />
              <span>
                <strong>{reviews}</strong> Reviews
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaUserGraduate className="" />
              <span>
                <strong>{enrolledStudents}</strong> Students
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaBookOpen className="" />
              <span>
                <strong>{totalCourses}</strong> Courses
              </span>
            </div>
          </div>
        </div>

        <p className=" text-sm leading-relaxed">
          {course?.instructor?.bio === ""
            ? "No bio available."
            : course?.instructor?.bio}
        </p>
      </div>
    </div>
  );
};

export default InstructorProfile;
