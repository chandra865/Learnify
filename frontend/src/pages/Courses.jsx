import { useState, useEffect } from "react";
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
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryCourses, setCategoryCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${courseBaseUrl}`);
        const courseData = response.data.data;
        const publishedCourses = courseData.filter(course => course.published === true);
        setCourses(publishedCourses);

        const defaultCategory = publishedCourses[0]?.category;
        setActiveCategory(defaultCategory);

        if (defaultCategory) {
          setCategoryCourses(
            publishedCourses.filter(course => course.category === defaultCategory)
          );
        }
      } catch (err) {
        setError("Catalog synchronization failed");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCategoryCourses(courses.filter(course => course.category === category));
  };

  if (loading) return <Loading />;

  const categories = [...new Set(courses.map(course => course.category))];

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="border-b border-slate-200 bg-white pt-10 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-4">
             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Course Matrix</h2>
             <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                Architect your curriculum.
             </h1>
             <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Browse our high-density catalog of industrial-grade courses. Synchronized for professional skill acquisition.
             </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters (Stationary) */}
          <aside className="w-full lg:w-64 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <Filter size={14} /> Domain Matrix
              </div>
              <div className="flex flex-col gap-1">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoryChange(category)}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-md text-sm font-semibold transition-all group
                      ${activeCategory === category 
                        ? "bg-slate-900 text-white shadow-sm" 
                        : "text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200"}
                    `}
                  >
                    {category}
                    <ChevronRight size={14} className={`transition-transform ${activeCategory === category ? "translate-x-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"}`} />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Discovery Feed */}
          <main className="flex-1 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-black text-slate-900 tracking-tight capitalize">
                {activeCategory} Cluster
                <span className="ml-3 text-xs font-medium text-slate-400 uppercase tracking-widest">{categoryCourses.length} Modules Found</span>
              </h3>
            </div>

            {error ? (
              <div className="p-8 border border-rose-100 bg-rose-50 rounded-lg text-center">
                 <p className="text-sm font-bold text-rose-600 uppercase tracking-widest">{error}</p>
              </div>
            ) : categoryCourses.length === 0 ? (
              <div className="p-20 border border-dashed border-slate-200 rounded-2xl text-center space-y-4">
                 <SearchIcon size={32} className="mx-auto text-slate-300" />
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No active modules in this cluster</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {categoryCourses.map((course) => (
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
