import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../component/Loading";
import CourseCard from "../component/CourseCard";
import { ChevronRight, Filter, Search as SearchIcon } from "lucide-react";
import { courseBaseUrl } from "../utils/endpoints";
import Button from "../component/ui/Button";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All Domains");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(courseBaseUrl);
        const filtered = response.data.data.filter(course => course.published);
        setCourses(filtered);
        if (filtered.length > 0 && activeCategory === "All Domains") {
          // Keep it as All Domains or set to first category
        }
      } catch (err) {
        setError("Catalog synchronization failed");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <Loading />;

  const categories = ["All Domains", ...new Set(courses.map(course => course.category))];
  
  const filteredCourses = activeCategory === "All Domains" 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  return (
    <div className="bg-[#fafafa] min-h-screen pt-24 pb-20 px-6 mt-[-64px]">
      <div className="max-w-[1440px] mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 pb-10">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Curriculum Matrix</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">
               Industrial Course <br />
               <span className="text-slate-400">Inventory</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-bold text-slate-600">
                <Filter size={16} className="text-slate-400" />
                Capacity: {filteredCourses.length} Nodes
             </div>
             <div className="hidden sm:block h-6 w-[1px] bg-slate-200 mx-2" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:block">
                Sync Status: Operational
             </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Persistent Sidebar Filter */}
          <aside className="lg:w-64 space-y-8 flex-shrink-0">
            <div className="space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Domain Architecture</h3>
               <nav className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all
                        ${activeCategory === cat 
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-200 translate-x-1" 
                          : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"}
                      `}
                    >
                      {cat}
                      <ChevronRight size={14} className={activeCategory === cat ? "opacity-100" : "opacity-0 group-hover:opacity-100"} />
                    </button>
                  ))}
               </nav>
            </div>

            <div className="p-6 bg-blue-600 rounded-3xl text-white space-y-4 shadow-xl shadow-blue-100">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Infrastructure Note</p>
                <p className="text-xs font-bold leading-relaxed">
                  All nodes are verified for industrial compliance and production-ready implementation.
                </p>
                <Button variant="outline" size="sm" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Documentation
                </Button>
            </div>
          </aside>

          {/* Main Catalog Grid */}
          <main className="flex-1 space-y-8">
            {error ? (
              <div className="p-12 text-center rounded-3xl bg-rose-50 border border-rose-100 text-rose-600 font-bold">
                {error}
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="p-20 text-center rounded-[40px] bg-slate-100 border border-slate-200 space-y-4">
                <SearchIcon size={48} className="mx-auto text-slate-300" />
                <p className="text-lg font-bold text-slate-400 italic">No node clusters found in this domain</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    layout="vertical"
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Courses;
