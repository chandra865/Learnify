import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../component/Loading";
import ProgressBar from "../component/ProgressBar";
import { Link } from "react-router-dom";
import StarRating from "../component/StarRating";
import { CircularProgressbar } from 'react-circular-progressbar';

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user.userData?._id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/enrollment/get-enrolled-courses/${userId}`,
          { withCredentials: true }
        );

        setCourses(response.data.data);
      } catch (err) {
        alert(
          err.response?.data?.message || "Failed to fetch enrolled courses"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, [userId]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen p-6 bg-gray-800 text-white">
      <h2 className="text-2xl font-extrabold text-center mb-8">
        Enrolled Courses
      </h2>

      {courses.length > 0 ? (
        <div className="">
          {courses.map((course) => {
            const completedLectures = course?.completedLectures || 0;
            const totalLectures = course?.totalLectures || 1;
            const progress = Math.round(
              (completedLectures / totalLectures) * 100
            );

            return (
              <div className="flex py-4 px-2 border-b-2 hover:bg-gray-700 transform transition duration-300 hover:scale-102">
                  {/* Course Image */}
                  <div className="w-70 h-40 flex-shrink-0">
                    <img
                      src={course.thumbnail?.url}
                      alt={course.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
            
                  {/* Course Details */}
                  <div className="flex flex-row w-full ">
                    <div className="w-full px-4">
                      <Link
                        to={`/course/enroll/${course._id}`}
                        className="text-xl font-extrabold"
                      >
                        {course.title}
                      </Link>
                      <div>
                        <p className="text-white">{course.description}</p>
                        <p className="text-white-500 text-sm my-1">
                          {course?.instructor?.name || "Unknown Instructor"}
                        </p>
            
                        {/* Rating */}
                        <StarRating rating={course.averageRating || 0} />
            
                        {/* Course Meta Info */}
                        <p className="text-white-500 text-sm my-1">
                          {course.lecture?.length || 0} Lectures
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex flex-col justify-between"
                      
                    >
                    <p className="px-10 text-xl font-extrabold ">₹{course.price}</p>
                    <ProgressBar userId={userId} courseId={course._id} />
                    </div>
                    
                  </div>
                </div>
              // <div
              //   key={course._id}
              //   className="bg-gray-700 shadow-lg rounded-lg overflow-hidden"
              // >
              //   <img
              //     src={
              //       course?.thumbnail?.url || "https://via.placeholder.com/300"
              //     }
              //     alt={course.title}
              //     className="w-full h-48 object-cover"
              //   />
              //   <div className="p-4">
              //     <h3 className="text-xl font-semibold">{course.title}</h3>
              //     <p className="text-sm mb-2">{course.description}</p>
              //     <p className="text-blue-400 font-medium">
              //       Category: {course.category}
              //     </p>
              //     <p className="text-green-400 font-medium mb-2">
              //       Price: ${course.price}
              //     </p>

              //     {/* Progress Bar */}
              //     {/* <div className="mb-4">
              //       <p className="text-sm">Progress: {progress}%</p>
              //       <div className="w-full bg-gray-600 h-2 rounded">
              //         <div
              //           className="bg-blue-500 h-2 rounded"
              //           style={{ width: `${progress}%` }}
              //         ></div>
              //       </div>
              //     </div> */}

              //     <ProgressBar userId={userId} courseId={course._id} />

              //     {/* Watch Course Button */}
              //     <button
              //       onClick={() => navigate(`/course/enroll/${course._id}`)}
              //       className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-300"
              //     >
              //       Watch Course
              //     </button>
              //   </div>
              // </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400">No enrolled courses found.</p>
      )}
    </div>
  );
};

export default EnrolledCourses;
