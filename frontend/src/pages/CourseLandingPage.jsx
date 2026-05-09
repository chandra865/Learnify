import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { 
  Play, 
  Check, 
  User, 
  Calendar, 
  Globe, 
  X, 
  ShieldCheck, 
  ShoppingCart, 
  ArrowRight,
  Info
} from "lucide-react";
import Loading from "../component/Loading";
import StarRating from "../component/StarRating";
import Recommendation from "../component/Recommendation";
import CourseReviews from "../component/CourseReviews";
import AddReview from "../component/AddReview";
import CourseContent from "../component/CourseContent";
import InstructorProfile from "../component/InstructorProfile";
import Button from "../component/ui/Button";
import Card from "../component/ui/Card";
import Badge from "../component/ui/Badge";
import { courseBaseUrl, enrollmentBaseUrl, sectionBaseUrl, cartBaseUrl } from "../utils/endpoints";

const CourseLandingPage = () => {
  const user = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const { course_id } = useParams();
  
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const proRef = useRef(null);

  const date = new Date(course?.updatedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const checkEnrollment = async () => {
    try {
      const response = await axios.get(`${enrollmentBaseUrl}/${user._id}/${course_id}`, { withCredentials: true });
      setIsEnrolled(response.data.data.enrollmentStatus);
    } catch (error) {
      // Quiet fail
    }
  };

  useEffect(() => {
    if (user && course_id) checkEnrollment();
  }, [user, course_id]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${courseBaseUrl}/${course_id}`, { withCredentials: true });   
        setCourse(response.data.data);
      } catch (error) {
        toast.error(error?.response?.data.message || "Course synchronization failed");
      }
    };
    fetchCourse();
  }, [course_id]);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await axios.get(`${sectionBaseUrl}/${course_id}`, { withCredentials: true });
        setSections(response.data.data);
      } catch (error) {
        // Quiet fail
      }
    };
    fetchSection();
  }, [course_id]);

  const handleCart = async (price) => {
    if (!user) return navigate("/login");
    try {
      await axios.post(`${cartBaseUrl}`, { userId: user._id, courseId: course_id, price }, { withCredentials: true });
      toast.success("Module added to acquisition queue");
    } catch (error) {
      toast.error(error.response?.data?.message || "Acquisition failure");
    }
  };

  if (!course) return <Loading />;

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Cinematic High-Trust Header */}
      <section className="bg-slate-900 text-white pt-16 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
               <ShieldCheck size={12} /> Verified Learning Track
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
              {course.subtitle}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400">
              <div className="flex items-center gap-2">
                <StarRating rating={course.averageRating || 0} />
                <span className="text-blue-400 font-bold">({course.reviews?.length || 0} Reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-slate-500" />
                <span className="text-slate-300 underline cursor-pointer hover:text-white transition-colors" onClick={() => proRef.current?.scrollIntoView({ behavior: "smooth" })}>
                  {course.instructor?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-500" />
                <span>Updated {formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-slate-500" />
                <span>{course.language}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-12 relative z-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Experience Feed */}
          <div className="flex-1 space-y-12">
            
            {/* Outcomes Cluster */}
            <Card className="p-8 lg:p-10 bg-white border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-8">What You'll Architect</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {course.whatYouWillLearn?.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start group">
                    <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                        <Check size={12} />
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Curriculum Engine */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Curriculum Engine</h2>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{sections?.length || 0} Logical Braces</span>
               </div>
               <CourseContent />
            </div>

            {/* Description Node */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Specification</h2>
              <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed font-medium">
                {course.description}
              </div>
            </div>

            {/* Support Matrix */}
            <div className="space-y-12">
               <Recommendation />
               <div className="border-t border-slate-200 pt-12">
                  <CourseReviews />
               </div>
               <div ref={proRef}>
                  <InstructorProfile />
               </div>
               <AddReview />
            </div>
          </div>

          {/* Conversion Station */}
          <aside className="w-full lg:w-[400px] shrink-0">
            <Card className="sticky top-24 overflow-hidden border-slate-200 bg-white shadow-2xl">
              <div className="relative group">
                <img
                  src={course.thumbnail?.url || "https://via.placeholder.com/600x340"}
                  alt="Preview"
                  className="w-full aspect-video object-cover transition-transform group-hover:scale-105 duration-700"
                />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-100 transition-opacity">
                    <button 
                       onClick={() => setShowPreview(true)}
                       className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 transition-all shadow-2xl"
                    >
                        <Play size={24} className="fill-current ml-1" />
                    </button>
                    <span className="absolute bottom-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Preview Protocol</span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">₹{course.finalPrice}</span>
                  {course.finalPrice !== course.price && (
                    <span className="text-lg text-slate-400 line-through font-medium">₹{course.price}</span>
                  )}
                  <Badge variant="success" className="ml-auto">Best Valuation</Badge>
                </div>

                <div className="space-y-3">
                  <Button size="lg" className="w-full h-14" onClick={() => handleCart(course.finalPrice)}>
                    <ShoppingCart size={18} className="mr-2" />
                    Acquire License
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="w-full h-14" 
                    onClick={() => navigate(`/payment/${user?._id}/${course_id}`)}
                    disabled={isEnrolled || !user}
                  >
                    {isEnrolled ? "License Active" : "Direct Deployment"}
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Node Resources</h4>
                   <ul className="space-y-3">
                      {course.courseIncludes?.map((item, index) => (
                        <li key={index} className="flex gap-3 items-center text-xs font-semibold text-slate-600">
                           <Info size={14} className="text-slate-300" />
                           {item}
                        </li>
                      ))}
                   </ul>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {/* Preview Terminal Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-4xl bg-slate-900 border-white/10 overflow-hidden relative">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
               <h3 className="text-white font-bold text-lg tracking-tight">Preview Terminal: {course.title}</h3>
               <button onClick={() => setShowPreview(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <X size={20} />
               </button>
            </div>
            <div className="aspect-video bg-black">
               <video controls className="w-full h-full" autoPlay>
                  <source src={course.preview?.url} type="video/mp4" />
               </video>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseLandingPage;
