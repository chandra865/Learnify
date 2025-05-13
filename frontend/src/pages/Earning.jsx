import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Earning = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [thisMonthRevenue, setThisMonthRevenue] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [coursesSold, setCoursesSold] = useState(0);

  const user = useSelector((state) => state.user.userData);

  useEffect(() => {
    const fetchInstructorCourseTransaction = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/transaction/get-user-instructor-transactions/${user._id}`,
          { withCredentials: true }
        );

        const transactions = response.data?.data || [];
        console.log(transactions);
        const earningsByMonth = Array(12).fill(0);
        const courseMap = {};
        const studentSet = new Set();
        let total = 0;
        let monthRevenue = 0;
        const currentMonth = new Date().getMonth();

        transactions.forEach((tx) => {
          const createdAt = new Date(tx.createdAt);
          const month = createdAt.getMonth();

          studentSet.add(tx.userId);

          tx.courses.forEach((course) => {
            const courseId = course._id;
            const originalPrice = course.price || 0;
            const finalPrice = course.finalPrice || originalPrice; // Use finalPrice if available
            const rating = course.averageRating || 0;

            // Track overall and monthly revenue
            total += finalPrice;
            earningsByMonth[month] += finalPrice;
            if (month === currentMonth) {
              monthRevenue += finalPrice;
            }

            // Initialize course entry
            if (!courseMap[courseId]) {
              courseMap[courseId] = {
                name: course.title,
                originalPrice,
                totalRevenue: 0,
                students: new Set(),
                rating,
                finalPrice,
              };
            }

            courseMap[courseId].totalRevenue += finalPrice;
            courseMap[courseId].students.add(tx.userId);
          });
        });

        const monthlyData = monthNames.map((month, index) => ({
          month,
          revenue: earningsByMonth[index],
        }));

        const courseStatsArr = Object.values(courseMap).map((course) => ({
          ...course,
          revenue: `₹${course.totalRevenue.toLocaleString()}`,
          students: course.students.size,
        }));

        setMonthlyRevenue(monthlyData);
        setCourseStats(courseStatsArr);
        setTotalRevenue(total);
        setThisMonthRevenue(monthRevenue);
        setTotalStudents(studentSet.size);
        setCoursesSold(transactions.length);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch transactions"
        );
      }
    };

    if (user?._id) fetchInstructorCourseTransaction();
  }, [user]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Earnings Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Earnings",
            value: `₹${totalRevenue.toLocaleString()}`,
          },
          {
            label: "Earnings This Month",
            value: `₹${thisMonthRevenue.toLocaleString()}`,
          },
          { label: "Total Students", value: totalStudents },
          { label: "Courses Sold", value: coursesSold },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-lg shadow-md text-center"
          >
            <h2 className="text-lg font-semibold">{item.label}</h2>
            <p className="text-xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Earnings Chart */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Earnings</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="gray" />
            <XAxis dataKey="month" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#38bdf8"
              strokeWidth={2}
            />
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
              <th className="p-2">Original Price</th>
              <th className="p-2">Sold At</th>
              <th className="p-2">Revenue</th>
              <th className="p-2">Students</th>
              <th className="p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {courseStats.map((course, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="p-2">{course.name}</td>
                <td className="p-2">₹{course.originalPrice}</td>
                <td className="p-2">{course.finalPrice}</td>
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
