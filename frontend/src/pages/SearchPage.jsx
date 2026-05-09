import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CourseCard from "../component/CourseCard";
import { toast } from "react-toastify";
import { courseBaseUrl } from "../utils/endpoints";
import { Search as SearchIcon, Filter, Star, Tag, Globe } from "lucide-react";
import Card from "../component/ui/Card";

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

  const fetchCourses = async (filters) => {
    setLoading(true);
    try {
      const response = await axios.get(`${courseBaseUrl}/search`, { params: filters });
      setCourses(response.data.data);
      setTotalResults(response.data.data.length || 0);
    } catch (error) {
      toast.error(error?.response?.data.message || "Query synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20">
      <div className="bg-white border-b border-slate-200 pt-12 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
               <SearchIcon size={12} /> Live Inventory Search
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">
               Found {totalResults.toLocaleString()} results for <span className="text-blue-600">"{filters.title}"</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
               Showing high-density results from our global domain clusters. Refine your query below.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filter Station */}
          <aside className="w-full lg:w-72 space-y-8">
            <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
                <Filter size={14} /> Refine Matrix
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Star size={12} /> Quality Rating
                  </label>
                  <select
                    name="rating"
                    value={filters.rating}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all font-semibold"
                  >
                    <option value="">Any Assessment</option>
                    <option value="5">4.5 & Above</option>
                    <option value="4">4.0 & Above</option>
                    <option value="3">3.0 & Above</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Tag size={12} /> Pricing Node
                  </label>
                  <select
                    name="price"
                    value={filters.price}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all font-semibold"
                  >
                    <option value="">Any Price</option>
                    <option value="0">Gratis</option>
                    <option value="500">₹500+</option>
                    <option value="1000">₹1,000+</option>
                    <option value="5000">₹5,000+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Globe size={12} /> Instruction Node
                  </label>
                  <select
                    name="language"
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all font-semibold"
                  >
                    <option value="">Select Protocol</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
              </div>
            </Card>
          </aside>

          {/* Results Feed */}
          <main className="flex-1 space-y-6">
            {loading ? (
              <div className="p-20 text-center space-y-4">
                 <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Synchronizing results...</p>
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} layout="horizontal" />
                ))}
              </div>
            ) : (
              <div className="p-20 border border-dashed border-slate-200 rounded-2xl text-center space-y-4 bg-white">
                 <SearchIcon size={32} className="mx-auto text-slate-300" />
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No modules found for your query</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;