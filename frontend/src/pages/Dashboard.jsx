import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  FaUser,
  FaBook,
  FaChalkboardTeacher,
  FaPlusCircle,
  FaSignOutAlt,
  FaDollarSign,
  FaShoppingCart
} from "react-icons/fa";



const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useSelector((state) => state.user.userData?.role);

  // Sidebar items based on role
  const sidebarItems = role === "student"
    ? [
        { title: "Profile", path: "/dashboard/profile", icon: <FaUser /> },
        { title: "Enrolled Courses", path: "/dashboard/enrolled", icon: <FaBook /> },
        { title: "Cart", path: "/dashboard/cart", icon: < FaShoppingCart /> },
        { title: "Logout", path: "/logout", icon: <FaSignOutAlt /> },
      ]
    : [
        { title: "Profile", path: "/dashboard/profile", icon: <FaUser /> },
        { title: "Created Courses", path: "/dashboard/created", icon: <FaBook /> },
        { title: "Create Course", path: "/dashboard/create", icon: <FaPlusCircle /> },
        { title: "Earning", path: "/dashboard/Earning", icon: <FaDollarSign /> },
        { title: "Logout", path: "/logout", icon: <FaSignOutAlt /> },
      ];
      
  // Check if current path matches item path for active class
  const isActive = (path) => location.pathname === path ? "bg-gray-700" : "";
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <ul>
          {sidebarItems.map((item) => (
            <li
              key={item.title}
              className={`flex items-center space-x-3 p-3 ${isActive(item.path)} hover:bg-gray-700 cursor-pointer rounded`}
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span>
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 bg-gray-300">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
