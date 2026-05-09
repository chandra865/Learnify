import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useSelector } from "react-redux";
import { 
  MessageSquare, 
  Quote, 
  Star, 
  Terminal, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  User
} from "lucide-react";
import StarRating from "./StarRating";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { toast } from "react-toastify";
import { reviewBaseUrl } from "../utils/endpoints";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

const Testimonials = () => {
  const courseId = useSelector((state) => state.course.selectedCourse?._id);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!courseId) return;
      try {
        const response = await axios.get(`${reviewBaseUrl}/${courseId}`, { withCredentials: true });
        setReviews(response.data.data);
      } catch (error) {
        toast.error("Social registry sync failure");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [courseId]);

  if (loading) return null;

  return (
    <div className="max-w-7xl mx-auto py-24 space-y-12">
      {/* Social Topology Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-6">
        <div className="space-y-4">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                 <MessageSquare size={16} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Social Topology Node</p>
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
              Testimonials <br />
              <span className="text-slate-400">Intelligence Stream</span>
           </h2>
        </div>
        <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 px-4 py-2">
           {reviews.length} Verified Reviews
        </Badge>
      </div>

      {reviews?.length > 0 ? (
        <div className="px-6 relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation={{
               nextEl: '.swiper-next',
               prevEl: '.swiper-prev',
            }}
            pagination={{ clickable: true, el: '.swiper-pagination' }}
            autoplay={{ delay: 5000 }}
            loop={true}
            className="w-full pb-16"
          >
            {reviews.map(({ _id, userId, rating, comment }) => (
              <SwiperSlide key={_id}>
                <Card className="h-full p-8 border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all group flex flex-col justify-between space-y-8 bg-white">
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 group-hover:text-blue-600 transition-colors">
                            <Quote size={20} />
                         </div>
                         <StarRating rating={rating} />
                      </div>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{comment}"</p>
                   </div>
                   
                   <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative">
                         {userId?.profilePicture?.url ? (
                           <img src={userId.profilePicture.url} alt="Entity Visual" className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <User size={20} />
                           </div>
                         )}
                      </div>
                      <div className="space-y-0.5">
                         <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{userId?.name || "Anonymous Entity"}</h4>
                         <div className="flex items-center gap-2">
                            <ShieldCheck size={10} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Operator</span>
                         </div>
                      </div>
                   </div>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Protocol */}
          <div className="flex items-center justify-center gap-4 mt-8">
             <button className="swiper-prev w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-transparent transition-all cursor-pointer">
                <ChevronLeft size={20} />
             </button>
             <div className="swiper-pagination !static !w-auto flex gap-2" />
             <button className="swiper-next w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-transparent transition-all cursor-pointer">
                <ChevronRight size={20} />
             </button>
          </div>
        </div>
      ) : (
        <Card className="py-24 text-center space-y-6 border-dashed border-slate-200 bg-slate-50/50 mx-6">
           <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-slate-300 shadow-sm">
              <Terminal size={32} />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">No Intelligence Recorded</h3>
              <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto">
                Social topology layer has no active synchronization streams. Node reputation pending.
              </p>
           </div>
        </Card>
      )}
    </div>
  );
};

export default Testimonials;
