import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Earning = () => {
  const [earnings] = useState([
    { month: "Jan", revenue: 1200 },
    { month: "Feb", revenue: 2500 },
    { month: "Mar", revenue: 1800 },
    { month: "Apr", revenue: 3000 },
    { month: "May", revenue: 2200 },
  ]);

  const [courses] = useState([
    { name: "React Basics", revenue: "$1,500", students: 120, rating: 4.8 },
    { name: "Advanced JavaScript", revenue: "$2,200", students: 180, rating: 4.7 },
    { name: "UI/UX Design", revenue: "$900", students: 90, rating: 4.5 },
  ]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Earnings Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Earnings", value: "$12,000" },
          { label: "Earnings This Month", value: "$3,000" },
          { label: "Total Students", value: "500+" },
          { label: "Courses Sold", value: "120" },
        ].map((item, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-semibold">{item.label}</h2>
            <p className="text-xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Earnings Chart */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Earnings</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={earnings}>
            <CartesianGrid strokeDasharray="3 3" stroke="gray" />
            <XAxis dataKey="month" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Course Earnings Table */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Course Earnings</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2">Course</th>
              <th className="p-2">Revenue</th>
              <th className="p-2">Students</th>
              <th className="p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="p-2">{course.name}</td>
                <td className="p-2">{course.revenue}</td>
                <td className="p-2">{course.students}</td>
                <td className="p-2">{course.rating} ⭐</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Earning;
