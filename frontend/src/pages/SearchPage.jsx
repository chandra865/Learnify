import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CourseCard from "../component/CourseCard";
import { toast } from "react-toastify";
import { 
  Search, 
  Filter, 
  Star, 
  CreditCard, 
  Globe, 
  ArrowRight,
  Terminal,
  Layers,
  ChevronDown,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { courseBaseUrl } from "../utils/endpoints";
import Card from "../component/ui/Card";
import Badge from "../component/ui/Badge";
import Button from "../component/ui/Button";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [courses, setCourses] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    title: query || "",
    rating: "",
    price: "",
    language: "",
  });

  useEffect(() => {
    fetchCourses(filters);
  }, [filters]);

  const fetchCourses = async (currentFilters) => {
    setLoading(true);
    try {
      const response = await axios.get(`${courseBaseUrl}/search`, { params: currentFilters });
      setCourses(response.data.data);
      setTotalResults(response.data.data.length || 0);
    } catch (error) {
      toast.error("Discovery protocol failure");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ title: query || "", rating: "", price: "", language: "" });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Search Intelligence Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                   <Search size={16} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Cognitive Discovery Node</p>
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                {loading ? "Searching..." : (
                  <>
                    <span className="text-slate-400">Identity:</span> {filters.title || "Neural Stream"}
                  </>
                )}
             </h2>
             {!loading && (
               <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-white border-slate-200 text-slate-500">
                    {totalResults} Protocols Found
                  </Badge>
                  <div className="h-4 w-[1px] bg-slate-200" />
                  <p className="text-xs font-bold text-slate-400 italic">Targeting precise knowledge nodes</p>
               </div>
             )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Industrial Filter Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 space-y-8">
            <div className="sticky top-32 space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <Filter size={14} /> Filter Matrix
                 </div>
                 <button onClick={clearFilters} className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">
                    Reset Protocol
                 </button>
              </div>

              <div className="space-y-6">
                {/* Rating Node */}
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quality Index</label>
                   <div className="relative">
                      <select 
                        name="rating" 
                        value={filters.rating} 
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer"
                      >
                         <option value="">All Ratings</option>
                         <option value="4.5">⭐ 4.5 & Above</option>
                         <option value="4">⭐ 4.0 & Above</option>
                         <option value="3">⭐ 3.0 & Above</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                   </div>
                </div>

                {/* Price Node */}
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Credit Threshold</label>
                   <div className="relative">
                      <select 
                        name="price" 
                        value={filters.price} 
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer"
                      >
                         <option value="">Total Range</option>
                         <option value="0">Free Access</option>
                         <option value="500">₹500+</option>
                         <option value="1000">₹1000+</option>
                         <option value="5000">₹5000+</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                   </div>
                </div>

                {/* Language Node */}
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dialect Sync</label>
                   <div className="relative">
                      <select 
                        name="language" 
                        value={filters.language} 
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer"
                      >
                         <option value="">All Dialects</option>
                         <option value="English">English</option>
                         <option value="Hindi">Hindi</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                   </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-3xl space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400 border border-blue-500/20">
                       <Terminal size={14} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">System Status</span>
                 </div>
                 <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                    Discovery engine operating on v4.0.0 protocol. High-density indexing active.
                 </p>
              </div>
            </div>
          </aside>

          {/* Neural Result Stream */}
          <div className="flex-1 space-y-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-40 space-y-6"
                >
                   <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Retrieving Protocols...</p>
                </motion.div>
              ) : courses.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 gap-6"
                >
                  {courses.map((course, idx) => (
                    <motion.div 
                      key={course.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <CourseCard course={course} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-40 text-center space-y-6"
                >
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                      <X size={40} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">No Protocols Synchronized</h3>
                      <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto">
                        Neural discovery engine failed to locate nodes matching this filter matrix. Adjust parameters and retry.
                      </p>
                   </div>
                   <Button variant="outline" size="sm" onClick={clearFilters}>Reset Matrix</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;