import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useDispatch } from "react-redux";
import CategoryMenu from "../component/CategoryMenu";
import { toast } from "react-toastify";
import { login } from "../store/slice/userSlice";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Navbar = () => {
  const { status, userData } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [switching, setSwitching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.userData);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
        `${API_BASE_URL}/api/v1/user/switch-user-role`,
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
        <div className="flex items-center gap-6">
        <div className="flex flex-row justify-between items-center gap-4 md:gap-10">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <Link
            to={user?.role === "instructor" ? "/dashboard/profile" : "/"}
          >
            <div className="flex flex-row items-center gap-2 ml-2 md:ml-0">
              <img
                src="src/assets/logo.png"
                alt="Logo"
                className="h-8 w-8 md:h-10 md:w-10"
              />
              <p className="text-blue-500 font-extrabold text-lg md:text-xl">
                Learnify
              </p>
            </div>
          </Link>

          {/* Category Menu (Hidden on smaller screens) */}
          <div className="hidden md:block">
            <CategoryMenu />
          </div>
        </div>

        {/* Search Bar (Hidden on smaller screens) */}
        <div className="hidden md:flex items-center bg-gray-700 rounded-3xl px-3 py-2 w-140 hover:border-2">
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
        {/* Navigation Links (Hidden on smaller screens) */}
        <ul className="hidden md:flex items-center gap-4">
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
              {user?.role === "student" && (
                <li>
                  <Link to="dashboard/profile">
                    <img
                      src={user.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white hover:scale-105 transition"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 z-10 shadow-md rounded-b-md py-2">
          <div className="px-4 py-2">
            <div className="flex items-center bg-gray-700 rounded-3xl px-3 py-2 mb-2">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-transparent border-none outline-none text-white px-2 w-full"
              />
            </div>
            <CategoryMenu />
          </div>
          <ul className="flex flex-col items-start px-4">
            {!status ? (
              <>
                <Link
                  to="/register"
                  className="block py-2 hover:bg-gray-700 rounded"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="block py-2 hover:bg-gray-700 rounded"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleRoleSwitch}
                  disabled={switching}
                  className="block py-2 hover:bg-gray-700 rounded underline cursor-pointer text-sm"
                >
                  {switching
                    ? "Switching..."
                    : `${user?.role === "student" ? "Instructor" : "Student"}`}
                </button>
                {user?.role === "student" && (
                  <Link
                    to="dashboard/profile"
                    className="block py-2 hover:bg-gray-700 rounded"
                  >
                    <img
                      src={user.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                  </Link>
                )}
                <Link
                  to="/logout"
                  className="block py-2 hover:bg-gray-700 rounded"
                >
                  Logout
                </Link>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;