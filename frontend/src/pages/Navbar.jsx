import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import CategoryMenu from "../component/CategoryMenu";
import { toast } from "react-toastify";
import { login } from "../store/slice/userSlice";
import axios from "axios";

const Navbar = () => {
  const { status, userData } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [switching, setSwitching] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.userData);

  // Handle search submit on Enter
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      setSearchQuery("");
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleRoleSwitch = async () => {
    const newRole = user.role === "student" ? "instructor" : "student";
    try {
      setSwitching(true);
      const response = await axios.put(
        "http://localhost:8000/api/v1/user/switch-user-role",
        { newRole },
        { withCredentials: true }
      );
      dispatch(login(response.data.data));
      newRole === "instructor" ? navigate("/dashboard/profile") : navigate("/");
      toast.success(`Switched to ${newRole} role`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to switch role");
    } finally {
      setSwitching(false);
    }
  };
  
  return (
    <nav className="bg-gray-800 text-white p-4 drop-shadow-[0_4px_4px_rgba(255,255,255,0.25)] border-b-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-row justify-between items-center gap-10">
        {/* Logo */}
        <Link
          to={user?.role === "instructor" ? "/dashboard/profile" : "/"}
        
        >
          <div className="flex flex-row items-center gap-2 ml-25">
          <img
            src="src/assets/logo.png"
            alt="Logo"
            className="h-10 w-10"
          />
          <p className="text-blue-500 font-extrabold text-xl">Learnify</p>
          </div>
          
        </Link>

        <CategoryMenu />

        {/* Search Bar */}
        <div className="flex items-center bg-gray-700 rounded-3xl px-3 py-2 w-150 hover:border-2">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch} // ✅ Detect Enter Key Press
            className="bg-transparent border-none outline-none text-white px-2 w-full"
          />
        </div>

        </div>

        {/* Navigation Links */}
        <ul className="flex items-center gap-4">
          {!status ? (
            <>
              <li>
                <Link
                  to="/register"
                  className="px-4 py-2 border-1 rounded hover:bg-gray-500 transition"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="px-4 py-2  border-1 rounded hover:bg-gray-500 transition"
                >
                  Login
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
               
                <button
                  onClick={handleRoleSwitch}
                  disabled={switching}
                  title={
                    user?.role === "instructor"
                      ? "Switch to the student view here - get back to the courses you’re taking."
                      : ""
                  }
                  className="px-3 py-2 rounded underline cursor-pointer hover:bg-gray-500 transition text-sm"
                >
                  {switching
                    ? "Switching..."
                    : `${user?.role === "student" ? "Instructor" : "Student"}`}
                </button>
               
              </li>

              {/* Profile Picture only if student */}
              {user?.role === "student" && user?.profilePicture?.url && (
                <li>
                  <Link to="dashboard/profile">
                    <img
                      src={user.profilePicture.url}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white hover:scale-105 transition"
                    />
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/logout"
                  className="px-4 py-2 border-1 rounded hover:bg-gray-500  transition"
                >
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
