import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
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
  Info,
  Clock,
  Layout,
  Award,
  Terminal,
  ChevronRight
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
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const proRef = useRef(null);

  const formattedDate = course?.updatedAt 
    ? new Date(course.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : "Recently Updated";

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const courseRes = await axios.get(`${courseBaseUrl}/${course_id}`, { withCredentials: true });
        setCourse(courseRes.data.data);

        if (user) {
          const enrollRes = await axios.get(`${enrollmentBaseUrl}/${user._id}/${course_id}`, { withCredentials: true });
          setIsEnrolled(enrollRes.data.data.enrollmentStatus);
        }
      } catch (err) {
        // Silently fail or handle error
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [course_id, user]);

  const handleCart = async () => {
    if (!user) return navigate("/login");
    try {
      const price = course.finalPrice || course.price;
      await axios.post(cartBaseUrl, { userId: user._id, courseId: course_id, price }, { withCredentials: true });
      toast.success("Synchronization successful: Course added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Cart synchronization failed");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Cinematic Header Node */}
      <div className="relative bg-slate-950 text-white pt-32 pb-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="flex flex-wrap gap-2"
               >
                  <Badge variant="primary" className="bg-blue-600/20 border-blue-500/30 text-blue-400">
                    {course?.category}
                  </Badge>
                  <Badge variant="outline" className="border-slate-700 text-slate-400">
                    Industrial Level: {course?.level || "Advance"}
                  </Badge>
               </motion.div>
               
               <motion.h1 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1]"
               >
                 {course?.title}
               </motion.h1>
               
               <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="text-lg md:text-xl text-slate-400 font-medium max-w-3xl leading-relaxed"
               >
                 {course?.subtitle}
               </motion.p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4">
               <div className="flex items-center gap-2 text-xs font-bold">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <User size={14} className="text-blue-400" />
                  </div>
                  <span className="text-slate-400">Led by</span>
                  <button onClick={() => proRef.current?.scrollIntoView({ behavior: "smooth" })} className="text-white hover:text-blue-400 underline transition-colors decoration-slate-700">
                    {course?.instructor?.name}
                  </button>
               </div>
               
               <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Calendar size={14} />
                  <span>Last Sync {formattedDate}</span>
               </div>
               
               <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Globe size={14} />
                  <span>Deployed in {course?.language || "English"}</span>
               </div>

               <div className="flex items-center gap-2">
                  <StarRating rating={course?.averageRating || 0} />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">({course?.reviews?.length || 0} Syncs)</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Hub */}
      <div className="max-w-[1440px] mx-auto px-6 -mt-12 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Detailed Specifications */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Learning Matrix */}
            <Card className="p-8 space-y-8 bg-white border-slate-200">
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <Terminal size={20} className="text-blue-600" />
                  Knowledge Node Matrix
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {course?.whatYouWillLearn?.map((item, index) => (
                    <div key={index} className="flex gap-3 group">
                       <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          <Check size={12} strokeWidth={3} />
                       </div>
                       <p className="text-sm text-slate-600 font-medium leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-slate-100" />

              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <ShieldCheck size={20} className="text-blue-600" />
                  Framework Inclusions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course?.courseIncludes?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-xl border border-slate-50 bg-slate-50/30">
                       <Layout size={18} className="text-slate-400" />
                       <span className="text-sm font-bold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Curriculum Accordion */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Curriculum Topology</h2>
                    <Badge variant="outline" className="font-bold">{course?.sections?.length || 0} Domain Modules</Badge>
                </div>
                <CourseContent />
            </div>

            {/* Comprehensive Detail */}
            <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Technical brief</h2>
                <Card className="p-8">
                    <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                      {course?.description}
                    </p>
                </Card>
            </div>

            <Recommendation />
            <CourseReviews />
            <div ref={proRef} className="pt-12">
               <InstructorProfile />
            </div>
            <AddReview />
          </div>

          {/* Conversion Station Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 h-fit">
            <Card className="overflow-hidden border-slate-200 shadow-2xl shadow-slate-200/50">
               <div className="relative group overflow-hidden h-52">
                   <img 
                      src={course?.thumbnail?.url || "https://via.placeholder.com/600x400"} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setShowPreview(true)}
                        className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform"
                      >
                         <Play size={24} className="ml-1 fill-current" />
                      </button>
                   </div>
                   <div className="absolute top-4 right-4 animate-pulse">
                      <Badge className="bg-rose-600 text-white border-transparent py-1 px-3">Live Protocol</Badge>
                   </div>
               </div>

               <div className="p-6 space-y-8">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Terminal Access</p>
                        <div className="flex items-center gap-3">
                           <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{course?.finalPrice}</span>
                           {course?.price !== course?.finalPrice && (
                             <span className="text-lg font-bold text-slate-300 line-through decoration-rose-500/30">₹{course?.price}</span>
                           )}
                        </div>
                     </div>
                     <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                        <Award size={24} />
                     </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full h-14 rounded-2xl text-base" 
                      onClick={handleCart}
                      disabled={isEnrolled}
                    >
                      {isEnrolled ? "Access Initialized" : "Initialize Synchronization"} 
                      {!isEnrolled && <ShoppingCart size={20} className="ml-2" />}
                    </Button>
                    
                    {!isEnrolled && (
                      <Button 
                        variant="secondary" 
                        className="w-full h-14 rounded-2xl text-base"
                        onClick={() => navigate(`/payment/${user._id}/${course_id}`)}
                      >
                        Execute Deployment
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1 py-1">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Protocol Constraints</p>
                     <p className="text-[11px] text-slate-500 font-bold text-center leading-normal">
                        Full architectural access confirmed. Industrial-grade support dispatched upon initialization.
                     </p>
                  </div>
               </div>
            </Card>

            <AnimatePresence>
               {showPreview && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md"
                  >
                     <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-black w-full max-w-4xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl"
                     >
                        <div className="p-6 flex items-center justify-between border-b border-white/10">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500 flex items-center justify-center text-blue-400">
                                 <Play size={20} />
                              </div>
                              <h3 className="font-black tracking-tight text-white uppercase text-xs tracking-widest">Protocol Simulation</h3>
                           </div>
                           <button 
                             onClick={() => setShowPreview(false)}
                             className="p-2 text-slate-400 hover:text-white transition-colors"
                           >
                              <X size={24} />
                           </button>
                        </div>
                        <div className="aspect-video bg-black flex items-center justify-center">
                           <video controls autoPlay className="w-full h-full object-contain">
                              <source src={course?.preview?.url} type="video/mp4" />
                              Simulation Failure: Browser mismatch.
                           </video>
                        </div>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLandingPage;
