import { useEffect, useState, useMemo } from "react";
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
import { transactionBaseUrl } from "../utils/endpoints";
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

import Pagination from "../component/Pagination";

const Earning = () => {
  const today = useMemo(() => new Date(), []);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [thisMonthRevenue, setThisMonthRevenue] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [coursesSold, setCoursesSold] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const user = useSelector((state) => state.user.userData);

  useEffect(() => {
    const fetchInstructorCourseTransaction = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${transactionBaseUrl}/instructor/${user._id}`,
          { 
            params: { page: currentPage, limit: 10, year: selectedYear },
            withCredentials: true 
          }
        );

        const { list: transactions, stats, pagination: pagData } = response.data?.data || {};
        
        // Use backend stats for summary cards
        setTotalRevenue(stats.totalRevenue || 0);
        setTotalStudents(stats.totalStudents || 0);
        setCoursesSold(stats.coursesSold || 0);
        setPagination(pagData);

        // Process table data (current page only) - Filtered by current instructor
        const courseMap = {};
        transactions.forEach((tx) => {
          tx.courses
            .filter((c) => c.instructor.toString() === user._id.toString())
            .forEach((course) => {
              const courseId = course._id;
              if (!courseMap[courseId]) {
                courseMap[courseId] = {
                  name: course.title,
                  originalPrice: course.price,
                  totalRevenue: 0,
                  students: new Set(),
                  rating: course.averageRating,
                  finalPrice: course.finalPrice || course.price,
                };
              }
              courseMap[courseId].totalRevenue += course.finalPrice || course.price;
              courseMap[courseId].students.add(tx.userId);
            });
        });

        const courseStatsArr = Object.values(courseMap).map((course) => ({
          ...course,
          revenue: `₹${course.totalRevenue.toLocaleString()}`,
          students: course.students.size,
        }));
        setCourseStats(courseStatsArr);

        // Use backend monthly stats for chart
        const monthlyData = monthNames.map((month, index) => {
          const matchedMonth = stats.monthlyRevenue?.find(m => m._id === index + 1);
          return {
            month,
            revenue: matchedMonth ? matchedMonth.revenue : 0,
          };
        });
        setMonthlyRevenue(monthlyData);
        
        // Accurate current month revenue for selected year
        const currentMonthIdx = today.getMonth();
        const isCurrentYear = today.getFullYear() === selectedYear;
        setThisMonthRevenue(isCurrentYear ? monthlyData[currentMonthIdx].revenue : 0);

      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchInstructorCourseTransaction();
  }, [user, currentPage, selectedYear, today]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Earnings Dashboard - {selectedYear}</h1>
        
        <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg border border-gray-700">
          <label htmlFor="year-select" className="text-sm font-medium text-gray-400">Select Year:</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-gray-900 text-white border-none outline-none cursor-pointer text-sm font-bold"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Earnings (All-Time)",
            value: `₹${totalRevenue.toLocaleString()}`,
          },
          {
            label: today.getFullYear() === selectedYear 
              ? `Earnings (${monthNames[today.getMonth()]} ${selectedYear})`
              : `Total Earnings (${selectedYear})`,
            value: today.getFullYear() === selectedYear
              ? `₹${thisMonthRevenue.toLocaleString()}`
              : `₹${monthlyRevenue.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}`,
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
        <h2 className="text-lg font-semibold mb-4">Monthly Earnings ({selectedYear})</h2>
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
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
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
            <Pagination 
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Earning;
