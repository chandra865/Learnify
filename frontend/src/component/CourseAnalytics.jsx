import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { FaUsers, FaDollarSign, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

const CourseAnalytics = () => {
  const course = useSelector((state)=>state.course.selectedCourse);

  const learners = course.enrolledStudents.length;
  const revenue = learners*course.price;
  const avgRating = course.averageRating;

//   const viewsData = [
//     { day: "Mon", views: 200 },
//     { day: "Tue", views: 400 },
//     { day: "Wed", views: 300 },
//     { day: "Thu", views: 500 },
//     { day: "Fri", views: 700 },
//     { day: "Sat", views: 600 },
//     { day: "Sun", views: 800 },
//   ];

//   const quizPerformanceData = [
//     { category: "Pass", count: 75 },
//     { category: "Fail", count: 25 },
//   ];

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Course Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="flex items-center bg-gray-800 p-4 rounded-lg">
          <FaUsers className="text-4xl text-blue-400 mr-3" />
          <div>
            <p className="text-lg font-semibold">Learners</p>
            <p className="text-2xl font-bold">{learners}</p>
          </div>
        </div>

        <div className="flex items-center bg-gray-800 p-4 rounded-lg">
          <FaDollarSign className="text-4xl text-green-400 mr-3" />
          <div>
            <p className="text-lg font-semibold">Revenue</p>
            <p className="text-2xl font-bold">₹{revenue}</p>
          </div>
        </div>

        <div className="flex items-center bg-gray-800 p-4 rounded-lg">
          <FaStar className="text-4xl text-yellow-400 mr-3" />
          <div>
            <p className="text-lg font-semibold">Avg Rating</p>
            <p className="text-2xl font-bold">{avgRating} ⭐</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Views Graph */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Course Views</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="gray" />
              <XAxis dataKey="day" stroke="white" />
              <YAxis stroke="white" />
              <Tooltip wrapperClassName="bg-gray-700 p-2 rounded text-white" />
              <Line type="monotone" dataKey="views" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quiz Performance Graph */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Quiz Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={quizPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="gray" />
              <XAxis dataKey="category" stroke="white" />
              <YAxis stroke="white" />
              <Tooltip wrapperClassName="bg-gray-700 p-2 rounded text-white" />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics;
