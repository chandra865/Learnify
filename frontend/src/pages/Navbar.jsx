import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import CategoryMenu from "../component/CategoryMenu";
import { toast } from "react-toastify";
import { login } from "../store/slice/userSlice";
import axios from "axios";
import siteLogo from "../assets/logo.png";
import { userBaseUrl } from "../utils/endpoints";
import Button from "../component/ui/Button";
import Input from "../component/ui/Input";

const Navbar = () => {
  const { status } = useSelector((state) => state.user);
  const userData = useSelector((state) => state.user.userData);
  const [searchQuery, setSearchQuery] = useState("");
  const [switching, setSwitching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      const query = searchQuery;
      setSearchQuery("");
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleRoleSwitch = async () => {
    const newRole = userData?.role === "student" ? "instructor" : "student";
    try {
      setSwitching(true);
      const response = await axios.patch(
        `${userBaseUrl}/${userData._id}/role`,
        { newRole },
        { withCredentials: true }
      );
      dispatch(login(response.data.data));
      newRole === "instructor" ? navigate("/dashboard/profile") : navigate("/");
      toast.success(`Role switched to ${newRole}`);
    } catch (err) {
      toast.error("Role synchronization failed");
    } finally {
      setSwitching(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-8">
        
        {/* Left: Brand & Discovery */}
        <div className="flex items-center gap-8 flex-1">
          <Link to={userData?.role === "instructor" ? "/dashboard/profile" : "/"} className="flex items-center gap-2 group shrink-0">
            <img src={siteLogo} alt="Learnify" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Learnify
            </span>
          </Link>

          <div className="hidden lg:block">
            <CategoryMenu />
          </div>

          <div className="hidden md:flex relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            <input
              type="text"
              placeholder="Search courses, skills, and labs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Right: Actions & User Meta */}
        <div className="flex items-center gap-4">
          {!status ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Get Started
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRoleSwitch} 
                isLoading={switching}
                className="hidden sm:flex"
              >
                {userData?.role === "student" ? "Switch to Teaching" : "Switch to Learning"}
              </Button>

              {userData?.role === "student" && (
                <Link to="/dashboard/profile" className="shrink-0">
                  <img
                    src={userData.profilePicture?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={userData.name}
                    className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-400 transition-all"
                  />
                </Link>
              )}

              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => navigate("/logout")}>
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>

              <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-md">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Console */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <div className="container mx-auto p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-10 pr-4 text-sm"
              />
            </div>
            
            <CategoryMenu />
            
            <div className="grid grid-cols-1 gap-2 pt-4 border-t border-slate-100">
              {status ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleRoleSwitch} isLoading={switching} className="w-full justify-start">
                    {userData?.role === "student" ? "Instructor Mode" : "Student Mode"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/logout")} className="w-full justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" size="sm" onClick={() => navigate("/login")} className="w-full">Login</Button>
                  <Button size="sm" onClick={() => navigate("/register")} className="w-full">Get Started</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;