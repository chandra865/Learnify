import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { Search } from "lucide-react";

const Navbar = () => {
  const { status } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  // Handle search submit on Enter
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      setSearchQuery("");
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          MyApp
        </Link>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2 w-80">
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

        {/* Navigation Links */}
        <ul className="flex items-center gap-4">
          {!status ? (
            <>
              <li>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition"
                >
                  Login
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition"
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
